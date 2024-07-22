

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
    let BidStartDateFormat;
    let BidEndDateFormat;
    let bidStartdate;
    let bidEndtdate;
    let bidStarttime;
    let bidEndtime;

    let ChartNoValue;
    let chartObject = {};
    let vendorString = "";
    let smtpAddresses = [];
    let vendorNames = [];
    let dataToStore;

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
        var oStartDatePicker = this.byId("bidStartD");
        var oEndDatePicker = this.byId("bidEndD");
        var oNow = new Date();
 
        oStartDatePicker.setMinDate(oNow);
        oEndDatePicker.setMinDate(oNow);

      },
    
   
      onStartDateChange: function (oEvent) {
        var oStartDatePicker = oEvent.getSource();
        var oEndDatePicker = this.byId("bidEndD");
 
        var oStartDate = oStartDatePicker.getDateValue();
 
        if (oStartDate) {
            var oMinEndDate = new Date(oStartDate.getTime() + 30 * 60000); // Add 30 minutes (30 * 60000 milliseconds)
 
            var oNow = new Date();
 
            if (oStartDate.toDateString() === oNow.toDateString()) {
                if (oMinEndDate <= oNow) {
                    oMinEndDate = new Date(oNow.getTime() + 30 * 60000); // Add 30 minutes to the current time
                }
            }
 
            oEndDatePicker.setMinDate(oMinEndDate);
        }
    },
 
    onEndDateChange: function (oEvent) {
        var oEndDatePicker = oEvent.getSource();
        var oStartDatePicker = this.byId("bidStartD");
 
        var oStartDate = oStartDatePicker.getDateValue();
        var oEndDate = oEndDatePicker.getDateValue();
 
        if (oStartDate && oEndDate) {
            var oMinEndDate = new Date(oStartDate.getTime() + 30 * 60000); // Add 30 minutes
 
            if (oEndDate < oMinEndDate) {
                sap.m.MessageToast.show("End date and time must be at least 30 minutes greater than start date and time.");
                oEndDatePicker.setDateValue(null); // Clear invalid end date
            }
        }
    },

      loadData: function () {
        var ChartNo = this.getView().byId("CharteringRqNo");
        var ChartNoValue = ChartNo.getValue();
        var obidStartD = this.byId("bidStartD").getValue();

        var obidEndD = this.byId("bidEndD").getValue();


        var filter = getModelData.filter(function (data) {
          return data.Chrnmin === ChartNoValue;
        });


        if (filter.length > 0) {
          var vendorData = filter[0].tovendor;
          console.log("Vendor Data:", vendorData);


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



          dataToStore = {
            "ChartNoValue": ChartNoValue,
            "obidStartD": obidStartD,

            "obidEndD": obidEndD,

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
          return dataToStore;
        } else {
          console.log("No data found for ChartNoValue:", ChartNoValue);
        }
      },

      newDataMethod: function (data) {

        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(data);
        this._oDialog1.setModel(oModel, "storedDataModel");
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
        var oFilter1 = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.Contains, sValue1);
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
     
    
    
     
    onSave1: function () {
      console.log("buttonclicked");

      
      let oCharteringRqNo = this.byId("CharteringRqNo").getValue();
      let obidStartD = this.byId("bidStartD").getValue();
      console.log("hii", obidStartD);
      let selectedDate = new Date(obidStartD);
       bidStartdate = selectedDate.toLocaleDateString();
      let hours = selectedDate.getHours().toString().padStart(2, '0');
      let minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      let seconds = selectedDate.getSeconds().toString().padStart(2, '0');
       bidStarttime = `${hours}:${minutes}:${seconds}`;
  
      console.log("Date:", bidStartdate);
      console.log("StartTime:", bidStarttime);
  
      let obidEndD = this.byId("bidEndD").getValue();
      let selectedDate2 = new Date(obidEndD);
       bidEndtdate = selectedDate2.toLocaleDateString();
      let hour = selectedDate2.getHours().toString().padStart(2, '0');
      let minute = selectedDate2.getMinutes().toString().padStart(2, '0');
      let second = selectedDate2.getSeconds().toString().padStart(2, '0');
       bidEndtime = `${hour}:${minute}:${second}`;
      console.log("Date:", bidEndtdate);
      console.log("EndTime:", bidEndtime);
  
      if (!oCharteringRqNo) {
          sap.m.MessageBox.error("Please fill chartering No.");
          return;
      }
      if (!obidStartD) {
          sap.m.MessageBox.error("Please fill Bid Start Date and Time");
          return;
      }
      if (!obidEndD) {
          sap.m.MessageBox.error("Please fill Bid End Date and Time");
          return;
      }
    
  
      var currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      var exchangedatevalidto = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd" + "'T00:00:00Z'",
      });
  
      let BidStartDateFormat = exchangedatevalidto.format(new Date(bidStartdate));
      let BidEndDateFormat = exchangedatevalidto.format(new Date(bidEndtdate));

      console.log("startdatea",BidStartDateFormat);
  
      let oModel = this.getOwnerComponent().getModel();
  
      let oBinding = oModel.bindList("/CharteringSet");
  
      oBinding.filter([
          new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, oCharteringRqNo)
      ]);
      let oBusyDialog = new sap.m.BusyDialog();
      oBusyDialog.open();
      oBinding.requestContexts().then(function (aContexts) {
          let oContextToUpdate = aContexts.find(function(oContext) {
              return oContext.getProperty("Chrnmin") === oCharteringRqNo;
          });
  
          if (oContextToUpdate) {
              // Update the fields with new values
              oContextToUpdate.setProperty("Chrqsdate", BidStartDateFormat);
              oContextToUpdate.setProperty("Chrqstime", bidStarttime);
              oContextToUpdate.setProperty("Chrqedate", BidEndDateFormat);
              oContextToUpdate.setProperty("Chrqetime", bidEndtime);
  
              oModel.submitBatch("update").then(function() {
                  oModel.refresh();
  
                  sap.m.MessageBox.success("Data updated successfully.", {
                      onClose: function() {
                        
                      }
                  });
                  oBusyDialog.close();
              }).catch(function(error) {
                  sap.m.MessageBox.error("Error updating data: " + error.message);
              });
          } else {
              sap.m.MessageBox.error("Entity not found.");
          }
      }).catch(function (error) {
          sap.m.MessageBox.error("Error fetching entities: " + error.message);
      });
      this.getView().byId("sumbit").setEnabled(true);
  },
  onSave: function () {
    console.log("buttonclicked");

    let oCharteringRqNo = this.byId("CharteringRqNo").getValue();
    let obidStartD = this.byId("bidStartD").getValue();
    console.log("hii", obidStartD);
    let selectedDate = new Date(obidStartD);
     bidStartdate = selectedDate.toISOString().split('T')[0];
    let hours = selectedDate.getHours().toString().padStart(2, '0');
    let minutes = selectedDate.getMinutes().toString().padStart(2, '0');
    let seconds = selectedDate.getSeconds().toString().padStart(2, '0');
    let bidStarttime = `${hours}:${minutes}:${seconds}`;

    console.log("Date:", bidStartdate);
    console.log("StartTime:", bidStarttime);

    let obidEndD = this.byId("bidEndD").getValue();
    let selectedDate2 = new Date(obidEndD);
     bidEndtdate = selectedDate2.toISOString().split('T')[0];
    let hour = selectedDate2.getHours().toString().padStart(2, '0');
    let minute = selectedDate2.getMinutes().toString().padStart(2, '0');
    let second = selectedDate2.getSeconds().toString().padStart(2, '0');
    let bidEndtime = `${hour}:${minute}:${second}`;
    console.log("Date:", bidEndtdate);
    console.log("EndTime:", bidEndtime);

    if (!oCharteringRqNo) {
        sap.m.MessageBox.error("Please fill chartering No.");
        return;
    }
    if (!obidStartD) {
        sap.m.MessageBox.error("Please fill Bid Start Date and Time");
        return;
    }
    if (!obidEndD) {
        sap.m.MessageBox.error("Please fill Bid End Date and Time");
        return;
    }

    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    var exchangedatevalidto = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "yyyy-MM-dd'T00:00:00Z'",
    });

    let BidStartDateFormat = exchangedatevalidto.format(new Date(bidStartdate));
    let BidEndDateFormat = exchangedatevalidto.format(new Date(bidEndtdate));

    console.log("startdatea", BidStartDateFormat);

    let oModel = this.getOwnerComponent().getModel();

    let oBinding = oModel.bindList("/CharteringSet");

    oBinding.filter([
        new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, oCharteringRqNo)
    ]);
    let oBusyDialog = new sap.m.BusyDialog();
    oBusyDialog.open();
    oBinding.requestContexts().then(function (aContexts) {
        let oContextToUpdate = aContexts.find(function (oContext) {
            return oContext.getProperty("Chrnmin") === oCharteringRqNo;
        });

        if (oContextToUpdate) {
            // Update the fields with new values
            oContextToUpdate.setProperty("Chrqsdate", BidStartDateFormat);
            oContextToUpdate.setProperty("Chrqstime", bidStarttime);
            oContextToUpdate.setProperty("Chrqedate", BidEndDateFormat);
            oContextToUpdate.setProperty("Chrqetime", bidEndtime);

            oModel.submitBatch("update").then(function () {
                oModel.refresh();

                sap.m.MessageBox.success("Data updated successfully.", {
                    onClose: function () {

                    }
                });
                oBusyDialog.close();
            }).catch(function (error) {
                sap.m.MessageBox.error("Error updating data: " + error.message);
            });
        } else {
            sap.m.MessageBox.error("Entity not found.");
        }
    }).catch(function (error) {
        sap.m.MessageBox.error("Error fetching entities: " + error.message);
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
        that.mailData();
      },
     

      oncancell: function () {

        this._oDialog1.close();
        this.mailData();
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

        // Reset the time part of both dates to compare only the date part
        oSelectedDate.setHours(0, 0, 0, 0);
        oToday.setHours(0, 0, 0, 0);

        if (oSelectedDate < oToday) {
          oDatePicker.setValue("");
          sap.m.MessageBox.error("Past dates are not allowed. Please select a current or future date.");
        }
      },

      mailData: async function () {
        let vendorNumbers = vendorString.split(",");

        let oModel = this.getOwnerComponent().getModel();

        let aFilters = vendorNumbers.map(vendorNo => new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, vendorNo));

        let combinedFilter = new sap.ui.model.Filter({
          filters: aFilters,
          and: false
        });

        let oBindList = oModel.bindList("/xNAUTIxBusinessPartner1", null, null, combinedFilter);

        try {


          let res = await oBindList.requestContexts().then(function (aContexts) {
            let contextDataArray = aContexts.map(context => context.getObject());

            smtpAddresses = contextDataArray.map(data => data.SmtpAddr);
            vendorNames = contextDataArray.map(data => data.Name1); // Extracting the vendor names

            return { smtpAddresses, vendorNames };
          });

          console.log("Filtered SMTP Addresses:", smtpAddresses);
          console.log("Filtered Vendor Names:", vendorNames);
          console.log("subjectdata", dataToStore);

          return { smtpAddresses, vendorNames };
        } catch (error) {
          console.error("Error while filtering data:", error);
        }
      },
 
    
    onSendEmail: function () {
      let RecieverEmails = smtpAddresses;
      let RecieverNames = vendorNames;
  
      let StartPort = dataToStore.startPort[0];
      let EndPort = dataToStore.midPort[0];
      
      let CargoSize = Number(dataToStore.cargoSize);
  
      let routes = [StartPort, EndPort]; 
  
      let bidStartdateObj = new Date(bidStartdate);
      let bidEndtdateObj = new Date(bidEndtdate);
  
      let formattedBidStartdate = bidStartdateObj.toISOString().split('T')[0];
      let formattedBidEndtdate = bidEndtdateObj.toISOString().split('T')[0];
  
      console.log("maildata", RecieverEmails, RecieverNames, routes, CargoSize);
      console.log("Date:", formattedBidStartdate, formattedBidEndtdate);
     
      
      let oData = {
          vendorsName: RecieverNames,
          receiversEmails: RecieverEmails,
          routes: routes, 
          cargoSize: CargoSize, 
          bidStart: formattedBidStartdate,
          bidEnd: formattedBidEndtdate,
          bidstartTime:bidStarttime,
          bidEndTime:bidEndtime
      };
  
      let oModel = this.getView().getModel();
      let oListBinding = oModel.bindList("/sendEmail");
  
      oListBinding.create(oData );

  },
  onSendEmail1: function () {
    let RecieverEmails = smtpAddresses;
    let RecieverNames = vendorNames;

    let StartPort = dataToStore.startPort[0];
    let EndPort = dataToStore.midPort[0];

    let CargoSize = Number(dataToStore.cargoSize);

    let routes = [StartPort, EndPort]; 

    let bidStartdateObj = new Date(bidStartdate);
    let bidEndtdateObj = new Date(bidEndtdate);

    let formattedBidStartdate = bidStartdateObj.toISOString().split('T')[0];
    let formattedBidEndtdate = bidEndtdateObj.toISOString().split('T')[0];

    console.log("maildata", RecieverEmails, RecieverNames, routes, CargoSize);
    console.log("Date:", formattedBidStartdate, formattedBidEndtdate);

    let oData = {
        vendorsName: RecieverNames,
        receiversEmails: RecieverEmails,
        routes: routes, 
        cargoSize: CargoSize, 
        bidStart: formattedBidStartdate,
        bidEnd: formattedBidEndtdate,
        bidstartTime: bidStarttime,
        bidEndTime: bidEndtime
    };

    let oModel = this.getView().getModel();
    let oListBinding = oModel.bindList("/sendEmail");

    oListBinding.attachEvent("createCompleted", this.onCreateCompleted, this);

    let oContext = oListBinding.create(oData, false, false, false);
},






