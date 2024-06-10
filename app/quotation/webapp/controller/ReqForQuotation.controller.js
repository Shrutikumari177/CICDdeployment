

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  'sap/m/Token',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],

  /**

   * @param {typeof sap.ui.core.mvc.Controller} Controller

   */

  function (Controller, Fragment, MessageToast, MessageBox, Filter, FilterOperator) {

    "use strict";
    let getModelData = [];
    let getVendorModelData = [];
    let getVoyageModelData = [];
    var BidStartDateFormat;
    var BidEndDateFormat;
    let ChartNoValue;
    let chartObject = {};

    let sloc;
    let _oDialog1;


    return Controller.extend("com.ingenx.nauti.quotation.controller.ReqForQuotation", {

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


        let oVoyModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oVoyModel, "voydatamodel");
        var oVoyModel2 = this.getOwnerComponent().getModel();
        var oVoyBindList = oVoyModel2.bindList("/xNAUTIxVOYAGEHEADERTOITEM?$expand=toitem");
        oVoyBindList.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getVoyageModelData.push(oContext.getObject());
          });
          oModel.setData(getVoyageModelData);

        }.bind(this));
        console.log("myVoydata", getVoyageModelData);


      },
      loadData: function () {
        var ChartNo = this.getView().byId("CharteringRqNo");
        var ChartNoValue = ChartNo.getValue();
        var obidStartD = this.byId("bidStartD").getValue();
        var obidStartT = this.byId("bidStartT").getValue();
        var obidEndD = this.byId("bidEndD").getValue();
        var obidEndT = this.byId("bidEndT").getValue();

        var filter = getModelData.filter(function (data) {
          return data.Chrnmin === ChartNoValue;
        });


        if (filter.length > 0) {
          var vendorData = filter[0].tovendor;
          console.log("Vendor Data:", vendorData);

          var vendorString = "";
          vendorData.forEach(function (x) {
            vendorString += x.Lifnr + ",";
          });
          console.log("Vendor String:", vendorString);

          var voyData = filter[0].Voyno;
          var voyageNo = voyData;


          var filter2 = getVoyageModelData.filter(function (data) {
            return data.Voyno === voyageNo;
          });

          if (filter2.length > 0) {
            var portdata = filter2[0].toitem;
            console.log("Voyage Data:", portdata);

            var portsByLeg = {};
            var cargsByLeg = {};
            var carguByLeg = {};

            portdata.forEach(function (item, index) {
              if (!portsByLeg.hasOwnProperty(item.Vlegn)) {
                portsByLeg[item.Vlegn] = [];
              }
              portsByLeg[item.Vlegn].push(item.Portc);

              if (!cargsByLeg.hasOwnProperty(item.Vlegn)) {
                cargsByLeg[item.Vlegn] = [];
              }
              cargsByLeg[item.Vlegn].push(item.Cargs);

              if (!carguByLeg.hasOwnProperty(item.Vlegn)) {
                carguByLeg[item.Vlegn] = [];
              }
              carguByLeg[item.Vlegn].push(item.Cargu);


            });
            var CargoUnit = carguByLeg[1]
            var CargoSize = cargsByLeg[1]

            var startPort = portsByLeg[1]
            var midPort = portsByLeg[2]
            var endPort = portsByLeg[3]

            console.log("Cargs for Port1:", CargoUnit);
          }






          var vendorData = filter2[0].tovendor;
          var voyTyp = filter2[0].Voyty;
          var vesselTyp = filter2[0].Carty
          var bidTyp = filter2[0].Bidtype
          console.log("voytypoe", voyTyp);



          var dataToStore = {
            "ChartNoValue": ChartNoValue,
            "obidStartD": obidStartD,
            "obidStartT": obidStartT,
            "obidEndD": obidEndD,
            "obidEndT": obidEndT,
            "vendorData": vendorData,
            "vendorString": vendorString,
            "voyageType": voyTyp,
            "vesselType": vesselTyp,
            "BidType": bidTyp,
            "startPort": startPort,
            "midPort": midPort,
            "endPort": endPort,
            "cargoSize": CargoSize,
            "cargoUnit": CargoUnit

          };
          this.newDataMethod(dataToStore)


          console.log("Stored Data:", dataToStore);
        } else {
          console.log("No data found for ChartNoValue:", ChartNoValue);
        }
      },



      newDataMethod: function (data) {

        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(data);
        this._oDialog1.setModel(oModel, "storedDataModel"); // Use "storedDataModel" instead of "storeDataModel"
        this._oDialog1.getModel("storedDataModel").refresh();
        console.log("get data", this._oDialog1.getModel("storedDataModel")); // Use "storedDataModel" here as well
      },




      requestForQuatation: function () {
        var oView = this.getView();


        if (!this._ochart) {
          this._ochart = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.requestForQuotation", this);
          oView.addDependent(this._ochart);
        }
        this._ochart.open();

      },
      onValueHelpCloseChartering: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("CharteringRqNo").setValue(oSelectedItem.getTitle());
        var loc = this.getView().byId("CharteringRqNo");
        console.log("Final Value", loc);
        sloc = loc.getValue();


        console.log("get model data", getModelData);
        var filter = getModelData.filter(function (data) {

          return data.Voyno === sloc

        })


      },
      onChartSearch: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");

        var oFilter1 = new Filter("Chrnmin", FilterOperator.Contains, sValue1);

        oEvent.getSource().getBinding("items").filter([oFilter1]);
      },
      onSave: function () {
        let oCharteringRqNo = this.byId("CharteringRqNo").getValue();
        let obidStartD = this.byId("bidStartD").getValue();
        console.log("hii", obidStartD);
        let selectedDate = new Date(obidStartD);
        let bidStartdate = selectedDate.toLocaleDateString();
        let hours = selectedDate.getHours();
        let minutes = selectedDate.getMinutes();
        let seconds = selectedDate.getSeconds();
        let bidStarttime = `${hours}:${minutes}:${seconds}`;

        console.log("Date:", bidStartdate);
        console.log("Time:", bidStarttime);
        
        let obidEndD = this.byId("bidEndD").getValue();
        let selectedDate2 = new Date(obidEndD);
        let bidEndtdate = selectedDate2.toLocaleDateString();
        let hour = selectedDate2.getHours();
        let minute = selectedDate2.getMinutes();
        let second = selectedDate2.getSeconds();
        let bidEndtime = `${hour}:${minute}:${second}`;
        console.log("Date:", bidEndtdate);
        console.log("Time:", bidEndtime);
        if (!oCharteringRqNo ) {
          sap.m.MessageBox.error("Please fill chartering No.");
          return;
      }
      if (!obidStartD ) {
        sap.m.MessageBox.error("Please fill Bid Start Date and Time");
        return;
    }
    if (!obidEndD ) {
      sap.m.MessageBox.error("Please fill Bid End Date and Time");
      return;
  }




        

        

        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        var formattedDate = currentDate.toISOString();

        var exchangedatevalidto = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "yyyy-MM-dd" + "'T00:00:00Z'",
        });

        BidStartDateFormat = exchangedatevalidto.format(new Date(bidStartdate));
        BidEndDateFormat = exchangedatevalidto.format(new Date(bidEndtdate));

        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/CharteringSet");

        let aFilter = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, oCharteringRqNo);

        oBindList3.filter(aFilter).requestContexts().then(function (aContexts) {
            aContexts.forEach(function (context) {
                context.setProperty("Chrqsdate", BidStartDateFormat);
                context.setProperty("Chrqstime", bidStarttime);
                context.setProperty("Chrqedate", BidEndDateFormat);
                context.setProperty("Chrqetime", bidEndtime);
            });

            sap.m.MessageBox.success("Data Saved Successfully");
        }).catch(function (error) {
            console.error("Error updating values:", error);
            sap.m.MessageBox.error("Failed to save data.");
        });
        this.getView().byId("sumbit").setEnabled(true);

      },

      onSubmitQuotation: function () {
        var that = this;
        var oView = this.getView();
        if (!that._oDialog1) {
          that._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.requestForQuotationMail", this);
          oView.addDependent(this._oDialog1);
        }
        that._oDialog1.open();
        that.loadData();
      },
      onEmail: function () {

        sap.m.MessageBox.success("Email sent successfully!", {
          title: "Success",
          onClose: function () {
            this.getView().byId("sumbit").setEnabled(false);
            this.oncancell();
            this.onRefresh();
          }.bind(this)
        });
      },

      oncancell: function () {

        this._oDialog1.close();
      },
      onRefresh: function () {
        this.getView().byId("sumbit").setEnabled(false);
        this.byId("CharteringRqNo").setValue("");
        this.byId("bidStartD").setValue("");
        
        this.byId("bidEndD").setValue("");
       

      },
      onDateSelect: function (oEvent) {
        var oDatePicker = oEvent.getSource();
        var sValue = oDatePicker.getValue();
        var oSelectedDate = new Date(sValue);
        var oToday = new Date();

        if (oSelectedDate < oToday) {
          // oDatePicker.setDateValue(oToday);
          oDatePicker.setValue("");
         sap.m.MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        }
      },



    });

  });