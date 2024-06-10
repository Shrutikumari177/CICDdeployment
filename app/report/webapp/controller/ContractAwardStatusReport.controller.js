
sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/MessageBox",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/core/Fragment"
    ],
    function (BaseController, MessageBox, JSONModel, Filter, FilterOperator,Fragment) {
      "use strict";
      let getModelData = [];
      let jsonModel1 = [];
      let VoyageNo;
      let ChartNoValue;
  
      return BaseController.extend("com.ingenx.nauti.report.controller.ContractAwardStatusReport", {
        onInit() {
  
          let oModel2 = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel2, "dataModel2");
          let oModel4 = this.getOwnerComponent().getModel();
          let oBindList4 = oModel4.bindList("/xNAUTIxVENFBIDPOST");
          oBindList4.requestContexts(0, Infinity).then(function (aContexts) {
            aContexts.forEach(function (oContext) {
              getModelData.push(oContext.getObject());
            });
            oModel2.setData(getModelData);
          }.bind(this))
          console.log("myvendorData", getModelData)
  
        },
        // onCharteringNumber: function () {
        //   if (!this._valueHelpDialog) {
        //     this._valueHelpDialog = sap.ui.xmlfragment(
        //       "com.ingenx.nauti.report.fragments.valueHelpCharteringReqNo",
        //       this
        //     );
        //     this.getView().addDependent(this._valueHelpDialog);
        //   }
  
        //   this._valueHelpDialog.open();
        // },
        onCharteringNumber: function () {
          var oView = this.getView();
  
  
          if (!this._ocharting) {
            this._ocharting = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.report.fragments.valueHelpCharteringReqNo", this);
            oView.addDependent(this._ocharting);
          }
          this._ocharting.open();
  
        },
        onCharteringValueHelpClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
  
          oEvent.getSource().getBinding("items").filter([]);
  
          if (!oSelectedItem) {
            return;
          }
          this.byId("CharteringRqNo").setValue(oSelectedItem.getTitle());
          var ChartNo = this.getView().byId("CharteringRqNo");
          ChartNoValue = ChartNo.getValue();
  
          var filter = getModelData.filter(function (data) {
            return data.Chrnmin === ChartNoValue
          })
          var VoyNamedata = filter[0].Voyno
          var chartObject = structuredClone(filter[0]);
          jsonModel1 = new sap.ui.model.json.JSONModel();
          this.getView().setModel(jsonModel1, "contractAwardModel")
          jsonModel1.setData([chartObject]);
          console.log("ghkdg",this.getView().getModel('contractAwardModel').getData());
          
          
         
  
        },
        onChartSearch: function (oEvent) {
          var sValue1 = oEvent.getParameter("value");
  
          var oFilter1 = new Filter("Chrnmin", FilterOperator.Contains, sValue1);
  
          oEvent.getSource().getBinding("items").filter([oFilter1]);
        },
        onNavigateDetails: function(oEvent) {
          
          let oSource = oEvent.getSource();
          let data = oSource.getBindingContext("contractAwardModel").getObject();
          let tempModel = new sap.ui.model.json.JSONModel();
          tempModel.setData([data]);
          var oView = this.getView();
          if (!this._oDialog1) {
              this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.report.fragments.contractAwardDetails", this);
              oView.addDependent(this._oDialog1);
     
       
          }
          this._oDialog1.setModel(tempModel,"contractAwardReport1")
          this._oDialog1.open();
        },
      
      
      oncancell: function () {
        this._oDialog1.close();
      },
  
  
      });
    }
  );