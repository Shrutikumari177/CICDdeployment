sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/core/routing/History",
        'sap/m/MessageToast',
        "sap/m/MenuItem",
        'sap/ui/model/json/JSONModel',
        "sap/ui/core/library",
        "sap/ui/model/odata/v4/ODataModel"
    ],
    function(BaseController,Fragment,History,MessageToast,MenuItem,JSONModel,CoreLibrary,ODataModel) {
      "use strict";
      let getModelData = [];
 
      return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.VendorDataSyncing", {
        // _oSupplMenuFragment: null,
        _oMenuFragment:null,
        onInit() {

            // use filter
            let oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, "businessService");
            let oModel3 = this.getOwnerComponent().getModel();
            let oBindList3 = oModel3.bindList("/BusinessPartnerSet");
            
            oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                  getModelData.push(oContext.getObject());
                });
                oModel.setData(getModelData);
                this.getView().getModel("businessService").refresh();
        
            }.bind(this))
           console.log("mydata", getModelData.length, getModelData)

           let oModel1 = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel1, "nautiNewVendModel");
            let oModel2 = this.getOwnerComponent().getModel();
            let oBindList2 = oModel2.bindList("/xNAUTIxnewvend_btp");
            
            oBindList2.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                  getModelData.push(oContext.getObject());
                });
                oModel.setData(getModelData);
                this.getView().getModel("nautiNewVendModel").refresh();
                
        
            }.bind(this))

        },
        
        onExit: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("MastView");
        },
        onBackPress: function() {
            const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBusinessPartner");
          },
          onPressHome: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
          },
        
        
        // create payload from selected entries
        onSelectionSubmit: function () {
            var oTable = this.byId("table");
            var aSelectedContexts = oTable.getSelectedContexts(true);
            var aSelectedItems = aSelectedContexts.map(function (oContext) {
                return oContext.getObject();
            });
        
            if (aSelectedItems.length === 0) {
                MessageToast.show("No items selected.");
                return;
            }
        
            var aPayloads = aSelectedItems.map(function (item) {
                return {
                    Lifnr: item.BusinessPartner,
                    PartnerRole: "", // Blank field
                    Anred: "Testing Entries",
                    Name1: item.Name1 || "Test Customer",
                    Name2: "",
                    Name3: "",
                    Sort1: "",
                    StrSuppl1: "",
                    StrSuppl2: "",
                    HouseNum1: "",
                    Stras: item.Stras || "A-1, Sector-1",
                    Pstlz: item.PostalCodeCityName,
                    Ort01: item.CityName,
                    Land1: item.Country,
                    Regio: "",
                    TimeZone: "",
                    Spras: "",
                    Telf1: "",
                    Telf2: "",
                    Telfx: "",
                    SmtpAddr: "",
                    Erdat: new Date().toISOString(), // Current date in ISO format
                    DateTo: null
                };
            });
        
            console.log(aPayloads);
            // Check and create entries
            this._checkAndCreateEntries(aPayloads);
        },
        

        // create unique entries from payload
        
        _checkAndCreateEntries: function (aPayloads) {
            var oModel = this.getView().getModel("businessService");
            var existingData = oModel.getData();
        
            // Confirm before creating entries
            sap.m.MessageBox.confirm("Do you want to create new entries?", {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        var oModelV4 = this.getOwnerComponent().getModel();
                        var oBindListV4 = oModelV4.bindList("/BusinessPartnerSet");
        
                        aPayloads.forEach(function (oPayload) {
                            var bExists = existingData.some(function (oEntry) {
                                return oEntry.Lifnr === oPayload.Lifnr; // Assuming Lifnr is the unique identifier
                            });
        
                            if (!bExists) {
                                console.log("Creating payload:", oPayload); // Log the complete payload
                                oBindListV4.create(oPayload);
                                oModelV4.refresh();
                                console.log("doneeee");
                                MessageToast.show("Business Partner " + oPayload.Lifnr + " created successfully.");
                            } else {
                                MessageToast.show("Business Partner " + oPayload.Lifnr + " already exists.");
                            }
                        });
                    } else {
                        MessageToast.show("Creation of new entries cancelled.");
                    }
                }.bind(this) // Ensure proper context inside the callback
            });
        },

    
        
        // for navigation dialog box
        onNavigateDetails: function(oEvent) {

            
           
             console.log("i'm pressseddd")

             var oBindingContext = oEvent.getParameter("bindingContext");                         
             // Retrieve the data object for the pressed rowvar 
            let data = oBindingContext.getObject();

            console.log("rowdata", data)
            
            // let data = oSource.getBindingContext("").getObject();
            let tempModel = new sap.ui.model.json.JSONModel();
            tempModel.setData([data]);
            var oView = this.getView();
            if (!this._oDialog1) {
                this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.VendorDataSyncing", this);
                oView.addDependent(this._oDialog1);
       
         
            }
            this._oDialog1.setModel(tempModel,"nautiNewVendModel1")
            this._oDialog1.open();
          },

        oncancell: function () {
            this._oDialog1.close();
          },
    
      
        showVendorNoDialog:function () {
            var oView = this.getView();
            if (!this._oTankInfomate) {
              this._oTankInfomate = sap.ui.xmlfragment(oView.getId(), "nauticalfe.fragments.Supplier", this);
              oView.addDependent(this._oTankInfomate);
            }
            // var oTankModel = new sap.ui.model.json.JSONModel();  
            // this._oTankInfoDialog.setModel(oTankModel);
            this._oTankInfomate.open();
            
                                                     
              },
              onClose: function() {
                if (this._oTankInfomate) {
                    this._oTankInfomate.close();
                }
        },
        
        showVendorNoDialog2: function (oEvent) {
            let oData = oEvent.getSource();
   
            // Create a dialog
            var oDialog = new sap.m.Dialog({
                title: "Select: Vessel Types",
                contentWidth: "60%",
                contentHeight: "60%",
                content: new sap.m.Table({
                    mode: sap.m.ListMode.SingleSelectMaster,
                    columns: [
                        new sap.m.Column({
                            header: new sap.m.Text({ text: "Search Term " }),
                        }),
                        new sap.m.Column({
                            header: new sap.m.Text({ text: "City" }),
                        }),
                        new sap.m.Column({
                          header: new sap.m.Text({ text: "Postal Code" }),
                      }),
                      new sap.m.Column({
                        header: new sap.m.Text({ text: "City" }),
                    }),
                    new sap.m.Column({
                      header: new sap.m.Text({ text: "Name1" }),
                  }),
                 
     
                    ],
                    // Handle selection change in the table
                    selectionChange: function (oEvent) {
                        var oSelectedItem = oEvent.getParameter("listItem");
                        console.log(oSelectedItem);
                    var oSelectedValue = oSelectedItem.getCells()[0].getText();
                    var inputVoyageType = this.getView().byId("searchInput1");
                    this.populateInputField(inputVoyageType, oSelectedValue);
                    oDialog.close();
                }.bind(this),
            }),
            beginButton: new sap.m.Button({
                text: "Ok",
                type: "Reject",
                press: function () {
                    // Make sure to handle the case where the user closes the dialog without making a selection
                    oDialog.close();
                },
            }),
            endButton: new sap.m.Button({
                text: "Cancel",
                type: "Reject",
                press: function () {
                    oDialog.close();
                },
            }),
        });
   
        let oValueHelpTable = oDialog.getContent()[0];
   
        // Replace with your entity set
        oValueHelpTable.bindItems({
            path: "/CURR",
            template: new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({ text: "{NAVOYCUR}" }),
                    new sap.m.Text({ text: "{NAVOYGCURDES}" }),
                ],
            }),
        });
   
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);
   
        // Open the dialog
        oDialog.open();
    },
 
    showVendorNoDialog3: function (oEvent) {
      let oData = oEvent.getSource();
 
      // Create a dialog
      var oDialog = new sap.m.Dialog({
          title: "Select: Country",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
              mode: sap.m.ListMode.SingleSelectMaster,
              columns: [
                new sap.m.Column({
                  header: new sap.m.Text({ text: "Ctr" }),
              }),
                  new sap.m.Column({
                      header: new sap.m.Text({ text: "Name" }),
                  }),
                  new sap.m.Column({
                      header: new sap.m.Text({ text: "Nationality" }),
                  }),
              ],
              // Handle selection change in the table
              selectionChange: function (oEvent) {
                  var oSelectedItem = oEvent.getParameter("listItem");
                  console.log(oSelectedItem);
                  var oSelectedValue = oSelectedItem.getCells()[0].getText();
                  var inputVoyageType = this.getView().byId("CountryInp1");
                  this.populateInputField(inputVoyageType, oSelectedValue);
                  oDialog.close();
              }.bind(this),
          }),
          beginButton: new sap.m.Button({
              text: "Ok",
              type: "Reject",
              press: function () {
                  // Make sure to handle the case where the user closes the dialog without making a selection
                  oDialog.close();
              },
          }),
          endButton: new sap.m.Button({
              text: "Cancel",
              type: "Reject",
              press: function () {
                  oDialog.close();
              },
          }),
      });
 
      let oValueHelpTable = oDialog.getContent()[0];
 
      // Replace with your entity set
      oValueHelpTable.bindItems({
          path: "/CURR",
          template: new sap.m.ColumnListItem({
              cells: [
                  new sap.m.Text({ text: "{NAVOYCUR}" }),
                  new sap.m.Text({ text: "{NAVOYGCURDES}" }),
              ],
          }),
      });
 
      // Bind the dialog to the view
      this.getView().addDependent(oDialog);
 
      // Open the dialog
      oDialog.open();
  },
  showVendorNoDialog4: function (oEvent) {
    let oData = oEvent.getSource();
 
    // Create a dialog
    var oDialog = new sap.m.Dialog({
        title: "Select: Country",
        contentWidth: "60%",
        contentHeight: "60%",
        content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,
            columns: [
                new sap.m.Column({
                    header: new sap.m.Text({ text: "Currency Code" }),
                }),
                new sap.m.Column({
                    header: new sap.m.Text({ text: "Currency Description" }),
                }),
            ],
            // Handle selection change in the table
            selectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                console.log(oSelectedItem);
                var oSelectedValue = oSelectedItem.getCells()[0].getText();
                var inputVoyageType = this.getView().byId("vendor12");
                this.populateInputField(inputVoyageType, oSelectedValue);
                oDialog.close();
            }.bind(this),
        }),
        beginButton: new sap.m.Button({
            text: "Ok",
            type: "Reject",
            press: function () {
                // Make sure to handle the case where the user closes the dialog without making a selection
                oDialog.close();
            },
        }),
        endButton: new sap.m.Button({
            text: "Cancel",
            type: "Reject",
            press: function () {
                oDialog.close();
            },
        }),
    });
 
    let oValueHelpTable = oDialog.getContent()[0];
 
    // Replace with your entity set
    oValueHelpTable.bindItems({
        path: "/CURR",
        template: new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({ text: "{NAVOYCUR}" }),
                new sap.m.Text({ text: "{NAVOYGCURDES}" }),
            ],
        }),
    });
 
    // Bind the dialog to the view
    this.getView().addDependent(oDialog);
 
    // Open the dialog
    oDialog.open();
},
showVendorNoDialog5: function (oEvent) {
  let oData = oEvent.getSource();
 
  // Create a dialog
  var oDialog = new sap.m.Dialog({
      title: "Select: Country",
      contentWidth: "60%",
      contentHeight: "60%",
      content: new sap.m.Table({
          mode: sap.m.ListMode.SingleSelectMaster,
          columns: [
              new sap.m.Column({
                  header: new sap.m.Text({ text: "CoCd" }),
              }),
              new sap.m.Column({
                  header: new sap.m.Text({ text: "Company Name " }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "City " }),
            }),
            new sap.m.Column({
              header: new sap.m.Text({ text: "CrCy " }),
          }),
          ],
          // Handle selection change in the table
          selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              console.log(oSelectedItem);
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId("CoCd1");
              this.populateInputField(inputVoyageType, oSelectedValue);
              oDialog.close();
          }.bind(this),
      }),
      beginButton: new sap.m.Button({
          text: "Ok",
          type: "Reject",
          press: function () {
              // Make sure to handle the case where the user closes the dialog without making a selection
              oDialog.close();
          },
      }),
      endButton: new sap.m.Button({
          text: "Cancel",
          type: "Reject",
          press: function () {
              oDialog.close();
          },
      }),
  });
 
  let oValueHelpTable = oDialog.getContent()[0];
 
  // Replace with your entity set
  oValueHelpTable.bindItems({
      path: "/CURR",
      template: new sap.m.ColumnListItem({
          cells: [
              new sap.m.Text({ text: "{NAVOYCUR}" }),
              new sap.m.Text({ text: "{NAVOYGCURDES}" }),
          ],
      }),
  });
 
  // Bind the dialog to the view
  this.getView().addDependent(oDialog);
 
  // Open the dialog
  oDialog.open();
},
CountryDialogue:function (oEvent) {
  let oData = oEvent.getSource();
 
  // Create a dialog
  var oDialog = new sap.m.Dialog({
      title: "Select: Country",
      contentWidth: "60%",
      contentHeight: "60%",
      content: new sap.m.Table({
          mode: sap.m.ListMode.SingleSelectMaster,
          columns: [
            new sap.m.Column({
              header: new sap.m.Text({ text: "Ctr" }),
          }),
              new sap.m.Column({
                  header: new sap.m.Text({ text: "Name" }),
              }),
              new sap.m.Column({
                  header: new sap.m.Text({ text: "Nationality" }),
              }),
          ],
          // Handle selection change in the table
          selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              console.log(oSelectedItem);
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId("countrybtn1");
              this.populateInputField(inputVoyageType, oSelectedValue);
              oDialog.close();
          }.bind(this),
      }),
      beginButton: new sap.m.Button({
          text: "Ok",
          type: "Reject",
          press: function () {
              // Make sure to handle the case where the user closes the dialog without making a selection
              oDialog.close();
          },
      }),
      endButton: new sap.m.Button({
          text: "Cancel",
          type: "Reject",
          press: function () {
              oDialog.close();
          },
      }),
  });
 
  let oValueHelpTable = oDialog.getContent()[0];
 
  // Replace with your entity set
  oValueHelpTable.bindItems({
      path: "/CURR",
      template: new sap.m.ColumnListItem({
          cells: [
              new sap.m.Text({ text: "{NAVOYCUR}" }),
              new sap.m.Text({ text: "{NAVOYGCURDES}" }),
          ],
      }),
  });
 
  // Bind the dialog to the view
  this.getView().addDependent(oDialog);
 
  // Open the dialog
  oDialog.open();
},
 
   
    // populateInputField: function (inputField, value) {
    //     // Ensure the input field exists
    //     if (inputField) {
    //         // Set the value in the input field
    //         inputField.setValue(value);
    //     } else {
    //         console.error("Input field not found");
    //     }
    // },
   
   
    // Function to populate the input field
    populateInputField: function (inputField, value) {
        // Ensure the input field exists
        if (inputField) {
            // Set the value in the input field
            inputField.setValue(value);
            console.log("Input field value set:", value);
        } else {
            console.error("Input field not found");
        }
    },
   
 
  });
    }
  );