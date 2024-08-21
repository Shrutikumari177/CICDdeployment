const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTINAUTICAL_VALUEHELP_SRV = await cds.connect.to("NAUTINAUTICAL_VALUEHELP_SRV"); 
      srv.on('READ', 'xNAUTIxbidprofile_valuehelp', req => NAUTINAUTICAL_VALUEHELP_SRV.run(req.query)); 
}