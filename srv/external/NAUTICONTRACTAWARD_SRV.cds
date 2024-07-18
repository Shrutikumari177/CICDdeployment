/* checksum : 891b041e4cd0acc52e1f10bdf7f37c9c */
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

