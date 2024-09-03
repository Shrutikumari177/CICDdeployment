sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataMetaModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/mdc/FilterBarDelegate"
  ],
  function (BaseController, History, Filter, FilterOperator, MessageToast, MessageBox, ODataMetaModel, JSONModel,FilterBarDelegate) {
    "use strict";
    let aSelectedIds = [];
    let copyFlag = false;
    let editFlag = false;
    let newEntryFlag = false;
    let onCopyInput = undefined;
    let getModelData = [];
    let oBusyDialog;

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BPMasterDetails", {
      async onInit() {
        await this.loadportdata();

        let oTable = this.byId("table")
        oTable.clearSelection();

        oTable.setNoData("Loading.....");
        
      },
      loadportdata: async function () {
        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/BusinessPartnerSet");
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
          
        var oBindingContext = oEvent.getParameter("bindingContext");                         
             // Retrieve the data object for the pressed rowvar 
            let data = oBindingContext.getObject();
            
            // let data = oSource.getBindingContext("").getObject();
            let tempModel = new sap.ui.model.json.JSONModel();
            tempModel.setData([data]);
            var oView = this.getView();
            if (!this._oDialog1) {
                this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.BusinessPartnerDetails", this);
                oView.addDependent(this._oDialog1);
       
         
            }
            this._oDialog1.setModel(tempModel,"nautiNewVendModel1")
            this._oDialog1.open();
      },

      oncancell: function () {
        this._oDialog1.close();
      },

      onchange: function() {
        console.log("change is working")
      },
    
      // onBackPress: function () {
        
      //   // clear selection 

      //   this.byId("table").clearSelection();
      //   this.byId("table")
      //   // console.log("hey")
      //   let oFilterBar = this.byId("filterbar")
      //   let container = new sap.ui.mdc.filterbar.IFilterContainer(oFilterBar)
      //   // oFilterBar.setFilterConditions({})
      //   // FilterBarDelegate.clearFilters(oFilterBar)

      //   const oRouter = this.getOwnerComponent().getRouter();
      //   oRouter.navTo("RouteBusinessPartnerDashboard");
       
      // },
      

      onBackPress: function () {
        // Clear selection in the table
        this.byId("table").clearSelection();

         // Get the filter bar control
    let oFilterBar = this.byId("filterbar");
    
       
    if (oFilterBar) {
      // Define new filter conditions
      let newFilterConditions = {
          Ort01: [{
              operator: "Contains",
              values: [""]
          }]
      };

      // Set the new filter conditions
      oFilterBar.setFilterConditions();
      oFilterBar.getBasicSearchField().setConditions()
    

      // Optionally, trigger a search to refresh the data
      oFilterBar.fireSearch();

      // // Optionally, refresh the table data
      // let oTable = this.byId("table");
      // let oBinding = oTable.getBinding("items");
      // if (oBinding) {
      //     oBinding.refresh(); // Refresh data binding to show all entries
      // }
    }


        // Navigate back to the previous page
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBusinessPartnerDashboard");
    }
,    

      onPressHome: function() {
        this.byId("table").clearSelection();
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },

      onLiveChange: function (oEvent) {
        // Get the source control of the event
        var oSource = oEvent.getSource();
    
        // Get the datatype of the input source
        var inputString = oSource.mProperties.dataType;
        var wordsArray = inputString.split("."); // Split the string by the period
        var lastWord = wordsArray[wordsArray.length - 1]; // Get the last element from the array
        
        oEvent
        // Get the value
        var value = oEvent.getParameters()
        value = value.value
        var typeofvalue;
    
        // Check if value contains only numbers
        if (/^\d+$/.test(value)) { 
            typeofvalue = "Integer";
        }
        // Check if the value contains only letters
        else if (/^[a-zA-Z]+$/.test(value) || value ==='') {
            typeofvalue = "String";
        }
        // Check if the value contains both or other characters
        else {
            typeofvalue = "Integer";
        }
    
        // Apply value state based on the validation
        if (typeofvalue != lastWord) {
            // Set the value state to Error and provide a message
            oSource.setValueState(sap.ui.core.ValueState.Error);
            oSource.setValueStateText("Please enter alphabets only.");
        } else {
            // Clear any previous value state and message
            oSource.setValueState(sap.ui.core.ValueState.None);
            oSource.setValueStateText("");
        }
    
        console.log("Value State:", oSource.getValueState());
        console.log("Value State Text:", oSource.getValueStateText());
        console.log("Value changing:", value);
    }, 
    
  //   onLiveSearch: function (oEvent) {
  //     // Get the FilterBar instance
  //     const oFilterBar = this.byId("filterbar");

  //     const sValue = oEvent.getParameter("value");
  //      console.log(oFilterBar.triggerSearch())
  //     if (oFilterBar) {
  //       oFilterBar.triggerSearch().then(function() {
  //           console.log("Search triggered successfully");
  //       }).catch(function(oError) {
  //           console.error("Error triggering search:", oError);
  //       });
  //   } else {
  //       console.error("FilterBar not found");
  //   }
            
  //     // Use a closure to create a new timeout for each call
  //     clearTimeout(this._searchTimeout);
  //     this._searchTimeout = setTimeout(() => {

  //       oFilterBar.fireSearch({
  //           value: sValue // Pass the search value here
  //       });

  //       console.log("Search triggered with value:", sValue);
  //     }, 1000); // 1-second delay
  // },  

      onDeletePress: function () {
        var oTable = this.byId("table");
        var aSelectedContexts = oTable.getSelectedContexts(true);
    
        if (aSelectedContexts.length === 0) {
          sap.m.MessageToast.show("Please select at least one row to delete.");
          return;
        }
    
        const that = this;
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure ,you want  to delete ?", {
              title: "Confirm",
              onClose: function (oAction) {
                if (oAction === MessageBox.Action.OK) {
    
                  oBusyDialog = new sap.m.BusyDialog({
                    text: "Deleting, please wait...",
                    title: "Processing"
                  });
                  oBusyDialog.open();
                  // that.deleteSelectedItems(aItems);
                  that.deleteSelectedItems(aSelectedContexts);
                } else {
                  oTable.clearSelection();
                  sap.m.MessageToast.show("Deletion canceled");
                }
              }
            }
          );
        });
      },
    
      deleteSelectedItems: function (aItems) {
        let slength = aItems.length;
        let deleteMsg = slength === 1 ? "Record" : "Records";
        let oModel = this.getOwnerComponent().getModel();
    
        aItems.forEach((oContext) => {
          // const oContext = oItem.getBindingContext();
          const oData = oContext.getObject();
          let Lifnr = oData.Lifnr;
          // let code = oData.Code;
          console.log("data to be deleted", Lifnr);
          let that = this;
          let oBindList = oModel.bindList("/BusinessPartnerSet");
    
          oBindList.requestContexts(0, Infinity).then((aContexts) => {
            aContexts.forEach((oContext) => {
              if (oContext.getObject().Lifnr === Lifnr ) {
                oContext.delete().then(function () {
                  oModel.refresh();
                  sap.m.MessageToast.show(`${deleteMsg} deleted sucessfully`);          
                  oBusyDialog.close();

                }).catch((err) => {
                  MessageBox.error("Error deleting record: ", err.message);
                  oBusyDialog.close();
                  return
                });
              };
            });
          });
    
          this.byId("table").clearSelection();
    
        })
    
      },

    });

  });
