const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTIZLIVEBID_VEND_SRV = await cds.connect.to("NAUTIZLIVEBID_VEND_SRV"); 
      srv.on('READ', 'getfinalbidSet', req => NAUTIZLIVEBID_VEND_SRV.run(req.query)); 
      srv.on('READ', 'venItemSet', req => NAUTIZLIVEBID_VEND_SRV.run(req.query)); 
      srv.on('READ', 'vendorFinSet', req => NAUTIZLIVEBID_VEND_SRV.run(req.query)); 
      srv.on('READ', 'xNAUTIxnewvendfbid', req => NAUTIZLIVEBID_VEND_SRV.run(req.query)); 
}