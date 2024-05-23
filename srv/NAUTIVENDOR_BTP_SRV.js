const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIVENDOR_BTP_SRV = await cds.connect.to("NAUTIVENDOR_BTP_SRV"); 
      srv.on('READ', 'xNAUTIxvend_btp', req => NAUTIVENDOR_BTP_SRV.run(req.query)); 
}