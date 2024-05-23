sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";
        return Controller.extend("com.ingenx.nauti.submitquotation.controller.Main", {
            onInit: function () {
                this.getBidData = [];
                this.staticData = "2100000002"; 
            debugger;
            var oModel = this.getOwnerComponent().getModel();
            // console.log("dta ",oModel.getData());
            let aFilter = new sap.ui.model.Filter("Lifnr",sap.ui.model.FilterOperator.EQ,this.staticData);
                var oBidListData = oModel.bindList("/xNAUTIxRFQPORTAL",undefined, undefined, [aFilter], {
                    $expand: "toassociation2,toassociation1"
                });
                oBidListData.requestContexts().then(function (aContexts) {
                    aContexts.forEach(function (oContext) {
                        this.getBidData.push(oContext.getObject());
                    }.bind(this)); 
                    console.log("my data", this.getBidData);
            
                    // this.filterAndBindData();
                }.bind(this)); 
            },
           
            
            ilterAndBindData: function () {
                var extractData = this.getBidData.filter(function(item) {
                    console.log("item is",item.Lifnr === this.staticData);
                    return item.Lifnr === this.staticData; 
                }.bind(this)); 
            
                console.log("filterData", extractData);
            
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.setData({ filteredData: extractData });
            
                this.getView().setModel(oJSONModel);
            },
            

            toBiddingDetail:function(oEvent){
                const Chrnmin = oEvent.getSource().getBindingContext("sample").getProperty("reqNo");
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteBidding",{})
                console.log("name");
            },
            onPress:function(){
                console.log("inside function",getBidData);
            }
        });
    });
