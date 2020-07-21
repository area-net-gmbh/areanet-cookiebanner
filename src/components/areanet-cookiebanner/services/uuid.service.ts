export class UuidService{
    private crypto = null;

    constructor() {
        this.crypto  = (<any>window).crypto || (<any>window).msCrypto;
    }

    public generate(){
        var navigator_info = window.navigator;
        var screen_info = window.screen;
        var uid : any = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent;
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';

        return this.sha256(uid);
    }

    private async sha256(str) {
        const buf = await this.crypto.subtle.digest("SHA-256", this.textEncode(str));
        return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    }

    private textEncode(str) {
   
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