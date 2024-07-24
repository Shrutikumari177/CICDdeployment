
 
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
 
  ],
  function (Controller, History, Fragment, MessageToast, MessageBox, JSONModel,Filter,FilterOperator) {
    "use strict";
    let getModelData = [];
    let aSelectedIds = [];
    let myModel = undefined;
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    let backPressCount = 0;
 
 
 
    let deschanged = [];
    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}
 
    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.CurrencyType", {
 
      onInit: function () {
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/xNAUTIxcury_count");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
        }.bind(this))
        console.log("mydata", getModelData)
 
      },
 
 
      // for more fragment
     
      onBackPress: function () {
        const that = this;
 
        const oRouter = this.getOwnerComponent().getRouter();
        // Check if any items have been selected
        if (aSelectedIds.length === 0 && !newEntryFlag) {
 
          // If no items have been selected, navigate to "RouteMasterDashboard"
          oRouter.navTo("RouteMasterDashboard");
        }
        else if (aSelectedIds.length && !newEntryFlag) {
          oRouter.navTo("RouteMasterDashboard");
          this.byId('createTypeTable').removeSelections();
 
        }
        else if (copyFlag) {
 
          // Get the values from the view
          let voyCode = this.getView().byId("costCode").getValue().trim();
          console.log(voyCode);
          let voyCodeDesc = this.getView().byId("costCodeDesc").getValue().trim();
          let originalVoyCode = aSelectedIds[0][0];
          let originalVoyCodeDesc = aSelectedIds[0][1];
 
          // Check if the values are unchanged
          if (voyCode === originalVoyCode && voyCodeDesc === originalVoyCodeDesc) {
 
            // If no changes have been made, reset the view to its initial state
            this.resetView();
 
          }
          // If changes have been made, prompt the user for confirmation
          else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
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
        else if (newEntryFlag) {
          let voyCode = this.getView().byId("NAVOYCUR2").getValue().trim();
          let voyCodeDesc = this.getView().byId("NAVOYGCURDES2").getValue().trim();
          if (voyCode == "" && voyCodeDesc == "") {
            this.resetView();
 
          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
 
              title: "Confirmation",
              onClose: function (oAction) {
 
                if (oAction === sap.m.MessageBox.Action.OK) {
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
          let desc = aSelectedIds[0][1];
          let originalDesc = inputFieldObj.getValue();
          console.log(originalDesc, originalDesc.trim());
          if (desc === originalDesc) {
 
            that.onCancelPressBtn();
 
            oRouter.navTo("RouteMasterDashboard");
            that.resetView();
          } else {
 
            let oTable = this.byId("createTypeTable");
            let aSelectedItems = oTable.getSelectedItems();
 
            let cells = aSelectedItems[0].getCells();
            let value2 = cells[1].getAggregation('items')[0].getProperty("value").trim();
            sap.m.MessageBox.confirm(
 
              "Do you want to discard the changes?", {
 
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, discard changes and reset view
                  cells[1].getAggregation('items')[0].setProperty("value", aSelectedIds[0][1]);
                  that.getView().getModel().refresh();
                  inputFieldObj.setEditable(false);
                  saveObj.setVisible(false);
                  cancelObj.setVisible(false);
                  that.resetView();
                  oRouter.navTo("RouteMasterDashboard");
 
 
                }
 
              }
            }
            )
          }
 
        }
 
      },
 
 
 
      onPressHome: function () {
        const that = this;
        const oRouter = this.getOwnerComponent().getRouter();
        if (aSelectedIds.length === 0 && !newEntryFlag) {
          // If no items have been selected, navigate to "RouteMasterDashboard"
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
 
        }
        else if (copyFlag) {
          let voyCode = this.getView().byId("costCode").getValue().trim();
          let voyCodeDesc = this.getView().byId("costCodeDesc").getValue().trim();
          let originalVoyCode = aSelectedIds[0][0];
          let originalVoyCodeDesc = aSelectedIds[0][1];
 
          // Check if the values are unchanged
          if (voyCode === originalVoyCode && voyCodeDesc === originalVoyCodeDesc) {
            // If no changes have been made, reset the view to its initial state
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
            oRouter.navTo("RouteHome");
                  setTimeout(()=>{
 
                    that.resetView();
                  },1500);
 
          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, navigate to home screen
                  const oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteHome");
                  oRouter.navTo("RouteHome");
                  setTimeout(()=>{
 
                    that.resetView();
                  },1500);
 
                } else {
                  // If user clicks Cancel, do nothing
                }
              }
            }
            );
          }
 
        }
        else if (aSelectedIds.length && !newEntryFlag && !copyFlag && !editFlag) {
          oRouter.navTo("RouteHome");
          this.byId("createTypeTable").removeSelections();
        }
        else if (newEntryFlag) {
          let voyCode = this.getView().byId("Navoycur2").getValue().trim();
          let voyCodeDesc = this.getView().byId("Navoycur").getValue().trim();
          if (voyCode == "" && voyCodeDesc == "") {
            const oRouter = that.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
            oRouter.navTo("RouteHome");
                  setTimeout(()=>{
 
                    that.resetView();
                  },1500);
 
          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, reset the view to its initial state
                  const oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteHome");
                  oRouter.navTo("RouteHome");
                  setTimeout(()=>{
 
                    that.resetView();
                  },1500);
                } else {
                  // If user clicks Cancel, do nothing
                }
              }
            }
            );
 
          }
 
        } else if (editFlag) {
 
 
          let desc = aSelectedIds[0][1];
          let originalDesc = inputFieldObj.getValue();
          console.log(originalDesc, originalDesc.trim());
          if (desc === originalDesc) {
 
            that.onCancelPressBtn();
 
            oRouter.navTo("RouteHome");
            oRouter.navTo("RouteHome");
            setTimeout(()=>{
 
              that.resetView();
            },1500);
 
          } else {
 
            let oTable = this.byId("createTypeTable");
            let aSelectedItems = oTable.getSelectedItems();
 
            let cells = aSelectedItems[0].getCells();
            let value2 = cells[1].getAggregation('items')[0].getProperty("value").trim();
            sap.m.MessageBox.confirm(
 
              "Do you want to discard the changes?", {
 
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, discard changes and reset view
                  cells[1].getAggregation('items')[0].setProperty("value", aSelectedIds[0][1]);
                  that.getView().getModel().refresh();
                  inputFieldObj.setEditable(false);
                  saveObj.setVisible(false);
                  cancelObj.setVisible(false);
                  oRouter.navTo("RouteHome");
                  oRouter.navTo("RouteHome");
                  setTimeout(()=>{
 
                    that.resetView();
                  },1500);
 
 
                }
 
              }
            }
            )
          }
 
 
 
        }
 
      },
 
      selectedItems: function (oEvent) {
     
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();
 
 
        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {
 
          // console.log(oSelectedItem.getBindingContext());
 
          if (oSelectedItem.getBindingContext()) {
 
            let cells = oSelectedItem.getCells();
            console.log(cells);
 
            return [oSelectedItem.getBindingContext().getProperty("Navoycur"),
             oSelectedItem.getBindingContext().getProperty("Navoygcurdes"),
             oSelectedItem.getBindingContext().getProperty("Navoycountry")
            ]
 
          } else {
 
 
          }
 
        });
 
 
        return aSelectedIds;
 
      },
      newEntries: function () {
        newEntryFlag = true;
 
        let selectedItem = this.byId("createTypeTable").getSelectedItems();
        if (selectedItem.length == 0) {
 
          this.getView().byId("createTypeTable").setVisible(false)
          this.getView().byId("entryTypeTable").setVisible(true)
          this.getView().byId("mainPageFooter").setVisible(true)
          this.getView().byId("entryBtn").setEnabled(false);
          this.getView().byId("deleteBtn").setEnabled(false);
          var oEntryTable = this.getView().byId("entryTypeTable");
        var items = oEntryTable.getItems();
        for (var i = items.length - 1; i > 0; i--) {
          oEntryTable.removeItem(items[i]);
        }
 
        // Clear input fields of the first row
        var firstItemCells = items[0].getCells();
        firstItemCells[0].setValue("");
        firstItemCells[1].setValue("");
        firstItemCells[2].setValue("");
 
 
 
        } else {
          MessageToast.show("Unselect the Selected Row !")
        }
 
 
      },
     
    
      onCreateSent: function (ev) {
        sap.m.MessageToast.show("Creating..")
        // console.log(ev.getParameter("context")?.getObject())
      },
      onCreateCompleted: function (ev) {
        let isSuccess = ev.getParameter('success');
        if (isSuccess) {
          sap.m.MessageToast.show("Successfully Created.")
          copyFlag = false;
 
          this.getView().byId("deleteBtn").setEnabled(true);
 
          this.getView().byId("entryBtn").setEnabled(true);
          this.getView().byId("createTypeTable").setVisible(true).removeSelections();
        } else {
          sap.m.MessageToast.show("Fail to Create.")
          this.getView().byId("deleteBtn").setEnabled(true);
        }
      },
   

      onSave: function () {
        var that = this;
        var oTable = that.byId("entryTypeTable");
        var totalEntries = oTable.getItems().length;
        var entriesProcessed = 0;
        var errors = [];
        let tempCodesArray = [];
        var duplicateEntries = []; // Array to store duplicate entry codes

        sap.m.MessageToast.show("Creating entries...");

        oTable.getItems().forEach(function (row) {
        var value1 = row.getCells()[0].getValue().toUpperCase(); // Convert to lowercase
        var value2 = row.getCells()[1].getValue();
        var value3 = row.getCells()[2].getValue();

          if (tempCodesArray.length && tempCodesArray.includes(value1)) {
            duplicateEntries.push(value1);
        } else {
            tempCodesArray.push(value1);
        }

          if (!value1 || !value2 || !value3) {
            errors.push("Please enter both fields for all rows.");
            entriesProcessed++;
            checkCompletion();
            return;
          }

          var oBindListSP = that.getView().getModel().bindList("/CurTypeSet");
          oBindListSP.attachEventOnce("dataReceived", function () {
            var existingEntries = oBindListSP.getContexts().map(function (context) {
              return context.getProperty("Navoycur"); // Convert to lowercase
            });

            if (existingEntries.includes(value1)) {
              // Store duplicate entry code in the array
              duplicateEntries.push(value1);
            }

            entriesProcessed++;
            checkCompletion();
          });

          oBindListSP.getContexts();
        });

        function checkCompletion() {
          if (entriesProcessed === totalEntries) {
            if (errors.length === 0 && duplicateEntries.length === 0) {
              createEntries();
            } else {
              var errorMessage = "Error:\n";
              if (errors.length > 0) {
                errorMessage += errors.join("\n") + "\n";
              }
              if (duplicateEntries.length > 0) {
                errorMessage += "Duplicate entries found with the same code: " + duplicateEntries.join(", ") + "\n";
              }
              sap.m.MessageToast.show(errorMessage);
            }
          }
        }

        function createEntries() {
          oTable.getItems().forEach(function (row) {
            var value1 = row.getCells()[0].getValue();
            var value2 = row.getCells()[1].getValue();
            var value3 = row.getCells()[2].getValue();

            // Format Uomdes value
            var formattedDes = that.formatDes(value2);

            var oBindListSP = that.getView().getModel().bindList("/CurTypeSet");

            try {
              oBindListSP.create({
                Navoycur: value1,
                Navoygcurdes: formattedDes,
                Navoycountry: value3
              });
              that.getView().getModel().refresh();
              that.resetView();
            } catch (error) {
              sap.m.MessageToast.show("Error while saving data");
            }
          });

          sap.m.MessageToast.show("All entries saved successfully.");
          
        }
      },
      formatDes: function (Navoygcurdes) {
        return Navoygcurdes.toLowerCase().replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        });
      },
      
  
    
      
      handleValueHelpClose: function (oEvent) {
        let oSelectedItem = oEvent.getParameter("selectedItem");
        if (!oSelectedItem) {
            this.oSourceSelected.resetProperty("value");
            this.oSourceSelected.getParent().getCells()[1].resetProperty("value");
            oEvent.getSource().getBinding("items").filter([]);
            return;
        }
    
        // Set the value on the correct input fields
        let oInput11 = this.oSourceSelected;
        let oInput12 = this.oSourceSelected.getParent().getCells()[1];
        let oInput13 = this.oSourceSelected.getParent().getCells()[2];
    
        oInput11.setValue(oSelectedItem.getCells()[0].getText());
        oInput12.setValue(oSelectedItem.getCells()[1].getText());
        oInput13.setValue(oSelectedItem.getCells()[2].getText());
    
        // Clear the filter
        oEvent.getSource().getBinding("items").filter([]);
      },
    

      
      onAddRow1: function () {
        var oTable = this.byId("entryTypeTable");

        var oNewRow = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Input({
              value: "", editable: true,
              showValueHelp: true,
              valueHelpRequest:    this.currencyValueHelp.bind(this),
              valueHelpOnly: true
              
            }),
            new sap.m.Input({
              value: "",
              editable: false
            }),
            new sap.m.Input({
              value: "",
              editable: false
            })


          ]
          
        });
        oTable.addItem(oNewRow);
      },

      
      onDeleteRow1: function () {
        var oTable = this.byId("entryTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        var aItems = oTable.getItems();
    
        if (aItems.length <= 1) {
          sap.m.MessageToast.show("The table must have at least one row.");
          oCreateTypeTable.removeSelections();
          return;
        }
        
        if (aSelectedItems.length === 0) {
            sap.m.MessageToast.show("Please select an item");
            return;
        }
        aSelectedItems.forEach(function (oSelectedItem) {
            oTable.removeItem(oSelectedItem);
        });
    
        oTable.removeSelections();
    },


      
      onSaveCancel: function () {
        this.onBackPress();
        // var that = this.getView();
        // var value1 = that.byId("Navoycur2").getValue();
        // var value2 = that.byId("Navoycur").getValue();
 
        // // Check if there are changes in the input fields
        // if (value1 || value2) {
        //   // If changes are detected, prompt the user
        //   sap.m.MessageBox.confirm(
        //     "Do you want to discard the changes?",
        //     {
        //       onClose: function (oAction) {
        //         if (oAction === MessageBox.Action.OK) {
        //           // If user confirms, discard changes and switch visibility
        //           that.byId("Navoycur2").setValue("");
        //           that.byId("Navoycur").setValue("");
        //           that.byId("createTypeTable").setVisible(true);
        //           that.byId("entryTypeTable").setVisible(false);
        //           that.byId("mainPageFooter").setVisible(false);
        //           var deleteBtn = that.byId("deleteBtn"); // Store reference to delete button
        //           if (deleteBtn) {
        //             deleteBtn.setEnabled(true); // Enable delete button
        //           }
        //           MessageToast.show("Changes discarded.");
        //         }
        //       }
        //     }
        //   );
        // } else {
        //   // If no changes, simply switch visibility and enable delete button
        //   that.byId("createTypeTable").setVisible(true);
        //   that.byId("entryTypeTable").setVisible(false);
        //   that.byId("mainPageFooter").setVisible(false);
        //   var deleteBtn = that.byId("deleteBtn"); // Store reference to delete button
        //   if (deleteBtn) {
        //     deleteBtn.setEnabled(true); // Enable delete button
        //   }
        // }
      },
 
 
 
 
 
 
 
      resetView: function () {
        // this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        // this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        // editFlag = false;
        copyFlag = false;
        newEntryFlag = false;
 
        this.getView().byId("createTypeTable").setVisible(true).removeSelections();
        this.getView().byId("NAVOYCUR1").setText("");
        this.getView().byId("NAVOYGCURDES1").setValue("");
        
        // this.getView().byId("Navoycur2").setValue("");
        // this.getView().byId("Navoycur").setValue("");
        // this.getView().byId("editBtn").setEnabled(true);
        this.getView().byId("deleteBtn").setEnabled(true);
        // this.getView().byId("copyBtn").setEnabled(true);
        this.getView().byId("entryBtn").setEnabled(true);
      },
      onDeletePress: function () {
 
        let aItems = this.byId("createTypeTable").getSelectedItems();
        let oTable = this.byId("createTypeTable")
 
        if (!aItems.length) {
 
          MessageToast.show("Please select atleast one row ");
 
          return;
        }
 
        const that = this;  // creatinh reference for use in Dialog
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure  to delete the selected items?", {
            title: "Confirm ",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                // User confirmed deletion
                that.deleteSelectedItems(aItems);
              } else {
                // User canceled deletion
                sap.m.MessageToast.show("Deletion canceled");
                oTable.removeSelections();
              }
            }
          }
          );
        });
 
      }, // ending fn
 
 
 
      deleteSelectedItems: function (aItems) {
 
        aItems.forEach(function (oItem) {
          const oContext = oItem.getBindingContext();
          oContext.delete().then(function () {
            // Successful deletion
            MessageToast.show("Record deleted sucessfully");
 
            console.log("Succesfully Deleted");
          }).catch(function (oError) {
            // Handle deletion error
            MessageBox.error("Error deleting item: " + oError.message);
          });
        });
      },


      CurSearch12: function(oEvent) {

        var sValue1 = oEvent.getParameter("value");
    
        var oFilter1 = new sap.ui.model.Filter("Waers", sap.ui.model.FilterOperator.Contains, sValue1);
        var oFilter2 = new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, sValue1);
        var oFilter3 = new sap.ui.model.Filter("landx", sap.ui.model.FilterOperator.Contains, sValue1);
        var andFilter = new sap.ui.model.Filter({
          filters: [oFilter1, oFilter2, oFilter3]
        });
    
        oEvent.getSource().getBinding("items").filter([andFilter]);
      },

      CurSearch: function(oEvent) {
 
        var sValue1 = oEvent.getParameter("value");
   
        var oFilter1 = new sap.ui.model.Filter("Waers", sap.ui.model.FilterOperator.Contains, sValue1);
        var oFilter2 = new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, sValue1);
        var oFilter3 = new sap.ui.model.Filter("landx", sap.ui.model.FilterOperator.Contains, sValue1);
        var andFilter = new sap.ui.model.Filter({
          filters: [oFilter1, oFilter2, oFilter3]
        });
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
        oBinding.filter([andFilter]);
 
        oBinding.attachEventOnce("dataReceived", function() {
          var aItems = oBinding.getCurrentContexts();
 
          if (aItems.length === 0) {
              oSelectDialog.setNoDataText("No data found");
          } else {
              oSelectDialog.setNoDataText("Loading");
          }
      });
   
        // oEvent.getSource().getBinding("items").filter([andFilter]);
      },
 
     
 
      currencyValueHelp: function (oEvent) {
       this.oSourceSelected = oEvent.getSource();
        var oView = this.getView();
        if (!this._oCurrency) {
          this._oCurrency = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.CurrencyValueHelp", this);
          oView.addDependent(this._oCurrency);
        }
        this._oCurrency.open();
      },

      
 
     
 
 
 
    });
 
  });