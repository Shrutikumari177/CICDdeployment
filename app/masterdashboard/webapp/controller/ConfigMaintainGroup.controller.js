sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "nauticalfe/utils/bufferedEventHandler"


  ],
  function (Controller, History, Fragment, MessageToast, MessageBox,bufferedEventHandler) {
    "use strict";

    let aSelectedIds = [];
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    var duplicateKeyEntries = undefined;
    let onEditInput = undefined;
    let onCopyInput = undefined;

    let oView;


    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}


    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.ConfigMaintainGroup", {

      onInit: function () {

        oView = this.getView();
        oView.byId("createTypeTable").setVisible(true);
        oView.byId("entryTypeTable").setVisible(false);
        oView.byId("mainPageFooter").setVisible(false);
        oView.byId("updateTypeTable").setVisible(false);


      },
      onChange: function () {
        debugger;
      },
      initSearchField: function () {
        var searchField = this.byId('maintaingrpCode');
        bufferedEventHandler.bufferEvents(
          // event provider
          searchField,
          // timeInterval
          1000,
          // eventId
          'liveChange',
          // data
          null,
          // handler
          this.onCodeLiveChange,
          // listener
          this,
          // progressHandler
          null,
          // progressUpdateInterval
          null
        );
      },
      onCodeLiveChange: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();
        
        // Get the current value of the input
        var sValue = oInput.getValue();
        
        // Remove any characters that are not alphanumeric or dots
        var sNewValue = sValue.replace(/[^a-zA-Z0-9.]/g, ''); 
        
        // Check if the value has changed after removing non-alphanumeric characters
        if (sNewValue !== sValue) {
            // Update the value of the input
            oInput.setValue(sNewValue);
        
            // Show a message to the user
            sap.m.MessageToast.show("Only alphanumeric characters and dots are allowed.");
        }
        
        // Check if the length of the value exceeds 15
        if (sNewValue.length > 15) {
            // Truncate the value to keep only the first 15 characters
            sNewValue = sNewValue.substring(0, 15);
        
            // Update the value of the input
            oInput.setValue(sNewValue);
        
            // Show a message to the user
            sap.m.MessageToast.show("Maximum length is 15 characters.");
        }
    
        // Check if the first character is a dot
        if (sNewValue.charAt(0) === '.') {
            // Remove the first character
            sNewValue = sNewValue.substring(1);
            
            // Update the value of the input
            oInput.setValue(sNewValue);
            
            // Show a message to the user
            sap.m.MessageToast.show("Dot is not allowed as the first character.");
        }
    
        // Check for consecutive dots
        if (sNewValue.includes('..')) {
            // Replace consecutive dots with a single dot
            sNewValue = sNewValue.replace(/\.+/g, '.');
            
            // Update the value of the input
            oInput.setValue(sNewValue);
            
            // Show a message to the user
            sap.m.MessageToast.show("Consecutive dots are not allowed.");
        }
    }
