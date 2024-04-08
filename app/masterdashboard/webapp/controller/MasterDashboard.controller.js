sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        'sap/ui/core/Fragment',
    ],
    function(BaseController,History,Fragment) {
      "use strict";
  
      return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.MasterDashboard", {
        onInit() {
        },
        navToVoyageType: function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteVoyageType")
        },
        onVesselPress:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteVesselType");
        },
        navToCurrencyType: function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteCurrencyType")
        },
        navToClassMaster: function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteClassMaster");
  
        },
        onBidMaster:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteBidMaster");
        },
        onUoM:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteUoM");
        },
        onCostMaster:function(){
          const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCostMaster");
        },
        onEventMaster:function(){
          const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteEventMaster");
        },
        onCountryMaster:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteCountryMaster");
        },
        onBusinessPartnerPress: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteBusinessPartnerDashboard");
          
        },
       
        onConfigPress: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteConfigReleaseDashboard");
        },
        onPortLoc:function(){
          const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RoutePortLocMaster");
        },
        onRouterMaster:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteRouteMaster");
        },      
        
        onPortMaster:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RoutePortMaster");
        },

        onRefDocIndicator:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteRefDocIndicator");
        },
        
        onApiurl:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteApiUrl");
        },
        
        onUpload:function(){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteUpload");
        },

        onPressHome: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
        },
        onBackPress: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
        },
  
  
  
       
      });    }
  );