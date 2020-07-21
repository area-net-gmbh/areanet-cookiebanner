import { Module } from "./module";

export class GmapModule extends Module{
    key: string             = 'gmap';
    label: string           = 'Google Maps';
    description: string     = 'Wir nutzen Google Maps zur Kartendarstellung. \
                               Dafür binden wir einen externen Dienst von Google ein, der \
                               Zugriff auf personenbezogene Daten haben und auswerten kann.';
    cookiesOptional         = [];
    cookiesRequired         = [{name: 'gmap-disable', lifetime: '1 Jahr', note: 'Deaktivierung Google Maps'}];
    useExternalSource       = true;
    vendor                  = 'Google';
    privacyUrl              = 'https://policies.google.com/privacy?hl=de';

    accept(){
        this.cookieService.delete('gmap-disable');
    }

    init(data: any){
        super.init(data);
    }

    decline(){
        this.cookieService.set('gmap-disable');
    }

    isAccept(){
        return !this.cookieService.get('gmap-disable');
    }

    render(){
        if(typeof (window as any)[this.data] === 'function'){
            (window as any)[this.data](this.isAccept());
        }
    }
}