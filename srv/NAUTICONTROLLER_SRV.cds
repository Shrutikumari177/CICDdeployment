using NAUTICONTROLLER_SRV from './external/NAUTICONTROLLER_SRV.cds';

service NAUTICONTROLLER_SRVSampleService {
    
    entity BidDataSet as projection on NAUTICONTROLLER_SRV.BidDataSet
    {        key ImChat, Chrnmin, Voyno, Lifnr, Name1, Name2, Eligible, CRank, TRank     }    
;
    
    entity BidsSet as projection on NAUTICONTROLLER_SRV.BidsSet
    {        Biddate, Bidtime, key Chrnmin, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Stat, Zmode     }    
;
}