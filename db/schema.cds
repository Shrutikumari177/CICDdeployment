using { managed } from '@sap/cds/common';
namespace nauticalschema;

type Coordinates : array of {
    PathId : Integer;
    Latitude  : Decimal(18, 15);
    Longitude : Decimal(18, 15);
}


entity getRoute {
    seaDistance : Decimal;
    route          : Coordinates;
    code           : Integer;
    message        : String;
}

type BidDetail {
    CodeDesc: String;
    Value: String;
    Cvalue : Integer;
    fScore : Integer;
};

type Vendors {
    vendorId : String;
    vendorName : String(100);
    score : Integer;
    eligible : String;
    Trank : String;
    Crank : String;
    bidDetails: array of BidDetail;
}

entity calculateRankings {
    Voyno: String;
    Chrnmin: String;
    Vendors : array of Vendors;
}

entity ControllerLiveBidDetails : managed {
    key ID : UUID@Core.Computed;
    key createdBy :String;
    key Chrnmin : String;
    voyno : String;
    quotationPrice : String;
}

entity sendEmail{
    message : String;
    receiversEmails : array of emails;
    vendorsName : array of vendorsName;
    routes:array of routes;
    bidStart : Date;
    bidEnd : Date;
    cargoSize : Decimal(10, 3);
    status : Integer;
    bidstartTime :Time;
    bidEndTime:Time;
}

entity voyageStatus: managed{
    key voyageNo : String(20);
    voyStatus : String(30);
}

type emails : String;
type vendorsName : String;
type routes : String;

entity quotations {
    key Lifnr : String(20);
    key Voyno : String(20);
    key Chrnmin :String(20);
    createdBy : String(30);
    @cds.on.insert: $now
    createdAt : Timestamp;
    vendorName :String(100);
    Vimono : String(20);
    Vname :String(20);
    Biddate : Date;
    Bidtime : Time;
    to_quote_item : array of quotationsItems;
};
 
type quotationsItems {
    Zcode  : String(20);
    CodeDesc   : String(20);
    Cunit      : String(20);
    Cvalue     : String(20);
    Value      : String(20);
    Zcom       : String(20);
};

entity VenodrLiveBidDetails : managed {
    key ID : UUID@Core.Computed;
    key Chrnmin : String;
    vendorNo : String;
    voyno : String;
    quotationPrice : String;
    comment : String
}