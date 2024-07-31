const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTILIVEBID_CONT_SRV = await cds.connect.to("NAUTILIVEBID_CONT_SRV"); 
      srv.on('READ', 'livecontrollerfetchSet', req => NAUTILIVEBID_CONT_SRV.run(req.query)); 
}