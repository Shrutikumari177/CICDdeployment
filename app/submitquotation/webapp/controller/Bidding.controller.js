sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog",
    "sap/m/MessageToast",
    "sap/ui/comp/library",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, BusyDialog,MessageToast,library,ValueHelpDialog,SelectDialog,StandardListItem,Filter,FilterOperator,Dialog) {
        "use strict";
        return Controller.extend("com.ingenx.nauti.submitquotation.controller.Bidding", {

            onInit: function () {
                this.byId("lastCleanDateBidInput").setMaxDate(new Date());
                this.infoModel = new JSONModel({
                    "voyageNo": "",
                    "charteringNo": "",
                    "vendorNo": "",
                    "status": ""
                });
                this.getView().setModel(this.infoModel, "vData");
                console.log("Initial vData", this.getView().getModel("vData").getData());

                var oModel = new JSONModel({
                    demurrage: " ",
                    fCost2: " ",
                    totalCost: " "
                });
                this.getView().setModel(oModel,"totalCalculateModel");
            

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
              
           
            
           
            _onObjectMatched: async function(oEvent) {
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
            
                try {
                    // debugger;
                    const biddingData = JSON.parse(sessionStorage.getItem("biddingData"));
                    var vInfo = this.getView().getModel("vData");
                    vInfo.setProperty("/voyageNo", biddingData.Voyno);
                    vInfo.setProperty("/charteringNo", biddingData.Chrnmin);
                    vInfo.setProperty("/vendorNo", biddingData.Lifnr);
                    vInfo.setProperty("/status", biddingData.Stat);
                    console.log("Updated vData", vInfo.getData());
            
                    await this.getHeaderDetails(biddingData.Voyno, biddingData.Chrqsdate, biddingData.Chrqstime, biddingData.Chrqedate, biddingData.Chrqetime);
                    headerDataLoaded = true;
            
                    await this.getVoyageDetailsData(biddingData.Voyno);
                    voyageDataLoaded = true;
                    await this.getHintDetailsData(biddingData.Voyno);
                    await this.getBidDetailsData()
            
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

            getBidDetailsData: async function() {
                try {
                    var infoModel = this.getView().getModel("vData");
                    let voyageNo = infoModel.getProperty("/voyageNo");
                    let charterNo = infoModel.getProperty("/charteringNo");
                    let VendorNo = infoModel.getProperty("/vendorNo");
                    var oModel = this.getOwnerComponent().getModel();
                    
                    // Define the filters
                    var aFilters = [
                        new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, VendorNo),
                        new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, charterNo),
                        new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, voyageNo)
                    ];
                    
                    // Fetch data with filters and expand the associated entity
                    let oBidListData = oModel.bindList("/xNAUTIxZSUBMITQUOUTFETCH", undefined, undefined, undefined, {
                        $expand: "tovenditem",
                        $filter:`Lifnr eq '${VendorNo}' and Chrnmin eq '${charterNo}' and Voyno eq '${voyageNo}'`
                    });
                    
                    this.getBidData = []; 
                    let aContexts = await oBidListData.requestContexts(0);
                    aContexts.forEach(function(oContext) {
                        this.getBidData.push(oContext.getObject());
                    }.bind(this));
                    
                    if (this.getBidData.length > 0) {
                        // Process the main data and filter the associated data
                        this.getBidData.forEach(mainData => {
                            if (mainData.tovenditem) {
                                // Create a new property `filteredTovenditem` and assign the filtered results to it
                                mainData.filteredTovenditem = mainData.tovenditem.filter(associatedData => {
                                    return associatedData.Lifnr === VendorNo && 
                                           associatedData.Voyno === voyageNo && 
                                           associatedData.Chrnmin === charterNo;
                                });
                            }
                        });
            
                        // Set the processed data to the model
                        const charteringModel = new sap.ui.model.json.JSONModel();
                        charteringModel.setData(this.getBidData);
                        this.getView().setModel(charteringModel, "charteringRequestModel");
                        console.log("Request model data:", this.getView().getModel("charteringRequestModel").getData());
                    } else {
                        sap.m.MessageToast.show("No data found for vessel details and bid details.");
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
            },  
            
            tabShoworNot:function(status){
             debugger;
            },
            
            etBidDetailsData: async function() {
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
                        $expand: "tovenditem",
                        $filter:`Lifnr eq '${VendorNo}' and Chrnmin eq '${charterNo}' and Voyno eq '${voyageNo}'`
                    });
                    this.getBidData = []; 
                    let aContexts = await oBidListData.requestContexts(0);
                    aContexts.forEach(function(oContext) {
                        this.getBidData.push(oContext.getObject());
                    }.bind(this));
            
                    if (this.getBidData.length > 0) {
                        this.charteringData = this.getBidData;
                        
                        const charteringModel = new sap.ui.model.json.JSONModel();
                        charteringModel.setData(this.charteringData);
                        this.getView().setModel(charteringModel, "charteringRequestModel");
                        console.log("Request model data:", this.getView().getModel("charteringRequestModel").getData());
                    } else {
                        sap.m.MessageToast.show("No data found for the provided filter criteria.");
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
            },

            getHeaderDetails: async function (bidPath, startDate, startTime, endDate, endTime) {
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
                    var oModel = this.getOwnerComponent().getModel();
                    var oBidListData = oModel.bindList(`/xNAUTIxRFQCHARTERING('${bidPath}')/toassociation2`);
            
                    const aContexts = await oBidListData.requestContexts(0, Infinity);
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
            
            getVoyageDetailsData: async function(voyageNo) {
                try {
                    var oModel = this.getOwnerComponent().getModel();
                    var oBidListData = oModel.bindList(`/xNAUTIxRFQCHARTERING('${voyageNo}')/toassociation3`);
            
                    const aContexts = await oBidListData.requestContexts(0, Infinity);
                    aContexts.forEach(function (oContext) {
                        this.charterDetails.push(oContext.getObject());
                    }.bind(this));
            
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
            },
            
           
            getHintDetailsData: async function(voyageNo) {
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
                        console.log("Hint data Details", this.hintDetails);
            
                        let extractData = this.hintDetails.filter(function (item) {
                            return item.Voyno === voyageNo;
                        });
                        console.log("Extracted Data", extractData);
            
                        if (extractData.length === 0) {
                            sap.m.MessageToast.show("No matching data found.");
                        } else {
                            var dummyModel = new sap.ui.model.json.JSONModel(extractData);
                            this.getView().setModel(dummyModel, "hintDataModel");
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data", error);
                    sap.m.MessageToast.show("Error fetching hint details.");
                }
            },

    // display hint table popover code
    _onHintPress: function (oEvent) {
        var oButton = oEvent.getSource();
        var sKey = oButton.getCustomData().find(data => data.getKey() === "key").getValue();
    
        var aItems = this.getView().getModel("hintDataModel").getProperty("/");
    
        if (Array.isArray(aItems)) {
            var oMatchedItem = aItems.find(function (item) {
                return item.CodeDesc === sKey;
            });
    
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
    
            
            openQuickView: function (oEvent, oModel) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
            
                if (!this._pQuickView) {
                    this._pQuickView = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "com.ingenx.nauti.submitquotation.view.Hint", 
                        controller: this
                    }).then(function (oQuickView) {
                        oView.addDependent(oQuickView);
                        return oQuickView;
                    });
                }
            
                this._pQuickView.then(function (oQuickView) {
                    oQuickView.setModel(oModel, "popoverModel");
                    console.log("quickviewdata",oQuickView.getModel("popoverModel").getData());
                    oQuickView.openBy(oButton);
                })
            },   
            
            booleanFormatter: function (value) {
                return value === "X";
            },
            formatDateTime: function(date, time) {
                if (date && time) {
                    return date + " " + time;
                }
                return "N/A"
            },
            
                     

      
// submit technical and commercial details data
onSubmitBid: function () {
    // debugger;
    var infoModel = this.getView().getModel("vData");
    let charterNo = infoModel.getProperty("/charteringNo")
    let vendorNo = infoModel.getProperty("/vendorNo")
    let voyageNo = infoModel.getProperty("/voyageNo")
    const oView = this.getView();
    const coorValue = oView.byId("coorBidInput").getValue();
    const lastCleaningDate = oView.byId("lastCleanDateBidInput").getValue();
    const lastPortvalue = oView.byId("lastPortBidInput").getValue()
    const demurrageInput = oView.byId('demurrageInput').getValue();
    const freightValue = oView.byId("fCost2").getValue();
    const classValue = oView.byId('classOfVesselInput').getValue();
    const sVNameInput = this.byId("vesselName").getValue();
    const sVIMONo = this.byId("vesselIMONo").getValue();
    console.log(sVNameInput, sVIMONo);
    let date = new Date();
    let currentDate = date.getFullYear() + '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
    ('0' + date.getDate()).slice(-2);
    
    let currentTime = ('0' + date.getHours()).slice(-2) + ':' +
    ('0' + date.getMinutes()).slice(-2) + ':' +
    ('0' + date.getSeconds()).slice(-2);
    
    let payload = {
        "Lifnr": '2100000002',
        "Voyno": "1000000152",
        "Chrnmin": '4000000020',
        "Vimono": sVNameInput,
        "Vname": sVIMONo,
        "Biddate": currentDate,
        "Bidtime": currentTime,
        "tovenditem": [
            {
                "Voyno": "1000000152",
                "Lifnr": '2100000002',
                "Zcode": "COOR",
                "Value": coorValue,
                "Cvalue": "0.000",
                "Cunit": "",
                "Chrnmin": '4000000020',
                "CodeDesc": "COUNTRY OF ORIGIN",
                "Biddate": currentDate,
                "Bidtime": currentTime,
                "Zcom": ""
            },
            {
                "Voyno": "1000000152",
                "Lifnr": '2100000002',
                "Zcode": "DAT1",
                "Value": lastCleaningDate,
                "Cvalue": "0.000",
                "Cunit": "",
                "Chrnmin": '4000000020',
                "CodeDesc": "LAST CLEANING DATE",
                "Biddate": currentDate,
                "Bidtime": currentTime,
                "Zcom": ""
            },
            {
                "Voyno": "1000000152",
                "Lifnr": '2100000002',
                "Zcode": "PORT",
                "Value": lastPortvalue,
                "Cvalue": "0.000",
                "Cunit": "",
                "Chrnmin": '4000000020',
                "CodeDesc": "LAST PORT OF CALL",
                "Biddate": currentDate,
                "Bidtime": currentTime,
                "Zcom": ""
            },
            {
                "Voyno": "1000000152",
                "Lifnr": '2100000002',
                "Zcode": "CLASS",
                "Value": classValue,
                "Cvalue": "0.000",
                "Cunit": "",
                "Chrnmin": '4000000020',
                "CodeDesc": "CLASS OF VESSEL",
                "Biddate": currentDate,
                "Bidtime": currentTime,
                "Zcom": ""
            },
            {
                "Voyno": "1000000152",
                "Lifnr": '2100000002',
                "Zcode": "DEMURRAGE",
                "Value": "",
                "Cvalue": demurrageInput,
                "Cunit": "INR",
                "Chrnmin": '4000000020',
                "CodeDesc": "DEMURRAGE",
                "Biddate": currentDate,
                "Bidtime": currentTime,
                "Zcom": ""
            },
            {
                "Voyno": "1000000152",
                "Lifnr": '2100000002',
                "Zcode": "FREIG",
                "Value": "",
                "Cvalue": freightValue,
                "Cunit": "INR",
                "Chrnmin": '4000000020',
                "CodeDesc": "FREIGHT",
                "Biddate": currentDate,
                "Bidtime": currentTime,
                "Zcom": ""
            },
            
            
        ]
    }
    console.log("payload for submit Quoation :", payload);
    // return;
    
    const oModel = this.getOwnerComponent().getModel("modelV2");
    oModel.create('/xNAUTIxSUBMITQUATATIONPOST', payload, {
        success : function(oData){
            let result = oData;
            console.log("results",result);
            // console.log("response",oData);
            new sap.m.MessageBox.success("Successfully Submitted")
            
        },
        error: function ( err) {
            console.log("Error occured", err);
            new sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value)
            
        }
    })
},
          
        //    country of origin value help code
            onCoorValueHelpRequest: function (oEvent) {
                var oInput = oEvent.getSource();
            
                var oModel = this.getOwnerComponent().getModel();
                var sPath = "CountrySet";
                var oBidListData = oModel.bindList(`/${sPath}`);
            
                if (!this._oBusyDialog) {
                    this._oBusyDialog = new sap.m.BusyDialog();
                }
                this._oBusyDialog.open();
            
                oBidListData.requestContexts(0, Infinity).then(function (aContexts) {
                    var aCountryDetails = aContexts.map(function (oContext) {
                        return oContext.getObject();
                    });
            
                    this.countryModel.setData({ items: aCountryDetails });
            
                    this._oBusyDialog.close();
            
                    if (aCountryDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any Country details.");
                    } else {
                        if (!this._oCountryValueHelpDialog) {
                            this._oCountryValueHelpDialog = new SelectDialog({
                                title: "Select Country",
                                items: {
                                    path: "countryDataModel>/items",
                                    template: new StandardListItem({
                                        title: "{countryDataModel>Landx50}", 
                                        description: "{countryDataModel>Land1}" 
                                    })
                                },
                                confirm: function (oEvent) {
                                    var oSelectedItem = oEvent.getParameter("selectedItem");
                                    if (oSelectedItem) {
                                        oInput.setValue(oSelectedItem.getTitle());
                                    }
                                },
                                cancel: function () {
                                },
                                search: function (oEvent) {
                                    var sValue = oEvent.getParameter("value");
                                    var oFilter = new Filter([
                                        new Filter("Land1", FilterOperator.Contains, sValue), 
                                        new Filter("Landx50", FilterOperator.Contains, sValue) 
                                    ], false);
                                    var oBinding = oEvent.getSource().getBinding("items");
                                    oBinding.filter([oFilter]);
                                }
                            });
                            this.getView().addDependent(this._oCountryValueHelpDialog);
                        } else {
                            var oBinding = this._oCountryValueHelpDialog.getBinding("items");
                            oBinding.filter([]);
                        }
                        this._oCountryValueHelpDialog.open();
                    }
                }.bind(this)).catch(function (oError) {
                    this._oBusyDialog.close();
                    sap.m.MessageToast.show("Failed to load country details.");
                }.bind(this));
            },            

            // port value help code
            onPortValueHelpRequest: function (oEvent) {
                var oInput = oEvent.getSource();
            
                var oModel = this.getOwnerComponent().getModel();
                var sPath = "PortmasterSet";
                var oBidListData = oModel.bindList(`/${sPath}`);
            
                if (!this._oBusyDialog) {
                    this._oBusyDialog = new sap.m.BusyDialog();
                }
                this._oBusyDialog.open();
            
                oBidListData.requestContexts(0, Infinity).then(function (aContexts) {
                    var aPortDetails = aContexts.map(function (oContext) {
                        return oContext.getObject();
                    });
            
                    this.portModel.setData({ items: aPortDetails });
            
                    this._oBusyDialog.close();
            
                    if (aPortDetails.length === 0) {
                        sap.m.MessageToast.show("The data doesn't contain any Port details.");
                    } else {
                        if (!this._oPortValueHelpDialog) {
                            this._oPortValueHelpDialog = new SelectDialog({
                                title: "Select Port",
                                items: {
                                    path: "portDataModel>/items",
                                    template: new StandardListItem({
                                        title: "{portDataModel>Portn}", 
                                        description: "{portDataModel>Country}" 
                                    })
                                },
                                confirm: function (oEvent) {
                                    var oSelectedItem = oEvent.getParameter("selectedItem");
                                    if (oSelectedItem) {
                                        oInput.setValue(oSelectedItem.getTitle());
                                    }
                                },
                                cancel: function () {},
                                search: function (oEvent) {
                                    var sValue = oEvent.getParameter("value");
                                    var oFilter = new Filter([
                                        new Filter("Portn", FilterOperator.Contains, sValue), 
                                        new Filter("Country", FilterOperator.Contains, sValue) 
                                    ], false);
                                    var oBinding = oEvent.getSource().getBinding("items");
                                    oBinding.filter([oFilter]);
                                }
                            });
                            this.getView().addDependent(this._oPortValueHelpDialog);
                        } else {
                            var oBinding = this._oPortValueHelpDialog.getBinding("items");
                            oBinding.filter([]);
                        }
                        this._oPortValueHelpDialog.open();
                    }
                }.bind(this)).catch(function (oError) {
                    this._oBusyDialog.close();
                    sap.m.MessageToast.show("Failed to load port details.");
                }.bind(this));
            },
    

            resetFormFields: function () {
                // debugger;
                this.byId("vesselName").setValue("");
                this.byId("vesselIMONo").setValue("");
                this.byId("coorBidInput").setValue("");
                this.byId("lastCleanDateBidInput").setValue("");
                this.byId("lastPortBidInput").setValue("");
                this.byId("demurrageInput").setValue("");
                this.byId("classOfVesselInput").setValue("");
                this.byId("fCost2").setValue("");
            },

            // calculate freight cost and demurrage cost code

            onFCostChange: function () {
                var oModel = this.getView().getModel("totalCalculateModel");
                var oData = oModel.getData();
            
                var oDemurrageInput = this.getView().byId("demurrageInput").getValue();
                var oFCost2Input = this.getView().byId("fCost2").getValue();
            
                var demurrage = parseFloat(oDemurrageInput) || 0;
                var fCost2 = parseFloat(oFCost2Input) || 0;
            
                var totalCost = demurrage + fCost2;
            
                // Format the total cost value
                var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                    maxFractionDigits: 2,
                    minFractionDigits: 2,
                    groupingEnabled: true,
                    groupingSeparator: ",",
                    decimalSeparator: "."
                });
            
                var sFormattedTotalCost = oNumberFormat.format(totalCost);
            
                // Update the model with the formatted value
                oData.totalCost = sFormattedTotalCost;
                oModel.setData(oData);
            }
            
            
            // onFCostChange: function () {
            //     var oModel = this.getView().getModel("totalCalculateModel");
            //     var oData = oModel.getData();
    
            //     var oDemurrageInput = this.getView().byId("demurrageInput").getValue();
            //     var oFCost2Input = this.getView().byId("fCost2").getValue();
    
            //     var demurrage = parseFloat(oDemurrageInput) || 0;
            //     var fCost2 = parseFloat(oFCost2Input) || 0;
    
            //     oData.totalCost = demurrage + fCost2;
    
            //     oModel.setData(oData);
            // }
        });
    });


