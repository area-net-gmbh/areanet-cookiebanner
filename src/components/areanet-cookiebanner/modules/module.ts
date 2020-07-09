import { Cookies } from "../cookies";

export class Module{
    protected cookies : Cookies = new Cookies();
    protected data: any;

    public description: string = '';
    public key: string = '';
    public label: string = '';

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