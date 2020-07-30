import { Module } from "./module";

export class FbModule extends Module{
    key: string             = 'fb';
    label: string           = 'Facebook Pixel';
    description: any       = {
      de: 'Um unsere Website besser für Sie optimieren zu können, nutzen wir Facebook Pixel zur Analyse. Dafür binden wir einen externen Dienst von Facebook ein, der Zugriff auf personenbezogene Daten haben und auswerten kann.',
      en: 'To be able to optimize our website better for you, we use Facebook pixels for analysis. For this purpose, we integrate an external Facebook service that can access and evaluate personal data.'
    };
    cookiesOptional         = [
      {name: 'fr', lifetime: {de: '3 Monate', en: '3 Months'}, note: {de: 'Tracking', en: 'Tracking', domain: '.facebook.com'}},
      {name: 'spin', lifetime: {de: '1 Tag', en: '1 Year'}, note: {de: 'Tracking', en: 'Tracking', domain: '.facebook.com'}},
      {name: 'xs', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Tracking', en: 'Tracking', domain: '.facebook.com'}},
      {name: 'c-user', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Tracking', en: 'Tracking'}, domain: '.facebook.com'},
      {name: 'sb', lifetime: {de: '2 Jahre', en: '2 Years'}, note: {de: 'Tracking', en: 'Tracking', domain: '.facebook.com'}},
      {name: 'dpr', lifetime: {de: '1 Monat', en: '1 Month'}, note: {de: 'Tracking', en: 'Tracking', domain: '.facebook.com'}},
      {name: 'datr', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Tracking', en: 'Tracking', domain: '.facebook.com'}},
      {name: '_fbp', lifetime: {de: '3 Monate', en: '3 Months'}, note: {de: 'Tracking', en: 'Tracking'}}
    ];
    cookiesRequired         = [{name: 'fb-disabled', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Deaktivierung Facebook Pixel', en: 'Deactivation of Facebook Pixel'}}];
    privacyUrl              = 'https://www.facebook.com/about/privacy/update';
    vendor                  = 'Facebook Ireland Limited';
    useExternalSource       = true;
    
    accept(){
        this.cookieService.delete('fb-disable');
    }

    decline(){
        this.cookieService.set('fb-disable');

        const url = document.domain.split('.');
        const domain = '.' + url[url.length-2] + '.' + url[url.length-1];

        for(let c of this.cookiesOptional){
          this.cookieService.delete(c.name, c.domain ? c.domain : domain);  
        }
        
    }

    isAccept(){
        return !this.cookieService.get('fb-disable');
    }

    render(){
      if(!this.isAccept()) return;

      (function(f: any, b, e, v, n, t, s) { 
      if (f.fbq) {
        return;
      }
      n = f.fbq = function() { 
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) {
        f._fbq = n;
      }
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e); 
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
    );

    (<any>window).fbq('init', this.data);
    (<any>window).fbq('track', 'PageView');

  }
}