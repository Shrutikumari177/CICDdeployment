sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataMetaModel"
    
  ],
  function (Controller, History, Fragment, MessageToast, MessageBox, ODataMetaModel) {
    "use strict";
    let aSelectedIds = [];
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    var duplicateEntries = undefined;
    let onEditInput = undefined;
    let onCopyInput = undefined;
    let myModel = undefined;
    let valueHelpInputref = {};

    let oView;


    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.BidMaster", {

      onInit: function () {
        var fieldValueToFilter = "EN"; // Set your dynamic filter value here
        var filter = new sap.ui.model.Filter("spras", sap.ui.model.FilterOperator.StartsWith, fieldValueToFilter);
        let oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("/odata/v4/nauticalservice/xNAUTIxcury_count", [filter])
        console.log(oModel);
        oModel.attachRequestCompleted(function () {

          var modeldata = oModel.getData().value;
          oModel.setData(modeldata);
          this.getView().setModel(oModel, "CurrencyMode");

        }.bind(this));
        var oView = this.getView();
        myModel = oModel;
        var oTable = oView.byId("createTypeTable");
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);


      },
      onCodeLiveChange: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
        var sNewValue = sValue.replace(/[^0-9A-Za-z. ]/g, '');

        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Only Alphanumeric values are allowed.");
        }

        if (sNewValue.length > 10) {
          sNewValue = sNewValue.substring(0, 10);
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Maximum length is 10 Characters.");
        }
      },
      onLiveChangeUser: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        var sNewValue = sValue.replace(/[^a-zA-Z0-9\W]/g, '');

        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Only numbers, alphabet, and special characters are allowed.");
        }
        if (sNewValue.length > 30) {
          sNewValue = sNewValue.substring(0, 30);
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Maximum length is 30 characters.");
        }
      },
      onLiveChangeValue: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        var sNewValue = sValue.replace(/[^a-zA-Z\W]/g, '');
        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);

          sap.m.MessageToast.show("Only alphabet characters are allowed.");
        }
        if (sNewValue.length > 30) {
          sNewValue = sNewValue.substring(0, 30);
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Maximum length is 30 characters.");
        }
      },
     
      onLiveChangeCvalue: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
        var sFilteredValue = sValue.replace(/[^a-zA-Z0-9.\- ]/g, '');
    
        // Show message if non-allowed characters are removed
        if (sFilteredValue.length !== sValue.length) {
            sap.m.MessageToast.show("Only alphanumeric characters, dots (.), hyphens (-), and spaces are allowed.");
            oInput.setValue(sFilteredValue);
        }
    
        // Ensure maximum length of 30 characters
        if (sFilteredValue.length > 13) {
            sFilteredValue = sFilteredValue.substring(0, 13);
            oInput.setValue(sFilteredValue);
            sap.m.MessageToast.show("Maximum length is 13 characters.");
        }
    },
      onLiveChangeCunit: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
        var sNewValue = sValue.replace(/[^a-zA-Z]/g, '');

        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Only alphabet characters are allowed.");
        }

        if (sNewValue.length > 5) {
          sNewValue = sNewValue.substring(0, 5);
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Maximum length is 5 characters.");
        }
      },
      onLiveChangeDatatype: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // Remove any characters that are not numbers, alphabets, or special characters
        var sNewValue = sValue.replace(/[^A-Za-z]/g, '');

        // Check if the input value has changed after removing unwanted characters
        if (sNewValue !== sValue) {
          // Update the value of the input to only contain allowed characters
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Only alphabets characters are allowed.");
        }

        // Check if the length of the value exceeds 30
        if (sNewValue.length > 3) {
          // Truncate the value to keep only the first 30 characters
          sNewValue = sNewValue.substring(0, 4);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 4 characters.");
        }
      },
      onLiveChangeTablename: function (oEvent) {

        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
        var sNewValue = sValue.replace(/[^a-zA-Z0-9/]/g, '');

        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);

         
          sap.m.MessageToast.show("Only numbers, alphabets,forward slash are allowed.");
        }

        // Check if the length of the value exceeds 20
        if (sNewValue.length > 20) {
          // Truncate the value to keep only the first 20 characters
          sNewValue = sNewValue.substring(0, 20);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 20 characters.");
        }
      },
      onCurrencyPress: function (oEvent) {
        var oView = this.getView();
        this._oInputField = oEvent.getSource();
    
        // Initialize the fragment if it doesn't exist
        if (!this._oCurrency) {
            this._oCurrency = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.BiddingCurr", this);
            oView.addDependent(this._oCurrency);
        } else {
            // Reset filters when reopening the dialog
            var oBinding = this._oCurrency.getBinding("items");
            setTimeout(function() {
              oBinding.filter([]);
          }, 0);
        }
    
        this._oCurrency.open();
    },
      handleValueHelpClose: function (oEvent) {
        let oSelectedItem = oEvent.getParameter("selectedItem");

       if (oSelectedItem) {
        let oCells = oSelectedItem.getCells();
        let sSelectedCurrency = oCells[0].getText();  

        if (this._oInputField) {
            this._oInputField.setValue(sSelectedCurrency);
        }
     }

   
        this._oInputField = null;
       
        
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

      onBackPress: function () {
        const that = this;
        const oRouter = this.getOwnerComponent().getRouter();
        // Check if any items have been selected
        if (aSelectedIds.length === 0 && !newEntryFlag) {

          // If no items have been selected, navigate to "RouteMasterDashboard"
          oRouter.navTo("RouteMasterDashboard");
        }
        else if (aSelectedIds.length && !newEntryFlag && !copyFlag && !editFlag) {
          oRouter.navTo("RouteMasterDashboard");
          this.byId('createTypeTable').removeSelections();

        }
        else if (copyFlag) {
          this.onCancelNewEntry();
        }

        else if (newEntryFlag) {
          this.onCancelNewEntry();
        }

        else if (editFlag) {
          this.onCancelEdit();
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
          let oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
          let aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var sCode = oCells[0].getValue().trim(); // Index 1 corresponds to the Input field
            var sBname = oCells[1].getValue().trim();
            var sValue = oCells[2].getValue().trim();
            var sCvalue = oCells[3].getValue().trim();
            var sCunit = oCells[4].getValue().trim();
            var sDatatype = oCells[5].getValue().trim();
            var sTablename = oCells[6].getValue().trim();
            var sMulti_Choice = oCells[7].getSelected();
            // var sValue = this.removeExtraSpaces(oInput.getValue());

            console.log(onCopyInput[i] + ":" + sValue + ":");
            let fieldsArr = onCopyInput[i];
            if (fieldsArr[0] !== sCode || fieldsArr[1] !== sBname || fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sTablename || fieldsArr[6] !== sDatatype || fieldsArr[7] !== sMulti_Choice) {
              flag = true;
              break;
            }
          }

          // If no changes have been made, reset the view to its initial state
          if (!flag) {
            const oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo("RouteHome");
            setTimeout(() => {

              that.resetView();
            }, 1000);

          } else {
            // Prompt the user for confirmation only if changes have been made
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  oEntryTable.setVisible(false);
                  // Clear input fields of the first row
                  oEntryTable.getItems()[0].getCells()[0].setValue("");
                  oEntryTable.getItems()[0].getCells()[1].setValue("");

                  const oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {
                    oEntryTable.setVisible(false);

                    that.resetView();
                  }, 1000);

                  // that.resetView();
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
          var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var sCode = oCells[0].getValue(); // Index 1 corresponds to the Input field
            var sBname = oCells[1].getValue().trim();
            var sValue = oCells[2].getValue().trim();
            var sCvalue = oCells[3].getValue().trim();
            var sCunit = oCells[4].getValue();
            var sDatatype = oCells[5].getValue().trim();
            var sTablename = oCells[6].getValue().trim();
            var sMulti_Choice = oCells[7].getSelected();

            if (sCode !== "" || sBname !== "" || sValue !== "" || sCvalue !== "" || sCunit !== "" || sTablename !== "" || sDatatype !== "" || sMulti_Choice !== false) {
              flag = true;
              break;
            }
          }
          if (!flag) {

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
            }, 1000);

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
                  }, 1000);
                } else {
                  // If user clicks Cancel, do nothing
                }
              }
            }
            );

          }

        } else if (editFlag) {

          var oTable = this.byId("updateTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var sCode = oCells[0].getText(); // Index 1 corresponds to the Input field
            var sBname = oCells[1].getText();
            var sValue = oCells[2].getValue().trim();
            var sCvalue = oCells[3].getValue().trim();
            var sCunit = oCells[4].getValue().trim();
            var sDatatype = oCells[5].getValue().trim();
            var sTablename = oCells[6].getValue().trim();
            var sMulti_Choice = oCells[7].getSelected();
            // var sValue = this.removeExtraSpaces(oInput.getValue());

            console.log(onEditInput[i] + ":" + sValue + ":");
            let fieldsArr = onEditInput[i];
            if (fieldsArr[0] !== sCode || fieldsArr[1] !== sBname || fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sTablename || fieldsArr[6] !== sDatatype || fieldsArr[7] !== sMulti_Choice) {
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
                  }, 1000);
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            oRouter.navTo("RouteHome");
            setTimeout(() => {

              that.resetView();
            }, 1000);

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
            //   console.log(cells);

            let oContext = oSelectedItem.getBindingContext();
            return [oContext.getProperty("Bname"), oContext.getProperty("Code"), oContext.getProperty("Value"), oContext.getProperty("Cvalue"), oContext.getProperty("Cunit"), oContext.getProperty("Datatype"), oContext.getProperty("Tablename"), oContext.getProperty("Multi_Choice")];

          }

        });
        console.log(aSelectedIds);
        // console.log("Selected Travel IDs: " + aSelectedTravelIds.join(","));
        return aSelectedIds;

      },

      newEntries: function () {
        newEntryFlag = true;
        let selectedItem = this.byId("createTypeTable").getSelectedItems();
        if (selectedItem.length === 0) {
            this.getView().byId("createTypeTable").setVisible(false);
            this.getView().byId("entryBtn").setEnabled(false);
            this.getView().byId("editBtn").setEnabled(false);
            this.getView().byId("deleteBtn").setEnabled(false);
            this.getView().byId("copyBtn").setEnabled(false);
            this.getView().byId("entryTypeTable").setVisible(true);
            this.getView().byId("mainPageFooter").setVisible(true);

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
            firstItemCells[5].setSelectedKey("");
            firstItemCells[6].setValue("");

            firstItemCells[7].setSelected(false);
        } else {
            MessageToast.show("Unselect the Selected Row !");
        }
      },
      pressCopy: function() {
        if (aSelectedIds.length === 0) {
            sap.m.MessageToast.show("Please select at least one row");
            return;
        }
        newEntryFlag = false;
        editFlag = false;
        copyFlag = true;
    
        let that = this;
        let oView = this.getView();
    
        // Get the createTypeTable
        let oTable = this.byId("createTypeTable");
        let aSelectedItems = oTable.getSelectedItems();
        onCopyInput = [];
    
        // Iterating over selected items and printing values
        aSelectedItems.forEach(function(oItem) {
            let oBindingContext = oItem.getBindingContext();
            let oCode = oBindingContext.getProperty("Code");
            let oBname = oBindingContext.getProperty("Bname");
            let oValue = oBindingContext.getProperty("Value");
            let oCvalue = oBindingContext.getProperty("Cvalue");
            let oCunit = oBindingContext.getProperty("Cunit");
            let oDatatype = oBindingContext.getProperty("Datatype");
            let oTablename = oBindingContext.getProperty("Tablename");
            let oMulti_Choice = oBindingContext.getProperty("Multi_Choice");
    
            onCopyInput.push([oCode, oBname, oValue, oCvalue, oCunit, oDatatype, oTablename, oMulti_Choice]);
        });
    
        // Disable buttons and switch visibility
        oView.byId("deleteBtn").setEnabled(false);
        oView.byId("editBtn").setEnabled(false);
        oView.byId("copyBtn").setEnabled(false);
        oView.byId("entryBtn").setEnabled(false);
        oView.byId("createTypeTable").setVisible(false);
        oView.byId("entryTypeTable").setVisible(true);
        oView.byId("mainPageFooter").setVisible(true);
    
        // Clear and populate entryTypeTable
        let entryTable = oView.byId("entryTypeTable");
        entryTable.removeAllItems();
    
        for (let i = 0; i < onCopyInput.length; i++) {
            let Bname = onCopyInput[i][1];
            let Code = onCopyInput[i][0];
            let Value = onCopyInput[i][2];
            let Cvalue = onCopyInput[i][3];
            let Cunit = onCopyInput[i][4];
            let Datatype = onCopyInput[i][5];
            let Tablename = onCopyInput[i][6];
            let Multi_Choice = onCopyInput[i][7];
    
            // Create a Select control for Datatype
            let oDatatypeSelect = new sap.m.Select({
                forceSelection: false,
                width: "100%",
                items: [
                    new sap.ui.core.Item({ key: "CHAR", text: "CHAR" }),
                    new sap.ui.core.Item({ key: "CURR", text: "CURR" }),
                    new sap.ui.core.Item({ key: "DATE", text: "DATE" })
                ],
                selectedKey: Datatype, // Preselect existing Datatype
                change: function(oEvent) {
                    
                }
            });
    
            let newItem = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Input({ value: Code, liveChange: that.onCodeLiveChange.bind(that) }),
                    new sap.m.Input({ value: Bname, showValueHelp: true, valueHelpRequest: that.onMaintaingroup.bind(that), valueHelpOnly:true }),
                    new sap.m.Input({ value: Value, liveChange: that.onLiveChangeValue.bind(that) }),
                    new sap.m.Input({ value: Cvalue, type: sap.m.InputType.Number, liveChange: that.onLiveChangeCvalue.bind(that) }),
                    new sap.m.Input({ value: Cunit, showValueHelp: true, valueHelpRequest: that.onCurrencyPress.bind(that), valueHelpOnly:true }),
                    oDatatypeSelect,
                    new sap.m.Input({ value: Tablename, liveChange: that.onLiveChangeTablename.bind(that) }),
                    new sap.m.CheckBox({ selected: Multi_Choice, select: that.onSelectChange.bind(that) })
                ]
            });
            entryTable.addItem(newItem);
        }
      },
  
      pressEdit: function() {
        let that = this;
        let oView = this.getView();
    
        let oTable = this.byId("createTypeTable");
        let aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length === 0) {
            sap.m.MessageToast.show("Please select at least one row");
            return;
        }
        onEditInput = [];
    
        aSelectedItems.forEach(function(oItem) {
            let oBindingContext = oItem.getBindingContext();
            let oCode = oBindingContext.getProperty("Code");
            let oBname = oBindingContext.getProperty("Bname");
            let oValue = oBindingContext.getProperty("Value");
            let oCvalue = oBindingContext.getProperty("Cvalue");
            let oCunit = oBindingContext.getProperty("Cunit");
            let oDatatype = oBindingContext.getProperty("Datatype");
            let oTablename = oBindingContext.getProperty("Tablename");
            let oMulti_Choice = oBindingContext.getProperty("Multi_Choice");
    
            onEditInput.push([oCode, oBname, oValue, oCvalue, oCunit, oTablename, oDatatype, oMulti_Choice]);
        });
        editFlag = true;
    
        let oUpdateTable = oView.byId("updateTypeTable");
        oUpdateTable.removeAllItems();
    
        aSelectedItems.forEach(function(oSelectedItem) {
            let oContext = oSelectedItem.getBindingContext();
    
            
            let Bname = oContext.getProperty("Bname");
            let Code = oContext.getProperty("Code");
            let Value = oContext.getProperty("Value");
            let Cvalue = oContext.getProperty("Cvalue");
            let Cunit = oContext.getProperty("Cunit");
            let Datatype = oContext.getProperty("Datatype");
            let Tablename = oContext.getProperty("Tablename");
            let Multi_Choice = oContext.getProperty("Multi_Choice");
    
            let oDatatypeSelect = new sap.m.Select({
                forceSelection: false,
                width: "100%",
                items: [
                    new sap.ui.core.Item({ key: "CHAR", text: "CHAR" }),
                    new sap.ui.core.Item({ key: "CURR", text: "CURR" }),
                    new sap.ui.core.Item({ key: "DATE", text: "DATE" })
                ],
                selectedKey: Datatype, 
            });
    
            oDatatypeSelect.attachChange(function(oEvent) {
                let sNewDatatype = oEvent.getParameter("selectedItem").getKey();
            });
    
            let oColumnListItem = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({ text: Code }),
                    new sap.m.Text({ text: Bname }),
                    new sap.m.Input({ value: Value, liveChange: that.onLiveChangeValue.bind(that) }),
                    new sap.m.Input({ value: Cvalue, liveChange: that.onLiveChangeCvalue.bind(that), type: sap.m.InputType.Number }),
                    new sap.m.Input({ value: Cunit, showValueHelp: true,  valueHelpRequest: that.onCurrencyPress.bind(that), valueHelpOnly:true }),
                    oDatatypeSelect, // Replace Input with Select for Datatype
                    new sap.m.Input({ value: Tablename, liveChange: that.onLiveChangeTablename.bind(that) }),
                    new sap.m.CheckBox({ selected: Multi_Choice, select: that.onSelectChange.bind(that) })
                ]
            });
            oUpdateTable.addItem(oColumnListItem);
        });
    
        // Show updateTypeTable
        oUpdateTable.setVisible(true);
    
        // Hide createTypeTable
        oTable.setVisible(false);
    
        // Show footer for updateTypeTable
        oView.byId("mainPageFooter2").setVisible(true);
    
        // Disable other buttons
        oView.byId("deleteBtn").setEnabled(false);
        oView.byId("copyBtn").setEnabled(false);
        oView.byId("entryBtn").setEnabled(false);
        oView.byId("editBtn").setEnabled(false);
      },

      onSelectChange: function (oEvent) {
        console.log("checkbox selection changed");

      },
      onSearch: function (oEvent) {
        var sSearchValue = oEvent.getParameter("newValue");
        var oBinding = this._oTable.getBinding("items");

        var aFilters = [];
        if (sSearchValue && sSearchValue.length > 0) {
          var oFilter = new sap.ui.model.Filter([
            new sap.ui.model.Filter("Waers", sap.ui.model.FilterOperator.Contains, sSearchValue),
            new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, sSearchValue),
          ], false);
          aFilters.push(oFilter);
        }

        // Apply filters to the binding
        oBinding.filter(aFilters);
      },
    

      onAddRow1: function () {
        var oTable = this.byId("entryTypeTable");
        var items = oTable.getItems();
    
        // Validate existing rows
        for (let i = 0; i < items.length; i++) {
            let value1 = items[i].getCells()[0].getValue();
            let value2 = items[i].getCells()[1].getValue();
            let value3 = items[i].getCells()[2].getValue();
            let value4 = items[i].getCells()[3].getValue();
            let value6 = items[i].getCells()[5].getSelectedKey();
    
            if (!value1 || !value2 || !value3  ) {
                sap.m.MessageToast.show("Please enter fields before adding a new row");
                return;
            }
        }
    
        // Add a new row
        var oNewRow = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
                new sap.m.Input({ value: "", editable: true, showValueHelp: true, valueHelpRequest: this.onMaintaingroup.bind(this), valueHelpOnly: true }),
                new sap.m.Input({ value: "", liveChange: this.onLiveChangeValue.bind(this) }),
                new sap.m.Input({ value: "", type: sap.m.InputType.Number, liveChange: this.onLiveChangeCvalue.bind(this) }),
                new sap.m.Input({ value: "", editable: true, showValueHelp: true, valueHelpRequest: this.onCurrencyPress.bind(this), valueHelpOnly: true }),
                new sap.m.Select({
                    forceSelection: false,
                    liveChange: this.onLiveChangeDatatype.bind(this),
                    width: "30rem",
                    items: [
                        new sap.ui.core.Item({ id: "charType", key: "CHAR", text: "CHAR" }),
                        new sap.ui.core.Item({ id: "_IDGenItem2", key: "CURR", text: "CURR" }),
                        new sap.ui.core.Item({ id: "_IDGenItem3", key: "DATE", text: "DATE" })
                    ]
                }),
                new sap.m.Input({ value: "", liveChange: this.onLiveChangeTablename.bind(this) }),
                new sap.m.CheckBox({ select: this.onSelectChange.bind(this) })
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
        aSelectedItems.forEach(function (oSelectedItem) {
            oTable.removeItem(oSelectedItem);
        });
    
        oTable.removeSelections();
      },

      validateAllRows: function () {
        var oTable = this.byId("entryTypeTable");
        var items = oTable.getItems();
    
        for (let i = 0; i < items.length; i++) {
          let value1 = items[i].getCells()[0].getValue();
          let value2 = items[i].getCells()[1].getValue();
          let value3 = items[i].getCells()[2].getValue();
          let value4 = items[i].getCells()[3].getValue();
          let value5 = items[i].getCells()[4].getValue();
          let value6 = items[i].getCells()[5].getSelectedKey();
          let value7 = items[i].getCells()[6].getValue();
            if (!value1 || !value2 || !value3) {
                sap.m.MessageToast.show("Please enter all fields for all rows.");
                return false;
            }
        }
        return true;
      },

      onSave: function () {
        let that = this;
        let oTable = that.byId("entryTypeTable");
    
        if (!this.validateAllRows()) {
            sap.m.MessageToast.show("Please enter all fields for all rows.");
            return;
        }
    
        let totalEntries = oTable.getItems().length;
        let entriesProcessed = 0;
        let errors = [];
        let duplicateEntries = [];
        let oModel = this.getView().getModel();
    
        oTable.getItems().forEach(function (row) {
            let value1 = row.getCells()[0].getValue();
            let value2 = row.getCells()[1].getValue();
            let value3 = row.getCells()[2].getValue();
            let value4 = row.getCells()[3].getValue();
            let value5 = row.getCells()[4].getValue();
            let value6 = row.getCells()[5].getSelectedItem().getProperty('text');
            let value7 = row.getCells()[6].getValue();
            let value8 = row.getCells()[7].getSelected();
    
            // Validate each row's fields
            if (!value1 || !value2 || !value3 || !value6) {
                if (!errors.includes("Please enter all required fields for all rows.")) {
                    errors.push("Please enter all fields for all rows.");
                }
                entriesProcessed++;
                checkCompletion();
                return;
            }
    
            // Check for duplicate entries
            let oBindListSP = oModel.bindList("/xNAUTIxMASBID");
            oBindListSP.attachEventOnce("dataReceived", function () {
                let existingEntries = oBindListSP.getContexts(0, Infinity).map(function (context) {
                    return [context.getProperty("Code"), context.getProperty("Bname")];
                });
    
                existingEntries.forEach((entry) => {
                    if (entry.includes(value1) && entry.includes(value2)) {
                        duplicateEntries.push(value1);
                    }
                });
    
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
                    var errorMessage = "";
                    if (errors.length > 0) {
                        errorMessage += errors.join("\n") + "\n";
                    }
                    if (duplicateEntries.length > 0) {
                        errorMessage += "Duplicate entries found with the same code or User: " + duplicateEntries.join(", ") + "\n";
                    }
                    sap.m.MessageToast.show(errorMessage);
                }
            }
        }
    
        function createEntries() {
            let successStatus = true; // Assume success unless an error occurs
            oTable.getItems().forEach(function (row) {
                let value1 = row.getCells()[0].getValue().trim().toUpperCase();
                let value2 = row.getCells()[1].getValue().trim().toUpperCase();
                let value3 = row.getCells()[2].getValue().trim().toUpperCase();
                let value4 = parseFloat(row.getCells()[3].getValue());
                let value5 = row.getCells()[4].getValue().trim().toUpperCase();
                let value6 = row.getCells()[5].getSelectedItem().getProperty('text').trim().toUpperCase();
                let value7 = row.getCells()[6].getValue().trim().toUpperCase();
                let value8 = row.getCells()[7].getSelected();
    
                // Format value
                value4 = parseFloat(value4) ? parseFloat(value4) : 0;
    
                let oBindListSP = that.getView().getModel().bindList("/xNAUTIxMASBID");
                let payload = {
                    Code: value1,
                    Bname: value2,
                    Value: value3,
                    Cvalue: value4,
                    Cunit: value5,
                    Datatype: value6,
                    Tablename: value7,
                    Multi_Choice: value8
                };
    
                try {
                    oBindListSP.create(payload);
                    oBindListSP.attachCreateCompleted(function (oEvent) {
                        oEvent.getParameter("context").getModel().getMessagesByPath("").forEach(x => {
                            console.log(x.message);
                            MessageToast.show(x.message);
                        });
                    });
    
                    that.getView().getModel().refresh();
                    that.resetView();
                } catch (error) {
                    console.log("Error while saving data:", error);
                    successStatus = false;
                    sap.m.MessageToast.show("Error while saving data");
                }
            });
    
            if (successStatus) {
                that.resetView();
                oTable.removeSelections();
                sap.m.MessageToast.show("All entries saved successfully.");
            }
        }
    },
    

      formatUomdes: function (uomdes) {
        return uomdes.toLowerCase().replace(/\b\w/g, function (char) {
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
          let oCells = aItems[i].getCells();
          let sCode = oCells[0].getValue().trim(); // Index 1 corresponds to the Input field
          let sBname = oCells[1].getValue().trim();
          let sValue = oCells[2].getValue().trim();
          let sCvalue = oCells[3].getValue().trim();
          let sCunit = oCells[4].getValue().trim();
          let sDatatype = oCells[5].getSelectedKey().trim();
          let sTablename = oCells[6].getValue().trim();
          let sMulti_Choice = oCells[7].getSelected();

          if (sCode !== "" || sBname !== "" || sValue !== "" || sCvalue !== "" || sCunit !== "" || sTablename !== "" || sDatatype !== "" || sMulti_Choice !== false) {
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
      onMaintaingroup: function (oEvent) {
        var oView = this.getView();

        this._oInputField = oEvent.getSource();

        if (!this._oMaintainGroup) {
          this._oMaintainGroup = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.MaintainGroup", this);
          oView.addDependent(this._oMaintainGroup);
        }
        this._oMaintainGroup.open();
      },

      onMaintaingroupHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this._oInputField.setValue(oSelectedItem.getTitle());
      },

      onMaintainUserSearch: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");

        var oFilter1 = new sap.ui.model .Filter("bname", sap.ui.model.FilterOperator.Contains, sValue1);
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
 
      onCancelCopy: function () {

        var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
        var aItems = oTable.getItems();
        let flag = false;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var sCode = oCells[0].getValue().trim(); // Index 1 corresponds to the Input field
          var sBname = oCells[1].getValue().trim();
          var sValue = oCells[2].getValue().trim();
          var sCvalue = oCells[3].getValue().trim();
          var sCunit = oCells[4].getValue().trim();
          var sDatatype = oCells[5].getSelectedKey().trim();
          var sTablename = oCells[6].getValue().trim();
          var sMulti_Choice = oCells[7].getSelected();
          // var sValue = this.removeExtraSpaces(oInput.getValue());

          console.log(onCopyInput[i] + ":" + sValue + ":");
          let fieldsArr = onCopyInput[i];
          if (fieldsArr[0] !== sCode || fieldsArr[1] !== sBname || fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sTablename || fieldsArr[6] !== sDatatype || fieldsArr[7] !== sMulti_Choice) {
            flag = true;
        
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

      onUpdate: function() {
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");
    
        sap.ui.core.BusyIndicator.show(0);
    
        // Get all items from the updateTypeTable
        let aItems = oUpdateTable.getItems();
    
        let changesDetected = false; 
    
        aItems.forEach(function(oItem) {
            let oCells = oItem.getCells();
            let sValue = oCells[2].getValue().trim();
            let sCvalue = oCells[3].getValue().trim();
            let sCunit = oCells[4].getValue();
            let sDatatype = oCells[5].getSelectedKey(); 
            let sTablename = oCells[6].getValue().trim();
            let sMulti_Choice = oCells[7].getSelected();
    
            // Compare with original data in onEditInput
            let fieldsArr = onEditInput[aItems.indexOf(oItem)];
            if (fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sDatatype || fieldsArr[6] !== sTablename || fieldsArr[7] !== sMulti_Choice) {
                changesDetected = true;
                return; // Exit loop early if something changed
            }
        });
    
        // Show message if no changes are detected
        if (!changesDetected) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("No changes detected, nothing to update");
            return; // Exit function if no updates are needed
        }
    
        // Logic to update createTypeTable based on updateTypeTable changes
        aItems.forEach(function(oItem) {
            let oCells = oItem.getCells();
            let sCode = oCells[0].getText();
            let sBname = oCells[1].getText();
            let sValue = oCells[2].getValue().trim();
            let sCvalue = oCells[3].getValue().trim();
            let sCunit = oCells[4].getValue().trim();
            let sDatatype = oCells[5].getSelectedKey(); // Get selected Datatype key from Select control
            let sTablename = oCells[6].getValue().trim();
            let sMulti_Choice = oCells[7].getSelected();
    
            // Find corresponding item in createTypeTable
            let oCreateItem = oCreateTable.getItems().find(function(oCreateItem) {
                return oCreateItem.getCells()[1].getText() === sCode; // Assuming Bname is in the second cell
            });
    
            // Update corresponding item in createTypeTable
            if (oCreateItem) {
                oCreateItem.getCells()[2].setText(sValue.replace(/\s+/g, " ").trim().toUpperCase()); // Update Value
                oCreateItem.getCells()[3].setText(parseFloat(sCvalue)); // Update Cvalue
                oCreateItem.getCells()[4].setText(sCunit.replace(/\s+/g, " ").trim().toUpperCase()); // Update Cunit
                oCreateItem.getCells()[5].setText(sDatatype); // Update Datatype
                oCreateItem.getCells()[6].setText(sTablename.replace(/\s+/g, " ").trim().toUpperCase()); // Update Tablename
                oCreateItem.getCells()[7].setSelected(sMulti_Choice); // Update Multi_Choice
            }
        });
    
        // Show createTypeTable
        oCreateTable.setVisible(true).removeSelections();
    
        // Hide updateTypeTable
        oUpdateTable.setVisible(false);
    
        // Hide footer for updateTypeTable
        oView.byId("mainPageFooter2").setVisible(false);
    
        // Enable other buttons if needed
        oView.byId("deleteBtn").setEnabled(true);
        oView.byId("copyBtn").setEnabled(true);
        oView.byId("entryBtn").setEnabled(true);
        oView.byId("editBtn").setEnabled(true);
    
        // Perform additional operations or submit updates if required
        // Example: this.onPatchSent();
        // Example: oModel.submitBatch("update");
    
        setTimeout(function() {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Successfully Updated");
        }, 1000);
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
          var sCode = oCells[0].getText(); // Index 1 corresponds to the Input field
          var sBname = oCells[1].getText();
          var sValue = oCells[2].getValue().trim();
          var sCvalue = oCells[3].getValue().trim();
          var sCunit = oCells[4].getValue().trim();
          var sDatatype = oCells[5].getSelectedKey().trim();
          var sTablename = oCells[6].getValue().trim();
          var sMulti_Choice = oCells[7].getSelected();
          // var sValue = this.removeExtraSpaces(oInput.getValue());

          console.log(onEditInput[i] + ":" + sValue + ":");
          let fieldsArr = onEditInput[i];
          if (fieldsArr[0] !== sCode || fieldsArr[1] !== sBname || fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sTablename || fieldsArr[6] !== sDatatype || fieldsArr[7] !== sMulti_Choice) {
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
        // var aItems = oTable.getItems();
        // let flag = false;
        // for (let i = 0; i < aItems.length; i++) {
        //   var oCells = aItems[i].getCells();
        //   var oInput = oCells[1]; // Index 1 corresponds to the Input field
        //   var sValue = this.removeExtraSpaces(oInput.getValue());

        //   console.log(onEditInput[i] + ":" + sValue + ":");
        //   if (onEditInput[i] !== sValue.trim()) {
        //     flag = true;
        //     break;
        //   }
        // }

        // if (flag) {
        //   sap.m.MessageBox.confirm("Do you want to discard the changes?", {
        //     title: "Confirmation",
        //     onClose: function (oAction) {
        //       if (oAction === sap.m.MessageBox.Action.OK) {
        //         // Reset the view to its initial state
        //         this.resetView();
        //       }
        //     }.bind(this) // Ensure access to outer scope
        //   });
        // } else {
        //   // If no changes have been made, navigate to the initial screen immediately
        //   this.resetView();

        // }




      },

      resetView: function () {
        oView = this.getView();
        // Reset view to initial state
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        editFlag = false;
        copyFlag = false;
        newEntryFlag = false;
        oView.byId("createTypeTable").setVisible(true).removeSelections();
        // rest all field for entrytypetable
        oView.byId("Bname").setValue("");
        oView.byId("Code").setValue("");
        oView.byId("Value").setValue("");
        oView.byId("Cvalue").setValue("");
        oView.byId("Cunit").setValue("");
        oView.byId("Datatype").setSelectedKey("");
        oView.byId("Tablename").setValue("");
        oView.byId("Multi_Choice").setSelected(false);

        // reset all fields for updateTypeTable
        oView.byId("Code1").setText("");
        oView.byId("Bname1").setText("");
        oView.byId("Value1").setValue("");
        oView.byId("Cvalue1").setValue("");
        oView.byId("Cunit1").setValue("")
        oView.byId("Datatype1").setValue("")
        oView.byId("Tablename1").setValue("")
        oView.byId("Multi_Choice1").setSelected(false);

        this.getView().byId("editBtn").setEnabled(true);
        this.getView().byId("deleteBtn").setEnabled(true);
        this.getView().byId("copyBtn").setEnabled(true);
        this.getView().byId("entryBtn").setEnabled(true);
        this.byId("createTypeTable").setMode("MultiSelect");
      },

      onDeletePress: function () {

        let oTable = this.byId("createTypeTable");
        let aItems = oTable.getSelectedItems();
        if (!aItems.length) {

          MessageToast.show("Please Select  Atleast one Row ");
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