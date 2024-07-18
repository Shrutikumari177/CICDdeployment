sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function (Controller, JSONModel, ODataModel, MessageBox, Filter, FilterOperator) {
    "use strict";

    let oModel;
    let aData;
    let oView;
    let bedDetailsModel;
    let sVendors;
    let getVendorModelData = [];
    let Zfrieghcode ;
    let Zfrieghdesc;
    let vendorArray = [];
   
    let getModelData = [];
    let ocharteringNo;
    var isBidStartDateSelected = false;
var isBidStartTimeSelected = false;
var isBidEndDateSelected = false;
var isBidEndTimeSelected = false;


    return Controller.extend("com.ingenx.nauti.quotation.controller.CompareRequestForQuotation", {
        onInit: function () {
            getModelData = [];
            let oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, "dataModel");
            var oModel3 = this.getOwnerComponent().getModel();

            var oBindList3 = oModel3.bindList("/xNAUTIxCharteringHeaderItem?$expand=tovendor");
            oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                    getModelData.push(oContext.getObject());
                });
                oModel.setData(getModelData);

            }.bind(this));
            console.log("mydata", getModelData);


            let oVenModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oVenModel, "vendorModel");
            var oVenModel2 = this.getOwnerComponent().getModel();
            var oVenBindList = oVenModel2.bindList("/xNAUTIxBusinessPartner1");
            oVenBindList.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                    getVendorModelData.push(oContext.getObject());
                });
                oModel.setData(getVendorModelData);

            }.bind(this));
            console.log("myVendata", getVendorModelData);
            
            // this.attachEventOnce("afterRendering", this._attachInputValidation.bind(this));
        },


        calculateAndBindRankings: function (Chrnmin) {
            // debugger;

            var oTable = this.byId("table");
            oTable.setNoData("Loading...");

            oModel = this.getOwnerComponent().getModel();
            const sEntitySet = "/calculateRankings";
            const aFilters = [
                new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, Chrnmin)
            ];
            console.log("Chrnmin", Chrnmin);
            const oListBinding = oModel.bindList(sEntitySet, undefined, undefined, aFilters);


            oListBinding.requestContexts().then(function (aContexts) {
                aData = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                console.log("Fetched Data:", aData);
                if (aData && aData.length > 0) {
                    const vendorsData = aData[0].Vendors.map(vendor => ({
                        Chrnmin: aData[0].Chrnmin,
                        Voyno: aData[0].Voyno,
                        vendorId: vendor.vendorId,
                        Crank: vendor.Crank,
                        Trank: vendor.Trank,
                        score: vendor.score,
                        eligible: vendor.eligible,
                        bidDetails: vendor.bidDetails
                    }));


                    console.log("Zocedwefsdghfhfd", vendorsData);
                    vendorsData.forEach(function(vendor) {
                        var freigDetail = vendor.bidDetails.find(function(detail) {
                            return detail.Zcode === "FREIG";
                        });
                    
                        if (freigDetail && Zfrieghcode === undefined && Zfrieghdesc === undefined) {
                            Zfrieghcode = freigDetail.Zcode;
                            Zfrieghdesc = freigDetail.CodeDesc;
                            console.log("Zcode:", Zfrieghcode);
                            console.log("CodeDesc:", Zfrieghdesc);
                        }
                    });
                    
                    // Example of using the stored values later
                    console.log(`Stored Zcode: ${Zfrieghcode}, CodeDesc: ${Zfrieghdesc}`);

                    const oModel = new JSONModel({
                        Vendors: vendorsData,
                        Voyno: aData[0].Voyno // Adding Voyno separately for easier binding
                    });
                    this.getView().setModel(oModel, "rankings");

                    // Get reference to the table and bind it to the model
                    const oTable = this.getView().byId("table");
                    oTable.bindItems({
                        path: "rankings>/Vendors",
                        template: new sap.m.ColumnListItem({
                            type: "Navigation",

                            press: this.onNavigateDetails.bind(this),
                            cells: [
                                new sap.m.Text({
                                    text: "{rankings>vendorId}",
                                    textAlign: sap.ui.core.TextAlign.Center
                                }),

                                new sap.m.Text({
                                    text: "{rankings>Crank}"
                                }).addStyleClass("rank"),
                                new sap.m.Text({
                                    text: "{rankings>Trank}"
                                }).addStyleClass("rank"),
                                new sap.m.Text({
                                    text: "{rankings>score}"
                                }).addStyleClass("score"),
                                new sap.m.Text({
                                    text: {
                                        path: 'rankings>eligible'
                                    }
                                }).addStyleClass("eligibility"),
                            ]
                        })
                    });


                } else {
                    this.byId("charteringNo").setValue("");

                    var idVoyge = this.byId("idVoyge");
                    idVoyge.setVisible(false);
                    var oTable = this.byId("table");
                    var oModel = this.getView().getModel("rankings");
                    if (oModel) {
                        oModel.setData({
                            Vendors: []
                        });
                    }
                    oTable.setNoData("No data available");


                    var oVBox = this.byId("idVbox");
                    if (oVBox) {
                        oVBox.setVisible(false);
                    }
                    console.error("No data fetched");


                    MessageBox.information(`No vendor data found for chartering no. : ${Chrnmin}`);

                }
            }.bind(this)).catch(function (oError) {

                console.error("Error fetching data:", oError);
            });
        },
        checkBoxEnabled: function (sEligibility) {
            return sEligibility === "Yes";
        },

        formatBooleanToText: function (status) {
            console.log("formatBooleanToText called with status:", status);
            if (status === true) {
                return "Yes"
            } else {
                return "No"
            }
        },

        charteringValueHelp: function (oEvent) {
            var oView = this.getView();

            if (!this._oDialog2) {
                this._oDialog2 = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.CharteringNo", this);
                oView.addDependent(this._oDialog2);
            }


            this._oDialog2.clearSelection();


            var oBinding = this._oDialog2.getBinding("items");
            if (oBinding) {
                oBinding.filter([]); // Clear any existing filters
                oBinding.refresh(); // Refresh the binding to reload the data
            } else {

                this._oDialog2.bindAggregation("items", {
                    path: '/CharteringSet',
                    sorter: {
                        path: 'Chrnmin',
                        descending: true
                    },
                    template: new sap.m.StandardListItem({
                        title: "{Chrnmin}"
                    })
                });
            }

            this._oDialog2.open();
        },

        onValueHelpClose1: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);

            if (!oSelectedItem) {
                return;
            }

            var Chrnmin = oSelectedItem.getTitle();
            this.byId("charteringNo").setValue(Chrnmin);
            console.log("Chrnminnn", Chrnmin);

            this.calculateAndBindRankings(Chrnmin);

            var btn = this.byId("ButtonInvite");
            btn.setVisible(true);
            var refresh = this.byId("ButtonRefresh");
            refresh.setVisible(true);
            var idVoyge = this.byId("idVoyge");
            idVoyge.setVisible(true);
            var compare = this.byId("_IdCompare");
            compare.setVisible(false);
            var invite = this.byId("_IdInvite");
            invite.setVisible(true);
            var oTable = this.byId("table")
            oTable.setVisible(true);

            if (Chrnmin) {
                var oVBox = this.byId("idVbox");
                if (oVBox) {
                    oVBox.setVisible(true);
                }
            }
        },
        onChartLiveChange1: function (oEvent) {

            var sValue = oEvent.getParameter("value");

            var oFilter = new Filter("Chrnmin", FilterOperator.Contains, sValue);

            oEvent.getSource().getBinding("items").filter([oFilter]);
        },



        onSubmitInvite: function () {

            let oVoyageno = this.byId("Voyageno").getValue();
            var aData = [];
            var extractUnitData;
            var oTableModel = this.getView().getModel(); // Assuming the table model is the main view model
            var oListBinding = oTableModel.bindList("/xNAUTIxVOYAGEHEADERTOITEM");

            oListBinding.requestContexts().then(function (aContexts) {
                aData = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });
                var extractData = aData.filter(item => {
                    return item.Voyno === oVoyageno;
                }).map(function (item) {
                    return item.Frtu;
                });
                extractUnitData = extractData[0];
                var a = sap.ui.getCore().byId("unit");
                a.setValue(extractUnitData);
            }.bind(this)).catch(function (oError) {
                console.error("Error fetching data:", oError);
            });

            var oTable = this.byId("table");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageBox.error("Please select at least one row.");
                return;
            }

            // var vendorArray = [];
            var aIneligibleVendors = aSelectedItems.reduce(function (aAccumulator, oItem) {
                var oContext = oItem.getBindingContext("rankings");
                if (oContext.getProperty("eligible") === "No") {
                    aAccumulator.push(oContext.getProperty("vendorId"));
                } else {
                    vendorArray.push(oContext.getProperty("vendorId")); // Collect eligible vendorIds
                }
                return aAccumulator;
            }, []);

            if (aIneligibleVendors.length > 0) {
                sVendors = aIneligibleVendors.join(", ");
                MessageBox.error(`You have selected ineligible vendor(s): ${sVendors}.`);
            } else {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.SubmitInvite", this);
                    this.getView().addDependent(this._oDialog);

                    var oModel = new sap.ui.model.json.JSONModel({
                        BiddingStartDate: null,
                        BiddingEndDate: null,
                        BiddingStartTime: null,
                        BiddingEndTime: null,
                        ControllerQuotedValue: "",
                        codedesc: "",
                        Unit: extractUnitData,
                        Mode: "Mode1",
                    });
                    this._oDialog.setModel(oModel, "addBiddingModel");
                }
                console.log("Vendor Array: ", vendorArray);
                this._oDialog.open();
            }
        },

        onSave: function () {
            var oView = this.getView();
            var oDialog = this._oDialog; // Assuming _oDialog is your SubmitInvite fragment instance

            if (!oDialog) {
                console.error("Dialog instance not found.");
                return;
            }

            // Retrieve values from the fragment's model
            var oModel = oDialog.getModel("addBiddingModel");
            var sBiddingStartDate = oModel.getProperty("/BiddingStartDate");
            var sBiddingEndDate = oModel.getProperty("/BiddingEndDate");
            var sControllerQuotedValue = oModel.getProperty("/ControllerQuotedValue");
            var sMode = oModel.getProperty("/Mode");
            var sBiddingStartTime = oModel.getProperty("/BiddingStartTime");
            var sBiddingEndTime = oModel.getProperty("/BiddingEndTime");
            var sUnit = oModel.getProperty("/Unit");

            // Log values for verification
            console.log("Bidding Start Date:", sBiddingStartDate);
            console.log("Bidding End Date:", sBiddingEndDate);
            console.log("Controller Quoted Value:", sControllerQuotedValue);
            console.log("Mode:", sMode);
            console.log("Bidding Start Time:", sBiddingStartTime);
            console.log("Bidding End Time:", sBiddingEndTime);
            console.log("Unit:", sUnit);

            // Further processing, e.g., sending data to backend or performing validation
            // ...

            // Close the dialog
            oDialog.close();
        },

        onCancel: function () {
            // Close the dialog
            var oDialog = this._oDialog;
            if (oDialog) {
                oDialog.close();
            }
        },

        onSaveEmail: function () {
            var convertTimeFormat = function (timeStr) {
                if (!timeStr) {
                    return null;
                }
        
                var timeParts = timeStr.match(/(\d+):(\d+):(\d+)\s*(\w+)/);
                if (timeParts) {
                    var hours = parseInt(timeParts[1], 10);
                    var minutes = parseInt(timeParts[2], 10);
                    var seconds = parseInt(timeParts[3], 10);
                    var period = timeParts[4].toUpperCase();
        
                    if (period === 'PM' && hours < 12) {
                        hours += 12;
                    } else if (period === 'AM' && hours === 12) {
                        hours = 0;
                    }
        
                    hours = hours < 10 ? '0' + hours : hours;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    seconds = seconds < 10 ? '0' + seconds : seconds;
        
                    return hours + ':' + minutes + ':' + seconds;
                } else {
                    return null;
                }
            };
        
            let that = this;
            var oDialog = this._oDialog; // Assuming _oDialog is your SubmitInvite fragment instance
        
            if (!oDialog) {
                console.error("Dialog instance not found.");
                return;
            }
        
            // Retrieve values from the fragment's model
            var oModel = oDialog.getModel("addBiddingModel");
            var sBiddingStartDate = oModel.getProperty("/BiddingStartDate");
            var sBiddingEndDate = oModel.getProperty("/BiddingEndDate");
            var sControllerQuotedValue = oModel.getProperty("/ControllerQuotedValue");
            var sMode = oModel.getProperty("/Mode");
            var sBiddingStartTime = oModel.getProperty("/BiddingStartTime");
            var sBiddingEndTime = oModel.getProperty("/BiddingEndTime");
            var sUnit = oModel.getProperty("/Unit");
            let omodeSelect = sap.ui.getCore().byId("modeSelect");
            let modeSelectKey = omodeSelect.getSelectedKey();
        
            // Get the selected item's text
            let modeSelectText = "";
            let items = omodeSelect.getItems();
            for (let i = 0; i < items.length; i++) {
                if (items[i].getKey() === modeSelectKey) {
                    modeSelectText = items[i].getText();
                    break;
                }
            }
        
            let oVoyageno = this.byId("Voyageno").getValue();
            let ocharteringNo = this.byId("charteringNo").getValue();
            let oControllerQValue = sap.ui.getCore().byId("ControllerQValue");
            var oController = oControllerQValue.getValue();
        
            var exchangedatevalidto = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd'T'HH:mm:ss'Z'"
            });
        
            var finalBidStartDate = exchangedatevalidto.format(new Date(sBiddingStartDate));
            var finalBidEndDate = exchangedatevalidto.format(new Date(sBiddingEndDate));
        
            var formattedStartTime = convertTimeFormat(sBiddingStartTime);
            var formattedEndTime = convertTimeFormat(sBiddingEndTime);
        
            // Validation
            if (!sBiddingStartDate) {
                sap.m.MessageToast.show("Please enter a Bid Start Date");
                return;
            }
            if (!sBiddingEndDate) {
                sap.m.MessageToast.show("Please enter a Bid End Date");
                return;
            }
            if (!sBiddingStartTime) {
                sap.m.MessageToast.show("Please enter a Bid Start Time");
                return;
            }
            if (!sBiddingEndTime) {
                sap.m.MessageToast.show("Please enter a Bid End Time");
                return;
            }
            if (!oController) {
                sap.m.MessageToast.show("Please enter Controller Quoted value");
                return;
            }
            if (!(/^\d+(\.\d+)?$/.test(oController))) {
                sap.m.MessageToast.show("Please enter only numeric or decimal values in the controller quoted value");
                return;
            }
            let oPayload = {
                "Chrnmin": ocharteringNo,
                "HEADERTOITEM": []
            };
        
            for (let i = 0; i < vendorArray.length; i++) {
                let vendorEntry = {
                    "Voyno": oVoyageno,
                    "Lifnr": vendorArray[i],
                    "Zcode": Zfrieghcode,
                    "Chrnmin": ocharteringNo,
                    "CodeDesc": Zfrieghdesc,
                    "Cvalue": sControllerQuotedValue,
                    "Chrqsdate": finalBidStartDate,
                    "Chrqstime": formattedStartTime,
                    "Chrqedate": finalBidEndDate,
                    "Chrqetime": formattedEndTime,
                    "Zmode": modeSelectText
                };
                oPayload.HEADERTOITEM.push(vendorEntry);
            }
        
            let oModel2 = this.getView().getModel();
            let oBindListSP = oModel2.bindList("/headerinvSet");
        
            oBindListSP.attachEventOnce("createCompleted", function (oEvent) {
                if (oEvent.getParameter("success")) {
                    sap.m.MessageToast.show("Data saved successfully");
        
                    this.mailData(finalBidStartDate, formattedStartTime, finalBidEndDate, formattedEndTime)
                        .then(() => {
                            oDialog.close();
                            sap.m.MessageToast.show("Mail sent successfully");
        
                            // Refresh addBiddingModel after successful mail sending
                            oModel.refresh();
                        })
                        .catch((error) => {
                            console.error("Error sending mail:", error);
                        });
                } else {
                    var errorResponse = oEvent.getParameter("response");
                    console.error("Error creating entity:", errorResponse);
                    if (errorResponse) {
                        try {
                            var errorJson = JSON.parse(errorResponse.responseText);
                            sap.m.MessageBox.error(errorJson.error.message.value);
                        } catch (e) {
                            sap.m.MessageBox.error("An unknown error occurred while creating the entity.");
                        }
                    } else {
                        sap.m.MessageBox.error("An unknown error occurred while creating the entity.");
                    }
                }
            }, this);
        
            oBindListSP.create(oPayload, true);
        },
        
        mailData: function (finalBidStartDate, formattedStartTime, finalBidEndDate, formattedEndTime) {
            return new Promise((resolve, reject) => {
                try {
                    debugger;
                    console.log("bid start date", finalBidStartDate);
                    console.log("bid start time", formattedStartTime);
                    console.log("bid end date", finalBidEndDate);
                    console.log("bid end time", formattedEndTime);
                    console.log("chartering no ", ocharteringNo);
                    console.log("vendor no ", vendorArray);
                    console.log("vendors ", vendorArray);
        
                    var mailData = [];
                    for (let i = 0; i < vendorArray.length; i++) {
                        let vendorEmail = getVendorModelData.filter(item => {
                            return item.Lifnr === vendorArray[i];
                        }).map(item => {
                            return item.SmtpAddr;
                        });
                        mailData.push(...vendorEmail);
                    }
                    console.log("mail address", mailData);
        
                    var nameData = [];
                    for (let i = 0; i < vendorArray.length; i++) {
                        let vendorNames = getVendorModelData.filter(item => {
                            return item.Lifnr === vendorArray[i];
                        }).map(item => {
                            return item.Name1;
                        });
                        nameData.push(...vendorNames);
                    }
        
                    console.log("vendors name", nameData)
        
                    let bidStartdateObj = new Date(finalBidStartDate);
                    let bidEndtdateObj = new Date(finalBidEndDate);
        
                    let formattedBidStartdate = bidStartdateObj.toISOString().split('T')[0];
                    let formattedBidEndtdate = bidEndtdateObj.toISOString().split('T')[0];
        
                    let oData = {
                        message: "Invitation for Live Quotation",
                        receiversEmails: mailData,
                        vendorsName: nameData,
                        routes: [],
                        bidStart: formattedBidStartdate,
                        bidEnd: formattedBidEndtdate,
                        cargoSize: 0.000,
                        status: 1,
                        bidstartTime: formattedStartTime,
                        bidEndTime: formattedEndTime,
                    };
        
                    let oModel = this.getView().getModel();
                    let oListBinding = oModel.bindList("/sendEmail");
        
                    // Attach the createCompleted event to the handler function
                    oListBinding.attachEvent("createCompleted", this.onCreateCompleted, this);
        
                    let oContext = oListBinding.create(oData, false, false, false);
                    console.log("oContext ", oContext);
                    resolve();
                } catch (error) {
                    console.error("Error in mailData function:", error);
                    reject("Failed to send mail data");
                }
            });
        },
        onCreateCompleted: function(oEvent) {
            let oParameters = oEvent.getParameters();
            let oContext = oParameters.context;
            let bSuccess = oParameters.success;
        
            if (bSuccess) {
                console.log("oParameters", oParameters);
                console.log("oContext", oContext.sPath);
                console.log("bSuccess", bSuccess);
        
                // Get the vendor names from the context
                let oData = oContext.getObject();
                let vendorsNames = oData.vendorsName.map(vendor => `- ${vendor}`).join("\n"); // Modify this line
        
                sap.m.MessageBox.success(`Emails sent successfully to these companies:\n${vendorsNames}`, {
                    onClose: () => {
                        if (this._oDialog1) {
                            this._oDialog1.close();
                        }
                        this.onRefresh(); 
                        // Call the onRefresh function to refresh the fragment or view
                    }
                });
        
                this.getView().byId("sumbit").setEnabled(false);
                this.getView().byId("Button1").setEnabled(false);
        
            } else {
                var errorResponse = oEvent.getParameter("response");
                console.error("Error creating entity:", errorResponse);
                if (errorResponse) {
                    try {
                        var errorJson = JSON.parse(errorResponse.responseText);
                        sap.m.MessageBox.error(errorJson.error.message.value);
                    } catch (e) {
                        sap.m.MessageBox.error("An unknown error occurred while creating the entity.");
                    }
                } else {
                    sap.m.MessageBox.error("An unknown error occurred while creating the entity.");
                }
            }
        },
        
        // onCreateCompleted: function (oEvent) {
        //     let oParameters = oEvent.getParameters();
        //     let oContext = oParameters.context;
        //     let bSuccess = oParameters.success;
        
        //     if (bSuccess) {
        //         console.log("oParameters", oParameters);
        //         console.log("oContext", oContext.sPath);
        //         console.log("bSuccess", bSuccess);
        
        //         // Get the vendor names from the context
        //         let oData = oContext.getObject();
        //         let vendorsNames = oData.vendorsName.join(", ");
        
        //         sap.m.MessageBox.success(`Emails sent successfully to these companies: ${vendorsNames}`, {
        //             onClose: () => {
        //                 if (this._oDialog1) {
        //                     this._oDialog1.close();
        //                 }
        //                 this.onRefresh(); 
        //                 // Call the onRefresh function to refresh the fragment or view
        //             }
        //         });
        
        //         this.getView().byId("sumbit").setEnabled(false);
        //         this.getView().byId("Button1").setEnabled(false);
        
        //     } else {
        //         var errorResponse = oEvent.getParameter("response");
        //         console.error("Error creating entity:", errorResponse);
        //         if (errorResponse) {
        //             try {
        //                 var errorJson = JSON.parse(errorResponse.responseText);
        //                 sap.m.MessageBox.error(errorJson.error.message.value);
        //             } catch (e) {
        //                 sap.m.MessageBox.error("An unknown error occurred while creating the entity.");
        //             }
        //         } else {
        //             sap.m.MessageBox.error("An unknown error occurred while creating the entity.");
        //         }
        //     }
        // },
        
        




        onCancel: function () {
            var oModel = this._oDialog.getModel("addBiddingModel");
            var oData = oModel.getData();
            var that = this;
            var hasChanges = oData.BiddingStartDate || oData.BiddingEndDate || oData.BiddingStartTime || oData.BiddingEndTime || oData.ControllerQuotedValue;

            if (hasChanges) {

                MessageBox.confirm("You have unsaved changes. Do you want to discard them?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {

                            oModel.setData({
                                BiddingStartDate: null,
                                BiddingEndDate: null,
                                BiddingStartTime: null,
                                BiddingEndTime: null,
                                ControllerQuotedValue: "",
                                Unit: "TO",
                                Mode: "Mode1"
                            });
                            that._oDialog.close();
                        }
                    }
                });
            } else {
                this._oDialog.close();
            }
        },

        onNavigateDetails: function (oEvent) {
            bedDetailsModel = new sap.ui.model.json.JSONModel();

            var oSelectedItem = oEvent.getSource();
            var oBindingContext = oSelectedItem.getBindingContext("rankings");
            var iIndex = oBindingContext.getPath().split("/").pop();
            var SelectedChartData = aData[0].Vendors[iIndex];

            bedDetailsModel.setData(SelectedChartData);
            this.getView().setModel(bedDetailsModel, "ChartingFilterModel");
            console.log("selectedData", this.getView().getModel("ChartingFilterModel"));

            console.log("Selected Row Index:", SelectedChartData);
            oView = this.getView();
            if (!this._oDialog1) {
                this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.InviteNegoDetails", this);
                oView.addDependent(this._oDialog1);
            }
            this._oDialog1.open();
        },
        oncancell: function () {
            this._oDialog1.close();
        },
        onSelectItem: function (oEvent) {
            var oTable = this.byId("table");
            var aSelectedItems = oTable.getSelectedItems();
            var bEnableButton = false;

            aSelectedItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext("rankings");
                console.log("oContext", oContext);
                if (oContext) {
                    var oRow = oContext.getObject();
                    var sVendors = oRow.vendorId;
                    if (oRow && oRow.eligible === "No") {
                        oItem.setSelected(false);
                        sap.m.MessageToast.show(`Selected vendor "${sVendors}" is not eligible for bidding. `);
                    } else if (oRow && oRow.eligible === "Yes") {
                        bEnableButton = true;
                    }
                }
            });
            this.getView().byId("ButtonInvite").setEnabled(bEnableButton);
        },
        onRefresh: function () {
            
            this.byId("charteringNo").setValue("");
            this.byId("Voyageno").setValue("");
            var Table = this.byId("idVbox")
            Table.setVisible(false);
            var btn = this.byId("ButtonInvite");
            btn.setVisible(false);
            var refresh = this.byId("ButtonRefresh");
            refresh.setVisible(false);
            var idVoyge = this.byId("idVoyge");
            idVoyge.setVisible(false);
            var oTable = this.byId("table");
            var oModel = this.getView().getModel("rankings");
            if (oModel) {
                oModel.setData({
                    Vendors: []
                });
            }
            var oVBox = this.byId("idVbox");
            if (oVBox) {
                oVBox.setVisible(false);
            }
            this.getView().byId("ButtonInvite").setEnabled(false);
            var oModel = this._oDialog.getModel("addBiddingModel");
            var oData = oModel.getData();
            oModel.setData({
                BiddingStartDate: null,
                BiddingEndDate: null,
                BiddingStartTime: null,
                BiddingEndTime: null,
                ControllerQuotedValue: "",
                Unit: "TO",
                Mode: "Mode1"
            });

        },
        onRefresh1: function () {
            // Clear input fields
            this.byId("date1").setValue("");
            this.byId("date2").setValue("");
            this.byId("ControllerQValue").setValue("");
            this.byId("modeSelect").setSelectedKey("Mode1"); 
        
            var oCurrentTime = new Date();
            var oDateFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" });
            this.byId("BidSTime").setValue(oDateFormat.format(oCurrentTime));
            this.byId("BidETime").setValue(oDateFormat.format(oCurrentTime));
        
            // Reset other fields as needed
            this.byId("unit").setValue("");
        
            // Additional logic to hide or reset other UI elements if necessary
            // Example: this.byId("TableId").setVisible(false);
            // Example: this.byId("ButtonId").setVisible(true);
        
            // Refresh the model bindings if needed
            var oModel = this.getView().getModel("addBiddingModel");
            if (oModel) {
                oModel.setData({
                    BiddingStartDate: null,
                    BiddingEndDate: null,
                    ControllerQuotedValue: null,
                    Mode: "Mode1", // Reset to default mode
                    BiddingStartTime: oDateFormat.format(oCurrentTime), // Reset to current time or default
                    BiddingEndTime: oDateFormat.format(oCurrentTime), // Reset to current time or default
                    Unit: ""
                    // Add more properties as needed
                });
            }
        },
        
        // onselectBSD: function (oEvent) {
        //     var oDatePicker = oEvent.getSource();
        //     var oSelectedDate1 = oDatePicker.getDateValue();
        //     var oCurrentDate = new Date();
        //     oCurrentDate.setHours(0, 0, 0, 0);
        
        //     if (oSelectedDate1 < oCurrentDate) {
        //         oDatePicker.setValue("");
        //         oDatePicker.setValueState("Error");
        //         MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        //     } else {
        //         oDatePicker.setValueState("None");
        //     }
        // },
        
        // onselectBED: function (oEvent) {
        //     var oDatePicker = oEvent.getSource();
        //     var oSelectedDate = oDatePicker.getDateValue();
        //     var oCurrentDate = new Date();
        //     oCurrentDate.setHours(0, 0, 0, 0);
        
        //     // Get the Bidding Start Date value
        //     var oBiddingStartDatePicker = sap.ui.getCore().byId("date1");
        //     var oBiddingStartDate = oBiddingStartDatePicker.getDateValue();
        
        //     if (oSelectedDate < oCurrentDate) {
        //         oDatePicker.setValue("");
        //         oDatePicker.setValueState("Error");
        //         MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        //     } else if (oBiddingStartDate && oSelectedDate < oBiddingStartDate) {
        //         oDatePicker.setValue("");
        //         oDatePicker.setValueState("Error");
        //         MessageBox.error("Bidding End Date cannot be before Bidding Start Date. Please select a valid date.");
        //     } else {
        //         oDatePicker.setValueState("None");
        //     }
        // },
        
        // // onselectBSTime: function (oEvent) {
        // //     var oTimePicker = oEvent.getSource();
        // //     var oSelectedTime = oTimePicker.getTimeValue();
        // //     var oCurrentDate = new Date();
        // //     var oSelectedDate = sap.ui.getCore().byId("date1").getDateValue();
        
        // //     if (oSelectedDate && oSelectedDate.toDateString() === oCurrentDate.toDateString() && oSelectedTime < oCurrentDate) {
        // //         oTimePicker.setValue("");
        // //         oTimePicker.setValueState("Error");
        // //         MessageBox.error("Past times are not allowed for today. Please select a current or future time.");
        // //     } else {
        // //         oTimePicker.setValueState("None");
        // //     }
        // // },
        
        // // onselectBETime: function (oEvent) {
        // //     var oTimePicker = oEvent.getSource();
        // //     var oSelectedTime = oTimePicker.getTimeValue();
        // //     var oSelectedDate = sap.ui.getCore().byId("date2").getDateValue();
        // //     var oCurrentDate = new Date();
        // //     var oBiddingStartDate = sap.ui.getCore().byId("date1").getDateValue();
        // //     var oBiddingStartTime = sap.ui.getCore().byId("BidSTime").getTimeValue();
        
        // //     if (oSelectedDate && oSelectedDate.toDateString() === oCurrentDate.toDateString() && oSelectedTime < oCurrentDate) {
        // //         oTimePicker.setValue("");
        // //         oTimePicker.setValueState("Error");
        // //         MessageBox.error("Past times are not allowed for today. Please select a current or future time.");
        // //     } else if (oBiddingStartDate && oSelectedDate.toDateString() === oBiddingStartDate.toDateString() && oSelectedTime < oBiddingStartTime) {
        // //         oTimePicker.setValue("");
        // //         oTimePicker.setValueState("Error");
        // //         MessageBox.error("Bidding End Time cannot be before Bidding Start Time. Please select a valid time.");
        // //     } else {
        // //         oTimePicker.setValueState("None");
        // //     }
        // // },
        // // onselectBSTime: function (oEvent) {
        // //     var oTimePicker = oEvent.getSource();
        // //     var oSelectedTime = oTimePicker.getDateValue(); // Using getDateValue() to get the time in Date format
        // //     var oBiddingEndTime = sap.ui.getCore().byId("BidETime").getDateValue(); // Using getDateValue() to get the time in Date format
        
        // //     if (oBiddingEndTime && oSelectedTime >= oBiddingEndTime) {
        // //         oTimePicker.setValue("");
        // //         oTimePicker.setValueState("Error");
        // //         MessageBox.error("Bidding Start Time must be less than Bidding End Time and at least 30 minutes before Bidding End Time.");
        // //     } else {
        // //         oTimePicker.setValueState("None");
        // //     }
        // // },
        
        // // onselectBETime: function (oEvent) {
        // //     var oTimePicker = oEvent.getSource();
        // //     var oSelectedTime = oTimePicker.getDateValue(); // Using getDateValue() to get the time in Date format
        // //     var oBiddingStartTime = sap.ui.getCore().byId("BidSTime").getDateValue(); // Using getDateValue() to get the time in Date format
        
        // //     if (oBiddingStartTime) {
        // //         var oTimeDifference = oSelectedTime - oBiddingStartTime;
        // //         var oThirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        // //         if (oSelectedTime <= oBiddingStartTime || oTimeDifference < oThirtyMinutes) {
        // //             oTimePicker.setValue("");
        // //             oTimePicker.setValueState("Error");
        // //             MessageBox.error("Bidding End Time must be greater than Bidding Start Time and at least 30 minutes after Bidding Start Time.");
        // //         } else {
        // //             oTimePicker.setValueState("None");
        // //         }
        // //     }
        // // }
