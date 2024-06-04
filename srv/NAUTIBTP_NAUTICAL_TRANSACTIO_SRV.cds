using NAUTIBTP_NAUTICAL_TRANSACTIO_SRV from './external/NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.cds';

service NAUTIBTP_NAUTICAL_TRANSACTIO_SRVSampleService {
    
    entity CharteringSet as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.CharteringSet
    {        Zdelete, Chrcdate, Chrqsdate, Chrqedate, Chrqdate, Chrexcr, Ciqty, key Chrnmin, Chrnmex, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, RefChrnmin, Chrctime, Chrqstime, Chrqetime     }    
;
    
    entity xNAUTIxAPPROVEDCHAT as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxAPPROVEDCHAT
    {        key Creqno, key Chrnmin, key Zlevel, key Uname, key Zdate, key Ztime, Zcomm, Zaction, Zemail     }    
;
    
    entity xNAUTIxBIDHISREPORT as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDHISREPORT
    {        key Voyno, key Chrnmin, key Lifnr, key Zcode, Biddate, Bidtime, Voynm, Vnomtk, Refdoc, Docind, Vessn, Vimo, Chtyp, Chpno, Currkeys, Frtco, Vstat, Voyty, Carty, Curr, Freght, Party, Bidtype, Frcost, Frtu, FrcostAct, FrtuAct, Zdelete, RefVoyno, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, Rank, AwrdCreatedBy, AwrdCreatedOn, AwrdCreatedAt, Award     }    
;
    
    entity xNAUTIxBIDITEM as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDITEM
    {        key Voyno, key Zcode, key Value, key Cvalue, Cunit, CodeDesc, RevBid, Good, Mand, Must, Zmin, Zmax     }    
;
    
    entity xNAUTIxCHARTERING as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTERING
    {        key Chrnmin, Chrnmex, Chrcdate, Chrctime, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Chrqdate, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrexcr, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciqty, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, Zdelete, RefChrnmin     }    
;
    
    entity xNAUTIxCHARTERINGVALUEHELP as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTERINGVALUEHELP
    {        key Chrnmin, Chrnmex, Chrcdate, Chrctime, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Chrqdate, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrexcr, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciqty, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, Zdelete, RefChrnmin     }    
;
    
    entity xNAUTIxCHARTPURCHASEITEM as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTPURCHASEITEM
    {        key Ekorg, Ekotx     }    
;
    
    entity xNAUTIxCHATAPP2 as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHATAPP2
    {        key Creqno, key Chrnmin, key Zlevel, key Uname, key Zdate, key Ztime, Zcomm, Zaction, Zemail     }    
;
    
    entity xNAUTIxCHATAPPRO as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHATAPPRO
    {        key Creqno, key Chrnmin     }    
;
    
    entity xNAUTIxCONTAWARDSTREPORT_ASSOC as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCONTAWARDSTREPORT_ASSOC
    {        key Chrnmin     }    
;
    
    entity xNAUTIxCONTAWARDSTATUSREPORT_M as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCONTAWARDSTATUSREPORT_M
    {        key Chrnmin     }    
;
    
    entity xNAUTIxCOSTCHARGES as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCOSTCHARGES
    {        key Voyno, key Vlegn, key Costcode, Costu, Prcunit, Procost, Costcurr, Cstcodes, CostCheck     }    
;
    
    entity xNAUTIxCharteringHeaderItem as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCharteringHeaderItem
    {        key Chrnmin, Chrnmex, Chrcdate, Chrctime, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Chrqdate, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrexcr, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciqty, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, Zdelete, RefChrnmin     }    
;
    
    entity xNAUTIxMAXZLEVEL as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxMAXZLEVEL
    {        key creqno, max_zlevel     }    
;
    
    entity xNAUTIxNAVOYG as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYG
    {        key Voyno, Voynm, Vnomtk, Refdoc, Docind, Vessn, Vimo, Chtyp, Chpno, Currkeys, Frtco, Vstat, Voyty, Carty, Curr, Freght, Party, Bidtype, Frcost, Frtu, FrcostAct, FrtuAct, Zdelete, RefVoyno     }    
;
    
    entity xNAUTIxNAVOYGCT as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYGCT
    {        key Voyno, Vlegn, Costcode, Costu, Prcunit, Procost, Costcurr, Cstcodes, CostCheck     }    
;
    
    entity xNAUTIxNAVYGIP as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVYGIP
    {        key Voyno, key Vlegn, Portc, Portn, Pdist, Medst, Vspeed, Ppdays, Vsdays, Vetad, Vetat, Vetdd, Vetdt, Vwead, Pstat, Matnr, Maktx, Cargs, Cargu, Othco, Frcost, Totco     }    
;
    
    entity xNAUTIxRFQCHARTERING as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxRFQCHARTERING
    {        key Voyno, Lifnr, Zcode, Biddate, Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, currentdate, currenttime     }    
;
    
    entity xNAUTIxRFQPORTAL as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxRFQPORTAL
    {        key Lifnr, PartnerRole, Anred, Name1, Name2, Name3, Sort1, StrSuppl1, StrSuppl2, HouseNum1, Stras, Pstlz, Ort01, Land1, Regio, Spras, Telf1, Telf2, Telfx, SmtpAddr, Erdat, DateTo     }    
;
    
    entity xNAUTIxSUBMITQUATATIONFETCH as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxSUBMITQUATATIONFETCH
    {        key Voyno, Lifnr, Chrnmin, Vimono, Vname, Biddate, Bidtime     }    
;
    
    entity xNAUTIxSUBMITQUATATIONPOST as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxSUBMITQUATATIONPOST
    {        key Voyno, Lifnr, Chrnmin, Vimono, Vname, Biddate, Bidtime     }    
;
    
    entity xNAUTIxVEND as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVEND
    {        key Chrnmin, key Lifnr, Voyno     }    
;
    
    entity xNAUTIxVENDBID as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBID
    {        key Voyno, Lifnr, Zcode, Value, Cvalue, Cunit, Chrnmin, CodeDesc, Biddate, Bidtime, Zcom     }    
;
    
    entity xNAUTIxVENDBIDH as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBIDH
    {        key Voyno, key Lifnr, Chrnmin, Vimono, Vname, Biddate, Bidtime     }    
;
    
    entity xNAUTIxVENFBID as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBID
    {        key Voyno, key Lifnr, key Zcode, key Biddate, key Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, currentdate, currenttime     }    
;
    
    entity xNAUTIxVENFBIDPOST as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBIDPOST
    {        key Chrnmin, Voyno, Lifnr, Zcode, Biddate, Bidtime, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, Rank, AwrdCreatedBy, AwrdCreatedOn, AwrdCreatedAt     }    
;
    
    entity xNAUTIxVOYAGEHEADERTOITEM as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVOYAGEHEADERTOITEM
    {        key Voyno, Voynm, Vnomtk, Refdoc, Docind, Vessn, Vimo, Chtyp, Chpno, Currkeys, Frtco, Vstat, Voyty, Carty, Curr, Freght, Party, Bidtype, Frcost, Frtu, Frcost_Act, Frtu_Act, Ref_Voyno, GV_CSTATUS     }    
;
    
    entity xNAUTIxVoygItem as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVoygItem
    {        key Voyno, key Vlegn, Portc, Portn, Pdist, Medst, Vspeed, Ppdays, Vsdays, Vetad, Vetat, Vetdd, Vetdt, Vwead, Pstat, Matnr, Maktx, Cargs, Cargu, Othco, Frcost, Totco     }    
;
    
    entity xNAUTIxZCHATVEN as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxZCHATVEN
    {        key Chrnmin, key Lifnr, Voyno     }    
;
    
    entity xNAUTIxpurchGroup as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpurchGroup
    {        key Ekgrp, Eknam     }    
;
    
    entity xNAUTIxpaymTerm as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpaymTerm
    {        key Paytrm, Paytrmtxt     }    
;
}