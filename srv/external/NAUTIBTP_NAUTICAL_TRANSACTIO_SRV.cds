/* checksum : 5de183f02ee17c21b594239c1c7356ea */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIBTP_NAUTICAL_TRANSACTIO_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.CharteringSet {
  @sap.unicode : 'false'
  @sap.label : 'Chartering Req. No.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Chrnmin : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Indicator'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zdelete : Boolean;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Creation Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrcdate : Timestamp;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqsdate : Timestamp;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqedate : Timestamp;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Quot.Deadline Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqdate : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Exch.Rate'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrexcr : Decimal(14, 0);
  @sap.unicode : 'false'
  @sap.unit : 'Ciuom'
  @sap.label : 'Quantity'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ciqty : Decimal(17, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'Charter Ext.No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrnmex : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Purchase Org'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrporg : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Pur.Org.Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrporgn : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Purchase Group'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrpgrp : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Pur.Grp.Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrpgrpn : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Payment Terms'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrpayt : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Pay.term.dis'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrpaytxt : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Inco Terms'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrinco : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Chate incotrm di'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrincodis : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Inco Location'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrincol : String(70) not null;
  @sap.unicode : 'false'
  @sap.label : 'Mat.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Cimater : String(18) not null;
  @sap.unicode : 'false'
  @sap.label : 'Material Short Text'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Cimatdes : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Unit of Measure'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'unit-of-measure'
  Ciuom : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Voyno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Voynm : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vendor Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrven : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vendor Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrvenn : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Freight Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Ciprec : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Reference Chartering'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  RefChrnmin : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Creation Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrctime : Time;
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqstime : Time;
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqetime : Time;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'approved chartering'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxAPPROVEDCHAT {
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
  @sap.label : 'Release Strategy'
  key Rels : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Type'
  key Voyty : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Type'
  key Vesty : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'User ID group'
  key Zgroup : String(12) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comments'
  Zcomm : String(250);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Action Taken'
  Zaction : String(4);
  @sap.label : 'E-Mail Address'
  Zemail : String(241);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Bidding History Report'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDHISREPORT {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Lifnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  key Zcode : String(12) not null;
  @sap.display.format : 'Date'
  @sap.label : 'Bid Date'
  Biddate : Date;
  @sap.label : 'Bid Time'
  Bidtime : Time;
  @sap.label : 'Voyage name'
  @sap.quickinfo : 'Voyage Name'
  Voynm : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Nomination no'
  @sap.quickinfo : 'Nautical being used for Is-OIL'
  Vnomtk : String(20);
  @sap.label : 'Refrence Doc'
  @sap.quickinfo : 'Nautical being used for S4H or other non Oil Modules'
  Refdoc : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ref Doc .ind'
  @sap.quickinfo : 'Reference document indicator (PSX)'
  Docind : String(1);
  @sap.label : 'Vessel name'
  @sap.quickinfo : 'Vessel Name'
  Vessn : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel IMO no'
  @sap.quickinfo : 'Vessel IMO Number - Unique'
  Vimo : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Type'
  @sap.quickinfo : 'SPOT/Time Charter'
  Chtyp : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Party Agree'
  @sap.quickinfo : 'Freight Contract'
  Chpno : String(10);
  @sap.label : 'Freight charges'
  @sap.quickinfo : 'Currency key'
  @sap.semantics : 'currency-code'
  Currkeys : String(5);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  @sap.quickinfo : 'Freight Cost for the Voyage'
  Frtco : Decimal(14, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Status'
  @sap.quickinfo : 'Not Started, Ballast, Port, EnRoute, Anchorage, Completed'
  Vstat : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Type'
  Voyty : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Type'
  Carty : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  Curr : String(3);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight cost'
  Freght : Decimal(12, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Party Agreem'
  @sap.quickinfo : 'Charter Party Agreement'
  Party : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Bid Type'
  Bidtype : String(2);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  Frcost : Decimal(17, 5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Freight Unit'
  Frtu : String(10);
  @sap.unit : 'Currkeys'
  @sap.label : 'Actual Freight Cost'
  FrcostAct : Decimal(17, 5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Actual Freight Unit'
  FrtuAct : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Indicator'
  @sap.quickinfo : 'General Flag'
  Zdelete : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Refrence Voyage No.'
  RefVoyno : String(20);
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
  Award : String(3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Bid Item'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDITEM {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  key Zcode : String(12) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Value'
  key Value : String(50) not null;
  @sap.label : 'Revaluation'
  @sap.quickinfo : 'Revaluation amount on back-posting to a previous period'
  key Cvalue : Decimal(14, 3) not null;
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Cunit : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code Description'
  CodeDesc : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Revelant for Bidding'
  RevBid : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Good To Have'
  Good : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Active/Inactive'
  Mand : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Must Not Have'
  Must : String(1);
  @sap.label : 'Minimum Score'
  Zmin : Decimal(3, 0);
  @sap.label : 'Maximum Score'
  Zmax : Decimal(3, 0);
};

@cds.external : true
@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Chartering'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTERING {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Ext.No'
  Chrnmex : String(20);
  @sap.display.format : 'Date'
  @sap.label : 'Creation Date'
  @sap.quickinfo : 'Charter Request Creation Date'
  Chrcdate : Date;
  @sap.label : 'Creation Time'
  @sap.quickinfo : 'Charter Request Creation Time'
  Chrctime : Time;
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
  @sap.display.format : 'Date'
  @sap.label : 'Quot.Deadline Date'
  @sap.quickinfo : 'Charter Quatation Deadline date'
  Chrqdate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Org'
  @sap.quickinfo : 'Charter Purchase Organization'
  Chrporg : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur.Org.Name'
  @sap.quickinfo : 'Charter Purchase Organization name'
  Chrporgn : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Group'
  @sap.quickinfo : 'Charter Purchase Group'
  Chrpgrp : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur.Grp.Name'
  @sap.quickinfo : 'Charter Purchase Group Name'
  Chrpgrpn : String(30);
  @sap.label : 'Exch.Rate'
  @sap.quickinfo : 'Exhange Rate'
  Chrexcr : Decimal(14, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment Terms'
  Chrpayt : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pay.term.dis'
  @sap.quickinfo : 'Chartering payterms description'
  Chrpaytxt : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inco Terms'
  Chrinco : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chate.Incotrm.dis'
  @sap.quickinfo : 'Chartering inco terms description'
  Chrincodis : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inco Location'
  @sap.quickinfo : 'Incoterms Location'
  Chrincol : String(70);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Mat.'
  @sap.quickinfo : 'Material'
  Cimater : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Short Text'
  Cimatdes : String(40);
  @sap.unit : 'Ciuom'
  @sap.label : 'Quantity'
  Ciqty : Decimal(17, 0);
  @sap.label : 'Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Ciuom : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  Voyno : String(20);
  @sap.label : 'Voyage name'
  @sap.quickinfo : 'Voyage Name'
  Voynm : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor Code'
  Chrven : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor Name'
  Chrvenn : String(35);
  @sap.label : 'Freight Currency'
  @sap.semantics : 'currency-code'
  Ciprec : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Indicator'
  @sap.quickinfo : 'General Flag'
  Zdelete : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reference Chartering'
  @sap.quickinfo : 'Reference Chartering No.'
  RefChrnmin : String(10);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'association on Charetering'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCharteringHeaderItem {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Ext.No'
  Chrnmex : String(20);
  @sap.display.format : 'Date'
  @sap.label : 'Creation Date'
  @sap.quickinfo : 'Charter Request Creation Date'
  Chrcdate : Date;
  @sap.label : 'Creation Time'
  @sap.quickinfo : 'Charter Request Creation Time'
  Chrctime : Time;
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
  @sap.display.format : 'Date'
  @sap.label : 'Quot.Deadline Date'
  @sap.quickinfo : 'Charter Quatation Deadline date'
  Chrqdate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Org'
  @sap.quickinfo : 'Charter Purchase Organization'
  Chrporg : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur.Org.Name'
  @sap.quickinfo : 'Charter Purchase Organization name'
  Chrporgn : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Group'
  @sap.quickinfo : 'Charter Purchase Group'
  Chrpgrp : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur.Grp.Name'
  @sap.quickinfo : 'Charter Purchase Group Name'
  Chrpgrpn : String(30);
  @sap.label : 'Exch.Rate'
  @sap.quickinfo : 'Exhange Rate'
  Chrexcr : Decimal(14, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment Terms'
  Chrpayt : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pay.term.dis'
  @sap.quickinfo : 'Chartering payterms description'
  Chrpaytxt : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inco Terms'
  Chrinco : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chate.Incotrm.dis'
  @sap.quickinfo : 'Chartering inco terms description'
  Chrincodis : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inco Location'
  @sap.quickinfo : 'Incoterms Location'
  Chrincol : String(70);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Mat.'
  @sap.quickinfo : 'Material'
  Cimater : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Short Text'
  Cimatdes : String(40);
  @sap.unit : 'Ciuom'
  @sap.label : 'Quantity'
  Ciqty : Decimal(17, 0);
  @sap.label : 'Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Ciuom : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  Voyno : String(20);
  @sap.label : 'Voyage name'
  @sap.quickinfo : 'Voyage Name'
  Voynm : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor Code'
  Chrven : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor Name'
  Chrvenn : String(35);
  @sap.label : 'Freight Currency'
  @sap.semantics : 'currency-code'
  Ciprec : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Indicator'
  @sap.quickinfo : 'General Flag'
  Zdelete : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reference Chartering'
  @sap.quickinfo : 'Reference Chartering No.'
  RefChrnmin : String(10);
  @cds.ambiguous : 'missing on condition?'
  tocharteringasso : Association to NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTERING {  };
  @cds.ambiguous : 'missing on condition?'
  tovendor : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVEND {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Chartering Purchase Group'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTPURCHASEITEM {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur.Org.Name'
  @sap.quickinfo : 'purchase organization'
  key Ekorg : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur.Org.Discription'
  @sap.quickinfo : 'Discription of purchasing organization'
  Ekotx : String(20);
  @cds.ambiguous : 'missing on condition?'
  topaymentterm : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpaymTerm {  };
  @cds.ambiguous : 'missing on condition?'
  topurchasegroup : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpurchGroup {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'chartering approval'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHATAPP2 {
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
  @sap.label : 'E-Mail Address'
  Zemail : String(241);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'chartering approval fetch'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHATAPPRO {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Approval'
  @sap.quickinfo : 'Chartering Approval Request Number'
  key Creqno : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'contract award status main'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCONTAWARDSTATUSREPORT_M {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @cds.ambiguous : 'missing on condition?'
  toitem : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBID {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'contract award status association'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCONTAWARDSTREPORT_ASSOC {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @cds.ambiguous : 'missing on condition?'
  toitem : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBID {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Cost Charges'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCOSTCHARGES {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  key Vlegn : Integer not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost.Code'
  @sap.quickinfo : 'Cost Code'
  key Costcode : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost Unit'
  Costu : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Price Unit'
  Prcunit : String(3);
  @sap.unit : 'Costcurr'
  @sap.label : 'Projection cost'
  @sap.quickinfo : 'Projection Cost'
  Procost : Decimal(16, 3);
  @sap.label : 'Cost.C.Currency'
  @sap.quickinfo : 'Cost Code Currency'
  @sap.semantics : 'currency-code'
  Costcurr : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost.Code.Des'
  @sap.quickinfo : 'Cost Code Description'
  Cstcodes : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Relevant For Bidding'
  CostCheck : Boolean;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'max level charmin'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxMAXZLEVEL {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key chrnmin : String(10) not null;
  max_zlevel : String(2);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cds view for /nauti/navoygh'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYG {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.label : 'Voyage name'
  @sap.quickinfo : 'Voyage Name'
  Voynm : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Nomination no'
  @sap.quickinfo : 'Nautical being used for Is-OIL'
  Vnomtk : String(20);
  @sap.label : 'Refrence Doc'
  @sap.quickinfo : 'Nautical being used for S4H or other non Oil Modules'
  Refdoc : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ref Doc .ind'
  @sap.quickinfo : 'Reference document indicator (PSX)'
  Docind : String(1);
  @sap.label : 'Vessel name'
  @sap.quickinfo : 'Vessel Name'
  Vessn : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel IMO no'
  @sap.quickinfo : 'Vessel IMO Number - Unique'
  Vimo : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Type'
  @sap.quickinfo : 'SPOT/Time Charter'
  Chtyp : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Party Agree'
  @sap.quickinfo : 'Freight Contract'
  Chpno : String(10);
  @sap.label : 'Freight charges'
  @sap.quickinfo : 'Currency key'
  @sap.semantics : 'currency-code'
  Currkeys : String(5);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  @sap.quickinfo : 'Freight Cost for the Voyage'
  Frtco : Decimal(14, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Status'
  @sap.quickinfo : 'Not Started, Ballast, Port, EnRoute, Anchorage, Completed'
  Vstat : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Type'
  Voyty : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Type'
  Carty : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  Curr : String(3);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight cost'
  Freght : Decimal(12, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Party Agreem'
  @sap.quickinfo : 'Charter Party Agreement'
  Party : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Bid Type'
  Bidtype : String(2);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  Frcost : Decimal(17, 5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Freight Unit'
  Frtu : String(10);
  @sap.unit : 'Currkeys'
  @sap.label : 'Actual Freight Cost'
  FrcostAct : Decimal(17, 5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Actual Freight Unit'
  FrtuAct : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Indicator'
  @sap.quickinfo : 'General Flag'
  Zdelete : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Refrence Voyage No.'
  RefVoyno : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cds view for /nauti/navoygcit'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYGCT {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  Vlegn : Integer;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost.Code'
  @sap.quickinfo : 'Cost Code'
  Costcode : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost Unit'
  Costu : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Price Unit'
  Prcunit : String(3);
  @sap.unit : 'Costcurr'
  @sap.label : 'Projection cost'
  @sap.quickinfo : 'Projection Cost'
  Procost : Decimal(16, 3);
  @sap.label : 'Cost.C.Currency'
  @sap.quickinfo : 'Cost Code Currency'
  @sap.semantics : 'currency-code'
  Costcurr : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost.Code.Des'
  @sap.quickinfo : 'Cost Code Description'
  Cstcodes : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Relevant For Bidding'
  CostCheck : Boolean;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cds view for /nauti/navoygip'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVYGIP {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  key Vlegn : Integer not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Port Code'
  @sap.quickinfo : 'Unified Port Code - Unique'
  Portc : String(10);
  @sap.label : 'Port Name'
  Portn : String(25);
  @sap.label : 'Distance'
  @sap.quickinfo : 'The Post Master Fetched Using External API'
  Pdist : Decimal(13, 3);
  @sap.label : 'Distance UoM'
  @sap.quickinfo : 'Distance Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Medst : String(3);
  @sap.label : 'Speed'
  @sap.quickinfo : 'The Speed From Vessel Master/Manual Input'
  Vspeed : Decimal(17, 3);
  @sap.label : 'Port Days'
  @sap.quickinfo : 'Propsed From Historic Data/Manual Input'
  Ppdays : Decimal(6, 3);
  @sap.label : 'Sea Days'
  @sap.quickinfo : 'Proposed From Historic Data/Manual Input'
  Vsdays : Decimal(7, 3);
  @sap.display.format : 'Date'
  @sap.label : 'ETA'
  @sap.quickinfo : 'Calculated Based on ETA'
  Vetad : Date;
  @sap.label : 'Time'
  @sap.quickinfo : 'Calculated Based On ETD'
  Vetat : Time;
  @sap.display.format : 'Date'
  @sap.label : 'ETD'
  @sap.quickinfo : 'Manual Entry'
  Vetdd : Date;
  @sap.label : 'Time'
  @sap.quickinfo : 'Voyage Acutal Time'
  Vetdt : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Weather Delay .Sea'
  @sap.quickinfo : 'Caluclated from Weather Service else Manual Entry'
  Vwead : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Status'
  @sap.quickinfo : 'In Planning, Vetting In Progress, Vetting Complted'
  Pstat : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Matnr : String(40);
  @sap.label : 'Material description'
  Maktx : String(40);
  @sap.label : 'Cargo size'
  Cargs : Decimal(12, 0);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Cargu : String(3);
  @sap.label : 'Total Cost'
  Othco : Decimal(24, 3);
  @sap.label : 'Total Cost'
  Frcost : Decimal(24, 3);
  @sap.label : 'Total Cost'
  Totco : Decimal(24, 3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Transactional payment term'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpaymTerm {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment term key'
  @sap.quickinfo : 'Terms of payment key'
  key Paytrm : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment disc'
  @sap.quickinfo : 'Description of terms of payment'
  Paytrmtxt : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'transactional purchase group'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpurchGroup {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Group'
  key Ekgrp : String(3) not null;
  @sap.label : 'Description p. group'
  @sap.quickinfo : 'Description of purchasing group'
  Eknam : String(18);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'SubmitQuotation Chartering'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxRFQCHARTERING {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
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
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  Chrnmin : String(10);
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
  @sap.display.format : 'Date'
  currentdate : Date;
  currenttime : Time;
  @cds.ambiguous : 'missing on condition?'
  toassociation1 : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYGCT {  };
  @cds.ambiguous : 'missing on condition?'
  toassociation2 : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYG {  };
  @cds.ambiguous : 'missing on condition?'
  toassociation3 : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVYGIP {  };
  @cds.ambiguous : 'missing on condition?'
  toassociation4 : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxZCHATVEN {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cds view for rfq portal'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxRFQPORTAL {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Lifnr : String(10) not null;
  @sap.label : 'BP Role'
  @sap.quickinfo : 'BP Role for Screen Usage'
  PartnerRole : String(7);
  @sap.label : 'Title'
  Anred : String(15);
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  Name1 : String(35);
  @sap.label : 'Name 2'
  Name2 : String(35);
  @sap.label : 'Name 3'
  Name3 : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search Term 1'
  Sort1 : String(20);
  @sap.label : 'Street 2'
  StrSuppl1 : String(40);
  @sap.label : 'Street 3'
  StrSuppl2 : String(40);
  @sap.label : 'House Number'
  HouseNum1 : String(10);
  @sap.label : 'Street'
  Stras : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Postal Code'
  Pstlz : String(10);
  @sap.label : 'City'
  Ort01 : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country'
  @sap.quickinfo : 'Country Key'
  Land1 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Region'
  @sap.quickinfo : 'Region (State, Province, County)'
  Regio : String(3);
  @sap.label : 'Language Key'
  Spras : String(2);
  @sap.label : 'Telephone 1'
  @sap.quickinfo : 'First telephone number'
  Telf1 : String(16);
  @sap.label : 'Telephone 2'
  @sap.quickinfo : 'Second telephone number'
  Telf2 : String(16);
  @sap.label : 'Fax Number'
  Telfx : String(31);
  @sap.label : 'E-Mail Address'
  SmtpAddr : String(241);
  @sap.display.format : 'Date'
  @sap.label : 'Created on'
  @sap.quickinfo : 'Date on which the Record Was Created'
  Erdat : Date;
  @sap.display.format : 'Date'
  @sap.label : 'To'
  @sap.quickinfo : 'Valid-to date in current Release only 99991231 possible'
  DateTo : Date;
  @cds.ambiguous : 'missing on condition?'
  toassociation1 : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxZCHATVEN {  };
  @cds.ambiguous : 'missing on condition?'
  toassociation2 : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBID {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'SubmitQuotationPost'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxSUBMITQUATATIONPOST {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  Lifnr : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  Chrnmin : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel IMO Number'
  Vimono : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Name'
  Vname : String(40);
  @sap.display.format : 'Date'
  @sap.label : 'Bid Date'
  Biddate : Date;
  @sap.label : 'Bid Time'
  Bidtime : Time;
  @cds.ambiguous : 'missing on condition?'
  tovenditem : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBID {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'chartering Vendor'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVEND {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Lifnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  Voyno : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'SubmitQuotationItem'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBID {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  Lifnr : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  Zcode : String(12);
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
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  Chrnmin : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code Description'
  CodeDesc : String(50);
  @sap.display.format : 'Date'
  @sap.label : 'Bid Date'
  Biddate : Date;
  @sap.label : 'Bid Time'
  Bidtime : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comments'
  Zcom : String(250);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'SubmitQuotationHeader'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBIDH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Lifnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  Chrnmin : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel IMO Number'
  Vimono : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Name'
  Vname : String(40);
  @sap.display.format : 'Date'
  @sap.label : 'Bid Date'
  Biddate : Date;
  @sap.label : 'Bid Time'
  Bidtime : Time;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Vendor Price Final Bid Details'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBID {
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
  @sap.label : 'Bid Date'
  key Biddate : Date not null;
  @sap.label : 'Bid Time'
  key Bidtime : Time not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  Chrnmin : String(10);
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
  @sap.display.format : 'Date'
  currentdate : Date;
  currenttime : Time;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'awarded post'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBIDPOST {
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
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'voyage header to item'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVOYAGEHEADERTOITEM {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.label : 'Voyage name'
  @sap.quickinfo : 'Voyage Name'
  Voynm : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Nomination no'
  @sap.quickinfo : 'Nautical being used for Is-OIL'
  Vnomtk : String(20);
  @sap.label : 'Refrence Doc'
  @sap.quickinfo : 'Nautical being used for S4H or other non Oil Modules'
  Refdoc : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Ref Doc .ind'
  @sap.quickinfo : 'Reference document indicator (PSX)'
  Docind : String(1);
  @sap.label : 'Vessel name'
  @sap.quickinfo : 'Vessel Name'
  Vessn : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel IMO no'
  @sap.quickinfo : 'Vessel IMO Number - Unique'
  Vimo : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Type'
  @sap.quickinfo : 'SPOT/Time Charter'
  Chtyp : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Party Agree'
  @sap.quickinfo : 'Freight Contract'
  Chpno : String(10);
  @sap.label : 'Freight charges'
  @sap.quickinfo : 'Currency key'
  @sap.semantics : 'currency-code'
  Currkeys : String(5);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  @sap.quickinfo : 'Freight Cost for the Voyage'
  Frtco : Decimal(14, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Status'
  @sap.quickinfo : 'Not Started, Ballast, Port, EnRoute, Anchorage, Completed'
  Vstat : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Type'
  Voyty : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Type'
  Carty : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  Curr : String(3);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight cost'
  Freght : Decimal(12, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Charter Party Agreem'
  @sap.quickinfo : 'Charter Party Agreement'
  Party : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'Bid Type'
  Bidtype : String(2);
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  Frcost : Decimal(17, 5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Freight Unit'
  Frtu : String(10);
  @sap.unit : 'Currkeys'
  @sap.label : 'Actual Freight Cost'
  Frcost_Act : Decimal(17, 5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Actual Freight Unit'
  Frtu_Act : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Refrence Voyage No.'
  Ref_Voyno : String(20);
  GV_CSTATUS : String(18);
  @cds.ambiguous : 'missing on condition?'
  tobiditem : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDITEM {  };
  @cds.ambiguous : 'missing on condition?'
  tocostcharge : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCOSTCHARGES {  };
  @cds.ambiguous : 'missing on condition?'
  toitem : Association to many NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVoygItem {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Nautical Voyage Items'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVoygItem {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  key Vlegn : Integer not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Port Code'
  @sap.quickinfo : 'Unified Port Code - Unique'
  Portc : String(10);
  @sap.label : 'Port Name'
  Portn : String(25);
  @sap.label : 'Distance'
  @sap.quickinfo : 'The Post Master Fetched Using External API'
  Pdist : Decimal(13, 3);
  @sap.label : 'Distance UoM'
  @sap.quickinfo : 'Distance Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Medst : String(3);
  @sap.label : 'Speed'
  @sap.quickinfo : 'The Speed From Vessel Master/Manual Input'
  Vspeed : Decimal(17, 3);
  @sap.label : 'Port Days'
  @sap.quickinfo : 'Propsed From Historic Data/Manual Input'
  Ppdays : Decimal(6, 3);
  @sap.label : 'Sea Days'
  @sap.quickinfo : 'Proposed From Historic Data/Manual Input'
  Vsdays : Decimal(7, 3);
  @sap.display.format : 'Date'
  @sap.label : 'ETA'
  @sap.quickinfo : 'Calculated Based on ETA'
  Vetad : Date;
  @sap.label : 'Time'
  @sap.quickinfo : 'Calculated Based On ETD'
  Vetat : Time;
  @sap.display.format : 'Date'
  @sap.label : 'ETD'
  @sap.quickinfo : 'Manual Entry'
  Vetdd : Date;
  @sap.label : 'Time'
  @sap.quickinfo : 'Voyage Acutal Time'
  Vetdt : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Weather Delay .Sea'
  @sap.quickinfo : 'Caluclated from Weather Service else Manual Entry'
  Vwead : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Status'
  @sap.quickinfo : 'In Planning, Vetting In Progress, Vetting Complted'
  Pstat : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Matnr : String(40);
  @sap.label : 'Material description'
  Maktx : String(40);
  @sap.label : 'Cargo size'
  Cargs : Decimal(12, 0);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Cargu : String(3);
  @sap.label : 'Total Cost'
  Othco : Decimal(24, 3);
  @sap.label : 'Total Cost'
  Frcost : Decimal(24, 3);
  @sap.unit : 'P82B8113A600582693009F647C000F417'
  @sap.label : 'Total Cost'
  Totco : Decimal(24, 3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Chatering Vendor Master table'
entity NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxZCHATVEN {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Lifnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  Voyno : String(20);
};

