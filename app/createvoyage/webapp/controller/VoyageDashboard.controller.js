sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("com.ingenx.nauti.createvoyage.controller.VoyageDashboard", {
            onInit: function () {
 
            },
            onCreateChartering: function () {
                console.log("clicked");
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCreateVoyage");
              },

              onDisplayVoyage: function () {
                console.log("clicked");
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDisplayVoyage");
              },
              onChangeVoyage : function(){
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteChangeVoyage");
              }
              ,
              onVoyageApproval : function(){
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteVoyageApproval");
              }
            
        
        });
    });
 