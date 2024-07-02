using NAUTIMASTER_BTP_SRV from './external/NAUTIMASTER_BTP_SRV.cds';

service NAUTIMASTER_BTP_SRVSampleService {
    @readonly
    entity xNAUTIxCountrySetFetch as projection on NAUTIMASTER_BTP_SRV.xNAUTIxCountrySetFetch
    {        key land1, spras, landx50     }    
;
}