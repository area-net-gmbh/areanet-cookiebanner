import { CookieService } from "./cookie.service";
import { UuidService } from "./uuid.service";

export class LoggerService{
    private cookieProtectName: string = 'areanet-cookiebanner-protect';    
    private cookieService : CookieService = null;
    private path   = null;
    private uuidService : UuidService = new UuidService();

    constructor(cookieService : CookieService) {
        this.cookieService  = cookieService;
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

    write(cookies : any, isStartup : boolean = false){
        if(navigator.userAgent.indexOf('MSIE')!==-1|| navigator.appVersion.indexOf('Trident/') > -1){
            this.write4IE(cookies, isStartup);
        }else{
            this.writeModern(cookies, isStartup);
        }
    }

    private write4IE(cookies : any, isStartup : boolean = false){
        
        var uid = this.uuidService.generate4IE().toString();
        var randProtectKey = (Math.random() * (999999999999 - 111111111111) + 111111111111).toString();

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

    private async writeModern(cookies : any, isStartup : boolean = false){
        var array = new Uint32Array(5);
        window.crypto.getRandomValues(array);

        var randProtectKey = array.join(''); 
        this.cookieService.set(this.cookieProtectName, randProtectKey, true);

        var uid = await this.uuidService.generate();

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
      
}