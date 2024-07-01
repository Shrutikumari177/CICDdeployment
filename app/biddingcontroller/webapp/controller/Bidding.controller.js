sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.ingenx.nauti.biddingcontroller.controller.Bidding", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);
            },

            onQuoteSubmit: function () {
                let oView = this.getView();
                let sQuotePrice = oView.byId("quoteInput").getValue();
                oView.byId("currentQuote").setValue(sQuotePrice);
                oView.byId("quoteInput").setValue("");
                let payLoad = {
                    "createdBy": "user123",
                    "charmin": "400000008",
                    "voyno": "100000057",
                    "quotationPrice": sQuotePrice
                }
                this.createEntries(payLoad);

            },

            createEntries: async function (payLoad) {
                let oModel = this.getView().getModel();
                console.log("Creating Entering.... ", payLoad);
                console.log("Creating oModel.... ", oModel);

                let oBindList = oModel.bindList("/ControllerLiveBidDetails");
                let res = await oBindList.create(payLoad);
                oModel.refresh()
                return res;
            },


            _onObjectMatched: async function (oEvent) {
                debugger;
                this._startTimer();
                let selectedCharterNo = this.getOwnerComponent().getModel("navModel").getProperty("/navigatedCharterno");
                let mode = this.getOwnerComponent().getModel("navModel").getProperty("/navigatedMode");
                if (mode === "MANU") {
                    this.byId("submitButton").setEnabled(false);
                    this.byId("startMsgStrip").setVisible(true);
                    this.byId("startButton").setVisible(true);
                } else {
                    this.byId("submitButton").setEnabled(true);
                    this.byId("startMsgStrip").setVisible(false);
                    this.byId("startButton").setVisible(false);
                    console.log("value is", selectedCharterNo);
                }
            },

            _startTimer: function () {
                var oRadialMicroChart = this.byId("radialClock");
                var oTimeLabel = this.byId("timeLeftCell");
                var duration = 5 * 60 * 1000; // 15 minutes in milliseconds
                var startTime = Date.now();

                // Reset the chart and label
                oRadialMicroChart.setPercentage(0);
                oTimeLabel.setText("Time Left - 00:5:00");

                var timer = setInterval(function () {
                    var elapsed = Date.now() - startTime;
                    var remainingTime = duration - elapsed;
                    var hours = Math.floor(remainingTime / 3600000);
                    var minutes = Math.floor((remainingTime % 3600000) / 60000);
                    var seconds = Math.floor((remainingTime % 60000) / 1000);

                    // Format the time as HH:MM:SS
                    var timeString =
                        (hours < 10 ? "0" : "") + hours + ":" +
                        (minutes < 10 ? "0" : "") + minutes + ":" +
                        (seconds < 10 ? "0" : "") + seconds;
                    oTimeLabel.setText("Time Left - " + timeString);

                    var percentage = (elapsed / duration) * 100;
                    oRadialMicroChart.setPercentage(percentage);

                    if (elapsed >= duration) {
                        clearInterval(timer);
                        oTimeLabel.setText("Time Left - 00:00:00");
                    }
                }, 1000); // Update every second

                this._timer = timer; // Store the timer to clear it later if needed
            },
            onExit: function () {
                // Clean up the timer when the controller is destroyed
                if (this._timer) {
                    clearInterval(this._timer);
                }
            }

        });

    });