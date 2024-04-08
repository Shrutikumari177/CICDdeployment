sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.BusinessPartnerDashboard", {
        onInit() {
        },
        onBackPress: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteMasterDashboard");
        },
        onPressHome: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
        },
        onBPDetailpress: function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteBPMasterDetails")
        },
        onVendorDataSyncingPress: function() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteVendorDataSyncing");
        },
      });
    }
  );
  