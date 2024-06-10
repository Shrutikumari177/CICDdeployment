const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTICHASTATUS_SRV = await cds.connect.to("NAUTICHASTATUS_SRV"); 
      srv.on('READ', 'cha_statusSet', req => NAUTICHASTATUS_SRV.run(req.query)); 
}