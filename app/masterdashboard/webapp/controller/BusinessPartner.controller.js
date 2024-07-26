sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataMetaModel",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController, History, Filter, FilterOperator, MessageToast, MessageBox, ODataMetaModel, JSONModel) {
    "use strict";
    let aSelectedIds = [];
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    let onCopyInput = undefined;
    let getModelData = [];

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BusinessPartner", {
      async onInit() {

        await this.loadportdata();

      },
      loadportdata: async function () {
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/xNAUTIxBusinessPartner1");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
          this.getView().getModel("dataModel").refresh();
          // this.getView().setModel(oModel,"Model");
        }.bind(this))
        console.log("mydata", getModelData.length, getModelData)

      },

      onNavigateDetails: function(oEvent) {
          
        let oSource = oEvent.getSource();
        let data = oSource.getBindingContext("dataModel").getObject();
        let tempModel = new sap.ui.model.json.JSONModel();
        tempModel.setData([data]);
        var oView = this.getView();
        if (!this._oDialog1) {
            this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.BusinessPartnerDetails", this);
            oView.addDependent(this._oDialog1);
   
     
        }
        this._oDialog1.setModel(tempModel,"dataModel1")
        this._oDialog1.open();
      },

      oncancell: function () {
        this._oDialog1.close();
      },


      onSearch: function (oEvent) {
        var oTable = this.byId("createTypeTable");
        var oBinding = oTable.getBinding("items");
        var sQuery = oEvent.getParameter("newValue"); // Use 'newValue' for liveChange event
    
        var oFilter1 = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sQuery);
        var oFilter2 = new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sQuery);
        var oFilter3 = new sap.ui.model.Filter("Name2", sap.ui.model.FilterOperator.Contains, sQuery);
        var orFilter = new sap.ui.model.Filter({
            filters: [oFilter1, oFilter2, oFilter3],
            and: false
        });
    
        oBinding.filter([orFilter], "Application"); // Apply filters
    
        var oSelectDialog = oEvent.getSource();
        oBinding.attachEventOnce("dataReceived", function () {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },
    
    
      onBackPress: function () {
        const that = this;
        var oEntryTable = that.getView().byId("entryTypeTable");
        var oupdateTable = that.getView().byId("updateTypeTable");

        const oRouter = this.getOwnerComponent().getRouter();
        // Check if any items have been selected
        if (aSelectedIds.length === 0 && !newEntryFlag) {

          // If no items have been selected, navigate to "RouteMasterDashboard"
          oRouter.navTo("RouteMasterDashboard");
        }
        else if (aSelectedIds.length && !newEntryFlag && !editFlag) {
          oRouter.navTo("RouteMasterDashboard");
          this.byId('createTypeTable').removeSelections();

        }
        else if (copyFlag) {
          var oTable = this.byId("entryTypeTable"); // Assuming you have the table reference
          var aItems = oTable.getItems();
          let flag = false;
          for (let i = 0; i < aItems.length; i++) {
            var oCells = aItems[i].getCells();
            var oInput = oCells[1]; // Index 1 corresponds to the Input field
            var sValue = this.removeExtraSpaces(oInput.getValue());

            console.log(onCopyInput[i] + ":" + sValue + ":");
            if (onCopyInput[i] !== sValue) {
              flag = true;
              break;
            }
          }

          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // Reset the view to its initial state
                  this.resetView();
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            this.resetView();

          }
        }


        else if (newEntryFlag) {
          let Country = this.getView().byId("COUNTRY").getValue();
          let Portc = this.getView().byId("PORTC").getValue();
          let Portn = this.getView().byId("PORTN").getValue();
          let Reancho = this.getView().byId("REANCHO").getValue();
          let Latitude = this.getView().byId("LATITUDE").getValue();
          let Longitude = this.getView().byId("LONGITUDE").getValue();
          let Countryn = this.getView().byId("COUNTRYN").getValue();
          let Locid = this.getView().byId("LOCID").getValue();
          let Ind = this.getView().byId("IND").getValue();

          if (Country == "" && Portc == "" && Portn == "" && Reancho == "" && Latitude == "" && Longitude == "" && Country == "" && Countryn == "" && Locid == "" && Ind == "") {
            oEntryTable.setVisible(false);
            // Clear input fields of the first row
            oEntryTable.getItems()[0].getCells()[0].setValue("");
            oEntryTable.getItems()[0].getCells()[1].setValue("");
            oEntryTable.getItems()[0].getCells()[2].setValue("");
            oEntryTable.getItems()[0].getCells()[3].setValue("");
            oEntryTable.getItems()[0].getCells()[4].setValue("");
            oEntryTable.getItems()[0].getCells()[5].setValue("");
            oEntryTable.getItems()[0].getCells()[6].setValue("");
            oEntryTable.getItems()[0].getCells()[7].setValue("");
            oEntryTable.getItems()[0].getCells()[8].setValue("");


            // Remove items except the first row
            var items = oEntryTable.getItems();
            for (var i = items.length - 1; i > 0; i--) {
              oEntryTable.removeItem(items[i]);
            }
            this.resetView();

          } else {
            sap.m.MessageBox.confirm(
              "Do you want to discard the changes?", {

              title: "Confirmation",
              onClose: function (oAction) {

                if (oAction === sap.m.MessageBox.Action.OK) {

                  oEntryTable.setVisible(false);
                  // Clear input fields of the first row
                  oEntryTable.getItems()[0].getCells()[0].setValue("");
                  oEntryTable.getItems()[0].getCells()[1].setValue("");
                  oEntryTable.getItems()[0].getCells()[2].setValue("");
                  oEntryTable.getItems()[0].getCells()[3].setValue("");
                  oEntryTable.getItems()[0].getCells()[4].setValue("");
                  oEntryTable.getItems()[0].getCells()[5].setValue("");
                  oEntryTable.getItems()[0].getCells()[6].setValue("");
                  oEntryTable.getItems()[0].getCells()[7].setValue("");
                  oEntryTable.getItems()[0].getCells()[8].setValue("");



                  // Remove items except the first row
                  var items = oEntryTable.getItems();
                  for (var i = items.length - 1; i > 0; i--) {
                    oEntryTable.removeItem(items[i]);
                  }
                  // If user clicks OK, reset the view to its initial state
                  that.resetView();
                } else {
                  // If user clicks Cancel, do nothing
                }
              }
            }
            );

          }
        }

        else if (editFlag) {

          this.onCancelEdit();

          if (flag) {
            sap.m.MessageBox.confirm("Do you want to discard the changes?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  // Reset the view to its initial state
                  this.resetView();
                }
              }.bind(this) // Ensure access to outer scope
            });
          } else {
            // If no changes have been made, navigate to the initial screen immediately
            this.resetView();

          }
        }

      },

    });

  });
