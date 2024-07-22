using NAUTIBTP_NAUTICAL_TRANSACTIO_SRV from './external/NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.cds';

service NAUTIBTP_NAUTICAL_TRANSACTIO_SRVSampleService {
    
    entity xNAUTIxZSUBMITQUOUTFETCH as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxZSUBMITQUOUTFETCH
    {        key Voyno, key Lifnr, key Chrnmin, Vimono, Vname, Biddate, Bidtime     }    
;
    
    entity xNAUTIxsubmitquafetch as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxsubmitquafetch
    {        key Lifnr, key Chrnmin, PartnerRole, Anred, Name1, Name2, Name3, Sort1, StrSuppl1, StrSuppl2, HouseNum1, Stras, Pstlz, Ort01, Land1, Regio, Spras, Telf1, Telf2, Telfx, SmtpAddr, Erdat, DateTo, Voyno, Chrnmex, Chrcdate, Chrctime, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Chrqdate, zstat, Zaction     }    
;
}