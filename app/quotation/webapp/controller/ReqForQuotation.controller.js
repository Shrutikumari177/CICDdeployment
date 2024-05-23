

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
    var BidStartDateFormat;
    var BidEndDateFormat;

    let sloc;

    return Controller.extend("com.ingenx.nauti.quotation.controller.ReqForQuotation", {

      onInit: function () {

      },


      requestForQuatation: function () {
        var oView = this.getView();


        if (!this._oTankInfomat) {
          this._oTankInfomat = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.requestForQuotation", this);
          oView.addDependent(this._oTankInfomat);
        }
        this._oTankInfomat.open();

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
      onSubmitQuotation: function () {


        let oCharteringRqNo = this.byId("CharteringRqNo").getValue();
        let obidStartD = this.byId("bidStartD").getValue();
        console.log("obidStartD", obidStartD)
        let obidStartT = this.byId("bidStartT").getValue();
        console.log("obidStartT" , obidStartT)
        let obidEndD = this.byId("bidEndD").getValue();
        let obidEndT = this.byId("bidEndT").getValue();

        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        var formattedDate = currentDate.toISOString();
        
        var exchangedatevalidto = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "yyyy-MM-dd" + "'T00:00:00Z'", 
        });
        
        BidStartDateFormat = exchangedatevalidto.format(new Date(obidStartD));
        BidEndDateFormat = exchangedatevalidto.format(new Date(obidEndD));
        
        console.log(BidStartDateFormat); 
        console.log(BidEndDateFormat); 

        console.log("formattedDate2", BidStartDateFormat, BidEndDateFormat)

        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/CharteringSet");
        console.log("oBindList3", oBindList3);

        let aFilter = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, oCharteringRqNo);

        oBindList3.filter(aFilter).requestContexts().then(function (aContexts) {
          aContexts.forEach(function (context) {
            context.setProperty("Chrqsdate", BidStartDateFormat);
            context.setProperty("Chrqstime", obidStartT);
            context.setProperty("Chrqedate", BidEndDateFormat);
            context.setProperty("Chrqetime", obidEndT);
          });
          sap.m.MessageToast.show("Data saved successfully");
        }).catch(function (error) {
          console.error("Error updating values:", error);
        });

        console.log("oBindList3", oBindList3);

      },

    });

  });