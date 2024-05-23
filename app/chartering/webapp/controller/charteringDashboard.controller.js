sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.ingenx.nauti.chartering.controller.charteringDashboard", {
            onInit: function () {

            },
            onCreateChartering: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCreateChartering");
              },
              onChangeChartering: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteChangeChartering");
              },
              onDisplayChartering: function(){
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDisplayChartering");
              },
              onCharteringApproval: function(){
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCharteringApproval");
              },
        });
    });
