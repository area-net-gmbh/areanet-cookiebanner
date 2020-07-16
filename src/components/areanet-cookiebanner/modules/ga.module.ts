import { Module } from "./module";

export class GaModule extends Module{
    key: string             = 'ga';
    label: string           = 'Google Analytics';
    description: string     = 'Um unsere Website besser für Sie optimieren zu können, werten wir die Zugriffe \
                               und die Nutzung aus. Dafür binden wir einen externen Dienst von Google ein, der \
                               Zugriff auf personenbezogene Daten haben und auswerten kann.';
    cookiesOptional         = [
        {name: '_ga', lifetime: '2 Jahre', note: 'Analyse'},
        {name: '_gat', lifetime: '2 Jahre', note: 'Analyse'},
        {name: '_gid', lifetime: '2 Jahre', note: 'Analyse'}
    ];
    useExternalSource = true;
    vendor = 'Google';
    privacyUrl = 'https://policies.google.com/privacy?hl=de';

    accept(){
        this.cookieService.delete('ga-disable-' + this.data);
        
    }

    init(data: any){
        super.init(data);

        this.cookiesRequired = [{name: 'ga-disable-' + this.data, lifetime: '1 Jahr', note: 'Deaktivierung Google Analytics'}];
    }

    decline(){
        this.cookieService.set('ga-disable-' + this.data);

        const url = document.domain.split('.');
        const domain = '.' + url[url.length-2] + '.' + url[url.length-1];
      
        this.cookieService.delete('_ga', domain);
        this.cookieService.delete('_gat', domain);
        this.cookieService.delete('_gid', domain);
    }

    isAccept(){
        return !this.cookieService.get('ga-disable-' + this.data);
    }

    render(){
        if(!this.isAccept()) return;
        var currdate : any = new Date();

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*currdate;a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            
        (<any>window).ga('create', this.data, 'auto');
        (<any>window).ga('set', 'anonymizeIp', true);
        (<any>window).ga('send', 'pageview');
            
    
    }
}