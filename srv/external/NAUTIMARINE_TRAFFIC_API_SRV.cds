/* checksum : 2eed546ff689390ed2fe1b5aaf11826f */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIMARINE_TRAFFIC_API_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.content.version : '1'
entity NAUTIMARINE_TRAFFIC_API_SRV.EsPathCollection {
  @sap.unicode : 'false'
  @sap.label : 'Latitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Latitude : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Path ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  PathId : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Longitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Longitude : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity NAUTIMARINE_TRAFFIC_API_SRV.es_route_map {
  @sap.unicode : 'false'
  @sap.label : 'From Port ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key IvFromPort : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'To Port ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key IvToPort : String(10) not null;
  // marineApiRoute : NAUTIMARINE_TRAFFIC_API_SRV.marineApiRoute not null;
  marineApiRoute : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Optimized Route'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  IvOptimized : String(1) not null;
  @cds.ambiguous : 'missing on condition?'
  route : Association to many NAUTIMARINE_TRAFFIC_API_SRV.EsPathCollection {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMARINE_TRAFFIC_API_SRV.PortMasterSet {
  @sap.unicode : 'false'
  @sap.label : 'Port Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Portn : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'Location ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Locid : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Country : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Portc : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Related Anchorage'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Reancho : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Latitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Latitude : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Longitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Longitude : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Countryn : String(25) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity NAUTIMARINE_TRAFFIC_API_SRV.es_port_master {
  @sap.unicode : 'false'
  @sap.label : 'Port Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Portc : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Country : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Portn : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'Related Anchorage'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Reancho : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Latitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Latitude : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Longitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Longitude : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Countryn : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'Location ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Locid : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Process ind'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ind : String(1) not null;
};

@cds.external : true
type NAUTIMARINE_TRAFFIC_API_SRV.marineApiRoute {
  @sap.label : 'Distance'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  EvDistance : String(10) not null;
};

