import { Module } from "./module";

export class VimeoModule extends Module{
    key: string             = 'vi';
    label: string           = 'Vimeo';
    description: any       = {
        de: 'Um Videos abspielen zu können, nutzen wir Vimeo. Dafür binden wir einen externen Dienst von Vimeo ein, der Zugriff auf personenbezogene Daten haben und auswerten kann.',
        en: 'In order to play videos, we use Vimeo. For this purpose, we integrate an external service from Vimeo, which can access and evaluate personal data.'
    };
    cookiesOptional         = [];
    cookiesRequired         = [{name: 'vi-disable', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Deaktivierung Vimeo Videos', en: 'Deactivation of Vimeo Videos'}}];
    useExternalSource       = true;
    vendor                  = 'Vimeo';
    privacyUrl              = 'https://vimeo.com/privacy';

    accept(){
        this.cookieService.delete('vi-disable');
    }

    init(data: any){
        super.init(data);
    }

    decline(){
        this.cookieService.set('vi-disable');
    }

    isAccept(){
        return !this.cookieService.get('vi-disable');
    }

    render(){
        if(typeof (window as any)[this.data] === 'function'){
            (window as any)[this.data](this.isAccept());
        }
    }
}