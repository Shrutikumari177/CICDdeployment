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
    let onEditInput = [];
    let onCopyInput = undefined;
    let myModel = undefined;
    let valueHelpInputref = {};
    let oBusyDialog;
    let oView;

    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}


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

        if (sValue.length > 10) {
          sValue = sValue.substring(0, 10);
          oInput.setValue(sValue);
          sap.m.MessageToast.show("Maximum length is 10 characters.");
        }

        if (/[^a-zA-Z0-9]/.test(sValue)) {
          sValue = sValue.replace(/[^a-zA-Z0-9]/g, '');

          oInput.setValue(sValue);
          sap.m.MessageToast.show("Only Alphanumeric characters are allowed.");
        }


      },
      onLiveChangeUser: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        var sNewValue = sValue.replace(/[^a-zA-Z0-9\W]/g, '');
        if (sNewValue.length > 30) {
          sNewValue = sNewValue.substring(0, 30);
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Maximum length is 30 characters.");
        }
        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Only Numbers, Alphabet, and Special Characters are allowed.");
        }

      },
      onLiveChangeValue: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        // Check if the length exceeds 30 characters
        if (sValue.length > 30) {
          var sTrimmedValue = sValue.substring(0, 30);
          oInput.setValue(sTrimmedValue);
          sap.m.MessageToast.show("Maximum length is 30 characters.");
          return;
        }

        // Allow only alphabet characters and spaces
        var sNewValue = sValue.replace(/[^a-zA-Z\s]/g, '');

        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Only alphabet characters are allowed.");
        }
      },



      onLiveChangeCvalue: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        if (sValue.length > 13) {
          var sTrimmedValue = sValue.substring(0, 13);
          oInput.setValue(sTrimmedValue);
          sap.m.MessageToast.show("Maximum length is 13 characters.");
          return;
        }

        var sFilteredValue = sValue.replace(/[^a-zA-Z0-9.\- ]/g, '');

        if (sFilteredValue !== sValue) {
          oInput.setValue(sFilteredValue);
          sap.m.MessageToast.show("Only alphanumeric characters, dots (.), hyphens (-), and spaces are allowed.");
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
        let selectedItem = oEvent.getParameter("selectedItem");
        if (selectedItem) {
          console.log("Selected Key:", selectedItem.getKey());
          console.log("Selected Text:", selectedItem.getText());
        } else {
          console.log("No item selected");
        }
      },
      onLiveChangeTablename: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        if (sValue.length > 20) {
          var sTrimmedValue = sValue.substring(0, 20);
          oInput.setValue(sTrimmedValue);
          sap.m.MessageToast.show("Maximum length is 20 characters.");
          return;
        }

        var sNewValue = sValue.replace(/[^a-zA-Z0-9\/]/g, '');

        if (sNewValue !== sValue) {
          oInput.setValue(sNewValue);
          sap.m.MessageToast.show("Only numbers, alphabets, forward slashes are allowed.");
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
          setTimeout(function () {
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

        if (this._oCurrency) {
          this._oCurrency.destroy();
          this._oCurrency = null;
        }

        this._oInputField = null;
      },



      CurSearch: function (oEvent) {

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

        oBinding.attachEventOnce("dataReceived", function () {
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

          oRouter.navTo("RouteMasterDashboard");
        } else if (aSelectedIds.length && !newEntryFlag && !copyFlag && !editFlag) {
          oRouter.navTo("RouteMasterDashboard");
          this.byId('createTypeTable').removeSelections();

        } else if (copyFlag) {
          this.onCancelCopy();
        } else if (newEntryFlag) {
          this.onCancelNewEntry();
        } else if (editFlag) {
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

        } else if (copyFlag) {
         
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
            var sDatatype = oCells[5].getSelectedKey();
            var sTablename = oCells[6].getSelectedItem().getText();
            var sMulti_Choice = oCells[7].getSelected();
            // var sValue = this.removeExtraSpaces(oInput.getValue());

            console.log(onCopyInput[i] + ":" + sValue + ":");
            let fieldsArr = onCopyInput[i];
            if (fieldsArr[0] !== sCode || fieldsArr[1] !== sBname || fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sDatatype  || fieldsArr[6] !== sTablename || fieldsArr[7] !== sMulti_Choice) {
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
        } else if (aSelectedIds.length && !newEntryFlag && !copyFlag && !editFlag) {
          oRouter.navTo("RouteHome");
          this.byId("createTypeTable").removeSelections();
        } else if (newEntryFlag) {
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
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();


        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {


          if (oSelectedItem.getBindingContext()) {

            let cells = oSelectedItem.getCells();

            let oContext = oSelectedItem.getBindingContext();
            return [oContext.getProperty("profileId"), oContext.getProperty("Code"), oContext.getProperty("Value"), oContext.getProperty("Cvalue"), oContext.getProperty("Cunit"), oContext.getProperty("Datatype"), oContext.getProperty("Tablename"), oContext.getProperty("Multi_Choice")];

          }

        });
        console.log(aSelectedIds);
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
          firstItemCells[6].setSelectedKey("");
          firstItemCells[7].setSelected(false);


        } else {
          MessageToast.show("Unselect the Selected Row !");
        }
      },

      pressCopy1: function () {
        if (aSelectedIds.length === 0) {
          sap.m.MessageToast.show("Please select at least one row");
          return;
        }
        newEntryFlag = false;
        editFlag = false;
        copyFlag = true;

        let that = this;
        let oView = this.getView();

        let oTable = this.byId("createTypeTable");
        let aSelectedItems = oTable.getSelectedItems();
        onCopyInput = [];

        aSelectedItems.forEach(function (oItem) {
          let oBindingContext = oItem.getBindingContext();
          let oBidprofileId = oBindingContext.getProperty("profileId");
          // let oBname = oBindingContext.getProperty("Bname");
          let oCode = oBindingContext.getProperty("Code");
          let oValue = oBindingContext.getProperty("Value");
          let oCvalue = oBindingContext.getProperty("Cvalue");
          let oCunit = oBindingContext.getProperty("Cunit");
          let oDatatype = oBindingContext.getProperty("Datatype");
          let oTablename = oBindingContext.getProperty("Tablename");
          let oMultiChoice = oBindingContext.getProperty("Multi_Choice");

          onCopyInput.push([oBidprofileId, oCode, oValue, oCvalue, oCunit, oDatatype, oTablename, oMultiChoice]);
        });



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
          let BidprofileId = onCopyInput[i][0];
          let Code = onCopyInput[i][1];
          let Value = onCopyInput[i][2];
          let Cvalue = onCopyInput[i][3];
          let Cunit = onCopyInput[i][4];
          let Datatype = onCopyInput[i][5];
          let Tablename = onCopyInput[i][6];
          let MultiChoice = onCopyInput[i][7];

          let oDatatypeSelect = new sap.m.Select({
            forceSelection: false,
            width: "100%",
            items: [
              new sap.ui.core.Item({
                key: "CHAR",
                text: "CHAR"
              }),
              new sap.ui.core.Item({
                key: "CURR",
                text: "CURR"
              }),
              new sap.ui.core.Item({
                key: "DATE",
                text: "DATE"
              })
            ],
            selectedKey: Datatype,
            change: function (oEvent) {

            }
          });

          let newItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Input({
                value: BidprofileId,
                liveChange: that.onCodeLiveChange.bind(that)
              }),
              // new sap.m.Input({ value: Bname, showValueHelp: true, valueHelpRequest: that.onMaintaingroup.bind(that), valueHelpOnly: true }),
              new sap.m.Input({
                value: Code,
                liveChange: that.onCodeLiveChange.bind(that)
              }),
              new sap.m.Input({
                value: Value,
                liveChange: that.onLiveChangeValue.bind(that)
              }),
              new sap.m.Input({
                value: Cvalue,
                type: sap.m.InputType.Number,
                liveChange: that.onLiveChangeCvalue.bind(that)
              }),
              new sap.m.Input({
                value: Cunit,
                showValueHelp: true,
                valueHelpRequest: that.onCurrencyPress.bind(that),
                valueHelpOnly: true
              }),
              oDatatypeSelect,
              new sap.m.Input({
                value: Tablename,
                liveChange: that.onLiveChangeTablename.bind(that)
              }),
              new sap.m.CheckBox({
                selected: MultiChoice,
                select: that.onSelectChange.bind(that)
              })
            ]
          });
          entryTable.addItem(newItem);
        }
      },
      pressCopy: function () {
        if (aSelectedIds.length === 0) {
            sap.m.MessageToast.show("Please select at least one row");
            return;
        }
        
        newEntryFlag = false;
        editFlag = false;
        copyFlag = true;
    
        let that = this;
        let oView = this.getView();
    
        let oTable = this.byId("createTypeTable");
        let aSelectedItems = oTable.getSelectedItems();
        onCopyInput = [];
    
        // Extract data without affecting createTypeTable
        aSelectedItems.forEach(function (oItem) {
            let oBindingContext = oItem.getBindingContext();
            let oBidprofileId = oBindingContext.getProperty("profileId");
            let oCode = oBindingContext.getProperty("Code");
            let oValue = oBindingContext.getProperty("Value");
            let oCvalue = oBindingContext.getProperty("Cvalue");
            let oCunit = oBindingContext.getProperty("Cunit");
            let oDatatype = oBindingContext.getProperty("Datatype");
            let oTablename = oBindingContext.getProperty("Tablename");
            let oMultiChoice = oBindingContext.getProperty("Multi_Choice");
    
            onCopyInput.push([oBidprofileId, oCode, oValue, oCvalue, oCunit, oDatatype, oTablename, oMultiChoice]);
        });
    
        // Disable buttons and toggle table visibility
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
    
        onCopyInput.forEach(function (input) {
            let [BidprofileId, Code, Value, Cvalue, Cunit, Datatype, Tablename, MultiChoice] = input;
    
            let oDatatypeSelect = new sap.m.Select({
                forceSelection: false,
                width: "100%",
                items: [
                    new sap.ui.core.Item({ key: "CHAR", text: "CHAR" }),
                    new sap.ui.core.Item({ key: "CURR", text: "CURR" }),
                    new sap.ui.core.Item({ key: "DATE", text: "DATE" })
                ],
                selectedKey: Datatype
            });

          let selectedTablenameKey = "";

          switch (Tablename) {
              case "/NAUTI/CLASS":
                  selectedTablenameKey = "CLASS";
                  break;
              case "/NAUTI/ZCOUNTRY":
                  selectedTablenameKey = "COUNTRY";
                  break;
              case "/NAUTI/ZPORT":
                  selectedTablenameKey = "PORT";
                  break;
              default:
                  selectedTablenameKey = ""; // or handle it accordingly if not found
          }

            let oTablenameSelect = new sap.m.Select({
              forceSelection: false,
              width: "100%",
              items: [
                  new sap.ui.core.Item({ key: "CLASS", text: "/NAUTI/CLASS" }),
                  new sap.ui.core.Item({ key: "COUNTRY", text: "/NAUTI/ZCOUNTRY" }),
                  new sap.ui.core.Item({ key: "PORT", text: "/NAUTI/ZPORT" })
              ],
              selectedKey: selectedTablenameKey
            });

            console.log("Tablename:", Tablename);
    
            let newItem = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Input({ value: BidprofileId, liveChange: that.onCodeLiveChange.bind(that) }),
                    new sap.m.Input({ value: Code, liveChange: that.onCodeLiveChange.bind(that) }),
                    new sap.m.Input({ value: Value, liveChange: that.onLiveChangeValue.bind(that) }),
                    new sap.m.Input({ value: Cvalue, type: sap.m.InputType.Number, liveChange: that.onLiveChangeCvalue.bind(that) }),
                    new sap.m.Input({ value: Cunit, showValueHelp: true, valueHelpRequest: that.onCurrencyPress.bind(that), valueHelpOnly: true }),
                    oDatatypeSelect,
                    oTablenameSelect,
                    new sap.m.CheckBox({ selected: MultiChoice, select: that.onSelectChange.bind(that) })
                ]
            });
    
            entryTable.addItem(newItem);
        });
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

        for (let i = 0; i < items.length; i++) {
          let value1 = items[i].getCells()[0].getValue();
          let value2 = items[i].getCells()[1].getValue();
          let value3 = items[i].getCells()[2].getValue();
          let value4 = items[i].getCells()[3].getValue();
          let value5 = items[i].getCells()[6].getSelectedKey();

          if (!value1 || !value2 || !value3) {
            sap.m.MessageToast.show("Please enter fields before adding a new row");
            return;
          }
        }

        var oNewRow = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Input({
              value: "",
              liveChange: this.onCodeLiveChange.bind(this)
            }),
            new sap.m.Input({
              value: "",
              liveChange: this.onCodeLiveChange.bind(this)
            }),
            new sap.m.Input({
              value: "",
              liveChange: this.onLiveChangeValue.bind(this)
            }),
            new sap.m.Input({
              value: "",
              type: sap.m.InputType.Number,
              liveChange: this.onLiveChangeCvalue.bind(this)
            }),
            new sap.m.Input({
              value: "",
              editable: true,
              showValueHelp: true,
              valueHelpRequest: this.onCurrencyPress.bind(this),
              valueHelpOnly: true
            }),
            new sap.m.Select({
              forceSelection: false,
              liveChange: this.onLiveChangeDatatype.bind(this),
              width: "30rem",
              items: [
                new sap.ui.core.Item({
                  key: "CHAR",
                  text: "CHAR"
                }),
                new sap.ui.core.Item({
                  key: "CURR",
                  text: "CURR"
                }),
                new sap.ui.core.Item({
                  key: "DATE",
                  text: "DATE"
                })
              ]
            }),
            new sap.m.Select({
              forceSelection: false, 
              liveChange: this.onLiveChangeTablename.bind(this),            
              width: "30rem",
              items: [
                new sap.ui.core.Item({
                  key: "CLASS",
                  text: "/NAUTI/CLASS"
                }),
                new sap.ui.core.Item({
                  key: "COUNTRY",
                  text: "/NAUTI/ZCOUNTRY"
                }),
                new sap.ui.core.Item({
                  key: "PORT",
                  text: "/NAUTI/ZPORT"
                })
              ]
            }),
            // new sap.m.Input({
            //   value: "",
            //   liveChange: this.onLiveChangeTablename.bind(this)
            // }),
            new sap.m.CheckBox({
              select: this.onSelectChange.bind(this)
            })
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
          if (oCell instanceof sap.m.Input) {
            return oCell.getValue() === "";
          } else if (oCell instanceof sap.m.Select) {
            return oCell.getSelectedKey() === "";
          } else if (oCell instanceof sap.m.CheckBox) {
            return !oCell.getSelected();
          }
          return true;
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
                  if (oCell instanceof sap.m.Input) {
                    oCell.setValue("");
                  } else if (oCell instanceof sap.m.Select) {
                    oCell.setSelectedKey("");
                  } else if (oCell instanceof sap.m.CheckBox) {
                    oCell.setSelected(false);
                  }
                });
              } else {
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
          let value1 = items[i].getCells()[0].getValue(); //Bid Profile Id
          let value3 = items[i].getCells()[1].getValue(); // Code
          let value4 = items[i].getCells()[2].getValue(); //Value
          let value7 = items[i].getCells()[5].getSelectedKey(); //Data Type
            if (!value1 || !value3 || !value4 || !value7) {
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
            sap.m.MessageToast.show("Please enter the required field.");
            return;
        }
    
        var totalEntries = oTable.getItems().length;
        var entriesProcessed = 0;
        var errors = [];
        var duplicateEntries = [];
        
        var items = oTable.getItems();
        var newEntries = [];
    
        for (var i = 0; i < items.length; i++) {
          let value1 = items[i].getCells()[0].getValue(); // Bid Profile Id
          let value3 = items[i].getCells()[1].getValue(); // Code
          let value4 = items[i].getCells()[2].getValue(); // Value
          let value7 = items[i].getCells()[5].getSelectedKey(); // Data Type
  
          if (!value1 || !value3 || !value4 || !value7) {
              errors.push("Please enter the required field.");
              entriesProcessed++;
              checkCompletion();
              return;
          }
          newEntries.push({ BidProfileId: value1.trim().toUpperCase(), Code: value3.trim().toUpperCase() });
        }
        console.log("New Entries Collected: ", newEntries);
    
        var oBindListSP = that.getView().getModel().bindList("/BidMasterSet");
        oBindListSP.attachEventOnce("dataReceived", function () {
            var existingEntries = oBindListSP.getContexts().map(function (context) {
                return {
                    BidprofileId: context.getProperty("BidprofileId").trim().toUpperCase(),
                    Code: context.getProperty("Code").trim().toUpperCase()
                };
            });
            newEntries.forEach(function (newEntry, index) {
                var duplicateInBackend = existingEntries.some(function (entry) {
                    return entry.BidprofileId === newEntry.BidProfileId && entry.Code === newEntry.Code;
                });
    
                if (duplicateInBackend) {
                    duplicateEntries.push("Row " + (index + 1) + " (Bid Profile Id: " + newEntry.BidProfileId + ", Code: " + newEntry.Code + ")");
                }
            });
    
            const seenEntries = new Set();
            newEntries.forEach(function (entry, index) {
                const entryIdentifier = entry.BidProfileId + "|" + entry.Code; // Unique identifier
                if (seenEntries.has(entryIdentifier)) {
                    duplicateEntries.push("Row " + (index + 1) + " (Bid Profile Id: " + entry.BidProfileId + ", Code: " + entry.Code + ")");
                } else {
                    seenEntries.add(entryIdentifier);
                }
            });
            console.log("Duplicate Entries Found: ", duplicateEntries);
    
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
                let value1 = row.getCells()[0].getValue().trim().toUpperCase();
                let value3 = row.getCells()[1].getValue().trim().toUpperCase();
                let value4 = row.getCells()[2].getValue().trim().toUpperCase();
                let value5 = parseFloat(row.getCells()[3].getValue()) || 0;
                let value6 = row.getCells()[4].getValue().trim().toUpperCase();
                let value7 = row.getCells()[5].getSelectedItem().getText().trim().toUpperCase();
                let value8 = row.getCells()[6].getSelectedItem()?.getText() || "".trim().toUpperCase();
                let value9 = row.getCells()[7].getSelected();
    
                var oBindListSP = that.getView().getModel().bindList("/BidMasterSet");
    
                try {
                    oBindListSP.create({
                        BidprofileId: value1,
                        Bname: "",
                        Code: value3,
                        Value: value4,
                        Cvalue: value5,
                        Cunit: value6,
                        Datatype: value7,
                        Tablename: value8,
                        MultiChoice: value9
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
          let oCells = aItems[i].getCells();
          let sBidprofileId = oCells[0].getValue().trim();
          // let sBname = oCells[1].getValue().trim();
          let sCode = oCells[1].getValue().trim();
          let sValue = oCells[2].getValue().trim();
          let sCvalue = oCells[3].getValue().trim();
          let sCunit = oCells[4].getValue().trim();
          let sDatatype = oCells[5].getSelectedKey().trim();
          let sTablename = oCells[6].getSelectedKey().trim();
          let sMulti_Choice = oCells[7].getSelected();

          if (sBidprofileId !== "" || sCode !== "" || sValue !== "" || sCvalue !== "" || sCunit !== "" || sTablename !== "" || sDatatype !== "" || sMulti_Choice !== false) {
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
        console.log("fhgjkloll", onCopyInput);

        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var sBidprofileId = oCells[0].getValue().trim();
          var sCode = oCells[1].getValue().trim();
          var sValue = oCells[2].getValue().trim();
          var sCvalue = oCells[3].getValue().trim();
          var sCunit = oCells[4].getValue().trim();
          var sDatatype = oCells[5].getSelectedKey().trim();
          var sTablename = oCells[6].getSelectedItem()?.getText() || "";
          var sMultiChoice = oCells[7].getSelected();

          let fieldsArr = onCopyInput[i];
          console.log("sdfghjkl;", fieldsArr);
          if (!fieldsArr || fieldsArr.length < 8) {
            continue;
          }

          if (fieldsArr[0] !== sBidprofileId || fieldsArr[1] !== sCode || fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sDatatype || fieldsArr[6] !== sTablename || fieldsArr[7] !== sMultiChoice) {
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

      onCancelEdit: function () {
        var oTable = this.byId("updateTypeTable");
        var aItems = oTable.getItems();
        let flag = false;

        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          var sBidprofileId = oCells[0].getText();
          var sCode = oCells[1].getText();
          var sValue = oCells[2].getValue().trim();
          var sCvalue = oCells[3].getValue().trim();
          var sCunit = oCells[4].getValue().trim();
          var sDatatype = oCells[5].getSelectedKey().trim();
          var sTablename = oCells[6].getSelectedItem()?.getText() || "";
          var sMultiChoice = oCells[7].getSelected();

          let fieldsArr = onEditInput[i];
          if (!fieldsArr) {
            console.warn(`No entry found in onEditInput for index ${i}`);
            flag = true;
            break;
          }

          if (
            fieldsArr[0] !== sBidprofileId ||
            fieldsArr[1] !== sCode ||
            fieldsArr[2] !== sValue ||
            fieldsArr[3] !== sCvalue ||
            fieldsArr[4] !== sCunit ||
            fieldsArr[5] !== sDatatype ||
            fieldsArr[6] !== sTablename ||
            fieldsArr[7] !== sMultiChoice
          ) {
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
        oView = this.getView();
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        editFlag = false;
        copyFlag = false;
        newEntryFlag = false;
        oView.byId("createTypeTable").setVisible(true).removeSelections();
        oView.byId("BidprofileId").setValue("");

        oView.byId("Code").setValue("");
        oView.byId("Value").setValue("");
        oView.byId("Cvalue").setValue("");
        oView.byId("Cunit").setValue("");
        oView.byId("Datatype").setSelectedKey("");
        oView.byId("Tablename").setValue("");
        oView.byId("Multi_Choice").setSelected(false);

        oView.byId("BidprofileId1").setText("");
        oView.byId("Code1").setText("");
        oView.byId("Value1").setValue("");
        oView.byId("Cvalue1").setValue("");
        oView.byId("Cunit1").setValue("")
        oView.byId("Datatype1").setValue("")
        oView.byId("Tablename1").setValue("")
        oView.byId("MultiChoice1").setSelected(false);

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
        let deleteMsg = slength === 1 ? "Record" : "Records";
        let oModel = this.getOwnerComponent().getModel();

        aItems.forEach((oItem) => {
          const oContext = oItem.getBindingContext();
          const oData = oContext.getObject();
          let profileId = oData.profileId;
          let code = oData.Code;
          console.log("data to be deleted", profileId, code);
          let that = this;
          let oBindList = oModel.bindList("/BidMasterSet");

          oBindList.requestContexts(0, Infinity).then((aContexts) => {
            aContexts.forEach((oContext) => {
              if (oContext.getObject().BidprofileId === profileId && oContext.getObject().Code === code) {
                oContext.delete().then(function () {
                  oModel.refresh();

                  MessageToast.show(`${deleteMsg} deleted sucessfully`);
                  that.resetView();
                  oBusyDialog.close();
                }).catch((oError) => {
                  if(oError.error.message.includes('Code exists in voyage, do not delete')){
                    sap.m.MessageBox.error("Code already used in voyage, Can't be deleted")
                  }else{
                    sap.m.MessageBox.error( oError.message);
                  }
                  oBusyDialog.close();
                });
              };
            });
          });
          let oTable = this.byId("createTypeTable");
          oTable.removeSelections();
        })
      },

      onPatchSent: function (ev) {
        this.resetView();
      },

      onPatchCompleted: function (ev) {
        let oView = this.getView();
        let isSuccess = ev.getParameter('success');

        if (isSuccess) {
          this.resetView();
          oView.getModel().refresh();
          sap.m.MessageToast.show("Successfully Updated.");
        } else {
          sap.m.MessageToast.show("Fail to Update.")
        }
      },
      
      onUpdate: async function () {
        let that = this;
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");
    
        let aItems = oUpdateTable.getItems();
        let flagNothingtoUpdate = true;
    
        for (let i = 0; i < aItems.length; i++) {
          let oItem = aItems[i];
          let sValue = oItem.getCells()[2].getValue().trim();
          let sCvalue = oItem.getCells()[3].getValue().trim();
          let sCunit = oItem.getCells()[4].getValue().trim();
          let sDatatype = oItem.getCells()[5].getSelectedKey();
          let sTablename = oItem.getCells()[6].getSelectedItem()?.getText() || "";
          let sMultiChoice = oItem.getCells()[7].getSelected();
  
          if (!sValue || !sDatatype) {
              sap.m.MessageToast.show("Please enter the required field");
              return;
          }
          let fieldsArr = onEditInput[i];
          if (fieldsArr) {
  
            if (
                fieldsArr[2].trim() !== sValue ||
                fieldsArr[3].trim() !== sCvalue ||
                fieldsArr[4].trim() !== sCunit ||
                fieldsArr[5].trim() !== sDatatype ||
                fieldsArr[6].trim() !== sTablename ||
                fieldsArr[7] !== sMultiChoice
            ) {
                flagNothingtoUpdate = false;
            }
          }
        }
    
        if (flagNothingtoUpdate) {
            sap.m.MessageToast.show("Nothing to update");
            return;
        }
    
        let oBusyDialog = new sap.m.BusyDialog({
            text: "Updating your data..."
        });
        oBusyDialog.open();
    
        try {
            let values = [];
            aItems.forEach(function (oItem) {
                let sBidprofileId = oItem.getCells()[0].getText();
                let sCode = oItem.getCells()[1].getText();
                let sValue = oItem.getCells()[2].getValue().trim();
                let sCvalue = oItem.getCells()[3].getValue().trim();
                let sCunit = oItem.getCells()[4].getValue().trim();
                let sDatatype = oItem.getCells()[5].getSelectedKey();
                let sTablename = oItem.getCells()[6].getSelectedItem()?.getText() || "";
                let sMultiChoice = oItem.getCells()[7].getSelected();
    
                values.push({
                    BidprofileId: sBidprofileId,
                    Code: sCode,
                    Value: sValue,
                    Cvalue: sCvalue,
                    Cunit: sCunit,
                    Datatype: sDatatype,
                    Tablename: sTablename,
                    MultiChoice: sMultiChoice
                });
            });

            console.log("values: ", values);
    
            let oModel = this.getOwnerComponent().getModel();
            let oBinding = oModel.bindList("/BidMasterSet");
    
            let aContexts = await oBinding.requestContexts();
    
       
            for (const value of values) {
              let oContextToUpdate = aContexts.find(function (oContext) {
                  return oContext.getProperty("BidprofileId") === value.BidprofileId &&
                         oContext.getProperty("Code") === value.Code &&
                         oContext.getProperty("Bname") === "";
              });


    
                if (oContextToUpdate) {
                    oContextToUpdate.setProperty("Value", value.Value);
                    oContextToUpdate.setProperty("Cvalue", value.Cvalue);
                    oContextToUpdate.setProperty("Cunit", value.Cunit);
                    oContextToUpdate.setProperty("Datatype", value.Datatype);
                    oContextToUpdate.setProperty("Tablename", value.Tablename);
                    oContextToUpdate.setProperty("MultiChoice", value.MultiChoice);
    
                    await oModel.submitBatch("update");
                } else {
                    throw new Error("Entity not found.");
                }
            }
            oModel.refresh();
            oView.getModel().refresh();
            oCreateTable.setVisible(true).removeSelections();
            oUpdateTable.setVisible(false);
            oView.byId("deleteBtn").setEnabled(true);
            oView.byId("copyBtn").setEnabled(true);
            oView.byId("entryBtn").setEnabled(true);
            oView.byId("editBtn").setEnabled(true);
    
            this.onPatchSent();
    
            setTimeout(() => {
              this.onPatchCompleted({
                  getParameter: () => ({
                      success: true
                  })
              });
              oUpdateTable.removeAllItems();
              oBusyDialog.close();
            }, 1000);
    
        } catch (error) {
            oBusyDialog.close();
            sap.m.MessageBox.error("Error updating data: " + error.message);
        }
      },

    
    
    pressEdit: function () {
      let that = this;
      let oView = this.getView();
      let oTable = this.byId("createTypeTable");
      let aSelectedItems = oTable.getSelectedItems();

      if (aSelectedItems.length === 0) {
        sap.m.MessageToast.show("Please select at least one row");
        return;
      }

      onEditInput = aSelectedItems.map(function (oItem) {
        let oContext = oItem.getBindingContext();
        return [
          oContext.getProperty("profileId"),
          oContext.getProperty("Code"),
          oContext.getProperty("Value"),
          oContext.getProperty("Cvalue"),
          oContext.getProperty("Cunit"),
          oContext.getProperty("Datatype"),
          oContext.getProperty("Tablename"),
          oContext.getProperty("Multi_Choice")
        ];
      });
      console.log("datsgjj", onEditInput);
      editFlag = true;

      let oUpdateTable = oView.byId("updateTypeTable");
      oUpdateTable.removeAllItems();

      aSelectedItems.forEach(function (oSelectedItem) {
        let oContext = oSelectedItem.getBindingContext();
        let properties = {
          BidprofileId: oContext.getProperty("profileId"),
          Code: oContext.getProperty("Code"),
          Value: oContext.getProperty("Value").trim().replace(/\s+/g, ' '),
          Cvalue: oContext.getProperty("Cvalue"),
          Cunit: oContext.getProperty("Cunit"),
          Datatype: oContext.getProperty("Datatype"),
          Tablename: oContext.getProperty("Tablename"),
          MultiChoice: oContext.getProperty("Multi_Choice")
        };

        let oDatatypeSelect = new sap.m.Select({
          forceSelection: false,
          width: "100%",
          items: [
            new sap.ui.core.Item({
              key: "CHAR",
              text: "CHAR"
            }),
            new sap.ui.core.Item({
              key: "CURR",
              text: "CURR"
            }),
            new sap.ui.core.Item({
              key: "DATE",
              text: "DATE"
            })
          ],
          selectedKey: properties.Datatype
        }).attachChange(function (oEvent) {
          let sNewDatatype = oEvent.getParameter("selectedItem").getKey();
        });

        let selectedTablenameKey = "";

        switch (properties.Tablename) {
            case "/NAUTI/CLASS":
                selectedTablenameKey = "CLASS";
                break;
            case "/NAUTI/ZCOUNTRY":
                selectedTablenameKey = "COUNTRY";
                break;
            case "/NAUTI/ZPORT":
                selectedTablenameKey = "PORT";
                break;
            default:
                selectedTablenameKey = "";
        }

        let oTablenameSelect = new sap.m.Select({
          forceSelection: false,
          width: "100%",
          items: [
            new sap.ui.core.Item({
              key: "CLASS",
              text: "/NAUTI/CLASS"
            }),
            new sap.ui.core.Item({
              key: "COUNTRY",
              text: "/NAUTI/ZCOUNTRY"
            }),
            new sap.ui.core.Item({
              key: "PORT",
              text: "/NAUTI/ZPORT"
            })
          ],
          selectedKey:selectedTablenameKey


        }).attachChange(function (oEvent) {
          let sNewTablename = oEvent.getParameter("selectedItem").getKey();
        });

        console.log("Tablename:",properties.Tablename )



        let oColumnListItem = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Text({
              text: properties.BidprofileId
            }),
            new sap.m.Text({
              text: properties.Code
            }),
            new sap.m.Input({
              value: properties.Value,
              liveChange: that.onLiveChangeValue.bind(that)
            }),
            new sap.m.Input({
              value: properties.Cvalue,
              liveChange: that.onLiveChangeCvalue.bind(that),
              type: sap.m.InputType.Number
            }),
            new sap.m.Input({
              value: properties.Cunit,
              showValueHelp: true,
              valueHelpRequest: that.onCurrencyPress.bind(that),
              valueHelpOnly: true
            }),
            oDatatypeSelect,
            oTablenameSelect,
            new sap.m.CheckBox({
              selected: properties.MultiChoice,
              select: that.onSelectChange.bind(that)
            })
          ]
        });

        oUpdateTable.addItem(oColumnListItem);
      });

      oUpdateTable.setVisible(true);
      oTable.setVisible(false);
      oView.byId("mainPageFooter2").setVisible(true);

      oView.byId("deleteBtn").setEnabled(false);
      oView.byId("copyBtn").setEnabled(false);
      oView.byId("entryBtn").setEnabled(false);
      oView.byId("editBtn").setEnabled(false);
    },

      
    });

  });