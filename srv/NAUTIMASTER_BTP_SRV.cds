using NAUTIMASTER_BTP_SRV from './external/NAUTIMASTER_BTP_SRV.cds';

service NAUTIMASTER_BTP_SRVSampleService {
    
    entity xNAUTIxSAPUSERS as projection on NAUTIMASTER_BTP_SRV.xNAUTIxSAPUSERS
    {        key bname, uflag     }    
;
    
    entity xNAUTIxcury_count as projection on NAUTIMASTER_BTP_SRV.xNAUTIxcury_count
    {        key Waers, key Land1, Ltext, landx     }    
;
    
    entity xNAUTIxuseridassociation as projection on NAUTIMASTER_BTP_SRV.xNAUTIxuseridassociation
    {        key Zgroup     }    
;
    
    entity xNAUTIxUIIDUSRGROUP as projection on NAUTIMASTER_BTP_SRV.xNAUTIxUIIDUSRGROUP
    {        key Zuser, Zgroup     }    
;
}