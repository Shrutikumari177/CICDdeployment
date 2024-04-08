const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV"); 
      srv.on('READ', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'BusinessPartnerSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CountrySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'ZBTP_NAUTICAL_CURRENCY', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'country_updSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxVOY', req => NAUTIMASTER_BTP_SRV.run(req.query));

      srv.on('CREATE', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'BusinessPartnerSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'CountrySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'CurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'ZBTP_NAUTICAL_CURRENCY', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'country_updSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'xNAUTIxVOY', req => NAUTIMASTER_BTP_SRV.run(req.query));

      srv.on('UPDATE', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'BusinessPartnerSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'CountrySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'CurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'ZBTP_NAUTICAL_CURRENCY', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'country_updSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'xNAUTIxVOY', req => NAUTIMASTER_BTP_SRV.run(req.query));

      srv.on('DELETE', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'BusinessPartnerSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'CountrySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'CurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'ZBTP_NAUTICAL_CURRENCY', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'country_updSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'xNAUTIxVOY', req => NAUTIMASTER_BTP_SRV.run(req.query));

      
      const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV"); 
      srv.on('READ',  'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('READ', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));
      
      srv.on('CREATE',  'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('CREATE', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));

      srv.on('UPDATE',  'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('UPDATE', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));

      srv.on('DELETE',  'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
      srv.on('DELETE', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));
}