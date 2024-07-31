sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/format/DateFormat",
        "sap/ui/model/json/JSONModel",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,DateFormat,  JSONModel) {
        "use strict";
        let receivedData = [];

        return Controller.extend("com.ingenx.nauti.biddingcontroller.controller.Bidding", {
            onInit: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched2, this);
                
                // oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);

                
            },

            _onObjectMatched2: async function(oEvent) {
                const navModel = this.getOwnerComponent().getModel("navModel");
    
                // Wait for the data to be available in the model
                await this._waitForModelData(navModel, [
                    "/navigatedVoyageNo",
                    "/navigatedCharterno",
                    "/navigatedBidStartDate",
                    "/navigatedBidStartTime",
                    "/navigatedBidEndDate",
                    "/navigatedBidEndTime",
                    "/navigatedMode"
                ]);
                const VoyageNo = navModel.getProperty("/navigatedVoyageNo");
                const Charterno = navModel.getProperty("/navigatedCharterno");
                const BidStartDate = navModel.getProperty("/navigatedBidStartDate");
                const BidStartTime = navModel.getProperty("/navigatedBidStartTime");
                const BidEndDate = navModel.getProperty("/navigatedBidEndDate");
                const BidEndTime = navModel.getProperty("/navigatedBidEndTime");
                const Mode = navModel.getProperty("/navigatedMode");
    
                // Use the retrieved properties as needed
                console.log(VoyageNo, Charterno, BidStartDate, BidStartTime, BidEndDate, BidEndTime, Mode);
    
                // Format the given date and time to the current system time zone
                // const localDateTimeString = this._formatToLocalDateTime("2023-07-07T00:05:30Z 15:33:12");
                // console.log("Local Date and Time:", localDateTimeString);
    
                // Get the control by its ID and set the text
                this.byId("_IDGenObjectStatus1").setText(BidStartDate + " " + BidStartTime);
                this.byId("_IDGenObjectStatus2").setText(BidEndDate + " " + BidEndTime);
    
                // Set the title and subtitle of the header
                this.byId("_IDGenHeader1").setTitle("Bid information for Charter Request : " + Charterno);
                this.byId("_IDGenHeader1").setSubtitle("Voyage No : " + VoyageNo);
    
                await this._calculateRanking(Charterno);
            },

            _waitForModelData: function (model, paths) {
                return new Promise((resolve) => {
                    const checkData = () => {
                        let dataAvailable = true;
                        for (const path of paths) {
                            if (!model.getProperty(path)) {
                                dataAvailable = false;
                                break;
                            }
                        }
                        if (dataAvailable) {
                            resolve();
                        } else {
                            setTimeout(checkData, 100); // Check again after 100ms
                        }
                    };
                    checkData();
                });
            },
            _getTimeZone: function () {
                // Get the current system date and time
                const currentDate = new Date();

                // Get the current system time zone
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Format the current date and time to include the time zone information
                const options = {
                    timeZone: timeZone,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                    timeZoneName: "short"
                };

                const formatter = new Intl.DateTimeFormat([], options);
                const formattedDate = formatter.format(currentDate);

                // Output the current date and time with the time zone
                console.log("Current Date and Time with Time Zone:", formattedDate);
                console.log("Current System Time Zone:", timeZone);
            },
            _checkingTime : function(){
                // Given date and time
            const dateString = "30-07-2024";
            const timeString = "15:30";

            // Parse the date and time strings
            const [day, month, year] = dateString.split('-').map(Number);
            const [hours, minutes] = timeString.split(':').map(Number);

            // Create a Date object
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

            // Format the Date object to the desired format
            const formattedDate = this.formatDateTime(date);

            // Display the formatted date and time
            console.log("Formatted Date and Time:", formattedDate);
            },
            formatDateTime: function(date) {
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const day = String(date.getUTCDate()).padStart(2, '0');
                const hours = String(date.getUTCHours()).padStart(2, '0');
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
                // Format the date part as YYYY-MM-DD
                const datePart = `${year}-${month}-${day}`;
    
                // Format the time part as HH:MM:SS
                const timePart = `${hours}:${minutes}:${seconds}`;
    
                // Combine date and time parts with a 'T' separator and append 'Z' for UTC
                const formattedDateTime = `${datePart}T${timePart}Z ${hours}:${minutes}:${seconds}`;
    
                return formattedDateTime;
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
                selectedCharterNo = "4000000621";
                mode = "MANU"
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

            _calculateRanking: async function (Chrnmin) {
                let oModel = this.getOwnerComponent().getModel();
                const aFilters = [
                    new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, Chrnmin)
                ];
                let oBindList = oModel.bindList("/calculateRankings", undefined, undefined, aFilters);

                await oBindList.requestContexts().then(function (aContexts) {
                    aContexts.forEach(oContext => {
                        receivedData.push(oContext.getObject())
                        console.log(oContext.getObject());
                    });
                });
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