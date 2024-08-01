sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/BusyDialog"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/ui/model/Filter} Filter
     * @param {typeof sap/ui/model/FilterOperator} FilterOperator
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, Filter, FilterOperator, BusyDialog) {
        "use strict";
        const statusLevel = {
            CLOSED: "Closed",
            OPEN: "Open",
            SUBMIT: "Submitted",
            YETTOSTART: "Ongoing",
            ALL: "All",
        };

        let userEmail = undefined;
        return Controller.extend("com.ingenx.nauti.submitquotation.controller.Main", {

            onInit: async function () {
                await this.getLoggedInUserInfo();
                const bidTileModel = new JSONModel({
                    Open: 0,
                    Closed: 0,
                    All: 0,
                });
                this.getView().setModel(bidTileModel, "bidtilemodel");

                this._oBusyDialog = new BusyDialog({
                    text: "Loading"
                });

                let oVendorInfo = {
                    number: "",
                    name: "",
                    description: "",
                    address: "",
                    qualified: {
                        from: "",
                        to: "",
                    },
                    chno: [],
                };

                this.getBidData = [];
                this.staticData = "2100000001";
                if(userEmail === "shruti.kumari@ingenxtec.com"){
                    this.staticData = "2100000001";
                }
                else{
                    this.staticData = "2100000001";
                }

                var oModel = this.getOwnerComponent().getModel();

                let aFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, this.staticData);
                var oBidListData = oModel.bindList("/xNAUTIxsubmitquafetch", undefined, undefined, undefined, {
                    $filter: `Lifnr eq '${this.staticData}'`
                });

                this._oBusyDialog.open();

                oBidListData.requestContexts(0).then(function (aContexts) {
                    aContexts.forEach(function (oContext) {
                        this.getBidData.push(oContext.getObject());
                    }.bind(this));

                    if (this.getBidData.length > 0) {
                        oVendorInfo.number = this.getBidData[0].Lifnr;
                        oVendorInfo.name = this.getBidData[0].Name1;
                        oVendorInfo.address = `${this.getBidData[0].Stras} ${this.getBidData[0].Ort01}`;
                        this.charteringData = this.getBidData;


                        const oVendorModel = new JSONModel();
                        const charteringModel = new JSONModel();
                        oVendorModel.setData(oVendorInfo);
                        charteringModel.setData(this.charteringData);
                        this.getView().setModel(oVendorModel, "vendorinfo");
                        this.getView().setModel(charteringModel, "charteringRequestModel");
                        console.log("request model", this.getView().getModel("charteringRequestModel").getData());
                        this._getCharterListData();
                    }

                    console.log("oVendorInfo", oVendorInfo);
                    console.log("getBidData", this.getBidData);
                }.bind(this)).catch(function (error) {
                    console.error("Error fetching data", error);
                }).finally(function () {
                    this._oBusyDialog.close();
                }.bind(this));
            },

            getLoggedInUserInfo : async function(){
                try {
                  let User = await sap.ushell.Container.getService("UserInfo");
                  let userID = User.getId();
                  userEmail = User.getEmail();
                  let userFullName = User.getFullName();
                  console.log("userEmail", userEmail);
                  console.log("userFullName", userFullName);
                  console.log("userID", userID);
                } catch (error) {
                  
                  userEmail = "shruti.kumari@ingenxtec.com";
                }
            },

            etCharterListData: function () {
                debugger;
                let charteringData = this.getView().getModel("charteringRequestModel").getData();
                let current = `${this.dateFormat(new Date())}T${this.formatTime()}`;

                let counts = {
                    Open: 0,
                    Closed: 0,
                    Ongoing: 0,
                    All: charteringData.length
                };

                charteringData.forEach((element) => {
                    let start = `${this.dateFormat(element.Chrqsdate)}T${this.formatTime(element.Chrqstime)}`;
                    let end = `${this.dateFormat(element.Chrqedate)}T${this.formatTime(element.Chrqetime)}`;

                    if (current < start) {
                        element.zstat = statusLevel.YETTOSTART;
                        counts.Open++;
                    } else if (current > end) {
                        element.zstat = statusLevel.OPEN;
                        counts.Closed++;
                    } else {
                        element.zstat = statusLevel.OPEN;
                        counts.Open++;
                    }
                });

                this.getView().getModel("charteringRequestModel").refresh();

                let bidTileModel = this.getView().getModel("bidtilemodel");
                bidTileModel.setProperty("/Open", counts.Open);
                bidTileModel.setProperty("/Closed", counts.Closed);
                bidTileModel.setProperty("/All", counts.All);
            },

            _getCharterListData: function () {
                // debugger;
                let charteringData = this.getView().getModel("charteringRequestModel").getData();
                let current = new Date();

                let counts = {
                    Open: 0,
                    Closed: 0,
                    YETTOSTART: 0,
                    All: charteringData.length
                };

                charteringData.forEach((element) => {
                    let start = new Date(`${element.Chrqsdate}T${element.Chrqstime}`);
                    let end = new Date(`${element.Chrqedate}T${element.Chrqetime}`);

                    if (current >= start && current <= end) {
                        element.zstat = statusLevel.YETTOSTART;
                        counts.Open++;
                    } else if (current < start) {
                        element.zstat = statusLevel.OPEN;
                        counts.Open++;
                    } else if (current > end) {
                        element.zstat = statusLevel.CLOSED;
                        counts.Closed++;
                    }
                });

                this.getView().getModel("charteringRequestModel").refresh();

                let bidTileModel = this.getView().getModel("bidtilemodel");
                bidTileModel.setProperty("/Open", counts.Open);
                bidTileModel.setProperty("/Closed", counts.Closed);
                bidTileModel.setProperty("/YETTOSTART", counts.YETTOSTART);
                bidTileModel.setProperty("/All", counts.All);
            },





            changeDate: function () {

            },
            //   _getCharterListData: function () {
            //     let charteringData = this.getView().getModel("charteringRequestModel").getData();
            //     let current = `${this.dateFormat(new Date())}T${this.formatTime()}`;

            //     charteringData.forEach((element) => {
            //         let start = `${this.dateFormat(element.Chrqsdate)}T${this.formatTime(element.Chrqstime)}`;
            //         let end = `${this.dateFormat(element.Chrqedate)}T${this.formatTime(element.Chrqetime)}`;

            //         if (current < start) {
            //             element.Stat = statusLevel.YETTOSTART;
            //         } else if (current > end) {
            //             element.Stat = statusLevel.CLOSED;
            //         } else {
            //             element?.ChartReqtoVendBid?.results.length > 0
            //                 ? (element.Stat = statusLevel.SUBMIT)
            //                 : (element.Stat = statusLevel.OPEN);
            //         }
            //     });

            //     this.getView().getModel("charteringRequestModel").refresh(); 
            // },

            _initializeTiles: function (status) {
                this.getView().getModel("chartertilemodel").getData()[
                    status === statusLevel.SUBMIT ?
                    statusLevel.CLOSED :
                    status === statusLevel.YETTOSTART ?
                    statusLevel.OPEN :
                    status
                ]++;
                this.getView().getModel("chartertilemodel").getData()[statusLevel.ALL]++;
                this.getView().getModel("chartertilemodel").refresh();
            },

            pressOpen: function () {
                let aFilter = [];
                const oTable = this.byId("centerDataTable");
                const oFilterOpen = new Filter("zstat", FilterOperator.EQ, statusLevel.OPEN);
                const oFilterYetToStart = new Filter("zstat", FilterOperator.EQ, statusLevel.YETTOSTART);
                aFilter = [oFilterOpen, oFilterYetToStart];
                const oFilter = new Filter({
                    filters: aFilter,
                    and: false,
                });
                try {
                    oTable.getBinding("items").filter(oFilter);
                } catch (error) {
                    console.log(error.message);
                    sap.m.MessageToast.show("Nothing to filter.");
                }
            },

            pressClose: function () {
                let aFilter = [];
                const oTable = this.byId("centerDataTable");
                const oFilterClosed = new Filter("zstat", FilterOperator.EQ, statusLevel.CLOSED);
                const oFilterSubmitted = new Filter("zstat", FilterOperator.EQ, statusLevel.SUBMIT);
                aFilter = [oFilterClosed, oFilterSubmitted];
                const oFilter = new Filter({
                    filters: aFilter,
                    and: false,
                });
                try {
                    oTable.getBinding("items").filter(oFilter);
                } catch (error) {
                    console.log(error.message);
                    sap.m.MessageToast.show("Nothing to filter.");
                }
            },

            pressAll: function () {
                const oTable = this.byId("centerDataTable");
                const oFilter = [];
                try {
                    oTable.getBinding("items").filter(oFilter);
                } catch (error) {
                    console.log(error.message);
                    sap.m.MessageToast.show("Nothing to filter.");
                }
            },

            ilterAndBindData: function () {
                var extractData = this.getBidData.filter(function (item) {
                    console.log("item is", item.Lifnr === this.staticData);
                    return item.Lifnr === this.staticData;
                }.bind(this));

                console.log("filterData", extractData);

                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.setData({
                    filteredData: extractData
                });

                this.getView().setModel(oJSONModel);
            },

            formatTime: function () {
                function pad(n) {
                    return n < 10 ? '0' + n : n;
                }

                let now = new Date();
                let hours = pad(now.getHours());
                let minutes = pad(now.getMinutes());
                let seconds = pad(now.getSeconds());

                return `${hours}:${minutes}:${seconds}`;
            },

            statusFormatter: function (status) {
                switch (status) {
                    case statusLevel.OPEN:
                        return sap.ui.core.ValueState.Warning;
                    case statusLevel.CLOSED:
                        return sap.ui.core.ValueState.Error;
                    case statusLevel.YETTOSTART:
                        return sap.ui.core.ValueState.Info;
                    case statusLevel.WON:
                        return sap.ui.core.ValueState.Success;
                    default:
                        return sap.ui.core.ValueState.Information;
                }
            },

            dateFormat: function (oDate) {
                let date = new Date(oDate);

                let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: 'yyyy-MM-dd',
                });
                return oDateFormat.format(date);
            },


            dateFormatEnd: function (oDate) {
                let date = new Date(oDate);

                let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: 'yyyy-MM-dd',
                });
                return oDateFormat.format(date);
            },

            // Inside the toBiddingDetail function

            // toBiddingDetail: function (oEvent) {
            //     const oContext = oEvent.getSource().getBindingContext("charteringRequestModel");
            //     const rowData = oContext.getObject();

            //     const CharterReqNo = rowData.Chrnmin;
            //     const voyno = rowData.Voyno;
            //     const sdate = rowData.Chrqsdate;
            //     const sTime = rowData.Chrqstime;
            //     const eDate = rowData.Chrqedate;
            //     const eTime = rowData.Chrqetime;

            //     const oEventBus = sap.ui.getCore().getEventBus();
            //     oEventBus.publish("BiddingChannel", "BiddingDetail", {
            //         vendorNo : this.staticData,
            //         CharterReqNo: CharterReqNo,
            //         path: voyno,
            //         startDate: sdate,
            //         startTime: sTime,
            //         endDate: eDate,
            //         endTime: eTime
            //     });

            //     // Navigate inside the success callback of publishing event
            //     // This ensures that the model is set before navigating
            //     const oRouter = this.getOwnerComponent().getRouter();
            //     oEventBus.subscribeOnce("BiddingChannel", "BiddingDetailSet", function() {
            //         oRouter.navTo("RouteBidding", { path: voyno });
            //     }, this);
            // }



            toBiddingDetail: function (oEvent) {
                const oSource = oEvent.getSource();
                const oBindingContext = oSource.getBindingContext("charteringRequestModel");
                const rowData = oBindingContext.getObject();
                sessionStorage.setItem("biddingData", JSON.stringify(rowData));
                this.getOwnerComponent().getRouter().navTo("RouteBidding");
            }
        });
    });