const cds = require('@sap/cds');
const xsenv = require("@sap/xsenv");
const axios = require('axios');
const { sendMail } = require("@sap-cloud-sdk/mail-client");
module.exports = async (srv) => {
    // Connect to services
    const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV");
    const NAUTIUSERMAILID_SRV = await cds.connect.to("NAUTIUSERMAILID_SRV");
    srv.on('READ', 'xNAUTIxuserEmail', req => NAUTIUSERMAILID_SRV.run(req.query));
    const NAUTICONTRACTAWARD_SRV = await cds.connect.to("NAUTICONTRACTAWARD_SRV");
    srv.on('READ', 'xNAUTIxawardReportFinal', req => NAUTICONTRACTAWARD_SRV.run(req.query));

    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV");
    const NAUTIMARINE_TRAFFIC_API_SRV = await cds.connect.to("NAUTIMARINE_TRAFFIC_API_SRV");
    const NAUTIBTP_NAUTICAL_TRANSACTIO_SRV = await cds.connect.to("NAUTIBTP_NAUTICAL_TRANSACTIO_SRV");
    const NAUTIZVOYAPPROVAL_SRV = await cds.connect.to("NAUTIZVOYAPPROVAL_SRV");
    const NAUTIZVOY_VALUEHELP_CDS = await cds.connect.to("NAUTIZVOY_VALUEHELP_CDS");
    const NAUTIZCHATAPPROVAL_SRV = await cds.connect.to("NAUTIZCHATAPPROVAL_SRV");
    const NAUTICHASTATUS_SRV = await cds.connect.to("NAUTICHASTATUS_SRV");

    const NAUTIVENDOR_SRV = await cds.connect.to("NAUTIVENDOR_SRV");
    const NAUTICOMP_QUOT_SRV = await cds.connect.to("NAUTICOMP_QUOT_SRV");

    const NAUTIVOYSTATUS_SRV = await cds.connect.to("NAUTIVOYSTATUS_SRV");
    srv.on('READ', 'voyappstatusSet', req => NAUTIVOYSTATUS_SRV.run(req.query));

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
    const NAUTIZNAUTIFILEUPL_VOY_SRV = await cds.connect.to("NAUTIZNAUTIFILEUPL_VOY_SRV");
    srv.on('READ', 'FileuploadSet', req => NAUTIZNAUTIFILEUPL_VOY_SRV.run(req.query));
    srv.on('READ', 'downloadSet', req => NAUTIZNAUTIFILEUPL_VOY_SRV.run(req.query));
    srv.on('CREATE', 'FileuploadSet', req => NAUTIZNAUTIFILEUPL_VOY_SRV.run(req.query));
    srv.on('CREATE', 'downloadSet', req => NAUTIZNAUTIFILEUPL_VOY_SRV.run(req.query));



    // srv.on('CREATE', 'ControllerLiveBidDetails', async (req) => {


    //     // Now you can use the maxIdValue for creating a new instance
    //     const newData = {...req.data, ID: 1 };
    //     try {
    //       const newBidDetails = await cds.create('ControllerLiveBidDetails').entries(newData);
    //       req.reply(newBidDetails);
    //     } catch (error) {
    //       req.error(500, `Error creating ControllerLiveBidDetails: ${error.message}`);
    //     }
    //   });


    srv.on('READ', 'calculateRankings', async (req) => {
        console.log("values", req._queryOptions.$filter);

        let Chrnmin = req._queryOptions.$filter.split(' ')[2];
        Chrnmin = Chrnmin.replace(/'/g, '');

        const charminData = await NAUTICOMP_QUOT_SRV.run(SELECT.from('xNAUTIxvenBid').where({ Chrnmin }));

        if (!charminData || charminData.length === 0) {
            console.error(`No data found for Chrnmin: ${Chrnmin}`);
            return [];
        }

        let Voyno = charminData[0].Voyno;

        if (!Voyno) {
            console.error(`No Voyno found for Chrnmin: ${Chrnmin}`);
            return [];
        }

        const voyageData = await NAUTICOMP_QUOT_SRV.run(SELECT.from('xNAUTIxitemBid').where({ Voyno }));

        if (!voyageData || voyageData.length === 0) {
            console.error(`No voyage data found for Voyno: ${Voyno}`);
            return [];
        }

        const rankedVendors = calculateAndRank(voyageData, charminData);
        console.log("rankedVendors", rankedVendors);

        return rankedVendors;
    });
    const NAUTIVENDOR_BTP_SRV = await cds.connect.to("NAUTIVENDOR_BTP_SRV");
    srv.on('READ', 'xNAUTIxvend_btp', req => NAUTIVENDOR_BTP_SRV.run(req.query));

    // const { 'cds.xt.DeploymentService': ds } = cds.services
    // const { 'cds.xt.SaasProvisioningService': sp } = cds.services

    // sp.before('dependencies', async (_, Req) => {

    //     const services = xsenv.getServices({
    //         // html5Runtime: { tag: 'html5-apps-repo-rt' },
    //         destination: { tag: 'destination' },
    //         connectivity: { tag: "connectivity" }
    //     });

    //     cds.env.requires["cds.xt.SaasProvisioningService"].dependencies = [];
    //     // cds.env.requires["cds.xt.SaasProvisioningService"].dependencies.push(services.html5Runtime.uaa.xsappname);
    //     cds.env.requires["cds.xt.SaasProvisioningService"].dependencies.push(services.destination.xsappname);
    //     cds.env.requires["cds.xt.SaasProvisioningService"].dependencies.push(services.connectivity.xsappname);

    // });

    function calculateAndRank(voyageData, charminData) {
        const vendorScores = calculateScores(voyageData, charminData);
        const rankedVendors = rankVendors(vendorScores, charminData);
        const rankedWithCommercial = calculateCommercialRank(rankedVendors);

        const groupedRankedVendors = groupedByVoynoAndChrnmin(rankedWithCommercial);

        return groupedRankedVendors;
    }

    function calculateScores(voyageData, charminData) {
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

    function rankVendors(vendorScores, charminData) {
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

    function calculateCommercialRank(rankedVendors) {
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

    function groupedByVoynoAndChrnmin(rankedVendors) {
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
                        from: "josiah.homenick1@ethereal.email",
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
                    from: "josiah.homenick1@ethereal.email",
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
               
                let res = await sendMail({ destinationName: "mailDestination" }, mailConfig);
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

    registerHandlers(srv, NAUTICHASTATUS_SRV, [
        'cha_statusSet'])
    registerHandlers(srv, NAUTICOMP_QUOT_SRV, [
        'xNAUTIxcomp_quot', 'xNAUTIxfinalbid', 'xNAUTIxitemBid', 'xNAUTIxvenBid'])

    registerHandlers(srv, NAUTIZCHATAPPROVAL_SRV, ['xNAUTIxchaApp1', 'chartapprSet']);

    registerHandlers(srv, NAUTIZVOY_VALUEHELP_CDS, ['xNAUTIxvoy_valuehelp']);

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
        'PortmasterUpdateSet', 'BidMasterSet', 'ClassMasterSet', 'CostMasterSet', 'CountryMasterSet', 'xNAUTIxcury_count',
        'EventMasterSet', 'MaintainGroupSet', 'UOMSet', 'StandardCurrencySet', 'xNAUTIxportmascds', 'xNAUTIxSAPUSERS',
        'ReleaseStrategySet', 'VoyageRealeaseSet', 'RefrenceDocumentSet', 'xNAUTIxCountrySetFetch',
        'PortmasterSet', 'xNAUTIxMASBID', 'xNAUTIxBusinessPartner1', 'xNAUTIxvend_btp', 'RelStrategySet', 'CountrySet', 'xNAUTIxStandardCurrencyFetch', 'xNAUTIxUIIDUSRGROUP', 'xNAUTIxnewportcds',
        'xNAUTIxSAPUSERS', 'xNAUTIxcury_count', 'xNAUTIxuseridassociation', 'xNAUTIxUIIDUSRGROUP'
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
        'xNAUTIxbidhist_valuehelp'
    ]);
};

function registerHandlers(srv, service, entities) {
    entities.forEach(entity => {
        srv.on('READ', entity, req => service.run(req.query));
        srv.on('CREATE', entity, req => service.run(req.query));
        srv.on('UPDATE', entity, req => service.run(req.query));
        srv.on('DELETE', entity, req => service.run(req.query));
    });




    // Handle 'getRoute' entity
    srv.on('READ', 'getRoute', async (req) => {
        const { startLatitude, startLongitude, endLatitude, endLongitude } = req._queryOptions;
        console.log('End Longitude:', req._queryOptions);
        console.log('Start Latitude:', startLatitude);
        console.log('Start Longitude:', startLongitude);
        console.log('End Latitude:', endLatitude);
        console.log('End Longitude:', endLongitude);
        // return;

        try {

            // let distances = {
            //     "info": {
            //         "copyrights": [
            //             "Viku AS"
            //         ],
            //         "took": 57
            //     },
            //     "paths": [
            //         {
            //             "distance": 1933.9091252699784,
            //             "bbox": [
            //                 72.695488,
            //                 5.701832,
            //                 86.691673,
            //                 20.261633
            //             ],
            //             "points": {
            //                 "coordinates": [
            //                     [
            //                         72.857384,
            //                         18.937828
            //                     ],
            //                     [
            //                         72.844163,
            //                         18.928939
            //                     ],
            //                     [
            //                         72.844985,
            //                         18.927786
            //                     ],
            //                     [
            //                         72.845178,
            //                         18.92605
            //                     ],
            //                     [
            //                         72.831252,
            //                         18.836152
            //                     ],
            //                     [
            //                         72.831252,
            //                         18.836152
            //                     ],
            //                     [
            //                         72.761484,
            //                         18.701623
            //                     ],
            //                     [
            //                         72.695488,
            //                         18.137755
            //                     ],
            //                     [
            //                         73.021381,
            //                         17.0
            //                     ],
            //                     [
            //                         73.664793,
            //                         15.113611
            //                     ],
            //                     [
            //                         76.069337,
            //                         9.5
            //                     ],
            //                     [
            //                         77.076083,
            //                         8.0
            //                     ],
            //                     [
            //                         79.848519,
            //                         6.062151
            //                     ],
            //                     [
            //                         80.701832,
            //                         5.701832
            //                     ],
            //                     [
            //                         81.133712,
            //                         5.866288
            //                     ],
            //                     [
            //                         81.916943,
            //                         6.369229
            //                     ],
            //                     [
            //                         81.916943,
            //                         6.369229
            //                     ],
            //                     [
            //                         82.0,
            //                         6.547532
            //                     ],
            //                     [
            //                         82.060496,
            //                         6.677404
            //                     ],
            //                     [
            //                         86.5,
            //                         19.743236
            //                     ],
            //                     [
            //                         86.679843,
            //                         20.218589
            //                     ],
            //                     [
            //                         86.682551,
            //                         20.258739
            //                     ],
            //                     [
            //                         86.681727,
            //                         20.260229
            //                     ],
            //                     [
            //                         86.679039,
            //                         20.261633
            //                     ],
            //                     [
            //                         86.684842,
            //                         20.261261
            //                     ],
            //                     [
            //                         86.691673,
            //                         20.260869
            //                     ]
            //                 ]
            //             },
            //             "details": {
            //                 "eca_distance": [
            //                     [
            //                         0,
            //                         25,
            //                         {
            //                             "in_eca": false,
            //                             "name": "",
            //                             "distance": 1933.9091198704104,
            //                             "from": [
            //                                 72.857384,
            //                                 18.937828
            //                             ],
            //                             "to": [
            //                                 86.691673,
            //                                 20.260869
            //                             ]
            //                         }
            //                     ]
            //                 ],
            //                 "hra_distance": [
            //                     [
            //                         0,
            //                         25,
            //                         {
            //                             "in_hra": false,
            //                             "distance": 1933.9091198704104,
            //                             "from": [
            //                                 72.857384,
            //                                 18.937828
            //                             ],
            //                             "to": [
            //                                 86.691673,
            //                                 20.260869
            //                             ]
            //                         }
            //                     ]
            //                 ],
            //                 "name": [
            //                     [
            //                         0,
            //                         31,
            //                         ""
            //                     ]
            //                 ],
            //                 "snapped_points": {
            //                     "coordinates": [
            //                         [
            //                             72.857384,
            //                             18.937828
            //                         ],
            //                         [
            //                             86.691673,
            //                             20.260869
            //                         ]
            //                     ]
            //                 }
            //             }
            //         }
            //     ]
            // };

            // const firstPath = distances.paths[0];

            // // Extracting distance
            // const distance = firstPath.distance;

            // // Extracting coordinates
            // const coordinates = firstPath.points.coordinates;

            // // Mapping coordinates to an array of objects with lat and lng properties
            // const mappedCoordinates = coordinates.map(coord => ({ PathId: 1, Latitude: coord[1], Longitude: coord[0] }));

            // // Constructing responseData
            // const path = {
            //     seaDistance: distance,
            //     route: mappedCoordinates,
            //     code: 200,
            //     message: "SUCCESS"
            // };

            // return path;
            // // Call the custom function to handle the request
            return await getDistanceBetweenPort(req._queryOptions);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Error fetching data');
        }
    });
};



async function getDistanceBetweenPort(routeParams) {

    const { startLatitude, startLongitude, endLatitude, endLongitude } = routeParams;

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
        const mappedCoordinates = coordinates.map(coord => ({ PathId: 1, Latitude: coord[1], Longitude: coord[0] }));

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
