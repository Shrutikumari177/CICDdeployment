using NAUTICONTRACTAWARD_SRV from './external/NAUTICONTRACTAWARD_SRV.cds';

service NAUTICONTRACTAWARD_SRVSampleService {
    @readonly
    entity xNAUTIxclosaward_table as projection on NAUTICONTRACTAWARD_SRV.xNAUTIxclosaward_table
    {        key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Rank, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom     }    
;
}