// Initialize state tracking variables


validateTime: function (startDateTime, endDateTime) {
    var oThirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    var timeDifference = endDateTime - startDateTime;
    return timeDifference >= oThirtyMinutes;
},

// Function to handle Bid Start Date selection
onselectBSD: function (oEvent) {
    var oDatePicker = oEvent.getSource();
    var oSelectedDate1 = oDatePicker.getDateValue();
    var oCurrentDate = new Date();
    oCurrentDate.setHours(0, 0, 0, 0);

    if (oSelectedDate1 < oCurrentDate) {
        oDatePicker.setValue("");
        // oDatePicker.setValueState("Error");
        MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        isBidStartDateSelected = false;
    } else {
        oDatePicker.setValueState("None");
        isBidStartDateSelected = true;

        // Clear other fields and reset their states
        var oBiddingEndDatePicker = sap.ui.getCore().byId("date2");
        var oBiddingStartTimePicker = sap.ui.getCore().byId("BidSTime");
        var oBiddingEndTimePicker = sap.ui.getCore().byId("BidETime");

        oBiddingEndDatePicker.setValue("");
        oBiddingEndDatePicker.setValueState("None");
        oBiddingStartTimePicker.setValue("");
        oBiddingStartTimePicker.setValueState("None");
        oBiddingEndTimePicker.setValue("");
        oBiddingEndTimePicker.setValueState("None");

        isBidEndDateSelected = false;
        isBidStartTimeSelected = false;
        isBidEndTimeSelected = false;
    }
},

