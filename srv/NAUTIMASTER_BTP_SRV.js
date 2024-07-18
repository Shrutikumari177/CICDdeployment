const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV"); 
      srv.on('READ', 'xNAUTIxSAPUSERS', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxcury_count', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxuseridassociation', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxUIIDUSRGROUP', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
}