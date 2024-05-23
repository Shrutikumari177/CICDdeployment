using NAUTIMASTER_BTP_SRV from './external/NAUTIMASTER_BTP_SRV.cds';

service NAUTIMASTER_BTP_SRVSampleService {
    @readonly
    entity BidMasterSet as projection on NAUTIMASTER_BTP_SRV.BidMasterSet
    {        key Bname, key Code, Value, Cvalue, Cunit, Datatype, Tablename, MultiChoice     }    
;
    @readonly
    entity BusinessPartnerSet as projection on NAUTIMASTER_BTP_SRV.BusinessPartnerSet
    {        key Lifnr, PartnerRole, Anred, Name1, Name2, Name3, Sort1, StrSuppl1, StrSuppl2, HouseNum1, Stras, Pstlz, Ort01, Land1, Regio, TimeZone, Spras, Telf1, Telf2, Telfx, SmtpAddr, Erdat, DateTo     }    
;
    @readonly
    entity ClassMasterSet as projection on NAUTIMASTER_BTP_SRV.ClassMasterSet
    {        key ZfValue, ZfDesc     }    
;
    @readonly
    entity CostMasterSet as projection on NAUTIMASTER_BTP_SRV.CostMasterSet
    {        key Costcode, Cstcodes     }    
;
    @readonly
    entity CountryMasterSet as projection on NAUTIMASTER_BTP_SRV.CountryMasterSet
    {        key ZfValue, ZfDesc     }    
;
    @readonly
    entity CountrySet as projection on NAUTIMASTER_BTP_SRV.CountrySet
    {        Spras, key Land1, Landx50     }    
;
    @readonly
    entity CurrencySet as projection on NAUTIMASTER_BTP_SRV.CurrencySet
    {        Waers, key Isocd     }    
;
    @readonly
    entity EventMasterSet as projection on NAUTIMASTER_BTP_SRV.EventMasterSet
    {        key Evtty, Text     }    
;
    @readonly
    entity MaintainGroupSet as projection on NAUTIMASTER_BTP_SRV.MaintainGroupSet
    {        key Zuser, Zgroup     }    
;
    @readonly
    entity PortmasterSet as projection on NAUTIMASTER_BTP_SRV.PortmasterSet
    {        key Country, key Portc, Portn, Reancho, Latitude, Longitude, Countryn, Locid, Ind     }    
;
    @readonly
    entity PortmasterUpdateSet as projection on NAUTIMASTER_BTP_SRV.PortmasterUpdateSet
    {        key Country, key Portc, Portn, Reancho, Latitude, Longitude, Countryn, Locid, Ind     }    
;
    @readonly
    entity RefrenceDocumentSet as projection on NAUTIMASTER_BTP_SRV.RefrenceDocumentSet
    {        key Docind, Docdesc     }    
;
    @readonly
    entity RelStrategySet as projection on NAUTIMASTER_BTP_SRV.RelStrategySet
    {        key Rels, key Voyty, key Vesty, key Zgroup, App1, App2, App3     }    
;
    @readonly
    entity StandardCurrencySet as projection on NAUTIMASTER_BTP_SRV.StandardCurrencySet
    {        Spras, key Waers, Ltext     }    
;
    @readonly
    entity UOMSet as projection on NAUTIMASTER_BTP_SRV.UOMSet
    {        key Uom, Uomdes     }    
;
    @readonly
    entity VoyageRealeaseSet as projection on NAUTIMASTER_BTP_SRV.VoyageRealeaseSet
    {        key Rels, key Voyty, key Vesty, key Zgroup, App1, App2, App3     }    
;
    @readonly
    entity xNAUTIxBusinessPartner1 as projection on NAUTIMASTER_BTP_SRV.xNAUTIxBusinessPartner1
    {        key Lifnr, PartnerRole, Anred, Name1, Name2, Name3, Sort1, StrSuppl1, StrSuppl2, HouseNum1, Stras, Pstlz, Ort01, Land1, Regio, Spras, Telf1, Telf2, Telfx, SmtpAddr, Erdat, DateTo     }    
;
    @readonly
    entity xNAUTIxMASBID as projection on NAUTIMASTER_BTP_SRV.xNAUTIxMASBID
    {        key Bname, key Code, Value, Cvalue, Cunit, Datatype, Tablename, Multi_Choice     }    
;
    @readonly
    entity xNAUTIxSAPUSERS as projection on NAUTIMASTER_BTP_SRV.xNAUTIxSAPUSERS
    {        key bname, uflag     }    
;
    @readonly
    entity xNAUTIxUIIDUSRGROUP as projection on NAUTIMASTER_BTP_SRV.xNAUTIxUIIDUSRGROUP
    {        key Zuser, Zgroup     }    
;
    @readonly
    entity xNAUTIxVOY as projection on NAUTIMASTER_BTP_SRV.xNAUTIxVOY
    {        key voycd, voydes     }    
;
    @readonly
    entity xNAUTIxuseridassociation as projection on NAUTIMASTER_BTP_SRV.xNAUTIxuseridassociation
    {        key Zgroup     }    
;
    @readonly
    entity xNAUTIxvend_btp as projection on NAUTIMASTER_BTP_SRV.xNAUTIxvend_btp
    {        key Supplier, key CompanyCode, key BusinessPartner, key PurchasingOrganization, key BankCountry, key Bank, key BankAccount, key Country, SupplierName, OrganizationBPName1, OrganizationBPName2, SupplierCountryName, PostalCode, CityName, StreetName, PhoneNumber1, FaxNumber, CreationDate, CreatedByUser, PhoneNumber2, IsNaturalPerson, TaxNumber1, TaxNumber2, TaxNumber3, TaxNumber4, TaxNumber5, VATRegistration, ResponsibleType, TaxNumberType, TaxNumberResponsible, AddressID, DeletionIndicator, SupplierAccountGroup, AccountGroupName, AuthorizationGroup, AccountIsBlockedForPosting, PaymentIsBlockedForSupplier, AlternativePayeeAccountNumber, SearchString, LayoutSortingRule, ReconciliationAccount, PaymentMethodsList, AccountingClerk, AccountingClerkFaxNumber, SupplierClerkURL, AccountingClerkPhoneNumber, SuplrCoCodePaymentTerms, PaymentBlockingReason, SuplrIsDeltdCoCode, CashPlanningGroup, IsToBeCheckedForDuplicates, SupplierIsBlockedForPosting, PurOrdAutoGenerationIsAllowed, PurchasingGroup, SupplierPurgOrgPaymentTerms, PurchasingIsBlockedForSupplier, SuplrIsDeltdPurgOrg, InvoiceIsGoodsReceiptBased, PurchaseOrderCurrency, EmailAddress, BankName, BankInternalID, SWIFTCode, IBAN, BankControlKey, BankAccountHolderName, CountryName, BusPartPOBoxDvtgCityName, VATLiability, WithholdingTaxCountry, FullName, SearchTerm1, SearchTerm2, BranchCode, TH_BranchCodeDescription, IsDefaultValue, PreviousAccountNumber     }    
;
    @readonly
    entity country_updSet as projection on NAUTIMASTER_BTP_SRV.country_updSet
    {        key ZfValue, ZfDesc     }    
;
    @readonly
    entity GROUPIDSet as projection on NAUTIMASTER_BTP_SRV.GROUPIDSet
    {        key GroupId     }    
;
    @readonly
    entity GROUPIDUSERSSet as projection on NAUTIMASTER_BTP_SRV.GROUPIDUSERSSet
    {        key GroupId, UserId     }    
;
}