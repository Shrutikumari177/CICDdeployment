using NAUTIBTP_NAUTICAL_TRANSACTIO_SRV from './external/NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.cds';

service NAUTIBTP_NAUTICAL_TRANSACTIO_SRVSampleService {
    
    entity xNAUTIxBIDHISREPORT as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDHISREPORT
    {        key Chrnmin, key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Voynm, Currkeys, Voyty, Carty, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, Rank, createdBy, Award     }    
;
    
    entity xNAUTIxbidhist_valuehelp as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxbidhist_valuehelp
    {        key voyno, Chrnmin     }    
;
}