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

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BPMasterDetails", {
      async onInit() {

        await this.loadportdata();

      },
      loadportdata: async function () {
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/xNAUTIxBusinessPartner1");
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
          
        let oSource = oEvent.getSource();
        let data = oSource.getBindingContext("dataModel").getObject();
        let tempModel = new sap.ui.model.json.JSONModel();
        tempModel.setData([data]);
        var oView = this.getView();
        if (!this._oDialog1) {
            this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.BusinessPartnerDetails", this);
            oView.addDependent(this._oDialog1);
   
     
        }
        this._oDialog1.setModel(tempModel,"dataModel1")
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
        

        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBusinessPartner");
       
      },

    });

  });