// Function to handle Bid End Date selection
onselectBED: function (oEvent) {
    if (!isBidStartDateSelected) {
        MessageBox.error("Please select the Bid Start Date first.");
        var oDatePicker = oEvent.getSource();
        oDatePicker.setValue("");
        // oDatePicker.setValueState("Error");
        return;
    }

    var oDatePicker = oEvent.getSource();
    var oSelectedDate = oDatePicker.getDateValue();
    var oCurrentDate = new Date();
    oCurrentDate.setHours(0, 0, 0, 0);

    // Get the Bidding Start Date value
    var oBiddingStartDatePicker = sap.ui.getCore().byId("date1");
    var oBiddingStartDate = oBiddingStartDatePicker.getDateValue();

    if (oSelectedDate < oCurrentDate) {
        oDatePicker.setValue("");
        // oDatePicker.setValueState("Error");
        MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        isBidEndDateSelected = false;
    } else if (oBiddingStartDate && oSelectedDate < oBiddingStartDate) {
        oDatePicker.setValue("");
        // oDatePicker.setValueState("Error");
        MessageBox.error("Bidding End Date cannot be before Bidding Start Date. Please select a valid date.");
        isBidEndDateSelected = false;
    } else {
        oDatePicker.setValueState("None");
        isBidEndDateSelected = true;

        // Clear other fields and reset their states
        var oBiddingStartTimePicker = sap.ui.getCore().byId("BidSTime");
        var oBiddingEndTimePicker = sap.ui.getCore().byId("BidETime");

        oBiddingStartTimePicker.setValue("");
        oBiddingStartTimePicker.setValueState("None");
        oBiddingEndTimePicker.setValue("");
        oBiddingEndTimePicker.setValueState("None");

        isBidStartTimeSelected = false;
        isBidEndTimeSelected = false;
    }
},

