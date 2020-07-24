import { Module } from "./module";

export class GmapModule extends Module{
    key: string             = 'gmap';
    label: string           = 'Google Maps';
    description: any        = {
        de: 'Wir nutzen Google Maps zur Kartendarstellung. Dafür binden wir einen externen Dienst von Google ein, der Zugriff auf personenbezogene Daten haben und auswerten kann.',
        en: 'We use Google Maps for map display. For this purpose, we integrate an external Google service that can access and evaluate personal data.'
    };
    cookiesOptional         = [];
    cookiesRequired         = [{name: 'gmap-disable', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Deaktivierung Google Maps', en: 'Deactivation of Google Maps'}}];
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