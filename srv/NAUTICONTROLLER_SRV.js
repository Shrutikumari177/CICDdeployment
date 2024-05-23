const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const NAUTICONTROLLER_SRV = await cds.connect.to("NAUTICONTROLLER_SRV"); 
      srv.on('READ', 'BidDataSet', req => NAUTICONTROLLER_SRV.run(req.query)); 
      srv.on('READ', 'BidsSet', req => NAUTICONTROLLER_SRV.run(req.query)); 
}