// Function to handle Bid Start Time selection
onselectBSTime: function (oEvent) {
    if (!isBidStartDateSelected || !isBidEndDateSelected) {
        MessageBox.error("Please select the Bid Start Date and Bid End Date first.");
        var oTimePicker = oEvent.getSource();
        oTimePicker.setValue("");
        oTimePicker.setValueState("Error");
        return;
    }

    var oTimePicker = oEvent.getSource();
    var oSelectedTime = oTimePicker.getDateValue(); // Using getDateValue() to get the time in Date format
    var oBiddingStartDate = sap.ui.getCore().byId("date1").getDateValue();
    var oBiddingEndDate = sap.ui.getCore().byId("date2").getDateValue();
    var oBiddingEndTime = sap.ui.getCore().byId("BidETime").getDateValue(); // Using getDateValue() to get the time in Date format

    if (oBiddingEndDate && oBiddingEndDate.toDateString() === oBiddingStartDate.toDateString() && oBiddingEndTime) {
        var startDateTime = new Date(oBiddingStartDate);
        startDateTime.setHours(oSelectedTime.getHours(), oSelectedTime.getMinutes(), 0, 0);
        var endDateTime = new Date(oBiddingEndDate);
        endDateTime.setHours(oBiddingEndTime.getHours(), oBiddingEndTime.getMinutes(), 0, 0);

        if (!this.validateTime(startDateTime, endDateTime)) {
            oTimePicker.setValue("");
            oTimePicker.setValueState("Error");
            MessageBox.error("Bidding Start Time must be at least 30 minutes before Bidding End Time.");
            isBidStartTimeSelected = false;
            return;
        }
    }

    oTimePicker.setValueState("None");
    isBidStartTimeSelected = true;

    // Clear other fields and reset their states
    var oBiddingEndTimePicker = sap.ui.getCore().byId("BidETime");
    oBiddingEndTimePicker.setValue("");
    oBiddingEndTimePicker.setValueState("None");

    isBidEndTimeSelected = false;
},

