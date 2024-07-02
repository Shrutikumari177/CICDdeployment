sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataMetaModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController, History, MessageToast, JSONModel, MessageBox, ODataMetaModel, Filter, FilterOperator) {
    "use strict";

    let aSelectedIds = [];
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    var duplicateKeyEntries = undefined;
    let onEditInput = undefined;
    let onCopyInput = undefined;
    let myModel = undefined;
    let getModelData = [];
    let SelectedVal;


    let oView;


    // let inputFieldObj = {};
    // let saveObj = {};
    // let cancelObj = {}

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.PortLocMaster", {
     async onInit( )  {

        await  this.loadportdata();


        // let oModel = new sap.ui.model.json.JSONModel();
        // this.getView().setModel(oModel, "dataModel");
        // let oModel3 = this.getOwnerComponent().getModel();
        // let oBindList3 = oModel3.bindList("/xNAUTIxportmascds");
        // oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
        //   aContexts.forEach(function (oContext) {
        //     getModelData.push(oContext.getObject());
        //   });
        //   oModel.setData(getModelData);
        //   this.getView().getModel("dataModel").refresh();
        //   // this.getView().setModel(oModel,"Model");
        // }.bind(this))
        // console.log("mydata", getModelData.length,getModelData)


        // oView = this.getView();
        // oView.byId("createTypeTable").setVisible(true);
        // oView.byId("entryTypeTable").setVisible(false);
        // oView.byId("mainPageFooter").setVisible(false);
        // oView.byId("updateTypeTable").setVisible(false);

        // var oModel = this.getView().getModel("xNAUTIxportmascds");
        // this.getView().setModel(oModel, "xNAUTIxportmascds");



      },
      loadportdata: async function(){
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/xNAUTIxportmascds");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
          this.getView().getModel("dataModel").refresh();
          // this.getView().setModel(oModel,"Model");
        }.bind(this))
        console.log("mydata", getModelData.length,getModelData)

      },


      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("query");
        var oTable = this.byId("createTypeTable");
        var oBinding = oTable.getBinding("items");
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          aFilters.push(new Filter("Countryn", FilterOperator.Contains, sQuery));
        }

        oBinding.filter(aFilters);
      },
      // onIndSelect: function(oEvent) {

      //   var oCheckBox = oEvent.getSource();
      //   var bSelected = oCheckBox.getSelected();
      //   let oContext = oEvent.getSource().getBindingContext().getObject();

      //   console.log(bSelected , oContext);
      // },
        onIndSelect1: async function(oEvent) {
          var oCheckBox = oEvent.getSource();
          var bSelected = oCheckBox.getSelected();

          // Get the view's model assuming it's correctly configured
          var oModel = this.getView().getModel();

          // Define your bindList for xNAUTIxportmascds
          let oBindList = oModel.bindList("/PortmasterSet");

          // Get the binding context of the checkbox
          var oContext = oCheckBox.getBindingContext();
          if (oContext) {
              // Get the existing entity data
              var oEntity = oContext.getObject();

              // Update the 'Ind' property of the entity
              oEntity.Ind = bSelected;

              // Update the model with the modified entity
              try {
                  await oModel.submitChanges(); // Submit the changes to the backend

                  // Handle success
                  console.log("Ind property updated successfully.");
              } catch (oError) {
                  // Handle error
                  console.error("Error updating Ind property:", oError);

                  // Rollback checkbox state if update fails
                  oCheckBox.setSelected(!bSelected);
              }
          }

          // Disable or enable the checkbox based on 'Ind'
          oCheckBox.setEnabled(bSelected);
      },

        onIndSelect: async function (oEvent) {
        
          var oSource = oEvent.getSource();
          var bSelected = oSource.getSelected();
          console.log(bSelected);
          console.log(typeof(bSelected));

          // Convert bSelected to boolean explicitly (in case it's a string or number)
          bSelected = !!bSelected;
          
       
          var oContext = oEvent.getSource().getParent().getBindingContext("dataModel")
          console.log(oContext);
          if (oContext) {
              var sPath = oContext.getPath() + "/Ind";
              let data = oContext.getObject();
              console.log("hii", data);
          
        
              let fCountry = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.EQ, data.Country);
              let fPortc = new sap.ui.model.Filter("Portc", sap.ui.model.FilterOperator.EQ, data.Portc);
      
            
              // Bind to the entity set with the filter
    
      
              // Request the contexts that match the filter
              let that = this;
              // sap.ui.core.BusyIndicator.show(0);
              try {
                let oModel = this.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/xNAUTIxportmascds", undefined, undefined, [fCountry, fPortc]);
      
                await oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                  console.log(aContexts);
                  let filterContext = aContexts.filter((x, i) => x.getProperty('Country') === data.Country && x.getProperty('Portc') === data.Portc)
                  filterContext[0].setProperty("Ind", bSelected);
            
                  sap.m.MessageToast.show("succesfully updated .. " );
                  this.loadportdata();
      
                 
      
      
      
                })
              } catch (error) {
                console.log("Errro in updating status");
              }
      

           }
      },
      // onIndSelect: async function (oEvent) {
      //   var oSource = oEvent.getSource();
      //   var bSelected = oSource.getSelected();
      //   console.log(bSelected);
      //   console.log(typeof(bSelected));
    
      //   // Convert bSelected to boolean explicitly (in case it's a string or number)
      //   bSelected = !!bSelected;
    
      //   var oContext = oSource.getBindingContext();
      //   console.log(oContext);
      //   let data = oContext.getObject();
      //   console.log("hii", data);
      //           },
    
    
    
    

