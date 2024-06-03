sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.ingenx.nauti.report.controller.ReportDashboard", {
            onInit: function () {
                
            },
            onContractAwardStatusReport: function() {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteContractAwardStatusReport");
            },
            onBiddingHistoryReport: function() {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteBiddingHistoryReport");
            }
        });
    });