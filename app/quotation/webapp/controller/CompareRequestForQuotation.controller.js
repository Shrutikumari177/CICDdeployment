sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/json/JSONModel",
      'sap/ui/core/Fragment',
      'sap/m/MessageBox'
  ],
  function(BaseController,Filter,FilterOperator,JSONModel,Fragment,MessageBox) {
    "use strict";
    let sloc;
    let getModelData = [];
    let dataArray = [];
    let charteringsetModel;

    return BaseController.extend("com.ingenx.nauti.quotation.controller.CompareRequestForQuotation", {
      onInit: function() {
        var that = this;

        charteringsetModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(charteringsetModel, "charteringsetModel");
 
        let oModel1 = this.getOwnerComponent().getModel();
        let oBindList = oModel1.bindList("/CharteringSet");
 
        oBindList.requestContexts(0,Infinity).then(function (aContexts) {
          // dataArray = [];
          aContexts.forEach(function (oContext) {
            dataArray.push(oContext.getObject());
          });
          // console.log("CharteringSet ",dataArray);
          // CharteringSet.setData(dataArray);
        }).catch(function (error) {
          console.error("Error fetching Chartering no items:", error);
        });
         
      },

      charteringValueHelp: function (oEvent) {
        // var newValue = oEvent?.oSource?.mProperties?.value                
        // console.log("New value entered in charteringNo input field:", newValue);
        var oView = this.getView();

        if (!this._oTankInfomat) {
          this._oTankInfomat = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.CharteringNo", this);
          oView.addDependent(this._oTankInfomat);

        }
        
        this._oTankInfomat.open();

      },
     


onValueHelpClose1: function (oEvent) {
 

        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("charteringNo").setValue(oSelectedItem.getTitle());
        var loc = this.getView().byId("charteringNo")
        sloc = loc.getValue();
        console.log("sloc",sloc);
        // console.log("Final Value", loc);
        // console.log("CharteringSet",dataArray);
        var filterChrValueData=dataArray.filter(obj=>obj.Chrnmin==sloc)
        console.log("filterChrValueData",filterChrValueData);
        charteringsetModel.setData(filterChrValueData)

        console.log("charteringsetModel",this.getView().getModel("charteringsetModel")?.oData);
        // var ChrModel=this.getModel()
        var idVoyge = this.getView().byId("idVoyge");
        idVoyge.setVisible(true);
        var btnIn = this.getView().byId("ButtonInvite");
        btnIn.setVisible(true);
        // var btnRef = this.getView().byId("ButtonRefresh");
        // btnRef.setVisible(true);
        var Compare = this.getView().byId("_IdCompare");
        Compare.setVisible(false);
        var Invite = this.getView().byId("_IdInvite");
        Invite.setVisible(true);

        if (sloc) {
          var oVBox = this.getView().byId("idVbox"); 
          if (oVBox) {
              oVBox.setVisible(true);
          }
      }


        console.log("get model data", getModelData);
        var filter = getModelData.filter(function (data) {

          return data.Voyno === sloc

        })


      },
      onChartSearch1: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");

        var oFilter1 = new Filter("Chrnmin", FilterOperator.Contains, sValue1);

        oEvent.getSource().getBinding("items").filter([oFilter1]);
      },

      onSubmitInvite: function () {
        if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.SubmitInvite", this);
            this.getView().addDependent(this._oDialog);
        }
    
        // Initialize model data
        var oModel = new sap.ui.model.json.JSONModel({
            BiddingStartDate: null,
            BiddingEndDate: null,
            BiddingStartTime: null,
            BiddingEndTime: null,
            ControllerQuotedValue: "",
            Unit: "",
            Mode: "Mode1" // Set default mode if needed
        });
        this._oDialog.setModel(oModel, "addBiddingModel");
    
        this._oDialog.open();
    },
    
    onSave: function () {
        var oModel = this._oDialog.getModel("addBiddingModel");
        var oData = oModel.getData();
    
        // Retrieve data from the model
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
    
        // Close the dialog
        this._oDialog.close();
    
        // Do whatever you want with the data
        console.log("Bidding Start Date:", BiddingStartDate);
        console.log("Bidding End Date:", BiddingEndDate);
        console.log("Bidding Start Time:", BiddingStartTime);
        console.log("Bidding End Time:", BiddingEndTime);
        console.log("Controller Quoted Value:", ControllerQuotedValue);
        console.log("Unit:", Unit);
        console.log("Mode of Bidding:", Mode);
        MessageBox.success("Vendor invite successfully");
    },
    
    onCancel: function () {
        this._oDialog.close();
    },
    

    onNavigateDetails: function() {
      var oView = this.getView();
      if (!this._oDialog1) {
          this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.InviteNegoDetails", this);
          oView.addDependent(this._oDialog1);
  
    
      }
      this._oDialog1.open();
  },
oncancell: function () {
  this._oDialog1.close();
},
onSelectItem: function(){
this.getView().byId("ButtonInvite").setEnabled(true)
}
     
    });
  }
);