onCreateCompleted1: function (oEvent) {
  let oParameters = oEvent.getParameters();
  let oContext = oParameters.context;
  let bSuccess = oParameters.success;

  if (bSuccess) {
      console.log("oParameters", oParameters);
      console.log("oContext", oContext.sPath);
      console.log("bSuccess", bSuccess);
      
      // Get the vendor names from the context
      let oData = oContext.getObject();
      let vendorsNames = oData.vendorsName.join("\n");
      
      sap.m.MessageBox.success(`Emails sent successfully to these companies:\n${vendorsNames}`, {
          onClose: () => {
              if (this._oDialog1) {
                  this._oDialog1.close();
              }
          }
      });

      this.getView().byId("sumbit").setEnabled(false);
      this.getView().byId("Button1").setEnabled(false);

  } else {
      sap.m.MessageBox.error(`Failed to send emails`);
  }
},
onCreateCompleted: function (oEvent) {
  let oParameters = oEvent.getParameters();
  let oContext = oParameters.context;
  let bSuccess = oParameters.success;

  if (bSuccess) {
      console.log("oParameters", oParameters);
      console.log("oContext", oContext.sPath);
      console.log("bSuccess", bSuccess);
      
      let oData = oContext.getObject();
      let vendorsNames = oData.vendorsName.map((vendor, index) => `${index + 1}. ${vendor}`).join("\n");
      
      sap.m.MessageBox.success(`Emails sent successfully to these companies:\n${vendorsNames}`, {
          onClose: () => {
              if (this._oDialog1) {
                  this._oDialog1.close();
              }
          }
      });

      this.getView().byId("sumbit").setEnabled(false);
      this.getView().byId("Button1").setEnabled(false);

  } else {
      sap.m.MessageBox.error(`Failed to send emails`);
  }
},



  
  

    });

  });