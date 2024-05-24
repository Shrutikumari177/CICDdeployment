sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, BusyDialog) {
        "use strict";
        return Controller.extend("com.ingenx.nauti.submitquotation.controller.Bidding", {

            onInit: function () {
                const oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe("BiddingChannel", "BiddingDetail", this._onBiddingDetailReceived, this);
            
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);
            
                    this._oBusyDialog = new BusyDialog({
                      text: "Loading"
                  });
            },

            _onBiddingDetailReceived: function (sChannel, sEvent, oData) {
                this.getHeaderDetails(oData.path, oData.startDate, oData.startTime, oData.endDate, oData.endTime);
            },            
            
            _onObjectMatched: function (oEvent) {
                this.charterDetails = [];
                const path = oEvent.getParameter("arguments").path; 
            
                var oModel = this.getOwnerComponent().getModel();
                var oBidListData = oModel.bindList(`/xNAUTIxRFQCHARTERING('${path}')/toassociation3`);
            
                this._oBusyDialog.open(); // Show busy dialog

                oBidListData.requestContexts(0, Infinity).then(function (aContexts) {
                    aContexts.forEach(function (oContext) {
                        this.charterDetails.push(oContext.getObject());
                    }.bind(this)); // Use .bind(this) to ensure correct scope
            
                    if (this.charterDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any charter details.");
                    } else {
                        console.log("Charter Details", this.charterDetails);
                        this.getCharterDetailsData();
                    }
                }.bind(this)).catch(function (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching charter details.");
                }).finally(function () {
                    this._oBusyDialog.close(); // Hide busy dialog
                }.bind(this));
            },   

            getHeaderDetails: function (bidPath, startDate, startTime, endDate, endTime) {
                this.headerDetails = [];
                const dCharter = {
                    voyageType: "",
                    vesselType: "",
                    bStartDate: startDate,
                    bStartTime: startTime,
                    bEndDate: endDate,
                    bEndTime: endTime,
                    biddingType: "",
                    Currency: ""
                };
                var dModel = new JSONModel();
                dModel.setData(dCharter);
                this.getView().setModel(dModel, "headerDetailModel");
                console.log("date is", this.getView().getModel("headerDetailModel").getData());

                var oModel = this.getOwnerComponent().getModel();
                var oBidListData = oModel.bindList(`/xNAUTIxRFQCHARTERING('${bidPath}')/toassociation2`);
                
                this._oBusyDialog.open(); // Show busy dialog

                oBidListData.requestContexts(0, Infinity).then(function (aContexts) {
                    aContexts.forEach(function (oContext) {
                        this.headerDetails.push(oContext.getObject());
                    }.bind(this));

                    if (this.headerDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any charter details.");
                    } else {
                        let firstDetail = this.headerDetails[0];
                        dCharter.voyageType = firstDetail.Voyty;
                        dCharter.vesselType = firstDetail.Carty;
                        dCharter.Currency = firstDetail.Curr;
                        dCharter.biddingType = firstDetail.Bidtype;

                        dModel.setData(dCharter);
                        this.getView().setModel(dModel, "headerDetailModel");

                        console.log("Charter Details", this.headerDetails);
                    }
                }.bind(this)).catch(function (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching charter details.");
                }).finally(function () {
                    this._oBusyDialog.close(); // Hide busy dialog
                }.bind(this));
            },

            getCharterDetailsData: function() {
                const uniqueVlegnData = new Set();
                var uniqueVoyageDetails = this.charterDetails.filter(function(item) {
                    if (uniqueVlegnData.has(item.Vlegn)) {
                        return false;
                    } else {
                        uniqueVlegnData.add(item.Vlegn);
                        return true;
                    }
                });

                if (uniqueVoyageDetails.length > 0) {
                    const vModel = new sap.ui.model.json.JSONModel();
                    vModel.setData(uniqueVoyageDetails);
                    this.getView().setModel(vModel, "voyageDetailsModel");

                    console.log("bidding model data", this.getView().getModel("voyageDetailsModel").getData());
                } else {
                    console.warn("No unique voyage data found");
                }
            }

        });
    });
