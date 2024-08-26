sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/BusyDialog",
    "com/ingenx/nauti/vendorbidding/model/formatter"
  ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap/ui/model/json/JSONModel} JSONModel
     * @param {typeof sap/ui/model/Filter} Filter
     * @param {typeof sap/ui/model/FilterOperator} FilterOperator
     * @param {typeof sap/m/BusyDialog} BusyDialog
     */
    function (Controller, JSONModel, Filter, FilterOperator, BusyDialog,formatter) {
        "use strict";
        let  userEmail
        const statusLevel = {
            CLOSED: "Closed",
            OPEN: "Yet to Start",
            SUBMIT: "Submitted",
            ONGOING:"Ongoing",
            ALL: "All",
        };
        return Controller.extend("com.ingenx.nauti.vendorbidding.controller.Main", {
            formatter: formatter,
            onInit:async  function () {
                await this.getLoggedInUserInfo();
                this.staticData = await this.checkforValidUser();

                if (this.staticData) {
                    this.getView().byId("authoLayout").setVisible(true);
                    this.getView().byId("authoLayout2").setVisible(true);
                    this.getView().byId("unauthorizedMessage").setVisible(false);
            
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
                    this.charteringData = [];
                 
                
                    this._oBusyDialog.open();
                    Promise.all([this._fetchVendorData(), this._fetchCharteringData()])
                        .then(function () {
                            this._oBusyDialog.close();
                            this._getCharterListData();
                        }.bind(this))
                        .catch(function (error) {
                            console.error("Error fetching data", error);
                            this._oBusyDialog.close();
                        }.bind(this));
                } else {
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
                  userEmail = "shruti.kumari@ingenxtec.com";
                  console.log("hiii",userEmail);
                }
              },
              checkforValidUser: async function() {
                let loggedinUser = userEmail; 
            
                if (loggedinUser === "shruti.kumari@ingenxtec.com") {
                    let vendorfound = "2100000001";
                    console.log("Vendor found for Shruti Kumari", vendorfound);
                    return vendorfound;
                } else if (loggedinUser === "rishbh.tiwari@ingenxtec.com") {
                    let vendorfound = "2100000000";
                    console.log("Vendor found for Rishbh Tiwari", vendorfound);
                    return vendorfound;
                } else {
                    console.log("No vendor found for the logged-in user");
                    return null; 
                }
            },

        
            
            //this function is using for get the vendor data based on vendor no
            _fetchVendorData: function () {
                return new Promise((resolve, reject) => {
                    var oModel = this.getOwnerComponent().getModel();
                    var oBidListData = oModel.bindList("/BusinessPartnerSet", undefined, undefined, undefined, {
                        $filter: `Lifnr eq '${this.staticData}'`
                    });
            
                    oBidListData.requestContexts(0).then(function (aContexts) {
                        aContexts.forEach(function (oContext) {
                            this.getBidData.push(oContext.getObject());
                        }.bind(this));
            
                        let vendorData = this.getBidData.filter(item => item.Lifnr === this.staticData);
            
                        if (vendorData.length > 0) {
                            let oVendorInfo = {
                                number: vendorData[0].Lifnr,
                                name: vendorData[0].Name1,
                                description: "",

                                address: `${vendorData[0].Stras} ${vendorData[0].Ort01} ${vendorData[0].Pstlz}`,
                                qualified: {
                                    from: "",
                                    to: "",
                                },
                                chno: [],
                            };
            
                            const oVendorModel = new JSONModel();
                            oVendorModel.setData(oVendorInfo);
                            this.getView().setModel(oVendorModel, "vendorinfo");
                            resolve();
                        } else {
                            sap.m.MessageToast.show("Vendor not found.");
                            resolve(); 
                        }            
                    }.bind(this)).catch(function (error) {
                        console.error("Error fetching data", error);
                        reject(error);
                    }.bind(this));
                });
            },
            
            //this function is using for getting the chartering data of a vendor
            _fetchCharteringData: function () {
                return new Promise((resolve, reject) => {
                    var oModel = this.getOwnerComponent().getModel();
                    var oCharteringListData = oModel.bindList("/getfinalbidSet", undefined, undefined, undefined, {
                        $filter: `Lifnr eq '${this.staticData}'`
                    });
            
                    oCharteringListData.requestContexts(0).then(function (aContexts) {
                        aContexts.forEach(function (oContext) {
                            this.charteringData.push(oContext.getObject());
                        }.bind(this));
            
                        let vendorTableData = this.charteringData.filter(item => item.Lifnr === this.staticData);
                        if (vendorTableData.length > 0) {
                            const charteringModel = new JSONModel();
                            charteringModel.setData(vendorTableData);
                            this.getView().setModel(charteringModel, "charteringRequestModel");
                        } else {
                            sap.m.MessageToast.show("Vendor data not found.");
                        }
            
                        console.log("charteringData", this.charteringData);
                        resolve();
                    }.bind(this)).catch(function (error) {
                        console.error("Error fetching chartering data", error);
                        reject(error);
                    }.bind(this));
                });
            },
            
            //this function is using for set the status based on Date and Time
            _getCharterListData: function () {
                let charteringData = this.getView().getModel("charteringRequestModel").getData();
                let current = `${this.formatter.dateFormat(new Date())}T${this.formatter.formatTime()}`;
            
                let counts = {
                    Open: 0,
                    Closed: 0,
                    Ongoing: 0,
                    All: charteringData.length
                };
            
                charteringData.forEach((element) => {
                    let start = `${this.formatter.dateFormat(element.Chrqsdate)}T${this.formatter.formatBidTime(element.Chrqstime)}`;
                    let end = `${this.formatter.dateFormat(element.Chrqedate)}T${this.formatter.formatBidTime(element.Chrqetime)}`;
            
                    if (current >= start && current <= end) {
                        element.zstat = statusLevel.ONGOING;
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
                bidTileModel.setProperty("/All", counts.All);
            },   
                     

          
            // this function is using for filter the chartering data based on Opne Status 
            pressOpen: function () {
                const openFilters = [
                    new Filter("zstat", FilterOperator.EQ, statusLevel.OPEN),
                    new Filter("zstat", FilterOperator.EQ, statusLevel.ONGOING),
                    new Filter("zstat", FilterOperator.EQ, statusLevel.SUBMIT),
                ];
                this._applyFilters(openFilters);
            },  
  
            // this function is using for filter the chartering data based on Close Status  
            pressClose: function () {
                const closeFilters = [
                    new Filter("zstat", FilterOperator.EQ, statusLevel.CLOSED),
                    new Filter("zstat", FilterOperator.EQ, statusLevel.SUBMIT),
                ];
                this._applyFilters(closeFilters);
            }, 
  
            // this function is using for display all chartering data in table 
            pressAll: function () {
                this._applyFilters([]);
            },   
            
            // This function is actually working behind all filters method
            _applyFilters: function (filters) {
                const oTable = this.byId("centerDataTable");
                try {
                    oTable.getBinding("items").filter(filters);
                } catch (error) {
                    console.error(error.message);
                    sap.m.MessageToast.show("Nothing to filter.");
                }
            },
                  
        //this formatter is using for set the color of status text   
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

            // this function is using for navigating to the next page with some data
            toBiddingDetail: function (oEvent) {
                const oSource = oEvent.getSource();
                const oBindingContext = oSource.getBindingContext("charteringRequestModel");
                const rowData = oBindingContext.getObject();
            
                sessionStorage.setItem("biddingData", JSON.stringify(rowData));            
                const oModel = this.getView().getModel("charteringRequestModel");
                this.getOwnerComponent().setModel(oModel, "charteringRequestModel");
                this.getOwnerComponent().getRouter().navTo("RouteBidding");
            }
            
        });
    });
  
