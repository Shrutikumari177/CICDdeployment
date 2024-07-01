sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,FilterOperator) {
        "use strict";

        var getBidData = [];
        const statusEnum = {
          OPEN: "",
          ONGOING: "ONGO",
          CLOSED: "CLOS",
        };
        return Controller.extend("com.ingenx.nauti.biddingcontroller.controller.Main", {
            onInit: function () {
              this.getOwnerComponent().setModel(new JSONModel({ bidList: [] }), "bidlist");
              const bidTileModel = new JSONModel({
                  Open: 0,
                  Closed: 0,
                  Ongoing: 0,
                  All: 0,
              });
              this.getView().setModel(bidTileModel, "bidtilemodel");
          
              let oModel = new JSONModel();
              this.getView().setModel(oModel, "dataModel");
          
              const oRouter = this.getOwnerComponent().getRouter();
              oRouter.getRoute("RouteMain").attachPatternMatched(this._onObjectMatched, this);
          },
          

          _onObjectMatched: function () {
            this._BusyDialog = new sap.m.BusyDialog({
                title: "Loading...",
            });
            this._BusyDialog.open();
            this._BusyTimeout = setTimeout(() => {
                if (this._BusyDialog) {
                    this._BusyDialog.setText("This is taking forever, please wait...");
                }
            }, 5000);
            let bModel = this.getOwnerComponent().getModel();
            let oBidListData = bModel.bindList("/BidsSet");
            oBidListData.requestContexts().then(function (aContexts) {
                let getBidData = [];
                aContexts.forEach(function (oContext) {
                    getBidData.push(oContext.getObject());
                });
                let counts = {
                    Open: 0,
                    Closed: 0,
                    Ongoing: 0
                };
                getBidData.forEach(function (bid) {
                    if (bid.Stat === "") {
                        counts.Open++;
                    } else if (bid.Stat === "CLOS") {
                        counts.Closed++;
                    } else if (bid.Stat === "ONGO") {
                        counts.Ongoing++;
                    }
                });

                let bidTileModel = this.getView().getModel("bidtilemodel");
                bidTileModel.setProperty("/Open", counts.Open);
                bidTileModel.setProperty("/Closed", counts.Closed);
                bidTileModel.setProperty("/Ongoing", counts.Ongoing);
                bidTileModel.setProperty("/All", getBidData.length);

                let oModel = new JSONModel();
                oModel.setData(getBidData);
                this.getView().setModel(oModel, "bidModel");
                console.log("Data retrieved:", getBidData);
        
                if (this._BusyDialog) {
                    this._BusyDialog.close();
                }
                clearTimeout(this._BusyTimeout);
            }.bind(this)).catch(function (error) {
                console.error("Error fetching data:", error);
                if (this._BusyDialog) {
                    this._BusyDialog.close();
                }
                clearTimeout(this._BusyTimeout);
            }.bind(this));
        },

            toBiddingDetail: function (oEvent) {
              debugger;
              const Chrnmin = oEvent.getSource().getBindingContext("bidModel").getProperty("Chrnmin");
              const Mode = oEvent.getSource().getBindingContext("bidModel").getProperty("Zmode");
              this.getOwnerComponent().getModel("navModel").setProperty("/navigatedCharterno", Chrnmin);
              this.getOwnerComponent().getModel("navModel").setProperty("/navigatedMode", Mode);
              const oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("RouteBidding", {});
              // this._refreshTrigger.setInterval(-1);
            },


            pressOpen:function(){
              const oTable = this.byId("centerDataTable");
              const oFilter = new Filter("Stat", FilterOperator.EQ,statusEnum.OPEN );
              oTable.getBinding("items").filter(oFilter);
            },
            pressClose:function(){
              const oTable = this.byId("centerDataTable");
              const oFilter = new Filter("Stat", FilterOperator.EQ,statusEnum.CLOSED );
              oTable.getBinding("items").filter(oFilter);
            },
            pressOngoing:function(){
              const oTable = this.byId("centerDataTable");
              const oFilter = new Filter("Stat", FilterOperator.EQ,statusEnum.ONGOING );
              oTable.getBinding("items").filter(oFilter);
            },
            pressAll:function() {
              const oTable = this.byId("centerDataTable");
              const oFilter = [];
              oTable.getBinding("items").filter(oFilter);
            },
            
            formatValue:function(item){
                 console.log("format value",item);
                 return item
            },

            formatStatus:function(status){
                    switch(status){
                        case "ONGO":
                          return "ONGOING";
                        case "CLOS":
                          return "CLOSE";
                        default:
                          return "OPEN";
              }
            },

            statusFormatter: function (status) {
                switch (status) {
                  case "ONGO":
                    return sap.ui.core.ValueState.Success;
                  case "CLOS":
                    return sap.ui.core.ValueState.Error;
                  default:
                    return sap.ui.core.ValueState.Information;
                }
              },
              

            dateFormat: function (oDate) {
                let date = new Date(oDate);
                let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                  pattern: "yyyy-MM-dd",
                });
                return oDateFormat.format(date);
              },
        });
    });
