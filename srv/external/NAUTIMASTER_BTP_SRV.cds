/* checksum : 2f50167239935045cf7160b4e0655017 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIMASTER_BTP_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.BusinessPartnerSet {
  @sap.unicode : 'false'
  @sap.label : 'Vendor'
  @sap.updatable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'BP Role'
  PartnerRole : String(7) not null;
  @sap.unicode : 'false'
  @sap.label : 'Title'
  Anred : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  Name1 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name 2'
  Name2 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name 3'
  Name3 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Search Term 1'
  Sort1 : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street 2'
  StrSuppl1 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street 3'
  StrSuppl2 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'House Number'
  HouseNum1 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street'
  Stras : String(60) not null;
  @sap.unicode : 'false'
  @sap.label : 'Postal Code'
  Pstlz : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'City'
  Ort01 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country'
  Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Region'
  Regio : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Time zone'
  TimeZone : String(6) not null;
  @sap.unicode : 'false'
  @sap.label : 'Language'
  Spras : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Telephone 1'
  Telf1 : String(16) not null;
  @sap.unicode : 'false'
  @sap.label : 'Telephone 2'
  Telf2 : String(16) not null;
  @sap.unicode : 'false'
  @sap.label : 'Fax Number'
  Telfx : String(31) not null;
  @sap.unicode : 'false'
  @sap.label : 'E-Mail Address'
  SmtpAddr : String(241) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Created on'
  Erdat : Timestamp;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'To'
  DateTo : Timestamp;
};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.MaintainGroupSet {
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.updatable : 'false'
  key Zuser : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User ID group'
  Zgroup : String(12) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.CountryMasterSet {
  @sap.unicode : 'false'
  @sap.label : 'Value'
  @sap.updatable : 'false'
  key ZfValue : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Field Description'
  ZfDesc : String(50) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.CostMasterSet {
  @sap.unicode : 'false'
  @sap.label : 'Cost.Code'
  @sap.updatable : 'false'
  key Costcode : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Cost.Code.Des'
  Cstcodes : String(35) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.EventMasterSet {
  @sap.unicode : 'false'
  @sap.label : 'Event Type'
  key Evtty : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Event Text'
  Text : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.ClassMasterSet {
  @sap.unicode : 'false'
  @sap.label : 'Value'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  key ZfValue : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Field Description'
  @sap.filterable : 'false'
  ZfDesc : String(50) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.BidMasterSet {
  @sap.unicode : 'false'
  @sap.label : 'User'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bname : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Code : String(12) not null;
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
  @sap.unicode : 'false'
  @sap.label : 'Datatype'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Datatype : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Table Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Tablename : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Multiple Choice'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  MultiChoice : Boolean not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.GROUPIDSet {
  @sap.unicode : 'false'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key GroupId : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.GROUPIDUSERSSet {
  @sap.unicode : 'false'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key GroupId : LargeString not null;
  @sap.unicode : 'false'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  UserId : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.UOMSet {
  @sap.unicode : 'false'
  @sap.label : 'Unit of measure'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Uom : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Uom Discription'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Uomdes : String(30) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.country_updSet {
  @sap.unicode : 'false'
  @sap.label : 'Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key ZfValue : String(50) not null;
  @sap.unicode : 'false'
  @sap.label : 'Field Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ZfDesc : String(50) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.PortmasterSet {
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Country : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Portc : String(10) not null;
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
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.RefrenceDocumentSet {
  @sap.unicode : 'false'
  @sap.label : 'Ref Doc .ind'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Docind : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Doc Desc'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Docdesc : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.PortmasterUpdateSet {
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Country : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Port Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Portc : String(10) not null;
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
  Ind : Boolean not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.VoyageRealeaseSet {
  @sap.unicode : 'false'
  @sap.label : 'Release Strategy'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Rels : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyty : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vessel Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Vesty : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'User ID group'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Zgroup : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  App1 : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  App2 : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  App3 : String(12) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.CountrySet {
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Language'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Spras : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Landx50 : String(50) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.CurrencySet {
  @sap.unicode : 'false'
  @sap.label : 'ISO code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Isocd : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Waers : String(5) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.StandardCurrencySet {
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  key Waers : String(5) not null;
  @sap.unicode : 'false'
  @sap.label : 'Language'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Spras : String(2) not null;
  @sap.unicode : 'false'
  @sap.label : 'Long Text'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ltext : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity NAUTIMASTER_BTP_SRV.RelStrategySet {
  @sap.unicode : 'false'
  @sap.label : 'Release Strategy'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Rels : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Voyage Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Voyty : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Vessel Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Vesty : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'User ID group'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Zgroup : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  App1 : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  App2 : String(12) not null;
  @sap.unicode : 'false'
  @sap.label : 'User Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  App3 : String(12) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cds for bp master'
entity NAUTIMASTER_BTP_SRV.xNAUTIxBusinessPartner1 {
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
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Bidding Master'
entity NAUTIMASTER_BTP_SRV.xNAUTIxMASBID {
  @sap.display.format : 'UpperCase'
  @sap.label : 'User'
  @sap.quickinfo : 'User Name in User Master Record'
  key Bname : String(12) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Code'
  key Code : String(12) not null;
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
  @sap.label : 'Datatype'
  @sap.quickinfo : 'RSM Data type'
  Datatype : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Table Name'
  Tablename : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Multiple Choice'
  Multi_Choice : Boolean;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'cds view for fetching sap user in btp'
entity NAUTIMASTER_BTP_SRV.xNAUTIxSAPUSERS {
  @sap.display.format : 'UpperCase'
  @sap.label : 'User'
  @sap.quickinfo : 'User Name in User Master Record'
  key bname : String(12) not null;
  @odata.Type : 'Edm.Byte'
  @sap.label : 'User Lock'
  @sap.quickinfo : 'User Lock Status'
  uflag : Integer;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'user and userid group'
entity NAUTIMASTER_BTP_SRV.xNAUTIxUIIDUSRGROUP {
  @sap.display.format : 'UpperCase'
  @sap.label : 'User Name'
  key Zuser : String(12) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'User ID group'
  Zgroup : String(12);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'user and userid association'
entity NAUTIMASTER_BTP_SRV.xNAUTIxuseridassociation {
  @sap.display.format : 'UpperCase'
  @sap.label : 'User ID group'
  key Zgroup : String(12) not null;
  @cds.ambiguous : 'missing on condition?'
  to_association : Association to many NAUTIMASTER_BTP_SRV.xNAUTIxUIIDUSRGROUP {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Vendor Master data for BTP'
entity NAUTIMASTER_BTP_SRV.xNAUTIxvend_btp {
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierName'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  @sap.value.list : 'standard'
  key Supplier : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company Code'
  @sap.value.list : 'standard'
  key CompanyCode : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business Partner'
  @sap.quickinfo : 'Business Partner Number'
  key BusinessPartner : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purch. organization'
  @sap.quickinfo : 'Purchasing organization'
  key PurchasingOrganization : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.text : 'CountryName'
  @sap.label : 'Bank Country'
  @sap.quickinfo : 'Bank country key'
  key BankCountry : String(3) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bank number'
  key Bank : String(15) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bank acct'
  @sap.quickinfo : 'Bank Account Number'
  @sap.value.list : 'standard'
  key BankAccount : String(18) not null;
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierCountryName'
  @sap.label : 'Country'
  @sap.quickinfo : 'Country Key'
  @sap.value.list : 'standard'
  key Country : String(3) not null;
  @sap.label : 'Name of Supplier'
  @sap.value.list : 'standard'
  SupplierName : String(80);
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  OrganizationBPName1 : String(35);
  @sap.label : 'Name 2'
  OrganizationBPName2 : String(35);
  @sap.label : 'Country Name'
  @sap.quickinfo : 'Country Name (Max. 50 Characters)'
  SupplierCountryName : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Postal Code'
  PostalCode : String(10);
  @sap.label : 'City'
  @sap.value.list : 'standard'
  CityName : String(40);
  @sap.label : 'Street'
  @sap.quickinfo : 'Street and House Number'
  StreetName : String(35);
  @sap.label : 'Telephone 1'
  @sap.quickinfo : 'First telephone number'
  @sap.semantics : 'tel'
  PhoneNumber1 : String(16);
  @sap.label : 'Fax Number'
  @sap.semantics : 'tel'
  FaxNumber : String(31);
  @sap.display.format : 'Date'
  @sap.label : 'Created on'
  @sap.quickinfo : 'Date on which the Record Was Created'
  CreationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created by'
  @sap.quickinfo : 'Name of Person who Created the Object'
  CreatedByUser : String(12);
  @sap.label : 'Telephone 2'
  @sap.quickinfo : 'Second telephone number'
  PhoneNumber2 : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Natural Person'
  IsNaturalPerson : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 1'
  TaxNumber1 : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 2'
  TaxNumber2 : String(11);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 3'
  TaxNumber3 : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 4'
  TaxNumber4 : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 5'
  TaxNumber5 : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'VAT Registration No.'
  @sap.quickinfo : 'VAT Registration Number'
  VATRegistration : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Type'
  ResponsibleType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number Type'
  TaxNumberType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number'
  @sap.quickinfo : 'Tax Number at Responsible Tax Authority'
  TaxNumberResponsible : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Address'
  AddressID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Del. Supplier Lvl'
  @sap.quickinfo : 'Deletion Flag for Master Record on Supplier Level'
  DeletionIndicator : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.text : 'AccountGroupName'
  @sap.label : 'Supplier Acct Group'
  @sap.quickinfo : 'Supplier Account Group'
  SupplierAccountGroup : String(4);
  @sap.label : 'Name'
  @sap.quickinfo : 'Account Group Name'
  AccountGroupName : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization'
  @sap.quickinfo : 'Authorization Group'
  AuthorizationGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Central Post. Block'
  @sap.quickinfo : 'Central Posting Block'
  AccountIsBlockedForPosting : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment Block'
  PaymentIsBlockedForSupplier : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Payee'
  @sap.quickinfo : 'Account Number of the Alternative Payee'
  AlternativePayeeAccountNumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company Code'
  @sap.value.list : 'standard'
  SearchString : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sort key'
  @sap.quickinfo : 'Key for sorting according to assignment numbers'
  LayoutSortingRule : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Recon. Account'
  @sap.quickinfo : 'Reconciliation Account in General Ledger'
  ReconciliationAccount : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment Methods'
  @sap.quickinfo : 'List of Respected Payment Methods'
  PaymentMethodsList : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Accounting Clerk'
  AccountingClerk : String(2);
  @sap.label : 'Clerk Fax No'
  @sap.quickinfo : 'Accounting clerk''s fax number at the customer/supplier'
  AccountingClerkFaxNumber : String(31);
  @sap.label : 'Internet Add.'
  @sap.quickinfo : 'Internet address of partner company clerk'
  SupplierClerkURL : String(130);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Acct.clerks tel.no.'
  @sap.quickinfo : 'Accounting clerk''s telephone number at business partner'
  AccountingClerkPhoneNumber : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Terms of PaytKey CC'
  @sap.quickinfo : 'Terms of Payment Key (Company Code)'
  SuplrCoCodePaymentTerms : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Item Payment Block'
  @sap.quickinfo : 'Payment Block on Item'
  PaymentBlockingReason : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Del. CoCd Lvl'
  @sap.quickinfo : 'Deletion Flag for Master Record on Company Code Level'
  SuplrIsDeltdCoCode : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planning Group'
  CashPlanningGroup : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Check Double Invoice'
  @sap.quickinfo : 'Check Flag for Double Invoices or Credit Memos'
  IsToBeCheckedForDuplicates : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Splr Post. Blk'
  @sap.quickinfo : 'Posting block for company code'
  SupplierIsBlockedForPosting : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Automatic PO'
  @sap.quickinfo : 'Automatic Generation of Purchase Order Allowed'
  PurOrdAutoGenerationIsAllowed : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Group'
  PurchasingGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Terms of PaytKey PO'
  @sap.quickinfo : 'Terms of Payment Key (Purchasing Org)'
  SupplierPurgOrgPaymentTerms : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Block'
  @sap.quickinfo : 'Purchasing block at purchasing organization level'
  PurchasingIsBlockedForSupplier : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Del. Purch. Lvl'
  @sap.quickinfo : 'Deletion Flag for Master Record on Purchasing Org. Level'
  SuplrIsDeltdPurgOrg : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'GR-Based Inv. Verif.'
  @sap.quickinfo : 'Indicator: GR-Based Invoice Verification'
  InvoiceIsGoodsReceiptBased : Boolean;
  @sap.label : 'Order currency'
  @sap.quickinfo : 'Purchase order currency'
  @sap.semantics : 'currency-code'
  PurchaseOrderCurrency : String(5);
  @sap.label : 'Email Address'
  @sap.semantics : 'email'
  EmailAddress : String(241);
  @sap.label : 'Bank name'
  @sap.quickinfo : 'Name of bank'
  BankName : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bank Key'
  @sap.quickinfo : 'Bank Keys'
  BankInternalID : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'SWIFT/BIC'
  @sap.quickinfo : 'SWIFT/BIC for International Payments'
  SWIFTCode : String(11);
  @sap.display.format : 'UpperCase'
  @sap.label : 'IBAN'
  @sap.quickinfo : 'IBAN (International Bank Account Number)'
  IBAN : String(34);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bank Control Key'
  BankControlKey : String(2);
  @sap.label : 'Account Holder'
  @sap.quickinfo : 'Bank Account Holder'
  BankAccountHolderName : String(60);
  CountryName : String(56);
  @sap.label : 'BP PO Box Dvtg City'
  @sap.quickinfo : 'Business Partner PO Box Deviating City Name'
  BusPartPOBoxDvtgCityName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Liable for VAT'
  VATLiability : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'WTax Country'
  @sap.quickinfo : 'Withholding Tax Country Key'
  WithholdingTaxCountry : String(3);
  @sap.label : 'Full Name'
  @sap.quickinfo : 'Full Name of Person'
  FullName : String(80);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search term 1'
  @sap.quickinfo : 'Search term 1 for business partner'
  SearchTerm1 : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search term 2'
  @sap.quickinfo : 'Search term 2 for business partner'
  SearchTerm2 : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Branch Code'
  BranchCode : String(5);
  @sap.label : 'Branch Description'
  @sap.quickinfo : 'Branch Descriptopn'
  TH_BranchCodeDescription : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Default Branch'
  @sap.quickinfo : 'Default Branch Code'
  IsDefaultValue : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Previous Account No.'
  @sap.quickinfo : 'Previous Master Record Number'
  PreviousAccountNumber : String(10);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Voyage Type Master Table'
entity NAUTIMASTER_BTP_SRV.xNAUTIxVOY {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Code'
  @sap.quickinfo : 'Voyage Type'
  key voycd : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Voyage Code Descript'
  @sap.quickinfo : 'Voyage Code Description'
  voydes : String(40);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Bank Data'
@sap.value.list : 'true'
entity NAUTIMASTER_BTP_SRV.I_Bank_Acct_VH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'BankName'
  @sap.label : 'Bank Key'
  @sap.quickinfo : 'Bank Keys'
  key BankInternalID : String(15) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bank Country'
  @sap.quickinfo : 'Bank country key'
  key BankCountry : String(3) not null;
  @sap.label : 'Bank name'
  @sap.quickinfo : 'Name of bank'
  BankName : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Company Code'
@sap.value.list : 'true'
entity NAUTIMASTER_BTP_SRV.I_CompanyCodeStdVH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'CompanyCodeName'
  @sap.label : 'Company Code'
  key CompanyCode : String(4) not null;
  @sap.label : 'Company Name'
  @sap.quickinfo : 'Name of Company Code or Company'
  CompanyCodeName : String(25);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Company Code'
@sap.value.list : 'true'
entity NAUTIMASTER_BTP_SRV.I_CompanyCodeVH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'CompanyCodeName'
  @sap.label : 'Company Code'
  key CompanyCode : String(4) not null;
  @sap.label : 'Company Name'
  @sap.quickinfo : 'Name of Company Code or Company'
  CompanyCodeName : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Controlling Area'
  ControllingArea : String(4);
  @sap.label : 'City'
  CityName : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country Key'
  Country : String(3);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Currency : String(5);
  @sap.label : 'Language Key'
  Language : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chart of Accounts'
  ChartOfAccounts : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fiscal Year Variant'
  FiscalYearVariant : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company'
  Company : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Credit control area'
  CreditControlArea : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country CoA'
  @sap.quickinfo : 'Country Chart of Accounts'
  CountryChartOfAccounts : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'FM Area'
  @sap.quickinfo : 'Financial Management Area'
  FinancialManagementArea : String(4);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Country'
@sap.value.list : 'true'
entity NAUTIMASTER_BTP_SRV.I_Country {
  @sap.display.format : 'UpperCase'
  @sap.text : 'Country_Text'
  @sap.label : 'Country Key'
  key Country : String(3) not null;
  @sap.label : 'Country Name'
  @sap.quickinfo : 'Country Name (Max. 50 Characters)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Country_Text : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code 3 Char'
  @sap.quickinfo : 'ISO country code 3 char'
  CountryThreeLetterISOCode : String(3);
  @sap.display.format : 'NonNegative'
  @sap.label : 'ISO Code Num. 3'
  @sap.quickinfo : 'ISO Country Code Numeric 3-Characters'
  CountryThreeDigitISOCode : String(3);
  @sap.label : 'Country Currency'
  @sap.semantics : 'currency-code'
  CountryCurrency : String(5);
  @sap.label : 'Index-Based Currency'
  @sap.quickinfo : 'Currency Key of the Index-Based Currency'
  @sap.semantics : 'currency-code'
  IndexBasedCurrency : String(5);
  @sap.label : 'Hard Currency'
  @sap.quickinfo : 'Currency Key of the Hard Currency'
  @sap.semantics : 'currency-code'
  HardCurrency : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Procedure'
  @sap.quickinfo : 'Procedure (Pricing, Output Control, Acct. Det., Costing,...)'
  TaxCalculationProcedure : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Altern.Country Key'
  @sap.quickinfo : 'Alternative Country Key'
  CountryAlternativeCode : String(3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Value Help for Supplier'
@sap.value.list : 'true'
entity NAUTIMASTER_BTP_SRV.I_Supplier_VH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierName'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Supplier : String(10) not null;
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  SupplierName : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization'
  @sap.quickinfo : 'Authorization Group'
  AuthorizationGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Account group'
  @sap.quickinfo : 'Vendor account group'
  SupplierAccountGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purpose Completed'
  @sap.quickinfo : 'Business Purpose Completed Flag'
  IsBusinessPurposeCompleted : String(1);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.value.list : 'true'
entity NAUTIMASTER_BTP_SRV.P_CityValueHelp {
  @sap.label : 'City'
  key CityName : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.content.version : '1'
@sap.label : 'CDS View For Currency'
entity NAUTIMASTER_BTP_SRV.ZBTP_NAUTICAL_CURRENCY {
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  key waers : String(5) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO code'
  @sap.quickinfo : 'ISO currency code'
  isocd : String(3);
  @sap.label : 'Language Key'
  spras : String(2);
  @sap.label : 'Long Text'
  ltext : String(40);
  @sap.label : 'Short text'
  ktext : String(15);
};

