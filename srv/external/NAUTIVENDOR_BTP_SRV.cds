/* checksum : 3ab377bdeb29c8bce252dd2daf142b5f */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service NAUTIVENDOR_BTP_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Vendor Master data for BTP'
entity NAUTIVENDOR_BTP_SRV.xNAUTIxvend_btp {
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierName'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Supplier : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company Code'
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
  key BankAccount : String(18) not null;
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierCountryName'
  @sap.label : 'Country'
  @sap.quickinfo : 'Country Key'
  key Country : String(3) not null;
  @sap.label : 'Name of Supplier'
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

