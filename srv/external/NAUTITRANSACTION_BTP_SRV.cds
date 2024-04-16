/* checksum : dfdbe4771a3d847301918f89142b1fac */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTITRANSACTION_BTP_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTITRANSACTION_BTP_SRV.VoyageHeaderSet {
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Voynm : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Nomination no'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vnomtk : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Refrence Doc'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Refdoc : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Ref Doc .ind'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Docind : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vessel name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vessn : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vessel IMO no'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vimo : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Charter Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chtyp : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Charter Party Agree'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chpno : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Freight charges'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Currkeys : String(5) not null;
  @sap.unicode : 'false'
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Frtco : Decimal(14, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage Status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vstat : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Voyty : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vessel Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Carty : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Curr : String(3) not null;
  @sap.unicode : 'false'
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Freght : Decimal(12, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Charter Party Agreem'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Party : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bid Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bidtype : String(2) not null;
  @sap.unicode : 'false'
  @sap.unit : 'Currkeys'
  @sap.label : 'Freight Cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Frcost : Decimal(17, 5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Freight Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Frtu : String(10) not null;
  @sap.unicode : 'false'
  @sap.unit : 'Currkeys'
  @sap.label : 'Actual Freight Cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  FrcostAct : Decimal(17, 5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Actual Freight Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  FrtuAct : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Indicator'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Zdelete : Boolean not null;
  @sap.unicode : 'false'
  @sap.label : 'Refrence Voyage No.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  RefVoyno : String(20) not null;
  @cds.ambiguous : 'missing on condition?'
  NavVoyageHeaderToItem : Association to many NAUTITRANSACTION_BTP_SRV.VoyageItemSet on NavVoyageHeaderToItem.Voyno = Voyno;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTITRANSACTION_BTP_SRV.VoyageItemSet {
  @sap.unicode : 'false'
  @sap.label : 'Voyage No'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyno : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'LegID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vlegn : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Portc : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Portn : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'Distance'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Pdist : Decimal(13, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'UoM-Distance'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'unit-of-measure'
  Medst : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Speed'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vspeed : Decimal(17, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Days'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ppdays : Decimal(6, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Sea Days'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vsdays : Decimal(7, 3) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'ETA'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vetad : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vetat : Time not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'ETD'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vetdd : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vetdt : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Weather Delay .Sea'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vwead : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Pstat : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Material'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Matnr : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Maktx : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Cargo size'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Cargs : Decimal(12, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'Base Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'unit-of-measure'
  Cargu : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Total Cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Othco : Decimal(24, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Total Cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Frcost : Decimal(24, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Total Cost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Totco : Decimal(24, 3) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTITRANSACTION_BTP_SRV.CharteringSet {
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
  Zdelete : Boolean not null;
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
  Chrexcr : Decimal(14, 0) not null;
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
  Chrctime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Bidding Start Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqstime : Time not null;
  @sap.unicode : 'false'
  @sap.label : 'Bidding End Time'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Chrqetime : Time not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'voyage header to item'
entity NAUTITRANSACTION_BTP_SRV.xNAUTIxVOYAGEHEADERTOITEM {
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
  @cds.ambiguous : 'missing on condition?'
  toitem : Association to many NAUTITRANSACTION_BTP_SRV.xNAUTIxVoygItem {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Nautical Voyage Items'
entity NAUTITRANSACTION_BTP_SRV.xNAUTIxVoygItem {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'LegID'
  @sap.quickinfo : 'Unique leg under a Voyage'
  key Vlegn : String(10) not null;
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

