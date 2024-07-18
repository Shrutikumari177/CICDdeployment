
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/m/Token',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (BaseController, Token, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";
    let getModelData = [];
    let getModelData2 = [];
    let getModelData3 = [];
    let getModelData4 = [];
    let getChartModelData = [];
    let sloc;
    return BaseController.extend("com.ingenx.nauti.chartering.controller.CreateChartering", {
      onInit() {

        this.setCreationDateTime();

        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/xNAUTIxBusinessPartner1");
        let oBindList4 = oModel3.bindList("/xNAUTIxpurchGroup");
        let oBindList5 = oModel3.bindList("/xNAUTIxCHARTPURCHASEITEM");
        let oBindList6 = oModel3.bindList("/xNAUTIxpaymTerm")

        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
        }.bind(this))
        console.log("mydata", getModelData)

        oBindList4.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData2.push(oContext.getObject());
          });
          oModel.setData(getModelData2);
        }.bind(this))
        console.log("mydata", getModelData2)

        oBindList5.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData3.push(oContext.getObject());
          });
          oModel.setData(getModelData3);
        }.bind(this))
        console.log("mydata", getModelData3)

        oBindList6.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData4.push(oContext.getObject());
          });
          oModel.setData(getModelData4);
        }.bind(this))
        console.log("mydata", getModelData4)
      },


      setCreationDateTime: function () {
        var currentDate = new Date().toISOString().split('T')[0];
        var currentTime = new Date().toTimeString().split(' ')[0];

        this.byId("Input3").setValue(currentDate);
        this.byId("Input5").setValue(currentTime);
      },

      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteTransactionDashboard");
      },





      onTokenUpdate: function (oEvent) {
        var aRemovedTokens = oEvent.getParameter("removedTokens");
        if (aRemovedTokens && aRemovedTokens.length > 0) {
          aRemovedTokens.forEach(function (oToken) {
            var sRemovedValue = oToken.getKey();
            console.log("Removed token value:", sRemovedValue);

            var oTableData = this.getView().getModel("vendorModel").getData();
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

              this.getView().getModel("vendorModel").setData(oTableData);
              console.log("Row removed from table.");
            } else {
              console.log("No matching value found in the table.");
            }
          }.bind(this));
        }
      },

      onNavigateDetails: function (oEvent) {
       
        const oContext = oEvent.getSource().getBindingContext("vendorModel");
        const rowData = oContext.getObject();
        let oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(rowData);

        var oView = this.getView();
        if (!this._oDialog2) {
          this._oDialog2 = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.vendorDetails", this);
          oView.addDependent(this._oDialog2);
        }


        this._oDialog2.setModel(oModel, "vendorDetail");
        console.log("fragment model data", this._oDialog2.getModel("vendorDetail").getData())
        this._oDialog2.open();
      },


      oncancell: function () {
        this._oDialog2.close();
      },

      vendorNo: function () {
        var oView = this.getView();

        if (!this._oTankInfomate) {
          this._oTankInfomate = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.vendorChartring", this);
          oView.addDependent(this._oTankInfomate);
        }
        this._oTankInfomate.open();

      },
      onValueHelpClose: function (evt) {
       
        var oMultiInput = this.byId("VendNo");
        var aSelectedItems = evt.getParameter("selectedItems"),
          oVBox = this.byId("tab"),
          aSelectedVendorIDs = [];

        var oModel = this.getView().getModel("vendorModel");
        var aExistingData = oModel ? oModel.getData() : [];

        if (!oModel) {
          oModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel, "vendorModel");
        }

        var aExistingTokens = oMultiInput.getTokens();

        if (aSelectedItems && aSelectedItems.length > 0) {
          aSelectedItems.forEach(function (oItem) {
            var sVendorID = oItem.getBindingContext().getObject().Lifnr;
            if (!aSelectedVendorIDs.includes(sVendorID)) {
              aSelectedVendorIDs.push(sVendorID);
            }
          });

          // Remove duplicates from the selected vendor IDs
          aSelectedVendorIDs = Array.from(new Set(aSelectedVendorIDs));

          aSelectedVendorIDs.forEach(function (sVendorID) {
            if (!aExistingTokens.some(function (oToken) {
              return oToken.getKey() === sVendorID;
            })) {
              oMultiInput.addToken(new sap.m.Token({
                key: sVendorID,
                text: sVendorID
              }));
            }
          });

          oVBox.setVisible(true);

          var aFilteredData = getModelData.filter(function (data) {
            return aSelectedVendorIDs.includes(data.Lifnr);
          });

          var aCombinedData = aExistingData.concat(aFilteredData);

          aCombinedData = aCombinedData.filter((entry, index, self) =>
            index === self.findIndex((t) => (
              t.Lifnr === entry.Lifnr
            ))
          );
          oModel.setData(aCombinedData);

          console.log("Filtered data based on selected vendors:", aFilteredData);
        } else {

          oVBox.setVisible(false);
        }
        var oTable = this.byId("myTable")
        oTable.setVisible(true);
        console.log(aSelectedVendorIDs, "yhi ha")
      },

      onCancelValueHelp: function (oEvent) {
        var oDialog = oEvent.getSource();
        var oBinding = oDialog.getBinding("items");

        // Clear any filters
        oBinding.filter([]);
        
        // Clear search field
        oDialog.getModel().setProperty("/searchValue", "");

        // Clear all selections
        oDialog.unselectAll();
        
        // Reset the items aggregation
        oBinding.refresh(true);

        oDialog.close();
      },



      voyageNo: function () {
        var oView = this.getView();


        if (!this._oTankInfomat) {
          this._oTankInfomat = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.voyageChartering", this);
          oView.addDependent(this._oTankInfomat);
        }
        this.byId("VendNo").setEnabled(true)

        this._oTankInfomat.open();

      },
      onValueHelpClosevoy: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("voyNO").setValue(oSelectedItem.getTitle());
        this.byId("voyname").setValue(oSelectedItem.getDescription());
        var loc = this.getView().byId("voyNO");
        console.log("Final Value", loc);
        sloc = loc.getValue();
        console.log("voy no", sloc);

        console.log("get model data", getModelData);
        var filter = getModelData.filter(function (data) {

          return data.Voyno === sloc

        })

      },
      handleNav: function (evt) {
        var navCon = this.byId("navCon");
        var target = evt.getSource().data("target");
        if (target) {
          var animation = this.byId("animationSelect").getSelectedKey();
          navCon.to(this.byId(target), animation);
        } else {
          navCon.back();
        }
      },
      navigateToPanel: function (panelId) {
        var navCon = this.byId("navCon2");
        navCon.to(this.byId(panelId));
      },
      populateInputField: function (inputField, selectedValue) {
        inputField.setValue(selectedValue);
      },



      convertToDateTimeOffset: function (dateStr) {

        const date = new Date(dateStr);

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed
        const day = ('0' + date.getDate()).slice(-2);

        const hours = '00';
        const minutes = '00';
        const seconds = '00';
        const milliseconds = '000';

        const finalStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+05:30`; // Example offset, adjust as needed

        return finalStr;
      },

      purchaseGroupValueHelp: function () {
        var oView = this.getView();


        if (!this._opurchaseGroup) {
          this._opurchaseGroup = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.purchaseGroup", this);
          oView.addDependent(this._opurchaseGroup);
        }
        this._opurchaseGroup.open();

      },
      onPurchaseGroupValueHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("PurchaseGroup").setValue(oSelectedItem.getTitle());

      },

      purchaseOrgValueHelp: function () {
        var oView = this.getView();


        if (!this._opurchaseOrg) {
          this._opurchaseOrg = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.purchaseOrg", this);
          oView.addDependent(this._opurchaseOrg);
        }
        this._opurchaseOrg.open();

      },
      onPurchaseOrgValueHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("PurchaseOrg").setValue(oSelectedItem.getTitle());

      },

      paymentTermValueHelp: function () {
        var oView = this.getView();


        if (!this._oPaymentTerm) {
          this._oPaymentTerm = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.paymentTerm", this);
          oView.addDependent(this._oPaymentTerm);
        }
        this._oPaymentTerm.open();

      },
      onPaymentTermValueHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");

        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("PaymentTerm").setValue(oSelectedItem.getTitle());

      },
      onRefresh: function () {
        // Clear input fields
        this.byId("chatExt").setValue("");
        this.byId("voyNO").setValue("");
        var multiInput = this.byId("VendNo");
        multiInput.removeAllTokens();
        this.byId("voyname").setValue("");
        this.byId("PurchaseOrg").setValue("");
        this.byId("PurchaseGroup").setValue("");
        this.byId("PaymentTerm").setValue("");
        this.byId("Save").setEnabled(true); // Enable Save button
        this.byId("Refresh").setEnabled(true); // Enable Refresh button
        
        // Hide table and container
        var oTable = this.byId("myTable");
        oTable.setVisible(false);
        var oVBox = this.byId("tab");
        oVBox.setVisible(false);
        this.byId("VendNo").setEnabled(false)
    
        // Clear the vendor model data
        var oVendorModel = this.getView().getModel("vendorModel");
        if (oVendorModel) {
            oVendorModel.setData([]);
        }
    },
    



      onValueHelpSearch: function (oEvent) {
        
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.Contains, sValue1);
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
    
        oBinding.filter([oFilter1]);
    
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },
      onValueHelpSearchvendor: function (oEvent) {
        
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sValue1);
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
    
        oBinding.filter([oFilter1]);
    
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },
      onPurchaseGroupSearch: function (oEvent) {
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Ekgrp", sap.ui.model.FilterOperator.Contains, sValue1);
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
    
        oBinding.filter([oFilter1]);
    
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },
   
      onPaymentTermSearch: function(oEvent){
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Paytrm", sap.ui.model.FilterOperator.Contains, sValue1);
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
    
        oBinding.filter([oFilter1]);
    
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },
   
      onPurchaseOrgSearch: function(oEvent){
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Ekorg", sap.ui.model.FilterOperator.Contains, sValue1);
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
    
        oBinding.filter([oFilter1]);
    
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
        },


      onSaveCh: async function () {
        
    
        
        let oDate = this.byId("Input3").getValue();
        let oTime = this.byId("Input5").getValue();
        let oVoynm = this.byId("voyname").getValue();
        let oVoyno = this.byId("voyNO").getValue();
        let oVendorString = this.byId('VendNo').getProperty("_semanticFormValue");
        let ochatExt = this.byId("chatExt").getValue();
        let oPurchaseGr = this.byId("PurchaseGroup").getValue();
        let oPurchaseOr = this.byId("PurchaseOrg").getValue();
        let oPaymentTerm = this.byId("PaymentTerm").getValue();
        let formatedDate = this.convertToDateTimeOffset(oDate);
    
        let isExistFlag = false;
        let that = this;
    
       
        let extractData = getModelData2.filter(item => item.Ekgrp === oPurchaseGr).map(item => item.Eknam).join(', ');
        let extractData2 = getModelData3.filter(item => item.Ekorg === oPurchaseOr).map(item => item.Ekotx).join(', ');
        let extractData3 = getModelData4.filter(item => item.Paytrm === oPaymentTerm).map(item => item.Paytrmtxt).join(', ');
    
        console.log(oDate, oVoynm, oVoyno, oVendorString, oPurchaseGr, oPurchaseOr, ochatExt, oTime);
    
       
        let oVendorArray = [];
        if (oVendorString) {
            let vendors = oVendorString.split(",");
            vendors.forEach(vendor => oVendorArray.push({ "Lifnr": vendor.trim(), "Voyno": oVoyno }));
        }
        console.log("array of vendors", oVendorArray);
    
       
        if (!oVoyno) {
            sap.m.MessageToast.show("Please enter a Voyage Number");
            return;
        }
    
        if (!ochatExt) {
            sap.m.MessageToast.show("Please enter an External chartering number");
            return;
        }
    
        if (!(/^\d+$/.test(ochatExt))) {
            sap.m.MessageToast.show("Please enter only numeric values in the External chartering number field");
            return;
        }
    
        if (oVendorArray.length === 0) {
            sap.m.MessageToast.show("Please select at least one Vendor");
            return;
        }
    
        if (!oPurchaseOr) {
            sap.m.MessageToast.show("Please enter a Purchase Organization");
            return;
        }
        if (!oPurchaseGr) {
          sap.m.MessageToast.show("Please enter a Purchase Group");
          return;
      }
    
        if (!oPaymentTerm) {
            sap.m.MessageToast.show("Please enter a Payment Term");
            return;
        }
    
       
        let payload = {
            "Chrnmin": "",
            "tovendor": oVendorArray,
            "tocharteringasso": {
                "Chrnmin": "",
                "Chrnmex": ochatExt,
                "Chrcdate": oDate,
                "Chrctime": oTime,
                "Chrqsdate": null,
                "Chrqstime": null,
                "Chrqedate": null,
                "Chrqetime": null,
                "Chrqdate": null,
                "Chrporg": oPurchaseOr,
                "Chrporgn": extractData2,
                "Chrpgrp": oPurchaseGr,
                "Chrpgrpn": extractData,
                "Chrexcr": null,
                "Chrpayt": oPaymentTerm,
                "Chrpaytxt": extractData3,
                "Chrinco": null,
                "Chrincodis": null,
                "Chrincol": null,
                "Cimater": null,
                "Cimatdes": null,
                "Ciqty": null,
                "Ciuom": null,
                "Voyno": oVoyno,
                "Voynm": oVoynm,
                "Chrven": null,
                "Chrvenn": null,              
                "Ciprec": null,
                "Zdelete": false,
                "RefChrnmin": null
            }
        };
    
        let oBusyDialog = new sap.m.BusyDialog();
        oBusyDialog.open();
        let checkforExistingCharteringRes = await this.checkforExistingChartering(oVoyno);
        if(checkforExistingCharteringRes.length > 0 ){
          let chrnmin = checkforExistingCharteringRes[0].Chrnmin;
          sap.m.MessageBox.warning (`${chrnmin} Chartering No. already created against Voyage : ${oVoyno}`  );
          oBusyDialog.close();
          return;
        }
        
    
        try {
            let oModel = this.getView().getModel();
            let oListBinding = oModel.bindList("/xNAUTIxCharteringHeaderItem");
    
            oListBinding.attachEvent("createCompleted", this.onCreateCompleted, this);
    
            let oContext = oListBinding.create(payload, false, false, false);
    
            await oContext.created();
    
        } catch (oError) {
            sap.m.MessageToast.show("Entity creation failed: " + oError.message);
        } finally {
            oBusyDialog.close();
        }
    },
    
    onCreateCompleted: function (oEvent) {
        let oParameters = oEvent.getParameters();
        let oContext = oParameters.context;
        let charminNum = oContext.sPath.replace(/\D+/g, '');
        let bSuccess = oParameters.success;
    
        if (bSuccess) {
          console.log("oParameters", oParameters);
          console.log("oContext", oContext.sPath);
          console.log("bSuccess", bSuccess);
        	MessageBox.success(`Chartering created successfully with Charmin No.: ${charminNum}`);
        } else {
          MessageBox.error(`Failed to create chartering`);
        }
    },

   
      checkforExistingChartering: async function (oVoyno) {
        let rModel = this.getOwnerComponent().getModel();
        let filters = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, oVoyno);
        let oBindList = await rModel.bindList("/xNAUTIxCharteringHeaderItem", undefined, undefined, [filters]);
        
        let getChartModelData = [];
        
        let oBindListResp = await oBindList.requestContexts(0, Infinity).then(function (aContexts) {
            aContexts.forEach(function (oContext) {
                let oData = oContext.getObject();
               
                if (oData.Zdelete===false) {
                    getChartModelData.push(oData);
                }
                if(oData.Zdelete===true){
                  getChartModelData = []
                }
            });
        }).catch(function (error) {
            console.error("Error while checking existing chartering:", error);
            sap.m.MessageToast.show("Error while checking existing chartering");
        });
        
        console.log("oBindListResp ", oBindListResp);
        console.log("getChartModelData ", getChartModelData);
        
        return getChartModelData;
    }
    


    });
  })




