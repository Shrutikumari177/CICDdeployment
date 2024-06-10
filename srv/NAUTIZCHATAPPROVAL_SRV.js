const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIZCHATAPPROVAL_SRV = await cds.connect.to("NAUTIZCHATAPPROVAL_SRV"); 
      srv.on('READ', 'chartapprSet', req => NAUTIZCHATAPPROVAL_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxchaApp1', req => NAUTIZCHATAPPROVAL_SRV.run(req.query)); 
}