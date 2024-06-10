using NAUTIZVOY_VALUEHELP_CDS from './external/NAUTIZVOY_VALUEHELP_CDS.cds';

service NAUTIZVOY_VALUEHELP_CDSSampleService {
    @readonly
    entity xNAUTIxvoy_valuehelp as projection on NAUTIZVOY_VALUEHELP_CDS.xNAUTIxvoy_valuehelp
    {        key Vreqno, key Voyno, Zaction     }    
;
}