const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV"); 
      srv.on('READ', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'BusinessPartnerSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CountrySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'PortmasterUpdateSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'RelStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxBusinessPartner1', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxSAPUSERS', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxUIIDUSRGROUP', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxVOY', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxuseridassociation', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxvend_btp', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'country_updSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'GROUPIDSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'GROUPIDUSERSSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
}