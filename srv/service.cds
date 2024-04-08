using NAUTIMASTER_BTP_SRV from './external/NAUTIMASTER_BTP_SRV.cds';
using NAUTINAUTICALCV_SRV from './external/NAUTINAUTICALCV_SRV.cds';


service nauticalservice {
      entity xNAUTIxMASBID as projection on NAUTIMASTER_BTP_SRV.xNAUTIxMASBID
    {        key Bname, key Code, Value, Cvalue, Cunit, Datatype, Tablename, Multi_Choice     }    
;
    
    entity PortmasterSet as projection on NAUTIMASTER_BTP_SRV.PortmasterSet
    {        key Country, key Portc, Portn, Reancho, Latitude, Longitude, Countryn, Locid, Ind     }    
;
    
    entity BidMasterSet as projection on NAUTIMASTER_BTP_SRV.BidMasterSet
    {        key Bname, key Code, Value, Cvalue, Cunit, Datatype, Tablename, MultiChoice     }    
;
    
    entity BusinessPartnerSet as projection on NAUTIMASTER_BTP_SRV.BusinessPartnerSet
    {        key Lifnr, PartnerRole, Anred, Name1, Name2, Name3, Sort1, StrSuppl1, StrSuppl2, HouseNum1, Stras, Pstlz, Ort01, Land1, Regio, TimeZone, Spras, Telf1, Telf2, Telfx, SmtpAddr, Erdat, DateTo     }    
;
    
    entity ClassMasterSet as projection on NAUTIMASTER_BTP_SRV.ClassMasterSet
    {        key ZfValue, ZfDesc     }    
;
    
    entity CostMasterSet as projection on NAUTIMASTER_BTP_SRV.CostMasterSet
    {        key Costcode, Cstcodes     }    
;
    
    entity CountryMasterSet as projection on NAUTIMASTER_BTP_SRV.CountryMasterSet
    {        key ZfValue, ZfDesc     }    
;
    
    entity CountrySet as projection on NAUTIMASTER_BTP_SRV.CountrySet
    {        key Land1, Spras, Landx50     }    
;
    
    entity CurrencySet as projection on NAUTIMASTER_BTP_SRV.CurrencySet
    {        Waers, key Isocd     }    
;
    
    entity EventMasterSet as projection on NAUTIMASTER_BTP_SRV.EventMasterSet
    {        key Evtty, Text     }    
;
    
    entity MaintainGroupSet as projection on NAUTIMASTER_BTP_SRV.MaintainGroupSet
    {        key Zuser, Zgroup     }    
;
    
    entity RefrenceDocumentSet as projection on NAUTIMASTER_BTP_SRV.RefrenceDocumentSet
    {        key Docind, Docdesc     }    
;
    
    entity ReleaseStrategySet as projection on NAUTIMASTER_BTP_SRV.ReleaseStrategySet
    {        Rels, Voyty, Vesty, key Zgroup, key App1     }    
;
    
    entity StandardCurrencySet as projection on NAUTIMASTER_BTP_SRV.StandardCurrencySet
    {        Spras, key Waers, Ltext     }    
;
    
    entity UOMSet as projection on NAUTIMASTER_BTP_SRV.UOMSet
    {        key Uom, Uomdes     }    
;
    
    entity VoyageRealeaseSet as projection on NAUTIMASTER_BTP_SRV.VoyageRealeaseSet
    {        key Rels, key Voyty, key Vesty, key Zgroup, App1, App2, App3     }    
;
    
    entity ZBTP_NAUTICAL_CURRENCY as projection on NAUTIMASTER_BTP_SRV.ZBTP_NAUTICAL_CURRENCY
    {        key waers, isocd, spras, ltext, ktext     }    
;
    
    entity country_updSet as projection on NAUTIMASTER_BTP_SRV.country_updSet
    {        key ZfValue, ZfDesc     }    
;
    
    entity xNAUTIxVOY as projection on NAUTIMASTER_BTP_SRV.xNAUTIxVOY
    {        key voycd, voydes     }    
;
    
    entity xNAUTIxvend_btp as projection on NAUTIMASTER_BTP_SRV.xNAUTIxvend_btp
    {        key Supplier, key CompanyCode, key BusinessPartner, key PurchasingOrganization, key BankCountry, key Bank, key BankAccount, key Country, SupplierName, OrganizationBPName1, OrganizationBPName2, SupplierCountryName, PostalCode, CityName, StreetName, PhoneNumber1, FaxNumber, CreationDate, CreatedByUser, PhoneNumber2, IsNaturalPerson, TaxNumber1, TaxNumber2, TaxNumber3, TaxNumber4, TaxNumber5, VATRegistration, ResponsibleType, TaxNumberType, TaxNumberResponsible, AddressID, DeletionIndicator, SupplierAccountGroup, AccountGroupName, AuthorizationGroup, AccountIsBlockedForPosting, PaymentIsBlockedForSupplier, AlternativePayeeAccountNumber, SearchString, LayoutSortingRule, ReconciliationAccount, PaymentMethodsList, AccountingClerk, AccountingClerkFaxNumber, SupplierClerkURL, AccountingClerkPhoneNumber, SuplrCoCodePaymentTerms, PaymentBlockingReason, SuplrIsDeltdCoCode, CashPlanningGroup, IsToBeCheckedForDuplicates, SupplierIsBlockedForPosting, PurOrdAutoGenerationIsAllowed, PurchasingGroup, SupplierPurgOrgPaymentTerms, PurchasingIsBlockedForSupplier, SuplrIsDeltdPurgOrg, InvoiceIsGoodsReceiptBased, PurchaseOrderCurrency, EmailAddress, BankName, BankInternalID, SWIFTCode, IBAN, BankControlKey, BankAccountHolderName, CountryName, BusPartPOBoxDvtgCityName, VATLiability, WithholdingTaxCountry, FullName, SearchTerm1, SearchTerm2, BranchCode, TH_BranchCodeDescription, IsDefaultValue, PreviousAccountNumber     }    
;
    entity BidTypeSet             as
        projection on NAUTINAUTICALCV_SRV.BidTypeSet {
                Ddtext,
            key DomvalueL
        };

    entity CarTypeSet             as
        projection on NAUTINAUTICALCV_SRV.CarTypeSet {
            key Carcd,
                Cardes
        };

    entity CargoUnitSet           as
        projection on NAUTINAUTICALCV_SRV.CargoUnitSet {
            key Uom,
                Uomdes
        };

    entity CurTypeSet             as
        projection on NAUTINAUTICALCV_SRV.CurTypeSet {
            key Navoycur,
                Navoygcurdes
        };

    entity GtPlanSet              as
        projection on NAUTINAUTICALCV_SRV.GtPlanSet {
            key Voyno,
                Vlegn,
                Portc,
                Portn,
                Locnam,
                Pdist,
                Medst,
                Vspeed,
                Ppdays,
                Vsdays,
                Vetad,
                Vetat,
                Vetdd,
                Vetdt,
                Vwead,
                Pstat,
                Matnr,
                Maktx,
                Cargs,
                Cargu,
                Frcost,
                Othco,
                Totco
        };

    entity GtTabSet               as
        projection on NAUTINAUTICALCV_SRV.GtTabSet {
                Voyno,
                Vlegn,
            key Portc,
                Portn,
                Locnam,
                Pdist,
                Medst,
                Vspeed,
                Ppdays,
                Vsdays,
                Vetad,
                Vetat,
                Vetdd,
                Vetdt,
                Vwead,
                Pstat,
                Matnr,
                Maktx,
                Cargs,
                Cargu,
                Frcost,
                Othco,
                Totco
        };

    entity VoyTypeSet             as
        projection on NAUTINAUTICALCV_SRV.VoyTypeSet {
            key Voycd,
                Voydes
        };

    entity ZCalculateSet          as
        projection on NAUTINAUTICALCV_SRV.ZCalculateSet {
            key GvSpeed
        };

    entity ZCreatePlanSet         as
        projection on NAUTINAUTICALCV_SRV.ZCreatePlanSet {
            key Voyno,
                Voynm,
                Voyty,
                Carty,
                Curr,
                Bidtype
        };
}
