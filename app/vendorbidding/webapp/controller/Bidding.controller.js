
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/BusyDialog",
    "sap/ui/core/BusyIndicator",
    "com/ingenx/nauti/vendorbidding/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/ui/model/Filter} Filter
     * @param {typeof sap/ui/model/FilterOperator} FilterOperator
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, Filter, FilterOperator, BusyDialog, BusyIndicator, formatter) {
        "use strict";
        var intervalId;
        return Controller.extend("com.ingenx.nauti.vendorbidding.controller.Main", {
            formatter: formatter,

            onInit: function () {
                this.infoModel = new JSONModel({
                    "voyageNo": "",
                    "charteringNo": "",
                    "vendorNo": "",
                    "status": "",
                    "startDate": "",
                    "startTime": "",
                    "endDate": "",
                    "endTime": "",
                    "currency":"",
                });
                this.getView().setModel(this.infoModel, "VendorData");


                var oData = {
                    inputValue: "",
                    displayValue: "12000"
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "inputModel");

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);
                // this._startAutoRefresh();
            },           


            //This function is using for geting the session storage data that is shared during 
            _onObjectMatched: async function (oEvent) {
                this.byId("freightCostInput").setValue("");
                this._delayPageDisplay();

                let headerDataLoaded = false;
                let voyageDataLoaded = false;

                this.headerDetails = [];
                this.charterDetails = [];
                this.hintDetails = [];
                this.BidDetails = [];

                try {
                    const biddingData = JSON.parse(sessionStorage.getItem("biddingData"));
                    console.log("bidding data",biddingData);
                    this._updateVendorData(biddingData);
                    console.log("Updated vData", this.getView().getModel("VendorData").getData());
                    // var that = this
                

                    await this.getHeaderDetailsData(biddingData.Voyno, biddingData.Chrqsdate, biddingData.Chrqstime, biddingData.Chrqedate, biddingData.Chrqetime,biddingData.zstat);
                    headerDataLoaded = true;
                    this._fetchAndSetBids()
                    this._updateUIBasedOnStatus(biddingData.zstat);
                    this._intervalId = setInterval(this._fetchAndSetBids.bind(this), 2000);
                    // this.onPostLineItemData(biddingData.Lifnr, biddingData.Voyno, biddingData.Chrnmin, biddingData.Chrqsdate, biddingData.Chrqstime, biddingData.Chrqedate, biddingData.Chrqetime)
                    voyageDataLoaded = true;
                } catch (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching data.");
                    this._oBusyDialog.close();
                }
            },

            // This function is using for set the data into model that is called from _onObjectMatched method
            _updateVendorData: function (biddingData) {
                let vInfo = this.getView().getModel("VendorData");
                vInfo.setProperty("/voyageNo", biddingData.Voyno);
                vInfo.setProperty("/charteringNo", biddingData.Chrnmin);
                vInfo.setProperty("/vendorNo", biddingData.Lifnr);
                vInfo.setProperty("/status", biddingData.zstat);
                vInfo.setProperty("/startDate", biddingData.Chrqsdate);
                vInfo.setProperty("/startTime", biddingData.Chrqstime);
                vInfo.setProperty("/endDate", biddingData.Chrqedate);
                vInfo.setProperty("/endTime", biddingData.Chrqetime);
            },

            // This function is using for validation of freight cost 
            onFreightCostLiveChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var regex = /^\d+(\.\d{0,2})?$/;
                if (sValue === "" || regex.test(sValue)) {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                } else {
                    sap.m.MessageToast.show("Please enter a valid Number")
                }
                var validValue = sValue.match(/^\d+(\.\d{0,2})?/);
                if (validValue) {
                    oInput.setValue(validValue[0]);
                } else {
                    oInput.setValue("");
                }
            },

            // This function is using for hide and display the button or strip based on Charter status
            _updateUIBasedOnStatus: function (status) {
                let submitBtn = this.getView().byId("_IDGenButton1");
                let exitButton = this.getView().byId("Exitbtn");
                let msgStrip = this.getView().byId("msgStrip");

                if (status === "Yet to Start" || status === "Closed") {
                    submitBtn.setEnabled(false);
                    exitButton.setVisible(false);
                    msgStrip.setVisible(status === "Yet to Start");
                } else {
                    submitBtn.setEnabled(true);
                    exitButton.setVisible(true);
                    msgStrip.setVisible(false);
                }
            },

            // This method is using for extract the first and last Quotation value of Controller 
            _fetchAndSetBids: async function () {
                
                try {
                //  debugger
                    const biddingData = JSON.parse(sessionStorage.getItem("biddingData"));
                    let [vendorBid, controllerBids,getfirstBidData] = await Promise.all([
                        this._fetchBidData("/VenodrLiveBidDetails"),
                        this._fetchBidData("/ControllerLiveBidDetails"),
                        this._fetchBidData("/quotations")
                    ]);

                    let firstBid = getfirstBidData.filter(item=>{
                        return item.Lifnr === biddingData.Lifnr && item.Voyno === biddingData.Voyno
                    })
                    let firstBidValue = firstBid[0].to_quote_item.filter(i=>{return i.Zcode=== 'FREIG'})
                    let vendorBids = vendorBid.filter(item=>item.vendorNo === biddingData.Lifnr) 
                    this._updateBidTextFields("FirstBidText",firstBidValue[0].Value);
                    if (vendorBids.length > 0) {
                        vendorBids.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        let lastEntryData = vendorBids[0];
                        this._updateBidTextFields("GenObjectStatus3", lastEntryData.quotationPrice);
                    } else {
                        this._updateBidTextFields("GenObjectStatus3", "0.000");
                    }

                    if (controllerBids.length > 0) {
                        controllerBids.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        let lastControllerBid = controllerBids[controllerBids.length - 1];
                        this._updateBidTextFields("GenObjectStatus1", lastControllerBid.quotationPrice);
                    } else {
                        this._updateBidTextFields("GenObjectStatus1", "0.000");
                    }
                } catch (oError) {
                    console.error("Error fetching bid data:", oError);
                }
            },

            // This function is used to read the data with odata services and called from _fetchAndSetBids method
            _fetchBidData: async function (path) {
                let vInfo = this.getView().getModel("VendorData");
                let charminNo = vInfo.getProperty("/charteringNo");
                let oModel = this.getView().getModel();
                if (!oModel) {
                    throw new Error("OData model is not defined.");
                }
                let oBidListData = oModel.bindList(path, undefined, undefined, undefined, {
                    $filter: `Chrnmin eq '${charminNo}'`
                });

                let aContexts = await oBidListData.requestContexts(0, Infinity);
                let aPromises = aContexts.map(oContext => oContext.requestObject());
                return Promise.all(aPromises);
            },

            // This function is using for set the text of first and last bids and called from _fetchAndSetBids
            _updateBidTextFields: function (fieldId, value) {
                let oField = this.getView().byId(fieldId);
                if (oField) {
                    let formattedValue = this.formatter.formatNumber(value);
                    console.log(`Setting field ${fieldId} with value:`, formattedValue);
                    oField.setText(formattedValue ? formattedValue : "0.000")

                }
            },

            // This function is using to navigate the previous page 
            onBackButtonPress: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            },

            nSubmit: async function () {
                debugger
                let vDataModel = this.getView().getModel("VendorData").getData()
                let vendorNo = vDataModel.vendorNo
                let voyageNo = vDataModel.voyageNo
                let charteringNo = vDataModel.charteringNo
                let quotedPrice = this.getView().byId("freightCostInput").getValue()
                let comment = this.getView().byId("commentInput").getValue()
                let oPayload = {
                    Chrnmin: charteringNo,
                    vendorNo: vendorNo,
                    voyno: voyageNo,
                    quotationPrice: quotedPrice,
                    comment: comment
                }
                const oDataModelV4 = this.getOwnerComponent().getModel();
                let oBindList = oDataModelV4.bindList("/VenodrLiveBidDetails", true);
                try {
                    let res = await oBindList.create(oPayload);
                    if (res) {
                       new sap.m.MessageBox.success("Successfully Submitted", {
                            onClose: function () {
                                // that.getOwnerComponent().getRouter().navTo("RouteMain");
                            }
                        })
                    }
                } catch (error) {
                  console.log("error during creating",error);  
                }
            },

            //This function is using to submit the Quotation value to hana 
            onSubmit: function () {
                
                let vDataModel = this.getView().getModel("VendorData").getData()
                let vendorNo = vDataModel.vendorNo
                let voyageNo = vDataModel.voyageNo
                let charteringNo = vDataModel.charteringNo
                let quotedPrice = this.getView().byId("freightCostInput").getValue()
                let comment = this.getView().byId("commentInput").getValue()
                let oPayload = {
                    Chrnmin: charteringNo,
                    vendorNo: vendorNo,
                    voyno: voyageNo,
                    quotationPrice: quotedPrice,
                    comment: comment
                }
                const oDataModelV4 = this.getOwnerComponent().getModel();
                let oBindList = oDataModelV4.bindList("/VenodrLiveBidDetails", true);
                oBindList.create(oPayload, true).created(x => { console.log(x) });
                var that = this
                oBindList.attachCreateCompleted(function (p) {
                    let p1 = p.getParameters();

                    let oContext = p1.context;
                    let oData = oContext.getObject();
                    if (p1.success) {
                        sap.m.MessageBox.success(`Submit Successfully`, {
                            title: "Submitted",
                            onClose: function () {
                                console.log("sent voyage no. :", oData.Voyno)
                            }
                        });
                        that.clearFields();
                        that._fetchAndSetBids();

                    } else {
                        sap.m.MessageBox.error("Error occurred while creating voyage");
                        console.log("error messages : ", oContext.getMessages());
                    }
                });
                console.log("hello");
            },

            // This function is used to fetch the voyage data 
            getHeaderDetailsData: async function (bidPath, startDate, startTime, endDate, endTime,status) {
                const dCharter = {
                    voyageType: "",
                    vesselType: "",
                    bStartDate: startDate ?? null,
                    bStartTime: startTime ?? null,
                    bEndDate: endDate ?? null,
                    bEndTime: endTime ?? null,
                    biddingType: "",
                    Currency: ""
                };
                try {
                    let sNewDate = this.formatter.dateFormat(startDate)
                    let sEndDate = this.formatter.dateFormat(endDate)
                    this.onTimer(sNewDate, startTime, sEndDate, endTime,status)
                    var oModel = this.getOwnerComponent().getModel();
                    var oBidListData = oModel.bindList(`/xNAUTIxVOYAGEHEADERTOITEM`, undefined, undefined, undefined, {
                        $filter: `Voyno eq '${bidPath}'`
                    });

                    const aContexts = await oBidListData.requestContexts(0, Infinity);
                    aContexts.forEach(function (oContext) {
                        this.headerDetails.push(oContext.getObject());
                    }.bind(this));
                    console.log("header data", this.headerDetails);

                    if (this.headerDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any charter details.");
                    } else {
                        let firstDetail = this.headerDetails[0];
                        dCharter.voyageType = firstDetail.Voyty;
                        dCharter.vesselType = firstDetail.Carty;
                        dCharter.Currency = firstDetail.Curr;
                        this.currType = firstDetail.Curr
                        dCharter.biddingType = firstDetail.Bidtype;
                        let currLabel = this.getView().byId("_IDGenLabel9");

                        if (currLabel) {
                            currLabel.setText(dCharter.Currency);
                        } else {
                            console.error("Label with ID _IDGenLabel9 not found.");
                        }
                        const dModel = new JSONModel();
                        dModel.setData(dCharter);
                        this.getView().setModel(dModel, "headerDetailModel");

                        console.log("Updated headerDetailModel", dModel.getData());
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                    let message = `Chartering details not found for Voyage No: ${bidPath}`
                    sap.m.MessageToast.show(message);
                }
            },

            //This function is used to clear the quoted and comment field 
            clearFields: function () {
                let freightCostInput = this.byId("freightCostInput")
                freightCostInput.setValue("")
                let freightCommentInput = this.byId("commentInput")
                freightCommentInput.setValue("")
            },

            //This  function is using for refreshing the models
            _clearModels: function () {
                this.getView().getModel("headerDetailModel").setData({});
                this.getView().getModel("voyageDetailsModel").setData({});
                this.getView().getModel("hintDataModel").setData({});
            },

            // This function is using for creating the timer for bidding
            onTimer: function (startDate, startTime, endDate, endTime,status) {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }

                var startDateTime = new Date(startDate + 'T' + startTime);
                var endDateTime = new Date(endDate + 'T' + endTime);

                var updateInterval = 1000;

                var oRadialMicroChart = this.byId("radialClock");
                var oTimeText = this.byId("timeText");

                oRadialMicroChart.setPercentage(0);
                oTimeText.setText("");

                if (status === "Closed") {
                    oRadialMicroChart.setPercentage(100);
                    oTimeText.setText("Time Left - 00:00:00");
                    oRadialMicroChart.setValueColor("Critical"); 
                    sap.m.MessageBox.show("Bidding has been closed.", {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: "Bidding Closed",
                        actions: [sap.m.MessageBox.Action.OK],
                        onClose: function (oAction) {
    
                        }.bind(this)
                    });
                    return;
                }

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

                        let timeText;
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
                                    that.triggerPostLineItemData()
                                    that.getOwnerComponent().getRouter().navTo("RouteMain");
                                }
                            });
                        }
                    }
                }.bind(this), updateInterval);
            },


            // This function is used to fetch the vendor model data and send data by paramter.
            triggerPostLineItemData: async function () {
                try {
                    debugger
                    let data = this.getView().getModel("VendorData").getData();
                    console.log("triggeredpost lineitem data",data)
                    await this.onPostLineItemData(data.vendorNo, data.voyageNo, data.charteringNo, data.startDate, data.startTime, data.endDate, data.endTime);
                } catch (error) {
                    console.error("Error in triggerPostLineItemData:", error);
                }
            },

            // This function is used to fetch the vendor quotation data and send to s4   
            onPostLineItemData: async function (vNo, voyageNo, charterNo, startDate, sTime, endDate, eTime) {
                try {
                    let startTime = `${sTime}.0`;
                    let endTime = `${eTime}.0`;            

                    let headerToItem = [{
                            "Voyno" : voyageNo,
                            "Lifnr" : vNo,
                            "Chrnmin": charterNo,
                            "Cunit":   this.currType || "",
                           "Chrqsdate": startDate,
                           "Chrqstime": startTime,
                           "Chrqedate": endDate,
                           "Chrqetime": endTime
                        }]       

                    let payload = {
                        "Chrnmin": charterNo,
                        "venToItem": headerToItem
                    };
                    console.log("Payload:", payload);
                    await this._sendVendorDataToS4(payload);
                } catch (error) {
                    console.error("Error in onPostLineItemData:", error);
                }
            },
          
            _sendVendorDataToS4: function (oPayload) {
                
                const oDataModelV4 = this.getOwnerComponent().getModel();
                let oBindList = oDataModelV4.bindList("/vendorFinSet");
                oBindList.create(oPayload,true).created().then(oContext => {
                    sap.m.MessageBox.success(`Data Submit Successfully`, {
                        title: "Data Created",
                        onClose: function () {
                        }
                    });
                }).catch(oError => {
                    sap.m.MessageBox.error("Error occurred while creating voyage");
                    console.log("Error messages: ", oError);
                });
            },



            // This function is used to delay the page during laoding and applied classed for blurring the page
            _delayPageDisplay: function () {
                var that = this;
                BusyIndicator.show(0);
                this._applyBlur();
                setTimeout(function () {
                    BusyIndicator.hide();
                    that._removeBlur();
                    that.getView().byId("page").setVisible(true);
                }, 2000);
            },

            _applyBlur: function () {
                $("body").addClass("blurred");
            },

            _removeBlur: function () {
                $("body").removeClass("blurred");
            },
            onExit: function () {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                if (this._oPollingInterval) {
                    clearInterval(this._oPollingInterval);
                }
                if (this._intervalId) {
                    clearInterval(this._intervalId);
                }
            },

            // This function is used for exit from the bidding
            OnExitButton: function () {
                sap.m.MessageBox.confirm("Do you want to exit the bidding?",
                    {
                        icon: sap.m.MessageBox.Icon.WARNING,
                        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                // let biddingData = JSON.parse(sessionStorage.getItem("biddingData"));

                                // if (biddingData) {
                                //     biddingData.zstat = "Closed";

                                //     let oModel = this.getView().getModel("charteringRequestModel");
                                //     let oData = oModel.getData();

                                //     for (let i = 0; i < oData.length; i++) {
                                //         if (oData[i].Chrnmin === biddingData.Chrnmin) {
                                //             oData[i] = biddingData;
                                //             break;
                                //         }
                                //     }
                                //     oModel.refresh();
                                // }
                                this.getOwnerComponent().getRouter().navTo("RouteMain");
                            }
                        }.bind(this)
                    });
            },

            // This function is used to recall the _fetchAndSetBids function for fetching the latest data
            _startAutoRefresh: function () {
                setInterval(this._fetchAndSetBids.bind(this), 9000);
            }

        });
    });

