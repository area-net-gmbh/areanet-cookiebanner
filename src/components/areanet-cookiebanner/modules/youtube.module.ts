import { Module } from "./module";

export class YoutubeModule extends Module{
    key: string             = 'yt';
    label: string           = 'Youtube';
    description: string     = 'Um Videos abspielen zu können, nutzen wir Youtube. \
                               Dafür binden wir einen externen Dienst von Google ein, der \
                               Zugriff auf personenbezogene Daten haben und auswerten kann.';
    cookiesOptional         = [];
    cookiesRequired         = [{name: 'yt-disable', lifetime: '1 Jahr', note: 'Deaktivierung Youtube-Videos'}];
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