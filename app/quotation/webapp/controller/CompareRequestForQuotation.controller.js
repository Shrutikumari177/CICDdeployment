sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/json/JSONModel",
      'sap/ui/core/Fragment',
      'sap/m/MessageBox',
      'sap/m/MessageToast'
  ],
  function(BaseController,Filter,FilterOperator,JSONModel,Fragment,MessageBox,MessageToast) {
    "use strict";
    let sloc;
    let getModelData = [];
    let dataArray = [];
    let charteringsetModel;
    let BidStart;
    let voyagesetModel;
    let oModel;
    let testDataModel;
    let chdata;
    let ChartModel;
    let CharterNumberModel;

    return BaseController.extend("com.ingenx.nauti.quotation.controller.CompareRequestForQuotation", {
      onInit: function() {
        // var that = this;

        oModel = new sap.ui.model.json.JSONModel();
        CharterNumberModel = new sap.ui.model.json.JSONModel();
   var oView = this.getView();

   // Load the JSON file
   $.getJSON("model/data/TestData.json", function(data) {
     let ChartDataArr=data?.TestData
     console.log("ChartNumber",ChartDataArr);
     var uniqueArray = removeDuplicates(ChartDataArr);
     
     CharterNumberModel.setData(uniqueArray)
     oView.setModel(CharterNumberModel,"CharterNumberModel")
     console.log("uniqueArray",oView.getModel("CharterNumberModel"));

       oModel.setData(data);
       chdata = data?.TestData
       oView.setModel(oModel, "testDataModel");
     
   });

   function removeDuplicates(arr) {
     var seen = new Set();
     return arr.filter(item => {
         if (seen.has(item.CharterNumber)) {
             return false;
         } else {
             seen.add(item.CharterNumber);
             return true;
         }
     });
 }
         
      },

      charteringValueHelp: function (oEvent) {
        // var newValue = oEvent?.oSource?.mProperties?.value                
        // console.log("New value entered in charteringNo input field:", newValue);
        var oView = this.getView();

        if (!this._oTankInfomat) {
          this._oTankInfomat = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.quotation.fragments.CharteringNo", this);
          oView.addDependent(this._oTankInfomat);

        }
         // Refresh the binding to ensure data is reloaded
         var oBinding = this._oTankInfomat.getBinding("items");
         oBinding.filter([]);
        
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
        var filterValueData = chdata.filter(obj => obj.CharterNumber === sloc);
        console.log("filterValueData", filterValueData);
        oModel.setData(filterValueData);
        console.log("testDataModel", this.getView().getModel("testDataModel")?.oData);
    
        var btn = this.getView().byId("ButtonInvite");
        btn.setVisible(true);
        var idVoyge = this.getView().byId("idVoyge");
        idVoyge.setVisible(true);
    var compare = this.getView().byId("_IdCompare");
    compare.setVisible(false);
    var invite = this.getView().byId("_IdInvite");
    invite.setVisible(true)
        if (sloc) {
            var oVBox = this.getView().byId("idVbox");
            if (oVBox) {
                oVBox.setVisible(true);
            }
        }
    
        console.log("get model data", getModelData);
        var filter = getModelData.filter(function (data) {
            return data.Voyno === sloc;
        });
    },
      onChartSearch1: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");
    
        var oFilter1 = new Filter("CharterNumber", FilterOperator.Contains, sValue1);
    
        oEvent.getSource().getBinding("items").filter([oFilter1]);
    },

      onSubmitInvite: function () {
        var oTable = this.byId("table");
        var aSelectedItems = oTable.getSelectedItems();
        
        if (aSelectedItems.length === 0) {
            MessageBox.error("Please select at least one row.");
            return;
        }
                      
        var aIneligibleVendors = aSelectedItems.reduce(function (aAccumulator,oItem) {
            var oContext = oItem.getBindingContext("testDataModel");
            if (oContext.getProperty("Eligible") === "No"){
              aAccumulator.push(oContext.getProperty("Vendor"));
            }
            return aAccumulator;
          }, []);

          if (aIneligibleVendors.length > 0) {
            var sVendors = aIneligibleVendors.join(", ");
            MessageBox.error(`You have selected ineligible vendor(s): ${sVendors}.`);
        } else {
          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.SubmitInvite", this);
            this.getView().addDependent(this._oDialog);
     
        // if (!this._oDialog) {
        //     this._oDialog = sap.ui.xmlfragment("com.ingenx.nauti.quotation.fragments.SubmitInvite", this);
        //     this.getView().addDependent(this._oDialog);
        // }
        
    
        // Initialize model data
        var oModel = new sap.ui.model.json.JSONModel({
            BiddingStartDate: null,
            BiddingEndDate: null,
            BiddingStartTime: null,
            BiddingEndTime: null,
            ControllerQuotedValue: "",
            Unit: "TO",
            Mode: "Mode1" // Set default mode if needed
        });
        this._oDialog.setModel(oModel, "addBiddingModel");
      }
        this._oDialog.open();
    }
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
        MessageBox.success("Email send successfully");
      // addBiddingModel.setValue("");

    },
    
    onCancel: function () {
        this._oDialog.close();
    },
    

    onNavigateDetails: function(oEvent) {
      ChartModel=new sap.ui.model.json.JSONModel();
      var oSelectedItem = oEvent.getSource();
      var oBindingContext = oSelectedItem.getBindingContext("testDataModel");
      var selectedData=this.getView().getModel("testDataModel")?.oData;
      var iIndex = oBindingContext.getPath().split("/").pop();
      var SelectedChartData=selectedData[iIndex];
      ChartModel.setData(SelectedChartData);
      this.getView().setModel(ChartModel,"ChartingFilterModel")
      console.log("selectedData",this.getView().getModel("ChartingFilterModel")?.oData);
  
      console.log("Selected Row Index:", SelectedChartData);
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
var oTable = this.byId("table");
var aSelectedItems = oTable.getSelectedItems();
var EnableInvite = aSelectedItems.some(function (oItem) {
    var oContext = oItem.getBindingContext("testDataModel");
    return oContext.getProperty("Eligible") === "Yes";
});

// this.byId("ButtonInvite").setEnabled(EnableInvite);
// this.getView().byId("ButtonInvite").setEnabled(true)

},


onselectBSD:function (oEvent) {
var oDatePicker = oEvent.getSource();
var oSelectedDate = oDatePicker.getDateValue();
var oCurrentDate = new Date();

// Clear time portion of current date for comparison
oCurrentDate.setHours(0, 0, 0, 0);

if (oSelectedDate < oCurrentDate) {
// oDatePicker.setValueState("Error");
oDatePicker.setValue("");
MessageBox.error("Past dates are not allowed. Please select a current or future date.");
} else {
oDatePicker.setValueState("None");
}
},

     
    });
  }
);

