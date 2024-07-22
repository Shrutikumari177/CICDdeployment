const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIZNAUTIFILEUPL_VOY_SRV = await cds.connect.to("NAUTIZNAUTIFILEUPL_VOY_SRV"); 
      srv.on('READ', 'FileuploadSet', req => NAUTIZNAUTIFILEUPL_VOY_SRV.run(req.query)); 
      srv.on('READ', 'downloadSet', req => NAUTIZNAUTIFILEUPL_VOY_SRV.run(req.query)); 
}