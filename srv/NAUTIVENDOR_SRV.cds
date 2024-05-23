using NAUTIVENDOR_SRV from './external/NAUTIVENDOR_SRV.cds';

service NAUTIVENDOR_SRVSampleService {
    
    entity ITEM_BIDSet as projection on NAUTIVENDOR_SRV.ITEM_BIDSet
    {        key Voyno, Zcode, Value, CodeDesc, RevBid, Good, Mand, Must, Zmin, Zmax     }    
;
    
    entity MasBidTemplateSet as projection on NAUTIVENDOR_SRV.MasBidTemplateSet
    {        key Code, Value, Cvalue, Cunit, Datatype, Tablename, MultiChoice     }    
;
    
    entity DynamicTableSet as projection on NAUTIVENDOR_SRV.DynamicTableSet
    
;
    
    entity VendBidSet as projection on NAUTIVENDOR_SRV.VendBidSet
    {        key Voyno, Lifnr, Zcode, Value, Cvalue, Cunit, key Chrnmin, CodeDesc     }    
;
}