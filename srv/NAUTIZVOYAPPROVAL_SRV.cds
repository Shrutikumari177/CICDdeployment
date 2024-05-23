using NAUTIZVOYAPPROVAL_SRV from './external/NAUTIZVOYAPPROVAL_SRV.cds';

service NAUTIZVOYAPPROVAL_SRVSampleService {
    @readonly
    entity voyapprovalSet as projection on NAUTIZVOYAPPROVAL_SRV.voyapprovalSet
    {        key Vreqno, Zemail, key Voyno, Zlevel, Uname, Zdate, Ztime, Zcomm, Zaction     }    
;
}