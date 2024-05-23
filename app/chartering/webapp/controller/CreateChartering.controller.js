
 
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/m/Token',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (BaseController, Token, MessageBox, MessageToast,Filter,  FilterOperator) {
    "use strict";
    let getModelData = [];
    let getModelData2 = [];
    let getModelData3 = [];
    let getModelData4 = [];
    let getChartModelData=[];
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
        console.log("mydata",getModelData2)
 
        oBindList5.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData3.push(oContext.getObject());
          });
          oModel.setData(getModelData3);
        }.bind(this))
        console.log("mydata",getModelData3)
 
        oBindList6.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData4.push(oContext.getObject());
          });
          oModel.setData(getModelData4);
        }.bind(this))
        console.log("mydata",getModelData4)
      },
   
 
      setCreationDateTime: function () {
        // Get current date and time
        var currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        var currentTime = new Date().toTimeString().split(' ')[0]; // Format: HH:MM:SS
 
        // Set the values to the respective Input fields
        this.byId("Input3").setValue(currentDate); // Set current date
        this.byId("Input5").setValue(currentTime); // Set current time
      },
 
      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteTransactionDashboard");
      },
 
   
 
  onTokenUpdate: function(oEvent) {
    var aRemovedTokens = oEvent.getParameter("removedTokens");
    if (aRemovedTokens && aRemovedTokens.length > 0) {
        aRemovedTokens.forEach(function(oToken) {
            var sRemovedValue = oToken.getKey(); // Assuming you want to retrieve the key of the removed token
            console.log("Removed token value:", sRemovedValue);
           
            // Iterate through the table data to find the matching value
            var oTableData = this.getView().getModel("vendorModel").getData(); // Assuming your table data model is named "vendorModel"
            var foundIndex = null;
            for (var i = 0; i < oTableData.length; i++) {
                if (oTableData[i].Lifnr === sRemovedValue) {
                    foundIndex = i;
                    break;
                }
            }
 
            if (foundIndex !== null) {
                console.log("Matching value found in table at index:", foundIndex);
                // Remove the row from the table data
                oTableData.splice(foundIndex, 1);
                // Update the model bound to the table
                this.getView().getModel("vendorModel").setData(oTableData);
                console.log("Row removed from table.");
            } else {
                console.log("No matching value found in the table.");
            }
        }.bind(this));
    }
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
    console.log(aSelectedVendorIDs,"yhi ha")
    },
   
   
   
     
      voyageNo: function () {
        var oView = this.getView();
 
 
        if (!this._oTankInfomat) {
          this._oTankInfomat = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.voyageChartering", this);
          oView.addDependent(this._oTankInfomat);
        }
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
 
      purchaseGroupValueHelp  : function () {
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
 
      purchaseOrgValueHelp  : function () {
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
 
      paymentTermValueHelp  : function () {
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
      onRefresh: function() {
        // Clear data in input fields
        this.byId("Chrmin").setValue("");
        this.byId("chatExt").setValue("");
        this.byId("voyNO").setValue("");
        var multiInput = this.byId("VendNo");
        multiInput.removeAllTokens();
        this.byId("voyname").setValue("");
        this.byId("PurchaseOrg").setValue("");
        this.byId("PurchaseGroup").setValue("");
        this.byId("PaymentTerm").setValue("");
        this.byId("Save").setEnabled(true); // Save button
        this.byId("Refresh").setEnabled(true); // Refresh button
        var oTable = this.byId("myTable")
    oTable.setVisible(false);
 
      },
      onValueHelpSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
 
        var oFilter = new Filter(
          "VoyageNo",
          FilterOperator.Contains,
          sValue
        );
 
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
 
 
      onValueHelpSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
 
        var oFilter = new Filter(
          "VoyageNo",
          FilterOperator.Contains,
          sValue
        );
 
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      onValueHelpSearchvendor: function (oEvent) {
        var sValue = oEvent.getParameter("value");
 
        var oFilter = new Filter(
          "Lifnr",
          FilterOperator.Contains,
          sValue
        );
 
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
 
      onSaveCh: function () {
        debugger;
        let oDate = this.byId("Input3").getValue();
        let oTime = this.byId("Input5").getValue();
        let oVoynm = this.byId("voyname").getValue();
        let oVoyno = this.byId("voyNO").getValue();
        let oVendorString = this.byId('VendNo').getProperty("_semanticFormValue"); // Assuming oVendor is a string
        let ochatExt = this.byId("chatExt").getValue();
        let oPurchaseGr = this.byId("PurchaseGroup").getValue();
        let oPurchaseOr = this.byId("PurchaseOrg").getValue();
        let oPaymentTerm = this.byId("PaymentTerm").getValue();
        let formatedDate = this.convertToDateTimeOffset(oDate);
        let isExistFlag = false;
        let that = this;
        console.log("get model data is:",getModelData2);
        var extractData = getModelData2.filter(function(item){
          return item.Ekgrp === oPurchaseGr
        }).map(function(item){
          return item.Eknam
        }).join(', ');
        var extractData2 = getModelData3.filter(function(item){
          return item.Ekorg === oPurchaseOr
        }).map(function(item){
          return item.Ekotx
        }).join(', ');
        var extractData3 = getModelData4.filter(function(item){
          return item.Paytrm === oPaymentTerm
        }).map(function(item){
          return item.Paytrmtxt
        }).join(', ');
 
     
        console.log(oDate);
        console.log(oVoynm);
        console.log(oVoyno);
        console.log(oVendorString);
        console.log(oPurchaseGr);
        console.log(oPurchaseOr);
        console.log(ochatExt);
        console.log(oTime);
   
     
       
        let oVendorArray = [];
        if (oVendorString) {
           
            let vendors = oVendorString.split(",");
            vendors.forEach(function(vendor) {
                oVendorArray.push({ "Lifnr": vendor.trim(),"Voyno":oVoyno  });
            });
        }
        console.log("array of vendors",oVendorArray);
   
        if (!oVoyno) {
            sap.m.MessageToast.show("Please enter a Voyage Number");
            return;
        }
   
        if (!ochatExt) {
            sap.m.MessageToast.show("Please enter a External chartering number");
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
        if (!oPaymentTerm){
           sap.m.MessageToast.show("Please enter a Payment Term");
           return;
 
        }
 
        let voyageNo = this.byId("voyNO").getValue();
        let rModel = this.getOwnerComponent().getModel();
        let filters = new Filter("Voyno", FilterOperator.EQ, voyageNo);
        let oBindList=rModel.bindList("/xNAUTIxCharteringHeaderItem",undefined,undefined,[filters]);
        console.log("yhi ha=",oBindList);
        oBindList.requestContexts(0,Infinity).then(function(aContexts){
          let oData=[];
          aContexts.forEach(function(oContexts){
            oData.push(oContexts.getObject());
          });
          if (oData.length > 0) {
            console.log(oVoyno);
               MessageBox.error(`Chartering for voyage number ${voyageNo} already exists.`);
               isExistFlag =true;
               return;
           } else {  
            createChartering.call(that);
          }
        })
      
 
      function createChartering () {
     
        debugger;
   
        let payload = {
            "Chrnmin" : "",
            "tovendor" : oVendorArray,
         
            "tocharteringasso" : {
                "Chrnmin" : "",
                "Chrnmex" : ochatExt,
                "Chrcdate" : oDate,
                "Chrctime" : oTime,
                "Chrqsdate" : null,
                "Chrqstime" : null,
                "Chrqedate" : null,
                "Chrqetime" : null,
                "Chrqdate" : null,
                "Chrporg" : oPurchaseOr,
                "Chrporgn" : extractData2,
                "Chrpgrp" : oPurchaseGr,
                "Chrpgrpn" : extractData,
                "Chrexcr" : null,
                "Chrpayt" : oPaymentTerm,
                "Chrpaytxt" : extractData3,
                "Chrinco" : null,
                "Chrincodis" : null,
                "Chrincol" : null,
                "Cimater" : null,
                "Cimatdes" : null,
                "Ciqty" : null,
                "Ciuom" : null,
                "Voyno" : oVoyno,
                "Voynm" : oVoynm,
                "Chrven" :null,
                "Chrvenn" : null,
                "Ciprec" : null,
                "Zdelete" : true,
                "RefChrnmin" : null
               
            }
        };
   
        console.log(payload);
        if( isExistFlag) {
          return;
        }
        //console.log(oModel.getData());
        // return;
        let oModel = this.getOwnerComponent().getModel();
       let oBindList= oModel.bindList("/xNAUTIxCharteringHeaderItem") ;
       oBindList.create(payload, {
         success: function(oData) {
          debugger
            // var Chrnmin = oData.Chrnmin; 
            console.log("Created Chartering No:", oData.Chrnmin);

            sap.m.MessageBox.success(`Chartering No ${oData.Chrnmin} created`, {
              title: "Success",
              onClose: function () {
                  this.resetFields();
              }.bind(this)
          });
          this.byId("Save").setEnabled(false);
      }.bind(this),
      error: function (err) {
          console.log(err);
      }
    });


      //  {
         
      //       success: function(oData){
      //         debugger;
      //           console.log("odata", oData);
   
      //           MessageBox.success(`Successfully created chartering - ${oData.Chrnmin}`, {
      //               title: "chartering Created",
      //               onClose: function () {
      //                   console.log("sent chartering no. :", oData.Chrnmin);
      //                   console.log(oVoyno);
      //                   this.onRefresh();
      //               }.bind(this),
      //           });
   
      //           this.byId("Save").setEnabled(false); // Save button
               
      //       }.bind(this),
      //       error : function(err){
      //           console.log(err);
      //       }
      //   });
    }
  },
  });
})