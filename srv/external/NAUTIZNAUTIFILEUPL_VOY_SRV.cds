/* checksum : f8a4133b03fe4c185b3a490f73f5c004 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIZNAUTIFILEUPL_VOY_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIZNAUTIFILEUPL_VOY_SRV.FileuploadSet {
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyageno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'file name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Filename : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'UUID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fileid : UUID not null;
  @sap.unicode : 'false'
  @sap.label : 'Created By'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Creaby : String(30) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Creation Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Creadate : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Creation Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Creatime : Time;
  @sap.unicode : 'false'
  @sap.label : 'file type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Filetype : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'File content'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Filecont : LargeBinary not null;
  @sap.unicode : 'false'
  @sap.label : 'delete'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Del : String(1) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIZNAUTIFILEUPL_VOY_SRV.downloadSet {
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyageno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'file name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Filename : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'UUID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fileid : UUID not null;
  @sap.unicode : 'false'
  @sap.label : 'Created By'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Creaby : String(30) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Creation Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Creadate : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Creation Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Creatime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'file type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Filetype : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'File content'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Filecont : LargeBinary not null;
  @sap.unicode : 'false'
  @sap.label : 'delete'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Del : String(1) not null;
  @Core.MediaType : 'application/octet-stream'
  blob : LargeBinary;
};

