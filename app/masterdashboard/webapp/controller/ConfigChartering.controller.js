sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    

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
    let ZgroupId;
    let mydata = [];
    let filteredUsers = [];

    let oView;


    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}

    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.ConfigChartering", {


      onVoyageTypeLiveChange: function(oEvent) {
        var sNewValue = oEvent.getParameter("value");
       
        var sNumericValue = sNewValue.replace(/\D/g,'');
    
        sNumericValue = sNumericValue.substring(0, 4);
        oEvent.getSource().setValue(sNumericValue);
    

        if (sNewValue.length > 4 || sNewValue !== sNumericValue) {
          sap.m.MessageToast.show("Only numeric values allowed, maximum 4 digits");
      }
    },

    onCodeLiveChange: function (oEvent) {
      var oInput = oEvent.getSource();
      var sValue = oInput.getValue();
      
      // Convert the first character to uppercase and keep the rest of the string unchanged
      var newValue = sValue.charAt(0).toUpperCase() + sValue.slice(1);
      
      // Check if the new value contains any non-alphanumeric characters
      if (/[^a-zA-Z0-9]/.test(newValue)) {
          // Remove any non-alphanumeric characters
          newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
          
          // Show a message to the user
          sap.m.MessageToast.show("Only alphanumeric characters are allowed.");
      }
      
      // Check if the length of the new value exceeds 4
      if (newValue.length > 10) {
          // Truncate the value to keep only the first 4 characters
          newValue = newValue.substring(0, 10);
          
          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 10 characters.");
      }
      
      // Update the value of the input if it has changed
      if (newValue !== sValue) {
          oInput.setValue(newValue);
      }
  },
  
    
    onVesselTypeLiveChange: function(oEvent) {
        var sNewValue = oEvent.getParameter("value");
        var sNumericValue = sNewValue.replace(/\D/g,'');
        sNumericValue = sNumericValue.substring(0, 4);
        oEvent.getSource().setValue(sNumericValue);
    
        if (sNewValue.length > 4 || sNewValue !== sNumericValue) {
          sap.m.MessageToast.show("Only numeric values allowed, maximum 4 digits");
      }
    },
      
      onInit: function () {
        this.filteredUsersModel = new sap.ui.model.json.JSONModel();

        let oModel2 = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel2, "dataModel2");
        let oModel4 = this.getOwnerComponent().getModel();
        let oBindList4 = oModel4.bindList("/xNAUTIxUIIDUSRGROUP");
        oBindList4.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            mydata.push(oContext.getObject());
          });
          oModel2.setData(mydata);
        }.bind(this))
        console.log("myvendorData", mydata)

        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);
        this.byId("approver1Column").setVisible(false);
        this.byId("approver2Column").setVisible(false);
        this.byId("approver3Column").setVisible(false);

      },
      onApproverSelect: function(oEvent) {
        var oView = this.getView();
        this._oInputField = oEvent.getSource();
    
        if (!this._oApprpover) {
            this._oApprpover = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.approverName", this);
            oView.addDependent(this._oApprpover);
        }
    
        // Get the already selected approvers
        var selectedApprovers = [];
        var oTable = this.getView().byId("entryTypeTable");
        if (oTable) {
            var items = oTable.getItems();
            items.forEach(function(item) {
                var approverInput = item.getCells()[4]; // Assuming the approver field is at index 4
                if (approverInput) {
                    var selectedApprover = approverInput.getValue().trim();
                    if (selectedApprover) {
                        selectedApprovers.push(selectedApprover);
                    }
                }
            });
        }
    
        // Filter out already selected approvers from the available list
        var oApproverSelect = sap.ui.core.Fragment.byId("com.ingenx.nauti.masterdashboard.fragments.approverName", "approverSelect");
        if (oApproverSelect) {
            var oBinding = oApproverSelect.getBinding("items");
            if (oBinding) {
                oBinding.filter(new sap.ui.model.Filter({
                    path: "title",
                    test: function(sValue) {
                        return !selectedApprovers.includes(sValue);
                    }
                }));
            }
        }
    
        this._oApprpover.open();
    },
    onMaintainUserSearch: function(oEvent) {

      var sValue1 = oEvent.getParameter("value");
  
      var oFilter1 = new sap.ui.model.Filter("Zgroup", sap.ui.model.FilterOperator.Contains, sValue1);
      var andFilter = new sap.ui.model.Filter({
        filters: [oFilter1]
      });
  
      oEvent.getSource().getBinding("items").filter([andFilter]);
    },
    onApproverSearch: function (oEvent) {
      var sValue1 = oEvent.getParameter("value");

      var oFilter1 = new sap.ui.model .Filter("Zuser", sap.ui.model.FilterOperator.Contains, sValue1);

      oEvent.getSource().getBinding("items").filter([oFilter1]);
    },
    
    onApproverClose: function(oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);
    
        if (!oSelectedItem) {
            return;
        }
    
        // Update the selected approver field
        this._oInputField.setValue(oSelectedItem.getTitle());
    },
    

      onZgroup: function (oEvent) {
        var oView = this.getView();

        this._oInputField = oEvent.getSource();

        if (!this._oMaintainGroup) {
          this._oMaintainGroup = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.userIdGroup", this);
          oView.addDependent(this._oMaintainGroup);
        }
        this._oMaintainGroup.open();
      },


      onZgroupClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }

        this._oInputField.setValue(oSelectedItem.getTitle());
        ZgroupId = this._oInputField.getValue();

        console.log("hii", ZgroupId);
        filteredUsers = mydata.filter(function (user) {
          return user.Zgroup === ZgroupId;
        });

        console.log("Users in Zgroup", ZgroupId, filteredUsers);
        this.filteredUsersModel.setData(filteredUsers);
        var approver1Column = this.getView().byId("approver1Column");
        var approver2Column = this.getView().byId("approver2Column");
        var approver3Column = this.getView().byId("approver3Column");
        this.byId("App1").setValue("");
        this.byId("App2").setValue("");
        this.byId("App3").setValue("");
        if (filteredUsers.length >= 1) {
          approver1Column.setVisible(true);
        } else {
          approver1Column.setVisible(false);
        }
        if (filteredUsers.length >= 2) {
          approver2Column.setVisible(true);
        } else {
          approver2Column.setVisible(false);
        }
        if (filteredUsers.length >= 3) {
          approver3Column.setVisible(true);
        } else {
          approver3Column.setVisible(false);
        }




        this.getView().setModel(this.filteredUsersModel, "filteredUsersModel");

        console.log("Filtered Users JSON Model", this.filteredUsersModel.getData());

      },

      onChange: function () {
        debugger;
      },


      onBackPress: function () {
        const that = this;
        var oEntryTable = that.getView().byId("entryTypeTable");
        var oupdateTable = that.getView().byId("updateTypeTable");

        const oRouter = this.getOwnerComponent().getRouter();
        if (aSelectedIds.length === 0 && !newEntryFlag) {

          oRouter.navTo("RouteConfigReleaseDashboard");
        }
        else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
          oRouter.navTo("RouteConfigReleaseDashboard");
          this.byId('createTypeTable').removeSelections();

        }


        else if (newEntryFlag) {
          let Rels = this.getView().byId("Rels").getValue().trim();
          let Voyty = this.getView().byId("Voyty").getValue().trim();
          let Carty = this.getView().byId("Carty").getValue().trim();
          let Zgroup = this.getView().byId("Zgroup").getValue().trim();
          let App1 = this.getView().byId("App1").getValue().trim();
          let App2 = this.getView().byId("App2").getValue().trim();
          let App3 = this.getView().byId("App3").getValue().trim();
          if (Rels == "" && Voyty == "" && Carty == "" && Zgroup == "" && App1 == "" && App2 == "" && App3 == "") {
            oEntryTable.setVisible(false);
            oEntryTable.getItems()[0].getCells()[0].setValue("");
            oEntryTable.getItems()[0].getCells()[1].setValue("");
            this.byId("approver1Column").setVisible(false);
            this.byId("approver2Column").setVisible(false);
            this.byId("approver3Column").setVisible(false);


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
                }
              }
            }
            );
          }
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

        else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
          oRouter.navTo("RouteHome");
          this.byId("createTypeTable").removeSelections();
        }
        else if (newEntryFlag) {
          let Rels = this.getView().byId("Rels").getValue().trim();
          let Voyty = this.getView().byId("Voyty").getValue().trim();
          let Carty = this.getView().byId("Carty").getValue().trim();
          let Zgroup = this.getView().byId("Zgroup").getValue().trim();
          let App1 = this.getView().byId("App1").getValue().trim();
          let App2 = this.getView().byId("App2").getValue().trim();
          let App3 = this.getView().byId("App3").getValue().trim();
          if (Rels == "" && Voyty == "" && Carty == "" && Zgroup == "" && App1 == "" && App2 == "" && App3 == "") {

            const oRouter = that.getOwnerComponent().getRouter();
            oRouter.navTo("RouteConfigReleaseDashboard");
            setTimeout(() => {
              oEntryTable.setVisible(false);
              // Clear input fields of the first row
              oEntryTable.getItems()[0].getCells()[0].setValue("");
              oEntryTable.getItems()[0].getCells()[1].setValue("");
              this.byId("approver1Column").setVisible(false);
              this.byId("approver2Column").setVisible(false);
              this.byId("approver3Column").setVisible(false);


              // Remove items except the first row
              var items = oEntryTable.getItems();
              for (var i = items.length - 1; i > 0; i--) {
                oEntryTable.removeItem(items[i]);
              }
              that.resetView();
            }, 800);

          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, reset the view to its initial state
                  const oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteConfigReleaseDashboard");
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
      },

      selectedItems: function (oEvent) {

        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();


        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {


          if (oSelectedItem.getBindingContext()) {

            let cells = oSelectedItem.getCells();
            console.log(cells);

            return [oSelectedItem.getBindingContext().getProperty("Rels"), oSelectedItem.getBindingContext().getProperty("Voyty"), oSelectedItem.getBindingContext().getProperty("Vesty"), oSelectedItem.getBindingContext().getProperty("Zgroup")
              , oSelectedItem.getBindingContext().getProperty("App1"), oSelectedItem.getBindingContext().getProperty("App2"), oSelectedItem.getBindingContext().getProperty("App3")
            ]

          } else {

          }

        });
        console.log(aSelectedIds);
        // console.log("Selected Travel IDs: " + aSelectedTravelIds.join(","));
        return aSelectedIds;

      },

      
      newEntries: function () {
        newEntryFlag = true;


        editFlag = false;

        this.byId("createTypeTable").removeSelections();

        var oEntryTable = this.getView().byId("entryTypeTable");
        var items = oEntryTable.getItems();
        for (var i = items.length - 1; i > 0; i--) {
          oEntryTable.removeItem(items[i]);
        }

        var firstItemCells = items[0].getCells();
        firstItemCells[0].setValue("");
        this.resetSelectControl(firstItemCells[1]); // Reset Voyage Type
        this.resetSelectControl(firstItemCells[2]); // Reset Vessel Type
        firstItemCells[3].setValue("");
        // firstItemCells[0].setValue("");
        // firstItemCells[1].setValue("");
        // firstItemCells[2].setValue("");
        // firstItemCells[3].setValue("");


        this.getView().byId("entryBtn").setEnabled(false);
        this.getView().byId("createTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(true);
        this.getView().byId("mainPageFooter").setVisible(true);

        this.getView().byId("deleteBtn").setEnabled(false);
        this.byId("approver1Column").setVisible(false);
        this.byId("approver2Column").setVisible(false);
        this.byId("approver3Column").setVisible(false);

      },
      resetSelectControl: function (selectControl) {
        if (selectControl instanceof sap.m.Select) {
            selectControl.setSelectedKey(""); // Clear selected key
            selectControl.setSelectedItem(null); // Clear selected item
        }
    },

      onSave: function () {
        var that = this;
        var oTable = that.byId("entryTypeTable");
        var totalEntries = oTable.getItems().length;
        var entriesProcessed = 0;
        var errors = [];
        var duplicateEntries = [];

        oTable.getItems().forEach(function (row) {
          var values = [];
          row.getCells().forEach(function (cell) {
            if (cell instanceof sap.m.Input) {
                values.push(cell.getValue());
            } else if (cell instanceof sap.m.Select) {
                values.push(cell.getSelectedKey());
            }
        });

          // Check if any of the fields in the row is empty
          // if (values.some(function (value) { return !value; })) {
          //   errors.push("Please enter values for all fields in all rows.");
          //   entriesProcessed++;
          //   checkCompletion();
          //   return;
          // }

          if (!values[0] || !values[1] || !values[2] || !values[3] || !values[4]) {
            errors.push("Please enter both fields in this row.");
            entriesProcessed++;
            checkCompletion();
            return;
          }
         
       


          var oBindListSP = that.getView().getModel().bindList("/RelStrategySet");
          oBindListSP.attachEventOnce("dataReceived", function () {
            var existingEntries = oBindListSP.getContexts().map(function (context) {
              
              return [
                context.getProperty("Rels"),
                context.getProperty("Voyty"),
                context.getProperty("Vesty"),
                context.getProperty("Zgroup")
              ].join('|'); 
            });

            var currentEntry = values.join('|');

            if (existingEntries.includes(currentEntry)) {
              duplicateEntries.push(currentEntry);
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
                      errorMessage += "Duplicate entries found with the same keys:\n";
                      duplicateEntries.forEach(function (entry) {
                          errorMessage += entry + "\n";
                      });
                  }
                  sap.m.MessageToast.show(errorMessage);
              }
          }
      }
      
      function createEntries() {
          var allSavePromises = [];  // Array to hold all save promises
      
          oTable.getItems().forEach(function (row, index) {
              var values = [];
              row.getCells().forEach(function (cell) {
                  if (cell instanceof sap.m.Input) {
                      if (cell.getValue() === null || cell.getValue() === "") {
                          values.push("Null");
                      } else {
                          values.push(cell.getValue());
                      }
                  } else if (cell instanceof sap.m.Select) {
                      var selectedKey = cell.getSelectedKey();
                      if (!selectedKey) {
                          values.push("Null");
                      } else {
                          values.push(cell.getItemByKey(selectedKey).getText());
                      }
                  }
              });
      
              // Ensure that any missing approver values are set to "Null"
              if (!values[4] || values[4] === "") {
                  values[4] = "Null";
              }
              if (!values[5] || values[5] === "") {
                  values[5] = "Null";
              }
              if (!values[6] || values[6] === "") {
                  values[6] = "Null";
              }
      
              var oBindListSP = that.getView().getModel().bindList("/RelStrategySet");
              var savePromise = new Promise((resolve, reject) => {
                  oBindListSP.attachCreateCompleted((oEvent) => {
                      let response = oEvent.getParameters();
                      if (response.success) {
                          resolve();
                      } else {
                          let msg = response.context.oModel.mMessages[""][0].message;
                          reject(new Error(msg));
                      }
                  });
      
                  try {
                      oBindListSP.create({
                          Rels: values[0],
                          Voyty: values[1],
                          Vesty: values[2],
                          Zgroup: values[3],
                          App1: values[4],
                          App2: values[5],
                          App3: values[6]
                      });
                  } catch (error) {
                      reject(error);
                  }
              });
      
              allSavePromises.push(savePromise);
          });
      
          Promise.allSettled(allSavePromises).then((results) => {
              var errors = results.filter(result => result.status === "rejected");
              if (errors.length > 0) {
                  var errorMessage = "Errors occurred while saving entries:\n";
                  errors.forEach(error => {
                      errorMessage += error.reason.message + "\n";
                  });
                  sap.m.MessageBox.error(errorMessage);
              } else {
                  sap.m.MessageBox.success("Successfully created");
                  oTable.removeSelections();
                  that.getView().getModel().refresh();
                  that.resetView();
              }
          });
      }
      
      
      
        // function checkCompletion() {
        //   if (entriesProcessed === totalEntries) {
        //     if (errors.length === 0 && duplicateEntries.length === 0) {
        //       createEntries();
        //     } else {
        //       var errorMessage = "Errors occurred while saving entries:\n";
        //       if (errors.length > 0) {
        //         errorMessage += errors.join("\n") + "\n";
        //       }
        //       if (duplicateEntries.length > 0) {
        //         errorMessage += "Duplicate entries found with the same keys:\n";
        //         duplicateEntries.forEach(function (entry) {
        //           errorMessage += entry + "\n";
        //         });
        //       }
        //       sap.m.MessageToast.show(errorMessage);
        //     }
        //   }
        // }

        // function createEntries() {
        //   oTable.getItems().forEach(function (row, index) {
        //     var values = [];
        //     row.getCells().forEach(function (cell) {
        //         if (cell instanceof sap.m.Input) {
        //           if(cell.getValue()== null){
        //             values.push("Null")
        //           }else values.push(cell.getValue());
        //         } else if (cell instanceof sap.m.Select) {
        //             values.push(cell.getItemByKey(cell.getSelectedKey()).getText());
        //         }
        //     });

        //     var oBindListSP = that.getView().getModel().bindList("/RelStrategySet");
        //     oBindListSP.attachCreateCompleted((oEvent) => {
        //       let response = oEvent.getParameters();
        //       console.log("sda", response)
        //       if( response.success){
        //         sap.m.MessageBox.success("Succcesfully created");
        //         this.getView().byId("createTypeTable").removeSelections();

        //       }else {
        //         let msg = response.context.oModel.mMessages[""][0].message;
        //         sap.m.MessageBox.error(msg);
        //       }

        //     });

        //     try {
        //       oBindListSP.create({
        //         Rels: values[0],
        //         Voyty: values[1],
        //         Vesty: values[2],
        //         Zgroup:values[3],
        //         App1: values[4],
        //         App2: values[5],
        //         App3: values[6]
               
        //       });
        //       that.getView().getModel().refresh();
        //       that.resetView();
        //     } catch (error) {
        //       sap.m.MessageToast.show("Error while saving data");
        //     }
        //   });

        //   // sap.m.MessageToast.show("All entries saved successfully.");
        // }
      },

            
        

      handletFunction : function (oEvent){
        console.log(oEvent);

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
        this.byId("approver1Column").setVisible(false);
        this.byId("approver2Column").setVisible(false);
        this.byId("approver3Column").setVisible(false);
        var aItems = oTable.getItems();
        let flag = false;

        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          let code = "";
          let sValue = "";
        
     

      if (oCells[1] && oCells[1].getValue) {
          sValue = oCells[1].getValue().trim();
      }

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

     

      removeExtraSpaces: function (sentence) {
   
        let words = sentence.split(/\s+/);

        
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
          var oInput = oCells[1];
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
            }.bind(this)
          });
        } else {
          
          this.resetView();

        }
      },

      resetView: function () {
        var oView = this.getView();
    
        // Hide and show various UI elements
        oView.byId("updateTypeTable").setVisible(false);
        oView.byId("entryTypeTable").setVisible(false); 
        oView.byId("mainPageFooter").setVisible(false);
        oView.byId("mainPageFooter2").setVisible(false);
    
        // Clear selections from the table
        oView.byId("createTypeTable").setVisible(true).removeSelections();
    
        // Reset flags
        aSelectedIds = [];
        editFlag = false;
        newEntryFlag = false;
    
        // Enable buttons
        oView.byId("deleteBtn").setEnabled(true);
        oView.byId("entryBtn").setEnabled(true);
        this.byId("createTypeTable").setMode("MultiSelect");
    
        // Reset input fields (replace 'inputField1', 'inputField2', etc. with your actual IDs)
        oView.byId("Code1").setText("");
        oView.byId("Desc1").setValue("");
        oView.byId("Code").setValue("");
        oView.byId("Desc").setValue("");
    
        // If you have more input or select fields, reset them similarly
        // Example:
        // oView.byId("anotherInputField").setValue("");
        // oView.byId("anotherSelectField").setSelectedKey(null);
    }
