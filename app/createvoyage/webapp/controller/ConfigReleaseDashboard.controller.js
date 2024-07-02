sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.ConfigReleaseDashboard", {
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
        onConfigMaintainGroup:function(){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteConfigMaintainGroup");
          },
          onConfigVoyage:function(){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteConfigVoyage");
          },
          onConfigChartering:function(){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteConfigChartering");
          },
    
      });
    }
  );
  