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