//     onIndSelect: function (oEvent) {
   
//     let bSelected = oEvent.getParameter("selected");
//     console.log("Checkbox selected state:", bSelected);

//     SelectedVal = bSelected ? "X" : "";
//     console.log("Selected value:", SelectedVal);

//     let oBindingContext = oEvent.getSource().getBindingContext();
//     console.log("Binding context path:", oBindingContext.getPath());

    
// }

    
    






















      onSave: function () {
        var oModel = this.getView().getModel();
        oModel.submitChanges();
      },


      onCodeLiveChange: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // Remove any non-alphabetic characters
        var sNewValue = sValue.replace(/[^0-9A-Za-z. ]/g, '');

        // Check if the input value has changed after removing non-alphabetic characters
        if (sNewValue !== sValue) {
          // Update the value of the input to only contain alphabetic characters
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Only Alphanumeric values are allowed.");
        }

        // Check if the length of the value exceeds 10
        if (sNewValue.length > 10) {
          // Truncate the value to keep only the first 10 characters
          sNewValue = sNewValue.substring(0, 10);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 10 Characters.");
        }
      },
      onLiveChange: function (oEvent) {

        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();


        if (/[^0-9]/.test(sValue)) {
          // Remove any non-numeric characters
          sValue = sValue.replace(/[^0-9]/g, '');

          oInput.setValue(sValue);


          sap.m.MessageToast.show("Only numeric characters are allowed.");
        }

        if (sValue.length > 4) {

          sValue = sValue.substring(0, 4);

          oInput.setValue(sValue);

          sap.m.MessageToast.show("Maximum length is 4 characters.");
        }
      },



      onBackPress: function () {
        const that = this;
        var oEntryTable = that.getView().byId("entryTypeTable");
        var oupdateTable = that.getView().byId("updateTypeTable");

        const oRouter = this.getOwnerComponent().getRouter();
        // Check if any items have been selected
        if (aSelectedIds.length === 0 && !newEntryFlag) {

          // If no items have been selected, navigate to "RouteMasterDashboard"
          oRouter.navTo("RouteMasterDashboard");
        }
        else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
          oRouter.navTo("RouteMasterDashboard");
          this.byId('createTypeTable').removeSelections();

        }
        else if (copyFlag) {
          var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var oInput = oCells[1]; // Index 1 corresponds to the Input field
            var sValue = this.removeExtraSpaces(oInput.getValue());

            console.log(onCopyInput[i] + ":" + sValue + ":");
            if (onCopyInput[i] !== sValue) {
              flag = true;
              break;
            }
          }

          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // Reset the view to its initial state
                  this.resetView();
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            this.resetView();

          }
        }


        else if (newEntryFlag) {
          let Country = this.getView().byId("COUNTRY").getValue();
          let Portc = this.getView().byId("PORTC").getValue();
          let Portn = this.getView().byId("PORTN").getValue();
          let Reancho = this.getView().byId("REANCHO").getValue();
          let Latitude = this.getView().byId("LATITUDE").getValue();
          let Longitude = this.getView().byId("LONGITUDE").getValue();
          let Countryn = this.getView().byId("COUNTRYN").getValue();
          let Locid = this.getView().byId("LOCID").getValue();
          let Ind = this.getView().byId("IND").getValue();

          if (Country == "" && Portc == "" && Portn == "" && Reancho == "" && Latitude == "" && Longitude == "" && Country == "" && Countryn == "" && Locid == "" && Ind == "") {
            oEntryTable.setVisible(false);
            // Clear input fields of the first row
            oEntryTable.getItems()[0].getCells()[0].setValue("");
            oEntryTable.getItems()[0].getCells()[1].setValue("");
            oEntryTable.getItems()[0].getCells()[2].setValue("");
            oEntryTable.getItems()[0].getCells()[3].setValue("");
            oEntryTable.getItems()[0].getCells()[4].setValue("");
            oEntryTable.getItems()[0].getCells()[5].setValue("");
            oEntryTable.getItems()[0].getCells()[6].setValue("");
            oEntryTable.getItems()[0].getCells()[7].setValue("");
            oEntryTable.getItems()[0].getCells()[8].setValue("");


            // Remove items except the first row
            var items = oEntryTable.getItems();
            for (var i = items.length - 1; i > 0; i--) {
              oEntryTable.removeItem(items[i]);
            }
            this.resetView();

          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {

              title: "Confirmation",
              onClose: function (oAction) {

                if (oAction === sap.m.MessageBox.Action.OK) {

                  oEntryTable.setVisible(false);
                  // Clear input fields of the first row
                  oEntryTable.getItems()[0].getCells()[0].setValue("");
                  oEntryTable.getItems()[0].getCells()[1].setValue("");
                  oEntryTable.getItems()[0].getCells()[2].setValue("");
                  oEntryTable.getItems()[0].getCells()[3].setValue("");
                  oEntryTable.getItems()[0].getCells()[4].setValue("");
                  oEntryTable.getItems()[0].getCells()[5].setValue("");
                  oEntryTable.getItems()[0].getCells()[6].setValue("");
                  oEntryTable.getItems()[0].getCells()[7].setValue("");
                  oEntryTable.getItems()[0].getCells()[8].setValue("");



                  // Remove items except the first row
                  var items = oEntryTable.getItems();
                  for (var i = items.length - 1; i > 0; i--) {
                    oEntryTable.removeItem(items[i]);
                  }
                  // If user clicks OK, reset the view to its initial state
                  that.resetView();
                } else {
                  // If user clicks Cancel, do nothing
                }
              }
            }
            );

          }
        }

        else if (editFlag) {

          this.onCancelEdit();

          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // Reset the view to its initial state
                  this.resetView();
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            this.resetView();

          }
        }

      },

      onPressHome: function () {
        const that = this;
        var oEntryTable = that.getView().byId("entryTypeTable");
        const oRouter = this.getOwnerComponent().getRouter();
        if (aSelectedIds.length === 0 && !newEntryFlag) {

          // If no items have been selected, navigate to "RouteMasterDashboard"
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");

        }
        else if (copyFlag) {
          var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var oInput = oCells[1]; // Index 1 corresponds to the Input field
            var sValue = this.removeExtraSpaces(oInput.getValue());

            console.log(onCopyInput[i] + ":" + sValue + ":");
            if (onCopyInput[i] !== sValue) {
              flag = true;
              break;
            }
          }

          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // Reset the view to its initial state
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {

                    that.resetView();
                  }, 1600);
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            oRouter.navTo("RouteHome");
            setTimeout(() => {

              that.resetView();
            }, 1600);

          }
        }

        else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
          oRouter.navTo("RouteHome");
          this.byId("createTypeTable").removeSelections();
        }
        else if (newEntryFlag) {
          // let voyCode = this.getView().byId("Code").getValue();
          // let voyCodeDesc = this.getView().byId("Desc").getValue();
          let Country = this.getView().byId("COUNTRY").getValue();
          let Portc = this.getView().byId("PORTC").getValue();
          let Portn = this.getView().byId("PORTN").getValue();
          let Reancho = this.getView().byId("REANCHO").getValue();
          let Latitude = this.getView().byId("LATITUDE").getValue();
          let Longitude = this.getView().byId("LONGITUDE").getValue();
          let Countryn = this.getView().byId("COUNTRYN").getValue();
          let Locid = this.getView().byId("LOCID").getValue();
          let Ind = this.getView().byId("IND").getValue();

          if (Country == "" && Portc == "" && Portn == "" && Reancho == "" && Latitude == "" && Longitude == "" && Country == "" && Countryn == "" && Locid == "" && Ind == "") {

            const oRouter = that.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
            setTimeout(() => {
              oEntryTable.setVisible(false);
              // Clear input fields of the first row
              oEntryTable.getItems()[0].getCells()[0].setValue("");
              oEntryTable.getItems()[0].getCells()[1].setValue("");
              oEntryTable.getItems()[0].getCells()[2].setValue("");
              oEntryTable.getItems()[0].getCells()[3].setValue("");
              oEntryTable.getItems()[0].getCells()[4].setValue("");
              oEntryTable.getItems()[0].getCells()[5].setValue("");
              oEntryTable.getItems()[0].getCells()[6].setValue("");
              oEntryTable.getItems()[0].getCells()[7].setValue("");
              oEntryTable.getItems()[0].getCells()[8].setValue("");


              // Remove items except the first row
              var items = oEntryTable.getItems();
              for (var i = items.length - 1; i > 0; i--) {
                oEntryTable.removeItem(items[i]);
              }
              that.resetView();
            }, 1500);

          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, reset the view to its initial state
                  const oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {
                    oEntryTable.setVisible(false);
                    // Clear input fields of the first row
                    oEntryTable.getItems()[0].getCells()[0].setValue("");
                    oEntryTable.getItems()[0].getCells()[1].setValue("");
                    oEntryTable.getItems()[0].getCells()[2].setValue("");
                    oEntryTable.getItems()[0].getCells()[3].setValue("");
                    oEntryTable.getItems()[0].getCells()[4].setValue("");
                    oEntryTable.getItems()[0].getCells()[5].setValue("");
                    oEntryTable.getItems()[0].getCells()[6].setValue("");
                    oEntryTable.getItems()[0].getCells()[7].setValue("");
                    oEntryTable.getItems()[0].getCells()[8].setValue("");



                    // Remove items except the first row
                    var items = oEntryTable.getItems();
                    for (var i = items.length - 1; i > 0; i--) {
                      oEntryTable.removeItem(items[i]);
                    }
                    that.resetView();
                  }, 1500);
                } else {
                  // If user clicks Cancel, do nothing
                }
              }
            }
            );

          }

        }


        else if (editFlag) {

          this.onCancelEdit();

          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // Reset the view to its initial state
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {

                    that.resetView();
                  }, 1500);
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            oRouter.navTo("RouteHome");
            setTimeout(() => {

              that.resetView();
            }, 1500);

          }
        }

      },




      selectedItems: function (oEvent) {
        // console.log("hello");
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();


        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {
          if (oSelectedItem.getBindingContext()) {
            let cells = oSelectedItem.getCells();
            console.log(cells);

            return [
              oSelectedItem.getBindingContext().getProperty("Country"),
              oSelectedItem.getBindingContext().getProperty("Portc"),
              oSelectedItem.getBindingContext().getProperty("Portn"),
              oSelectedItem.getBindingContext().getProperty("Reancho"),
              oSelectedItem.getBindingContext().getProperty("Latitude"),
              oSelectedItem.getBindingContext().getProperty("Longitude"),
              oSelectedItem.getBindingContext().getProperty("Countryn"),
              oSelectedItem.getBindingContext().getProperty("Locid"),
              oSelectedItem.getBindingContext().getProperty("Ind"),
            ]
          } else {
          }

        });
        console.log(aSelectedIds);
        return aSelectedIds;

      },
      newEntries: function () {
        newEntryFlag = true;

        // copyFlag = false;
        editFlag = false;

        this.byId("createTypeTable").removeSelections();

        var oEntryTable = this.getView().byId("entryTypeTable");
        var items = oEntryTable.getItems();
        for (var i = items.length - 1; i > 0; i--) {
          oEntryTable.removeItem(items[i]);
        }

        var firstItemCells = items[0].getCells();
        firstItemCells[0].setValue("");
        firstItemCells[1].setValue("");
        firstItemCells[2].setValue("");
        firstItemCells[3].setValue("");
        firstItemCells[4].setValue("");
        firstItemCells[5].setValue("");
        firstItemCells[6].setValue("");
        firstItemCells[7].setValue("");
        firstItemCells[8].setValue("");


        this.getView().byId("entryBtn").setEnabled(false);
        this.getView().byId("createTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(true);
        this.getView().byId("mainPageFooter").setVisible(true);
        this.getView().byId("editBtn").setEnabled(false);
        this.getView().byId("deleteBtn").setEnabled(false);
        // this.getView().byId("copyBtn").setEnabled(false);
      },

      pressEdit: function () {
        let that = this;
        let oView = this.getView();

        var oTable = this.byId("createTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length === 0) {
          sap.m.MessageToast.show("Please select at least one row");
          return;
        }
        onEditInput = [];

        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var sCountry = oBindingContext.getProperty("Country");
          var sPortc = oBindingContext.getProperty("Portc");
          var sPortn = oBindingContext.getProperty("Portn");
          var sReancho = oBindingContext.getProperty("Reancho");
          var sLatitude = oBindingContext.getProperty("Latitude");
          var sLongitude = oBindingContext.getProperty("Longitude");
          var sCountryn = oBindingContext.getProperty("Countryn");
          var sLocid = oBindingContext.getProperty("Locid");
          var sInd = oBindingContext.getProperty("Ind");

          console.log(sCountry, sPortc, sPortn, sReancho, sLatitude, sLongitude, sCountryn, sLocid, sInd);

          onEditInput.push([sCountry, sPortc, sPortn, sReancho, sLatitude, sLongitude, sCountryn, sLocid, sInd]);
        });


        editFlag = true;


        let oUpdateTable = oView.byId("updateTypeTable");
        oUpdateTable.removeAllItems();

        aSelectedItems.forEach(function (oSelectedItem) {
          let oContext = oSelectedItem.getBindingContext();

          let sCountry = oContext.getProperty("Country");
          let sPortc = oContext.getProperty("Portc");
          let sPortn = oContext.getProperty("Portn");
          let sReancho = oContext.getProperty("Reancho");
          let sLatitude = oContext.getProperty("Latitude");
          let sLongitude = oContext.getProperty("Longitude");
          let sCountryn = oContext.getProperty("Countryn");
          let sLocid = oContext.getProperty("Locid");
          let sInd = oContext.getProperty("Ind");

          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: sCountry }),
              new sap.m.Text({ text: sPortc }),
              new sap.m.Text({ text: sPortn }),
              new sap.m.Text({ text: sReancho }),
              new sap.m.Text({ text: sLatitude }),
              new sap.m.Text({ text: sLongitude }),
              new sap.m.Text({ text: sCountryn }),
              new sap.m.Text({ text: sLocid }),
              new sap.m.Input({ value: sInd, editable: true })
            ]
          });
          oUpdateTable.addItem(oColumnListItem);
        });
        oTable.setVisible(false);
        oUpdateTable.setVisible(true);

        oView.byId("mainPageFooter2").setVisible(true);

        oView.byId("deleteBtn").setEnabled(false);
        oView.byId("entryBtn").setEnabled(false);
      },

      onPatchSent: function (ev) {

        sap.m.MessageToast.show("Updating..")

      },
      onPatchCompleted: function (ev) {
        let oView = this.getView();
        let isSuccess = ev.getParameter('success');
        if (isSuccess) {

          sap.m.MessageToast.show("Successfully Updated.");

          this.resetView();
          setTimeout(() => {

            oView.getModel().refresh();
          }, 1000);

          // saveObj.setVisible(false);
          // cancelObj.setVisible(false);
          // inputFieldObj.setEditable(false);

        } else {
          sap.m.MessageToast.show("Fail to Update.")
        }
      },

      onUpdate: function () {
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");

        let aItems = oUpdateTable.getItems();

        let flagNothingtoUpdate = true;
        let invalidIndValue = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var sCountry = oCells[0].getText();
          var sPortc = oCells[1].getText();
          var sPortn = oCells[2].getText();
          var sReancho = oCells[3].getText();
          var sLatitude = oCells[4].getText();
          var sLongitude = oCells[5].getText();
          var sCountryn = oCells[6].getText();
          var sLocid = oCells[7].getText();
          var sInd = oCells[8].getValue().trim(); // Trim whitespace for accurate checking

          // Check if "ind" value is not empty or 'X'
          if (sInd !== '' && sInd !== 'X') {
            invalidIndValue = true;
            break;
          }

          let fieldsArr = onEditInput[i];
          if (fieldsArr[2] !== sPortn || fieldsArr[3] !== sReancho || fieldsArr[4] !== sLatitude || fieldsArr[5] !== sLongitude || fieldsArr[6] !== sCountryn || fieldsArr[7] !== sLocid || fieldsArr[8] !== sInd) {
            flagNothingtoUpdate = false;
            break;
          }
        }

        if (invalidIndValue) {
          sap.m.MessageToast.show("Error: 'ind' value must be 'X' or empty");
          return;
        }

        if (flagNothingtoUpdate) {
          sap.m.MessageToast.show("Nothing to update");
          return;
        }

        aItems.forEach(function (oItem) {
          let sCountry = oItem.getCells()[0].getText();
          let sPortc = oItem.getCells()[1].getText();
          let sPortn = oItem.getCells()[2].getText();
          let sReancho = oItem.getCells()[3].getText();
          let sLatitude = oItem.getCells()[4].getText();
          let sLongitude = oItem.getCells()[5].getText();
          let sCountryn = oItem.getCells()[6].getText();
          let sLocid = oItem.getCells()[7].getText();
          let sInd = oItem.getCells()[8].getValue().trim(); // Trim whitespace for accurate checking            

          let oCreateItem = oCreateTable.getItems().find(function (oCreateItem) {
            // Filter based on both "Country" and "Portc" keys
            return oCreateItem.getCells()[0].getText() === sCountry && oCreateItem.getCells()[1].getText() === sPortc;
          });

          if (oCreateItem) {
            // Update the corresponding entry
            oCreateItem.getCells()[0].setText(sCountry);
            oCreateItem.getCells()[1].setText(sPortc);
            oCreateItem.getCells()[2].setText(sPortn);
            oCreateItem.getCells()[3].setText(sReancho);
            oCreateItem.getCells()[4].setText(sLatitude);
            oCreateItem.getCells()[5].setText(sLongitude);
            oCreateItem.getCells()[6].setText(sCountryn);
            oCreateItem.getCells()[7].setText(sLocid);
            oCreateItem.getCells()[8].setText(sInd);
          }
        });

        oCreateTable.setVisible(true).removeSelections();

        oUpdateTable.setVisible(false);

        this.onPatchSent();
        setTimeout(() => {
          this.resetView();
          oUpdateTable.removeAllItems();
          this.onPatchCompleted({ getParameter: () => ({ success: true }) });
        }, 1500);
      },




      onAddRow1: function () {

        var oTable = this.byId("entryTypeTable");

        // Create a new row
        var oNewRow = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({
              value: "", editable: true,
              liveChange: this.onLiveChange.bind(this)
            }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
          ]
        });

        oTable.addItem(oNewRow);
      },
      onDeleteRow1: function () {
        var oTable = this.byId("entryTypeTable");
        var aSelectedItems = oTable.getSelectedItems();

        aSelectedItems.forEach(function (oSelectedItem) {
          oTable.removeItem(oSelectedItem);
        });

        oTable.removeSelections();
      },
      //   onSave: function () {
      //     var that = this;
      //     var oTable = that.byId("entryTypeTable");
      //     var totalEntries = oTable.getItems().length;
      //     var entriesProcessed = 0;
      //     var errors = [];
      //     var duplicateEntries = []; // Array to store duplicate entry codes

      //     sap.m.MessageToast.show("Creating entries...");

      //     oTable.getItems().forEach(function (row) {
      //         var value1 = row.getCells()[0].getValue();
      //         var value2 = row.getCells()[1].getValue();
      //         var value3 = row.getCells()[2].getValue();
      //         var value4 = row.getCells()[3].getValue();
      //         var value5 = row.getCells()[4].getValue();
      //         var value6 = row.getCells()[5].getValue();
      //         var value7 = row.getCells()[6].getValue();
      //         var value8 = row.getCells()[7].getValue();
      //         var value9 = row.getCells()[8].getValue();

      //         // if (!value1 || !value2 || !value3 || !value4 || !value5 || !value6 || !value7 || !value8 || !value9) {
      //         //     if (!errors.includes("Please enter all required fields for all rows.")) {
      //         //         errors.push("Please enter all fields for all rows.");
      //         //     }
      //         //     entriesProcessed++;
      //         //     checkCompletion();
      //         //     return;
      //         // }

      //         var oBindListSP = that.getView().getModel().bindList("/xNAUTIxportmascds");
      //         oBindListSP.attachEventOnce("dataReceived", function () {
      //             var existingEntries = oBindListSP.getContexts().map(function (context) {
      //                 return [context.getProperty("Country"),
      //                  context.getProperty("Portc"),
      //                   context.getProperty("Portn"),
      //                    context.getProperty("Reancho"),
      //                     context.getProperty("Latitude"),
      //                      context.getProperty("Longitude"),
      //                       context.getProperty("Countryn"),
      //                        context.getProperty("Locid"),
      //                         context.getProperty("Ind")];
      //             });

      //             existingEntries.forEach((entry) => {
      //                 if (entry.includes(value1) && entry.includes(value2)) {
      //                     duplicateEntries.push(value1);
      //                 }
      //             });

      //             entriesProcessed++;
      //             checkCompletion();
      //         });

      //         oBindListSP.getContexts();
      //     });

      //     function checkCompletion() {
      //         if (entriesProcessed === totalEntries) {
      //             if (errors.length === 0 && duplicateEntries.length === 0) {
      //                 createEntries();
      //             } else {
      //                 var errorMessage = "Error:\n";
      //                 if (errors.length > 0) {
      //                     errorMessage += errors.join("\n") + "\n";
      //                 }
      //                 if (duplicateEntries.length > 0) {
      //                     errorMessage += "Duplicate entries found with the same code: " + duplicateEntries.join(", ") + "\n";
      //                 }
      //                 sap.m.MessageToast.show(errorMessage);
      //             }
      //         }
      //     }

      //     function createEntries() {
      //         var successStatus = true; // Initialize success status

      //         oTable.getItems().forEach(function (row) {
      //             var value1 = row.getCells()[0].getValue();
      //             var value2 = row.getCells()[1].getValue();
      //             var value3 = row.getCells()[2].getValue();
      //             var value4 = row.getCells()[3].getValue();
      //             var value5 = row.getCells()[4].getValue();
      //             var value6 = row.getCells()[5].getValue();
      //             var value7 = row.getCells()[6].getValue();
      //             var value8 = row.getCells()[7].getValue();
      //             var value9 = row.getCells()[8].getValue();

      //             var oBindListSP = that.getView().getModel().bindList("/xNAUTIxportmascds");
      //             let payload = {
      //                 Country: value1,
      //                 Portc: value2,
      //                 Portn: value3,
      //                 Reancho: value4,
      //                 Latitude: value5,
      //                 Longitude: value6,
      //                 Countryn: value7,
      //                 Locid: value8,
      //                 Ind: value9 // Fixed typo: changed value8 to value9
      //             };

      //             try {
      //                 oBindListSP.create(payload);
      //                 oBindListSP.attachCreateCompleted(function (oEvent) {
      //                     oEvent.getParameter("context").getModel().getMessagesByPath("").forEach(x => {
      //                         console.log(x.message);
      //                         sap.m.MessageToast.show(x.message);
      //                     });
      //                 }, this);
      //                 that.getView().getModel().refresh();
      //                 that.resetView();
      //             } catch (error) {
      //                 successStatus = false; // Update success status in case of error
      //                 sap.m.MessageToast.show("Error while saving data");
      //             }
      //         });

      //         if (successStatus) {
      //             sap.m.MessageToast.show("All entries saved successfully.");
      //         }
      //     }
      // },
      formatUomdes: function (uomdes) {
        return uomdes.toLowerCase().replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        });
      },
      onCancel: function () {
        if (editFlag) {
          this.onCancelEdit();

        } else if (newEntryFlag) {
          this.onCancelNewEntry();

        } else if (copyFlag) {
          this.onCancelCopy();
        }


      },
      onCancelNewEntry: function () {
        var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          let sCountry = oCells[0].getValue();
          var sPortc = oCells[1].getValue();
          var sPortn = oCells[2].getValue();
          var sReancho = oCells[3].getValue();
          var sLatitude = oCells[4].getValue();
          var sLongitude = oCells[5].getValue();
          var sCountryn = oCells[6].getValue();
          var sLocid = oCells[7].getValue();
          var sInd = oCells[8].getValue();

          if (sCountry !== "" || sPortc !== "" || sPortn !== "" || sReancho !== "" || sLatitude !== "" || sLongitude !== "" || sCountryn !== "" || sLocid !== "" || sInd !== "") {
            flag = true;
            break;
          }
        }

        if (flag) {
          sap.m.MessageBox.confirm("Do you want to discard the changes?", {
            title: "Confirmation",
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                this.resetView();
              }
            }.bind(this) // Ensure access to outer scope
          });
        } else {
          this.resetView();


        }
      },
      onCancelCopy: function () {

        var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var oInput = oCells[1]; // Index 1 corresponds to the Input field
          var sValue = this.removeExtraSpaces(oInput.getValue());

          console.log(onCopyInput[i] + ":" + sValue + ":");
          if (onCopyInput[i] !== sValue) {
            flag = true;
            break;
          }
        }

        if (flag) {
          sap.m.MessageBox.confirm("Do you want to discard the changes?", {
            title: "Confirmation",
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                this.resetView();
              }
            }.bind(this) // Ensure access to outer scope
          });
        } else {
          this.resetView();

        }
      },
      isDataChanged: function () {
        var aInputItems = this.getView().byId("entryTypeTable").getItems();

        for (var i = 0; i < aInputItems.length; i++) {
          var oInputItem = aInputItems[i];
          var oUomInput = oInputItem.getCells()[0];
          var oUomdesInput = oInputItem.getCells()[1];

          var originalValue = this._originalValues[i];
          var currentUomValue = oUomInput.getValue();
          var currentUomdesValue = oUomdesInput.getValue();

          if (currentUomValue !== originalValue.Uom || currentUomdesValue !== originalValue.Uomdes) {
            return true; // Data has changed
          }
        }

        return false; // Data has not changed
      },

      removeExtraSpaces: function (sentence) {
        // Split the sentence into words
        let words = sentence.split(/\s+/);

        // Join the words back together with single space between them
        let cleanedSentence = words.join(' ');

        return cleanedSentence;
      },
      onCancelEdit: function () {

        var oTable = this.byId("updateTypeTable"); // Assuming you have the table reference
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var sCountry = oCells[0].getText(); // Index 1 corresponds to the Input field
          var sPortc = oCells[1].getText();
          var sPortn = oCells[2].getText();
          var sReancho = oCells[3].getText();
          var sLatitude = oCells[4].getText();
          var sLongitude = oCells[5].getText();
          var sCountryn = oCells[6].getText();
          var sLocid = oCells[7].getText();
          var sInd = oCells[8].getValue();
          // var sValue = this.removeExtraSpaces(oInput.getValue());


          let fieldsArr = onEditInput[i];
          if (fieldsArr[0] !== sCountry || fieldsArr[1] !== sPortc || fieldsArr[2] !== sPortn || fieldsArr[3] !== sReancho || fieldsArr[4] !== sLatitude || fieldsArr[5] !== sLongitude || fieldsArr[6] !== sCountryn || fieldsArr[7] !== sLocid || fieldsArr[8] !== sInd) {
            flag = true;
            break;
          }
        }

        if (flag) {
          sap.m.MessageBox.confirm("Do you want to discard the changes?", {
            title: "Confirmation",
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                this.resetView();
              }
            }.bind(this) // Ensure access to outer scope
          });
        } else {
          this.resetView();

        }
      },

      resetView: function () {
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        editFlag = false;
        // copyFlag = false;
        newEntryFlag = false;
        this.getView().byId("createTypeTable").setVisible(true).removeSelections();

        this.getView().byId("country").setValue("");
        this.getView().byId("portc").setValue("");
        this.getView().byId("portn").setValue("");
        this.getView().byId("reancho").setValue("");
        this.getView().byId("latitude").setValue("");
        this.getView().byId("longitude").setValue("");
        this.getView().byId("countryn").setValue("");
        this.getView().byId("locid").setValue("");
        this.getView().byId("ind").setValue("");

        this.getView().byId("country1").setValue("");
        this.getView().byId("portc1").setValue("");
        this.getView().byId("portn1").setValue("");
        this.getView().byId("reancho1").setValue("");
        this.getView().byId("latitude1").setValue("");
        this.getView().byId("longitude1").setValue("");
        this.getView().byId("countryn1").setValue("");
        this.getView().byId("locid1").setValue("");
        this.getView().byId("ind1").setValue("");

        this.getView().byId("editBtn").setEnabled(true);
        this.getView().byId("deleteBtn").setEnabled(true);
        // this.getView().byId("copyBtn").setEnabled(true);
        this.getView().byId("entryBtn").setEnabled(true);
        this.byId("createTypeTable").setMode("MultiSelect");
      },
      onDeletePress: function () {

        let oTable = this.byId("createTypeTable");
        let aItems = oTable.getSelectedItems();
        if (!aItems.length) {

          MessageToast.show("Please Select  Items ");
          return;
        }

        const that = this;  // creatinh reference for use in Dialog
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure ,you want  to delete ?", {

            title: "Confirm ",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {

                that.deleteSelectedItems(aItems);
              } else {

                oTable.removeSelections();
                sap.m.MessageToast.show("Deletion canceled");

              }
            }
          }
          );
        });

      },
     
      deleteSelectedItems: function (aItems) {
        let slength = aItems.length;
        let deleteMsg = slength === 1 ? "Record" : "Records"
        aItems.forEach(function (oItem) {
          const oContext = oItem.getBindingContext();
          oContext.delete().then(function () {
            // Successful deletion
            MessageToast.show(`${deleteMsg} deleted sucessfully`);

            console.log("Succesfully Deleted");
            aSelectedIds = []
          }).catch(function (oError) {
            // Handle deletion error
            MessageBox.error("Error deleting item: " + oError.message);
          });
        });
      },


    });

  });
