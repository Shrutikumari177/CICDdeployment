const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIVENDOR_SRV = await cds.connect.to("NAUTIVENDOR_SRV"); 
      srv.on('READ', 'DynamicTableSet', req => NAUTIVENDOR_SRV.run(req.query)); 
      srv.on('READ', 'MasBidTemplateSet', req => NAUTIVENDOR_SRV.run(req.query)); 
}