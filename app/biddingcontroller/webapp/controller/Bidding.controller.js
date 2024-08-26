sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/format/DateFormat",
        "sap/ui/model/json/JSONModel",
       "sap/m/MessageToast"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,DateFormat,  JSONModel, MessageToast) {
        "use strict";
        let receivedData = [];
        let sVoyageNo = undefined;
        let sChrnminNo = undefined;
        let oEventBus = sap.ui.getCore().getEventBus();
        return Controller.extend("com.ingenx.nauti.biddingcontroller.controller.Bidding", {
            onInit: async function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched2, this);
                // oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);

               
            },

            _onObjectMatched2: async function(oEvent) {
                this._BusyDialog = new sap.m.BusyDialog({
                    title: "Loading...",
                  });
                  this._BusyDialog.open();
                const navModel = this.getOwnerComponent().getModel("navModel");
                // Wait for the data to be available in the model
                await this._waitForModelData(navModel, [
                    "/navigatedVoyageNo",
                    "/navigatedCharterno",
                    "/navigatedBidStartDate",
                    "/navigatedBidStartTime",
                    "/navigatedBidEndDate",
                    "/navigatedBidEndTime",
                    "/navigatedControllerCurrBid",
                    "/navigatedMode"
                ]);
             
                const vendorNo = navModel.getProperty("/navigatedVendorNo")
                const VoyageNo = navModel.getProperty("/navigatedVoyageNo");
                sVoyageNo = VoyageNo;
                const Charterno = navModel.getProperty("/navigatedCharterno");
                sChrnminNo = Charterno;
                const BidStartDate = navModel.getProperty("/navigatedBidStartDate");
                const BidStartTime = navModel.getProperty("/navigatedBidStartTime");
                const BidEndDate = navModel.getProperty("/navigatedBidEndDate");
                const BidEndTime = navModel.getProperty("/navigatedBidEndTime");
                const ControllerCurrentBid = navModel.getProperty("/navigatedControllerCurrBid");
                const Mode = navModel.getProperty("/navigatedMode");
                
                let newStartDate = this.dateFormat(BidStartDate)
                let newEndDate = this.dateFormat(BidEndDate)
                try {
                    this._startTimer(newStartDate,BidStartTime,newEndDate,BidEndTime)
                    this.onControllerPostData(vendorNo,VoyageNo,Charterno,BidStartDate,BidStartTime,BidEndDate,BidEndTime)
                    
                } catch (error) {
                    console.log("error:",error);
                }
                console.log(VoyageNo, Charterno, BidStartDate, BidStartTime, BidEndDate, BidEndTime, Mode);
    
    
                this.byId("_IDGenObjectStatus1").setText(BidStartDate.split("T")[0] + " | " + BidStartTime);
                this.byId("_IDGenObjectStatus2").setText(BidEndDate.split("T")[0] + " | " + BidEndTime);
                // this.byId("currentQuote").setValue(parseFloat(ControllerCurrentBid).toFixed(3));
                this.byId("currentQuote").setValue(this.formatNumber(ControllerCurrentBid));
    
                this.byId("_IDGenHeader1").setTitle("Bid information for Charter Request : " + Charterno);
                this.byId("_IDGenHeader1").setSubtitle("Voyage No : " + VoyageNo);
    
                await this._calculateRanking(Charterno);
                await this._calculateRankingAndSetModel(Charterno);
                if(Mode === "Auto"){
                    this.onStart2()
                }
                if (this._BusyDialog) {
                    this._BusyDialog.close();
                  }
            },
            dateFormat: function (oDate) {
                let date = new Date(oDate);
    
                let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: 'yyyy-MM-dd',
                });
                return oDateFormat.format(date);
            },
            formatNumber: function(value) {
                if (!value) {
                    return "";
                }
                var number = parseFloat(value);
                return new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                }).format(number) ;
            }, 

            onQuotePriceChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var regex = /^\d+(\.\d{0,2})?$/;
            
                oInput.setValueState(sap.ui.core.ValueState.None);
                oInput.setValueStateText("");
            
                if (sValue === "" || regex.test(sValue)) {
                    var validValue = sValue.match(/^\d+(\.\d{0,2})?/);
                    if (validValue) {
                        oInput.setValue(validValue[0]);
                    }
                } else {
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Please enter a valid number with up to two decimal places.");
                    oInput.setValue("");
                }
            }
            ,

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
                            setTimeout(checkData, 100); 
                        }
                    };
                    checkData();
                });
            },
            _getTimeZone: function () {
                const currentDate = new Date();
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
                console.log("Current Date and Time with Time Zone:", formattedDate);
                console.log("Current System Time Zone:", timeZone);
            },
            _checkingTime : function(){
            const dateString = "30-07-2024";
            const timeString = "15:30";
            const [day, month, year] = dateString.split('-').map(Number);
            const [hours, minutes] = timeString.split(':').map(Number);
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
            const formattedDate = this.formatDateTime(date);
            console.log("Formatted Date and Time:", formattedDate);
            },
            formatDateTime: function(date) {
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const day = String(date.getUTCDate()).padStart(2, '0');
                const hours = String(date.getUTCHours()).padStart(2, '0');
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                const seconds = String(date.getUTCSeconds()).padStart(2, '0');
                const datePart = `${year}-${month}-${day}`;
                const timePart = `${hours}:${minutes}:${seconds}`;    
                const formattedDateTime = `${datePart}T${timePart}Z ${hours}:${minutes}:${seconds}`;
                return formattedDateTime;
            },

            triggerControllerPostLineItemData: async function () {
                try {
                    let data = this.getView().getModel("navModel").getData();
                    await this.onControllerPostData(data.navigatedVendorNo,data.navigatedVoyageNo, data.navigatedCharterno, data.navigatedBidStartDate, data.navigatedBidStartTime, data.navigatedBidEndDate, data.navigatedBidEndTime);
                } catch (error) {
                    console.error("Error in triggerPostLineItemData:", error);
                }
            },

            onControllerPostData: async function (vendorNum,voyageNo, charterNo, startDate, sTime, endDate, eTime){
                try {
                  
                    let allControllerData = []; 
                    let startTime = `${sTime}.0`;
                    let endTime = `${eTime}.0`;
                    let oModel = this.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/ControllerLiveBidDetails");
                    
                    await oBindList.requestContexts().then(aContexts => {
                        aContexts.forEach(oContext => {
                            allControllerData.push(oContext.getObject());
                        });
                    });
            
                    let extractData = allControllerData.filter(item => item.Chrnmin === charterNo && item.voyno === voyageNo);
            
                    let headerToItem = allControllerData.map((vendor, index) => {
                        let createdAtDate = new Date(vendor.createdAt);
                        let biddate1 = createdAtDate.toISOString().split('T')[0]; 
                        let bidtime1 = createdAtDate.toTimeString().split(' ')[0];
                        let biddate = `${biddate1}T00:00:00Z`
                        let bidtime = `${bidtime1}.0`
                        return{
                        "Voyno": vendor.voyno,
                        "Lifnr": vendorNum,
                        "Zcode": "FREIG",
                        "Chrnmin": vendor.Chrnmin,
                        "Biddate": biddate,
                        "Bidtime": bidtime,
                        "CodeDesc": "FRIEGHT COST",
                        "Cvalue": vendor.quotationPrice,
                        "Chrqsdate": startDate,
                        "Chrqstime": startTime,
                        "Chrqedate": endDate,
                        "Chrqetime": endTime,
                        "Zmode": "AUTO",
                        "Uname": "ASHWANI",
                        }
                    });
            
                    let payload = {
                        "Chrnmin": charterNo, 
                        "contItemSet": headerToItem
                    };
            
                    console.log("Payload:", payload);
                    await this._sendControllerDataToS4(payload);
                } catch (error) {
                    console.error("Error in onControllerPostData:", error);
                }
            },            

            sendControllerDataToS4: function(oPayload) {
              
                const oDataModelV4 = this.getOwnerComponent().getModel();
                let oBindList = oDataModelV4.bindList("/contheaderSet");
            
                oBindList.create(oPayload).created().then(oContext => {
                    sap.m.MessageBox.success(`S4 data Submit Successfully`, {
                        title: "Data Created",
                        onClose: function () {
                        }
                    });
                }).catch(oError => {
                    sap.m.MessageBox.error("Error occurred while creating voyage");
                    console.log("Error messages: ", oError);
                });
            },
            
            onQuoteSubmit: function () {
                let oView = this.getView();
                let sQuotePrice = oView.byId("quoteInput").getValue();
                oView.byId("currentQuote").setValue(sQuotePrice);
                oView.byId("quoteInput").setValue("");
                let payLoad = {
                    "createdBy": "user123",
                    "Chrnmin": sChrnminNo,
                    "voyno": sVoyageNo,
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

            _calculateRankingAndSetModel: async function (Chrnmin) {
                let sortedData = await this.fetchAndSortData(Chrnmin);
                this.setVendorModel(sortedData);
            },

            fetchAndSortData: async function (Chrnmin) {
             
                let oModel = this.getOwnerComponent().getModel();
                const aFilters = [
                    new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, Chrnmin)
                ];
                let oBindList = oModel.bindList("/calculateRankings", undefined, undefined, undefined,{
                    $filter: `Chrnmin eq '${Chrnmin}'`
                });
                let receivedData = [];
            
                await oBindList.requestContexts().then(function (aContexts) {
                    aContexts.forEach(oContext => {
                        
                        let vendor = oContext.getObject();
                        let freightCost = 0;
            
                        for(let i = 0; i < vendor.Vendors.length; i++){
                            let LiveBiddData = {
                                vendorId : "",
                                vendorName : "",
                                Trank: "",
                                Tscore : "",
                                Crank: "",
                                originalBid : "",
                                currentBid : "Bid not started"
                            }
                            for(let j = 0; j < vendor.Vendors[i].bidDetails.length; j++){
                                if(vendor.Vendors[i].bidDetails[j].CodeDesc === "FREIGHT"){
                                    freightCost = vendor.Vendors[i].bidDetails[j].Value
                                }
                            }
                            LiveBiddData.vendorId = vendor.Vendors[i].vendorId;
                            LiveBiddData.vendorName = vendor.Vendors[i].vendorName;
                            LiveBiddData.Trank = vendor.Vendors[i].Trank;
                            LiveBiddData.Tscore = vendor.Vendors[i].score;
                            LiveBiddData.Crank = vendor.Vendors[i].Crank;
                            LiveBiddData.originalBid = freightCost;
                            receivedData.push(LiveBiddData);
                        }
                        
                    });
                });
            
                // Sort the data based on freight and score
                receivedData.sort(function (a, b) {
                    if (a.originalBid === b.originalBid) {
                        return b.score - a.score; 
                    }
                    return a.originalBid - b.originalBid; 
                });
            
                return receivedData;
            },
            
            setVendorModel: function (data) {
                let oViewModel = new sap.ui.model.json.JSONModel({ vendors: data });
                this.getView().setModel(oViewModel, "rankmodel");
                this.updateCardFromTable();
            },

            updateCardFromTable: function() {
              
                var oTable = this.byId("centerDataTable");
                var oItems = oTable.getItems();
                if (oItems.length === 0) {
                    console.error("No items in the table to update the card.");
                    return;
                }
                
                var oFirstItem = oItems[0];
                var oBindingContext = oFirstItem.getBindingContext("rankmodel");
                var oData = oBindingContext.getObject();
                // console.log("oDatafghfghj",oData);
                
                var oCard = this.byId("_IDGenCard4");
                var oHeader = oCard.getHeader();
                
                var oCommercialScore = this.byId("_IDGenObjectStatus3");
                var oTechnicalScore = this.byId("_IDGenObjectStatus4");
                
                oHeader.setTitle(`${oData.vendorName} : ${oData.vendorId}`);
                if(oData.currentBid === "Bid not started"){
                    oHeader.setSubtitle(`Quote: ${oData.originalBid}`);
                }
                else{
                    oHeader.setSubtitle(`Quote: ${oData.currentBid}`);
                }
                
                oCommercialScore.setText(oData.Crank);
                oTechnicalScore.setText(oData.Trank);
                // if(this._BusyDialog){
                //     this._BusyDialog.close();
                // }
            },
            onStart2: function () {
                this.byId("submitButton").setEnabled(true);
                this.byId("startMsgStrip").setVisible(false);
                this.byId("startButton").setVisible(false);
                this.byId("stopButton").setVisible(false);
                let oModel = this.getView().getModel("rankmodel");
                if (!oModel) {
                    console.error("Model 'rankmodel' is not defined.");
                    return;
                }
                let aVendors = oModel.getProperty("/vendors");
            
                aVendors.forEach(vendor => {
                    vendor.currentBid = vendor.originalBid;
                });
                oModel.updateBindings();
                this._startLiveBidding();
            },

            onStartBidding:function(){
                var sChrnmin = "4000000640";    
                var oModel = this.getView().getModel("biddingModel");
                var oEntry = {
                    Chrnmin: sChrnmin,
                    biddStartStatus: true
                };
                this.createEntries2(oEntry)
            },

            createEntries2: async function (payLoad) {
                try {
                    let oModel = this.getView().getModel();
                    console.log("Creating Entry.... ", payLoad);
            
                    let oBindList = oModel.bindList("/biddingStartManual");
                    let res = await oBindList.create(payLoad);
            
                    console.log("Entry created successfully", res);
                    sap.m.MessageToast.show("Entry created successfully.");
            
                    oModel.refresh();
                } catch (error) {
                    console.error("Failed to create entry:", error);
                    sap.m.MessageBox.error("Failed to create the entry.");
                }
            },            

            nStartBidding: async function() {
                let currentSelectedCharminNo = sChrnminNo;
                this.checkBiddingStatusExist(currentSelectedCharminNo);
                let bidStartStatusPayLoad = {
                    Chrnmin: currentSelectedCharminNo,
                    biddStartStatus : true
                }
                let srvModel = this.getOwnerComponent().getModel();
                let oBindList = srvModel.bindList("/biddingStartManual");
                try {
                    await oBindList.create(bidStartStatusPayLoad);
                    MessageToast.show("Bidding Started.....");
                    this.byId("submitButton").setEnabled(true);
                    this.byId("startMsgStrip").setVisible(false);
                    this.byId("startButton").setVisible(false);
                    let oModel = this.getView().getModel("rankmodel");
                    if (!oModel) {
                        console.error("Model 'rankmodel' is not defined.");
                        return;
                    }
                    let aVendors = oModel.getProperty("/vendors");
                
                    aVendors.forEach(vendor => {
                        vendor.currentBid = vendor.originalBid;
                    });
                    oModel.updateBindings();            
                    this._startLiveBidding();
                } catch (error) {
                   MessageToast.show("Error : ", error);
                } 
            },

            checkBiddingStatusExist : async function(sChrnminNo){
                let srvModel = this.getOwnerComponent().getModel();
                let oContext = srvModel.bindContext(`/biddingStartManual(Chrnmin='${sChrnminNo}')`);
                let oContextItem = await oContext.getBoundContext().getObject();
                console.log("oContextItem", oContextItem);
                return;
            },
            _startLiveBidding: function () {
                this._liveBiddingInterval = setInterval(() => {
                    this._fetchLatestBids();
                }, 1000); 
            },
            
            _fetchLatestBids: async function () {
                let oModel = this.getOwnerComponent().getModel();
                const aFilters = [
                    new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, sChrnminNo)
                ];
                let oBindList = oModel.bindList("/VenodrLiveBidDetails", undefined, undefined, aFilters);
                let liveBids = [];
                
                await oBindList.requestContexts().then(function (aContexts) {
                    aContexts.forEach(oContext => {
                        liveBids.push(oContext.getObject());
                    });
                });
                
                // Update the current bid values in the model
                let oViewModel = this.getView().getModel("rankmodel");
                let aVendors = oViewModel.getProperty("/vendors");
                
                liveBids.forEach(liveBid => {
                    let vendor = aVendors.find(vendor => vendor.vendorId === liveBid.vendorNo);
                    if (vendor) {
                        vendor.currentBid = liveBid.quotationPrice;
                    }
                });            
                aVendors.sort((a, b) => {
                    if (a.currentBid === b.currentBid) {
                        return b.Tscore - a.Tscore;
                    }
                    return a.currentBid - b.currentBid;
                });            
                aVendors.forEach((vendor, index) => {
                    vendor.Crank = `C${index + 1}`;
                });
            
                oViewModel.updateBindings();
                this.updateCardFromTable(); 
            },
            
            onStop: async function () {
                let oModel = this.getOwnerComponent().getModel();
                try {
                    const oContext = oModel.bindContext(`/biddingStartManual(Chrnmin='${sChrnminNo}')`);
                    await oContext.getBoundContext().setProperty("biddStartStatus", false);
                    this.byId("submitButton").setEnabled(false);
                    clearInterval(this._liveBiddingInterval);
                    MessageToast.show("Bidding Stopped.....");
                } catch (error) {
                    MessageToast.show("Failed to Exit.....");
                }
            },
            

            _startTimer: function(startDate, startTime, endDate, endTime) {
              
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            
                var startDateTime = new Date(startDate + 'T' + startTime);
                var endDateTime = new Date(endDate + 'T' + endTime);
            
                var updateInterval = 1000;
            
                var oRadialMicroChart = this.byId("radialClock");
                var oTimeText = this.byId("timeLeftCell");
            
                oRadialMicroChart.setPercentage(0);
                oTimeText.setText("");
            
                this.intervalId = setInterval(function () {
                    var currentDateTime = new Date();
            
                    if (currentDateTime >= startDateTime) {
                        var totalTime = (endDateTime - startDateTime) / 1000;
                        var timeElapsed = (currentDateTime - startDateTime) / 1000;
                        var remainingTime = totalTime - timeElapsed;
            
                        remainingTime = Math.max(0, remainingTime);
            
                        var hours = Math.floor(remainingTime / 3600);
                        var minutes = Math.floor((remainingTime % 3600) / 60);
                        var seconds = Math.floor(remainingTime % 60);
            
                        var percentage = Math.round((remainingTime / totalTime) * 100);
                        oRadialMicroChart.setPercentage(Math.max(0, percentage));
            
                        let  timeText;
                    if (remainingTime > 0) {
                        timeText = "Time Left - " + hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
                        oTimeText.setText(timeText)
                    } else {
                        oRadialMicroChart.setPercentage(Math.max(100, percentage));
                    }
                    if (remainingTime <= 600) { 
                        oRadialMicroChart.setValueColor("Critical"); // Or any other color like "Error", "Good", "Neutral"
                    } else {
                        oRadialMicroChart.setValueColor("Neutral"); 
                    }
                        if (remainingTime <= 0) {
                            clearInterval(this.intervalId);
                            this.intervalId = null;
                            let that = this;
                            sap.m.MessageBox.show("Bidding successfully completed.", {
                                icon: sap.m.MessageBox.Icon.SUCCESS,
                                title: "Bidding Complete",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    that.getOwnerComponent().getRouter().navTo("RouteMain");
                                }
                            });
                        }
                    }
                }.bind(this), updateInterval);
            }, 
            onExit: function () {
                if (this._timer) {
                    clearInterval(this._timer);
                }
                

            }
        });

    });