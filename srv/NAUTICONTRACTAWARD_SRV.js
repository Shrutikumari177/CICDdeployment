const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTICONTRACTAWARD_SRV = await cds.connect.to("NAUTICONTRACTAWARD_SRV"); 
      srv.on('READ', 'xNAUTIxclosaward_table', req => NAUTICONTRACTAWARD_SRV.run(req.query)); 
}