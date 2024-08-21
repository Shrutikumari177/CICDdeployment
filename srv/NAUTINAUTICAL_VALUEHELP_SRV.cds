using NAUTINAUTICAL_VALUEHELP_SRV from './external/NAUTINAUTICAL_VALUEHELP_SRV.cds';

service NAUTINAUTICAL_VALUEHELP_SRVSampleService {
    
    entity xNAUTIxbidprofile_valuehelp as projection on NAUTINAUTICAL_VALUEHELP_SRV.xNAUTIxbidprofile_valuehelp
    {        key BidprofileId     }    
;
}