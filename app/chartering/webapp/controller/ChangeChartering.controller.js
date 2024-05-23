
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/m/Token',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

  ],
  function (BaseController, Token, Filter, FilterOperator) {
    "use strict";
    let getModelData = [];
    let getVendorModelData = [];
    let  getChartModelData=[];

    let sloc;
    let ChartNoValue;
    let chartObject = {};
    let jsonModel1 = [];
    return BaseController.extend("com.ingenx.nauti.chartering.controller.ChangeChartering", {
      onInit() {


       

        let oModel2 = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel2, "dataModel2");
        let oModel4 = this.getOwnerComponent().getModel();
        let oBindList4 = oModel4.bindList("/xNAUTIxBusinessPartner1");
        oBindList4.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getVendorModelData.push(oContext.getObject());
          });
          oModel2.setData(getVendorModelData);
        }.bind(this))
        console.log("myvendorData", getVendorModelData)

      },
      loadData: function () {
        getModelData = [];
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        var oModel3 = this.getOwnerComponent().getModel();
        oModel3.refresh();
        var oBindList3 = oModel3.bindList("/xNAUTIxCharteringHeaderItem?$expand=tovendor");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
          oModel.refresh()
        }.bind(this));
        console.log("mydata", getModelData);
      },


      // value help for vendor
      vendorNo: function () {
        var oView = this.getView();


        if (!this._vendorNum) {
          this._vendorNum = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.vendorChartering", this);
          oView.addDependent(this._vendorNum);
        }
        this._vendorNum.open();

      },
      onValueHelpClose: function (evt) {
        var aSelectedItems = evt.getParameter("selectedItems"),
          oMultiInput = this.byId("VendorNo"),
          oTokens = oMultiInput.getTokens(),
          existingValues = oTokens.map(function (token) { return token.getText(); }),

          that = this;
        var oTable = this.byId("myTable");

        if (aSelectedItems && aSelectedItems.length > 0) {
          aSelectedItems.forEach(function (oItem) {
            var selectedValue = oItem.getTitle();

            if (!existingValues.includes(selectedValue)) {
              oMultiInput.addToken(new Token({
                text: selectedValue
              }));
              console.log("Selected Item Text:", selectedValue);
            }
          });

          var selectedVendorData = [];

          aSelectedItems.forEach(function (oItem) {
            var selectedValue = oItem.getTitle();
            getVendorModelData.forEach(function (vendorData) {
              if (vendorData.Lifnr === selectedValue) {
                console.log("matched", vendorData.Lifnr, selectedValue);
                console.log("vendorData:", vendorData);
                selectedVendorData.push(vendorData);
                console.log("Vendor Data for All Selected Values:", selectedVendorData);
                that.updateVendorModel(selectedVendorData);
              }
            });
          });
        }
      },


      updateVendorModel: function (vendorData) {
        var existingData = jsonModel1.getData() || [];

        // If there is no existing data, directly set the JSON model with the new data
        if (existingData.length === 0) {
          jsonModel1.setData(vendorData);
        } else {
          // Check for duplicates and add only new vendor data
          vendorData.forEach(function (newVendor) {
            var isDuplicate = existingData.some(function (existingVendor) {
              return existingVendor.Lifnr === newVendor.Lifnr;
            });

            if (!isDuplicate) {
              existingData.push(newVendor);
            }
          });

          // Update the JSON model with the updated data
          jsonModel1.setData(existingData);
        }

        // Refresh the JSON model
        jsonModel1.refresh();
        // Show the table
        this.byId("myTable").setVisible(true);
      },


      onTokenUpdate: function (oEvent) {
        var aRemovedTokens = oEvent.getParameter("removedTokens");
        if (aRemovedTokens && aRemovedTokens.length > 0) {
          aRemovedTokens.forEach(function (oToken) {
            var sRemovedValue = oToken.getText();
            console.log("Removed token value:", sRemovedValue);

            var oTableData = this.getView().getModel("vendorModel1").getData();
            var foundIndex = null;
            for (var i = 0; i < oTableData.length; i++) {
              if (oTableData[i].Lifnr === sRemovedValue) {
                foundIndex = i;
                break;
              }
            }

            if (foundIndex !== null) {
              console.log("Matching value found in table at index:", foundIndex);

              oTableData.splice(foundIndex, 1);

              this.getView().getModel("vendorModel1").setData(oTableData);
              console.log("Row removed from table.");
            } else {
              console.log("No matching value found in the table.");
            }
          }.bind(this));
        }
      },
      onVendorHelpSearch: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");

        var oFilter1 = new Filter("Lifnr", FilterOperator.Contains, sValue1);

        oEvent.getSource().getBinding("items").filter([oFilter1]);
      },


      charteringValueHelp: function () {
        if (!this._CharteringDialog) {
          this._CharteringDialog = sap.ui.xmlfragment(
            "com.ingenx.nauti.chartering.fragments.valueHelpChartering",
            this
          );
          this.getView().addDependent(this._CharteringDialog);
        }
        this.loadData(); // Call the function to load data
        this._CharteringDialog.open();
      },

      onCharteringValueHelpClose: function (oEvent) {

        var oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("charteringNo").setValue(oSelectedItem.getTitle());
        var ChartNo = this.getView().byId("charteringNo");
        ChartNoValue = ChartNo.getValue();

        var filter = getModelData.filter(function (data) {
          return data.Chrnmin === ChartNoValue
        })

        var VoyNamedata = filter[0].Voynm
        console.log(filter[0]);
        chartObject = structuredClone(filter[0]);
        var ExtChartNodata = filter[0].Chrnmex
        var VoyNoData = filter[0].Voyno
        var CreationDateData = filter[0].Chrcdate
        var CreationTimeData = filter[0].Chrctime
        var BidStartDateData = filter[0].Chrqsdate
        var BidStartTimeData = filter[0].Chrqstime
        var BidEndDateData = filter[0].Chrqedate
        var BidEndTimeData = filter[0].Chrqetime
        var PurchaseOrgData = filter[0].Chrporg
        var PurchaseGroupData = filter[0].Chrpgrp
        var PaymentTermData = filter[0].Chrpayt
        var vendorData = filter[0].tovendor
        let vandorString = "";

        vendorData.forEach(x => {
          vandorString += x.Lifnr + ",";
        });
        console.log(vandorString);
        let LifnrArr = vandorString.split(",");
        console.log(("hfshd", LifnrArr));

        var VoyageName = this.getView().byId("voyname").setValue(VoyNamedata);
        var ExChartingNo = this.getView().byId("chartExt").setValue(ExtChartNodata);
        var ExChartingNo = this.getView().byId("chartExt").setValue(ExtChartNodata);
        var VoyageNo = this.getView().byId("VoyageNo").setValue(VoyNoData);
        var CreationDate = this.getView().byId("creationDate").setValue(CreationDateData);
        var CreationTime = this.getView().byId("creationTime").setValue(CreationTimeData);
        // var BidStartDate = this.getView().byId("bidStartDate").setValue(BidStartDateData);
        // var BidStartTime = this.getView().byId("bidSTime").setValue(BidStartTimeData);
        // var BidEndDate = this.getView().byId("bidEndDate").setValue(BidEndDateData);
        // var BidEndTime = this.getView().byId("bidEndTime").setValue(BidEndTimeData);
        var PurchaseOrg = this.getView().byId("PurchaseOrg").setValue(PurchaseOrgData);
        var PurchaseGroup = this.getView().byId("PurchaseGroup").setValue(PurchaseGroupData);
        var PaymentTerm = this.getView().byId("PaymentTerm").setValue(PaymentTermData);
        var VendorNo = this.getView().byId("VendorNo");
        VendorNo.removeAllTokens();
        var vendorArray = vandorString.split(',');
        vendorArray.forEach(function (value) {
          if (value.trim() !== "") { // Check if the value is not empty or just whitespace
            VendorNo.addToken(new sap.m.Token({ key: value, text: value }));
          }
        });

        jsonModel1 = new sap.ui.model.json.JSONModel();
        this.getView().setModel(jsonModel1, "vendorModel1")
        var oTable = this.byId("myTable");
        var IconTabBar = this.byId("IconTabBar");
        var Vendorarray = [];

        getVendorModelData.forEach(x => {
          LifnrArr.forEach(lifnr => {

            if (x.Lifnr === lifnr) {
              // console.log("matched", x.Lifnr, vandorString);
              console.log("datA", x);
              Vendorarray.push(x)
            }

          })
        });
        jsonModel1.setData(Vendorarray);
        jsonModel1.refresh()
        let myMatcheddata = jsonModel1.getData();
        console.log(myMatcheddata);
        this.getView().getModel("vendorModel1").refresh();
        console.log(this.getView().getModel('vendorModel1').getData());


        IconTabBar.setVisible(true);
        oTable.setVisible(true);





      },

      onChartSearch: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");

        var oFilter1 = new Filter("Chrnmin", FilterOperator.Contains, sValue1);

        oEvent.getSource().getBinding("items").filter([oFilter1]);
      },

      onSaveChartering: function () {
        let that = this;
        let oChrmin = this.byId("charteringNo").getValue();
        let oVoyno = this.byId("VoyageNo").getValue();
        let oVendorString = this.byId('VendorNo').getProperty("_semanticFormValue");
        let ochatExt = this.byId("chartExt").getValue();
        let oDate = this.byId("creationDate").getValue();
        let oTime = this.byId("creationTime").getValue();
        let oPurchaseGr = this.byId("PurchaseGroup").getValue();
        let oPurchaseOr = this.byId("PurchaseOrg").getValue();
        let oPaymentTerm = this.byId("PaymentTerm").getValue();
        let oVoynm = this.byId("voyname").getValue();
     
        if (!oChrmin) {
          sap.m.MessageToast.show("Please enter Charting No.");
          return;
        }

        console.log("chartering:", oChrmin);
        console.log("VoyageNo:", oVoyno);
        console.log("VendorNo:", oVendorString);
        console.log("chartExt:", ochatExt);

        let oVendorArray = [];
        if (oVendorString) {
          let vendors = oVendorString.split(",");
          vendors.forEach(function (vendor) {
            oVendorArray.push({ "Lifnr": vendor.trim(), "Voyno": oVoyno });
          });
        }
        console.log("array of vendors:", oVendorArray);

        var oBindListSP = that.getView().getModel().bindList("/xNAUTIxCharteringHeaderItem");

        try {
          oBindListSP.create({
            "Chrnmin": oChrmin,
            "tovendor": oVendorArray,

            "tocharteringasso": {
              "Chrnmin": oChrmin,
              "Chrnmex": ochatExt,
              "Chrcdate": oDate,
              "Chrctime": oTime,
              "Chrqsdate": null,
              "Chrqstime": null,
              "Chrqedate": null,
              "Chrqetime": null,
              "Chrqdate": oDate,
              "Chrporg": oPurchaseOr,
              "Chrpgrp": oPurchaseGr,
              "Chrpayt": oPaymentTerm,
              "Voyno": oVoyno,
              "Voynm": oVoynm,

              "Zdelete": true,
            }
          });
          console.log("created............");
          sap.m.MessageToast.show("Data saved successfully");
          this.loadData();

          that.getOwnerComponent().getModel().refresh();
          that.getView().getModel("vendorModel1").refresh();
        } catch (error) {
          console.error("Error while saving data:", error);
          sap.m.MessageToast.show("Error while saving data");
        }
      },
     
    
    
      onSendForApproval: function(){
        let  ApprovalNo =[];
        let that = this;
        let oChrmin = this.byId("charteringNo").getValue();
        if (!oChrmin) {
          sap.m.MessageToast.show("Please enter Charting No");
          return;
        }
        var oBindListSP = that.getView().getModel().bindList("/chartapprSet");
        try {
          var saveddata = oBindListSP.create({
            "Creqno": "",
            "Chrnmin": oChrmin
          });
          console.log("saving data:",saveddata);
         
          oBindListSP.requestContexts(0, Infinity).then(function (aContexts) {
            aContexts.forEach(function (oContext) {
              if(oContext.getObject().Chrnmin === oChrmin){

                ApprovalNo.push(oContext.getObject());
              }
            });
            let appNo = ApprovalNo[0].Creqno;
            console.log(appNo);
            sap.m.MessageToast.show(`chartering Approval no. ${appNo}  created successfully`);
          })
         
        
        } catch (error) {
          console.error("Error while saving data:", error);
          sap.m.MessageToast.show("Error while saving data");
        }


      },
     
      
      onCancelChartering: function () {
        const chartNoValue = this.getView().byId("charteringNo").getValue(); // Assuming you have an input field for ChartNo
        if (!chartNoValue) {
          sap.m.MessageToast.show("Please enter ChartingNo");
          return;
        }

        const that = this;
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure you want to delete?", {
            title: "Confirm",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                that.deleteCharteringSet(chartNoValue);
              } else {
                sap.m.MessageToast.show("Deletion canceled");
              }
            }
          }
          );
        });
      },
      deleteCharteringSet: function (chartNoValue) {
       let that = this;
        let oModel = this.getOwnerComponent().getModel();
        let oBindList = oModel.bindList("/CharteringSet");
        oBindList.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getChartModelData.push(oContext.getObject());
            if( oContext.getObject().Chrnmin === chartNoValue){

              oContext.delete();
             
              sap.m.MessageToast.show("Entry with  '" + chartNoValue + "' deleted successfully from CharteringSet");
              that.onRefresh();

            }
          });
         
        }.bind(this))
       
      },


      onRefresh: function () {
        var oIcontab = this.byId("IconTabBar").setVisible(false)
        this.byId("charteringNo").setValue("");
        this.byId("chartExt").setValue("");
        this.byId("VoyageNo").setValue("");
        this.byId("VendorNo").setValue("");

        var multiInput = this.byId("VendorNo");
        multiInput.removeAllTokens();
        this.byId("voyname").setValue("");
        this.byId("creationDate").setValue("");
        this.byId("creationTime").setValue("");
        // this.byId("bidStartDate").setValue("");
        // this.byId("bidSTime").setValue("");
        // this.byId("bidEndDate").setValue("");
        // this.byId("bidEndTime").setValue("");
        this.byId("PurchaseOrg").setValue("");
        this.byId("PurchaseGroup").setValue("");
        this.byId("PaymentTerm").setValue("");

        var oTable = this.byId("myTable");
        oTable.setVisible(false);
       


      }
      ,



    });
  }
);