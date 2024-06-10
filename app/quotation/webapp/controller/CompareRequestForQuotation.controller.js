
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function (Controller, JSONModel, ODataModel, MessageBox, Filter, FilterOperator) {
    "use strict";
    let Chrnmin;
    let oModel;
    let rankings;
    let aData;
    let oView;
    let bedDetailsModel;
    let sVendors;

    return Controller.extend("com.ingenx.nauti.quotation.controller.CompareRequestForQuotation", {
        onInit: function () {

        },

        
        

        calculateAndBindRankings: function (Chrnmin) {
            // debugger;
            // Define the entity set and filters (if any)
            var oTable = this.byId("table");

            // Set the initial noData message to "Loading..."
            oTable.setNoData("Loading...");
            // oTable.setBusy(true);
            oModel = this.getOwnerComponent().getModel();
            const sEntitySet = "/calculateRankings";
            const aFilters = [
                new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, Chrnmin)
            ];
            console.log("Chrnmin", Chrnmin);
            const oListBinding = oModel.bindList(sEntitySet, undefined, undefined, aFilters);

            // Request data and handle the response
            oListBinding.requestContexts().then(function (aContexts) {
                aData = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                // Log the data to the console
                console.log("Fetched Data:", aData);

                // Assuming aData contains your fetched data and it has at least one entry
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

                    // Set the vendorsData to a JSONModel and bind it to the view
                    // const oModel = new JSONModel({ Vendors: vendorsData });
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
                            // press: "onNavigateDetails",
                            press: this.onNavigateDetails.bind(this),
                            cells: [
                                new sap.m.Text({ text: "{rankings>vendorId}", textAlign: sap.ui.core.TextAlign.Center }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/0/Value}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/0/fScore}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/1/Value}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/1/fScore}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/2/Value}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/2/fScore}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/4/Value}" }),
                                // new sap.m.Text({ text: "{rankings>bidDetails/4/fScore}" }),
                                new sap.m.Text({ text: "{rankings>Crank}" }).addStyleClass("rank"),
                                new sap.m.Text({ text: "{rankings>Trank}" }).addStyleClass("rank"),
                                new sap.m.Text({ text: "{rankings>score}" }).addStyleClass("score"),
                                new sap.m.Text({
                                    text: {
                                        path: 'rankings>eligible'
                                    }
                                }).addStyleClass("eligibility"),


                            ]
                        })
                    });

                    // MessageToast.show("Data fetched successfully!");
                } else {
                    this.byId("charteringNo").setValue("");
                    // var oTable = this.byId("table")
                    // oTable.setVisible(false);
                    var idVoyge = this.byId("idVoyge");
                    idVoyge.setVisible(false);
                    var oTable = this.byId("table");
                    var oModel = this.getView().getModel("rankings");
                    if (oModel) {
                        oModel.setData({ Vendors: [] });
                    }
                    oTable.setNoData("No data available");
                    
                    // Hide the VBox containing the table
                    var oVBox = this.byId("idVbox");
                    if (oVBox) {
                        oVBox.setVisible(false);
                    }
                    console.error("No data fetched");
            

                    MessageBox.information(`No vendor data found for chartering no. : ${Chrnmin}`);
           
                }
            }.bind(this)).catch(function (oError) {
                // Handle error response
                // MessageToast.show("Error fetching data.");
                console.error("Error fetching data:", oError);
            });
        },
        checkBoxEnabled: function (sEligibility) {
            return sEligibility === "Yes";
        },

        formatBooleanToText:function(status){
            console.log("formatBooleanToText called with status:", status);
            if(status===true){
                return "Yes"
            }
            else{
                return "No"
            }
        },

        charteringValueHelp: function (oEvent) { 
            var oView = this.getView();
        
            if (!this._oDialog2) {
                this._oDialog2 = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.CharteringNo", this);
                oView.addDependent(this._oDialog2);
            }
        
            // Clear any previous selections
            this._oDialog2.clearSelection();
        
            // Refresh the binding to ensure data is reloaded
            var oBinding = this._oDialog2.getBinding("items");
            if (oBinding) {
                oBinding.filter([]);  // Clear any existing filters
                oBinding.refresh();   // Refresh the binding to reload the data
            } else {
                // In case the binding is not yet created, manually rebind the items
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
        
        
        
        

        // charteringValueHelp: function (oEvent) { 
        //     var oView = this.getView();

        //     if (!this._oDialog2) {
        //         this._oDialog2 = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.CharteringNo", this);
        //         oView.addDependent(this._oDialog2);
        //     }

        //     // Refresh the binding to ensure data is reloaded
        //     var oBinding = this._oDialog2.getBinding("items");
        //     oBinding.filter([]);

        //     this._oDialog2.open();
        // },

       

        // onValueHelpClose1: function (oEvent) {

        //     var oSelectedItem = oEvent.getParameter("selectedItem");

        //     oEvent.getSource().getBinding("items").filter([]);

        //     if (!oSelectedItem) {
        //         return;
        //     }

        //     Chrnmin = oSelectedItem.getTitle();
        //     this.byId("charteringNo").setValue(Chrnmin);
        //     console.log("Chrnminnn", Chrnmin);

        //     this.calculateAndBindRankings(Chrnmin);
            
        //     var btn = this.byId("ButtonInvite");
        //     btn.setVisible(true);
        //     var refresh = this.byId("ButtonRefresh");
        //     refresh.setVisible(true);
        //     var idVoyge = this.byId("idVoyge");
        //     idVoyge.setVisible(true);
        //     var compare = this.byId("_IdCompare");
        //     compare.setVisible(false);
        //     var invite = this.byId("_IdInvite");
        //     invite.setVisible(true);
        //     var oTable = this.byId("table")
        //     oTable.setVisible(true
        //         );
            
        //     if (Chrnmin) {
        //         var oVBox = this.byId("idVbox");
        //         if (oVBox) {
        //             oVBox.setVisible(true);
        //         }
        //     }
            
        
        // },
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
        
        
        onChartSearch1: function (oEvent) {
            // debugger;
            var sValue = oEvent.getParameter("value");

            var oFilter = new Filter("chrnmin", FilterOperator.Contains, sValue);

            oEvent.getSource().getBinding("items").filter([oFilter]);
        },


        onSubmitInvite: function () {
            // this.getView().byId("ButtonInvite").setEnabled(true);

            var oTable = this.byId("table");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageBox.error("Please select at least one row.");
                return;
            }

            var aIneligibleVendors = aSelectedItems.reduce(function (aAccumulator, oItem) {
                var oContext = oItem.getBindingContext("rankings");
                if (oContext.getProperty("eligible") === "No") {
                    aAccumulator.push(oContext.getProperty("vendorId"));
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
                        Unit: "TO",
                        Mode: "Mode1"
                    });
                    this._oDialog.setModel(oModel, "addBiddingModel");
                }
                this._oDialog.open();
            }
        },

        onSave: function () {
            var oModel = this._oDialog.getModel("addBiddingModel");
            var oData = oModel.getData();


            var BiddingStartDate = oData.BiddingStartDate;
            var BiddingEndDate = oData.BiddingEndDate;
            var BiddingStartTime = oData.BiddingStartTime;
            var BiddingEndTime = oData.BiddingEndTime;
            var ControllerQuotedValue = oData.ControllerQuotedValue;
            var Unit = oData.Unit;
            var Mode = oData.Mode;

            if (!BiddingStartDate || !BiddingEndDate || !BiddingStartTime || !BiddingEndTime || !ControllerQuotedValue || !Unit || !Mode) {
                MessageBox.error("Please fill all fields");
                return;
            }

            this._oDialog.close();

            console.log("Bidding Start Date:", BiddingStartDate);
            console.log("Bidding End Date:", BiddingEndDate);
            console.log("Bidding Start Time:", BiddingStartTime);
            console.log("Bidding End Time:", BiddingEndTime);
            console.log("Controller Quoted Value:", ControllerQuotedValue);
            console.log("Unit:", Unit);
            console.log("Mode of Bidding:", Mode);
            MessageBox.success("Email send successfully");
            // Reset the model data to default values to clear the fragment fields
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

        // onCancel: function () {
        //     this._oDialog.close();
        // },

        onCancel: function () {
            var oModel = this._oDialog.getModel("addBiddingModel");
            var oData = oModel.getData();
            var that = this;

            // Check if there are any changes in the fields
            var hasChanges = oData.BiddingStartDate || oData.BiddingEndDate || oData.BiddingStartTime || oData.BiddingEndTime || oData.ControllerQuotedValue;

            if (hasChanges) {
                // Show confirmation dialog
                MessageBox.confirm("You have unsaved changes. Do you want to discard them?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            // Reset the model data to null values to clear the fragment fields
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
                // Close the dialog directly if there are no changes
                this._oDialog.close();
            }
        }
        ,

        onNavigateDetails: function (oEvent) {

            //    console.log("aData",aData)
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

       

        onSelectItem: function(oEvent) {
            var oTable = this.byId("table");
            var aSelectedItems = oTable.getSelectedItems();
            var bEnableButton = false;
        
            aSelectedItems.forEach(function(oItem) {
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
                


       
        // onSelectItem: function(oEvent) {
        //     // debugger;
        //     var oTable = this.byId("table");
        //     var aSelectedItems = oTable.getSelectedItems();
 
        //     aSelectedItems.forEach(function(oItem) {
        //         var oContext = oItem.getBindingContext("rankings");
        //         console.log("oContext",oContext);
        //         if (oContext) {
        //             var oRow = oContext.getObject();
        //             if (oRow && oRow.eligible === "No") {
        //                 oItem.setSelected(false);
        //                 sap.m.MessageToast.show("Cannot select row with eligibility   'No'.");
        //             }
                    
        //         }
        //     });
        //     this.getView().byId("ButtonInvite").setEnabled(true);
        // },
        


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
                oModel.setData({ Vendors: [] });
            }
            
            // Hide the VBox containing the table
            var oVBox = this.byId("idVbox");
            if (oVBox) {
                oVBox.setVisible(false);
            }
            this.getView().byId("ButtonInvite").setEnabled(false);

        },

        onselectBSD: function (oEvent) {
            var oDatePicker = oEvent.getSource();
            var oSelectedDate1 = oDatePicker.getDateValue();
            var oCurrentDate = new Date();

            // Clear time portion of current date for comparison
            oCurrentDate.setHours(0, 0, 0, 0);

            if (oSelectedDate1 < oCurrentDate) {
                // oDatePicker.setValueState("Error");
                oDatePicker.setValue("");
                MessageBox.error("Past dates are not allowed. Please select a current or future date.");
            } else {
                oDatePicker.setValueState("None");
            }
        },
        //   onselectBED:function (oEvent) {
        //     var oDatePicker = oEvent.getSource();
        //     var oSelectedDate = oDatePicker.getDateValue();
        //     var oCurrentDate = new Date();

        //     // Clear time portion of current date for comparison
        //     oCurrentDate.setHours(0, 0, 0, 0);

        //     if (oSelectedDate < oCurrentDate && oSelectedDate1) {
        //         // oDatePicker.setValueState("Error");
        //         oDatePicker.setValue("");
        //         MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        //     } else {
        //         oDatePicker.setValueState("None");
        //     }
        //   }
    });
});

