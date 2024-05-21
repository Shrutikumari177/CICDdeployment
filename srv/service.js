const cds = require('@sap/cds');
const axios = require('axios');

module.exports = async (srv) => {
    // Connect to services
    const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV");
    const NAUTIMASTER_BTP_SRV = await cds.connect.to("NAUTIMASTER_BTP_SRV");
    const NAUTIMARINE_TRAFFIC_API_SRV = await cds.connect.to("NAUTIMARINE_TRAFFIC_API_SRV");
    const NAUTIBTP_NAUTICAL_TRANSACTIO_SRV = await cds.connect.to("NAUTIBTP_NAUTICAL_TRANSACTIO_SRV");
    const NAUTIZVOYAPPROVAL_SRV = await cds.connect.to("NAUTIZVOYAPPROVAL_SRV"); 
    
    const NAUTIVENDOR_SRV = await cds.connect.to("NAUTIVENDOR_SRV"); 

    registerHandlers(srv, NAUTIVENDOR_SRV, [
        'MasBidTemplateSet','DynamicTableSet','ITEM_BIDSet','PortsSet'
    ]);
    // Register handlers for NAUTIZVOYAPPROVAL_SRV entities
    registerHandlers(srv, NAUTIZVOYAPPROVAL_SRV, [
        'voyapprovalSet'
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
        'PortmasterSet', 'xNAUTIxMASBID', 'xNAUTIxBusinessPartner1', 'xNAUTIxvend_btp'
    ]);

    // Register handlers for NAUTIMARINE_TRAFFIC_API_SRV entities
    registerHandlers(srv, NAUTIMARINE_TRAFFIC_API_SRV, ['EsPathCollection', 'PortMasterSet', 'es_port_master', 'es_route_map']);

    // Register handlers for NAUTIBTP_NAUTICAL_TRANSACTIO_SRV entities
    registerHandlers(srv, NAUTIBTP_NAUTICAL_TRANSACTIO_SRV, [
        'xNAUTIxVOYAGEHEADERTOITEM', 'xNAUTIxCOSTCHARGES', 'xNAUTIxVoygItem',
        'xNAUTIxBIDITEM']);
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
            // Call the custom function to handle the request
            return await getDistanceBetweenPort(startLatitude, startLongitude, endLatitude, endLongitude);
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
