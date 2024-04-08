sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    //"nauticalfe/utils/bufferedEventHandler"
  ],
  function (BaseController,History,MessageToast,JSONModel,MessageBox,bufferedEventHandler) {
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
 
    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.PortLocMaster", {
      onInit() {
        oView = this.getView();
        oView.byId("createTypeTable").setVisible(true);
        oView.byId("entryTypeTable").setVisible(false);
        oView.byId("mainPageFooter").setVisible(false);
        oView.byId("updateTypeTable").setVisible(false);
        
      },
      // initSearchField: function () {
      //   var searchField = this.byId('Country');
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
    },
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
        // If no changes have been made, navigate to the initial screen immediately
        this.resetView();

      }
    }


    else if (newEntryFlag) {
      let Country = this.getView().byId("COUNTRY").getValue().trim();
      let Portc = this.getView().byId("PORTC").getValue().trim();
      let Portn = this.getView().byId("PORTN").getValue().trim();
      let Reancho = this.getView().byId("REANCHO").getValue().trim();
      let Latitude = this.getView().byId("LATITUDE").getValue().trim();
      let Longitude = this.getView().byId("LONGITUDE").getValue().trim();
      let Countryn = this.getView().byId("COUNTRYN").getValue().trim();
      let Locid = this.getView().byId("LOCID").getValue().trim();
      let Ind = this.getView().byId("IND").getValue().trim();
     
      if (Country == "" && Portc == ""&&Portn == "" && Reancho == ""&&Latitude == "" && Longitude == ""&&Country == "" && Countryn == ""&&Locid == "" && Ind == "") {
        oEntryTable.setVisible(false);
        // Clear input fields of the first row
        oEntryTable.getItems()[0].getCells()[0].setValue("");
        oEntryTable.getItems()[0].getCells()[1].setValue("");
        oEntryTable.getItems()[0].getCells()[2].setValue("");
        oEntryTable.getItems()[0].getCells()[3].setValue("");
        oEntryTable.getItems()[0].getCells()[4].setValue("");
        oEntryTable.getItems()[0].getCells()[5].setValue("");
        oEntryTable.getItems()[0].getCells()[6].setValue("");
        oEntryTable.getItems()[0].getCells()[7].setValue("");
        oEntryTable.getItems()[0].getCells()[8].setValue("");
      

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
              oEntryTable.getItems()[0].getCells()[3].setValue("");
              oEntryTable.getItems()[0].getCells()[4].setValue("");
              oEntryTable.getItems()[0].getCells()[5].setValue("");
              oEntryTable.getItems()[0].getCells()[6].setValue("");
              oEntryTable.getItems()[0].getCells()[7].setValue("");
              oEntryTable.getItems()[0].getCells()[8].setValue("");



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
        // If no changes have been made, navigate to the initial screen immediately
        oRouter.navTo("RouteHome");
        setTimeout(() => {

          that.resetView();
        }, 1600);

      }
    }

    else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
      oRouter.navTo("RouteHome");
      this.byId("createTypeTable").removeSelections();
    }
    else if (newEntryFlag) {
      // let voyCode = this.getView().byId("Code").getValue().trim();
      // let voyCodeDesc = this.getView().byId("Desc").getValue().trim();
      let Country = this.getView().byId("COUNTRY").getValue().trim();
      let Portc = this.getView().byId("PORTC").getValue().trim();
      let Portn = this.getView().byId("PORTN").getValue().trim();
      let Reancho = this.getView().byId("REANCHO").getValue().trim();
      let Latitude = this.getView().byId("LATITUDE").getValue().trim();
      let Longitude = this.getView().byId("LONGITUDE").getValue().trim();
      let Countryn = this.getView().byId("COUNTRYN").getValue().trim();
      let Locid = this.getView().byId("LOCID").getValue().trim();
      let Ind = this.getView().byId("IND").getValue().trim();

      if (Country == "" && Portc == ""&&Portn == "" && Reancho == ""&&Latitude == "" && Longitude == ""&&Country == "" && Countryn == ""&&Locid == "" && Ind == "") {

        const oRouter = that.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
        setTimeout(() => {
          oEntryTable.setVisible(false);
          // Clear input fields of the first row
          oEntryTable.getItems()[0].getCells()[0].setValue("");
          oEntryTable.getItems()[0].getCells()[1].setValue("");
          oEntryTable.getItems()[0].getCells()[2].setValue("");
          oEntryTable.getItems()[0].getCells()[3].setValue("");
          oEntryTable.getItems()[0].getCells()[4].setValue("");
          oEntryTable.getItems()[0].getCells()[5].setValue("");
          oEntryTable.getItems()[0].getCells()[6].setValue("");
          oEntryTable.getItems()[0].getCells()[7].setValue("");
          oEntryTable.getItems()[0].getCells()[8].setValue("");
  

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
                oEntryTable.getItems()[0].getCells()[2].setValue("");
                oEntryTable.getItems()[0].getCells()[3].setValue("");
                oEntryTable.getItems()[0].getCells()[4].setValue("");
                oEntryTable.getItems()[0].getCells()[5].setValue("");
                oEntryTable.getItems()[0].getCells()[6].setValue("");
                oEntryTable.getItems()[0].getCells()[7].setValue("");
                oEntryTable.getItems()[0].getCells()[8].setValue("");
        


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
          if (oSelectedItem.getBindingContext()) {
            let cells = oSelectedItem.getCells();
            console.log(cells);
 
            return [
              oSelectedItem.getBindingContext().getProperty("Country"),
              oSelectedItem.getBindingContext().getProperty("Portc"),
              oSelectedItem.getBindingContext().getProperty("Portn"),
              oSelectedItem.getBindingContext().getProperty("Reancho"),
              oSelectedItem.getBindingContext().getProperty("Latitude"),
              oSelectedItem.getBindingContext().getProperty("Longitude"),
              oSelectedItem.getBindingContext().getProperty("Countryn"),
              oSelectedItem.getBindingContext().getProperty("Locid"),
              oSelectedItem.getBindingContext().getProperty("Ind"),
            ]
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
        firstItemCells[2].setValue("");
        firstItemCells[3].setValue("");
        firstItemCells[4].setValue("");
        firstItemCells[5].setValue("");
        firstItemCells[6].setValue("");
        firstItemCells[7].setValue("");
        firstItemCells[8].setValue("");
      

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
          var sCountry = oBindingContext.getProperty("country");
          var sPortc = oBindingContext.getProperty("portc");
          var sPortn = oBindingContext.getProperty("portn");
          var sReancho = oBindingContext.getProperty("reancho");
          var sLatitude = oBindingContext.getProperty("latitude");
          var sLongitude = oBindingContext.getProperty("longitude");
          var sCountryn = oBindingContext.getProperty("countryn");
          var sLocid = oBindingContext.getProperty("locid");
          var sInd = oBindingContext.getProperty("ind");
        
          console.log(sCountry,sPortc,sPortn,sReancho,sLatitude,sLongitude,sCountryn,sLocid,sInd);

          onEditInput.push(sPortc,sPortn,sReancho,sLatitude,sLongitude,sCountryn,sLocid,sInd);
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

          let sCountry = oContext.getProperty("Country");
          let sPortc = oContext.getProperty("Portc");
          
          let sPortn = oContext.getProperty("Portn");
          let sReancho = oContext.getProperty("Reancho");

          let sLatitude = oContext.getProperty("Latitude");
          let sLongitude = oContext.getProperty("Longitude");

          let sCountryn = oContext.getProperty("Countryn");
          let sLocid = oContext.getProperty("Locid");

          let sInd = oContext.getProperty("Ind");
        

          

         
          let oColumnListItem = new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: sCountry }),
              new sap.m.Input({ value: sPortc, editable: true}),
              new sap.m.Input({ value: sPortn, editable: true}),
              new sap.m.Input({ value: sReancho, editable: true}),
              new sap.m.Input({ value: sLatitude, editable: true}),
              new sap.m.Input({ value: sLongitude, editable: true}),
              new sap.m.Input({ value: sCountryn, editable: true}),
              new sap.m.Input({ value: sLocid, editable: true}),
              new sap.m.Input({ value: sInd, editable: true})
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
            }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
            new sap.m.Input({ value: "", liveChange: this.onCodeLiveChange.bind(this) }),
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
            var value3 = row.getCells()[2].getValue();
            var value4 = row.getCells()[3].getValue();
            var value5 = row.getCells()[4].getValue();
            var value6 = row.getCells()[5].getValue();
            var value7 = row.getCells()[6].getValue();
            var value8 = row.getCells()[7].getValue();
            var value9 = row.getCells()[8].getValue();
            
    
            if (!value1 || !value2 || !value2 || !value3 ||!value4 || !value5 || !value6 ||!value7 || !value8 || !value9) {
                errors.push("Please enter all fields for all rows.");
                entriesProcessed++;
                checkCompletion();
                return;
            }
    
            var oBindListSP = that.getView().getModel().bindList("/PortmasterSetSet");
            oBindListSP.attachEventOnce("dataReceived", function () {
                var existingEntries = oBindListSP.getContexts().map(function (context) {
                    return context.getProperty("Country","Portc","Portn","Reancho","Latitude","Longitude","Countryn","Locid","Ind").toUpperCase(); // Convert to lowercase
                });
    
                
                if (existingEntries.includes(value1),(value2),(value3),(value4),(value5),(value6),(value7),(value8),(value9)) {
                    // Store duplicate entry code in the array
                    // duplicateEntries.push(value1);
                    // duplicateEntries.push(value2);
                    // duplicateEntries.push(value3);
                    // duplicateEntries.push(value4);
                    // duplicateEntries.push(value5);
                    // duplicateEntries.push(value6);
                    // duplicateEntries.push(value7);
                    // duplicateEntries.push(value8);
                    // duplicateEntries.push(value9);
                    console.log(value1,value2,value3,value4,value5,value6,value7,value8,value9);

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
                var value4 = row.getCells()[3].getValue();
                var value5 = row.getCells()[4].getValue();
                var value6 = row.getCells()[5].getValue();
                var value7 = row.getCells()[6].getValue();
                var value8 = row.getCells()[7].getValue();
                var value9 = row.getCells()[8].getValue();
            
          
    
                // Format Uomdes value
                var formattedUomdes = that.formatUomdes(value2);
                var formattedUomdes = that.formatUomdes(value3);
                var formattedUomdes = that.formatUomdes(value4);
                var formattedUomdes = that.formatUomdes(value5);
                var formattedUomdes = that.formatUomdes(value6);
                var formattedUomdes = that.formatUomdes(value7);
                var formattedUomdes = that.formatUomdes(value8);
                var formattedUomdes = that.formatUomdes(value9);
    
                var oBindListSP = that.getView().getModel().bindList("/PortmasterSetSet");
    
                try {
                    oBindListSP.create({
                      Country: value1,
                      Portc: formattedUomdes,

                      Portn: formattedUomdes,
                      Reancho: formattedUomdes,
                      Latitude: formattedUomdes,
                      Longitude: formattedUomdes,
                      Countryn: formattedUomdes,
                      Locid: formattedUomdes,
                      Ind: formattedUomdes
                      
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
    formatUomdes: function (Country) {
      return Country.toLowerCase().replace(/\b\w/g, function (char) {
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
        let sDesc = oItem.getCells()[[1],[2],[3],[4],[5],[6],[7],[8]].getValue();
        sDesc = this.removeExtraSpaces(sDesc);
        if (onEditInput[i].trim() !== sDesc.trim()) {
          flagNothingtoUpdate = false;
          break; // Break the loop when condition is met
        }
      }
     

      if (flagNothingtoUpdate) {
        sap.m.MessageToast.show("nothing to update ");
        return;
      }

      aItems.forEach(function (oItem) {
        let sValue = oItem.getCells()[0].getText(); // Assuming Value is in the first cell
        let sDesc = oItem.getCells()[[1],[2],[3],[4],[5],[6],[7],[8]].getValue(); // Assuming Field Description is in the second cell
        console.log(aItems);


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
        var oInput = oCells[[1],[2],[3],[4],[5],[6],[7],[8]]; // Index 1 corresponds to the Input field
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
    // onCancelCopyOrEntry: function () {
    //   var oEntryTable = this.getView().byId("entryTypeTable");
    //   const that = this;

    //   let COUNTRY = this.getView().byId("COUNTRY").getValue().trim();
    //   let PORTC = this.getView().byId("PORTC").getValue().trim();
    //   let PORTN = this.getView().byId("PORTN").getValue().trim();
    //   let REANCHO = this.getView().byId("REANCHO").getValue().trim();
    //   let LATITUDE = this.getView().byId("LATITUDE").getValue().trim();
    //   let LONGITUDE = this.getView().byId("LONGITUDE").getValue().trim();
    //   let COUNTRYN = this.getView().byId("COUNTRYN").getValue().trim();
    //   let LOCID = this.getView().byId("LOCID").getValue().trim();
    //   let IND = this.getView().byId("IND").getValue().trim();
      
    //   // Check if there are any changes made
    //   if (COUNTRY !== "" || PORTC !== "" ||PORTN !=="" ||REANCHO!==""||LATITUDE!==""||LONGITUDE!==""||COUNTRYN!==""||LOCID!==""||IND!=="") {

    //     sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
    //       MessageBox.confirm(
    //         "Changes were made , do you want to Discard ?", {
    //         title: "Confirm ",
    //         onClose: function (oAction) {

    //           if (oAction === MessageBox.Action.OK) {
    //             oEntryTable.setVisible(false);
    //             oEntryTable.getItems()[0].getCells()[0].setValue("");
    //             oEntryTable.getItems()[0].getCells()[1].setValue("");
    //             oEntryTable.getItems()[0].getCells()[2].setValue("");
    //             oEntryTable.getItems()[0].getCells()[3].setValue("");
    //             oEntryTable.getItems()[0].getCells()[4].setValue("");
    //             oEntryTable.getItems()[0].getCells()[5].setValue("");
    //             oEntryTable.getItems()[0].getCells()[6].setValue("");
    //             oEntryTable.getItems()[0].getCells()[7].setValue("");
    //             oEntryTable.getItems()[0].getCells()[8].setValue("");
                

    //             var items = oEntryTable.getItems();
    //             for (var i = items.length - 1; i > 0; i--) {
    //               oEntryTable.removeItem(items[i]);
    //             }
    //             that.resetView();

    //           } else {
    //             console.log("continue ..");

    //           }
    //         }
    //       }
    //       );
    //     });

    //   } else {
    //     oEntryTable.setVisible(false);
    //     oEntryTable.getItems()[0].getCells()[0].setValue("");
    //     oEntryTable.getItems()[0].getCells()[1].setValue("");
    //     oEntryTable.getItems()[0].getCells()[2].setValue("");
    //     oEntryTable.getItems()[0].getCells()[3].setValue("");
    //     oEntryTable.getItems()[0].getCells()[4].setValue("");
    //     oEntryTable.getItems()[0].getCells()[5].setValue("");
    //     oEntryTable.getItems()[0].getCells()[6].setValue("");
    //     oEntryTable.getItems()[0].getCells()[7].setValue("");
    //     oEntryTable.getItems()[0].getCells()[8].setValue("");
      

    //     var items = oEntryTable.getItems();
    //     for (var i = items.length - 1; i > 0; i--) {
    //       oEntryTable.removeItem(items[i]);
    //     }

    //     that.resetView();
    //   } 
    // },
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
      
      this.getView().byId("COUNTRY").setValue("");
      this.getView().byId("PORTC").setValue("");
      this.getView().byId("PORTN").setValue("");
      this.getView().byId("REANCHO").setValue("");
      this.getView().byId("LATITUDE").setValue("");
      this.getView().byId("LONGITUDE").setValue("");
      this.getView().byId("COUNTRYN").setValue("");
      this.getView().byId("LOCID").setValue("");
      this.getView().byId("IND").setValue("");

      this.getView().byId("country").setValue("");
      this.getView().byId("portc").setValue("");
      this.getView().byId("portn").setValue("");
      this.getView().byId("reancho").setValue("");
      this.getView().byId("latitude").setValue("");
      this.getView().byId("longitude").setValue("");
      this.getView().byId("countryn").setValue("");
      this.getView().byId("locid").setValue("");
      this.getView().byId("ind").setValue("");

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
  });

});
    