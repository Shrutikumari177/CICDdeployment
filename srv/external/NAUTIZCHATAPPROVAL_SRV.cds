/* checksum : 081e553e84a3b8964f6ace8c2959a7b9 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIZCHATAPPROVAL_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIZCHATAPPROVAL_SRV.chartapprSet {
  @sap.unicode : 'false'
  @sap.label : 'Chartering Approval'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Creqno : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Chartering Req. No.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrnmin : String(10) not null;
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
@sap.label : 'chat approval'
entity NAUTIZCHATAPPROVAL_SRV.xNAUTIxchaApp1 {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Approval'
  @sap.quickinfo : 'Chartering Approval Request Number'
  key Creqno : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
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
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comments'
  Zcomm : String(250);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Action Taken'
  Zaction : String(4);
};

