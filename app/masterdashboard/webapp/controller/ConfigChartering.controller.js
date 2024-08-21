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
    let ZgroupId;
    let mydata = [];
    let filteredUsers = [];
    let oBusyDialog;


    let oView;


    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}

    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.ConfigChartering", {

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
        // this.byId("approver1Column").setVisible(false);
        // this.byId("approver2Column").setVisible(false);
        // this.byId("approver3Column").setVisible(false);
      },

      onMaintainUserSearch: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");

        var oFilter1 = new sap.ui.model .Filter("Zgroup", sap.ui.model.FilterOperator.Contains, sValue1);
        var andFilter = new sap.ui.model.Filter({
          filters: [oFilter1]
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

        // oEvent.getSource().getBinding("items").filter([oFilter1]);
      },







      onApproverSelect: function (oEvent) {
        var oView = this.getView();
        this._oInputField = oEvent.getSource();

        if (!this._oApprpover) {
          this._oApprpover = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.ApproverSelect", this);
          oView.addDependent(this._oApprpover);
        }
        this._oApprpover.open();
      },

      onApproverClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this._oInputField.setValue(oSelectedItem.getTitle());
      },
      onApproverSearch: function(oEvent) {
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Zuser", sap.ui.model.FilterOperator.Contains, sValue1);
        var andFilter = new sap.ui.model.Filter({
            filters: [oFilter1]
        });
    
        var oSelectDialog = oEvent.getSource();
        var oBinding = oSelectDialog.getBinding("items");
    
        // Set the initial noDataText to "Loading..."
        oSelectDialog.setNoDataText("No Data Found");
    
        oBinding.filter([andFilter]);
    
        // Attach a one-time event handler for dataReceived
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText(""); // Clear the noDataText
            }
        });
    },
    
    

  


      onZgroup: function (oEvent) {
        var oView = this.getView();

        this._oInputField = oEvent.getSource();

        if (!this._oMaintainGroup) {
          this._oMaintainGroup = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.Zgroup", this);
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
        this.getView().setModel(this.filteredUsersModel, "filteredUsersModel");
        console.log("Filtered Users JSON Model", this.filteredUsersModel.getData());
        this.createDynamicColumnsBasedOnApprovers(filteredUsers);
        let oTable = this.byId("entryTypeTable");
        let items = oTable.getItems()[0];
        let cells = items.getCells();
        for (let i = 4; i < cells.length; i++) {
          cells[i].setValue("");
        }
      },
      createDynamicColumnsBasedOnApprovers1: function (filteredUsers) {
        let oTable = this.getView().byId("entryTypeTable");

        oTable.getColumns().forEach(function (column) {
          if (column.getHeader().getText().startsWith("Approver")) {
            oTable.removeColumn(column);
          }
        });

        filteredUsers.forEach((user, index) => {
          oTable.addColumn(new sap.m.Column({
            header: new sap.m.Label({ text: `Approver ${index + 1}` })


          }));
        });
        filteredUsers.forEach((x, index, arr) => {
          if (index < 3) {

            oTable.getItems()[0].addCell(new sap.m.Input({
              showValueHelp: true,
              valueHelpOnly: true,
              valueHelpRequest: this.onApproverSelect.bind(this)
            }));
          } else {


            oTable.getItems()[0].addCell(new sap.m.Input({
              showValueHelp: true,
              valueHelpOnly: true,
              editable: false,
              valueHelpRequest: this.onApproverSelect.bind(this)
            }));

          }
        });


        oTable.setVisible(true);



        console.log("Filtered Users Data:", this.getView().getModel("filteredUsersModel").getData());
      },
      createDynamicColumnsBasedOnApprovers: function (filteredUsers) {
        let oTable = this.getView().byId("entryTypeTable");
      
        // Remove existing dynamic Approver columns
        oTable.getColumns().forEach(function (column) {
          if (column.getHeader().getText().startsWith("Approver")) {
            oTable.removeColumn(column);
          }
        });
      
        // Add new dynamic Approver columns based on filteredUsers
        filteredUsers.forEach((user, index) => {
          oTable.addColumn(new sap.m.Column({
            header: new sap.m.Label({ text: `Approver ${index + 1}` })
          }));
        });
      
        // Add cells to the first row for each dynamic column
        filteredUsers.forEach((x, index) => {
          if (index < 3) {
            oTable.getItems()[0].addCell(new sap.m.Input({
              showValueHelp: true,
              valueHelpOnly: true,
              valueHelpRequest: this.onApproverSelect.bind(this)
            }));
          } else {
            oTable.getItems()[0].addCell(new sap.m.Input({
              showValueHelp: true,
              valueHelpOnly: true,
              editable: false,
              valueHelpRequest: this.onApproverSelect.bind(this)
            }));
          }
        });
      
        // Show MessageBox if there are more than 3 approvers
        if (filteredUsers.length > 3) {
          sap.m.MessageBox.show(
            "Currently system maintains only upto  three Approvers. Additional approvers are not allowed.",
            {
              icon: sap.m.MessageBox.Icon.INFORMATION,
              title: "Information",
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function (oAction) { 
                oTable.getItems()[0].addCell(new sap.m.Input({
                  showValueHelp: true,
                  valueHelpOnly: true,
                  editable: false,
                  valueHelpRequest: this.onApproverSelect.bind(this)
                }));
               }
            }
          );
        }
      
        oTable.setVisible(true);
      
        console.log("Filtered Users Data:", this.getView().getModel("filteredUsersModel").getData());
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
          var oTable = this.byId("entryTypeTable");
          var oSelectVoyty = this.byId("Voyty");
          var oSelectCarty = this.byId("Carty");

          let selectedVoyty = oSelectVoyty.getSelectedKey();
          let selectedCarty = oSelectCarty.getSelectedKey();

          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            let code = "";
            let zgroup = "";

            if (oCells[0] && oCells[0].getValue) {
              code = oCells[0].getValue().trim();
            }

            if (oCells[3] && oCells[3].getValue) {
              zgroup = oCells[3].getValue().trim();
            }

            if (code !== "" || zgroup !== "" || selectedVoyty !== "" || selectedCarty !== "") {
              flag = true;
              break;
            }
          }
          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {

                  this.hideDynamicColumns(oTable);
                  this.resetView();
                }
              }.bind(this)
            });
          } else {

            this.hideDynamicColumns(oTable);
            this.resetView();
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
            return [
              oSelectedItem.getBindingContext().getProperty("Rels"),
              oSelectedItem.getBindingContext().getProperty("Voyty"),
              oSelectedItem.getBindingContext().getProperty("Vesty"),
              oSelectedItem.getBindingContext().getProperty("Zgroup"),
              oSelectedItem.getBindingContext().getProperty("App1"),
              oSelectedItem.getBindingContext().getProperty("App2"),
              oSelectedItem.getBindingContext().getProperty("App3")
            ]
          } else { }

        });
        console.log(aSelectedIds);
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

        firstItemCells[3].setValue("");
        var oSelectVoyty = this.byId("Voyty");
        var oSelectCarty = this.byId("Carty");

        oSelectVoyty.setSelectedKey("");
        oSelectCarty.setSelectedKey("");

        this.getView().byId("createTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(true);
        this.getView().byId("mainPageFooter").setVisible(true);
        this.getView().byId("entryBtn").setEnabled(false);
        this.getView().byId("deleteBtn").setEnabled(false);

        // this.byId("approver1Column").setVisible(false);
        // this.byId("approver2Column").setVisible(false);
        // this.byId("approver3Column").setVisible(false);
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
    
            if (!values[0]) {
                errors.push("Please fill the Release Strategy.");
                entriesProcessed++;
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
                return;
            }
            if (!values[1]) {
                errors.push("Please fill the Voyage type.");
                entriesProcessed++;
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
                return;
            }
            if (!values[2]) {
                errors.push("Please fill the Vessel type.");
                entriesProcessed++;
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
                return;
            }
            if (!values[3]) {
                errors.push("Please fill the User ID Group.");
                entriesProcessed++;
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
                return;
            }
    
            // Check if at least one approver is selected
            if (!values[4] && !values[5] && !values[6]) {
                errors.push("Please fill approvers. Release Strategy must have at least one approver.");
                entriesProcessed++;
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
                return;
            }
    
            // Check if selected approvers are unique
            var approvers = values.slice(4, 7).filter(Boolean); // Only consider non-empty values
            if (new Set(approvers).size !== approvers.length) {
                errors.push("Approvers must be unique.");
                entriesProcessed++;
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
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
                that.checkCompletion(entriesProcessed, totalEntries, errors, duplicateEntries);
            });
    
            oBindListSP.getContexts();
        });
      },
      
      checkCompletion: function (entriesProcessed, totalEntries, errors, duplicateEntries) {
        if (entriesProcessed === totalEntries) {
          if (errors.length === 0 && duplicateEntries.length === 0) {
            this.createEntries();
          } else {
            var errorMessage = errors.join("\n");
            if (duplicateEntries.length > 0) {
              errorMessage += "\nDuplicate entries found with the same keys:\n";
              duplicateEntries.forEach(function (entry) {
                errorMessage += entry + "\n";
              });
            }
            sap.m.MessageToast.show(errorMessage);
          }
        }
      },
      
      createEntries: function () {
        var that = this;
        var oTable = that.byId("entryTypeTable");
        var entriesCreated = 0;
        var totalEntries = oTable.getItems().length;
      
        oTable.getItems().forEach(function (row, index) {
          var values = [];
          row.getCells().forEach(function (cell) {
            if (cell instanceof sap.m.Input) {
              values.push(cell.getValue());
            } else if (cell instanceof sap.m.Select) {
              values.push(cell.getItemByKey(cell.getSelectedKey()).getText());
            }
          });
          var oBusyDialog = new sap.m.BusyDialog({
            text: "Saving data, please wait..."
          });
          oBusyDialog.open();
          var oBindListSP = that.getView().getModel().bindList("/RelStrategySet");
          oBindListSP.attachCreateCompleted(function (oEvent) {
            let response = oEvent.getParameters();
            if (response.success) {
              entriesCreated++;
              if (entriesCreated === totalEntries) {
                sap.m.MessageBox.success("All entries saved successfully.");
                oBusyDialog.close();
                that.getView().getModel().refresh();
                that.formatTableEntries();
                that.hideDynamicColumns(oTable);
                that.resetView();
                that.byId("createTypeTable").removeSelections();
              }
            } else {
              let msg = response.context.oModel.mMessages[""][0].message;
              sap.m.MessageBox.error(msg);
              oBusyDialog.close();
            }
          });
      
          let payload = {
            Rels: values[0],
            Voyty: values[1],
            Vesty: values[2].trim(),
            Zgroup: values[3],
            App1: values[4],
            App2: values[5],
            App3: values[6],
          };
      
          try {
            oBindListSP.create(payload);
          } catch (error) {
            sap.m.MessageToast.show("Error while saving data");
            oBusyDialog.close();
          }
        });
      },
      

      formatValue: function (value) {
        return value ? value : "NA";
      },
      formatTableEntries: function () {
        var that = this;
        var oTable = that.byId("entryTypeTable");
        oTable.getItems().forEach(function (row) {
          row.getCells().forEach(function (cell) {
            if (cell instanceof sap.m.Text) {
              cell.setText(that.formatValue(cell.getText()));
            }
          });
        });
      },












      onCancel: function () {
        if (newEntryFlag) {
          this.onCancelNewEntry();
        }
      },

      onCancelNewEntry: function () {
        var oTable = this.byId("entryTypeTable");
        var oSelectVoyty = this.byId("Voyty");
        var oSelectCarty = this.byId("Carty");

        let selectedVoyty = oSelectVoyty.getSelectedKey();
        let selectedCarty = oSelectCarty.getSelectedKey();

        var aItems = oTable.getItems();
        let flag = false;

        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          let code = "";
          let zgroup = "";

          if (oCells[0] && oCells[0].getValue) {
            code = oCells[0].getValue().trim();
          }

          if (oCells[3] && oCells[3].getValue) {
            zgroup = oCells[3].getValue().trim();
          }

          if (code !== "" || zgroup !== "" || selectedVoyty !== "" || selectedCarty !== "") {
            flag = true;
            break;
          }
        }

        if (flag) {
          sap.m.MessageBox.confirm("Do you want to discard the changes?", {
            title: "Confirmation",
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {

                this.hideDynamicColumns(oTable);
                this.resetView();
              }
            }.bind(this)
          });
        } else {

          this.hideDynamicColumns(oTable);
          this.resetView();
        }
      },

      hideDynamicColumns: function (oTable) {
        var aColumns = oTable.getColumns();
        for (let i = 4; i < aColumns.length; i++) { // Assuming the first 4 columns are fixed
          aColumns[i].setVisible(false);
        }
      },


      removeExtraSpaces: function (sentence) {
        let words = sentence.split(/\s+/);
        let cleanedSentence = words.join(' ');
        return cleanedSentence;
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

        // this.getView().byId("Code1").setText("");
        // this.getView().byId("Desc1").setValue("");
        // this.getView().byId("Code").setValue("");
        // this.getView().byId("Desc").setValue("");

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
                 oBusyDialog = new sap.m.BusyDialog({
                  text: "Deleting, please wait...",
                  title: "Processing"
              });
                oBusyDialog.open();
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
            MessageToast.show(`${deleteMsg} deleted sucessfully`);
            oBusyDialog.close();

            console.log("Succesfully Deleted");
            aSelectedIds = []
          }).catch(function (oError) {
            MessageBox.error("Error deleting item: " + oError.message);
            oBusyDialog.close();

          });
        });

        let oTable = this.byId("createTypeTable");
        oTable.removeSelections();


      },


    });

  });