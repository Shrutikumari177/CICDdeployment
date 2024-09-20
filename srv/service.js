const cds = require('@sap/cds');
const xsenv = require("@sap/xsenv");
const axios = require('axios');
const {
    sendMail
} = require("@sap-cloud-sdk/mail-client");

module.exports = async (srv) => {

    // Connect to services
    const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV");
    const NAUTIUSERMAILID_SRV = await cds.connect.to("NAUTIUSERMAILID_SRV");
    srv.on('READ', 'xNAUTIxuserEmail', req => NAUTIUSERMAILID_SRV.run(req.query));
    const NAUTICONTRACTAWARD_SRV = await cds.connect.to("NAUTICONTRACTAWARD_SRV");
    srv.on('READ', 'xNAUTIxawardReportFinal', req => NAUTICONTRACTAWARD_SRV.run(req.query));
    srv.on('READ', 'contaward_tableSet', req => NAUTICONTRACTAWARD_SRV.run(req.query)); 
    srv.on('READ', 'awardcontractSet', req => NAUTICONTRACTAWARD_SRV.run(req.query)); 
    srv.on('READ', 'xNAUTIxclosaward_table', req => NAUTICONTRACTAWARD_SRV.run(req.query)); 

    

    srv.on('CREATE', 'awardcontractSet', req => NAUTICONTRACTAWARD_SRV.run(req.query)); 
    const NAUTINAUTICAL_VALUEHELP_SRV = await cds.connect.to("NAUTINAUTICAL_VALUEHELP_SRV"); 
    srv.on('READ', 'xNAUTIxbidprofile_valuehelp', req => NAUTINAUTICAL_VALUEHELP_SRV.run(req.query)); 
    srv.on('READ', 'xNAUTIxcostprof_valuehelp', req => NAUTINAUTICAL_VALUEHELP_SRV.run(req.query)); 
    srv.on('READ', 'xNAUTIxcostprof_ass', req => NAUTINAUTICAL_VALUEHELP_SRV.run(req.query)); 




    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV");
   



    const NAUTIMARINE_TRAFFIC_API_SRV = await cds.connect.to("NAUTIMARINE_TRAFFIC_API_SRV");
    const NAUTIBTP_NAUTICAL_TRANSACTIO_SRV = await cds.connect.to("NAUTIBTP_NAUTICAL_TRANSACTIO_SRV");
    const NAUTIZVOYAPPROVAL_SRV = await cds.connect.to("NAUTIZVOYAPPROVAL_SRV");
    const NAUTIZVOY_VALUEHELP_CDS = await cds.connect.to("NAUTIZVOY_VALUEHELP_CDS");
    const NAUTIZCHATAPPROVAL_SRV = await cds.connect.to("NAUTIZCHATAPPROVAL_SRV");
    const NAUTICHASTATUS_SRV = await cds.connect.to("NAUTICHASTATUS_SRV");

    const NAUTIVENDOR_SRV = await cds.connect.to("NAUTIVENDOR_SRV");
    const NAUTICOMP_QUOT_SRV = await cds.connect.to("NAUTICOMP_QUOT_SRV");

    const NAUTIZNAUTIFILEUPL_VOY_SRV = await cds.connect.to("NAUTIZNAUTIFILEUPL_VOY_SRV");

    const NAUTIVOYSTATUS_SRV = await cds.connect.to("NAUTIVOYSTATUS_SRV");
    srv.on('READ', 'voyappstatusSet', req => NAUTIVOYSTATUS_SRV.run(req.query));
    srv.on('READ', 'newallstatusesSet', req => NAUTIVOYSTATUS_SRV.run(req.query));
    srv.on('READ', 'xNAUTIxallstatuses', req => NAUTIVOYSTATUS_SRV.run(req.query));
    srv.on('CREATE', 'newallstatusesSet', req => NAUTIVOYSTATUS_SRV.run(req.query));
    srv.on('UPDATE', 'newallstatusesSet', req => NAUTIVOYSTATUS_SRV.run(req.query));

    const NAUTIZLIVEBID_VEND_SRV = await cds.connect.to("NAUTIZLIVEBID_VEND_SRV");



    const NAUTILIVEBID_CONT_SRV = await cds.connect.to("NAUTILIVEBID_CONT_SRV");

    const INGXTCONTROLLER_SRV = await cds.connect.to("INGXTCONTROLLER_SRV");
    srv.on('READ', 'BidsSet', req => INGXTCONTROLLER_SRV.run(req.query));
    // srv.on('READ', 'xNAUTIxfinalbid', req => NAUTICOMP_QUOT_SRV.run(req.query));
    // srv.on('CREATE', 'xNAUTIxfinalbid', req => NAUTICOMP_QUOT_SRV.run(req.query));

    const NAUTIINVITECOMPARE_SRV = await cds.connect.to("NAUTIINVITECOMPARE_SRV");
    srv.on('READ', 'headerinvSet', req => NAUTIINVITECOMPARE_SRV.run(req.query));
    srv.on('READ', 'iteminvSet', req => NAUTIINVITECOMPARE_SRV.run(req.query));

    srv.on('CREATE', 'headerinvSet', req => NAUTIINVITECOMPARE_SRV.run(req.query));
    srv.on('CREATE', 'iteminvSet', req => NAUTIINVITECOMPARE_SRV.run(req.query));

    srv.on('READ', 'xNAUTIxitemBid', req => NAUTICOMP_QUOT_SRV.run(req.query));
    srv.on('READ', 'xNAUTIxvenBid', req => NAUTICOMP_QUOT_SRV.run(req.query));
    srv.on('READ', 'xNAUTIxvendbid_val', req => NAUTIINVITECOMPARE_SRV.run(req.query));


    const NAUTIVENDOR_BTP_SRV = await cds.connect.to("NAUTIVENDOR_BTP_SRV");
    srv.on('READ', 'xNAUTIxvend_btp', req => NAUTIVENDOR_BTP_SRV.run(req.query));
    srv.on('READ', 'xNAUTIxnewvend_btp', req => NAUTIVENDOR_BTP_SRV.run(req.query));
     
    srv.on('CREATE', 'vendorFinSet', async function(req) {
        try {
            const { Chrnmin, venToItem } = req.data;
    
            console.log("Received chartering:", Chrnmin);
            console.log("Received array:", venToItem);
            console.log("Received payload:", req.data);
    
            const vendorLiveBidDetails = Chrnmin 
                ? await SELECT.from('nauticalservice.VenodrLiveBidDetails').where({ Chrnmin }) 
                : await SELECT.from('nauticalservice.VenodrLiveBidDetails');
    
            let vendorMap = {};
            vendorLiveBidDetails.forEach(item => {
                if (!vendorMap[item.vendorNo]) {
                    vendorMap[item.vendorNo] = [];
                }
                vendorMap[item.vendorNo].push(item);
            });
    
            let processedItems = [];
            Object.keys(vendorMap).forEach(vendorNo => {
                let vendorEntries = vendorMap[vendorNo];
                vendorEntries.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)); 
    
                vendorEntries.forEach((entry, index) => {
                    let stat = index === 0 ? "CLOS" : "ON"; 
    
                    let biddate = entry.modifiedAt.split('T')[0]; 
                    let bidtime = entry.modifiedAt.split('T')[1].split('Z')[0];
    
                    processedItems.push({
                        ...entry,
                        Stat: stat,
                        Biddate: biddate,
                        Bidtime: bidtime
                    });
                });
            });
    
            let finalItems = processedItems.map(item => {
                return {
                    Voyno: item.voyno,
                    Lifnr: item.vendorNo,
                    Zcode: "FREIG",
                    Chrnmin: Chrnmin,
                    Biddate: item.Biddate, 
                    Bidtime: item.Bidtime, 
                    CodeDesc: "FRIEGHT COST",
                    Value: "",
                    Cvalue: item.quotationPrice,
                    Cunit: venToItem[0].Cunit,
                    Chrqsdate: venToItem[0].Chrqsdate,
                    Chrqstime: venToItem[0].Chrqstime,
                    Chrqedate: venToItem[0].Chrqedate,
                    Chrqetime: venToItem[0].Chrqetime,
                    DoneBy: true,
                    Stat: item.Stat,
                    Zmode: "AUTO",
                    Zcom: item.comment,
                };
            });
    
            let finalData = {
                Chrnmin: Chrnmin,
                venToItem: finalItems
            };
    
            req.data.venToItem = finalData.venToItem;
    
            // console.log("Final data to be posted:", req.data);
            // console.log("Complete data of this payload:", finalData);
    
            let res = await NAUTIZLIVEBID_VEND_SRV.run(req.query);
            console.log("Posting response:", res);
    
            return res; 
        } catch (error) {
            console.error("Error in CREATE handler:", error);
            req.error(500, "Error while posting data");
        }
    });

    srv.on('READ', 'quotations', async function (req) {
        let response = await SELECT.from('nauticalservice.quotations');
        console.log("response", response);

        return response;
    });

    srv.on('UPDATE', 'quotations', async (req) => {
        try {
            // Extract key parameters from the request URL
            const {
                Lifnr,
                Voyno,
                Chrnmin
            } = req.params[0];

            // Log the extracted key parameters
            console.log("Key Parameters:", {
                Lifnr,
                Voyno,
                Chrnmin
            });

            // Create the where condition object
            const whereCondition = {
                Lifnr,
                Voyno,
                Chrnmin
            };

            // Extract and log the values to be updated from the request body
            const updateData = req.data;
            console.log("Update Data:", updateData);

            // Perform the update operation
            const affectedRows = await cds.transaction(req).run(
                UPDATE('nauticalservice.quotations')
                .set(updateData)
                .where(whereCondition)
            );

            // Log and return the number of affected rows
            console.log("Number of rows affected:", affectedRows);

            return affectedRows;
        } catch (error) {
            console.error("Error during update:", error);
            req.error({
                code: 500,
                message: "Internal server error during update operation"
            });
        }
    });
    srv.on('READ', 'ControllerLiveBidDetails', async function (req) {

        console.log("Triggered....", req.data);

        let Chrnmin;
        let currentQuotedRes = [];

        // Check if the filter is provided and extract the Chrnmin value
        if (req._queryOptions && req._queryOptions.$filter) {
            Chrnmin = req._queryOptions.$filter.split(' ')[2];
            Chrnmin = Chrnmin.replace(/'/g, '');
        }

        // Fetch all data with the given Chrnmin or all data if no Chrnmin filter is provided
        let ControllerLiveBidData = Chrnmin ? await SELECT.from('nauticalservice.ControllerLiveBidDetails').where({
            Chrnmin
        }) : await SELECT.from('nauticalservice.ControllerLiveBidDetails');
        ControllerLiveBidData = ControllerLiveBidData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log("response", ControllerLiveBidData);
        if (Chrnmin) {
            currentQuotedRes.push(ControllerLiveBidData[0])
            return currentQuotedRes;
        }

        return ControllerLiveBidData;
    });


    srv.on('READ', 'VenodrLiveBidDetails', async function (req) {
        console.log("Triggered....", req.data);

        let Chrnmin;

        // Check if the filter is provided and extract the Chrnmin value
        if (req._queryOptions && req._queryOptions.$filter) {
            Chrnmin = req._queryOptions.$filter.split(' ')[2];
            Chrnmin = Chrnmin.replace(/'/g, '');
        }

        // Fetch all data with the given Chrnmin or all data if no Chrnmin filter is provided
        const allData = Chrnmin ? await SELECT.from('nauticalservice.VenodrLiveBidDetails').where({
            Chrnmin
        }) : await SELECT.from('nauticalservice.VenodrLiveBidDetails');

        // Filter the latest entry for each vendorNo
        const latestEntries = allData.reduce((acc, current) => {
            const existingEntry = acc.find(entry => entry.vendorNo === current.vendorNo);
            if (!existingEntry || new Date(existingEntry.createdAt) < new Date(current.createdAt)) {
                acc = acc.filter(entry => entry.vendorNo !== current.vendorNo);
                acc.push(current);
            }
            return acc;
        }, []);

        console.log("response", latestEntries);

        return latestEntries;
    });

    srv.on('READ', 'CompareLiveFreight', async (req) => {
        try {
            console.log("Triggered....", req.data);
            console.log("Filter:", req._queryOptions.$filter);

            let Chrnmin = req._queryOptions.$filter.split(' ')[2];
            Chrnmin = Chrnmin.replace(/'/g, '');

            const charminData = await NAUTICONTRACTAWARD_SRV.run(SELECT.from('xNAUTIxcomparelivereport').where({
                Chrnmin
            }));
            console.log("charminData ", charminData);
            if (!charminData || charminData.length === 0) {
                console.error(`No data found for Chrnmin: ${Chrnmin}`);
                return [];
            }

            const Voyno = charminData[0].Voyno;
            if (!Voyno) {
                console.error(`No Voyno found for Chrnmin: ${Chrnmin}`);
                return [];
            }

            const voyageData = await NAUTICOMP_QUOT_SRV.run(SELECT.from('xNAUTIxitemBid').where({
                Voyno
            }));
            if (!voyageData || voyageData.length === 0) {
                console.error(`No voyage data found for Voyno: ${Voyno}`);
                return [];
            }
            console.log("voyageData", voyageData);
            const rankedVendors = calculateAndRankAward(voyageData, charminData);
            return rankedVendors;
        } catch (error) {
            console.error("Error processing request:", error);
            return [];
        }
    });
   

  function calculateAndRankAward(voyageData, charminData) {

        const vendorScores = calculateScoresAward(voyageData, charminData);

        const rankedVendors = rankVendorsAward(vendorScores, charminData);

        const rankedWithCommercial = calculateCommercialRankAward(rankedVendors);
 
        const groupedRankedVendors = groupedByVoynoAndChrnminAward(rankedWithCommercial);
 
        return groupedRankedVendors;

    }
 
    function calculateScoresAward(voyageData, charminData) {

        const vendorScores = {};
 
        charminData.forEach(vendor => {

            if (!vendorScores[vendor.Lifnr]) {

                vendorScores[vendor.Lifnr] = {

                    Voyno: vendor.Voyno,

                    Chrnmin: vendor.Chrnmin,

                    score: 0,

                    eligible: "Yes",

                    Cvalue: vendor.Cvalue,

                    bidDetails: []

                };

            }
 
            const expected = voyageData.find(v => v.Zcode === vendor.Zcode && v.Voyno === vendor.Voyno);

            if (expected) {

                let fScore;

                if ((expected.Mand === "X" || expected.Must === "X") && expected.Value !== vendor.Value) {

                    vendorScores[vendor.Lifnr].eligible = "No";

                    fScore = 0;

                } else {

                    const score = expected.Value === vendor.Value ? parseInt(expected.Zmax) : parseInt(expected.Zmin);

                    vendorScores[vendor.Lifnr].score += score;

                    fScore = score;

                }

                vendorScores[vendor.Lifnr].bidDetails.push({

                    CodeDesc: expected.CodeDesc,

                    Value: vendor.Value,

                    Cvalue: vendor.Cvalue,

                    fScore: fScore

                });

            }

        });
 
        return vendorScores;

    }
 
    function rankVendorsAward(vendorScores, charminData) {

        const rankedVendors = Object.keys(vendorScores)

            .map(vendor => ({

                vendorId: vendor,

                Voyno: vendorScores[vendor].Voyno,

                Chrnmin: vendorScores[vendor].Chrnmin,

                score: vendorScores[vendor].score,

                eligible: vendorScores[vendor].eligible,

                Cvalue: vendorScores[vendor].Cvalue,

                bidDetails: vendorScores[vendor].bidDetails

            }))

            .sort((a, b) => b.score - a.score);
 
        let rankCounter = {};

        rankedVendors.forEach(vendor => {

            const key = `${vendor.Voyno}-${vendor.Chrnmin}`;

            if (!rankCounter[key]) {

                rankCounter[key] = 1;

            }

            vendor.Trank = `T${rankCounter[key]++}`;

        });
 
        return rankedVendors;

    }
 
    function calculateCommercialRankAward(rankedVendors) {

        const groupedByChrnmin = rankedVendors.reduce((acc, vendor) => {

            if (!acc[vendor.Chrnmin]) {

                acc[vendor.Chrnmin] = [];

            }

            acc[vendor.Chrnmin].push(vendor);

            return acc;

        }, {});
 
        Object.keys(groupedByChrnmin).forEach(key => {

            groupedByChrnmin[key].sort((a, b) => a.Cvalue - b.Cvalue);
 
            groupedByChrnmin[key].forEach((vendor, index) => {

                vendor.Crank = `C${index + 1}`;

            });

        });
 
        return rankedVendors;

    }
 
    function groupedByVoynoAndChrnminAward(rankedVendors) {

        const grouped = {};
 
        rankedVendors.forEach(vendor => {

            const key = `${vendor.Voyno}-${vendor.Chrnmin}`;

            if (!grouped[key]) {

                grouped[key] = {

                    Voyno: vendor.Voyno,

                    Chrnmin: vendor.Chrnmin,

                    Vendors: []

                };

            }

            grouped[key].Vendors.push({

                vendorId: vendor.vendorId,

                score: vendor.score,

                eligible: vendor.eligible,

                Trank: vendor.Trank,

                Crank: vendor.Crank,

                bidDetails: vendor.bidDetails

            });

        });
 
        return Object.values(grouped);

    };
    srv.on('READ', 'calculateRankings', async (req) => {
        try {
            console.log("Triggered....", req.data);
            console.log("Filter:", req._queryOptions.$filter);

            let Chrnmin = req._queryOptions.$filter.split(' ')[2];
            Chrnmin = Chrnmin.replace(/'/g, '');

            const charminData = Chrnmin ? await SELECT.from('nauticalservice.quotations').where({
                Chrnmin
            }) : await SELECT.from('nauticalservice.quotations');

            if (!charminData || charminData.length === 0) {
                console.error(`No data found for Chrnmin: ${Chrnmin}`);
                return [];
            }

            const Voyno = charminData[0].Voyno;
            if (!Voyno) {
                console.error(`No Voyno found for Chrnmin: ${Chrnmin}`);
                return [];
            }

            const voyageData = await NAUTICOMP_QUOT_SRV.run(SELECT.from('xNAUTIxitemBid').where({
                Voyno
            }));
            if (!voyageData || voyageData.length === 0) {
                console.error(`No voyage data found for Voyno: ${Voyno}`);
                return [];
            }

            const rankedVendors = calculateAndRank(voyageData, charminData);
            return rankedVendors;
        } catch (error) {
            console.error("Error processing request:", error);
            return [];
        }
    });

    function calculateAndRank(voyageData, charminData) {
        const vendorScores = calculateScores(voyageData, charminData);
        const rankedVendors = rankByTechnicalScore(vendorScores);
        const rankedWithCommercial = rankByCommercialValue(rankedVendors);
        return groupedByVoynoAndChrnmin(rankedWithCommercial);
    }

   

    function calculateScores(voyageData, charminData) {
        const vendorScores = new Map();
        const voyageDataMap = new Map(voyageData.map(v => [`${v.Zcode}-${v.Voyno}`, v]));
    
        charminData.forEach(vendor => {
            const vendorScore = vendorScores.get(vendor.Lifnr) || {
                vendorId: vendor.Lifnr,
                vendorName: vendor.vendorName,
                Voyno: vendor.Voyno,
                Chrnmin: vendor.Chrnmin,
                score: 0,
                eligible: "Yes",
                Cvalue: vendor.to_quote_item.map(item => item.Cvalue),
                bidDetails: []
            };
    
            vendor.to_quote_item.forEach(quoteItem => {
                const expected = voyageDataMap.get(`${quoteItem.Zcode}-${vendor.Voyno}`);
                if (expected) {
                    let fScore = 0;
                    if ((expected.Mand === "X" || expected.Must === "X") && expected.Value !== quoteItem.Value) {
                        vendorScore.eligible = "No";
                        fScore = 0;
                    } else {
                        let score = 0;
    
                       
                        const isExpectedDate = !isNaN(parseDate(expected.Value));
                        const isQuoteItemDate = !isNaN(Date.parse(quoteItem.Value));
    
                        if (isExpectedDate && isQuoteItemDate) {
                            const expectedDate = parseDate(expected.Value);
                            const quoteItemDate = new Date(quoteItem.Value);
    
                         
                            if (quoteItemDate < expectedDate) {
                                score = parseInt(expected.Zmin); // Assign Zmin if quoted date is earlier
                            } else if (quoteItemDate >= expectedDate) {
                                score = parseInt(expected.Zmax); // Assign Zmax if quoted date is equal or later
                            }
    
                           
                        } else {
                          
                            score = expected.Value === quoteItem.Value ? parseInt(expected.Zmax) : parseInt(expected.Zmin);
                            
                           
                        }
    
                        vendorScore.score += score;
                        fScore = score;
                    }
    
                    // Push bid details
                    vendorScore.bidDetails.push({
                        CodeDesc: expected.CodeDesc,
                        Value: quoteItem.Value,
                        Cvalue: quoteItem.Cvalue,
                        fScore: fScore
                    });
                }
            });
    
            vendorScores.set(vendor.Lifnr, vendorScore);
        });
    
        return Array.from(vendorScores.values());
    }
    
  
    function parseDate(dateString) {
        const [day, month, year] = dateString.split('.');
        return new Date(`${year}-${month}-${day}`); 
    }
    
    
  
    

    function rankByTechnicalScore(vendorScores) {
        const rankedVendors = vendorScores
            .map(vendor => ({
                ...vendor,
                Trank: ''
            }))
            .sort((a, b) => b.score - a.score); // Sort by technical score descending

        const rankCounter = new Map();
        rankedVendors.forEach(vendor => {
            const key = `${vendor.Voyno}-${vendor.Chrnmin}`;
            const count = rankCounter.get(key) || 1;
            vendor.Trank = `T${count}`;
            rankCounter.set(key, count + 1);
        });

        return rankedVendors;
    }

    function rankByCommercialValue(rankedVendors) {
        const groupedByChrnmin = rankedVendors.reduce((acc, vendor) => {
            if (!acc[vendor.Chrnmin]) acc[vendor.Chrnmin] = [];
            acc[vendor.Chrnmin].push(vendor);
            return acc;
        }, {});

        Object.keys(groupedByChrnmin).forEach(key => {
            groupedByChrnmin[key].forEach(vendor => {
                vendor.originalBid = vendor.bidDetails.find(detail => detail.CodeDesc === "FREIGHT")?.Value || "N/A";
            });
            groupedByChrnmin[key].sort((a, b) => parseFloat(a.originalBid) - parseFloat(b.originalBid)); // Sort by freight cost ascending
            groupedByChrnmin[key].forEach((vendor, index) => vendor.Crank = `C${index + 1}`);
        });

        return rankedVendors.map(vendor => ({
            ...vendor,
            Crank: groupedByChrnmin[vendor.Chrnmin].find(v => v.vendorId === vendor.vendorId).Crank
        }));
    }

    function groupedByVoynoAndChrnmin(rankedVendors) {
        const grouped = rankedVendors.reduce((acc, vendor) => {
            const key = `${vendor.Voyno}-${vendor.Chrnmin}`;
            if (!acc[key]) acc[key] = {
                Voyno: vendor.Voyno,
                Chrnmin: vendor.Chrnmin,
                Vendors: []
            };
            acc[key].Vendors.push({
                vendorId: vendor.vendorId,
                vendorName: vendor.vendorName,
                score: vendor.score,
                eligible: vendor.eligible,
                Trank: vendor.Trank,
                Crank: vendor.Crank,
                bidDetails: vendor.bidDetails
            });
            return acc;
        }, {});

        return Object.values(grouped);
    }



  


    srv.on('CREATE', "sendEmail", async (req) => {
        try {
            console.log("Triggered....", req.data);


            const {
                message,
                receiversEmails,
                vendorsName,
                routes,
                bidStart,
                bidEnd,
                cargoSize,
                bidstartTime,
                bidEndTime
            } = req.data;

            let emailPromises = receiversEmails.map(async (receiverEmail, index) => {
                let mailConfig;

                if (message === "Invitation for Live Quotation") {
                    mailConfig = {
                        from: "josiah.homenick1@ethereal.email",
                        to: receiverEmail,
                        subject: `Invitation for Live Quotation`,
                        text: `
            Dear ${vendorsName[index]},
   
            You are invited to participate in a live quotation event for the following details:
   
            - Bid Start Date: ${new Date(bidStart).toLocaleDateString()} at ${bidstartTime}
            - Bid End Date: ${new Date(bidEnd).toLocaleDateString()} at ${bidEndTime}
   
            Best regards,
            Ingenx Technology Private Limited
        `
                    };
                } else {
                    mailConfig = {
                        from: "nikki51@ethereal.email",
                        to: receiverEmail,
                        subject: `Submit a Quotation for ${cargoSize} tons of Cargo via Route "${routes[index]}"`,
                        text: `
            Dear ${vendorsName[index]},
   
            Please submit your quotation for the following cargo details:
   
            - Cargo Size: ${cargoSize} tons
            - Route: ${routes[index]}
            - Bid Start Date: ${new Date(bidStart).toLocaleDateString()} at ${bidstartTime}
            - Bid End Date: ${new Date(bidEnd).toLocaleDateString()} at ${bidEndTime}
   
            Best regards,
            Ingenx Technology Private Limited
        `
                    };
                }
                let res = await sendMail({
                    destinationName: "mailDestination"
                }, mailConfig);
                console.log(`Email sent to ${vendorsName[index]} (${receiverEmail}) - Response:`, res);
                return {
                    "message": `Email sent successfully to ${vendorsName[index]}`,
                    "status": 201
                };
            });

            let results = await Promise.all(emailPromises);
            return results;
        } catch (error) {
            console.log(error);
            return [{
                "message": "Failed to send email",
                "status": 500
            }];
        }
    });
    srv.on('CREATE', "sendEmail", async (req) => {
        try {
            console.log("Triggered....", req.data);


            const {
                receiversEmails,
                vendorsName,
                routes,
                bidStart,
                bidEnd,
                cargoSize,
                bidstartTime,
                bidEndTime
            } = req.data;



            let emailPromises = receiversEmails.map(async (receiverEmail, index) => {
                const mailConfig = {
                    from: "nikki51@ethereal.email",
                    to: receiverEmail,
                    subject: `You are invited to submit a quotation for the following cargo size "${cargoSize}" for shipping of ship route "${routes[index]}"`,
                    text: `
                        Dear ${vendorsName[index]},
       
                        You are invited to submit a quotation for the following cargo:
       
                        Vendors: ${vendorsName[index]}
                        Routes: ${routes[index]}
                        Bid Start Date: ${new Date(bidStart).toLocaleDateString()}
                        Bid start Time : ${bidstartTime}
                        Bid End Date: ${new Date(bidEnd).toLocaleDateString()}
                        Bid End Time :${bidEndTime}
                        Cargo Size: ${cargoSize} tons
                       
 
                        Best regards,
                        Your Company
                    `
                };

                let res = await sendMail({
                    destinationName: "mailDestination"
                }, mailConfig);
                console.log(`Email sent to ${vendorsName[index]} (${receiverEmail}) - Response:`, res);
                return {
                    "message": `Email sent successfully to ${vendorsName[index]}`,
                    "status": 201
                };
            });

            let results = await Promise.all(emailPromises);
            return results;
        } catch (error) {
            console.log(error);
            return [{
                "message": "Failed to send email",
                "status": 500
            }];
        }
    });
   


    registerHandlers(srv, NAUTILIVEBID_CONT_SRV, [
        'contheaderSet', 'contItemSet', 'livecontrollerfetchSet'
    ]);
    registerHandlers(srv, NAUTICHASTATUS_SRV, [
        'cha_statusSet'
    ])
    registerHandlers(srv, NAUTICOMP_QUOT_SRV, [
        'xNAUTIxcomp_quot', 'xNAUTIxfinalbid', 'xNAUTIxitemBid', 'xNAUTIxvenBid'
    ])

    registerHandlers(srv, NAUTIZCHATAPPROVAL_SRV, ['xNAUTIxchaApp1', 'chartapprSet']);
    registerHandlers(srv, NAUTIZLIVEBID_VEND_SRV, ['getfinalbidSet', 'venItemSet','vendorFinSet','xNAUTIxnewvendfbid']);


    registerHandlers(srv, NAUTIZVOY_VALUEHELP_CDS, ['xNAUTIxvoy_valuehelp']);
    registerHandlers(srv, NAUTIZNAUTIFILEUPL_VOY_SRV, ['FileuploadSet']);


    registerHandlers(srv, NAUTIVENDOR_SRV, [
        'MasBidTemplateSet', 'DynamicTableSet', 'ITEM_BIDSet', 'PortsSet'
    ]);
    // Register handlers for NAUTIZVOYAPPROVAL_SRV entities
    registerHandlers(srv, NAUTIZVOYAPPROVAL_SRV, [
        'voyapprovalSet', 'xNAUTIxvoyapproval1', 'xNAUTIxgetvoyapproval'
    ]);

    // Register handlers for NAUTINAUTICALCV_SRV entities
    registerHandlers(srv, NAUTINAUTICALCV_SRV, [
        'BidTypeSet', 'CarTypeSet', 'CargoUnitSet', 'CurTypeSet',
        'GtTabSet', 'GtPlanSet', 'VoyTypeSet', 'ZCalculateSet', 'ZCreatePlanSet'
    ]);

    // Register handlers for NAUTIMASTER_BTP_SRV entities
    registerHandlers(srv, NAUTIMASTER_BTP_SRV, [
        'PortmasterUpdateSet', 'BidMasterSet', 'ClassMasterSet', 'CostMasterSet', 'CountryMasterSet', 'xNAUTIxcury_count', 'BusinessPartnerSet',
        'EventMasterSet', 'MaintainGroupSet', 'UOMSet', 'StandardCurrencySet', 'xNAUTIxportmascds', 'xNAUTIxSAPUSERS',
        'ReleaseStrategySet', 'VoyageRealeaseSet', 'RefrenceDocumentSet', 'xNAUTIxCountrySetFetch',
        'PortmasterSet', 'xNAUTIxMASBID', 'xNAUTIxBusinessPartner1', 'xNAUTIxvend_btp', 'RelStrategySet', 'CountrySet', 'xNAUTIxStandardCurrencyFetch', 'xNAUTIxUIIDUSRGROUP', 'xNAUTIxnewportcds',
        'xNAUTIxSAPUSERS', 'xNAUTIxcury_count', 'xNAUTIxuseridassociation', 'xNAUTIxUIIDUSRGROUP', 'costProfileSet'
    ]);


    // Register handlers for NAUTIMARINE_TRAFFIC_API_SRV entities
    registerHandlers(srv, NAUTIMARINE_TRAFFIC_API_SRV, ['EsPathCollection', 'PortMasterSet', 'es_port_master', 'es_route_map']);

    // Register handlers for NAUTIBTP_NAUTICAL_TRANSACTIO_SRV entities
    registerHandlers(srv, NAUTIBTP_NAUTICAL_TRANSACTIO_SRV, [
        'xNAUTIxVOYAGEHEADERTOITEM',
        'xNAUTIxCOSTCHARGES',
        'xNAUTIxVoygItem',
        'xNAUTIxAPPROVEDCHAT',
        'xNAUTIxBIDITEM',
        'xNAUTIxCharteringHeaderItem',
        'xNAUTIxVEND',
        'CharteringSet',
        'xNAUTIxCHARTERING',
        'xNAUTIxCHARTPURCHASEITEM',
        'xNAUTIxpaymTerm',
        'xNAUTIxpurchGroup',
        'xNAUTIxRFQPORTAL',
        'xNAUTIxRFQCHARTERING',
        'xNAUTIxNAVYGIP',
        'xNAUTIxNAVOYG',
        'xNAUTIxZCHATVEN',
        'xNAUTIxVENDBID',
        'xNAUTIxSUBMITQUATATIONPOST',
        'xNAUTIxVENFBIDPOST',
        'xNAUTIxBIDHISREPORT',
        'xNAUTIxCHARTERVALUEHELP',
        'xNAUTIxCHARTERINGVALUEHELP',
        'xNAUTIxaward_value',
        'xNAUTIxBIDHISREPORT',
        'xNAUTIxbidhist_valuehelp',
        'xNAUTIxsubmitquafetch',
        'xNAUTIxZSUBMITQUOUTFETCH',
        'xNAUTIxnewbidhistoryreport'
    ]);
};

function registerHandlers(srv, service, entities) {
    entities.forEach(entity => {
        srv.on('READ', entity, req => service.run(req.query));
        srv.on('CREATE', entity, req => service.run(req.query));
        srv.on('UPDATE', entity, req => service.run(req.query));
        srv.on('DELETE', entity, req => service.run(req.query));
    });

    srv.on('CREATE', 'calculateDateAndTime', async (req, res) => {
        try {
            console.log("calculate functionn trigger");
            let portData = req.data.ZCalcNav;
            for (let i = 0; i < portData.length; i++) {
                if (portData[i].LegId == '1') {
                    let portDay = portData[i].PortDays;
                    let departureDateValue = portData[i].DepartureDateValue;
                    let departureTime = portData[i].DepartureTime;

                    // Combine departure date and time into a single Date object
                    let departureDateTime = new Date(`${departureDateValue}T${departureTime}`);

                    let totalHours = parseFloat(portDay) * 24.00; // converting port dys into hours

                    console.log("port 1 total hours: ", totalHours);
                    // Add portDay to the departure date
                    departureDateTime.setHours(departureDateTime.getHours() - parseInt(totalHours));
                    departureDateTime.setMinutes(departureDateTime.getMinutes() - (totalHours % 1) * 60);

                    // Format the arrival date and time
                    let arrivalDate = departureDateTime.toISOString().split('T')[0]; // YYYY-MM-DD format
                    let arrivalTime = departureDateTime.toTimeString().split(' ')[0];
                    portData[i].ArrivalDate = arrivalDate;
                    portData[i].ArrivalTime = arrivalTime;
                    portData[i].SeaDays = "0";
                    console.log("Port Dataa", portData[i]);
                } else {
                    let prevDepartureDate = portData[i - 1].DepartureDateValue;
                    let prevDepartureTime = portData[i - 1].DepartureTime;
                    let portDistance = portData[i].Distance;
                    let vesselSpeed = portData[i].Speed;
                    let portDays = portData[i].PortDays;
                    let weather = parseFloat(portData[i].Weather);
                    let totalHours = parseFloat(portDistance) / parseFloat(vesselSpeed);
                    console.log("totalHours w/o weather", totalHours);

                    if (weather) {
                        totalHours = totalHours * (1 + weather / 100);
                    }
                    let days = parseFloat(totalHours / 24);
                    console.log("Days ", days);
                    console.log("weather  ", weather);

                    let departureDateTime = new Date(`${prevDepartureDate}T${prevDepartureTime}`);
                    console.log("totalHours", totalHours);
                    console.log("departureDateTime", departureDateTime);
                    console.log("departureDateTime Before", departureDateTime.getHours());

                    // Add the total hours to the departure Date object
                    departureDateTime.setHours(departureDateTime.getHours() + parseInt(totalHours));
                    departureDateTime.setMinutes(departureDateTime.getMinutes() + (totalHours % 1) * 60);
                    console.log("departureDateTime After", departureDateTime.getHours());

                    // Format the arrival date and time
                    let arrivalDate = departureDateTime.toISOString().split('T')[0]; // YYYY-MM-DD format
                    let arrivalTime = departureDateTime.toTimeString().split(' ')[0]; // HH:MM:SS format
                    portData[i].ArrivalDate = arrivalDate;
                    portData[i].ArrivalTime = arrivalTime;
                    let portDaysHours = portDays * 24;
                    console.log("Port Days hours: ", portDaysHours);

                    departureDateTime.setHours(departureDateTime.getHours() + parseInt(portDaysHours));
                    departureDateTime.setMinutes(departureDateTime.getMinutes() + (portDaysHours % 1) * 60);

                    let departureDate = departureDateTime.toISOString().split('T')[0];

                    let departureTime = departureDateTime.toTimeString().split(' ')[0];
                    portData[i].DepartureTime = departureTime
                    portData[i].DepartureDateValue = departureDate;
                    portData[i].SeaDays = parseFloat(days).toFixed(3);

                }
            }
            console.log("payload after change ", portData);
            return {
                "ZCalcNav": portData
            };

        } catch (error) {
            console.error('Error:', error);
            throw new Error('Error performing calculation');

        }


        // return await performCalculation(req.data);

    });




    // Handle 'getRoute' entity
    srv.on('READ', 'getRoute', async (req) => {
        const {
            startLatitude,
            startLongitude,
            endLatitude,
            endLongitude
        } = req._queryOptions;
        console.log('End Longitude:', req._queryOptions);
        console.log('Start Latitude:', startLatitude);
        console.log('Start Longitude:', startLongitude);
        console.log('End Latitude:', endLatitude);
        console.log('End Longitude:', endLongitude);
        // return;

        try {

            let distances = {
                "info": {
                    "copyrights": [
                        "Viku AS"
                    ],
                    "took": 57
                },
                "paths": [{
                    "distance": 1933.9091252699784,
                    "bbox": [
                        72.695488,
                        5.701832,
                        86.691673,
                        20.261633
                    ],
                    "points": {
                        "coordinates": [
                            [
                                72.857384,
                                18.937828
                            ],
                            [
                                72.844163,
                                18.928939
                            ],
                            [
                                72.844985,
                                18.927786
                            ],
                            [
                                72.845178,
                                18.92605
                            ],
                            [
                                72.831252,
                                18.836152
                            ],
                            [
                                72.831252,
                                18.836152
                            ],
                            [
                                72.761484,
                                18.701623
                            ],
                            [
                                72.695488,
                                18.137755
                            ],
                            [
                                73.021381,
                                17.0
                            ],
                            [
                                73.664793,
                                15.113611
                            ],
                            [
                                76.069337,
                                9.5
                            ],
                            [
                                77.076083,
                                8.0
                            ],
                            [
                                79.848519,
                                6.062151
                            ],
                            [
                                80.701832,
                                5.701832
                            ],
                            [
                                81.133712,
                                5.866288
                            ],
                            [
                                81.916943,
                                6.369229
                            ],
                            [
                                81.916943,
                                6.369229
                            ],
                            [
                                82.0,
                                6.547532
                            ],
                            [
                                82.060496,
                                6.677404
                            ],
                            [
                                86.5,
                                19.743236
                            ],
                            [
                                86.679843,
                                20.218589
                            ],
                            [
                                86.682551,
                                20.258739
                            ],
                            [
                                86.681727,
                                20.260229
                            ],
                            [
                                86.679039,
                                20.261633
                            ],
                            [
                                86.684842,
                                20.261261
                            ],
                            [
                                86.691673,
                                20.260869
                            ]
                        ]
                    },
                    "details": {
                        "eca_distance": [
                            [
                                0,
                                25,
                                {
                                    "in_eca": false,
                                    "name": "",
                                    "distance": 1933.9091198704104,
                                    "from": [
                                        72.857384,
                                        18.937828
                                    ],
                                    "to": [
                                        86.691673,
                                        20.260869
                                    ]
                                }
                            ]
                        ],
                        "hra_distance": [
                            [
                                0,
                                25,
                                {
                                    "in_hra": false,
                                    "distance": 1933.9091198704104,
                                    "from": [
                                        72.857384,
                                        18.937828
                                    ],
                                    "to": [
                                        86.691673,
                                        20.260869
                                    ]
                                }
                            ]
                        ],
                        "name": [
                            [
                                0,
                                31,
                                ""
                            ]
                        ],
                        "snapped_points": {
                            "coordinates": [
                                [
                                    72.857384,
                                    18.937828
                                ],
                                [
                                    86.691673,
                                    20.260869
                                ]
                            ]
                        }
                    }
                }]
            };

            const firstPath = distances.paths[0];

            // Extracting distance
            const distance = firstPath.distance;

            // Extracting coordinates
            const coordinates = firstPath.points.coordinates;

            // Mapping coordinates to an array of objects with lat and lng properties
            const mappedCoordinates = coordinates.map(coord => ({
                PathId: 1,
                Latitude: coord[1],
                Longitude: coord[0]
            }));

            // Constructing responseData
            const path = {
                seaDistance: distance,
                route: mappedCoordinates,
                code: 200,
                message: "SUCCESS"
            };

            return path;
            // Call the custom function to handle the request
            //  return await getDistanceBetweenPort(req._queryOptions);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Error fetching data');
        }
    });
};



async function getDistanceBetweenPort(routeParams) {

    const {
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude
    } = routeParams;

    // Construct the URL with parameters
    let url = `https://distances.dataloy.com/route/route?point=${startLatitude},${startLongitude}&point=${endLatitude},${endLongitude}&avoid_eca_factor=1&avoid_hra_factor=1&avoid_ice_factor=1`;


    const blockParams = ['block_sc', 'block_pc', 'block_kc', 'block_nw', 'block_ne', 'block_cc', 'block_ts'];

    // Add optional block parameters based on params
    blockParams.forEach(paramKey => {
        // Check if the param exists in param and is set to 'true'
        if (routeParams[paramKey] === 'true') {
            url += `&${paramKey}=true`;
        }
        // console.log(url);
    });
    // Construct request headers
    const myHeaders = new Headers();
    myHeaders.append("X-API-Key", "jUg9DrwnmfacRjTt6rlju1tNLkN6ZpAh6ZRheyCE");

    // Construct request options
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        // Perform the GET request
        const response = await fetch(url, requestOptions);
        const responseData = await response.text();
        let distances = JSON.parse(responseData);

        const firstPath = distances.paths[0];

        // Extracting distance
        const distance = firstPath.distance;

        // Extracting coordinates
        const coordinates = firstPath.points.coordinates;

        // Mapping coordinates to an array of objects with lat and lng properties
        const mappedCoordinates = coordinates.map(coord => ({
            PathId: 1,
            Latitude: coord[1],
            Longitude: coord[0]
        }));

        // Constructing responseData
        const path = {
            seaDistance: distance,
            route: mappedCoordinates,
            code: 200,
            message: "SUCCESS"
        };
        return path;
    } catch (error) {
        console.error('Error:', error);
        const pathResponse = {
            seaDistance: 0.000,
            route: null,
            code: 500,
            message: `${error}`
        };
        console.log(pathResponse);
        return pathResponse;
    }
}