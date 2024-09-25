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
    
    let getModelData = [];
    let oBusyDialog;

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BPMasterDetails", {
      async onInit() {
        await this.loadportdata();
        
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

      onClearSelection: function() {
        // clear selected rows
       let oTable = this.byId("table")
       oTable.clearSelection();
      },

      onchange: function() {
        console.log("change is working")
      },
    

      onBackPress: function () {
        this.resetPage()
        // Navigate back to the previous page
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBusinessPartner");
      },    

      onPressHome: function() {
        this.byId("table")
        this.resetPage()
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },

      resetPage: function() {
        // Clear selection in the table
        this.byId("table").clearSelection();

         // Get the filter bar control
        let oFilterBar = this.byId("filterbar");
        
        // clear internal searche value 
        if (oFilterBar) {
          oFilterBar.setInternalConditions()
        }
      },

      // onLiveChange: function (oEvent) {
      //   // Get the source control of the event
      //   var oSource = oEvent.getSource();
    
      //   // Get the datatype of the input source
      //   var inputString = oSource.mProperties.dataType;
      //   var wordsArray = inputString.split("."); // Split the string by the period
      //   var lastWord = wordsArray[wordsArray.length - 1]; // Get the last element from the array
        
        
      //   // Get the value
      //   var value = oEvent.getParameters()
      //   value = value.value
      //   var typeofvalue;
    
      //   // Check if value contains only numbers
      //   if (/^\d+$/.test(value)) { 
      //       typeofvalue = "Integer";
      //   }
      //   // Check if the value contains only letters
      //   else if (/^[a-zA-Z]+$/.test(value) || value ==='') {
      //       typeofvalue = "String";
      //   }
      //   // Check if the value contains both or other characters
      //   else {
      //       typeofvalue = "Integer";
      //   }
    
      //   // Apply value state based on the validation
      //   if (typeofvalue != lastWord) {
      //       // Set the value state to Error and provide a message
      //       oSource.setValueState(sap.ui.core.ValueState.Error);
      //       oSource.setValueStateText("Please enter alphabets only.");
      //   } else {
      //       // Clear any previous value state and message
      //       oSource.setValueState(sap.ui.core.ValueState.None);
      //       oSource.setValueStateText("");
      //   }
    
      //   console.log("Value State:", oSource.getValueState());
      //   console.log("Value State Text:", oSource.getValueStateText());
      //   console.log("Value changing:", value);

        
      // }, 
    
    onLiveSearch: function (oEvent) {
      // Get the FilterBar instance
      const oFilterBar = this.byId("filterbar");
  
      const sValue = oEvent.getParameter("value");

      if (sValue) {
        // console.log("key triggered")
          const oEnterKeyEvent = new KeyboardEvent('keydown', {
             key: 'Enter',
             keyCode: 13,
             which: 13,
             bubbles: true,
             cancelable: true
          });

          // Find the target input field (or element) where you want to dispatch the event
        const oInputField = oFilterBar.getBasicSearchField().getFocusDomRef();

        // Dispatch the Enter key event to simulate the key press
        oInputField.dispatchEvent(oEnterKeyEvent);
      }

      if (sValue.length < 1) {
        oFilterBar.getBasicSearchField().setConditions()
      }
      
    },  

   
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
    
    deleteSelectedItems: async function (aItems) {
        let slength = aItems.length;
        let deleteMsg = slength === 1 ? "Record" : "Some Records";
        let deleteMsgErr = slength === 1 ? "A record" : "Some records";

        let plural = slength === 1 ? "was" : "were"
        let oModel = this.getOwnerComponent().getModel();
        let errors = [];
      
        try {
          // Collect all delete promises
          let deletePromises = aItems.map(async (oContext) => {
            try {
              const oData = oContext.getObject();
              let Lifnr = oData.Lifnr;
      
              console.log("data to be deleted", Lifnr);
      
              let oBindList = oModel.bindList("/BusinessPartnerSet");
              let aContexts = await oBindList.requestContexts(0, Infinity);
              let found = false;
      
              for (let context of aContexts) {
                if (context.getObject().Lifnr === Lifnr) {
                  found = true;
                  await context.delete();
                  break;
                }
              }
      
              if (!found) {
                errors.push(`Record with Lifnr ${Lifnr} not found`);
              }
            } catch (err) {
              errors.push(err.message);
            }
          });
      
          // Wait for all delete operations to complete
          await Promise.all(deletePromises);
      
          if (errors.length === 0) {
            oModel.refresh();
            sap.m.MessageToast.show(`${deleteMsg} deleted successfully`);
          } else {
            throw new Error(errors.join("\n"));
          }
        } catch (err) {
          if (err.message.includes("vendor exists in voyage, do not delete")) {
            sap.m.MessageBox.error(`${deleteMsgErr} already exists in voyage, which ${plural} not deleted`);
            oModel.refresh();
          } else {
            sap.m.MessageBox.error(err.message);
            oModel.refresh();
          }
        } finally {
          this.byId("table").clearSelection();
          if (typeof oBusyDialog !== 'undefined') {
            oBusyDialog.close();
          }
        }
      }
      
   

    });
});
