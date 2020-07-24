import { CookieService } from "../services/cookie.service";
import { CookieInterface } from "../interfaces/cookie.interface";

export class Module{
    protected cookieService : CookieService = new CookieService();
    protected data: any;

    public doCookieNoteShow: boolean = false;
    public doVendorNoteShow: boolean = false;
    public cookiesRequired : CookieInterface[] = [];
    public cookiesOptional : CookieInterface[] = [];
    public description: any = {};
    public key: string = '';
    public label: string = '';
    public vendor: string = '';
    public privacyUrl: string = '';
    public useExternalSource : boolean = false;

    accept(){

    }

    decline(){

    }

    init(data: any){
        this.data = data;
    }

    isAccept(){
        return false;
    }

    render(){

    }
}