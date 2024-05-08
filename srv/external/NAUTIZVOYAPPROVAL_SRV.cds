/* checksum : f64740d9094678a9dd33b07ce42f225a */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIZVOYAPPROVAL_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIZVOYAPPROVAL_SRV.voyapprovalSet {
  @sap.unicode : 'false'
  @sap.label : 'Voyage Approval Requ'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Vreqno : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Approver Level'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zlevel : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Uname : String(12) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zdate : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ztime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Comments'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zcomm : String(250) not null;
  @sap.unicode : 'false'
  @sap.label : 'Action Taken'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zaction : String(4) not null;
};

