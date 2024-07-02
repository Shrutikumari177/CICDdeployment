sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/core/routing/History",
        'sap/m/MessageToast',
        "sap/m/MenuItem",
        'sap/ui/model/json/JSONModel',
        "sap/ui/core/library"
    ],
    function(BaseController,Fragment,History,MessageToast,MenuItem,JSONModel,CoreLibrary) {
      "use strict";
 
      return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.VendorDataSyncing", {
        // _oSupplMenuFragment: null,
        _oMenuFragment:null,
        onInit() {
        },
        onPress: function () {
          var oView = this.getView(),
            oButton = oView.byId("button1");
          if (!this._oMenuFragment) {
            this._oMenuFragment = Fragment.load({
              name: "nauticalfe.fragments.MastOptionsDropDown",
                          id: oView.getId(),
              controller: this
            }).then(function(oMenu) {
              oMenu.openBy(oButton);
              this._oMenuFragment = oMenu;
              return this._oMenuFragment;
            }.bind(this));
          } else {
            this._oMenuFragment.openBy(oButton);
          }
        },
        populateInputField: function (inputField, selectedValue) {
          inputField.setValue(selectedValue);
        },
        onExit: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("MastView");
        },
        onBackPress: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteBusinessPartnerDashboard");
          },
          onPressHome: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
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
 
   
    populateInputField: function (inputField, value) {
        // Ensure the input field exists
        if (inputField) {
            // Set the value in the input field
            inputField.setValue(value);
        } else {
            console.error("Input field not found");
        }
    },
   
   
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