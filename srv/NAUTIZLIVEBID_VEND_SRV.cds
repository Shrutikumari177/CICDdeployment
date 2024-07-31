using NAUTIZLIVEBID_VEND_SRV from './external/NAUTIZLIVEBID_VEND_SRV.cds';

service NAUTIZLIVEBID_VEND_SRVSampleService {
    @readonly
    entity getfinalbidSet as projection on NAUTIZLIVEBID_VEND_SRV.getfinalbidSet
    {        key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom     }    
;
    @readonly
    entity venItemSet as projection on NAUTIZLIVEBID_VEND_SRV.venItemSet
    {        Voyno, Lifnr, Zcode, Biddate, Bidtime, key Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom     }    
;
    @readonly
    entity vendorFinSet as projection on NAUTIZLIVEBID_VEND_SRV.vendorFinSet
    {        key Chrnmin     }    
;
    @readonly
    entity xNAUTIxnewvendfbid as projection on NAUTIZLIVEBID_VEND_SRV.xNAUTIxnewvendfbid
    {        key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom     }    
;
}