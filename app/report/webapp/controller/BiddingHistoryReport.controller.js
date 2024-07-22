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
        let jsonModel2 = [];
        let VoyageNo;
        let ChartNoValue;
        return BaseController.extend("com.ingenx.nauti.report.controller.BiddingHistoryReport", {
            onInit() {
                // let oModel2 = new sap.ui.model.json.JSONModel();
                // this.getView().setModel(oModel2, "dataModel2");
                // let oModel4 = this.getOwnerComponent().getModel();
                // let oBindList4 = oModel4.bindList("/xNAUTIxBIDHISREPORT");
                // oBindList4.requestContexts(0, Infinity).then(function (aContexts) {
                //   aContexts.forEach(function (oContext) {
                //     getModelData.push(oContext.getObject());
                //   });
                //   oModel2.setData(getModelData);
                // }.bind(this))
                this.getModelData = [];
                this.jsonModel1 = new JSONModel();
                this.getView().setModel(this.jsonModel1, "biddingHistoryAwardModel");
                
                let oModel2 = new JSONModel();
                this.getView().setModel(oModel2, "dataModel2");
                
                let oModel4 = this.getOwnerComponent().getModel();
                let oBindList4 = oModel4.bindList("/xNAUTIxBIDHISREPORT");
                
                oBindList4.requestContexts(0, Infinity).then((aContexts) => {
                    aContexts.forEach((oContext) => {
                        this.getModelData.push(oContext.getObject());
                    });
                    oModel2.setData(this.getModelData);
                });
               
            },
           
            onCharteringNumber1: function () {
                if (!this._valueHelpDialog) {
                    this._valueHelpDialog = sap.ui.xmlfragment(
                        "com.ingenx.nauti.report.fragments.valueHelpBidCharteringReqNo",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog);
                }
                this._valueHelpDialog.open();
            },

            onCharteringValueHelpClose1: function (oEvent) {
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

              onCharteringNumber() {
                if (!this._valueHelpDialog) {
                    this._valueHelpDialog = sap.ui.xmlfragment(
                        "com.ingenx.nauti.report.fragments.valueHelpBidCharteringReqNo",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog);

                    // Set the model for the value help dialog if different from the main model
                    this._valueHelpDialog.setModel(this.getOwnerComponent().getModel());
                }
                this._valueHelpDialog.open();
            },
            onCharteringValueHelpClose(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                this.byId("CharteringRqNo").setValue(oSelectedItem.getTitle());
                var ChartNoValue = this.byId("CharteringRqNo").getValue();
                var filteredData = this.getModelData.filter(data => data.Chrnmin === ChartNoValue);
                
                this.jsonModel1.setData(filteredData);
                
                // Set IconTabBar to be visible
                this.byId("IconTabBar").setVisible(true); // Show the IconTabBar
            },


              onChartSearch: function (oEvent) {
                var sValue1 = oEvent.getParameter("value");
                var oFilter1 = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.Contains, sValue1);
                var oBinding = oEvent.getSource().getBinding("items");
                var oSelectDialog = oEvent.getSource();
            
                oBinding.filter([oFilter1]);
            
                oBinding.attachEventOnce("dataReceived", function() {
                    var aItems = oBinding.getCurrentContexts();
            
                    if (aItems.length === 0) {
                        oSelectDialog.setNoDataText("No data found");
                    } else {
                        oSelectDialog.setNoDataText("Loading");
                    }
                });
              },

              onNavigateDetails: function(oEvent) {
                let oSource = oEvent.getSource();
                let data = oSource.getBindingContext("biddingHistoryAwardModel").getObject();
                let tempModel = new sap.ui.model.json.JSONModel();
                tempModel.setData([data]);
                console.log("hiiii", tempModel)
                var oView = this.getView();
                if (!this._oDialog1) {
                    this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.report.fragments.biddingHistoryDetails", this);
                    oView.addDependent(this._oDialog1);
           
             
                }
                this._oDialog1.setModel(tempModel,"biddingHisReport1");
                this._oDialog1.open();
            },
              
              oncancell: function () {
                this._oDialog1.close();
              },


              





            

        });
    }
);