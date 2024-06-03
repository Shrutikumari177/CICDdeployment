sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Fragment"
    ],
    function (BaseController, MessageBox, JSONModel, Filter, FilterOperator,Fragment) {
        "use strict";
        let getModelData = [];
        let jsonModel1 = [];
        let VoyageNo;
        let ChartNoValue;
        return BaseController.extend("com.ingenx.nauti.report.controller.BiddingHistoryReport", {
            onInit() {
                let oModel2 = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel2, "dataModel2");
                let oModel4 = this.getOwnerComponent().getModel();
                let oBindList4 = oModel4.bindList("/xNAUTIxBIDHISREPORT");
                oBindList4.requestContexts(0, Infinity).then(function (aContexts) {
                  aContexts.forEach(function (oContext) {
                    getModelData.push(oContext.getObject());
                  });
                  oModel2.setData(getModelData);
                }.bind(this))
               
            },

            onCharteringNumber: function () {
                if (!this._valueHelpDialog) {
                    this._valueHelpDialog = sap.ui.xmlfragment(
                        "com.ingenx.nauti.report.fragments.valueHelpBidCharteringReqNo",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog);
                }
                this._valueHelpDialog.open();
            },

            onCharteringValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
        
                oEvent.getSource().getBinding("items").filter([]);
        
                if (!oSelectedItem) {
                  return;
                }
                this.byId("CharteringRqNo").setValue(oSelectedItem.getTitle());
                var ChartNo = this.getView().byId("CharteringRqNo");
                ChartNoValue = ChartNo.getValue();
        
                var filter = getModelData.filter(function (data) {
                  return data.Chrnmin === ChartNoValue
                })
                var VoyNamedata = filter[0].Voyno
                var chartObject = structuredClone(filter[0]);
                jsonModel1 = new sap.ui.model.json.JSONModel();
                this.getView().setModel(jsonModel1, "biddingHistoryAwardModel")
                jsonModel1.setData([chartObject]);
                console.log("ghkdg",this.getView().getModel('biddingHistoryAwardModel').getData());
                
                
               
        
              },
              onChartSearch: function (oEvent) {
                var sValue1 = oEvent.getParameter("value");
        
                var oFilter1 = new Filter("Chrnmin", FilterOperator.Contains, sValue1);
        
                oEvent.getSource().getBinding("items").filter([oFilter1]);
              },





            

        });
    }
);