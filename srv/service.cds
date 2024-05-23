using NAUTIMASTER_BTP_SRV from './external/NAUTIMASTER_BTP_SRV.cds';
using NAUTINAUTICALCV_SRV from './external/NAUTINAUTICALCV_SRV.cds';
using NAUTIMARINE_TRAFFIC_API_SRV from './external/NAUTIMARINE_TRAFFIC_API_SRV.cds';
using NAUTIBTP_NAUTICAL_TRANSACTIO_SRV from './external/NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.cds';
using {nauticalschema} from '../db/schema';
using NAUTIZVOYAPPROVAL_SRV from './external/NAUTIZVOYAPPROVAL_SRV.cds';
using NAUTIVENDOR_SRV from './external/NAUTIVENDOR_SRV.cds';
using NAUTIZCHATAPPROVAL_SRV from './external/NAUTIZCHATAPPROVAL_SRV.cds';
using NAUTIZVOY_VALUEHELP_CDS from './external/NAUTIZVOY_VALUEHELP_CDS.cds';
using NAUTIVENDOR_BTP_SRV from './external/NAUTIVENDOR_BTP_SRV.cds';


service nauticalservice {

    entity getRoute                  as projection on nauticalschema.getRoute
        actions {
            action getDistanceBetweenPort();
        };

    entity PortmasterUpdateSet       as
        projection on NAUTIMASTER_BTP_SRV.PortmasterUpdateSet {
            key Country,
            key Portc,
                Portn,
                Reancho,
                Latitude,
                Longitude,
                Countryn,
                Locid,
                Ind
        };

    entity EsPathCollection          as
        projection on NAUTIMARINE_TRAFFIC_API_SRV.EsPathCollection {
                PathId,
            key Latitude,
                Longitude
        };

    entity PortMasterSet             as
        projection on NAUTIMARINE_TRAFFIC_API_SRV.PortMasterSet {
                Country,
                Portc,
            key Portn,
                Reancho,
                Latitude,
                Longitude,
                Countryn,
            key Locid
        };

    entity es_port_master            as
        projection on NAUTIMARINE_TRAFFIC_API_SRV.es_port_master {
                Country,
            key Portc,
                Portn,
                Reancho,
                Latitude,
                Longitude,
                Countryn,
                Locid,
                Ind
        };

    entity es_route_map              as
        projection on NAUTIMARINE_TRAFFIC_API_SRV.es_route_map {
                marineApiRoute,
            key IvFromPort,
                IvOptimized,
            key IvToPort,
                route
        };

    entity BidMasterSet              as
        projection on NAUTIMASTER_BTP_SRV.BidMasterSet {
            key Bname,
            key Code,
                Value,
                Cvalue,
                Cunit,
                Datatype,
                Tablename,
                MultiChoice
        };

    entity ClassMasterSet            as
        projection on NAUTIMASTER_BTP_SRV.ClassMasterSet {
            key ZfValue,
                ZfDesc
        };

    entity CostMasterSet             as
        projection on NAUTIMASTER_BTP_SRV.CostMasterSet {
            key Costcode,
                Cstcodes
        };

    entity CountryMasterSet          as
        projection on NAUTIMASTER_BTP_SRV.CountryMasterSet {
            key ZfValue,
                ZfDesc
        };

    entity EventMasterSet            as
        projection on NAUTIMASTER_BTP_SRV.EventMasterSet {
            key Evtty,
                Text
        };

    entity MaintainGroupSet          as
        projection on NAUTIMASTER_BTP_SRV.MaintainGroupSet {
            key Zuser,
                Zgroup
        };

    entity UOMSet                    as
        projection on NAUTIMASTER_BTP_SRV.UOMSet {
            key Uom,
                Uomdes
        };

    entity StandardCurrencySet       as
        projection on NAUTIMASTER_BTP_SRV.StandardCurrencySet {
                Spras,
            key Waers,
                Ltext
        };

    

    entity VoyageRealeaseSet         as
        projection on NAUTIMASTER_BTP_SRV.VoyageRealeaseSet {
            key Rels,
            key Voyty,
            key Vesty,
            key Zgroup,
                App1,
                App2,
                App3
        };

    entity RefrenceDocumentSet       as
        projection on NAUTIMASTER_BTP_SRV.RefrenceDocumentSet {
            key Docind,
                Docdesc
        };

    entity PortmasterSet             as
        projection on NAUTIMASTER_BTP_SRV.PortmasterSet {
            key Country,
            key Portc,
                Portn,
                Reancho,
                Latitude,
                Longitude,
                Countryn,
                Locid,
                Ind
        };

    entity xNAUTIxMASBID             as
        projection on NAUTIMASTER_BTP_SRV.xNAUTIxMASBID {
            key Bname,
            key Code,
                Value,
                Cvalue,
                Cunit,
                Datatype,
                Tablename,
                Multi_Choice
        };

    entity xNAUTIxBusinessPartner1   as
        projection on NAUTIMASTER_BTP_SRV.xNAUTIxBusinessPartner1 {
            key Lifnr,
                PartnerRole,
                Anred,
                Name1,
                Name2,
                Name3,
                Sort1,
                StrSuppl1,
                StrSuppl2,
                HouseNum1,
                Stras,
                Pstlz,
                Ort01,
                Land1,
                Regio,
                Spras,
                Telf1,
                Telf2,
                Telfx,
                SmtpAddr,
                Erdat,
                DateTo
        };

    entity BidTypeSet                as
        projection on NAUTINAUTICALCV_SRV.BidTypeSet {
                Ddtext,
            key DomvalueL
        };

    entity CarTypeSet                as
        projection on NAUTINAUTICALCV_SRV.CarTypeSet {
            key Carcd,
                Cardes
        };

    entity CargoUnitSet              as
        projection on NAUTINAUTICALCV_SRV.CargoUnitSet {
            key Uom,
                Uomdes
        };

    entity CurTypeSet                as
        projection on NAUTINAUTICALCV_SRV.CurTypeSet {
            key Navoycur,
                Navoygcurdes
        };

    entity GtTabSet                  as
        projection on NAUTINAUTICALCV_SRV.GtTabSet

        ;

    entity GtPlanSet                 as
        projection on NAUTINAUTICALCV_SRV.GtPlanSet

        ;

    entity VoyTypeSet                as
        projection on NAUTINAUTICALCV_SRV.VoyTypeSet {
            key Voycd,
                Voydes
        };

    entity ZCalculateSet             as projection on NAUTINAUTICALCV_SRV.ZCalculateSet
    entity ZCreatePlanSet            as projection on NAUTINAUTICALCV_SRV.ZCreatePlanSet;


    entity xNAUTIxVOYAGEHEADERTOITEM as
        projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVOYAGEHEADERTOITEM {
            key Voyno,
                Voynm,
                Vnomtk,
                Refdoc,
                Docind,
                Vessn,
                Vimo,
                Chtyp,
                Chpno,
                Currkeys,
                Frtco,
                Vstat,
                Voyty,
                Carty,
                Curr,
                Freght,
                Party,
                Bidtype,
                Frcost,
                Frtu,
                Frcost_Act,
                Frtu_Act,
                Ref_Voyno,
                GV_CSTATUS,
                toitem,
                tocostcharge,
                tobiditem
        };

    entity xNAUTIxCOSTCHARGES        as
        projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCOSTCHARGES {
            key Voyno,
            key Vlegn,
            key Costcode,
                Costu,
                Prcunit,
                Procost,
                Costcurr,
                Cstcodes,
                CostCheck
        };

    entity xNAUTIxVoygItem           as
        projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVoygItem {
            key Voyno,
            key Vlegn,
                Portc,
                Portn,
                Pdist,
                Medst,
                Vspeed,
                Ppdays,
                Vsdays,
                Vetad,
                Vetat,
                Vetdd,
                Vetdt,
                Vwead,
                Pstat,
                Matnr,
                Maktx,
                Cargs,
                Cargu,
                Othco,
                Frcost,
                Totco
        };

    entity xNAUTIxBIDITEM            as
        projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxBIDITEM {
            key Voyno,
            key Zcode,
            key Value,
            key Cvalue,
                Cunit,
                CodeDesc,
                RevBid,
                Good,
                Mand,
                Must,
                Zmin,
                Zmax
        };

     entity CharteringSet as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.CharteringSet
    {        Zdelete, Chrcdate, Chrqsdate, Chrqedate, Chrqdate, Chrexcr, Ciqty, key Chrnmin, Chrnmex, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, RefChrnmin, Chrctime, Chrqstime, Chrqetime     }    
;
    
 
    
    entity xNAUTIxCHARTERING as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTERING
    {        key Chrnmin, Chrnmex, Chrcdate, Chrctime, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Chrqdate, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrexcr, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciqty, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, Zdelete, RefChrnmin     }    
;
    
    entity xNAUTIxCHARTPURCHASEITEM as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCHARTPURCHASEITEM
    {        key Ekorg, Ekotx     }    
;
     
    entity xNAUTIxNAVOYGCT as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVOYGCT
    {        key Voyno, key Vlegn, key Costcode, Costu, Prcunit, Procost, Costcurr, Cstcodes, CostCheck     }    
;
    
    entity xNAUTIxNAVYGIP as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxNAVYGIP
    {        key Voyno, key Vlegn, Portc, Portn, Pdist, Medst, Vspeed, Ppdays, Vsdays, Vetad, Vetat, Vetdd, Vetdt, Vwead, Pstat, Matnr, Maktx, Cargs, Cargu, Othco, Frcost, Totco     }    
;
    
 
    
    entity xNAUTIxRFQCHARTERING as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxRFQCHARTERING
    {        key Voyno, Voynm, Vnomtk, Refdoc, Docind, Vessn, Vimo, Chtyp, Chpno, Currkeys, Frtco, Vstat, Voyty, Carty, Curr, Freght, Party, Bidtype, Frcost, Frtu, FrcostAct, FrtuAct, Zdelete, RefVoyno     }    
;
    
    entity xNAUTIxRFQPORTAL as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxRFQPORTAL
    {        key Lifnr, PartnerRole, Anred, Name1, Name2, Name3, Sort1, StrSuppl1, StrSuppl2, HouseNum1, Stras, Pstlz, Ort01, Land1, Regio, Spras, Telf1, Telf2, Telfx, SmtpAddr, Erdat, DateTo     }    
;
    
    entity xNAUTIxSUBMITQUATATIONHEADITEM as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxSUBMITQUATATIONHEADITEM
    {        key Voyno, Lifnr, Chrnmin, Vimono, Vname, Biddate, Bidtime     }    
;
    
  
    
    entity xNAUTIxVENDBID as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBID
    {        key Voyno, Lifnr, Zcode, Value, Cvalue, Cunit, Chrnmin, CodeDesc, Biddate, Bidtime, Zcom     }    
;
    
    entity xNAUTIxVENDBIDH as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENDBIDH
    {        key Voyno, key Lifnr, Chrnmin, Vimono, Vname, Biddate, Bidtime     }    
;
    
    entity xNAUTIxVENFBID as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVENFBID
    {        key Voyno, Lifnr, Zcode, Biddate, Bidtime, Chrnmin, CodeDesc, Value, Cvalue, Cunit, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, DoneBy, Uname, Stat, Zmode, Zcom, currentdate, currenttime     }    
;
    
    
    
    entity xNAUTIxZCHATVEN as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxZCHATVEN
    {        key Chrnmin, key Lifnr, Voyno     }    
;
    
    entity xNAUTIxpaymTerm as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpaymTerm
    {        key Paytrm, Paytrmtxt     }    
        

    entity voyapprovalSet            as projection on NAUTIZVOYAPPROVAL_SRV.voyapprovalSet
         {        key Vreqno, key Voyno, Zlevel, Uname, Zdate, Ztime, Zcomm, Zaction     }  

      entity MasBidTemplateSet as projection on NAUTIVENDOR_SRV.MasBidTemplateSet
    {        key Code, Value, Cvalue, Cunit, Datatype, Tablename, MultiChoice     }    
;
    
    entity DynamicTableSet as projection on NAUTIVENDOR_SRV.DynamicTableSet
     
;
    
    entity ITEM_BIDSet as projection on NAUTIVENDOR_SRV.ITEM_BIDSet
    {        key Voyno, Zcode, Value, CodeDesc, RevBid, Good, Mand, Must, Zmin, Zmax     }    
;
    
    entity PortsSet as projection on NAUTIVENDOR_SRV.PortsSet
    {        key ZfValue, ZfDesc, Country, Countryn     }    
;   

// for chArtering

entity xNAUTIxCharteringHeaderItem as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxCharteringHeaderItem

    {        key Chrnmin, Chrnmex, Chrcdate, Chrctime, Chrqsdate, Chrqstime, Chrqedate, Chrqetime, Chrqdate, Chrporg, Chrporgn, Chrpgrp, Chrpgrpn, Chrexcr, Chrpayt, Chrpaytxt, Chrinco, Chrincodis, Chrincol, Cimater, Cimatdes, Ciqty, Ciuom, Voyno, Voynm, Chrven, Chrvenn, Ciprec, Zdelete, RefChrnmin ,tovendor,tocharteringasso     }    

;

    entity xNAUTIxVEND as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxVEND

    {        key Chrnmin, key Lifnr, Voyno     }    

;

    entity xNAUTIxpurchGroup as projection on NAUTIBTP_NAUTICAL_TRANSACTIO_SRV.xNAUTIxpurchGroup

    {        key Ekgrp, Eknam     }    

;


entity chartapprSet as projection on NAUTIZCHATAPPROVAL_SRV.chartapprSet

    {        key Creqno, key Chrnmin, Zlevel, Uname, Zdate, Ztime, Zcomm, Zaction     }    

;
   entity xNAUTIxchaApp1 as projection on NAUTIZCHATAPPROVAL_SRV.xNAUTIxchaApp1
    {        key Creqno, key Chrnmin, key Zlevel, key Uname, key Zdate, key Ztime, Zcomm, Zaction     }    
;

entity xNAUTIxvoy_valuehelp as projection on NAUTIZVOY_VALUEHELP_CDS.xNAUTIxvoy_valuehelp

    {        key Voyno, Voynm, Zaction     }    

;

   


}
