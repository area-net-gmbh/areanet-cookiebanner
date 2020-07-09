import { Module } from "./module";

export class FbModule extends Module{
    key: string             = 'fb';
    label: string           = 'Facebook Pixel';
    description: string     = 'Um unsere Website besser für Sie optimieren zu können, nutzen wir Facebook Pixel zur Analyse.';

    accept(){
        this.cookies.delete('fb-disable');
    }

    decline(){
        this.cookies.set('fb-disable');
    }

    isAccept(){
        return !this.cookies.get('fb-disable');
    }

    render(){
        
    }
}