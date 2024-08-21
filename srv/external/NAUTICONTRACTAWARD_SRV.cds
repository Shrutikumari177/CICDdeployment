/* checksum : 2d0396c041c9be9db8cbd0663f6722cb */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTICONTRACTAWARD_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTICONTRACTAWARD_SRV.awardcontractSet {
  @sap.unicode : 'false'
  @sap.label : 'Chartering Req. No.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Chrnmin : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Voyno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vendor'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zcode : String(12) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bid Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Biddate : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Bid Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bidtime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Code Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  CodeDesc : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Value : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Revaluation'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Cvalue : Decimal(14, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Cunit : String(5) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqsdate : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqstime : Time not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqedate : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqetime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Done by Vendor ?'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  DoneBy : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Created by'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Uname : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'Status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Stat : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Type (Auto/manual)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zmode : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Comments'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zcom : String(250) not null;
  @sap.unicode : 'false'
  @sap.label : 'Undefined range (can be used for patch levels)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Rank : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Created By'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  AwrdCreatedBy : String(30) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  AwrdCreatedOn : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Field of type TIMS'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  AwrdCreatedAt : Time;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTICONTRACTAWARD_SRV.contaward_tableSet {
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vendor'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Zcode : String(12) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bid Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Biddate : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Bid Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bidtime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Chartering Req. No.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrnmin : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Code Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  CodeDesc : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Value : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Revaluation'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Cvalue : Decimal(14, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Cunit : String(5) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqsdate : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqstime : Time;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqedate : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqetime : Time;
  @sap.unicode : 'false'
  @sap.label : 'Done by Vendor ?'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  DoneBy : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Created by'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Uname : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'Status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Stat : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Type (Auto/manual)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zmode : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Comments'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zcom : String(250) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'award report'
entity NAUTICONTRACTAWARD_SRV.xNAUTIxawardReportFinal {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  Voyno : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  Lifnr : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  Zcode : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Bid Date'
  Biddate : Date;
  @sap.label : 'Bid Time'
  Bidtime : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code Description'
  CodeDesc : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Value'
  Value : String(50);
  @sap.label : 'Revaluation'
  @sap.quickinfo : 'Revaluation amount on back-posting to a previous period'
  Cvalue : Decimal(14, 3);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Cunit : String(5);
  @sap.display.format : 'Date'
  @sap.label : 'Bidding Start Date'
  Chrqsdate : Date;
  @sap.label : 'Bidding Start Time'
  Chrqstime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Bidding End Date'
  Chrqedate : Date;
  @sap.label : 'Bidding End Time'
  Chrqetime : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Done by Vendor ?'
  DoneBy : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created by'
  Uname : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Status'
  Stat : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Type (Auto/manual)'
  Zmode : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comments'
  Zcom : String(250);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Undefined range (can be used for patch levels)'
  Rank : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created By'
  AwrdCreatedBy : String(30);
  @sap.display.format : 'Date'
  @sap.label : 'Date'
  @sap.quickinfo : 'Field of type DATS'
  AwrdCreatedOn : Date;
  @sap.label : ''
  @sap.quickinfo : 'Field of type TIMS'
  AwrdCreatedAt : Time;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'compare livefreight report'
entity NAUTICONTRACTAWARD_SRV.xNAUTIxcomparelivereport {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Lifnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  key Zcode : String(12) not null;
  @sap.display.format : 'Date'
  key Biddate : Date not null;
  @sap.label : 'Bid Time'
  key Bidtime : Time not null;
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Undefined range (can be used for patch levels)'
  Rank : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code Description'
  CodeDesc : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Value'
  Value : String(50);
  @sap.label : 'Revaluation'
  @sap.quickinfo : 'Revaluation amount on back-posting to a previous period'
  Cvalue : Decimal(14, 3);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Cunit : String(5);
  @sap.display.format : 'Date'
  @sap.label : 'Bidding Start Date'
  Chrqsdate : Date;
  @sap.label : 'Bidding Start Time'
  Chrqstime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Bidding End Date'
  Chrqedate : Date;
  @sap.label : 'Bidding End Time'
  Chrqetime : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Done by Vendor ?'
  DoneBy : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created by'
  Uname : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Status'
  Stat : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Type (Auto/manual)'
  Zmode : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comments'
  Zcom : String(250);
};

