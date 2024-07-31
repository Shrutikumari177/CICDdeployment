using NAUTILIVEBID_CONT_SRV from './external/NAUTILIVEBID_CONT_SRV.cds';

service NAUTILIVEBID_CONT_SRVSampleService {
    @readonly
    entity livecontrollerfetchSet as projection on NAUTILIVEBID_CONT_SRV.livecontrollerfetchSet
    {        key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom     }    
;
}