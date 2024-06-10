/* checksum : 651d6864c9de05fa5febb6dd7cecca57 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
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
  key Zlevel : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Uname : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'E-Mail Address'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zemail : String(241) not null;
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
  Ztime : Time;
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

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Get Voyage Approval List'
entity NAUTIZVOYAPPROVAL_SRV.xNAUTIxgetvoyapproval {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Approval Requ'
  @sap.quickinfo : 'Voyage Approval Request Number'
  key Vreqno : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'voy approval1'
entity NAUTIZVOYAPPROVAL_SRV.xNAUTIxvoyapproval1 {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Approval Requ'
  @sap.quickinfo : 'Voyage Approval Request Number'
  key Vreqno : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Approver Level'
  key Zlevel : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'User Name'
  key Uname : String(12) not null;
  @sap.display.format : 'Date'
  @sap.label : 'Date'
  key Zdate : Date not null;
  @sap.label : 'Time'
  key Ztime : Time not null;
  @sap.label : 'E-Mail Address'
  key Zemail : String(241) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comments'
  Zcomm : String(250);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Action Taken'
  Zaction : String(4);
};

