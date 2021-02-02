import { Module } from "./module";

export class GtmModule extends Module{
    key: string             = 'gtm';
    label: string           = 'Google Tag Manager';
    description: any        = {
        de: 'Um unsere Website besser für Sie optimieren zu können, werten wir die Zugriffe und die Nutzung aus. Dafür binden wir einen externen Dienst von Google ein, der Zugriff auf personenbezogene Daten haben und auswerten kann.',
        en: 'In order to be able to optimize our website better for you, we evaluate the access and use. For this purpose, we integrate an external service from Google, which can access and evaluate personal data.'
    };
    cookiesOptional         = [
        //{name: '_ga', lifetime: {de: '2 Jahre', en: '2 Years'}, note: {de: 'Analyse', en: 'Analytics'}},
        //{name: '_gat', lifetime: {de: '2 Jahre', en: '2 Years'}, note: {de: 'Analyse', en: 'Analytics'}},
        //{name: '_gid', lifetime: {de: '2 Jahre', en: '2 Years'}, note: {de: 'Analyse', en: 'Analytics'}}
    ];
    useExternalSource = true;
    vendor = 'Google';
    privacyUrl = 'https://policies.google.com/privacy?hl=de';

    accept(){
        this.cookieService.delete('gtm-disable-' + this.data);
        
    }

    init(data: any){
        super.init(data);
        this.cookiesRequired = [{name: 'gtm-disable-' + this.data, lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Deaktivierung Google Tag Manager', en: 'Deactivation of Google Tag Manager'}}];
    }

    decline(){
        this.cookieService.set('gtm-disable-' + this.data);

        //const url = document.domain.split('.');
        //const domain = '.' + url[url.length-2] + '.' + url[url.length-1];
      
        //this.cookieService.delete('_ga', domain);
        //this.cookieService.delete('_gat', domain);
        //this.cookieService.delete('_gid', domain);
    }

    isAccept(){
        return !this.cookieService.get('gtm-disable-' + this.data);
    }

    render(){
        if(!this.isAccept()) return;
        let data = this.data;

        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.setAttribute('async', 'true');j.setAttribute('src',
            'https://www.googletagmanager.com/gtm.js?id='+i+dl);f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',data);

        (function(b, n, i){
            var eB = document.getElementsByTagName(b)[0], eN = document.createElement(n), iN = document.createElement(i);
            iN.setAttribute('src', 'https://www.googletagmanager.com/ns.html?id=' + data); 
            iN.setAttribute('height', '0');iN.setAttribute('width', '0'); iN.setAttribute('style', 'display:none;visibility:hidden');
            eN.append(iN);
            eB.prepend(eN);
        })('body', 'noscript', 'iframe');
    
    }
}