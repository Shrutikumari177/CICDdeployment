
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

  ],
  function (Controller, History, Fragment, MessageToast, MessageBox, JSONModel) {
    "use strict";
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
        var fieldValueToFilter = "EN"; // Set your dynamic filter value here
        var filter = new sap.ui.model.Filter("spras", sap.ui.model.FilterOperator.StartsWith, fieldValueToFilter);
        let oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("/odata/v4/nautical/StandardCurrencySet", [filter])
        console.log(oModel);
        oModel.attachRequestCompleted(function () {
          var modeldata = oModel.getData().value;
          oModel.setData(modeldata);
          this.getView().setModel(oModel, "CurrencyMode");
          console.log("Currency Data ", this.getView().getModel("CurrencyMode").getData());
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
        // this.getView().byId("updateTypeTable").setVisible(false);

      },


      // for more fragment
      onPress: function () {
        var oView = this.getView(),
          oButton = oView.byId("button");
        if (!this._oMenuFragment) {
          this._oMenuFragment = Fragment.load({
            name: "nauticalfe.fragments.MastOptionsDropDown",
            id: oView.getId(),
            controller: this
          }).then(function (oMenu) {
            oMenu.openBy(oButton);
            this._oMenuFragment = oMenu;
            return this._oMenuFragment;
          }.bind(this));
        } else {
          this._oMenuFragment.openBy(oButton);
        }
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
        } else if (newEntryFlag) {
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



      onPressHome: function () {
        const that = this;
        const oRouter = this.getOwnerComponent().getRouter();
        if (aSelectedIds.length === 0 && !newEntryFlag) {
          // If no items have been selected, navigate to "RouteMasterDashboard"
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");

        } else if (copyFlag) {
          let voyCode = this.getView().byId("costCode").getValue().trim();
          let voyCodeDesc = this.getView().byId("costCodeDesc").getValue().trim();
          let originalVoyCode = aSelectedIds[0][0];
          let originalVoyCodeDesc = aSelectedIds[0][1];

          // Check if the values are unchanged
          if (voyCode === originalVoyCode && voyCodeDesc === originalVoyCodeDesc) {
            // If no changes have been made, reset the view to its initial state
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
            oRouter.navTo("RouteHome");
            setTimeout(() => {

              that.resetView();
            }, 1500);

          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // If user clicks OK, navigate to home screen
                  const oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteHome");
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {

                    that.resetView();
                  }, 1500);

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
        }
        else if (newEntryFlag) {
          let voyCode = this.getView().byId("NAVOYCUR2").getValue().trim();
          let voyCodeDesc = this.getView().byId("NAVOYGCURDES2").getValue().trim();
          if (voyCode == "" && voyCodeDesc == "") {
            const oRouter = that.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
            oRouter.navTo("RouteHome");
            setTimeout(() => {

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
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {

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


          let desc = aSelectedIds[0][1];
          let originalDesc = inputFieldObj.getValue();
          console.log(originalDesc, originalDesc.trim());
          if (desc === originalDesc) {

            that.onCancelPressBtn();

            oRouter.navTo("RouteHome");
            oRouter.navTo("RouteHome");
            setTimeout(() => {

              that.resetView();
            }, 1500);

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
                  oRouter.navTo("RouteHome");
                  oRouter.navTo("RouteHome");
                  setTimeout(() => {

                    that.resetView();
                  }, 1500);


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

          // Clear input fields of the first row
          var firstItemCells = items[0].getCells();
          firstItemCells[0].setValue("");
          firstItemCells[1].setValue("");



        } else {
          MessageToast.show("Unselect the Selected Row !")
        }


      },

      // pressEdit: function () {

      //   if( editFlag){
      //     MessageToast.show("Already in edit mode");
      //     return

      //   }


      //   if (aSelectedIds.length) {
      //     if (aSelectedIds.length > 1) {
      //       MessageToast.show("Please select one Item.");
      //       return
      //     }
      //   } else {
      //     MessageToast.show("Please select an Item.");

      //     return;
      //   }
      //   editFlag = true;

      //   // this.byId("createTypeTable").setMode("SingleSelectMaster");

      //   let oTable = this.byId("createTypeTable");
      //   let aSelectedItems = oTable.getSelectedItems();

      //   let cells = aSelectedItems[0].getCells();

      //   inputFieldObj = cells[1].getAggregation('items')[0].setEditable(true);
      //   saveObj = cells[1].getAggregation('items')[1].setVisible(true);
      //   cancelObj = cells[1].getAggregation('items')[2].setVisible(true);
      //   inputFieldObj = cells[1].getAggregation('items')[0].setEditable(true);

      //   inputFieldObj.setEditable(true);
      //   saveObj.setVisible(true);
      //   inputFieldObj.setEditable(true);
      //   this.getView().byId("deleteBtn").setEnabled(false);
      //   this.getView().byId("copyBtn").setEnabled(false);
      //   this.getView().byId("entryBtn").setEnabled(false);


      // },


      // onPatchSent: function (ev) {
      //   sap.m.MessageToast.show("Updating..")
      // },
      // onPatchCompleted: function (ev) {
      //   let oView = this.getView();
      //   let isSuccess = ev.getParameter('success');
      //   if (isSuccess) {
      //     sap.m.MessageToast.show("Successfully Updated.");

      //     this.resetView();
      //     oView.getModel().refresh();
      //     saveObj.setVisible(false);
      //     cancelObj.setVisible(false);
      //     inputFieldObj.setEditable(false);
      //   } else {
      //     sap.m.MessageToast.show("Fail to Update.")
      //   }
      // },
      // onCancelPressBtn: function () {
      //   let that = this;
      //   console.log("cancel Clciked");
      //   let description = aSelectedIds[0][1];

      //   let oTable = this.byId("createTypeTable");
      //   let aSelectedItems = oTable.getSelectedItems();

      //   let cells = aSelectedItems[0].getCells();
      //   let value2 = cells[1].getAggregation('items')[0].getProperty("value").trim();
      //   console.log();
      //   if (value2 === description) {
      //     inputFieldObj.setEditable(false);
      //     saveObj.setVisible(false);
      //     cancelObj.setVisible(false);
      //     this.resetView();

      //     return;
      //   } else {
      //     sap.m.MessageBox.confirm(

      //       "Do you want to discard the changes?", {

      //       title: "Confirmation",
      //       onClose: function (oAction) {
      //         if (oAction === sap.m.MessageBox.Action.OK) {
      //           // If user clicks OK, discard changes and reset view
      //           cells[1].getAggregation('items')[0].setProperty("value", description);
      //           that.getView().getModel().refresh();
      //           inputFieldObj.setEditable(false);
      //           saveObj.setVisible(false);
      //           cancelObj.setVisible(false);
      //           that.resetView();


      //         }

      //       }
      //     }
      //     )
      //   }

      //   if (value2 == "") {
      //     MessageToast.show("Please Enter Description.");
      //     return
      //   }


      // },
      // onUpdatePressBtn: function () {
      //   deschanged = []
      //   let code = aSelectedIds[0][0];
      //   let description = aSelectedIds[0][1];
      //   // let value2 =  this.getView().byId("DescInput").getValue().trim() ;
      //   let oTable = this.byId("createTypeTable");
      //   let aSelectedItems = oTable.getSelectedItems();

      //   let cells = aSelectedItems[0].getCells();
      //   let value2 = cells[1].getAggregation('items')[0].getProperty("value").trim();
      //   console.log();
      //   if (value2 == description) {
      //     MessageToast.show("nothing to update ");
      //     return;
      //   }

      //   if (value2 == "") {
      //     MessageToast.show("Please Enter Description.");
      //     return
      //   }

      //   let UpData = {
      //     Navoycur: code,

      //     Navoygcurdes: value2

      //   };


      //   // console.log(data);

      //   let oModel = this.getView().getModel();
      //   let oBindList = oModel.bindList("/CurTypeSet", {
      //     $$updateGroupId: "update"
      //   });

      //   oBindList.attachPatchSent(this.onPatchSent, this);
      //   oBindList.attachPatchCompleted(this.onPatchCompleted, this);
      //   let inputVal = this.byId("DescInput")
      //   console.log(inputVal);
      //   let oFilter = new sap.ui.model.Filter("Navoycur", sap.ui.model.FilterOperator.EQ, UpData.Navoycur);
      //   oBindList.filter(oFilter);
      //   let that = this;
      //   oBindList.requestContexts().then(function (aContexts) {

      //     if (aContexts.length > 0) {
      //       let aData = [];
      //       aContexts.forEach(context => {
      //         aData.push(context.getObject())
      //       });
      //       console.log("addata", aData);

      //       let data = aData.filter(item => item.Navoycur == UpData.Navoycur);
      //       console.log("fghj", data, UpData.Navoygcurdes);

      //       console.log("hello");
      //       let path = `/CurTypeSet('${UpData.Navoycur}')`;

      //       let upContext = aContexts.filter(obj => obj.sPath === path);
      //       inputFieldObj.setProperty("value", value2.trim());
      //       that.getView().getModel().refresh();
      //       upContext[0].setProperty("Navoygcurdes", UpData.Navoygcurdes.trim());
      //       deschanged.push(UpData.Navoygcurdes.trim())
      //       console.log(deschanged);

      //     }
      //   });

      //   oModel.submitBatch("update");
      //   // this._bChangesMade = false;
      // },





      onCreateSent: function (ev) {
        sap.m.MessageToast.show("Creating..")
        // console.log(ev.getParameter("context")?.getObject())
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
      onSaveCancel: function () {
        var that = this.getView();
        var value1 = that.byId("NAVOYCUR2").getValue();
        var value2 = that.byId("NAVOYGCURDES2").getValue();

        // Check if there are changes in the input fields
        if (value1 || value2) {
          // If changes are detected, prompt the user
          MessageBox.confirm(
            "Do you want to discard the changes?",
            {
              onClose: function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                  // If user confirms, discard changes and switch visibility
                  that.byId("NAVOYCUR2").setValue("");
                  that.byId("NAVOYGCURDES2").setValue("");
                  that.byId("createTypeTable").setVisible(true);
                  that.byId("entryTypeTable").setVisible(false);
                  that.byId("mainPageFooter").setVisible(false);
                  var deleteBtn = that.byId("deleteBtn"); // Store reference to delete button
                  if (deleteBtn) {
                    deleteBtn.setEnabled(true); // Enable delete button
                  }
                  MessageToast.show("Changes discarded.");
                }
              }
            }
          );
        } else {
          // If no changes, simply switch visibility and enable delete button
          that.byId("createTypeTable").setVisible(true);
          that.byId("entryTypeTable").setVisible(false);
          that.byId("mainPageFooter").setVisible(false);
          var deleteBtn = that.byId("deleteBtn"); // Store reference to delete button
          if (deleteBtn) {
            deleteBtn.setEnabled(true); // Enable delete button
          }
        }
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

      // pressCopy: function () {

      //   if (editFlag) {
      //     return;
      //   }

      //   if (aSelectedIds.length) {

      //     if (aSelectedIds.length > 1) {

      //       MessageToast.show("Please select one row");
      //       return

      //     }
      //   } else {
      //     MessageToast.show("Please select a row");
      //     return;
      //   }
      //   copyFlag = true;

      //   this.getView().byId("deleteBtn").setEnabled(false);
      //   this.getView().byId("editBtn").setEnabled(false);
      //   this.getView().byId("entryBtn").setEnabled(false);

      //   this.getView().byId("createTypeTable").setVisible(false);

      //   let code = aSelectedIds[0][0];
      //   let desc = aSelectedIds[0][1];

      //   this.getView().byId('entryTypeTable').setVisible(true);

      //   this.getView().byId("NAVOYCUR2").setValue(code);
      //   this.getView().byId("NAVOYGCURDES2").setValue(desc);

      //   this.getView().byId("mainPageFooter").setVisible(true);

      // },


      showValueHelpCurrency: function (oEvent) {
        try {
          let oMaterialModel = this.getView().getModel("CurrencyMode");
          console.log("OMaterial Model", oMaterialModel.getData());

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
            title: "Select Currency",
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

      handleValueHelpSelection: function (selectedItem) {
        var selectedCurrencyCode = selectedItem.getCells()[0].getText(); // Assuming currency code is in the first column
        var selectedCurrencyDescription = selectedItem.getCells()[1].getText(); // Assuming description is in the second column

        var inputCurrencyCode = this.getView().byId("NAVOYCUR2");
        if (inputCurrencyCode) {
          inputCurrencyCode.setValue(selectedCurrencyCode);
        } else {
          console.error("Input field with ID 'NAVOYCUR2' not found.");
        }

        var inputCurrencyDescription = this.getView().byId("NAVOYGCURDES2");
        if (inputCurrencyDescription) {
          inputCurrencyDescription.setValue(selectedCurrencyDescription);
        } else {
          console.error("Input field with ID 'NAVOYGCURDES2' not found.");
        }
      },

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



    });

  });