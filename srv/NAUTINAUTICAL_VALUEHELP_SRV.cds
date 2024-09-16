using NAUTINAUTICAL_VALUEHELP_SRV from './external/NAUTINAUTICAL_VALUEHELP_SRV.cds';

service NAUTINAUTICAL_VALUEHELP_SRVSampleService {
    @readonly
    entity xNAUTIxcostprof_ass as projection on NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxcostprof_ass
    {        key Costprofid     }    
;
}