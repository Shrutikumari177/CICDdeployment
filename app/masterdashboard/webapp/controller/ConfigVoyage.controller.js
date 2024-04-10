sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
 
  ],
  function (Controller, History, Fragment, MessageToast, MessageBox, JSONModel) {
    "use strict";
    let aSelectedIds=[];
 
 
    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.ConfigVoyage", {
 
      onInit: function () {
 
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
           
            return [oSelectedItem.getBindingContext().getProperty("Rels"), oSelectedItem.getBindingContext().getProperty("Voyty"), oSelectedItem.getBindingContext().getProperty("Vesty"), oSelectedItem.getBindingContext().getProperty("Zgroup"), oSelectedItem.getBindingContext().getProperty("App1")]
 
          } else {
 
          }
 
        });
        console.log(aSelectedIds);
        // console.log("Selected Travel IDs: " + aSelectedTravelIds.join(","));
        return aSelectedIds;
 
      },
      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteConfigReleaseDashboard");
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
      onPressHome: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },
      
      newEntries: function () {
        this.getView().byId("createTypeTable").setVisible(false)
        this.getView().byId("entryTypeTable").setVisible(true)
        this.getView().byId("mainPageFooter").setVisible(true)
 
 
      },
      onSave: function () {
        var that = this.getView();
        var value1 = this.getView().byId("releasestrategy").getValue();
        var value2 = this.getView().byId("voyagetype").getValue();
        var value3 = this.getView().byId("vesseltype").getValue();
        var value4 = this.getView().byId("userid").getValue();
        var value5 = this.getView().byId("username").getValue();
 
 
        if (!value1 || !value2 || !value3 || !value4 || !value5) {
          MessageToast.show("Please enter all fields.");
          return;
        }
 
        let data = {
          Rels: value1,
          Voyty: value2,
          Vesty: value3,
          Zgroup: value4,
          App1: value5
        };
        const oJsonModel = new sap.ui.model.json.JSONModel(data);
        that.setModel(oJsonModel, "oJsonModel");
        let oModel = this.getView().getModel();
        let oBindListSP = oModel.bindList("/VoyageReleaseSet");
 
        oBindListSP.attachCreateSent(this.onCreateSent, this);
        oBindListSP.attachCreateCompleted(this.onCreateCompleted, this);
 
        oBindListSP.attachEventOnce("dataReceived", function () {
          let existingEntries = []
          oBindListSP.getContexts().forEach(function (context) {
            return context.getProperty("Rels");
          });
 
          if (existingEntries.includes(value1)) {
            MessageToast.show("Duplicate Code is not allowed");
          } else {
 
            try {
              oBindListSP.create({
                Rels: value1,
                Voyty: value2,
                Vesty: value3,
                Zgroup: value4,
                App1: value5
              });
              that.getModel().refresh();
              that.byId("releasestrategy").setValue("");
              that.byId("voyagetype").setValue("");
              that.byId("vesseltype").setValue("");
              that.byId("userid").setValue("");
              that.byId("username").setValue("");
 
 
              MessageToast.show("Data created Successfully");
 
              that.byId("createTypeTable").setVisible(true);
              that.byId("createTypeTable").removeSelections();
              that.byId("entryTypeTable").setVisible(false);
              that.byId("mainPageFooter").setVisible(false);
 
            } catch (error) {
              MessageToast.show("Error while saving data");
            }
          }
        });
        oBindListSP.getContexts();
      }, onCreateSent: function (ev) {
        sap.m.MessageToast.show("Creating..")
      },
      onCreateCompleted: function (ev) {
        let isSuccess = ev.getParameter('success');
        if (isSuccess) {
          sap.m.MessageToast.show("Successfully Created.")
        } else {
          sap.m.MessageToast.show("Fail to Create.")
        }
      },
      pressEdit: function () {
 
        if (aSelectedIds.length) {
          if (aSelectedIds.length > 1) {
            MessageToast.show("Please select one row");
            return
          }
        } else {
          MessageToast.show("Please select a row");
          return;
        }
 
        this.getView().byId("createTypeTable").setVisible(false);
        let Rels = aSelectedIds[0][0];
        let Voyty = aSelectedIds[0][1];
        let Vesty = aSelectedIds[0][2];
        let Zgroup = aSelectedIds[0][3];
        let App1 = aSelectedIds[0][4];
        console.log("asdd", aSelectedIds[0]);
        console.log("gdsjjbdsabdsabnb",Rels,Voyty, Vesty, Zgroup, App1);
        this.getView().byId('updateTypeTable').setVisible(true);
        this.getView().byId("mainPageFooter2").setVisible(true);
 
        this.getView().byId("Relst").setText(Rels);
        this.getView().byId("voytyp").setValue(Voyty);
        this.getView().byId("vesseltyp").setValue(Vesty);
        this.getView().byId("uig").setValue(Zgroup);
        this.getView().byId("usrn").setValue(App1);
       
        // console.log(aSelectedIds[0][0], aSelectedIds[0][1]);

      },
      onPatchSent: function (ev) {
        sap.m.MessageToast.show("Updating..")
      },
      onPatchCompleted: function (ev) {
        let oView = this.getView();
        let isSuccess = ev.getParameter('success');
        if (isSuccess) {
          sap.m.MessageToast.show("Successfully Updated.");
          oView.getModel().refresh();
          oView.byId("createTypeTable").setVisible(true)
          oView.byId("mainPageFooter2").setVisible(false);
          oView.byId("updateTypeTable").setVisible(false);
        } else {
          sap.m.MessageToast.show("Fail to Update Nomination.")
        }
      },
      onUpdate: function () {
        let value1 = aSelectedIds[0][0];
        let value2 = this.getView().byId("voytyp").getValue();
        let value3 = this.getView().byId("vesseltyp").getValue();
        let value4 = aSelectedIds[0][3];
        let value5 = this.getView().byId("usrn").getValue();
        

        let UpData = {
          Rels: value1,
          Voyty: value2,
          Vesty: value3,
          Zgroup: value4,
          App1: value5
        };
        console.log("updata",UpData);

        let oJsonModel = this.getView().getModel();
        let oBindList = oJsonModel.bindList("/VoyageReleaseSet", {
          $$updateGroupId: "update"
        });

        oBindList.attachPatchSent(this.onPatchSent, this);
        oBindList.attachPatchCompleted(this.onPatchCompleted, this);

        let oFilter = new sap.ui.model.Filter("Rels", sap.ui.model.FilterOperator.EQ, UpData.Rels);
        // let oFilter1 = new sap.ui.model.Filter("Zgroup", sap.ui.model.FilterOperator.EQ, UpData.Zgroup);
        oBindList.filter(oFilter);
        console.log("filteroBindlist", oBindList);

        oBindList.requestContexts().then(function (aContexts) {
          if (aContexts.length > 0) {
            let aData = [];
            aContexts.forEach(context => {
              aData.push(context.getObject())
            });

            let data = aData.filter(item =>(item.Zgroup == UpData.Zgroup));

            if (
              (data && data.Voyty === UpData.Voyty) &&
              (data && data.Vesty === UpData.Vesty) &&
              (data && data.Rels === UpData.Rels)
            ) {
              sap.m.MessageToast.show("Nothing to Update..")
            } else {
              let path = `/VoyageReleaseSet('${UpData.Zgroup}'`;
              let upContext = aContexts.filter(obj => obj.sPath === path);
              upContext[0].setProperty("Voyty", UpData.Voyty);
                upContext[0].setProperty("Vesty", UpData.Vesty);
                upContext[0].setProperty("Rels", UpData.Rels);
            }
          }
        });

        oJsonModel.submitBatch("update");
      },
      onDeletePress: function () {

        let aItems = this.byId("createTypeTable").getSelectedItems();

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
              }
            }
          }
          );
        });

      },
      // internal calling fn by onDeletePress fn

      deleteSelectedItems: function (aItems) {
        const that = this;

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
      onCancel: function () {
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false)
        this.getView().byId("mainPageFooter").setVisible(false)
        // this.getView().byId("releasestrategy").setValue("");
        // this.getView().byId("voyagetype").setValue("");
        // this.getView().byId("vesseltype").setValue("");
        // this.getView().byId("userid").setValue("");
        // this.getView().byId("username").setValue("");
      },
 
    });

    
 
  });