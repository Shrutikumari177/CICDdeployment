/* checksum : b41e06109e518d90641475a147053bfa */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIZVOY_VALUEHELP_CDS {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'value help for voyage'
entity NAUTIZVOY_VALUEHELP_CDS.xNAUTIxvoy_valuehelp {
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

