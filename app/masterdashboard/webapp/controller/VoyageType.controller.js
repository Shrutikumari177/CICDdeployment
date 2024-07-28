sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    // "nauticalfe/utils/bufferedEventHandler"

  ],
  function (Controller, History, Fragment, MessageToast, MessageBox, bufferedEventHandler) {
    "use strict";
    let aSelectedIds = [];
    // let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    var duplicateKeyEntries = undefined;
    let onEditInput = undefined;
    let onCopyInput = undefined;

    let oView;


    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}

    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.VoyageType", {

      onInit: function () {
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);

      },

     

      onCodeLiveChange: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        if (sValue.length > 4) {
          sValue = sValue.substring(0, 4);
          oInput.setValue(sValue);
          sap.m.MessageToast.show("Maximum length is 4 characters.");
        }
        
        if (/[^a-zA-Z0-9]/.test(sValue)) {
          sValue = sValue.replace(/[^a-zA-Z0-9]/g, '');

          oInput.setValue(sValue);
          sap.m.MessageToast.show("Only Alphanumeric characters are allowed.");
        }

       
      },

   

    onLiveChange: function (oEvent) {
      var oInput = oEvent.getSource();
      var sValue = oInput.getValue();
      var sFilteredValue = sValue.replace(/[^a-zA-Z0-9.\- ]/g, '');
  
      if (sFilteredValue.length !== sValue.length) {
          sap.m.MessageToast.show("Only Alphanumeric characters, Dots (.), Hyphens (-), and Spaces are allowed.");
          oInput.setValue(sFilteredValue);
      }
  
      if (sFilteredValue.length > 30) {
          sFilteredValue = sFilteredValue.substring(0, 30);
          oInput.setValue(sFilteredValue);
          sap.m.MessageToast.show("Maximum length is 30 characters.");
      }
  
      if (sFilteredValue.startsWith('.') || sFilteredValue.startsWith('-')) {
          sFilteredValue = sFilteredValue.replace(/^[.-]+/, ''); 
          sap.m.MessageToast.show("Dots (.) and Hyphens (-) are not allowed as the first character.");
          oInput.setValue(sFilteredValue);
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
        // else if (copyFlag) {
        //   var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
        //   var aItems = oTable.getItems();
        //   let flag = false;
        //   for (let i = 0; i < aItems.length; i++) {
        //     var oCells = aItems[i].getCells();
        //     var oInput = oCells[1]; // Index 1 corresponds to the Input field
        //     var sValue = this.removeExtraSpaces(oInput.getValue());

        //     console.log(onCopyInput[i] + ":" + sValue + ":");
        //     if (onCopyInput[i] !== sValue.trim()) {
        //       flag = true;
        //       break;
        //     }
        //   }

        //   if (flag) {
        //     sap.m.MessageBox.confirm("Do you want to discard the changes?", {
        //       title: "Confirmation",
        //       onClose: function (oAction) {
        //         if (oAction === sap.m.MessageBox.Action.OK) {
        //           // Reset the view to its initial state
        //           this.resetView();
        //         }
        //       }.bind(this) // Ensure access to outer scope
        //     });
        //   } else {
        //     // If no changes have been made, navigate to the initial screen immediately
        //     this.resetView();

        //   }
        // }


        else if (newEntryFlag) {
          let voyCode = this.getView().byId("Code").getValue().trim();
          let voyCodeDesc = this.getView().byId("Desc").getValue().trim();
          if (voyCode == "" && voyCodeDesc == "") {
            oEntryTable.setVisible(false);
            // Clear input fields of the first row
            oEntryTable.getItems()[0].getCells()[0].setValue("");
            oEntryTable.getItems()[0].getCells()[1].setValue("");

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

          var oTable = this.byId("updateTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var oInput = oCells[1]; // Index 1 corresponds to the Input field
            var sValue = oInput.getValue();
            if (onEditInput[i] !== sValue) {
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
        // else if (copyFlag) {
        //   var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
        //   var aItems = oTable.getItems();
        //   let flag = false;
        //   for (let i = 0; i < aItems.length; i++) {
        //     var oCells = aItems[i].getCells();
        //     var oInput = oCells[1]; // Index 1 corresponds to the Input field
        //     var sValue = this.removeExtraSpaces(oInput.getValue());

        //     console.log(onCopyInput[i] + ":" + sValue + ":");
        //     if (onCopyInput[i] !== sValue.trim()) {
        //       flag = true;
        //       break;
        //     }
        //   }

        //   if (flag) {
        //     sap.m.MessageBox.confirm("Do you want to discard the changes?", {
        //       title: "Confirmation",
        //       onClose: function (oAction) {
        //         if (oAction === sap.m.MessageBox.Action.OK) {
        //           // Reset the view to its initial state
        //           oRouter.navTo("RouteHome");
        //             setTimeout(() => {

        //               that.resetView();
        //             }, 1600);
        //         }
        //       }.bind(this) // Ensure access to outer scope
        //     });
        //   } else {
        //     // If no changes have been made, navigate to the initial screen immediately
        //     oRouter.navTo("RouteHome");
        //     setTimeout(() => {

        //       that.resetView();
        //     }, 1600);

        //   }
        // }

        else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
          oRouter.navTo("RouteHome");
          this.byId("createTypeTable").removeSelections();
        }
        else if (newEntryFlag) {
          let voyCode = this.getView().byId("Code").getValue().trim();
          let voyCodeDesc = this.getView().byId("Desc").getValue().trim();
          if (voyCode == "" && voyCodeDesc == "") {

            const oRouter = that.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
            setTimeout(() => {
              oEntryTable.setVisible(false);
              // Clear input fields of the first row
              oEntryTable.getItems()[0].getCells()[0].setValue("");
              oEntryTable.getItems()[0].getCells()[1].setValue("");

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

          var oTable = this.byId("updateTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var oInput = oCells[1]; // Index 1 corresponds to the Input field
            var sValue = oInput.getValue();
            if (onEditInput[i] !== sValue) {
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

          // console.log(oSelectedItem.getBindingContext());

          if (oSelectedItem.getBindingContext()) {

            let cells = oSelectedItem.getCells();
            console.log(cells);

            return [oSelectedItem.getBindingContext().getProperty("Voycd"), oSelectedItem.getBindingContext().getProperty("Voydes")]

          } else {

          }

        });
        console.log(aSelectedIds);
        // console.log("Selected Travel IDs: " + aSelectedTravelIds.join(","));
        return aSelectedIds;

      },

      newEntries: function () {
        newEntryFlag = true;

        let selectedItem = this.byId("createTypeTable").getSelectedItems();
        if (selectedItem.length == 0) {

          this.getView().byId("createTypeTable").setVisible(false);
          this.getView().byId("entryBtn").setEnabled(false);
          this.getView().byId("editBtn").setEnabled(false);
          this.getView().byId("deleteBtn").setEnabled(false);
          this.getView().byId("entryTypeTable").setVisible(true)
          this.getView().byId("mainPageFooter").setVisible(true)

          var oEntryTable = this.getView().byId("entryTypeTable");
          var items = oEntryTable.getItems();
          for (var i = items.length - 1; i > 0; i--) {
            oEntryTable.removeItem(items[i]);
          }

          var firstItemCells = items[0].getCells();
          firstItemCells[0].setValue("");
          firstItemCells[1].setValue("");
        } else {
          MessageToast.show("Unselect the Selected Row !")
        }
      },

      pressEdit: function () {
        // Get reference to the view
        let oView = this.getView();

        // Get the createTypeTable
        let oCreateTable = oView.byId("createTypeTable");
        var oTable = this.byId("createTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        onEditInput = [];
        // Iterating over selected items and printing values
        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var sValue = oBindingContext.getProperty("Voycd");
          var sDescription = oBindingContext.getProperty("Voydes");
          

          
          console.log("desc", sDescription);
          onEditInput.push(sDescription);
        });

       
        // Get all selected items from the createTypeTable
        // let aSelectedItems = oCreateTable.getSelectedItems();

        // Check if any items are not selected
        if (aSelectedItems.length === 0) {
          sap.m.MessageToast.show("Please select at least one row");
          return;
        }

        editFlag = true;


        // Clear the updateTypeTable before adding new items
        let oUpdateTable = oView.byId("updateTypeTable");
        oUpdateTable.removeAllItems();

        // Iterate over selected items to create new items in the updateTypeTable
        aSelectedItems.forEach(function (oSelectedItem) {
          // Get the selected item's binding context
          let oContext = oSelectedItem.getBindingContext();

          // Get the properties from the context
          let sValue = oContext.getProperty("Voycd");
          let sDesc = oContext.getProperty("Voydes");

          // console.log(sValue, sDesc);

          // Add new item to updateTypeTable
          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: sValue }),
              new sap.m.Input({ value: sDesc, editable: true,liveChange:this.onLiveChange.bind(this) })
            ]
          });
          oUpdateTable.addItem(oColumnListItem);
        }.bind(this));

        



        // Show the updateTypeTable
        oUpdateTable.setVisible(true);

        // Hide the createTypeTable
        oCreateTable.setVisible(false);

        // Show the footer for the updateTypeTable
        oView.byId("mainPageFooter2").setVisible(true);

        // Disable other buttons
        oView.byId("deleteBtn").setEnabled(false);
        // oView.byId("copyBtn").setEnabled(false);
        oView.byId("entryBtn").setEnabled(false);
        oView.byId("editBtn").setEnabled(false);

        
      },

      onPatchSent: function (ev) {
        sap.m.MessageToast.show("Updating..")
        this.resetView();
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

          saveObj.setVisible(false);
          cancelObj.setVisible(false);
          inputFieldObj.setEditable(false);

        } else {
          sap.m.MessageToast.show("Fail to Update.")
        }
      },

     
      onAddRow1: function () {
        var oTable = this.byId("entryTypeTable");
        var items = oTable.getItems();
        for (let i = 0; i < items.length; i++) {
            let value1 = items[i].getCells()[0].getValue();
            let value2 = items[i].getCells()[1].getValue();
            if (!value1 || !value2) {
                sap.m.MessageToast.show("Please Enter Both Fields Before Adding A New Row ");
                return;
            }
        }

        var oNewRow = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
                new sap.m.Input({ value: "", editable: true, liveChange: this.onLiveChange.bind(this) })
            ]
        });

        oTable.addItem(oNewRow);
    },
    

   

    onDeleteRow1: function () {
      var oTable = this.byId("entryTypeTable");
      var aSelectedItems = oTable.getSelectedItems();
 
      if (aSelectedItems.length === 0) {
          sap.m.MessageToast.show("Please select an item");
          return;
      }
 
      var oFirstItem = oTable.getItems()[0];
      var aFirstItemCells = oFirstItem.getCells();
      var bFirstItemEmpty = aFirstItemCells.every(function (oCell) {
          return oCell.getValue && oCell.getValue() === "";
      });
 
      if (aSelectedItems.includes(oFirstItem) && bFirstItemEmpty) {
          sap.m.MessageToast.show("The first empty row cannot be deleted.");
          oTable.removeSelections();
          return;
      }
 
      sap.m.MessageBox.confirm("Do you want to delete the selected items?", {
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.YES) {
                  var aItems = oTable.getItems();
                  var bAllSelected = aSelectedItems.length === aItems.length;
 
                  if (bAllSelected) {
                      // If all items are selected
                      aItems.forEach(function (oItem) {
                          if (oItem !== oFirstItem) {
                              oTable.removeItem(oItem);
                          }
                      });
 
                      // Clear the values of the first row
                      aFirstItemCells.forEach(function (oCell) {
                          if (oCell.setValue) {
                              oCell.setValue("");
                          }
                      });
                  } else {
                      // If not all items are selected, delete only selected items
                      aSelectedItems.forEach(function (oSelectedItem) {
                          if (oSelectedItem !== oFirstItem) {
                              oTable.removeItem(oSelectedItem);
                          }
                      });
                  }
 
                  oTable.removeSelections();
              } else {
                  oTable.removeSelections();
              }
          }
      });
    },

      validateAllRows: function () {
        var oTable = this.byId("entryTypeTable");
        var items = oTable.getItems();
    
        for (let i = 0; i < items.length; i++) {
            let value1 = items[i].getCells()[0].getValue();
            let value2 = items[i].getCells()[1].getValue();
            if (!value1 || !value2) {
                sap.m.MessageToast.show("Please enter both fields.");
                return false;
            }
        }
        return true;
      },
    onSave: function () {
      let that = this;
      let oTable = that.byId("entryTypeTable");
      let oTable2 = that.byId("createTypeTable");
  
      if (!this.validateAllRows()) {
          sap.m.MessageToast.show("Please enter both fields.");
          return;
      }
  
      let totalEntries = oTable.getItems().length;
      let entriesProcessed = 0;
      let errors = [];
      let duplicateEntries = [];
      let tempCodesArray = [];
  
      sap.m.MessageToast.show("Creating entries...");
  
      let items = oTable.getItems();
      for (let i = 0; i < items.length; i++) {
          let value1 = items[i].getCells()[0].getValue().toUpperCase();
          let value2 = items[i].getCells()[1].getValue();
  
          if (tempCodesArray.length && tempCodesArray.includes(value1)) {
              duplicateEntries.push(value1);
          } else {
              tempCodesArray.push(value1);
          }
  
          var oBindListSP = that.getView().getModel().bindList("/VoyTypeSet");
          oBindListSP.attachEventOnce("dataReceived", function () {
              var existingEntries = oBindListSP.getContexts().map(function (context) {
                  return context.getProperty("Voycd").toUpperCase();
              });
  
              if (existingEntries.includes(value1)) {
                  duplicateEntries.push(value1);
              }
  
              entriesProcessed++;
              checkCompletion();
          });
  
          oBindListSP.getContexts();
      }
  
      function checkCompletion() {
          if (entriesProcessed === totalEntries) {
              if (errors.length === 0 && duplicateEntries.length === 0) {
                  createEntries();
              } else {
                  var errorMessage = "";
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
  
              var formattedDes = that.formatDes(value2);
  
              var oBindListSP = that.getView().getModel().bindList("/VoyTypeSet");
  
              try {
                  oBindListSP.create({
                      Voycd: value1,
                      Voydes: formattedDes
                  });
                  that.getView().getModel().refresh();
                  that.resetView();
              } catch (error) {
                  sap.m.MessageToast.show("Error while saving data");
              }
          });

          that.resetView();
          oTable.removeSelections();
          
          sap.m.MessageToast.show("All entries saved successfully.");
          let createTable = this.getView.byId("createTypeTable");
          createTable.removeSelections();
      }
    },
 
  


  
  formatDes: function (Voydes) {
      return Voydes.toLowerCase().replace(/\b\w/g, function (char) {
          return char.toUpperCase();
      });
  },
  

      onCancel: function () {
        // checking if edit section
        if (editFlag) {
          this.onCancelEdit();

          // checking if new Entry section
        } else if (newEntryFlag) {
          this.onCancelNewEntry();

          // checking if copy
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
          let code = oCells[0].getValue().trim();
          var oInput = oCells[1]; // Index 1 corresponds to the Input field
          var sValue = oInput.getValue().trim();

          // console.log(onCopyInput[i] + ":" + sValue + ":");
          if (sValue !== "" || code !== "") {
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
          if (onCopyInput[i] !== sValue.trim()) {
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

          // Compare current values with original values
          if (currentUomValue !== originalValue.Uom || currentUomdesValue !== originalValue.Uomdes) {
            return true; // Data has changed
          }
        }

        return false; // Data has not changed
      },

      onUpdate: function () {
        let that = this;
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");

        // Get all items from the updateTypeTable
        let aItems = oUpdateTable.getItems();

        let i = 0;
        let flagNothingtoUpdate = true;
        for (let i = 0; i < aItems.length; i++) {
          let oItem = aItems[i];
          let sDesc = oItem.getCells()[1].getValue();
          console.log("sDesc",sDesc);
          sDesc = this.removeExtraSpaces(sDesc);
          if(sDesc.length>30){
            MessageToast.show("Description length can not exceed thirty characters");
          return;
          }
          if (onEditInput[i].trim() !== sDesc.trim()) {
            flagNothingtoUpdate = false;
            break; 
          }
        }

        if (flagNothingtoUpdate) {
          MessageToast.show("Nothing to update ");
          return;
        }

        // Iterate over the items to update the corresponding item in the createTypeTable
        aItems.forEach(function (oItem) {
          let sValue = oItem.getCells()[0].getText(); // Assuming Value is in the first cell
          let sDesc = oItem.getCells()[1].getValue(); // Assuming Field Description is in the second cell

          var formattedDes = that.formatDes(sDesc);

          // Find the corresponding item in the createTypeTable
          let oCreateItem = oCreateTable.getItems().find(function (oCreateItem) {
            return oCreateItem.getCells()[0].getText() === sValue; // Assuming Value is in the first cell
          });

          
          if (oCreateItem) {
            oCreateItem.getCells()[1].setText(formattedDes.replace(/\s+/g, " ").trim()); // Assuming Field Description is in the second cell
          }
        });

        // Show the createTypeTable
        oCreateTable.setVisible(true).removeSelections();


        oUpdateTable.setVisible(false);



        this.onPatchSent();
        setTimeout(() => {
          this.resetView();
          oUpdateTable.removeAllItems();
          this.onPatchCompleted({ getParameter: () => ({ success: true }) });


        }, 1100);




      },

      removeExtraSpaces: function (sentence) {
        // Split the sentence into words
        let words = sentence.split(/\s+/);

        // Join the words back together with single space between them
        let cleanedSentence = words.join(' ');

        return cleanedSentence;
      },
      onCancelEdit: function () {
        // let classCodeInput = this.getView().byId("CLASSDESC1");

        var oTable = this.byId("updateTypeTable"); // Assuming you have the table reference
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var oInput = oCells[1]; // Index 1 corresponds to the Input field
          var sValue = this.removeExtraSpaces(oInput.getValue());

          console.log(onEditInput[i] + ":" + sValue + ":");
          if (onEditInput[i] !== sValue.trim()) {
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
      },

      resetView: function () {
        // Reset view to initial state
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        editFlag = false;
        // copyFlag = false;
        newEntryFlag = false;
        this.getView().byId("createTypeTable").setVisible(true).removeSelections();
        this.getView().byId("Code1").setText("");
        this.getView().byId("Desc1").setValue("");
        this.getView().byId("Code").setValue("");
        this.getView().byId("Desc").setValue("");
        this.getView().byId("editBtn").setEnabled(true);
        this.getView().byId("deleteBtn").setEnabled(true);
        // this.getView().byId("copyBtn").setEnabled(true);
        this.getView().byId("entryBtn").setEnabled(true);
        this.byId("createTypeTable").setMode("MultiSelect").removeSelections();
      },

      onDeletePress: function () {

        let oTable = this.byId("createTypeTable");
        let aItems = oTable.getSelectedItems();
        if (!aItems.length) {

          MessageToast.show("Please Select at least one row ");
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

        let oTable = this.byId("createTypeTable");
        oTable.removeSelections();


      },

      pressCopy: function () {

        // Reset copyFlag and editFlag



        if (aSelectedIds.length === 0) {
          MessageToast.show("Please select at least one row");
          return
        }
        newEntryFlag = false;
        editFlag = false;

        copyFlag = true;
        let oView = this.getView();

        // Get the createTypeTable
        let oCreateTable = oView.byId("createTypeTable");
        var oTable = this.byId("createTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        onCopyInput = [];
        // Iterating over selected items and printing values
        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var sValue = oBindingContext.getProperty("Voycd");
          var sDescription = oBindingContext.getProperty("Voydes");
          console.log("desc", sDescription);
          onCopyInput.push(sDescription);
        });

        this.getView().byId("deleteBtn").setEnabled(false);
        this.getView().byId("editBtn").setEnabled(false);
        this.getView().byId("entryBtn").setEnabled(false);
        this.getView().byId("createTypeTable").setVisible(false);
        this.getView().byId('entryTypeTable').setVisible(true);
        this.getView().byId("mainPageFooter").setVisible(true);


        let entryTable = this.getView().byId("entryTypeTable");
        entryTable.removeAllItems();
        for (let i = 0; i < aSelectedIds.length; i++) {
          let code = aSelectedIds[i][0];
          let desc = aSelectedIds[i][1];

          let newItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Input({
                value: code, editable: true,
                liveChange: this.onCodeLiveChange.bind(this)
              }),
              new sap.m.Input({
                value: desc, editable: true,
                liveChange: this.onLiveChange.bind(this)
              })
            ]
          });
          entryTable.addItem(newItem);
        }

      },

    });

  });