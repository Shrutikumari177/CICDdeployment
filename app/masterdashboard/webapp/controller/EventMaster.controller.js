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

    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.EventMaster", {

      onInit: function () {
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);
        // this.initSearchField();

      },
      
      onChange: function () {
        debugger;
      },
      // initSearchField: function () {
      //   var searchField = this.byId('Code');
      //   bufferedEventHandler.bufferEvents(
      //     // event provider
      //     searchField,
      //     // timeInterval
      //     1000,
      //     // eventId
      //     'liveChange',
      //     // data
      //     null,
      //     // handler
      //     this.onCodeLiveChange,
      //     // listener
      //     this,
      //     // progressHandler
      //     null,
      //     // progressUpdateInterval
      //     null
      //   );
      // },

      onCodeLiveChange: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();
        
        // Get the current value of the input
        var sValue = oInput.getValue();
        
        // Check if the value contains any non-alphanumeric characters
        if (/[^a-zA-Z0-9]/.test(sValue)) {
            // Remove any non-alphanumeric characters
            sValue = sValue.replace(/[^a-zA-Z0-9]/g, '');
            
            // Update the value of the input
            oInput.setValue(sValue);
            
            // Show a message to the user
            sap.m.MessageToast.show("Only alphanumeric characters are allowed.");
        }
        
        // Check if the length of the value exceeds 4
        if (sValue.length > 4) {
            // Truncate the value to keep only the first 4 characters
            sValue = sValue.substring(0, 4);
        
            // Update the value of the input
            oInput.setValue(sValue);
        
            // Show a message to the user
            sap.m.MessageToast.show("Maximum length is 4 characters.");
        }
      },

      onLiveChange: function(oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
  
        if (sValue.length > 30) {
            sValue = sValue.substring(0, 30);
            oInput.setValue(sValue);
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

            return [oSelectedItem.getBindingContext().getProperty("Evtty"), oSelectedItem.getBindingContext().getProperty("Text")]

          } else {

          }

        });
        console.log(aSelectedIds);
        // console.log("Selected Travel IDs: " + aSelectedTravelIds.join(","));
        return aSelectedIds;

      },


      newEntries: function () {
        newEntryFlag = true;

        // Reset copyFlag and editFlag
        // copyFlag = false;
        editFlag = false;

        // Clear selected items if any
        this.byId("createTypeTable").removeSelections();

        // Reset input fields and remove additional rows
        var oEntryTable = this.getView().byId("entryTypeTable");
        var items = oEntryTable.getItems();
        for (var i = items.length - 1; i > 0; i--) {
          oEntryTable.removeItem(items[i]);
        }

        // Clear input fields of the first row
        var firstItemCells = items[0].getCells();
        firstItemCells[0].setValue("");
        firstItemCells[1].setValue("");

        // Show entry table and hide create table
        this.getView().byId("entryBtn").setEnabled(false);
        this.getView().byId("createTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(true);
        this.getView().byId("mainPageFooter").setVisible(true);
        this.getView().byId("editBtn").setEnabled(false);
        this.getView().byId("deleteBtn").setEnabled(false);
        // this.getView().byId("copyBtn").setEnabled(false);
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
          var sValue = oBindingContext.getProperty("Evtty");
          var sDescription = oBindingContext.getProperty("Text");
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
          let sValue = oContext.getProperty("Evtty");
          let sDesc = oContext.getProperty("Text");

          // console.log(sValue, sDesc);

          // Add new item to updateTypeTable
          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: sValue }),
              new sap.m.Input({ value: sDesc, editable: true })
            ]
          });
          oUpdateTable.addItem(oColumnListItem);
        });



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

          saveObj.setVisible(false);
          cancelObj.setVisible(false);
          inputFieldObj.setEditable(false);

        } else {
          sap.m.MessageToast.show("Fail to Update.")
        }
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
            })
          ]
        });

        // Add the new row to the table
        oTable.addItem(oNewRow);
      },

      onDeleteRow1: function () {
        var oTable = this.byId("entryTypeTable");
        var aSelectedItems = oTable.getSelectedItems();

        // Remove selected rows
        aSelectedItems.forEach(function (oSelectedItem) {
          oTable.removeItem(oSelectedItem);
        });

        // Clear selection after deletion
        oTable.removeSelections();
      },
      onSave: function () {
      var that = this;
      var oTable = that.byId("entryTypeTable");
      var totalEntries = oTable.getItems().length;
      var entriesProcessed = 0;
      var errors = [];
      var duplicateEntries = []; // Array to store duplicate entry codes
  
      sap.m.MessageToast.show("Creating entries...");
  
      oTable.getItems().forEach(function (row) {
          var value1 = row.getCells()[0].getValue().toUpperCase(); // Convert to lowercase
          var value2 = row.getCells()[1].getValue();
  
          if (!value1 || !value2) {
              errors.push("Please enter both fields for all rows.");
              entriesProcessed++;
              checkCompletion();
              return;
          }
  
          var oBindListSP = that.getView().getModel().bindList("/EventMasterSet");
          oBindListSP.attachEventOnce("dataReceived", function () {
              var existingEntries = oBindListSP.getContexts().map(function (context) {
                  return context.getProperty("Evtty").toUpperCase(); // Convert to lowercase
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
                  var errorMessage = "Errors occurred while saving entries:\n";
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
  
              // Format Uomdes value
              var formattedUomdes = that.formatUomdes(value2);
  
              var oBindListSP = that.getView().getModel().bindList("/EventMasterSet");
  
              try {
                  oBindListSP.create({
                      Evtty: value1,
                      Text: formattedUomdes
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
  
      // Function to format Uomdes
      formatUomdes: function (Text) {
        return Text.toLowerCase().replace(/\b\w/g, function (char) {
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
          sDesc = this.removeExtraSpaces(sDesc);
          if (onEditInput[i].trim() !== sDesc.trim()) {
            flagNothingtoUpdate = false;
            break; // Break the loop when condition is met
          }
        }

        if (flagNothingtoUpdate) {
          MessageToast.show("nothing to update ");
          return;
        }

        // Iterate over the items to update the corresponding item in the createTypeTable
        aItems.forEach(function (oItem) {
          let sValue = oItem.getCells()[0].getText(); // Assuming Value is in the first cell
          let sDesc = oItem.getCells()[1].getValue(); // Assuming Field Description is in the second cell



          // Find the corresponding item in the createTypeTable
          let oCreateItem = oCreateTable.getItems().find(function (oCreateItem) {
            return oCreateItem.getCells()[0].getText() === sValue; // Assuming Value is in the first cell
          });

          // Update the corresponding item in the createTypeTable
          if (oCreateItem) {
            oCreateItem.getCells()[1].setText(sDesc.replace(/\s+/g, " ").trim()); // Assuming Field Description is in the second cell
          }
        });

        // Show the createTypeTable
        oCreateTable.setVisible(true).removeSelections();

        // let oModel = this.getView().getModel();
        // oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

        // let oBindList = oModel.bindList("/ClassMasterSet", {
        //   $$updateGroupId: "update"
        // });


        // oBindList.attachPatchSent(this.onPatchSent, this);
        // oBindList.attachPatchCompleted(this.onPatchCompleted, this);

        // Hide the updateTypeTable
        oUpdateTable.setVisible(false);

        // Hide the footer for the updateTypeTable
        // oView.byId("mainPageFooter2").setVisible(false);

        // Enable other buttons
        // oView.byId("deleteBtn").setEnabled(true);
        // oView.byId("copyBtn").setEnabled(true);
        // oView.byId("entryBtn").setEnabled(true);

        // Clear the updateTypeTable after updating the createTypeTable

        this.onPatchSent();
        setTimeout(() => {
          this.resetView();
          oUpdateTable.removeAllItems();
          this.onPatchCompleted({ getParameter: () => ({ success: true }) });


        }, 1500);



        // oModel.submitBatch("update");
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
          var sValue = oBindingContext.getProperty("Evtty");
          var sDescription = oBindingContext.getProperty("Text");
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