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
    key charmin : String;
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

type emails : String;
type vendorsName : String;
type routes : String;
