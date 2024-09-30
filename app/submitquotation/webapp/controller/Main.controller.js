sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/BusyDialog",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, Filter, FilterOperator, BusyDialog, MessageToast, ValueState, DateFormat) {
    "use strict";

    const statusLevel = {
        CLOSED: "Closed",
        OPEN: "Open",
        SUBMIT: "Submitted",
        YETTOSTART: "YetToStart",
        ALL: "All"
    };
    let  userEmail;
    let vendor;


    return Controller.extend("com.ingenx.nauti.submitquotation.controller.Main", {

        onInit: async function () {
           await  this.getLoggedInUserInfo();
                    
            vendor = await  this.checkforValidUser();
            console.log("vendoruser",vendor);
            if(vendor){
                this.getView().byId("authoLayout").setVisible(true);
                this.getView().byId("authoLayout2").setVisible(true);
                this.getView().byId("unauthorizedMessage").setVisible(false);
                this._initModels();
               this._fetchBidData();
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteMain").attachPatternMatched(this._onRouteMatched, this);
            }
            else {
                this.getView().byId("authoLayout").setVisible(false);
                this.getView().byId("authoLayout2").setVisible(false);
                this.getView().byId("unauthorizedMessage").setVisible(true);
            }
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
              userEmail ="shruti.kumari@ingenxtec.com";
              console.log("hiii",userEmail);
            }
          },
          checkforValidUser: async function() {
            let loggedinUser = userEmail; 
        
            if (loggedinUser === "shruti.kumari@ingenxtec.com") {
                let vendorfound = "100000";
                console.log("Vendor found for Shruti Kumari", vendorfound);
                return vendorfound;
            } else if (loggedinUser === "rishabh.tiwari@ingenxtec.com") {
                let vendorfound = "100010";
                console.log("Vendor found for Rishbh Tiwari", vendorfound);
                return vendorfound;
            } else {
                console.log("No vendor found for the logged-in user");
                return null; 
            }
        },
        

        _onRouteMatched:function(){
            
             this._getCharterListData()
        },
    

        _initModels: async function () {
            const bidTileModel = new JSONModel({
                Open: 0,
                Closed: 0,
                All: 0,
            });
            this.getView().setModel(bidTileModel, "bidtilemodel");

            this._oBusyDialog = new BusyDialog({
                text: "Loading"
            });

            this.getBidData = [];
            this.staticData = vendor;
           
        },

        _fetchBidData:async function () {
            const oModel = this.getOwnerComponent().getModel();
            const oBidListData = oModel.bindList("/xNAUTIxsubmitquafetch", undefined, undefined, undefined, {
                $filter: `Lifnr eq '${this.staticData}'`
            });

            this._oBusyDialog.open();

            oBidListData.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                    this.getBidData.push(oContext.getObject());
                }.bind(this));

                if (this.getBidData.length > 0) {
                    this._setVendorInfo(this.getBidData[0]);
                    this._getCharterListData();
                }
            }.bind(this)).catch(function (error) {
                console.error("Error fetching data", error);
            }).finally(function () {
                this._oBusyDialog.close();
            }.bind(this));
        },

        _setVendorInfo: function (data) {
            const oVendorInfo = {
                number: data.Lifnr,
                name: data.Name1,
                address: `${data.Stras} ${data.Ort01} ${data.Pstlz}`,
                qualified: {
                    from: data.qualified_from || "",
                    to: data.qualified_to || "",
                },
                chno: []
            };

            const oVendorModel = new JSONModel(oVendorInfo);
            this.getView().setModel(oVendorModel, "vendorinfo");

            const charteringModel = new JSONModel(this.getBidData);
            this.getView().setModel(charteringModel, "charteringRequestModel");
        },

        _getCharterListData: async function () {
            const charteringData = this.getView().getModel("charteringRequestModel").getData();
            const current = new Date();
            const counts = {
                Open: 0,
                Closed: 0,
                YETTOSTART: 0,
                All: charteringData.length
            };

            const oModel = this.getOwnerComponent().getModel();
            const statusBind = oModel.bindList("/quotations", undefined, undefined, undefined, {
                $filter: `Lifnr eq '${this.staticData}'`
            });
            const statusContext = await statusBind.requestContexts(0, Infinity);
            const readVendorData = statusContext.map(item => item.getObject());

            charteringData.forEach((element) => {
                const start = new Date(`${element.Chrqsdate}T${element.Chrqstime}`);
                const end = new Date(`${element.Chrqedate}T${element.Chrqetime}`);

                if (current >= start && current <= end) {
                    element.zstat = statusLevel.OPEN;
                    counts.Open++;
                } else if (current < start) {
                    element.zstat = statusLevel.YETTOSTART;
                    counts.YETTOSTART++;
                } else if (current > end) {
                    element.zstat = statusLevel.OPEN;
                    counts.Closed++;
                }

                const existingQuotation = readVendorData.find(data => data.Chrnmin === element.Chrnmin && data.Lifnr === element.Lifnr);
                if (existingQuotation && element.zstat === statusLevel.OPEN && current < end) {
                    element.zstat = statusLevel.SUBMIT;
                }
            });

            this._updateBidTileModel(counts);
            this.getView().getModel("charteringRequestModel").refresh();
        },

        _updateBidTileModel: function (counts) {
            const bidTileModel = this.getView().getModel("bidtilemodel");
            bidTileModel.setProperty("/Open", counts.Open);
            bidTileModel.setProperty("/Closed", counts.Closed);
            bidTileModel.setProperty("/YETTOSTART", counts.YETTOSTART);
            bidTileModel.setProperty("/All", counts.All);
        },

        pressOpen: function () {
            this._filterTableByStatus([statusLevel.OPEN, statusLevel.SUBMIT, statusLevel.YETTOSTART]);
        },

        pressClose: function () {
            this._filterTableByStatus([statusLevel.CLOSED]);
        },

        pressAll: function () {
            const oTable = this.byId("centerDataTable");
            try {
                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").refresh();
                
            } catch (error) {
                console.log(error.message);
                sap.m.MessageToast.show("Nothing to filter.");
            }
        },
        

        _filterTableByStatus: function (statuses) {
            const oTable = this.byId("centerDataTable");
            const aFilters = statuses.map(status => new Filter("zstat", FilterOperator.EQ, status));
            const oFilter = new Filter({
                filters: aFilters,
                and: false
            });

            try {
                oTable.getBinding("items").filter(oFilter);
            } catch (error) {
                console.error("Error filtering table data:", error.message);
                MessageToast.show("Nothing to filter.");
            }
        },

        formatTime: function () {
            const now = new Date();
            return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        },

        statusFormatter: function (status) {
            switch (status) {
                case statusLevel.OPEN:
                    return ValueState.Warning;
                case statusLevel.CLOSED:
                    return ValueState.Error;
                case statusLevel.YETTOSTART:
                    return ValueState.Information;
                case statusLevel.SUBMIT:
                    return ValueState.Success;
                default:
                    return ValueState.Information;
            }
        },

        dateFormat: function (oDate) {
            const oDateFormat = DateFormat.getDateInstance({ pattern: 'yyyy-MM-dd' });
            return oDateFormat.format(new Date(oDate));
        },

        toBiddingDetail: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext("charteringRequestModel");
            const rowData = oBindingContext.getObject();
            sessionStorage.setItem("biddingData", JSON.stringify(rowData));

            const oModel = this.getView().getModel("charteringRequestModel");
            this.getOwnerComponent().setModel(oModel, "charteringRequestModel");
            this.getOwnerComponent().getRouter().navTo("RouteBidding");
        }

    });
});