,    
      // resetView: function () {
        
      //   this.getView().byId("updateTypeTable").setVisible(false);
      //   this.getView().byId("entryTypeTable").setVisible(false);
      //   this.getView().byId("mainPageFooter").setVisible(false);
      //   this.getView().byId("mainPageFooter2").setVisible(false);
      //   aSelectedIds = [];
      //   editFlag = false;
      //   // copyFlag = false;
      //   newEntryFlag = false;
      //   this.getView().byId("createTypeTable").setVisible(true).removeSelections();
      //   // this.getView().byId("Code1").setText("");
      //   // this.getView().byId("Desc1").setValue("");
      //   // this.getView().byId("Code").setValue("");
      //   // this.getView().byId("Desc").setValue("");

      //   this.getView().byId("deleteBtn").setEnabled(true);
      //   // this.getView().byId("copyBtn").setEnabled(true);
      //   this.getView().byId("entryBtn").setEnabled(true);
      //   this.byId("createTypeTable").setMode("MultiSelect");
      // },

      onDeletePress: function () {

        let oTable = this.byId("createTypeTable");
        let aItems = oTable.getSelectedItems();
        if (!aItems.length) {

          MessageToast.show("Please Select a row to delete ");
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
            // Handle deletion error
            MessageBox.error("Error deleting item: " + oError.message);
          });
        });
      },

    });

  });