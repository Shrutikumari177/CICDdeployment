using NAUTICHASTATUS_SRV from './external/NAUTICHASTATUS_SRV.cds';

service NAUTICHASTATUS_SRVSampleService {
    
    entity cha_statusSet as projection on NAUTICHASTATUS_SRV.cha_statusSet
    {        key Chrnmin, Creqno, Zlevel, Zaction     }    
;
}