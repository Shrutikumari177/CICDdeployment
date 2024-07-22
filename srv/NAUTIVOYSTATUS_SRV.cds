using NAUTIVOYSTATUS_SRV from './external/NAUTIVOYSTATUS_SRV.cds';

service NAUTIVOYSTATUS_SRVSampleService {
    
    entity newallstatusesSet as projection on NAUTIVOYSTATUS_SRV.newallstatusesSet
    {        Status, key Voyage, Vdate, Vtime     }    
;
    
    entity voyappstatusSet as projection on NAUTIVOYSTATUS_SRV.voyappstatusSet
    {        Vreqno, key Voyno, Zlevel, Zcomm, Zaction     }    
;
    
    entity xNAUTIxallstatuses as projection on NAUTIVOYSTATUS_SRV.xNAUTIxallstatuses
    {        key Voyage, Status, Vdate, Vtime     }    
;
}