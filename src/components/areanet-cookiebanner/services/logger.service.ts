import { CookieService } from "./cookie.service";

export class LoggerService{
    private cookieProtectName: string = 'areanet-cookiebanner-protect';    
    private cookieService : CookieService = null;
    private crypto = null;
    private path   = null;

    constructor(cookieService : CookieService) {
        this.cookieService  = cookieService;
        this.crypto         = (<any>window).crypto || (<any>window).msCrypto;
        this.path           = this.getPath();
    }

    private getPath() {
        var scripts = document.getElementsByTagName('SCRIPT');
        var path = '';
        if(scripts && scripts.length>0) {
            for(var i in scripts) {
                const script : any = scripts[i];
                if(script.src && script.src.match(/\/areanet-cookiebanner\.js$/)) {
                    path = script.src.replace(/(.*)\/areanet-cookiebanner\.js$/, '$1');
                    break;
                }
            }
        }
  
        return path + '/';
    };

    private uid(){
        var navigator_info = window.navigator;
        var screen_info = window.screen;
        var uid : any = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent;
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';
        
        return uid;
    }

    async write(cookies : any, isStartup : boolean = false){
        var array = new Uint32Array(5);
        window.crypto.getRandomValues(array);

        var randProtectKey = array.join(''); 
        this.cookieService.set(this.cookieProtectName, randProtectKey, true);

        var uid = await this.sha256(this.uid());

        var date = new Date();
        var data = new FormData();
        data.append(this.cookieProtectName, randProtectKey);
        data.append('uid', uid);
        data.append('userAgent', navigator.userAgent);
        data.append('timestamp', date.toISOString());
        data.append('cookies', JSON.stringify(cookies));
        data.append('startup', isStartup ? 'true' : 'false');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.path + 'api/index.php', true);
        xhr.send(data);
    }

    async sha256(str) {
        const buf = await this.crypto.subtle.digest("SHA-256", this.textEncode(str));
        return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    }

    textEncode(str) {
   
        if (window.TextEncoder) {
            return new TextEncoder().encode(str);
        }

        var utf8 = unescape(encodeURIComponent(str));
        var result = new Uint8Array(utf8.length);
        for (var i = 0; i < utf8.length; i++) {
            result[i] = utf8.charCodeAt(i);
        }
        return result;

    }
      
}