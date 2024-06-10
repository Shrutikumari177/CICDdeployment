const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIBTP_NAUTICAL_TRANSACTIO_SRV = await cds.connect.to("NAUTIBTP_NAUTICAL_TRANSACTIO_SRV"); 
      srv.on('READ', 'xNAUTIxCHARTERINGVALUEHELP', req => NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.run(req.query)); 
}