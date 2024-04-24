const cds = require('@sap/cds');

module.exports = async (srv) => 
{  
  const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV"); 
  srv.on('READ', 'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('READ', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));

  srv.on('CREATE', 'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('CREATE', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));

  srv.on('UPDATE', 'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('UPDATE', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));

  srv.on('DELETE', 'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'CarTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'CargoUnitSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'CurTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'GtTabSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'GtPlanSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'VoyTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'ZCalculateSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 
  srv.on('DELETE', 'ZCreatePlanSet', req => NAUTINAUTICALCV_SRV.run(req.query));

  const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV"); 
      srv.on('READ', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxBusinessPartner1', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxvend_btp', req => NAUTIMASTER_BTP_SRV.run(req.query)); 

      srv.on('CREATE', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'xNAUTIxBusinessPartner1', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('CREATE', 'xNAUTIxvend_btp', req => NAUTIMASTER_BTP_SRV.run(req.query)); 

      srv.on('UPDATE', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'xNAUTIxBusinessPartner1', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('UPDATE', 'xNAUTIxvend_btp', req => NAUTIMASTER_BTP_SRV.run(req.query));

      srv.on('DELETE', 'BidMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'ClassMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'CostMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'CountryMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'EventMasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'MaintainGroupSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'UOMSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'StandardCurrencySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'ReleaseStrategySet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'VoyageRealeaseSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'RefrenceDocumentSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'PortmasterSet', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'xNAUTIxMASBID', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'xNAUTIxBusinessPartner1', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('DELETE', 'xNAUTIxvend_btp', req => NAUTIMASTER_BTP_SRV.run(req.query)); 

  const NAUTIMARINE_TRAFFIC_API_SRV = await cds.connect.to("NAUTIMARINE_TRAFFIC_API_SRV"); 
  srv.on('READ', 'EsPathCollection', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('READ', 'PortMasterSet', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('READ', 'es_port_master', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('READ', 'es_route_map', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 

  srv.on('CREATE', 'EsPathCollection', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('CREATE', 'PortMasterSet', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('CREATE', 'es_port_master', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('CREATE', 'es_route_map', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query));

  srv.on('UPDATE', 'EsPathCollection', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('UPDATE', 'PortMasterSet', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('UPDATE', 'es_port_master', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('UPDATE', 'es_route_map', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query));

  srv.on('DELETE', 'EsPathCollection', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('DELETE', 'PortMasterSet', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('DELETE', 'es_port_master', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query)); 
  srv.on('DELETE', 'es_route_map', req => NAUTIMARINE_TRAFFIC_API_SRV.run(req.query));

  const NAUTIBTP_NAUTICAL_TRANSACTIO_SRV = await cds.connect.to("NAUTIBTP_NAUTICAL_TRANSACTIO_SRV"); 
  srv.on('READ', 'xNAUTIxVOYAGEHEADERTOITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('READ', 'xNAUTIxCOSTCHARGES', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('READ', 'xNAUTIxVoygItem', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('READ', 'xNAUTIxBIDITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 


  srv.on('CREATE', 'xNAUTIxVOYAGEHEADERTOITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('CREATE', 'xNAUTIxCOSTCHARGES', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('CREATE', 'xNAUTIxVoygItem', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query));
  srv.on('CREATE', 'xNAUTIxBIDITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 

  srv.on('UPDATE', 'xNAUTIxVOYAGEHEADERTOITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('UPDATE', 'xNAUTIxCOSTCHARGES', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('UPDATE', 'xNAUTIxVoygItem', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query));
  srv.on('UPDATE', 'xNAUTIxBIDITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 



  srv.on('UPDATE', 'xNAUTIxVOYAGEHEADERTOITEM', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('UPDATE', 'xNAUTIxCOSTCHARGES', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
  srv.on('UPDATE', 'xNAUTIxVoygItem', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 



}