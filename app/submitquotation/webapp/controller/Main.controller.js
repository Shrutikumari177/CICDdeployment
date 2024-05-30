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
          YETTOSTART: "Yet to Start",
          ALL: "All",
      };
      return Controller.extend("com.ingenx.nauti.submitquotation.controller.Main", {
        
          onInit: function () {
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

              const charterTileModel = new JSONModel({
                  Open: 0,
                  Closed: 0,
                  All: 0,
              });
              this.getView().setModel(charterTileModel, "chartertilemodel");

              this.getBidData = [];
              this.staticData = "2100000002";

              var oModel = this.getOwnerComponent().getModel();

              let aFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, this.staticData);
              var oBidListData = oModel.bindList("/xNAUTIxRFQPORTAL", undefined, undefined, [aFilter], {
                  $expand: "toassociation1,toassociation2"
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
                      this.charteringData = this.getBidData[0].toassociation2;
                      
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

          _getCharterListData: async function () {
            debugger;
              const oCharterListModel = new JSONModel({ charterList: [] });
              this.getOwnerComponent().setModel(oCharterListModel, "charterlist");
              let charterListModel = this.getOwnerComponent().getModel("charterlist");
              let oModel = this.getOwnerComponent().getModel();
              let charterNos = this.getView().getModel("vendorinfo").getData().chno;
              let current = `${this.dateFormat(new Date())}T${this.formatTime()}`;
              this.charteringData.forEach(((element) => {
                  let start = `${this.dateFormat(element.Chrqsdate)}T${this.formatTime(element.Chrqstime)}`;
                  let end = `${this.dateFormat(element.Chrqedate)}T${this.formatTime(element.Chrqetime)}`;
                  
                  if (current < start) {
                      element.Stat = statusLevel.YETTOSTART;
                  } else if (current > end) {
                      element.Stat = statusLevel.CLOSED;
                  } else {
                      element?.ChartReqtoVendBid?.results.length > 0
                          ? (element.Stat = statusLevel.SUBMIT)
                          : (element.Stat = statusLevel.OPEN);
                  }
                  charterListModel.getData().charterList.push(element);
                  charterListModel.refresh();
                  this._initializeTiles(element.status);
              }));
          },

          _initializeTiles: function (status) {
              this.getView().getModel("chartertilemodel").getData()[
                  status === statusLevel.SUBMIT
                      ? statusLevel.CLOSED
                      : status === statusLevel.YETTOSTART
                          ? statusLevel.OPEN
                          : status
              ]++;
              this.getView().getModel("chartertilemodel").getData()[statusLevel.ALL]++;
              this.getView().getModel("chartertilemodel").refresh();
          },
          
          pressOpen: function () {
              let aFilter = [];
              const oTable = this.byId("centerDataTable");
              const oFilterOpen = new Filter("Stat", FilterOperator.EQ, statusLevel.OPEN);
              const oFilterYetToStart = new Filter("Stat", FilterOperator.EQ, statusLevel.YETTOSTART);
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

          pressClosed: function () {
              let aFilter = [];
              const oTable = this.byId("centerDataTable");
              const oFilterClosed = new Filter("Stat", FilterOperator.EQ, statusLevel.CLOSED);
              const oFilterSubmitted = new Filter("Stat", FilterOperator.EQ, statusLevel.SUBMIT);
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
              oJSONModel.setData({ filteredData: extractData });

              this.getView().setModel(oJSONModel);
          },

          formatTime: function (time = false) {
              function pad(n) {
                  return n < 10 ? '0' + n : n;
              }

              if (time && time.ms !== undefined) {
                  let date = new Date(time.ms);
                  let hours = pad(date.getUTCHours());
                  let minutes = pad(date.getUTCMinutes());
                  let seconds = pad(date.getUTCSeconds());
                  return `${hours}:${minutes}:${seconds}`;
              } else if (!time) {
                  let now = new Date();
                  let hours = pad(now.getHours());
                  let minutes = pad(now.getMinutes());
                  let seconds = pad(now.getSeconds());
                  return `${hours}:${minutes}:${seconds}`;
              } else {
                  return '00:00:00';
              }
          },

          statusFormatter: function (status) {
              switch (status) {
                  case statusLevel.OPEN:
                      return sap.ui.core.ValueState.Warning;
                  case statusLevel.CLOSED:
                      return sap.ui.core.ValueState.Error;
                  case statusLevel.YETTOSTART:
                      return sap.ui.core.ValueState.Warning;
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

          toBiddingDetail: function (oEvent) {
              const oContext = oEvent.getSource().getBindingContext("charteringRequestModel");
              const rowData = oContext.getObject();

              const CharterReqNo = rowData.Chrnmin;
              const voyno = rowData.Voyno;
              const sdate = rowData.Chrqsdate;
              const sTime = rowData.Chrqstime;
              const eDate = rowData.Chrqedate;
              const eTime = rowData.Chrqetime;

              const oEventBus = sap.ui.getCore().getEventBus();
              oEventBus.publish("BiddingChannel", "BiddingDetail", {
                  vendorNo : this.staticData,
                  CharterReqNo: CharterReqNo,
                  path: voyno,
                  startDate: sdate,
                  startTime: sTime,
                  endDate: eDate,
                  endTime: eTime
              });

              const oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("RouteBidding", { path: voyno });
          },
          
          onPress: function () {
              console.log("inside function", getBidData);
          }
      });
  });
