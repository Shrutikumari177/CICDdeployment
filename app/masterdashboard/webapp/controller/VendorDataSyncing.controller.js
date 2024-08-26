sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/Fragment",
      "sap/ui/core/routing/History",
      'sap/m/MessageToast',
      "sap/m/MenuItem",
      'sap/ui/model/json/JSONModel',
      "sap/ui/core/library",
      "sap/ui/model/odata/v4/ODataModel"
  ],
  function(BaseController,Fragment,History,MessageToast,MenuItem,JSONModel,CoreLibrary,ODataModel) {
    "use strict";
    let getModelData = [];

    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.VendorDataSyncing", {
      // _oSupplMenuFragment: null,
      _oMenuFragment:null,
      onInit() {
          
          // clear selected rows
          this.byId("table").clearSelection();

          // use filter
          let oModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel, "businessService");
          let oModel3 = this.getOwnerComponent().getModel();
          let oBindList3 = oModel3.bindList("/BusinessPartnerSet");
          
          oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
              aContexts.forEach(function (oContext) {
                getModelData.push(oContext.getObject());
              });
              oModel.setData(getModelData);
              this.getView().getModel("businessService").refresh();
      
          }.bind(this))
         console.log("mydata", getModelData.length, getModelData)

         let oModel1 = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel1, "nautiNewVendModel");
          let oModel2 = this.getOwnerComponent().getModel();
          let oBindList2 = oModel2.bindList("/xNAUTIxnewvend_btp");
          
          oBindList2.requestContexts(0, Infinity).then(function (aContexts) {
              aContexts.forEach(function (oContext) {
                getModelData.push(oContext.getObject());
              });
              oModel.setData(getModelData);
              this.getView().getModel("nautiNewVendModel").refresh();
              
      
          }.bind(this))

      },
      
      onExit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("MastView");
      },
      onBackPress: function() {
          this.byId("table").clearSelection();
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteBusinessPartnerDashboard");
        },
        onPressHome: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
        },

        onClearSelection: function() {
           // clear selected rows
           this.byId("table").clearSelection();
        },
      
      
      // create payload from selected entries
      onSelectionSubmit: function () {
          var oTable = this.byId("table");
          var aSelectedContexts = oTable.getSelectedContexts(true);
          var aSelectedItems = aSelectedContexts.map(function (oContext) {
              return oContext.getObject();
          });
      
          if (aSelectedItems.length === 0) {
              MessageToast.show("No items selected.");
              return;
          }
      
          var aPayloads = aSelectedItems.map(function (item) {
              return {
                  Lifnr: item.Lifnr,
                  PartnerRole: "", // Blank field
                  Anred: item.Anred,
                  Name1: item.Name1 ,
                  Name2: item.Name2,
                  Name3: item.Name3,
                  Sort1: item.Sort1,
                  StrSuppl1: "",
                  StrSuppl2: "",
                  HouseNum1: "",
                  Stras: item.Stras,
                  Pstlz: item.Pstlz,
                  Ort01: item.Ort01,
                  Land1: item.Land1,
                  Regio: item.Regio,
                  TimeZone: "",
                  Spras: item.Spras,
                  Telf1: item.Telf1,
                  Telf2: item.Telf2,
                  Telfx: item.Telfx,
                  SmtpAddr: item.SmtpAddr,
                  Erdat: item.Erdat,
                  
              };
          });

          
      
          console.log(aPayloads);
          // Check and create entries
          this._checkAndCreateEntries(aPayloads);
      },
      

      // create unique entries from payload
      
      _checkAndCreateEntries: function (aPayloads) {
          var oModel = this.getView().getModel("businessService");
          var existingData = oModel.getData();
      
          // Confirm before creating entries
          sap.m.MessageBox.confirm("Do you want to create new entries?", {
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.YES) {
                      var oModelV4 = this.getOwnerComponent().getModel();
                      var oBindListV4 = oModelV4.bindList("/BusinessPartnerSet");
      
                      aPayloads.forEach(function (oPayload) {
                          var bExists = existingData.some(function (oEntry) {
                              return oEntry.Lifnr === oPayload.Lifnr; // Assuming Lifnr is the unique identifier
                          });
      
                          if (!bExists) {
                              console.log("Creating payload:", oPayload); // Log the complete payload
                              oBindListV4.create(oPayload);
                              oModelV4.refresh();
                              console.log("doneeee");
                              MessageToast.show("Entry(s) created successfully.");
                             
                          } else {
                              MessageToast.show(`Vendor No ${oPayload.Lifnr} already exists.`);
                              return;
                          }
                          
                          this.byId("table").clearSelection();
                      });
                  } else {
                      this.byId("table").clearSelection();
                      MessageToast.show("Creation of new entries cancelled.");
                  }
              }.bind(this) // Ensure proper context inside the callback
          });
      },

  
      
      // for navigation dialog box
      onNavigateDetails: function(oEvent) {

          var oBindingContext = oEvent.getParameter("bindingContext");                         
           // Retrieve the data object for the pressed rowvar 
          let data = oBindingContext.getObject();
          
          // let data = oSource.getBindingContext("").getObject();
          let tempModel = new sap.ui.model.json.JSONModel();
          tempModel.setData([data]);
          var oView = this.getView();
          if (!this._oDialog1) {
              this._oDialog1 = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.VendorDataSyncing", this);
              oView.addDependent(this._oDialog1);
     
       
          }
          this._oDialog1.setModel(tempModel,"nautiNewVendModel1")
          this._oDialog1.open();
        },

      oncancell: function () {
          this._oDialog1.close();
        },

       onSearch: function (oEvent) {
          var oTable = this.byId("table");
          var oBinding = oTable.getBinding("items");
          var sQuery = oEvent.getParameter("newValue");
     
          if(sQuery.trim()){
            var oFilter1 = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.Contains, sQuery);
            var oFilter2 = new sap.ui.model.Filter("Portc", sap.ui.model.FilterOperator.Contains, sQuery);
            var oFilter3 = new sap.ui.model.Filter("Countryn", sap.ui.model.FilterOperator.Contains, sQuery);
            var orFilter = new sap.ui.model.Filter({
                filters: [oFilter1, oFilter2, oFilter3],
                and: false
            });
            oBinding.filter([orFilter]);
          }
          else{
            oBinding.filter([]);
          }
   
          var updatedBinding = oTable.getBinding("items");
   
          if(!updatedBinding.aLastContextData.length){
            oTable.setNoDataText("No Data found");
            return;
          }
         
        },

});
  }
);