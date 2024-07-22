using NAUTIZNAUTIFILEUPL_VOY_SRV from './external/NAUTIZNAUTIFILEUPL_VOY_SRV.cds';

service NAUTIZNAUTIFILEUPL_VOY_SRVSampleService {
    entity FileuploadSet as projection on NAUTIZNAUTIFILEUPL_VOY_SRV.FileuploadSet
    {        Fileid, key Voyageno, Creaby, Creadate, Creatime, key Filename, Filetype, Filecont, Del     }    
;
    
    entity downloadSet as projection on NAUTIZNAUTIFILEUPL_VOY_SRV.downloadSet
    {        Fileid, key Voyageno, Creaby, Creadate, Creatime, key Filename, Filetype, Filecont, Del     }    
;
}