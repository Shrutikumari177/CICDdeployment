sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataMetaModel",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController, History, Filter, FilterOperator, MessageToast, MessageBox, ODataMetaModel, JSONModel) {
    "use strict";
    let aSelectedIds = [];
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    let onCopyInput = undefined;
    let getModelData = [];
    let oBusyDialog;

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BPMasterDetails", {
      async onInit() {

        await this.loadportdata();

      },
      loadportdata: async function () {
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/BusinessPartnerSet");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
          this.getView().getModel("dataModel").refresh();
          // this.getView().setModel(oModel,"Model");
        }.bind(this))
        console.log("mydata", getModelData.length, getModelData)


      },

      onNavigateDetails: function(oEvent) {
          
        var oBindingContext = oEvent.getParameter("bindingContext");                         
             // Retrieve the data object for the pressed rowvar 
            let data = oBindingContext.getObject();
            
            // let data = oSource.getBindingContext("").getObject();
            let tempModel = new sap.ui.model.json.JSONModel();
            tempModel.setData([data]);
            var oView = this.getView();
            if (!this._oDialog1) {
                this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.BusinessPartnerDetails", this);
                oView.addDependent(this._oDialog1);
       
         
            }
            this._oDialog1.setModel(tempModel,"nautiNewVendModel1")
            this._oDialog1.open();
      },

      oncancell: function () {
        this._oDialog1.close();
      },


      onSearch: function (oEvent) {
        var oTable = this.byId("createTypeTable");
        var oBinding = oTable.getBinding("items");
        var sQuery = oEvent.getParameter("newValue"); // Use 'newValue' for liveChange event
    
        var oFilter1 = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sQuery);
        var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sQuery);
        var oFilter3 = new sap.ui.model.Filter("Name2", sap.ui.model.FilterOperator.Contains, sQuery);
        var orFilter = new sap.ui.model.Filter({
            filters: [oFilter1, oFilter2, oFilter3],
            and: false
        });
    
        oBinding.filter([orFilter], "Application"); // Apply filters
    
        var oSelectDialog = oEvent.getSource();
        oBinding.attachEventOnce("dataReceived", function () {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },
    
    
      onBackPress: function () {
        
        // clear selection 
        this.byId("table").clearSelection();

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBusinessPartner");
       
      },

      onDeletePress: function () {
        var oTable = this.byId("table");
        var aSelectedContexts = oTable.getSelectedContexts(true);
    
        if (aSelectedContexts.length === 0) {
          sap.m.MessageToast.show("Please select at least one row to delete.");
          return;
        }
    
        const that = this;
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure you want to delete the selected item(s)?", {
              title: "Confirm",
              onClose: function (oAction) {
                if (oAction === MessageBox.Action.OK) {
    
                  oBusyDialog = new sap.m.BusyDialog({
                    text: "Deleting, please wait...",
                    title: "Processing"
                  });
                  oBusyDialog.open();
                  // that.deleteSelectedItems(aItems);
                  that.deleteSelectedItems(aSelectedContexts);
                } else {
                  oTable.clearSelection();
                  sap.m.MessageToast.show("Deletion canceled");
                }
              }
            }
          );
        });
      },
    
  // deleteSelectedItems: function (aItems) {
  //   let slength = aItems.length;
  //   let deleteMsg = slength === 1 ? "Record" : "Records";
  //   console.log("aItems", aItems);

  //   // Loop through each selected context and delete it
  //   aItems.forEach(function (oContext) {
  //     console.log("ocontext", oContext)
  //     oContext.delete()
  //       .then(function () {
  //         sap.m.MessageToast.show(`${deleteMsg} deleted successfully`);
  //         console.log("Successfully Deleted");
  //       })
  //       .catch(function (oError) {
  //         sap.m.MessageBox.error("Error deleting item: " + oError.message);
  //       });
  //   });
  // },

    deleteSelectedItems: function (aItems) {
      let slength = aItems.length;
      let deleteMsg = slength === 1 ? "Record" : "Records";
      let oModel = this.getOwnerComponent().getModel();
  
      aItems.forEach((oContext) => {
        // const oContext = oItem.getBindingContext();
        const oData = oContext.getObject();
        let Lifnr = oData.Lifnr;
        // let code = oData.Code;
        console.log("data to be deleted", Lifnr);
        let that = this;
        let oBindList = oModel.bindList("/BusinessPartnerSet");
  
        oBindList.requestContexts(0, Infinity).then((aContexts) => {
          aContexts.forEach((oContext) => {
            if (oContext.getObject().Lifnr === Lifnr ) {
              oContext.delete().then(function () {
                oModel.refresh();
  
                MessageToast.show(`${deleteMsg} deleted sucessfully`);
                that.resetView();
                oBusyDialog.close();
  
              }).catch((err) => {
                console.error("Error deleting record: ", err);
              });
            };
          });
        });
  
        this.byId("table").clearSelection();
  
      })
  
    },

    });

  });
