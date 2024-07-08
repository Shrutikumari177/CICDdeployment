using NAUTIMASTER_BTP_SRV from './external/NAUTIMASTER_BTP_SRV.cds';

service NAUTIMASTER_BTP_SRVSampleService {
    @readonly
    entity xNAUTIxportmascds as projection on NAUTIMASTER_BTP_SRV.xNAUTIxportmascds
    {        key Country, key Portc, Portn, Reancho, Latitude, Longitude, Countryn, Locid, Ind     }    
;
}