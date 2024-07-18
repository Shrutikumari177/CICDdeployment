sap.ui.define([], function () {
    "use strict";
  
    return {
      readEntity: async function (oModel, sPath,  oContext, vSorters, vFilters, mParameters) {
        let oResponse = [];

        // bindList(sPath, oContext?, vSorters?, vFilters?, mParameters?) : sap.ui.model.odata.v4.ODataListBinding

        let oBindList = oModel.bindList(`/${sPath}`, oContext, vSorters, vFilters, mParameters);
        let oBindListResponse = await oBindList.requestContexts(0,Infinity).then(function (aContexts) {
          aContexts.forEach(oContext => {
              console.log(oContext.getObject());
              oResponse.push(oContext.getObject());
          });
        });
  
        return oResponse; 
      },
       
    };
  });
  