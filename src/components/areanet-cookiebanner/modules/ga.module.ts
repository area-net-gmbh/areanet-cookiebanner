import { Module } from "./module";

export class GaModule extends Module{
    key: string             = 'ga';
    label: string           = 'Google Analytics';
    description: string     = 'Um unsere Website besser für Sie optimieren zu können, werten wir die Zugriffe und die Nutzung aus.';

    accept(){
        this.cookies.delete('ga-disable-' + this.data);
    }

    decline(){
        this.cookies.set('ga-disable-' + this.data);
        this.cookies.delete('_ga');
        this.cookies.delete('_gat');
        this.cookies.delete('_gid');
        console.log("GA DECLINE");
    }

    isAccept(){
        return !this.cookies.get('ga-disable-' + this.data);
    }

    render(){
        if(!this.isAccept()) return;
        console.log("GA RENDER");
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