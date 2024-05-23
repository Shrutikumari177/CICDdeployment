using NAUTIZCHATAPPROVAL_SRV from './external/NAUTIZCHATAPPROVAL_SRV.cds';

service NAUTIZCHATAPPROVAL_SRVSampleService {
    
    entity chartapprSet as projection on NAUTIZCHATAPPROVAL_SRV.chartapprSet
    {        key Creqno, Chrnmin, Zlevel, Uname, Zdate, Ztime, Zcomm, Zaction     }    
;
    
    entity xNAUTIxchaApp1 as projection on NAUTIZCHATAPPROVAL_SRV.xNAUTIxchaApp1
    {        key Creqno, key Chrnmin, key Zlevel, key Uname, key Zdate, key Ztime, Zcomm, Zaction     }    
;
}