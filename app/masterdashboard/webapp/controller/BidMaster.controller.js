sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
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


    // let inputFieldObj = {};
    // let saveObj = {};
    // let cancelObj = {}

    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.BidMaster", {

      onInit: function () {
        var fieldValueToFilter = "EN"; // Set your dynamic filter value here
        var filter = new sap.ui.model.Filter("spras", sap.ui.model.FilterOperator.StartsWith, fieldValueToFilter);
        let oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("/odata/v4/nautical/StandardCurrencySet", [filter])
        console.log(oModel);
        oModel.attachRequestCompleted(function () {

          var modeldata = oModel.getData().value;
          oModel.setData(modeldata);
          this.getView().setModel(oModel, "CurrencyMode");
          // console.log("Currency Data ", this.getView().getModel("CurrencyMode").getData());

        }.bind(this));
        var oView = this.getView();
        myModel = oModel;
        // Access the table by its ID
        var oTable = oView.byId("createTypeTable");

        // Set the binding mode to Single
        // oTable.setMode(sap.m.ListMode.Single);


        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);

        //   this.initSearchField();

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
      onLiveChangeUser: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // Remove any characters that are not numbers, alphabets, or special characters
        var sNewValue = sValue.replace(/[^a-zA-Z0-9\W]/g, '');

        // Check if the input value has changed after removing unwanted characters
        if (sNewValue !== sValue) {
          // Update the value of the input to only contain allowed characters
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Only numbers, alphabet, and special characters are allowed.");
        }

        // Check if the length of the value exceeds 30
        if (sNewValue.length > 30) {
          // Truncate the value to keep only the first 30 characters
          sNewValue = sNewValue.substring(0, 30);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 30 characters.");
        }
      },
      onLiveChangeValue: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // Remove any characters that are not numbers, alphabets, or special characters
        var sNewValue = sValue.replace(/[^a-zA-Z\W]/g, '');

        // Check if the input value has changed after removing unwanted characters
        if (sNewValue !== sValue) {
          // Update the value of the input to only contain allowed characters
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Only alphabet characters are allowed.");
        }

        // Check if the length of the value exceeds 50
        if (sNewValue.length > 30) {
          // Truncate the value to keep only the first 50 characters
          sNewValue = sNewValue.substring(0, 50);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 50 characters.");
        }
      },
      onLiveChangeCvalue: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // // Remove any characters that are not numbers, alphabets, or special characters
        // var sNewValue = sValue.replace(/[^0-9]/g, '');


        // // Check if the input value has changed after removing unwanted characters
        // if (sNewValue !== sValue) {
        //   // Update the value of the input to only contain allowed characters
        //   oInput.setValue(sNewValue);

        //   // Show a message to the user
        //   sap.m.MessageToast.show("Only decimal values are allowed.");
        // }

        // Check if the length of the value exceeds 13
        if (sValue.length > 13) {
          // Truncate the value to keep only the first 30 characters
          let sNewValue = sValue.substring(0, 13);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Maximum length is 13 digits.");
        }
      },
      onLiveChangeCunit: function (oEvent) {
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // Remove any characters that are not numbers, alphabets, or special characters
        var sNewValue = sValue.replace(/[^a-zA-Z]/g, '');

        // Check if the input value has changed after removing unwanted characters
        if (sNewValue !== sValue) {
          // Update the value of the input to only contain allowed characters
          oInput.setValue(sNewValue);

          // Show a message to the user
          sap.m.MessageToast.show("Only alphabet characters are allowed.");
        }

        // Check if the length of the value exceeds 30
        if (sNewValue.length > 5) {
          // Truncate the value to keep only the first 5 characters
          sNewValue = sNewValue.substring(0, 5);

          // Update the value of the input
          oInput.setValue(sNewValue);

          // Show a message to the user
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
        // Get the input control
        var oInput = oEvent.getSource();

        // Get the current value of the input
        var sValue = oInput.getValue();

        // Remove any characters that are not numbers, alphabets, or special characters
        var sNewValue = sValue.replace(/[^a-zA-Z0-9/]/g, '');

        // Check if the input value has changed after removing unwanted characters
        if (sNewValue !== sValue) {
          // Update the value of the input to only contain allowed characters
          oInput.setValue(sNewValue);

          // Show a message to the user
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



      onBackPress: function () {
        const that = this;
        let oEntryTable = that.getView().byId("entryTypeTable");
        let oupdateTable = that.getView().byId("updateTypeTable");

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
          var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var sCode = oCells[0].getValue().trim(); // Index 1 corresponds to the Input field
            var sBname = oCells[1].getValue().trim();
            var sValue = oCells[2].getValue().trim();
            var sCvalue = oCells[3].getValue().trim();
            var sCunit = oCells[4].getValue();
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
          if (!flag) {

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
                  // oEntryTable.getItems()[0].getCells()[0].setValue("");
                  // oEntryTable.getItems()[0].getCells()[1].setValue("");

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


        else if (newEntryFlag) {
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
            var sDatatype = oCells[5].getValue().trim();
            var sTablename = oCells[6].getValue().trim();
            var sMulti_Choice = oCells[7].getSelected();

            if (sCode !== "" || sBname !== "" || sValue !== "" || sCvalue !== "" || sCunit !== "" || sTablename !== "" || sDatatype !== "" || sMulti_Choice !== false) {
              flag = true;
              break;
            }

          }
          if (!flag) {

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
            var sCode = oCells[0].getText(); // Index 1 corresponds to the Input field
            var sBname = oCells[1].getText();
            var sValue = oCells[2].getValue().trim();
            var sCvalue = oCells[3].getValue().trim();
            var sCunit = oCells[4].getValue();
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

          if (!flag) {
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
            }, 1600);

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
                  }, 1500);

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

        // Reset copyFlag and editFlag
        copyFlag = false;
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
        firstItemCells[2].setValue("");
        firstItemCells[3].setValue("");
        firstItemCells[4].setValue("");
        firstItemCells[5].setValue("");
        firstItemCells[6].setValue("");
        firstItemCells[7].setSelected(false);

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
          var oCode = oBindingContext.getProperty("Code");
          var oBname = oBindingContext.getProperty("Bname");
          var oValue = oBindingContext.getProperty("Value");
          var oCvalue = oBindingContext.getProperty("Cvalue");
          var oCunit = oBindingContext.getProperty("Cunit");
          var oDatatype = oBindingContext.getProperty("Datatype");
          var oTablename = oBindingContext.getProperty("Tablename");
          var oMulti_Choice = oBindingContext.getProperty("Multi_Choice");

          onEditInput.push([oCode, oBname, oValue, oCvalue, oCunit, oTablename, oDatatype, oMulti_Choice]);
        });

        editFlag = true;


        // Clear the updateTypeTable before adding new items
        let oUpdateTable = oView.byId("updateTypeTable");
        oUpdateTable.removeAllItems();

        // Iterate over selected items to create new items in the updateTypeTable
        aSelectedItems.forEach(function (oSelectedItem) {
          // Get the selected item's binding context
          let oContext = oSelectedItem.getBindingContext();


          // changes for bidMast Table
          let Bname = oContext.getProperty("Bname");
          let Code = oContext.getProperty("Code");
          let Value = oContext.getProperty("Value");
          let Cvalue = oContext.getProperty("Cvalue");
          let Cunit = oContext.getProperty("Cunit");
          let Datatype = oContext.getProperty("Datatype");
          let Tablename = oContext.getProperty("Tablename");
          let Multi_Choice = oContext.getProperty("Multi_Choice");

          // Add new item to updateTypeTable
          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: Code }),
              new sap.m.Text({
                text: Bname
              }),
              new sap.m.Input({ value: Value, liveChange: that.onLiveChangeValue.bind(that) }),
              new sap.m.Input({ value: Cvalue, liveChange: that.onLiveChangeCvalue.bind(that), type :sap.m.InputType.Number }),
              new sap.m.Input({ value: Cunit, showValueHelp: true, valueHelpRequest: that.showValueHelpCurrency.bind(that) }),
              new sap.m.Input({ value: Datatype, liveChange: that.onLiveChangeDatatype.bind(that) }),
              new sap.m.Input({ value: Tablename, liveChange: that.onLiveChangeTablename.bind(that) }),
              new sap.m.CheckBox({ selected: Multi_Choice, select: that.onSelectChange.bind(that) })
            ]
          });
          oUpdateTable.addItem(oColumnListItem);
        });



        // Show the updateTypeTable
        oUpdateTable.setVisible(true);

        // Hide the createTypeTable
        oTable.setVisible(false);

        // Show the footer for the updateTypeTable
        oView.byId("mainPageFooter2").setVisible(true);

        // Disable other buttons
        oView.byId("deleteBtn").setEnabled(false);
        oView.byId("copyBtn").setEnabled(false);
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
      onSelectChange: function (oEvent) {
        console.log("checkbox selection changed");

      },

      // adding code for currency value help

      showValueHelpCurrency: function (oEvent) {
        console.log("value help clicked");
        valueHelpInputref = oEvent.getSource();
        try {
          let oMaterialModel = this.getView().getModel("CurrencyMode");
          // console.log("OMaterial Model", oMaterialModel.getData());

          if (this._oSearchField && this._oTable) {
            this._oDialog2.open();
            return;
          }

          // Create SearchField
          this._oSearchField = new sap.m.SearchField({
            width: "30%",
            selectOnFocus: true,
            placeholder: "Search your currency",
            liveChange: this.onSearch.bind(this),
          });

          // Create Responsive Table
          this._oTable = new sap.m.Table({
            alternateRowColors: true,
            growing: "true",
            mode: sap.m.ListMode.SingleSelectMaster,
            columns: [
              new sap.m.Column({
                header: new sap.m.Text({
                  text: "Currency Code"
                })
              }),
              new sap.m.Column({
                header: new sap.m.Text({
                  text: "Description"
                })
              }),

            ]
          });

          this._oTable.setModel(oMaterialModel);
          this._oTable.bindItems({
            path: "/",
            template: new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({
                  text: "{Waers}"
                }),
                new sap.m.Text({
                  text: "{Ltext}"
                }),

              ]
            })
          });

          // Create Dialog
          this._oDialog2 = new sap.m.Dialog({
            title: "Select Project",
            contentWidth: "60vw",
            contentHeight: "80vh",
            content: [this._oSearchField, this._oTable],
            buttons: [
              new sap.m.Button({
                type: "Success",
                icon: "sap-icon://accept",
                text: "OK",
                press: function () {
                  var selectedItem = this._oTable.getSelectedItem();
                  if (selectedItem) {
                    this.handleValueHelpSelection(selectedItem);
                  }
                  this._oDialog2.close();
                }.bind(this)
              }),
              new sap.m.Button({
                type: "Emphasized",
                icon: "sap-icon://close-command-field",
                text: "Close",
                press: function () {
                  this._oDialog2.close();
                }.bind(this)
              }),
            ]
          });

          this._oDialog2.open();
        } catch (error) {
          // Handle the error, log it, or perform any necessary actions
          console.error("An error occurred in matnrVHDialog:", error);
          sap.m.MessageBox.error(`An error occurred in Material Dialog Box: ${error}`);
        }
      },

      // handling selection of value help from table selection

      handleValueHelpSelection: function (selectedItem) {
        console.log("chnage selection");
        var selectedCurrencyCode = selectedItem.getCells()[0].getText(); // Assuming currency code is in the first column
        var selectedCurrencyDescription = selectedItem.getCells()[1].getText(); // Assuming description is in the second column

        if (valueHelpInputref) {
          valueHelpInputref.setValue(selectedCurrencyCode);
        } else {
          console.error("Input field reference is undefined");
        }

      },

      // currency table filter serching on input change

      onSearch: function (oEvent) {
        var sSearchValue = oEvent.getParameter("newValue");
        var oBinding = this._oTable.getBinding("items");

        // Create filters based on the search value
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

        // Create a new row
        var oNewRow = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onLiveChangeUser.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onLiveChangeValue.bind(this) }),
            new sap.m.Input({ value: "", type: sap.m.InputType.Number, liveChange: this.onLiveChangeCvalue.bind(this) }),
            new sap.m.Input({ value: "", showValueHelp: true, valueHelpRequest: this.showValueHelpCurrency.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onLiveChangeDatatype.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onLiveChangeTablename.bind(this) }),
            new sap.m.CheckBox({ select: this.onSelectChange.bind(this) })
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
        var duplicateEntries = [];

        oTable.getItems().forEach(function (row) {
          var value1 = row.getCells()[0].getValue();
          var value2 = row.getCells()[1].getValue();
          var value3 = row.getCells()[2].getValue();
          var value4 = row.getCells()[3].getValue();
          var value5 = row.getCells()[4].getValue();
          var value6 = row.getCells()[5].getValue();
          var value7 = row.getCells()[6].getValue();
          var value8 = row.getCells()[7].getSelected();

          sap.m.MessageToast.show("Creating ...");
          // if (value1 ==="" || value2 === "" || value3 ==="" || value4 ==="" || value5 ==="" || value6 === ""|| value7 ==="") {

          if (!value1 || !value2 || !value3 || !value6) {
            if (!errors.includes("Please enter all required fields for all rows.")) {

              errors.push("Please enter all fields for all rows.");
            }
            entriesProcessed++;
            checkCompletion();
            return;
          }
          // try {
          //   let abc = new ODataMetaModel(this.getModel().getMetaModel(),null,this.getModel())
          //   console.log(abc)
          // } catch (error) {
          //   console.log(error)
          // }
          let oBindListSP = that.getView().getModel().bindList("/xNAUTIxMASBID");
          oBindListSP.attachEventOnce("dataReceived", function () {
            let existingEntries = oBindListSP.getContexts().map(function (context) {
              return [context.getProperty("Code"), context.getProperty("Bname")];
            });

            existingEntries.forEach((entry) => {

              if (entry.includes(value1) && entry.includes(value2)) {
                // Store duplicate entry code in the array
                duplicateEntries.push(value1);
              }
              // else if (entry.includes(value1)) {
              //   duplicateEntries.push(value1);
              // } else if (entry.includes(value2)) {
              //   duplicateEntries.push(value2);

              // }
            })

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
                errorMessage += "Duplicate entries found with the same code or User : " + duplicateEntries.join(", ") + "\n";


              }
              sap.m.MessageToast.show(errorMessage);
            }
          }
        }

        function createEntries() {
          let successStatus = undefined;
          oTable.getItems().forEach(function (row) {
            var value1 = row.getCells()[0].getValue().trim().toUpperCase();
            var value2 = row.getCells()[1].getValue().trim().toUpperCase();
            var value3 = row.getCells()[2].getValue().trim().toUpperCase();
            var value4 = parseFloat(row.getCells()[3].getValue());
            var value5 = row.getCells()[4].getValue().trim().toUpperCase();
            var value6 = row.getCells()[5].getValue().trim().toUpperCase();
            var value7 = row.getCells()[6].getValue().trim().toUpperCase();
            var value8 = row.getCells()[7].getSelected();

            // Format  value
            // var formattedBname = that.formatUomdes(value2);
            // if not passed any revaluation then to avoid deseralization error
            value4 = parseFloat(value4) ? parseFloat(value4) : 0;

            var oBindListSP = that.getView().getModel().bindList("/xNAUTIxMASBID");
            let payload = {
              Code: value1,
              Bname: value2,
              Value: value3,
              Cvalue: value4,
              Cunit: value5,
              Datatype: value6,
              Tablename: value7,
              Multi_Choice: value8
            }
            console.log(payload, value1);
            try {

              oBindListSP.create(payload);
              oBindListSP.attachCreateCompleted(function (oEvent) {

                oEvent.getParameter("context").getModel().getMessagesByPath("").forEach(x => {
                  successStatus = oEvent.getParameter("success")
                  console.log(x.message);
                  MessageToast.show(x.message)
                }

                )
                // debugger;
              }, this)
              that.getView().getModel().refresh();
              that.resetView();
            } catch (error) {
              console.log("catch err:", error);
              sap.m.MessageToast.show("Error while saving data");
            }
          });
          if (successStatus) {

            sap.m.MessageToast.show("All entries saved successfully.");
          }
        }
      },


      // Function to format Uomdes
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
          var oCells = aItems[i].getCells();
          var sCode = oCells[0].getValue().trim(); // Index 1 corresponds to the Input field
          var sBname = oCells[1].getValue().trim();
          var sValue = oCells[2].getValue().trim();
          var sCvalue = oCells[3].getValue().trim();
          var sCunit = oCells[4].getValue().trim();
          var sDatatype = oCells[5].getValue().trim();
          var sTablename = oCells[6].getValue().trim();
          var sMulti_Choice = oCells[7].getSelected();

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


      onUpdate: function () {
        let oView = this.getView();
        let oCreateTable = oView.byId("createTypeTable");
        let oUpdateTable = oView.byId("updateTypeTable");

        // Get all items from the updateTypeTable
        let aItems = oUpdateTable.getItems();

        let i = 0;
        let flagNothingtoUpdate = true;
        for (let i = 0; i < aItems.length; i++) {
          var oCells = aItems[i].getCells();
          // var sCode = oCells[0].getText(); 
          // var sBname = oCells[1].getText();

          var sValue = oCells[2].getValue().trim();
          var sCvalue = oCells[3].getValue().trim();
          var sCunit = oCells[4].getValue();
          var sDatatype = oCells[5].getValue().trim();
          var sTablename = oCells[6].getValue().trim();
          var sMulti_Choice = oCells[7].getSelected();

          // var sValue = this.removeExtraSpaces(oInput.getValue());
          // console.log(onEditInput[i] + ":" + sValue + ":");

          let fieldsArr = onEditInput[i];
          if (fieldsArr[2] !== sValue || fieldsArr[3] !== sCvalue || fieldsArr[4] !== sCunit || fieldsArr[5] !== sTablename || fieldsArr[6] !== sDatatype || fieldsArr[7] !== sMulti_Choice) {
            flagNothingtoUpdate = false;
            break;
          }


        }

        if (flagNothingtoUpdate) {
          MessageToast.show("nothing to update ");
          return;
        }
        // else {
        //   console.log("something changed");return
        // }

        // Iterate over the items to update the corresponding item in the createTypeTable

        aItems.forEach(function (oItem) {
          let sCode = oItem.getCells()[0].getText();
          let sBname = oItem.getCells()[1].getText();
          let sValue = oItem.getCells()[2].getValue().trim();
          let sCvalue = oItem.getCells()[3].getValue().trim();
          let sCunit = oItem.getCells()[4].getValue().trim();
          let sDatatype = oItem.getCells()[5].getValue().trim();
          let sTablename = oItem.getCells()[6].getValue().trim();
          let sMulti_Choice = oItem.getCells()[7].getSelected();

          // Find the corresponding item in the createTypeTable
          let oCreateItem = oCreateTable.getItems().find(function (oCreateItem) {

            return oCreateItem.getCells()[1].getText() === sCode; // Assuming Value is in the first cell
          });

          // Update the corresponding item in the createTypeTable
          if (oCreateItem) {
            oCreateItem.getCells()[2].setText(sValue.replace(/\s+/g, " ").trim().toUpperCase()); // Assuming Field Description is in the second cell
            oCreateItem.getCells()[3].setText(parseFloat(sCvalue));
            oCreateItem.getCells()[4].setText(sCunit.replace(/\s+/g, " ").trim().toUpperCase());
            oCreateItem.getCells()[5].setText(sDatatype.replace(/\s+/g, " ").trim().toUpperCase());
            oCreateItem.getCells()[6].setText(sTablename.replace(/\s+/g, " ").trim().toUpperCase());
            oCreateItem.getCells()[7].setSelected(sMulti_Choice)

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
        oView.byId("Datatype").setValue("");
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

        if (aSelectedIds.length === 0) {
          MessageToast.show("Please select at least one row");
          return
        }
        newEntryFlag = false;
        editFlag = false;

        copyFlag = true;
        let oView = this.getView();

        // Get the createTypeTable

        var oTable = this.byId("createTypeTable");
        var aSelectedItems = oTable.getSelectedItems();
        onCopyInput = [];
        // Iterating over selected items and printing values
        aSelectedItems.forEach(function (oItem) {
          var oBindingContext = oItem.getBindingContext();
          var oCode = oBindingContext.getProperty("Code");
          var oBname = oBindingContext.getProperty("Bname");
          var oValue = oBindingContext.getProperty("Value");
          var oCvalue = oBindingContext.getProperty("Cvalue");
          var oCunit = oBindingContext.getProperty("Cunit");
          var oDatatype = oBindingContext.getProperty("Datatype");
          var oTablename = oBindingContext.getProperty("Tablename");
          var oMulti_Choice = oBindingContext.getProperty("Multi_Choice");

          onCopyInput.push([oCode, oBname, oValue, oCvalue, oCunit, oTablename, oDatatype, oMulti_Choice]);
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
          // let code = aSelectedIds[i][0];
          // let desc = aSelectedIds[i][1];
          let Bname = aSelectedIds[i][0];
          let Code = aSelectedIds[i][1];
          let Value = aSelectedIds[i][2];
          let Cvalue = aSelectedIds[i][3];
          let Cunit = aSelectedIds[i][4];
          let Datatype = aSelectedIds[i][5];
          let Tablename = aSelectedIds[i][6];
          let Multi_Choice = aSelectedIds[i][7];

          let newItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Input({
                value: Code,
                liveChange: this.onCodeLiveChange.bind(this)
              }),
              new sap.m.Input({
                value: Bname,
                liveChange: this.onLiveChangeUser.bind(this)
              }),
              new sap.m.Input({ value: Value, liveChange: this.onLiveChangeValue.bind(this) }),
              new sap.m.Input({ value: Cvalue, type: sap.m.InputType.Number, liveChange: this.onLiveChangeCvalue.bind(this) }),
              new sap.m.Input({ value: Cunit, showValueHelp: true, valueHelpRequest: this.showValueHelpCurrency.bind(this) }),
              new sap.m.Input({ value: Datatype, liveChange: this.onLiveChangeDatatype.bind(this) }),
              new sap.m.Input({ value: Tablename, liveChange: this.onLiveChangeTablename.bind(this) }),
              new sap.m.CheckBox({ selected: Multi_Choice, select: this.onSelectChange.bind(this) })
            ]
          });
          entryTable.addItem(newItem);
        }

      },


    });

  });