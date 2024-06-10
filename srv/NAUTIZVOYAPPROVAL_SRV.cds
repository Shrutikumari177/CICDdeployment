using NAUTIZVOYAPPROVAL_SRV from './external/NAUTIZVOYAPPROVAL_SRV.cds';

service NAUTIZVOYAPPROVAL_SRVSampleService {
    
    entity voyapprovalSet as projection on NAUTIZVOYAPPROVAL_SRV.voyapprovalSet
    {        key Vreqno, Zemail, key Voyno, key Zlevel, key Uname, Zdate, Ztime, Zcomm, Zaction     }    
;
    
    entity xNAUTIxgetvoyapproval as projection on NAUTIZVOYAPPROVAL_SRV.xNAUTIxgetvoyapproval
    {        key Vreqno, key Voyno     }    
;
    
    entity xNAUTIxvoyapproval1 as projection on NAUTIZVOYAPPROVAL_SRV.xNAUTIxvoyapproval1
    {        key Vreqno, key Voyno, key Zlevel, key Uname, key Zdate, key Ztime, key Zemail, Zcomm, Zaction     }    
;
}