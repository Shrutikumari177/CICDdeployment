sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },
        initValueHelpModel: function (oModel, sEntitySet, sValueHelpName, sValueLabel,sValueText, skey, sDes) {

            let oValueHelpObject = {};
            oValueHelpObject[sValueHelpName] = [];
            const oValueHelpModel = new JSONModel(oValueHelpObject);
            let oValueHelpContext = oModel.bindList("/" + sEntitySet);
  
            // console.log(sEntitySet,sValueHelpName,sValueLabel, sValueText, skey, sDes);
  
            oValueHelpContext.requestContexts().then(function(context) {
              
              context.forEach(item => {
                // console.log(item.getObject()[skey],item.getObject()[sDes]);
                
                let entry = {};
                entry[sValueLabel] = item.getObject()[skey];
                entry[sValueText] = item.getObject()[sDes];
                // console.log(entry);
                oValueHelpModel.getData()[sValueHelpName].push( entry);
                
              });
              // console.log(oValueHelpModel.getData())
            });
            return oValueHelpModel;
          },
    };
});