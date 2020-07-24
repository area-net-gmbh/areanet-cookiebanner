import { Module } from "./module";

export class YoutubeModule extends Module{
    key: string             = 'yt';
    label: string           = 'Youtube';
    description: any       = {
        de: 'Um Videos abspielen zu können, nutzen wir Youtube. Dafür binden wir einen externen Dienst von Google ein, der Zugriff auf personenbezogene Daten haben und auswerten kann.',
        en: 'In order to play videos, we use Youtube. For this purpose, we integrate an external service from Google, which can access and evaluate personal data.'
    };
    cookiesOptional         = [];
    cookiesRequired         = [{name: 'yt-disable', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Deaktivierung Youtube Videos', en: 'Deactivation of Youtube Videos'}}];
    useExternalSource       = true;
    vendor                  = 'Google';
    privacyUrl              = 'https://policies.google.com/privacy?hl=de';

    accept(){
        this.cookieService.delete('yt-disable');
    }

    init(data: any){
        super.init(data);
    }

    decline(){
        this.cookieService.set('yt-disable');
    }

    isAccept(){
        return !this.cookieService.get('yt-disable');
    }

    render(){
        if(typeof (window as any)[this.data] === 'function'){
            (window as any)[this.data](this.isAccept());
        }
    }
}