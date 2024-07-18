using NAUTICONTRACTAWARD_SRV from './external/NAUTICONTRACTAWARD_SRV.cds';

service NAUTICONTRACTAWARD_SRVSampleService {
   
    entity xNAUTIxawardReportFinal as projection on NAUTICONTRACTAWARD_SRV.xNAUTIxawardReportFinal
    {        key Chrnmin, Voyno, Lifnr, Zcode, Biddate, Bidtime, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, Rank, AwrdCreatedBy, AwrdCreatedOn, AwrdCreatedAt     }    
;
}