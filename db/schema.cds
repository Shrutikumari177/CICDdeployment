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
    eligible : Boolean;
    Trank : String;
    Crank : String;
    bidDetails: array of BidDetail;
}

entity calculateRankings {
    Voyno: String;
    Chrnmin: String;
    Vendors : array of Vendors;
}

