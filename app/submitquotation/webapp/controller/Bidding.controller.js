sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "sap/m/BusyDialog",
        "sap/m/MessageToast",
        "sap/ui/comp/library",
        "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
        "sap/m/SelectDialog",
        "sap/m/StandardListItem",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/Dialog",
        "com/ingenx/nauti/submitquotation/utils/helperFunctions"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, Fragment, BusyDialog, MessageToast, library, ValueHelpDialog, SelectDialog, StandardListItem, Filter, FilterOperator, Dialog, helperFunctions) {
        let bidPayload = [];
        var aData = [];
        var readPayload = []
        "use strict";
        return Controller.extend("com.ingenx.nauti.submitquotation.controller.Bidding", {

            onInit: function () {
                // this.byId("lastCleanDateBidInput").setMaxDate(new Date());
                this.infoModel = new JSONModel({
                    "voyageNo": "",
                    "charteringNo": "",
                    "vendorNo": "",
                    "status": "",
                    "startDate": "",
                    "startTime": "",
                    "endDate": "",
                    "endTime": ""
                });
                this.getView().setModel(this.infoModel, "vData");
                console.log("Initial vData", this.getView().getModel("vData").getData());

                var oModel = new JSONModel({
                    demurrage: "",
                    fCost2: "",
                    totalCost: ""
                });
                this.getView().setModel(oModel, "totalCalculateModel");


                this.getView().setModel(new sap.ui.model.json.JSONModel(), "headerDetailModel");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "hintDataModel");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "voyageDetailsModel");
                this.byId("_IDGenIconTabBar1").setSelectedKey("tab1");
                this.countryModel = new JSONModel();
                this.getView().setModel(this.countryModel, "countryDataModel");

                this.portModel = new JSONModel();
                this.getView().setModel(this.portModel, "portDataModel");

                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);

                this._oBusyDialog = new BusyDialog({
                    text: "Loading"
                });

            },

            _onObjectMatched: async function (oEvent) {
                this.resetFormFields();
                this.byId("_IDGenIconTabBar1").setSelectedKey("tab1");
                this._oBusyDialog.open();
                this._clearModels();
                let headerDataLoaded = false;
                let voyageDataLoaded = false;

                this.headerDetails = [];
                this.charterDetails = [];
                this.hintDetails = [];
                this.BidDetails = []

                // debugger;
                try {
                    const biddingData = JSON.parse(sessionStorage.getItem("biddingData"));
                    var vInfo = this.getView().getModel("vData");
                    vInfo.setProperty("/voyageNo", biddingData.Voyno);
                    vInfo.setProperty("/charteringNo", biddingData.Chrnmin);
                    vInfo.setProperty("/vendorNo", biddingData.Lifnr);
                    vInfo.setProperty("/status", biddingData.zstat);
                    vInfo.setProperty("/startDate", biddingData.Chrqsdate);
                    vInfo.setProperty("/startTime", biddingData.Chrqstime);
                    vInfo.setProperty("/endDate", biddingData.Chrqedate);
                    vInfo.setProperty("/endTime", biddingData.Chrqetime);
                    console.log("Updated vData", vInfo.getData());

                    await this.getHeaderDetails(biddingData.Voyno, biddingData.Chrqsdate, biddingData.Chrqstime, biddingData.Chrqedate, biddingData.Chrqetime);
                    headerDataLoaded = true;

                    await this.getVoyageDetailsData(biddingData.Voyno);
                    voyageDataLoaded = true;
                    await this.getHintDetailsData(biddingData.Voyno);
                    await this.getBidDetailsData(biddingData.zstat);
                    await this.getBidDetails(biddingData.Voyno)
                    await this.readBidDetailData(biddingData.Chrnmin)

                    if (headerDataLoaded && voyageDataLoaded) {
                        this._oBusyDialog.close();
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching data.");
                    this._oBusyDialog.close();
                }
            },

            _clearModels: function () {
                this.getView().getModel("headerDetailModel").setData({});
                this.getView().getModel("voyageDetailsModel").setData({});
                this.getView().getModel("hintDataModel").setData({});
            },

            getBidDetails: async function (VoyageNo) {
                let that = this;

                try {
                    let bidItemModel = new sap.ui.model.json.JSONModel();

                    let oModel = this.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/xNAUTIxBIDITEM", undefined, undefined, undefined, {
                        $filter: `Voyno eq '${VoyageNo}'`
                    });

                    let oContexts = await oBindList.requestContexts(0, Infinity);

                    let data = [];
                    oContexts.forEach(oContext => {
                        data.push(oContext.getObject());
                    });
                    console.log("Bid details data:", data);

                    bidItemModel.setData(data);
                    that.getView().setModel(bidItemModel, "bidItemModel");
                    that.getView().getModel("bidItemModel").refresh();
                    console.table(that.getView().getModel("bidItemModel").getData());
                    let templateData = await that._getBidTemplate(oModel, "technical");
                    bidPayload = [...data];
                    that._setBidTemplate(templateData, that.byId("submitTechDetailTable"));
                } catch (error) {
                    console.error("Error loading bid details:", error);
                } finally {}
            },

            readBidDetailData: async function (charterNo) {
                // debugger;
                let that = this;
                try {
                    let getDataForBidDetail = new JSONModel();
                    let oModel = this.getOwnerComponent().getModel();
                    let oBindListData = oModel.bindList("/quotations", undefined, undefined, undefined, {
                        $filter: `Chrnmin eq '${charterNo}'`
                    });
                    let oContext = await oBindListData.requestContexts(0, Infinity);
                    let bidData = [];
                    oContext.forEach(oContext => {
                        bidData.push(oContext.getObject());
                    });
                    readPayload = bidData.filter(item => item.Chrnmin === charterNo);
                    if (readPayload.length < 1) {
                        var message = `Bid details or vessel details not found for Chartering No: ${charterNo}`;
                        MessageToast.show(message);
                    }
                    getDataForBidDetail.setData(readPayload);
                    that.getView().setModel(getDataForBidDetail, "readBidData");
                    that.getView().getModel("readBidData").refresh();
                    console.log("read data ye hai", that.getView().getModel("readBidData").getData());
                    await that.readBidTemplateData(readPayload[0].to_quote_item, "technical");
                    await that.setBidTable(readPayload[0].to_quote_item, that.byId("TechDetailTable"))
                } catch (error) {
                    console.log("read error:", error);
                }
            },

            readBidTemplateData: function (oData, detailType) {
                //   debugger;
                let index = "Not Found";
                let freightValue = sap.ui.getCore().byId("");
                return new Promise(async (resolve, reject) => {
                    try {
                        // let oData = await helperFunctions.readEntity(oModel, "MasBidTemplateSet", undefined, undefined, undefined, undefined);
                        console.log("MasBidTemplate", oData);
                        // oData.sort((a, b) => {
                        //     if (a.Datatype.toLocaleLowerCase() < b.Datatype.toLocaleLowerCase()) {
                        //         return -1;
                        //     }
                        //     if (a.Datatype.toLocaleLowerCase() > b.Datatype.toLocaleLowerCase()) {
                        //         return 1;
                        //     }
                        //     return 0;
                        // });
                        for (let i = oData.length - 1; i >= 0; i--) {
                            let el = oData[i];

                            delete el.__metadata;

                            if (detailType === "technical") {
                                if (el.Zcode === "FREIG") {
                                    oData.splice(i, 1);
                                }
                            };
                            resolve(oData);
                        }
                    } catch (err) {
                        console.log(err);
                        sap.m.MessageBox.error(`${err.name} : ${err.message}`);
                    }
                });

            },

            _getBidTemplate: function (oModel, detailType) {
                let index = "Not Found";
                return new Promise(async (resolve, reject) => {
                    try {
                        let oView = this.getView();
                        let bidItemModel = oView.getModel("bidItemModel");
                        let oData = bidItemModel.getData();

                        oData.sort((a, b) => {
                            let aCodeDesc = a.CodeDesc ? a.CodeDesc.toLocaleLowerCase() : "";
                            let bCodeDesc = b.CodeDesc ? b.CodeDesc.toLocaleLowerCase() : "";

                            if (aCodeDesc < bCodeDesc) {
                                return -1;
                            }
                            if (aCodeDesc > bCodeDesc) {
                                return 1;
                            }
                            return 0;
                        });

                        for (let i = oData.length - 1; i >= 0; i--) {
                            let el = oData[i];
                            delete el.__metadata;

                            if (detailType === "technical" && el.Zcode === "FREIG") {
                                oData.splice(i, 1);
                            }
                        }

                        resolve(oData);
                    } catch (err) {
                        console.log(err);
                        sap.m.MessageBox.error(`${err.name} : ${err.message}`);
                        reject(err);
                    }
                });
            },




            _getBidTemplate1: function (oModel, detailType) {
                console.log("hello sir", this.getView().getModel("bidItemModel").getData())
                let index = "Not Found";
                return new Promise(async (resolve, reject) => {
                    try {
                        let oData = await helperFunctions.readEntity(oModel, "MasBidTemplateSet", undefined, undefined, undefined, undefined);
                        console.log("MasBidTemplate", oData);
                        oData.sort((a, b) => {
                            if (a.Datatype.toLocaleLowerCase() < b.Datatype.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.Datatype.toLocaleLowerCase() > b.Datatype.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        for (let i = oData.length - 1; i >= 0; i--) {
                            let el = oData[i];

                            delete el.__metadata;

                            if (detailType === "technical") {
                                if (el.Code === "FREIG") {
                                    oData.splice(i, 1);
                                }
                            };
                            resolve(oData);
                        }
                    } catch (err) {
                        console.log(err);
                        sap.m.MessageBox.error(`${err.name} : ${err.message}`);
                    }
                });

            },

            setBidTable: function (templateData, oTable) {
                let oView = this.getView();
                let that = this;
                oTable.removeAllItems();
                // debugger;

                templateData.forEach((el) => {
                    let oItem;
                    let oCells = [];
                    oCells.push(new sap.m.Text({
                        text: el.CodeDesc
                    }));

                    oCells.push(
                        new sap.m.Text({
                            text: el.Value
                        })
                    );

                    oCells.push(new sap.m.Button({
                        icon: "sap-icon://hint",
                        press: function (oEvent) {
                            that.handlePopoverPress(oEvent, that);
                        }
                    }));

                    oItem = new sap.m.ColumnListItem({
                        cells: oCells,
                    });
                    oTable.addItem(oItem);
                });
            },

            _setBidTemplate: function (templateData, oTable) {
                let oView = this.getView();
                let that = this;
                oTable.removeAllItems();

                // Remove duplicates based on CodeDesc property
                let uniqueData = templateData.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.CodeDesc === value.CodeDesc
                    ))
                );

                uniqueData.forEach((el) => {
                    let oItem;
                    let oCells = [];
                    oCells.push(new sap.m.Text({
                        text: el.CodeDesc
                    }));

                    if (el.Code === "COOR" || el.Zcode === "COOR") {
                        oCells.push(
                            new sap.m.Input({
                                showValueHelp: true,
                                editable: true,
                                valueHelpOnly: true,
                                valueHelpRequest: this.onCoorValueHelpRequest.bind(this)
                            })
                        );
                    } else if (el.Code === "PORT" || el.Zcode === "PORT") {
                        oCells.push(
                            new sap.m.Input({
                                showValueHelp: true,
                                editable: true,
                                valueHelpOnly: true,
                                valueHelpRequest: this.onPortValueHelpRequest.bind(this)
                            })
                        );
                    } else if (el.Code === "DAT1" || el.Zcode === "DAT1") {
                        oCells.push(
                            new sap.m.DatePicker({
                                valueFormat: "yyyy-MM-dd",
                                displayFormat: "dd/MM/yyyy",
                                editable: true,
                                maxDate: new Date()
                            })
                        );
                    } else if (el.Code === "DEMURRAGE" || el.Zcode === "DEMURRAGE") {
                        oCells.push(
                            new sap.m.Input({
                                editable: true,
                                value: "{totalCalculateModel>/demurrage}",
                                liveChange: this.onFCostChange.bind(this)
                            })
                        );
                    } else {
                        oCells.push(
                            new sap.m.Input({
                                editable: true
                            })
                        );
                    }

                    oCells.push(new sap.m.Button({
                        icon: "sap-icon://hint",
                        press: function (oEvent) {
                            that.handlePopoverPress(oEvent, that);
                        }
                    }));

                    oItem = new sap.m.ColumnListItem({
                        cells: oCells,
                    });
                    oTable.addItem(oItem);
                });
            },


            handlePopoverPress: function (oEvent, that) {
                let oButton = oEvent.getSource();
                let oView = that.oView;
                let oCodeDesc = oEvent.getSource().getParent().getCells()[0].getText();
                let filterItems = bidPayload.filter(item =>
                    item.CodeDesc === oCodeDesc
                );

                let hintModel = new sap.ui.model.json.JSONModel();
                hintModel.setData({
                    hintData: filterItems
                })
                oView.setModel(hintModel, "hintModel");

                if (!that._pPopover) {
                    that._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.ingenx.nauti.submitquotation.fragment.Hint",
                        controller: that
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);

                        return oPopover;
                    });
                }

                that._pPopover.then(function (oPopover) {
                    oPopover.setModel(hintModel, "hintModel");
                    oPopover.openBy(oButton);
                });
            },

            getBidDetailsData: async function (status) {

                if (status === "Closed") {
                    try {
                        var infoModel = this.getView().getModel("vData");
                        let voyageNo = infoModel.getProperty("/voyageNo");
                        let charterNo = infoModel.getProperty("/charteringNo");
                        let VendorNo = infoModel.getProperty("/vendorNo");
                        var oModel = this.getOwnerComponent().getModel();

                        var aFilters = [
                            new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, VendorNo),
                            new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, charterNo),
                            new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, voyageNo)
                        ];

                        let oBidListData = oModel.bindList("/xNAUTIxZSUBMITQUOUTFETCH", undefined, undefined, undefined, {
                            $filter: `Lifnr eq '${VendorNo}' and Chrnmin eq '${charterNo}' and Voyno eq '${voyageNo}'`
                        });

                        this.getBidData = [];
                        let aContexts = await oBidListData.requestContexts(0);
                        aContexts.forEach(function (oContext) {
                            this.getBidData.push(oContext.getObject());
                        }.bind(this));

                        if (this.getBidData.length > 0) {
                            this.getBidData.forEach(mainData => {
                                if (mainData.tovenditem) {
                                    mainData.filteredTovenditem = mainData.tovenditem.filter(associatedData => {
                                        return associatedData.Lifnr === VendorNo &&
                                            associatedData.Voyno === voyageNo &&
                                            associatedData.Chrnmin === charterNo;
                                    });
                                }
                            });

                            const charteringModel = new sap.ui.model.json.JSONModel();
                            charteringModel.setData(this.getBidData);
                            this.getView().setModel(charteringModel, "charteringRequestModel");
                            console.log("Request model data:", this.getView().getModel("charteringRequestModel").getData());
                        } else {
                            // sap.m.MessageToast.show("No data found for vessel details and bid details.");
                        }
                        console.log("getBidData:", this.getBidData);
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        sap.m.MessageToast.show("Error fetching Bid details.");
                    } finally {
                        if (this._oBusyDialog) {
                            this._oBusyDialog.close();
                        }
                    }
                }
            },

            tabShoworNot: function (status) {
                debugger;
            },
            onBeforeRendering: function () {
                // Modify view before rendering
                console.log("onBeforeRendering called");
            },

            onAfterRendering: function () {
                console.log("onAfterRendering called");
            },

            getHeaderDetails: async function (bidPath, startDate, startTime, endDate, endTime) {
                const dCharter = {
                    voyageType: "",
                    vesselType: "",
                    bStartDate: startDate ? ? null,
                    bStartTime: startTime ? ? null,
                    bEndDate: endDate ? ? null,
                    bEndTime: endTime ? ? null,
                    biddingType: "",
                    Currency: ""
                };
                try {
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

                        const dModel = new JSONModel();
                        dModel.setData(dCharter);
                        this.getView().setModel(dModel, "headerDetailModel");

                        console.log("Updated headerDetailModel", dModel.getData());
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching charter details.");
                }
            },

            getVoyageDetailsData: async function (voyageNo) {
                try {
                    var oModel = this.getOwnerComponent().getModel();
                    var oBidListData = oModel.bindList(`/xNAUTIxVOYAGEHEADERTOITEM('${voyageNo}')/toitem`);

                    const aContexts = await oBidListData.requestContexts(0, Infinity);
                    aContexts.forEach(function (oContext) {
                        this.charterDetails.push(oContext.getObject());
                    }.bind(this));
                    console.log("voyage data", this.charterDetails);
                    if (this.charterDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any charter details.");
                    } else {
                        this.getCharterDetailsData();
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching voyage details.");
                }
            },

            getCharterDetailsData: function () {
                const uniqueVlegnData = new Set();
                var uniqueVoyageDetails = this.charterDetails.filter(function (item) {
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
            },


            getHintDetailsData: async function (voyageNo) {
                try {
                    var oModel = this.getOwnerComponent().getModel();
                    var oBidItemListData = oModel.bindList("/xNAUTIxBIDITEM");

                    const bContexts = await oBidItemListData.requestContexts(0, Infinity);
                    this.hintDetails = bContexts.map(function (oContext) {
                        return oContext.getObject();
                    });

                    if (this.hintDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any charter details.");
                    } else {
                        let extractData = this.hintDetails.filter(function (item) {
                            return item.Voyno === voyageNo;
                        });
                        console.log("Hint data:", extractData);

                        if (extractData.length === 0) {
                            let message = `Preferred Requirements data not found for Voyage No: ${voyageNo}`
                            sap.m.MessageToast.show(message);
                        } else {
                            var dummyModel = new sap.ui.model.json.JSONModel({
                                items: extractData
                            });
                            this.getView().setModel(dummyModel, "hintDataModel");
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching hint details.");
                }
            },

            onHintPress: function (oEvent) {
                var oButton = oEvent.getSource();
                var sKey = oButton.getCustomData().find(data => data.getKey() === "key").getValue();

                var aItems = this.getView().getModel("hintDataModel").getProperty("/");

                if (Array.isArray(aItems)) {
                    var oMatchedItem = aItems.filter(function (item) {
                        return item.CodeDesc === sKey;
                    });
                    console.log("pop up data itna hi", oMatchedItem);

                    if (oMatchedItem) {
                        var oPopoverModel = new sap.ui.model.json.JSONModel(oMatchedItem);
                        this.openQuickView(oEvent, oPopoverModel);
                    } else {
                        sap.m.MessageToast.show("No matching data found.");
                    }
                } else {
                    sap.m.MessageToast.show("No data available.");
                }
            },


            penQuickView: function (oEvent, oModel) {
                // debugger;
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this._pQuickView) {
                    this._pQuickView = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "com.ingenx.nauti.submitquotation.fragment.Hint",
                        controller: this
                    }).then(function (oQuickView) {
                        oView.addDependent(oQuickView);
                        return oQuickView;
                    });
                }

                this._pQuickView.then(function (oQuickView) {
                    oQuickView.setModel(oModel, "popoverModel");
                    console.log("quickviewdata", oQuickView.getModel("popoverModel").getData());
                    oQuickView.openBy(oButton);
                })
            },

            booleanFormatter: function (value) {
                return value === "X";
            },
            formatDateTime: function (date, time) {
                if (date && time) {
                    return date + " " + time;
                }
                return "N/A"
            },

            // submit technical and commercial details data
            onSubmitBid: function () {

                // debugger;
                let bidItemModelData = this.getView().getModel("bidItemModel");
                let bidItemsData = bidItemModelData.getData();
                console.log("bidItemsData", bidItemsData);
                var oTable = this.byId("submitTechDetailTable");
                var aItems = oTable.getItems();
                var aData = [];
                aItems.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    var oData = {};
                    oData.Value = aCells[0].getText();
                    var oSecondCell = aCells[1];
                    if (oSecondCell instanceof sap.m.Input) {
                        oData.InputValue = oSecondCell.getValue();
                    } else if (oSecondCell instanceof sap.m.DatePicker) {
                        oData.DateValue = oSecondCell.getDateValue();
                    }
                    aData.push(oData);
                });
                var infoModel = this.getView().getModel("vData");
                let charterNo = infoModel.getProperty("/charteringNo")
                let vendorNo = infoModel.getProperty("/vendorNo")
                let voyageNo = infoModel.getProperty("/voyageNo")
                const oView = this.getView();
                const freightValue = oView.byId("fCost2").getValue();
                const sVNameInput = this.byId("vesselName").getValue();
                const sVIMONo = this.byId("vesselIMONo").getValue();

                function findValueByZcode(Zcode) {
                    let item = aData.find(data => data.Value === Zcode);
                    return item ? (item.InputValue || item.DateValue || "") : "";
                }

                const coorValue = findValueByZcode("COUNTRY OF ORIGIN");
                const lastCleaningDate = findValueByZcode("LAST CLEANING DATE");
                const lastPortvalue = findValueByZcode("LAST PORT OF CALL");
                const demurrageInput = findValueByZcode("DEMURRAGE");
                const classValue = findValueByZcode("CLASS OF VESSEL");
                const dateObject = new Date(lastCleaningDate);
                const formatLastCleaningDate = dateObject.toISOString().split('T')[0];
                let date = new Date();
                let currentDate = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2);

                let currentTime = ('0' + date.getHours()).slice(-2) + ':' +
                    ('0' + date.getMinutes()).slice(-2) + ':' +
                    ('0' + date.getSeconds()).slice(-2);

                if (!coorValue || !lastCleaningDate || !lastPortvalue || !demurrageInput || !sVIMONo || !sVNameInput || !freightValue) {
                    sap.m.MessageBox.error("Please enter all valid fields !!")
                    return
                }
                let quotationsitems = {
                    "Zcode": "",
                    "CodeDesc": "",
                    "Cunit": "",
                    "Cvalue": "",
                    "Value": "",
                    "Zcom": ""
                };
                let to_quote_item = [];

                for (let i = 0; i < bidItemsData.length; i++) {
                    let CodeDesc = bidItemsData[i].CodeDesc;
                    // Find the corresponding input value from aData
                    let inputValueObject = aData.find(item => item.Value === CodeDesc);
                    let inputValue = inputValueObject ? inputValueObject.InputValue : "";

                    // Construct quotationsitems object
                    let quotationsitems = {
                        "Zcode": Zcode,
                        "CodeDesc": CodeDesc,
                        "Cunit": "",
                        "Cvalue": "",
                        "Value": inputValue,
                        "Zcom": ""
                    };

                    // Push the quotationsitems object into the toQuoteItems array
                    to_quote_item.push(quotationsitems);
                }


                let payload = {
                    "Lifnr": vendorNo,
                    "Voyno": voyageNo,
                    "Chrnmin": charterNo,
                    "Vimono": sVNameInput,
                    "Vname": sVIMONo,
                    "Biddate": currentDate,
                    "Bidtime": currentTime,
                    "to_quote_item": to_quote_item
                };
                console.log("payload for submit Quoation :", payload);
                const oModel = this.getOwnerComponent().getModel("modelV2");
                let that = this
                oModel.create('/quotations', payload, {
                    success: function (oData) {
                        let result = oData;
                        console.log("results", result);
                        new sap.m.MessageBox.success("Successfully Submitted");
                        that.onClearField()
                    },
                    error: function (err) {
                        console.log("Error occured", err);
                        if (JSON.parse(err.responseText).error.message.value.includes("Entity already exists")) {
                            new sap.m.MessageBox.error(`Quotation already submitted for the chartering no.: ${charterNo}`)
                        } else {
                            new sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value)
                        }
                    }
                })
            },

            //    country of origin value help code             
            onCoorValueHelpRequest: function (oEvent) {
                var oView = this.getView();
                this._oInputField = oEvent.getSource();

                if (!this.countryOfOrigin) {
                    this.countryOfOrigin = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.submitquotation.fragment.Coor", this);
                    oView.addDependent(this.countryOfOrigin);
                }

                // Clear the model data and refresh the binding before opening the dialog
                this._clearAndRefreshDialogData().then(() => {
                    this.countryOfOrigin.open();
                });
            },

            _clearAndRefreshDialogData: function () {
                return new Promise((resolve, reject) => {
                    try {
                        var oBinding = this.countryOfOrigin.getBinding("items");

                        if (oBinding) {
                            oBinding.filter([]);
                            oBinding.refresh();

                            setTimeout(() => {
                                resolve();
                            }, 500);
                        } else {
                            reject("Binding not found");
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            },

            onValueHelpClosevoy: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var sSelectedValue = oSelectedItem.getDescription();
                    this._oInputField.setValue(sSelectedValue);
                }
                if (this.countryOfOrigin) {
                    this.countryOfOrigin.close();
                }
            },

            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var aFilters = [];
                if (sValue) {
                    aFilters.push(new Filter("land1", FilterOperator.Contains, sValue));
                    aFilters.push(new Filter("landx50", FilterOperator.Contains, sValue));
                }
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            },



            //   port value help code
            onPortValueHelpRequest: function (oEvent) {
                var oView = this.getView();
                this._portInput = oEvent.getSource();

                if (!this.portMaster) {
                    this.portMaster = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.submitquotation.fragment.Port", this);
                    oView.addDependent(this.portMaster);
                }

                // Clear the model data and refresh the binding before opening the dialog
                this._clearAndRefreshPortData().then(() => {
                    this.portMaster.open();
                }).catch((err) => {
                    console.error("Failed to refresh port data:", err);
                });
            },

            _clearAndRefreshPortData: function () {
                return new Promise((resolve, reject) => {
                    try {
                        var oBinding = this.portMaster.getBinding("items");

                        // Ensure the binding is available
                        if (oBinding) {
                            // Clear previous filters
                            oBinding.filter([]);

                            // Detach and reattach the binding to force a refresh
                            var oList = this.portMaster.getItems();
                            oList.forEach(item => oBinding.detachChange(item));
                            oBinding.attachChange(() => {
                                resolve();
                            });
                            oBinding.refresh();
                        } else {
                            reject("Binding not found");
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            },

            onValueHelpClosePort: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    let portselected = oSelectedItem.getTitle();
                    this._portInput.setValue(portselected);
                }
                if (this.portMaster) {
                    this.portMaster.close();
                }
            },

            onValueHelpSearch2: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var aFilters = [];
                if (sValue) {
                    aFilters.push(new Filter("Portc", FilterOperator.Contains, sValue));
                    aFilters.push(new Filter("Portn", FilterOperator.Contains, sValue));
                }
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            },

            resetFormFields: function () {
                // debugger;
                this.byId("vesselName").setValue("");
                this.byId("vesselIMONo").setValue("");
                this.byId("fCost2").setValue("");
                this.byId("fCost2").setValue("");
            },

            // calculate freight cost and demurrage cost code
            onFCostChange: function (oEvent) {
                // debugger;
                var oModel = this.getView().getModel("totalCalculateModel");
                var oSource = oEvent.getSource();

                var sNewValue = oEvent.getParameter("value");

                var sFieldId = oSource.getId();
                if (sFieldId.includes("fCost2")) {
                    oModel.setProperty("/fCost2", sNewValue);
                } else if (sFieldId.includes("__input2")) {
                    oModel.setProperty("/demurrage", sNewValue);
                }

                var oData = oModel.getData();
                var demurrage = parseFloat(oData.demurrage) || 0;
                var fCost2 = parseFloat(oData.fCost2) || 0;

                var totalCost = demurrage + fCost2;

                var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                    maxFractionDigits: 2,
                    minFractionDigits: 2,
                    groupingEnabled: true,
                    groupingSeparator: ",",
                    decimalSeparator: "."
                });
                var sFormattedTotalCost = oNumberFormat.format(totalCost);

                oModel.setProperty("/totalCost", sFormattedTotalCost);
            },


            onClearField: function () {
                // debugger
                var vName = this.getView().byId("vesselName")
                vName.setValue(" ")
                var vImo = this.getView().byId("vesselIMONo")
                vImo.setValue(" ")
                var fCost = this.getView().byId("fCost2")
                fCost.setValue(" ")
                var tCost = this.getView().byId("totalCost")
                tCost.setValue(" ")
                var oTable = this.byId("submitTechDetailTable");
                var aItems = oTable.getItems();
                aItems.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells.forEach(function (oCell) {
                        if (oCell instanceof sap.m.Input) {
                            oCell.setValue("");
                        } else if (oCell instanceof sap.m.DatePicker) {
                            oCell.setDateValue(null);
                        }
                    });
                });
            },


        });
    });