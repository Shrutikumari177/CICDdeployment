sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    //"nauticalfe/utils/bufferedEventHandler"

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

    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.CostMaster", {

      onInit: function () {
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);
        // this.initSearchField();

      },
      
      onCodeLiveChange1: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        if (sValue.length > 30) {
          sValue = sValue.substring(0, 30);
          oInput.setValue(sValue);
          sap.m.MessageToast.show("Maximum length is 30 characters.");
        }
        
        if (/[^a-zA-Z0-9]/.test(sValue)) {
          sValue = sValue.replace(/[^a-zA-Z0-9]/g, '');

          oInput.setValue(sValue);
          sap.m.MessageToast.show("Only Alphanumeric characters are allowed.");
        }

       
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
 
        if (sValue.length > 30) {
            sValue = sValue.substring(0, 30);
            oInput.setValue(sValue);
            sap.m.MessageToast.show("Maximum length is 30 characters.");
            return;
        }
 
        var sFilteredValue = sValue.replace(/[^a-zA-Z0-9.\- ]/g, '');
       
        if (sFilteredValue.length !== sValue.length) {
            sap.m.MessageToast.show("Only Alphanumeric characters, Dots (.), Hyphens (-), and Spaces are allowed.");
            sValue = sFilteredValue;
        }
        if (sFilteredValue.startsWith('.') || sFilteredValue.startsWith('-')) {
            sFilteredValue = sFilteredValue.replace(/^[.-]+/, '');
            sap.m.MessageToast.show("Dots (.) and Hyphens (-) are not allowed as the first character.");
            sValue = sFilteredValue;
        }
 
        oInput.setValue(sFilteredValue);
   
        if (sFilteredValue.length > 30) {
            sFilteredValue = sFilteredValue.substring(0, 30);
            oInput.setValue(sFilteredValue);
            sap.m.MessageToast.show("Maximum length is 30 characters.");
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
          let profileCode = this.getView().byId("Profile").getValue().trim();
          let voyCode = this.getView().byId("Code").getValue().trim();
          let voyCodeDesc = this.getView().byId("Desc").getValue().trim();
          if (profileCode == "" && voyCode == "" && voyCodeDesc == "") {
            oEntryTable.setVisible(false);
            // Clear input fields of the first row
            oEntryTable.getItems()[0].getCells()[0].setValue("");
            oEntryTable.getItems()[0].getCells()[1].setValue("");
            oEntryTable.getItems()[0].getCells()[2].setValue("");

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
            var oInput = oCells[2]; // Index 1 corresponds to the Input field
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

            return [oSelectedItem.getBindingContext().getProperty("Costprofid"),
            oSelectedItem.getBindingContext().getProperty("Costcode"),
             oSelectedItem.getBindingContext().getProperty("Cstcodes")]

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
 
          this.getView().byId("createTypeTable").setVisible(false)
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
        firstItemCells[2].setValue("");
        } else {
          MessageToast.show("Unselect the Selected Row !")
        }
      },
      pressEdit: function () {
        // Get reference to the view
        let oView = this.getView();
        let that = this

        // Get the createTypeTable
        let oCreateTable = oView.byId("createTypeTable");
        var oTable = this.byId("createTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        onEditInput = [];
        // Iterating over selected items and printing values
        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var sProfile = oBindingContext.getProperty("Costprofid");
          var sValue = oBindingContext.getProperty("Costcode");
          var sDescription = oBindingContext.getProperty("Cstcodes");
          console.log("desc", sDescription);
          onEditInput.push(sDescription);
        });
        if (aSelectedItems.length === 0) {
          sap.m.MessageToast.show("Please select at least one row");
          return;
        }

        editFlag = true;

        let oUpdateTable = oView.byId("updateTypeTable");
        oUpdateTable.removeAllItems();

        aSelectedItems.forEach(function (oSelectedItem) {
          let oContext = oSelectedItem.getBindingContext();
          let sProfile = oContext.getProperty("Costprofid");
          let sValue = oContext.getProperty("Costcode");
          let sDesc = oContext.getProperty("Cstcodes");

          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: sProfile }),
              new sap.m.Text({ text: sValue }),
              new sap.m.Input({ value: sDesc, editable: true ,liveChange: that.onLiveChange.bind(that)})
            ]
          });
          oUpdateTable.addItem(oColumnListItem);
        });

        oUpdateTable.setVisible(true);
        oCreateTable.setVisible(false);

        oView.byId("mainPageFooter2").setVisible(true);
        oView.byId("deleteBtn").setEnabled(false);
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
            let value3 = items[i].getCells()[2].getValue();
            if (!value1 || !value2 || !value3) {
                sap.m.MessageToast.show("Please enter the field before adding a new row ");
                return;
            }
        }

        var oNewRow = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Input({ value: "" }),
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
  
      // If the first row is empty and selected, prevent its deletion
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
                          oTable.removeItem(oSelectedItem);
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
          let value3 = items[i].getCells()[2].getValue();
          if (!value1 || !value2 || !value3) {
              sap.m.MessageToast.show("Please enter the fields for all rows.");
              return false;
          }
      }
      return true;
    },
    
    onSave: function () {
        var that = this;
        var oTable = that.byId("entryTypeTable");
    
        if (!this.validateAllRows()) {
            sap.m.MessageToast.show("Please enter the fields for all rows.");
            return;
        }
    
        var totalEntries = oTable.getItems().length;
        var entriesProcessed = 0;
        var errors = [];
        var duplicateEntries = [];
    
    
        var items = oTable.getItems();
        for (var i = 0; i < items.length; i++) {
            var value1 = items[i].getCells()[0].getValue().toUpperCase(); // Cost Profile Id
            var value2 = items[i].getCells()[1].getValue().toUpperCase(); // Cost Code
            var value3 = items[i].getCells()[2].getValue(); // Cost Description
    
            if (!value1 || !value2 || !value3) {
                errors.push("Please fill in all fields for row " + (i + 1) + ".");
                entriesProcessed++;
                checkCompletion();
                return;
            }
        }
        var oBindListSP = that.getView().getModel().bindList("/costProfileSet");
        oBindListSP.attachEventOnce("dataReceived", function () {
            var existingEntries = oBindListSP.getContexts().map(function (context) {
                return {
                    Costprofid: context.getProperty("Costprofid").toUpperCase(),
                    Costcode: context.getProperty("Costcode").toUpperCase()
                };
            });

            items.forEach(function (item, index) {
                var newValue1 = item.getCells()[0].getValue().toUpperCase(); // Cost Profile Id
                var newValue2 = item.getCells()[1].getValue().toUpperCase(); // Cost Code
    
                var duplicateInBackend = existingEntries.some(function (entry) {
                    return entry.Costprofid === newValue1 && entry.Costcode === newValue2;
                });
    
                if (duplicateInBackend) {
                    duplicateEntries.push("Row " + (index + 1) + " (Cost Profile Id: " + newValue1 + ", Cost Code: " + newValue2 + ")");
                }
            });
    
            entriesProcessed = totalEntries;
            checkCompletion();
        });
        oBindListSP.getContexts();
    
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
                        errorMessage += "Duplicate entries found with the same: \n" + duplicateEntries.join("\n");
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
    
                // Format the description
                var formattedDes = that.formatDes(value3);
    
                var oBindListSP = that.getView().getModel().bindList("/costProfileSet");
    
                try {
                    oBindListSP.create({
                        Costprofid: value1,
                        Costcode: value2,
                        Cstcodes: formattedDes
                    });
                    that.getView().getModel().refresh();
                } catch (error) {
                    sap.m.MessageToast.show("Error while saving data.");
                }
            });
    
            that.resetView();
            oTable.removeSelections();
            sap.m.MessageToast.show("Creating entries...");
            setTimeout(() => {
              sap.m.MessageToast.show("All entries saved successfully.");
          }, 1500);
            
        }
    },
    
  
      // Function to format Uomdes
      formatDes: function (Cstcodes) {
        return Cstcodes.toLowerCase().replace(/\b\w/g, function (char) {
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
        var oTable = this.byId("entryTypeTable");
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          let profile = oCells[0].getValue().trim();
          let code = oCells[1].getValue().trim();
          var oInput = oCells[2];
          var sValue = oInput.getValue().trim();

          // console.log(onCopyInput[i] + ":" + sValue + ":");
          if (profile !== ""|| sValue !== "" || code !== "") {
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
            }.bind(this)
          });
        } else {
          this.resetView();

        }
      },

      onCancelCopy: function () {

        var oTable = this.byId("entryTypeTable");
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var oInput = oCells[1];
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
                this.resetView();
              }
            }.bind(this)
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
            return true; 
          }
        }

        return false;
      },

      onUpdate: function () {

        let that = this;
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");
    
        let aItems = oUpdateTable.getItems();
        let flagNothingToUpdate = true;
  
        for (let i = 0; i < aItems.length; i++) {
            let oItem = aItems[i];
            let sDesc = oItem.getCells()[2].getValue();
            if (onEditInput[i].trim().toLowerCase() !== sDesc.trim().toLowerCase()) {
              flagNothingToUpdate = false;
            break;
          }
        }
    
        if (flagNothingToUpdate === true) {
            MessageToast.show("Nothing to Update");
            return;
        }

        aItems.forEach(function (oItem) {
            let sProfile = oItem.getCells()[0].getText();
            let sValue = oItem.getCells()[1].getText();
            let sDesc = oItem.getCells()[2].getValue();
            let formattedDes = that.formatDes(sDesc);
    
            console.log("Updating:", sProfile, sValue, formattedDes);
    
            let oCreateItem = oCreateTable.getItems().find(function (oCreateItem) {
                return oCreateItem.getCells()[0].getText() === sProfile &&
                       oCreateItem.getCells()[1].getText() === sValue;
            });
    
            if (oCreateItem) {
                oCreateItem.getCells()[2].setText(formattedDes.replace(/\s+/g, " ").trim());
            }
    
        });
  
        oCreateTable.setVisible(true).removeSelections();
        oUpdateTable.setVisible(false);
    
        this.onPatchSent();
        setTimeout(() => {
            this.resetView();
            this.onPatchCompleted({ getParameter: () => ({ success: true }) });
        }, 1500);
    },
    

      removeExtraSpaces: function (sentence) {
        let words = sentence.split(/\s+/);
        let cleanedSentence = words.join(' ');
        return cleanedSentence;
      },

      onCancelEdit: function () {
        var oTable = this.byId("updateTypeTable");
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var oInput = oCells[2];
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
                  this.resetView();
                }
              }.bind(this)
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
        this.byId("createTypeTable").setMode("MultiSelect");
      },

      onDeletePress: function () {

        let oTable = this.byId("createTypeTable");
        let aItems = oTable.getSelectedItems();
        if (!aItems.length) {

          MessageToast.show("Please Select at least one row ");
          return;
        }

        const that = this;
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
            if(oError.error.message.includes('Code exists in voyage, do not delete')){
              sap.m.MessageBox.error("Cost Code already used in voyage, Can't be deleted")
            }else{
              sap.m.MessageBox.error( oError.message);
            }
          });
        });

        let oTable = this.byId("createTypeTable");
        oTable.removeSelections();

      },

      pressCopy: function () {
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
        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var sValue = oBindingContext.getProperty("Costcode");
          var sDescription = oBindingContext.getProperty("Cstcodes");
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