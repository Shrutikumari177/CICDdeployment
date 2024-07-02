const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV"); 
      srv.on('READ', 'xNAUTIxCountrySetFetch', req => NAUTIMASTER_BTP_SRV.run(req.query)); 
}