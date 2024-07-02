
 
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
  ],
  function (Controller, History, Fragment, MessageToast, MessageBox, JSONModel,Filter,FilterOperator) {
    "use strict";
    let getModelData = [];
    let aSelectedIds = [];
    let myModel = undefined;
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    let backPressCount = 0;
 
 
 
    let deschanged = [];
    let inputFieldObj = {};
    let saveObj = {};
    let cancelObj = {}
 
    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.CurrencyType", {
 
      onInit: function () {
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/StandardCurrencySet");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
        }.bind(this))
        console.log("mydata", getModelData)
       
       },
       


        
       onBackPress: function () {
        const that = this;

        const oRouter = this.getOwnerComponent().getRouter();
        // Check if any items have been selected
        if (aSelectedIds.length === 0 && !newEntryFlag) {

          // If no items have been selected, navigate to "RouteMasterDashboard"
          oRouter.navTo("RouteMasterDashboard");
        }
        else if (aSelectedIds.length && !newEntryFlag) {
          oRouter.navTo("RouteMasterDashboard");
          this.byId('createTypeTable').removeSelections();

        }
        else if (copyFlag) {

          // Get the values from the view
          let voyCode = this.getView().byId("costCode").getValue().trim();
          console.log(voyCode);
          let voyCodeDesc = this.getView().byId("costCodeDesc").getValue().trim();
          let originalVoyCode = aSelectedIds[0][0];
          let originalVoyCodeDesc = aSelectedIds[0][1];

          // Check if the values are unchanged
          if (voyCode === originalVoyCode && voyCodeDesc === originalVoyCodeDesc) {

            // If no changes have been made, reset the view to its initial state
            this.resetView();

          }
          // If changes have been made, prompt the user for confirmation
          else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
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
          let voyCode = this.getView().byId("NAVOYCUR2").getValue().trim();
          let voyCodeDesc = this.getView().byId("NAVOYGCURDES2").getValue().trim();
          if (voyCode == "" && voyCodeDesc == "") {
            this.resetView();

          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {

              title: "Confirmation",
              onClose: function (oAction) {

                if (oAction === sap.m.MessageBox.Action.OK) {
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
          let desc = aSelectedIds[0][1];
          let originalDesc = inputFieldObj.getValue();
          console.log(originalDesc, originalDesc.trim());
          if (desc === originalDesc) {

            that.onCancelPressBtn();

            oRouter.navTo("RouteMasterDashboard");
            that.resetView();
          } else {

            let oTable = this.byId("createTypeTable");
            let aSelectedItems = oTable.getSelectedItems();

            let cells = aSelectedItems[0].getCells();
            let value2 = cells[1].getAggregation('items')[0].getProperty("value").trim();
            sap.m.MessageBox.confirm(

              "Do you want to discard the changes?", {

              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, discard changes and reset view
                  cells[1].getAggregation('items')[0].setProperty("value", aSelectedIds[0][1]);
                  that.getView().getModel().refresh();
                  inputFieldObj.setEditable(false);
                  saveObj.setVisible(false);
                  cancelObj.setVisible(false);
                  that.resetView();
                  oRouter.navTo("RouteMasterDashboard");


                }

              }
            }
            )
          }

        }

      },


      
    
 
     
      selectedItems: function (oEvent) {
     
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();
 
 
        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {
 
          // console.log(oSelectedItem.getBindingContext());
 
          if (oSelectedItem.getBindingContext()) {
 
            let cells = oSelectedItem.getCells();
            console.log(cells);
 
            return [oSelectedItem.getBindingContext().getProperty("Navoycur"), oSelectedItem.getBindingContext().getProperty("Navoygcurdes")]
 
          } else {
 
 
          }
 
        });
 
 
        return aSelectedIds;
 
      },
      newEntries: function () {
        newEntryFlag = true;
 
        let selectedItem = this.byId("createTypeTable").getSelectedItems();
        if (selectedItem.length == 0) {
 
          this.getView().byId("createTypeTable").setVisible(false)
          this.getView().byId("entryTypeTable").setVisible(true)
          this.getView().byId("mainPageFooter").setVisible(true)
 
          this.getView().byId("deleteBtn").setEnabled(false);
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
      // onCreateSent: function (ev) {
      //   sap.m.MessageToast.show("Creating..")
      //   console.log(ev.getParameter("context")?.getObject())
      // },
      // onCreateCompleted: function (ev) {
      //   let isSuccess = ev.getParameter('success');
      //   if (isSuccess) {
      //     sap.m.MessageToast.show("Successfully Created.")
      //     copyFlag = false;
 
      //     this.getView().byId("deleteBtn").setEnabled(true);
 
      //     this.getView().byId("entryBtn").setEnabled(true);
      //     this.getView().byId("createTypeTable").setVisible(true).removeSelections();
      //   } else {
      //     sap.m.MessageToast.show("Fail to Create.")
      //     this.getView().byId("deleteBtn").setEnabled(true);
      //   }
      // },
      // onSave: function () {
      //   var that = this.getView();
      //   var value1 = this.getView().byId("NAVOYCUR2").getValue();
      //   var value2 = this.getView().byId("NAVOYGCURDES2").getValue();
 
      //   if (!value1 || !value2) {
      //     MessageToast.show("Please enter both fields.");
      //     return;
      //   }
 
      //   let data = {
      //     Navoycur: value1,
 
      //     Navoygcurdes: value2
      //   };
      //   const oJsonModel = new sap.ui.model.json.JSONModel(data);
      //   that.setModel(oJsonModel, "oJsonModel");
      //   let oModel = this.getView().getModel();
      //   let oBindListSP = oModel.bindList("/CurTypeSet");
 
      //   oBindListSP.attachCreateSent(this.onCreateSent, this);
      //   oBindListSP.attachCreateCompleted(this.onCreateCompleted, this);
 
      //   oBindListSP.attachEventOnce("dataReceived", function () {
      //     let existingEntries = oBindListSP.getContexts().map(function (context) {
      //       return context.getProperty("Navoycur");
      //     });
 
      //     if (existingEntries.includes(value1)) {
      //       MessageToast.show("Entry already exists with same code.");
      //     } else {
 
      //       try {
      //         oBindListSP.create({
      //           Navoycur: value1,
      //           Navoygcurdes: value2
      //         });
      //         that.getModel().refresh();
      //         that.byId("Navoycur2").setValue("");
      //         that.byId("Navoygcurdes2").setValue("");
 
      //         MessageToast.show("Data created Successfully");
 
      //         that.byId("createTypeTable").setVisible(true);
      //         that.byId("createTypeTable").removeSelections();
 
      //         aSelectedIds = []
      //         that.byId("entryTypeTable").setVisible(false);
      //         that.byId("mainPageFooter").setVisible(false);
      //         that.getView().byId("deleteBtn").setEnabled(true);
 
 
      //       } catch (error) {
      //         MessageToast.show("Error while saving data");
      //       }
      //     }
      //   });
      //   oBindListSP.getContexts();
      // },
 
 
     
   
 
 
     
      onCreateSent: function (ev) {
        sap.m.MessageToast.show("Creating..")
        
      },
      onCreateCompleted: function (ev) {
        let isSuccess = ev.getParameter('success');
        if (isSuccess) {
          sap.m.MessageToast.show("Successfully Created.")
          copyFlag = false;
 
          this.getView().byId("deleteBtn").setEnabled(true);
 
          this.getView().byId("entryBtn").setEnabled(true);
          this.getView().byId("createTypeTable").setVisible(true).removeSelections();
        } else {
          sap.m.MessageToast.show("Fail to Create.")
          this.getView().byId("deleteBtn").setEnabled(true);
        }
      },
     
      onSave: function () {
     
        var that = this.getView();
        var value1 = this.getView().byId("NAVOYCUR2").getValue();
        var value2 = this.getView().byId("NAVOYGCURDES2").getValue();
 
        if (!value1 || !value2) {
          MessageToast.show("Please enter both fields.");
          return;
        }
 
        let data = {
          Navoycur: value1,
 
          Navoygcurdes: value2
        };
        const oJsonModel = new sap.ui.model.json.JSONModel(data);
        that.setModel(oJsonModel, "oJsonModel");
        let oModel = this.getView().getModel();
        let oBindListSP = oModel.bindList("/CurTypeSet");
 
        oBindListSP.attachCreateSent(this.onCreateSent, this);
        oBindListSP.attachCreateCompleted(this.onCreateCompleted, this);
 
        oBindListSP.attachEventOnce("dataReceived", function () {
          let existingEntries = oBindListSP.getContexts().map(function (context) {
            return context.getProperty("Navoycur");
          });
          console.log(existingEntries);
 
          if (existingEntries.includes(value1)) {
            MessageToast.show("Entry already exists with same code.");
          } else {
 
            try {
              oBindListSP.create({
                Navoycur: value1,
                Navoygcurdes: value2
              });
              that.getModel().refresh();
              that.byId("NAVOYCUR2").setValue("");
              that.byId("NAVOYGCURDES2").setValue("");
 
              MessageToast.show("Data created Successfully");
 
              that.byId("createTypeTable").setVisible(true);
              that.byId("createTypeTable").removeSelections();
 
              aSelectedIds = []
              that.byId("entryTypeTable").setVisible(false);
              that.byId("mainPageFooter").setVisible(false);
              that.getView().byId("deleteBtn").setEnabled(true);
 
 
            } catch (error) {
              MessageToast.show("Error while saving data");
            }
          }
        });
        oBindListSP.getContexts();
      },



 
      handleValueHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
      
         var oInput = this.byId("NAVOYCUR2");
       var  oInput1 = this.byId("NAVOYGCURDES2");
   
        if (!oSelectedItem ) {
          oInput.resetProperty("value");
          oInput1.resetProperty("value");
          let oBinding = oEvent.getSource().getBinding("items");

          oBinding.filter([]);
          return
        }
   
        oInput.setValue(oSelectedItem.getCells()[0].getText());
        oInput1.setValue(oSelectedItem.getCells()[1].getText());
        
        let oBinding = oEvent.getSource().getBinding("items");

        oBinding.filter([]);
        console.log("hello");
  
// let oFilter = new sap.ui.model.Filter("wears", sap.ui.model.FilterOperator.Contains, "");
 
        // oEvent.getSource().getBinding("items").filter([oFilter]);
      },
 
     
      onSaveCancel: function () {
        this.onBackPress();
        // var that = this.getView();
        // var value1 = that.byId("NAVOYCUR2").getValue();
        // var value2 = that.byId("NAVOYGCURDES2").getValue();
 
        // // Check if there are changes in the input fields
        // if (value1 || value2) {
        //   // If changes are detected, prompt the user
        //   MessageBox.confirm(
        //     "Do you want to discard the changes?",
        //     {
        //       onClose: function (oAction) {
        //         if (oAction === MessageBox.Action.OK) {
        //           // If user confirms, discard changes and switch visibility
        //           that.byId("NAVOYCUR2").setValue("");
        //           that.byId("NAVOYGCURDES2").setValue("");
        //           that.byId("createTypeTable").setVisible(true);
        //           that.byId("entryTypeTable").setVisible(false);
        //           that.byId("mainPageFooter").setVisible(false);
        //           var deleteBtn = that.byId("deleteBtn"); // Store reference to delete button
        //           if (deleteBtn) {
        //             deleteBtn.setEnabled(true); // Enable delete button
        //           }
        //           MessageToast.show("Changes discarded.");
        //         }
        //       }
        //     }
        //   );
        // } else {
        //   // If no changes, simply switch visibility and enable delete button
        //   that.byId("createTypeTable").setVisible(true);
        //   that.byId("entryTypeTable").setVisible(false);
        //   that.byId("mainPageFooter").setVisible(false);
        //   var deleteBtn = that.byId("deleteBtn"); // Store reference to delete button
        //   if (deleteBtn) {
        //     deleteBtn.setEnabled(true); // Enable delete button
        //   }
        // }
      },

      CurSearch: function(oEvent) {

    var sValue1 = oEvent.getParameter("value");

    var oFilter1 = new sap.ui.model.Filter("waers", sap.ui.model.FilterOperator.Contains, sValue1);
    var oFilter2 = new sap.ui.model.Filter("ltext", sap.ui.model.FilterOperator.Contains, sValue1);
    var andFilter = new sap.ui.model.Filter({
      filters: [oFilter1, oFilter2]
  });

    oEvent.getSource().getBinding("items").filter([andFilter]);
},

 
      resetView: function () {
        // Reset view to initial state
        // this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        // this.getView().byId("mainPageFooter2").setVisible(false);
        aSelectedIds = [];
        // editFlag = false;
        copyFlag = false;
        newEntryFlag = false;
 
        this.getView().byId("createTypeTable").setVisible(true).removeSelections();
        this.getView().byId("NAVOYCUR1").setText("");
        this.getView().byId("NAVOYGCURDES1").setValue("");
        // this.getView().byId("NAVOYCUR2").setValue("");
        // this.getView().byId("NAVOYGCURDES2").setValue("");
        // this.getView().byId("editBtn").setEnabled(true);
        this.getView().byId("deleteBtn").setEnabled(true);
        // this.getView().byId("copyBtn").setEnabled(true);
        this.getView().byId("entryBtn").setEnabled(true);
      },
      onDeletePress: function () {
 
        let aItems = this.byId("createTypeTable").getSelectedItems();
        let oTable = this.byId("createTypeTable")
 
        if (!aItems.length) {
 
          MessageToast.show("Please Select  Items ");
 
          return;
        }
 
        const that = this;  // creatinh reference for use in Dialog
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure  to delete the selected items?", {
            title: "Confirm ",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                // User confirmed deletion
                that.deleteSelectedItems(aItems);
              } else {
                // User canceled deletion
                sap.m.MessageToast.show("Deletion canceled");
                oTable.removeSelections();
              }
            }
          }
          );
        });
 
      }, // ending fn
 
 
 
      deleteSelectedItems: function (aItems) {
 
        aItems.forEach(function (oItem) {
          const oContext = oItem.getBindingContext();
          oContext.delete().then(function () {
            // Successful deletion
            MessageToast.show("Record deleted sucessfully");
 
            console.log("Succesfully Deleted");
          }).catch(function (oError) {
            // Handle deletion error
            MessageBox.error("Error deleting item: " + oError.message);
          });
        });
      },
 
        currencyValueHelp: function () {
          var oView = this.getView();
          if (!this._oCurrency) {
            this._oCurrency = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.masterdashboard.fragments.CurrencyValueHelp", this);
            oView.addDependent(this._oCurrency);
          }
          this._oCurrency.open();
        },
 
       
 
     
 
     
   
 
 
    });
 
  });