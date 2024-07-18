const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIINVITECOMPARE_SRV = await cds.connect.to("NAUTIINVITECOMPARE_SRV"); 
      srv.on('READ', 'xNAUTIxvendbid_val', req => NAUTIINVITECOMPARE_SRV.run(req.query)); 
}