// Function to handle Bid End Time selection
onselectBETime: function (oEvent) {
    if (!isBidStartDateSelected || !isBidStartTimeSelected || !isBidEndDateSelected) {
        MessageBox.error("Please select the Bid Start Date, Bid Start Time, and Bid End Date first.");
        var oTimePicker = oEvent.getSource();
        oTimePicker.setValue("");
        oTimePicker.setValueState("Error");
        return;
    }

    var oTimePicker = oEvent.getSource();
    var oSelectedTime = oTimePicker.getDateValue(); // Using getDateValue() to get the time in Date format
    var oBiddingStartDate = sap.ui.getCore().byId("date1").getDateValue();
    var oBiddingStartTime = sap.ui.getCore().byId("BidSTime").getDateValue(); // Using getDateValue() to get the time in Date format
    var oBiddingEndDate = sap.ui.getCore().byId("date2").getDateValue();

    if (oBiddingStartDate && oBiddingEndDate && oBiddingStartDate.toDateString() === oBiddingEndDate.toDateString() && oBiddingStartTime) {
        var startDateTime = new Date(oBiddingStartDate);
        startDateTime.setHours(oBiddingStartTime.getHours(), oBiddingStartTime.getMinutes(), 0, 0);
        var endDateTime = new Date(oBiddingEndDate);
        endDateTime.setHours(oSelectedTime.getHours(), oSelectedTime.getMinutes(), 0, 0);

        if (endDateTime <= startDateTime) {
            oTimePicker.setValue("");
            // oTimePicker.setValueState("Error");
            MessageBox.error("Bidding End Time cannot be less than or equal to Bidding Start Time.");
            isBidEndTimeSelected = false;
            return;
        }

        if (!this.validateTime(startDateTime, endDateTime)) {
            oTimePicker.setValue("");
            // oTimePicker.setValueState("Error");
            MessageBox.error("Bidding End Time must be at least 30 minutes after Bidding Start Time.");
            isBidEndTimeSelected = false;
            return;
        }
    }

    oTimePicker.setValueState("None");
    isBidEndTimeSelected = true;
}


        
        
        
    });
});