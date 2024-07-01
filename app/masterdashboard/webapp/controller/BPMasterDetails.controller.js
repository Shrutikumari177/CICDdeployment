sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",

    "sap/ui/model/odata/v2/ODataModel"
  ],
  function (BaseController, Fragment, History, ODataModel) {
    "use strict";
    let smartInitLoaded = false;
    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BPMasterDetails", {
      onInit() {
        // Access the vendorsSrv model defined in manifest.json
        var oModel = this.getOwnerComponent().getModel("vendorV2Model");
        // var oModel = new ODataModel("/v2/odata/v4/nauticalservice/");
        this.getView().setModel(oModel, "vendorsSrv");
       

        // Get the SmartTable instance

        // this.loadStandardVendors();
      },

      loadStandardVendors : function(){
        let oIconTabBar = this.byId("smartTableVendors");
        
        if (!this.oSmartTable) {
          this.oSmartIllustratedMessage = new sap.m.IllustratedMessage({
            illustrationSize: sap.m.IllustratedMessageSize.Auto,
            illustrationType: sap.m.IllustratedMessageType.BeforeSearch,
            enableVerticalResponsiveness: true,
            title: "Select Year-Period",
            description: " ",
          });
          this.oSmartTable = new sap.ui.comp.smarttable.SmartTable({
            visible: false,
            height: "auto",
            entitySet: "xNAUTIxvend_btp",
            tableType: "Table",
            enableAutoBinding: true,
            enableAutoColumnWidth: true,
            showFullScreenButton: true,
            tableBindingPath: "/xNAUTIxvend_btp",
            scroll: false,
            initiallyVisibleFields: "Supplier,CompanyCode,BusinessPartner",

          });
          // this.setupColumns(oTable);
          // this.setupTableProperties(oTable);
          this.oSmartTable.getTable().attachRowsUpdated({
              smartInitLoaded,
            },
            this.onSmartRowsUpdated,
            this
          );
          let oModel = this.getOwnerComponent().getModel(
            "vendorV2Model"
          );
          console.log("Report Model ", oModel);
          this.oSmartTable.setModel(oModel);
          this.oSmartIllustratedMessage.placeAt(oIconTabBar);
          this.oSmartTable.placeAt(oIconTabBar);
        } else {
          this.onProcessOrderReportUpdate(this.oSmartTable.getTable());
        }
      },


      onProcessOrderReportUpdate: function (oEvent) {
        this.oSmartTable.setBusy(true);
        let oTable;
        console.log("Rowsupdated ", oEvent.getId());
        if (oEvent && oEvent.sId === "rowsUpdated") {
          oTable = oEvent.getSource();
        } else {
          oTable = oEvent;
        }
        let fFilter;
        let aFilter = [];
        let monthReport = undefined;
        if (monthReport) {
          aFilter.push(
            new sap.ui.model.Filter(
              "BusinessPartner",
              sap.ui.model.FilterOperator.StartsWith,
              monthReport
            )
          );
          this.oSmartTable.getTable().setShowOverlay(false);
          fFilter = new sap.ui.model.Filter({
            filters: aFilter,
            and: true,
          });
          if (oTable.getBinding("rows"))
            oTable.getBinding("rows").filter(fFilter);
          if (this.oSmartIllustratedMessage.getVisible()) {
            this.oSmartIllustratedMessage.setVisible(false);
            this.oSmartTable.setVisible(true);
          }
        } else {
          if (this.oSmartTable.getVisible()) {
            this.oSmartIllustratedMessage.setVisible(true);
            this.oSmartTable.setVisible(false);
          }

          this.oSmartTable.getTable().setShowOverlay(true);
        }

        this.oSmartTable.getTable().getModel().refresh();
        if (this.oSmartTable.getBusy()) this.oSmartTable.setBusy(false);
      },
      onSmartRowsUpdated: function (data, oEvent) {
        if (!smartInitLoaded)
          this.onProcessOrderReportUpdate(this.oSmartTable.getTable());
        smartInitLoaded = true;
      },
      
      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteBusinessPartnerDashboard");
      },
      onPressHome: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },
      onPress: function () {
        var oView = this.getView(),
          oButton = oView.byId("button");
        if (!this._oMenuFragment) {
          this._oMenuFragment = Fragment.load({
            name: "nauticalfe.fragments.MastOptionsDropDown",
            id: oView.getId(),
            controller: this
          }).then(function (oMenu) {
            oMenu.openBy(oButton);
            this._oMenuFragment = oMenu;
            return this._oMenuFragment;
          }.bind(this));
        } else {
          this._oMenuFragment.openBy(oButton);
        }
      },

      onExit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },

      onSaveAs: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteSaveAsVariant");
      },


    });
  }
);