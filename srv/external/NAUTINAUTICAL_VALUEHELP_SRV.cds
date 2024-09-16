/* checksum : 3103bbb9ecf909b3da607e8a0bee0b09 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTINAUTICAL_VALUEHELP_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'award valuehelp'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxawardvoy_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key voyno : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'value help for bid history'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxbidhist_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key voyno : String(20) not null;
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
@sap.label : 'value help for bid prof'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxbidprofile_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'ProfileId'
  @sap.quickinfo : 'Profile id'
  key BidprofileId : String(25) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cargo valuehelp tran'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcargo_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vessel Type'
  key vessel_typ : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cargo type descripti'
  @sap.quickinfo : 'Cargo type description'
  description : String(40);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'chartering value help'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxCHARTERINGVALUEHELP {
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
@sap.label : 'chartering value help for charmin and creqno'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxCHARTERVALUEHELP {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  key Chrnmin : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Approval'
  @sap.quickinfo : 'Chartering Approval Request Number'
  key Creqno : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'valuehelp'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxch_valuehelp {
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
@sap.label : 'cost profile'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcostprofile {
  @sap.display.format : 'UpperCase'
  @sap.label : 'CostProId'
  @sap.quickinfo : 'cost profile dataelement'
  key Costprofid : String(30) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost.Code'
  @sap.quickinfo : 'Cost Code'
  Costcode : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Cost.Code.Des'
  @sap.quickinfo : 'Cost Code Description'
  Cstcodes : String(35);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'association of cost profile'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcostprof_ass {
  @sap.display.format : 'UpperCase'
  @sap.label : 'CostProId'
  @sap.quickinfo : 'cost profile dataelement'
  key Costprofid : String(30) not null;
  to_name : Association to many NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcostprofile {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'valuehelp for cost profile'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcostprof_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'CostProId'
  @sap.quickinfo : 'cost profile dataelement'
  key Costprofid : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'currency valuehelp tran'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcurrency_val {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  key Navoycur : String(3) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency Description'
  Navoygcurdes : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : ''
  @sap.quickinfo : 'COUNTRY'
  NAVOCOUNT : String(15);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'value help for dist vendbid'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxvendbid_val {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chartering Req. No.'
  @sap.quickinfo : 'Charter No'
  Chrnmin : String(10);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'voyagetype valuehelp'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxvoytyp_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Code'
  @sap.quickinfo : 'Voyage Type'
  key VoyageType : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Code Descript'
  @sap.quickinfo : 'Voyage Code Description'
  Voydes : String(40);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'value help for voyage'
entity NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxvoy_valuehelp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage No'
  @sap.quickinfo : 'Voyage Number'
  key Voyno : String(20) not null;
  @sap.label : 'Voyage name'
  @sap.quickinfo : 'Voyage Name'
  voynm : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Action Taken'
  Zaction : String(4);
};

