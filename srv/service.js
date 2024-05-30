const cds = require('@sap/cds');
const axios = require('axios');

module.exports = async (srv) => {
    // Connect to services
    const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV");

    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV");
    const NAUTIMARINE_TRAFFIC_API_SRV = await cds.connect.to("NAUTIMARINE_TRAFFIC_API_SRV");
    const NAUTIBTP_NAUTICAL_TRANSACTIO_SRV = await cds.connect.to("NAUTIBTP_NAUTICAL_TRANSACTIO_SRV");
    const NAUTIZVOYAPPROVAL_SRV = await cds.connect.to("NAUTIZVOYAPPROVAL_SRV");
    const NAUTIZVOY_VALUEHELP_CDS = await cds.connect.to("NAUTIZVOY_VALUEHELP_CDS");
    const NAUTIZCHATAPPROVAL_SRV = await cds.connect.to("NAUTIZCHATAPPROVAL_SRV");

    const NAUTIVENDOR_SRV = await cds.connect.to("NAUTIVENDOR_SRV");
    const NAUTICOMP_QUOT_SRV = await cds.connect.to("NAUTICOMP_QUOT_SRV");

    srv.on('READ', 'xNAUTIxitemBid', req => NAUTICOMP_QUOT_SRV.run(req.query)); 
    srv.on('READ', 'xNAUTIxvenBid', req => NAUTICOMP_QUOT_SRV.run(req.query)); 
    srv.on('compareAndRankQuotations', async (req) => {
        try {
            const { Chrmin, Voyno } = req.data; // Extract Chrmim and Voyno from the request
            console.log("my charmin and Voyno ", Chrmin, Voyno);

            // Fetch voyage data
            const voyageData = await NAUTICOMP_QUOT_SRV.run(SELECT.from('xNAUTIxitemBid').where({ Voyno }));

            // Fetch vendor data
            const vendorData = await NAUTICOMP_QUOT_SRV.run(SELECT.from('xNAUTIxvenBid').where({ Chrmin }));

            // Calculate scores
            const vendorScores = calculateScores(voyageData, vendorData);

            // Rank vendors
            const rankedVendors = rankVendors(vendorScores, vendorData);

            // Return the ranked vendors
            return rankedVendors;
        } catch (error) {
            console.error('Error in compareAndRankQuotations:', error);
            req.reject(500, 'Internal Server Error');
        }
    });

    function calculateScores(voyageData, vendorData) {
        const vendorScores = {};

        vendorData.forEach(vendor => {
            if (!vendorScores[vendor.Lifnr]) {
                vendorScores[vendor.Lifnr] = { score: 0, eligible: true };
            }

            const expected = voyageData.find(v => v.Zcode === vendor.Zcode);
            if (expected) {
                if ((expected.Mand === "X" || expected.Must === "X") && expected.Value !== vendor.Value) {
                    vendorScores[vendor.Lifnr].eligible = false;
                } else {
                    const score = expected.Value === vendor.Value ? parseInt(expected.Zmax) : parseInt(expected.Zmin);
                    vendorScores[vendor.Lifnr].score += score;
                }
            }
        });

        return vendorScores;
    }

    function rankVendors(vendorScores, vendorData) {
        const rankedVendors = Object.keys(vendorScores)
            .map(vendor => {
                const bidDetails = vendorData.filter(data => data.Lifnr === vendor).reduce((acc, curr) => {
                    acc[curr.CodeDesc] = curr.Value;
                    return acc;
                }, {});

                return {
                    vendor,
                    score: vendorScores[vendor].score,
                    eligible: vendorScores[vendor].eligible,
                    bidDetails: bidDetails,
                    Voyno: vendorData[0].Voyno
                };
            })
            .sort((a, b) => b.score - a.score);

        rankedVendors.forEach((vendor, index) => {
            vendor.rank = `T${index + 1}`;
        });

        return rankedVendors;
    }

    registerHandlers( srv, NAUTICOMP_QUOT_SRV, [
        'xNAUTIxcomp_quot','xNAUTIxfinalbid','xNAUTIxitemBid','xNAUTIxvenBid' ])

    registerHandlers(srv, NAUTIZCHATAPPROVAL_SRV, [    'xNAUTIxchaApp1', 'chartapprSet']);

    registerHandlers(srv, NAUTIZVOY_VALUEHELP_CDS, [     'xNAUTIxvoy_valuehelp' ]);

    registerHandlers(srv, NAUTIVENDOR_SRV, [
        'MasBidTemplateSet', 'DynamicTableSet', 'ITEM_BIDSet', 'PortsSet'
    ]);
    // Register handlers for NAUTIZVOYAPPROVAL_SRV entities
    registerHandlers(srv, NAUTIZVOYAPPROVAL_SRV, [
        'voyapprovalSet','xNAUTIxvoyapproval1','xNAUTIxgetvoyapproval'
    ]);

    // Register handlers for NAUTINAUTICALCV_SRV entities
    registerHandlers(srv, NAUTINAUTICALCV_SRV, [
        'BidTypeSet', 'CarTypeSet', 'CargoUnitSet', 'CurTypeSet',
        'GtTabSet', 'GtPlanSet', 'VoyTypeSet', 'ZCalculateSet', 'ZCreatePlanSet'
    ]);

    // Register handlers for NAUTIMASTER_BTP_SRV entities
    registerHandlers(srv, NAUTIMASTER_BTP_SRV, [
        'PortmasterUpdateSet', 'BidMasterSet', 'ClassMasterSet', 'CostMasterSet', 'CountryMasterSet',
        'EventMasterSet', 'MaintainGroupSet', 'UOMSet', 'StandardCurrencySet',
        'ReleaseStrategySet', 'VoyageRealeaseSet', 'RefrenceDocumentSet',
        'PortmasterSet', 'xNAUTIxMASBID', 'xNAUTIxBusinessPartner1', 'xNAUTIxvend_btp','CountrySet'
    ]);

    // Register handlers for NAUTIMARINE_TRAFFIC_API_SRV entities
    registerHandlers(srv, NAUTIMARINE_TRAFFIC_API_SRV, ['EsPathCollection', 'PortMasterSet', 'es_port_master', 'es_route_map']);

    // Register handlers for NAUTIBTP_NAUTICAL_TRANSACTIO_SRV entities
    registerHandlers(srv, NAUTIBTP_NAUTICAL_TRANSACTIO_SRV, [
        'xNAUTIxVOYAGEHEADERTOITEM',
        'xNAUTIxCOSTCHARGES',
        'xNAUTIxVoygItem',
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
        'xNAUTIxSUBMITQUATATIONPOST'
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
                "paths": [
                    {
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
                    }
                ]
            };

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
            // Call the custom function to handle the request
            // return await getDistanceBetweenPort(startLatitude, startLongitude, endLatitude, endLongitude);
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Error fetching data');
        }
    });
};



async function getDistanceBetweenPort(startLatitude, startLongitude, endLatitude, endLongitude) {
    console.log('Parameters:', startLatitude, startLongitude, endLatitude, endLongitude);

    // Construct the URL with parameters
    const url = `https://distances.dataloy.com/route/route?point=${startLatitude},${startLongitude}&point=${endLatitude},${endLongitude}&avoid_eca_factor=1&avoid_hra_factor=1&avoid_ice_factor=1`;

    // Construct request headers
    const myHeaders = new Headers();
    myHeaders.append("X-API-Key", process.env.API_KEY);

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
            seaDistance: null,
            route: null,
            code: 500,
            message: `${error}`
        };
        console.log(pathResponse);
        return pathResponse;
    }
}
