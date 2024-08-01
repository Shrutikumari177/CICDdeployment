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
    function (Controller, JSONModel, Filter, FilterOperator, BusyDialog,BusyIndicator,formatter) {
        "use strict";
        var intervalId;
        return Controller.extend("com.ingenx.nauti.vendorbidding.controller.Main", {
       formatter:formatter,
          onInit: function () {
            this.infoModel = new JSONModel({
              "voyageNo": "",
              "charteringNo": "",
              "vendorNo": "",
              "status": "",
              "startDate" : "",
              "startTime" : "",
              "endDate":"",
              "endTime":""
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
          },

          
        //This function is using for geting the session storage data that is shared during 
          _onObjectMatched: async function (oEvent) {
            this.byId("freightCostInput").setValue("")
              this._delayPageDisplay();
            // this._clearModels();
            let headerDataLoaded = false;
            let voyageDataLoaded = false;

            this.headerDetails = [];
            this.charterDetails = [];
            this.hintDetails = [];
            this.BidDetails = []
            try {
                const biddingData = JSON.parse(sessionStorage.getItem("biddingData"));
                var vInfo = this.getView().getModel("VendorData");
                vInfo.setProperty("/voyageNo", biddingData.Voyno);
                vInfo.setProperty("/charteringNo", biddingData.Chrnmin);
                vInfo.setProperty("/vendorNo", biddingData.Lifnr);
                vInfo.setProperty("/status", biddingData.zstat);
                vInfo.setProperty("/startDate", biddingData.Chrqsdate);
                vInfo.setProperty("/startTime", biddingData.Chrqstime);
                vInfo.setProperty("/endDate", biddingData.Chrqedate);
                vInfo.setProperty("/endTime", biddingData.Chrqetime);
                console.log("Updated vData", vInfo.getData());

                await this.getHeaderDetailsData(biddingData.Voyno, biddingData.Chrqsdate, biddingData.Chrqstime, biddingData.Chrqedate, biddingData.Chrqetime);
                headerDataLoaded = true;
                let submitBtn = this.getView().byId("_IDGenButton1");
                let exitButton = this.getView().byId("Exitbtn")
                let msgStrip = this.getView().byId("msgStrip")
                if (biddingData.zstat === "Yet to Start" || biddingData.zstat === "Closed") {
                    submitBtn.setEnabled(false);
                    exitButton.setVisible(false);
                    if (biddingData.zstat === "Yet to Start") {
                        msgStrip.setVisible(true);
                    } else {
                        msgStrip.setVisible(false);
                    }
                } else {
                    submitBtn.setEnabled(true);
                    exitButton.setVisible(true);
                    msgStrip.setVisible(false);
                }
                this._setFirstAndLastBids()
                voyageDataLoaded = true;
            } catch (error) {
                console.error("Error fetching data", error);
                sap.m.MessageToast.show("Error fetching data.");
                this._oBusyDialog.close();
            }
        },

        //This function is used to return the first and last bid according to date
        _setFirstAndLastBids: function () {
            var oModel = this.getOwnerComponent().getModel("bidData");
            var aBids = oModel.getProperty("/bids");

            aBids.sort(function (a, b) {
                var timeA = a.bidTime.split(":").map(Number);
                var timeB = b.bidTime.split(":").map(Number);
                return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
            });

            var firstBid = aBids[0];
            var lastBid = aBids[aBids.length - 1];

            this.byId("GenObjectStatus2").setText(firstBid.bidValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            this.byId("GenObjectStatus3").setText(lastBid.bidValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        },

      onBackButtonPress:function(){
        this.getOwnerComponent().getRouter().navTo("RouteMain");
    },

      onSubmit: function () {
        var oModel = this.getView().getModel("inputModel");
        var sValue = oModel.getProperty("/inputValue");
        oModel.setProperty("/displayValue", sValue);
    },

        getHeaderDetailsData: async function (bidPath, startDate, startTime, endDate, endTime) {
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
            this.onTimer(sNewDate,startTime,sEndDate,endTime)
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

        _clearModels: function () {
          this.getView().getModel("headerDetailModel").setData({});
          this.getView().getModel("voyageDetailsModel").setData({});
          this.getView().getModel("hintDataModel").setData({});
      },
   

    onTimer: function(startDate, startTime, endDate, endTime) {
        debugger;
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
        onExit: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        } ,
        OnExitButton: function () {
            sap.m.MessageBox.confirm("Are you sure you want to exit the bidding?",
             {icon: sap.m.MessageBox.Icon.WARNING,
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        let biddingData = JSON.parse(sessionStorage.getItem("biddingData"));
        
                        if (biddingData) {
                            biddingData.zstat = "Closed";
        
                            let oModel = this.getView().getModel("charteringRequestModel");
                            let oData = oModel.getData();
        
                            for (let i = 0; i < oData.length; i++) {
                                if (oData[i].Chrnmin === biddingData.Chrnmin) {
                                    oData[i] = biddingData;
                                    break;
                                }
                            }
                            oModel.refresh();
                        }
                        this.getOwnerComponent().getRouter().navTo("RouteMain");
                    }
                }.bind(this) 
            });
        }
        
        
        // OnExitButton:function(){
        //     this.getOwnerComponent().getRouter().navTo("RouteMain");
        // }       
          
        });
    });
  
