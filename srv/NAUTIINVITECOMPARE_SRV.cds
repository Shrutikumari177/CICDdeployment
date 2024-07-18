using NAUTIINVITECOMPARE_SRV from './external/NAUTIINVITECOMPARE_SRV.cds';

service NAUTIINVITECOMPARE_SRVSampleService {
    
    entity xNAUTIxvendbid_val as projection on NAUTIINVITECOMPARE_SRV.xNAUTIxvendbid_val
    {        key Voyno, Chrnmin     }    
;
}