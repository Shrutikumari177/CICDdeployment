sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.ingenx.nauti.quotation.controller.QuotationDashboard", {
            onInit: function () {

            },
            onRequestForQuotation: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteRequestForQuotation");
              },
              onCompareRequestForQuotation: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCompareRequestForQuotation");
              },
        });
    });
