const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIVOYSTATUS_SRV = await cds.connect.to("NAUTIVOYSTATUS_SRV"); 
      srv.on('READ', 'newallstatusesSet', req => NAUTIVOYSTATUS_SRV.run(req.query)); 
      srv.on('READ', 'voyappstatusSet', req => NAUTIVOYSTATUS_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxallstatuses', req => NAUTIVOYSTATUS_SRV.run(req.query)); 
}