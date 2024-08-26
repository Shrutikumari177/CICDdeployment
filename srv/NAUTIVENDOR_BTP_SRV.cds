using NAUTIVENDOR_BTP_SRV from './external/NAUTIVENDOR_BTP_SRV.cds';

service NAUTIVENDOR_BTP_SRVSampleService {
    
    entity xNAUTIxnewvend_btp as projection on NAUTIVENDOR_BTP_SRV.xNAUTIxnewvend_btp
    {        key Addrnumber, key Persnumber, key Consnumber, key Nation, key Lifnr, SmtpAddr, arned, Name1, Name2, Name3, Sort1, Land1, Ort01, Pstlz, Regio, Stras, Erdat, Spras, Telf1, Telf2, Telfx, PartnerName     }    
;
}