,    
    
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
    




 
 
    


  
    onPressHome: function () {
      const that = this;
      var oEntryTable = that.getView().byId("entryTypeTable");
      const oRouter = this.getOwnerComponent().getRouter();
      if (aSelectedIds.length === 0 && !newEntryFlag) {

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
                oRouter.navTo("RouteHome");
                  setTimeout(() => {

                    that.resetView();
                  }, 1600);
              }
            }.bind(this) // Ensure access to outer scope
          });
        } else {
          oRouter.navTo("RouteHome");
          setTimeout(() => {

            that.resetView();
          }, 1600);

        }
      }
      else if (aSelectedIds.length && !newEntryFlag &&  !editFlag) {
        oRouter.navTo("RouteHome");
        this.byId("createTypeTable").removeSelections();
      }
      else if (newEntryFlag) {
        let voyCode = this.getView().byId("maintaingrpCode").getValue().trim();
        let voyCodeDesc = this.getView().byId("maintaingrpCodeDesc").getValue().trim();
        if (voyCode == "" && voyCodeDesc == "") {

          const oRouter = that.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
          setTimeout(() => {
            oEntryTable.setVisible(false);
            oEntryTable.getItems()[0].getCells()[0].setValue("");
            oEntryTable.getItems()[0].getCells()[1].setValue("");

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
                const oRouter = that.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome");
                setTimeout(() => {
                  oEntryTable.setVisible(false);
                  oEntryTable.getItems()[0].getCells()[0].setValue("");
                  oEntryTable.getItems()[0].getCells()[1].setValue("");

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


    onBackPress: function () {
      const that = this;
      var oEntryTable = that.getView().byId("entryTypeTable");
      var oupdateTable = that.getView().byId("updateTypeTable");
 
      const oRouter = this.getOwnerComponent().getRouter();
      if (aSelectedIds.length === 0 && !newEntryFlag) {
 
        oRouter.navTo("RouteConfigReleaseDashboard");
      }
      else if (aSelectedIds.length && !newEntryFlag  && !editFlag) {
        oRouter.navTo("RouteConfigReleaseDashboard");
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
          this.resetView();
 
        }
      }
 
 
      else if (newEntryFlag) {
        let voyCode = this.getView().byId("maintaingrpCode").getValue().trim();
        let voyCodeDesc = this.getView().byId("maintaingrpCodeDesc").getValue().trim();
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
                oEntryTable.getItems()[0].getCells()[0].setValue("");
                oEntryTable.getItems()[0].getCells()[1].setValue("");
 
                var items = oEntryTable.getItems();
                for (var i = items.length - 1; i > 0; i--) {
                  oEntryTable.removeItem(items[i]);
                }
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
          this.resetView();
 
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

            return [oSelectedItem.getBindingContext().getProperty("Zuser"), oSelectedItem.getBindingContext().getProperty("Zgroup")]

          } else {

          }

        });
        console.log(aSelectedIds);
        return aSelectedIds;

      },
      newEntries: function () {
        newEntryFlag = true;

        copyFlag = false;
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

        this.getView().byId("entryBtn").setEnabled(false);
        this.getView().byId("createTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(true);
        this.getView().byId("mainPageFooter").setVisible(true);
        this.getView().byId("editBtn").setEnabled(false);
        this.getView().byId("deleteBtn").setEnabled(false);
        this.getView().byId("copyBtn").setEnabled(false);
      },
      pressEdit: function () {
        var that = this
        let oView = this.getView();

        let oCreateTable = oView.byId("createTypeTable");
        var oTable = this.byId("createTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        onEditInput = [];
        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var sValue = oBindingContext.getProperty("Zuser");
          var sDescription = oBindingContext.getProperty("Zgroup");
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

          let sValue = oContext.getProperty("Zuser");
          let sDesc = oContext.getProperty("Zgroup");

         
          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: sValue }),
              new sap.m.Input({ value: sDesc, editable: true,liveChange: that.onLiveChange.bind(that)})
            ]
          });
          oUpdateTable.addItem(oColumnListItem);
        });

        oUpdateTable.setVisible(true);

        oCreateTable.setVisible(false);

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
    
            var oBindListSP = that.getView().getModel().bindList("/MaintainGroupSet");
            oBindListSP.attachEventOnce("dataReceived", function () {
                var existingEntries = oBindListSP.getContexts().map(function (context) {
                    return context.getProperty("Zuser").toUpperCase(); // Convert to lowercase
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
    
                // Format Uomdes value
                var formattedUomdes = that.formatUomdes(value2);
    
                var oBindListSP = that.getView().getModel().bindList("/MaintainGroupSet");
    
                try {
                    oBindListSP.create({
                        Zuser: value1,
                        Zgroup: formattedUomdes
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
      formatUomdes: function (Zgroup) {
        return Zgroup.toLowerCase().replace(/\b\w/g, function (char) {
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
          let code = oCells[0].getValue().trim();
          var oInput = oCells[1]; // Index 1 corresponds to the Input field
          var sValue = oInput.getValue().trim();

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
      onUpdate: function () {
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");

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

        aItems.forEach(function (oItem) {
          let sValue = oItem.getCells()[0].getText(); // Assuming Value is in the first cell
          let sDesc = oItem.getCells()[1].getValue(); // Assuming Field Description is in the second cell



          let oCreateItem = oCreateTable.getItems().find(function (oCreateItem) {
            return oCreateItem.getCells()[0].getText() === sValue; // Assuming Value is in the first cell
          });

          if (oCreateItem) {
            oCreateItem.getCells()[1].setText(sDesc.replace(/\s+/g, " ").trim()); // Assuming Field Description is in the second cell
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
      removeExtraSpaces: function (sentence) {
   
        let words = sentence.split(/\s+/);

        let cleanedSentence = words.join(' ');

        return cleanedSentence;
      },
      onCancelEdit: function () {

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
                this.resetView();
              }
            }.bind(this) // Ensure access to outer scope
          });
        } else {
          this.resetView();

        }
      },
      onCancelCopyOrEntry: function () {
        var oEntryTable = this.getView().byId("entryTypeTable");
        const that = this;

        let voyCode = this.getView().byId("maintaingrpCode").getValue().trim();
        let voyCodeDesc = this.getView().byId("maintaingrpCodeDesc").getValue().trim();

        // Check if there are any changes made
        if (voyCode !== "" || voyCodeDesc !== "") {

          sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
            MessageBox.confirm(
              "Changes were made , do you want to Discard ?", {
              title: "Confirm ",
              onClose: function (oAction) {

                if (oAction === MessageBox.Action.OK) {
                  oEntryTable.setVisible(false);
                  oEntryTable.getItems()[0].getCells()[0].setValue("");
                  oEntryTable.getItems()[0].getCells()[1].setValue("");

                  var items = oEntryTable.getItems();
                  for (var i = items.length - 1; i > 0; i--) {
                    oEntryTable.removeItem(items[i]);
                  }
                  that.resetView();

                } else {
                  console.log("continue ..");

                }
              }
            }
            );
          });

        } else {
          oEntryTable.setVisible(false);
          oEntryTable.getItems()[0].getCells()[0].setValue("");
          oEntryTable.getItems()[0].getCells()[1].setValue("");

          var items = oEntryTable.getItems();
          for (var i = items.length - 1; i > 0; i--) {
            oEntryTable.removeItem(items[i]);
          }

          that.resetView();
        }
      },
      resetView: function () {
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        editFlag = false;
        copyFlag = false;
        newEntryFlag = false;
        this.getView().byId("createTypeTable").setVisible(true).removeSelections();
        this.getView().byId("maintaingrpCode1").setText("");
        this.getView().byId("maintaingrpCodeDesc1").setValue("");
        this.getView().byId("maintaingrpCode").setValue("");
        this.getView().byId("maintaingrpCodeDesc").setValue("");
        this.getView().byId("editBtn").setEnabled(true);
        this.getView().byId("deleteBtn").setEnabled(true);
       
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