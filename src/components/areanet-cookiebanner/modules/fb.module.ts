import { Module } from "./module";

export class FbModule extends Module{
    key: string             = 'fb';
    label: string           = 'Facebook Pixel';
    description: any       = {
      de: 'Um unsere Website besser für Sie optimieren zu können, nutzen wir Facebook Pixel zur Analyse. Dafür binden wir einen externen Dienst von Facebook ein, der Zugriff auf personenbezogene Daten haben und auswerten kann.',
      en: 'To be able to optimize our website better for you, we use Facebook pixels for analysis. For this purpose, we integrate an external Facebook service that can access and evaluate personal data.'
    };
    cookiesRequired         = [{name: 'fb-disabled', lifetime: {de: '1 Jahr', en: '1 Year'}, note: {de: 'Deaktivierung Facebook Pixel', en: 'Deactivation of Facebook Pixel'}}];
    privacyUrl              = 'https://www.facebook.com/about/privacy/update';
    vendor                  = 'Facebook Ireland Limited';
    useExternalSource       = true;
    
    accept(){
        this.cookieService.delete('fb-disable');
    }

    decline(){
        this.cookieService.set('fb-disable');
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