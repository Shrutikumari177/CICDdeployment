/* checksum : dc9efa7e065f7553c083c72ec67a320c */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIUSERMAILID_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'user of email'
entity NAUTIUSERMAILID_SRV.xNAUTIxuserEmail {
  @sap.label : 'E-Mail Address'
  key SmtpAddr : String(241) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Person number'
  Persnumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'User'
  @sap.quickinfo : 'User Name in User Master Record'
  username : String(12);
  @odata.Type : 'Edm.Byte'
  @sap.label : 'User Lock'
  @sap.quickinfo : 'User Lock Status'
  Uflag : Integer;
};

