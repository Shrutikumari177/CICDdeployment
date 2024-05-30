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
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, BusyDialog,MessageToast,library,ValueHelpDialog,SelectDialog,StandardListItem,Filter,FilterOperator) {
        "use strict";
        return Controller.extend("com.ingenx.nauti.submitquotation.controller.Bidding", {

            onInit: function () {
                this.infoModel = new JSONModel({
                  "voyageNo":"",
                  "charteringNo":"",
                  "vendorNo":""
              })

               this.getView().setModel(this.infoModel, "vData");


               this.countryModel = new JSONModel();
               this.getView().setModel(this.countryModel, "countryDataModel");

                this.portModel = new JSONModel();
               this.getView().setModel(this.portModel, "portDataModel");

                const oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe("BiddingChannel", "BiddingDetail", this._onBiddingDetailReceived, this);
            
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteBidding").attachPatternMatched(this._onObjectMatched, this);
            
                    this._oBusyDialog = new BusyDialog({
                      text: "Loading"
                  });
            },

            _onBiddingDetailReceived: function (sChannel, sEvent, oData) {
                debugger;
                var vInfo = this.getView().getModel("vData")
                vInfo.setProperty("/voyageNo",oData.path)
                vInfo.setProperty("/charteringNo",oData.CharterReqNo)
                vInfo.setProperty("/vendorNo",oData.vendorNo)
                this.getHeaderDetails(oData.path, oData.startDate, oData.startTime, oData.endDate, oData.endTime);
            },            
            
            _onObjectMatched: function (oEvent) {
                this.charterDetails = [];
                const path = oEvent.getParameter("arguments").path; 
            
                var oModel = this.getOwnerComponent().getModel();
                var oBidListData = oModel.bindList(`/xNAUTIxRFQCHARTERING('${path}')/toassociation3`);
            
                this._oBusyDialog.open(); 

                oBidListData.requestContexts(0, Infinity).then(function (aContexts) {
                    aContexts.forEach(function (oContext) {
                        this.charterDetails.push(oContext.getObject());
                    }.bind(this)); 
            
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
                    this._oBusyDialog.close(); 
                }.bind(this));
            },   

            getHeaderDetails: function (bidPath, startDate, startTime, endDate, endTime) {
                this.headerDetails = [];
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
                var dModel = new JSONModel();
                dModel.setData(dCharter);
                this.getView().setModel(dModel, "headerDetailModel");
                console.log("date is", this.getView().getModel("headerDetailModel").getData());

                var oModel = this.getOwnerComponent().getModel();
                var oBidListData = oModel.bindList(`/xNAUTIxRFQCHARTERING('${bidPath}')/toassociation2`);
                
                this._oBusyDialog.open(); 

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
                    this._oBusyDialog.close(); 
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
            },
            onSubmitBid: function () {
                debugger;
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
                // Format the date as "yyyy-MM-dd"
                let currentDate = date.getFullYear() + '-' +
                ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                ('0' + date.getDate()).slice(-2);
                
                // Format the time in 24-hour format "HH:mm:ss"
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
                                    // Optionally handle the cancel event
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
                            // Reset filters when reopening the dialog
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
                            // Reset filters when reopening the dialog
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
            onFCostChange: function (oEvent) {
                debugger;
                // Get the value of the fCost2 input field
                var sFCost2Value = oEvent.getParameter("value");
                var fFCost2Value = parseFloat(sFCost2Value) || 0;
                // Get the value of the demurrageInput field
                var oDemurrageInput = this.byId("demurrageInput");
                var sDemurrageValue = oDemurrageInput.getValue();
                var fDemurrageValue = parseFloat(sDemurrageValue) || 0;
                // Calculate the total cost
                var fTotalCost = fFCost2Value + fDemurrageValue;
    
                // Set the total cost value in the totalCost input field
                var oTotalCostInput = this.byId("totalCost");
                oTotalCostInput.setValue(fTotalCost.toFixed(2));
            }         
        });
    });
