using NAUTICOMP_QUOT_SRV from './external/NAUTICOMP_QUOT_SRV.cds';

service NAUTICOMP_QUOT_SRVSampleService {
    
    entity xNAUTIxcomp_quot as projection on NAUTICOMP_QUOT_SRV.xNAUTIxcomp_quot
    {        key Chrnmin, Voyno, Chrven, Chrvenn, CodeDesc, Wtage, Score, Value     }    
;
    
    entity xNAUTIxfinalbid as projection on NAUTICOMP_QUOT_SRV.xNAUTIxfinalbid
    {        key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom     }    
;
    
    entity xNAUTIxitemBid as projection on NAUTICOMP_QUOT_SRV.xNAUTIxitemBid
    {        key Voyno, key Zcode, key Value, key Cvalue, Cunit, CodeDesc, RevBid, Good, Mand, Must, Zmin, Zmax     }    
;
    
    entity xNAUTIxvenBid as projection on NAUTICOMP_QUOT_SRV.xNAUTIxvenBid
    {        key Voyno, key Lifnr, key Zcode, Value, Cvalue, Cunit, Chrnmin, CodeDesc, Biddate, Bidtime, Zcom     }    
;
}