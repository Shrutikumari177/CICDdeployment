const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIZVOY_VALUEHELP_CDS = await cds.connect.to("NAUTIZVOY_VALUEHELP_CDS"); 
      srv.on('READ', 'xNAUTIxvoy_valuehelp', req => NAUTIZVOY_VALUEHELP_CDS.run(req.query)); 
}