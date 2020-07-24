import { Component, h, Prop, Element, State, Host, Method} from '@stencil/core';
import { Modules } from "./modules/modules";
import { Module } from './modules/module';
import { CookieService } from './services/cookie.service';
import { CookieInterface } from './interfaces/cookie.interface';
import { LoggerService } from './services/logger.service';
import { UuidService } from './services/uuid.service';
import {LANG} from './lang';

@Component({
  tag: 'areanet-cookiebanner',
  styleUrl: 'areanet-cookiebanner.css',
  shadow: true,
})
export class AreanetCookiebanner {
  cookieService : CookieService = new CookieService();
  cookieConsentName: string = 'areanet-cookiebanner-consent';
  cookiesRequired : CookieInterface[] = [];
  loggerService : LoggerService = new LoggerService(this.cookieService);
  modules : Module[] = [];
  
  doShowBannerStore: number = 0;
  uuidService : UuidService = new UuidService();

  version : string = '1.4.0';

  @Element() el: HTMLElement;
  @Prop() thirdparty: string;
  @Prop() lang: string;
  @Prop() gaeProperty: number;
  @Prop() privacyUrl: string;
  @Prop() imprintUrl: string;
  @Prop() cookies: string;
  @Prop() color: string;

  @State() isMinimal: boolean = true;
  @State() description: any = {
    'de': 'Für die optimale Anzeige und Funktionsweise unserer Website setzen wir technisch notwendige Cookies und Technologien ein.',
    'en':'For the optimal display and functionality of our website we use technically necessary cookies and technologies.'};
  @State() descriptionExtended: any = {
    'de': 'Darüberhinaus nutzen wir Analyse-, Tracking und/oder Werbetools, um unsere Dienstleistungen entsprechend optimieren und präsentieren können.',
    'en': 'Furthermore, we use analysis, tracking and/or advertising tools to optimize and present our services accordingly.'};
  @State() doShowBanner: number = 0;
  @State() doShowSettings: boolean = false;
  @State() showCookieNotes: number[] = [];
  @State() showVendorNotes: number[] = [];
  @State() show : boolean = false;
  
  translations : any = {};

  title: any = {
    'de': 'Cookie- und Tracking-Einstellungen',
    'en': 'Cookie and tracking settings'
  };

  componentWillLoad(){

    this.lang         = this.lang == 'en' ? 'en' : 'de';
    this.translations = LANG[this.lang];

    this.color        = this.color == 'light' ? 'light' : 'dark';

    for(const moduleName in Modules){
      const module : Module = new Modules[moduleName]();
      const propertyName    = 'module-' + module.key;

      if(this.el.attributes[propertyName]){
        const module = new Modules[moduleName]();
        module.init(this.el.attributes[propertyName].value);
        this.cookiesRequired = this.cookiesRequired.concat(module.cookiesRequired);
        this.isMinimal = false;
        this.modules.push(module);
      }   
    }

    if(this.cookies){
      const cookiesArray = this.cookies.split(';');
      for(let c of cookiesArray){
     
        let cDetails = c.split(',');
        if(cDetails.length != 3) continue;

        this.cookiesRequired.push({
          name: cDetails[0],
          note: cDetails[1], 
          lifetime: cDetails[2]
        });
      };
    }

    if(!this.cookieService.get(this.cookieConsentName)){
      this.doShowBanner = this.isMinimal ? 1 : 2;
      var logData = {'tech': true};
      for(const m of this.modules){
        m.decline();
        m.render();
        logData[m.key] = false;
      }
      this.loggerService.write(logData, true);
    }else{
      for(const m of this.modules){
        m.render();
      }  
    }

    this.doShowBannerStore = this.doShowBanner;

  }

  acceptAll(){
    var logData = {'tech': true};
    console.log("acceptAll");

    if(navigator.userAgent.indexOf('MSIE')!==-1|| navigator.appVersion.indexOf('Trident/') > -1){
      const uuid = this.uuidService.generate4IE().toString();
      this.cookieService.set(this.cookieConsentName, uuid);
      for(const m of this.modules){
        m.accept();
        logData[m.key] = true;
      }

      this.loggerService.write(logData, false);
      this.doShowBanner = 0;
      this.doShowSettings = false;
      window.location.reload();
    }else{
      this.uuidService.generate().then((uuid) => {
        this.cookieService.set(this.cookieConsentName, uuid);
        for(const m of this.modules){
          m.accept();
          logData[m.key] = true;
        }
  
        this.loggerService.write(logData, false);
        this.doShowBanner = 0;
        this.doShowSettings = false;
        window.location.reload();
      })
  }
    }

    

  acceptRequired(){
    var logData = {'tech': true};
    for(const m of this.modules){
      m.decline();
      logData[m.key] = false;
    }
    this.loggerService.write(logData, false);

    if(navigator.userAgent.indexOf('MSIE')!==-1|| navigator.appVersion.indexOf('Trident/') > -1){
      const uuid = this.uuidService.generate4IE().toString();
      this.cookieService.set(this.cookieConsentName, uuid);
      this.doShowBanner = 0;
      window.location.reload();
    }else{
      this.uuidService.generate().then((uuid) => {
        this.cookieService.set(this.cookieConsentName, uuid);
        this.doShowBanner = 0;
        window.location.reload();
      });
    }
   
  }

  acceptChoosen(){
    var logData = {'tech': true};
    const checkboxes = this.el.shadowRoot.querySelectorAll('.an-checkbox-module');
    [].forEach.call(checkboxes, (c) => {
      for(const m of this.modules){
        
        if(m.key == c.id){
          if(c.checked){
            m.accept();
            logData[m.key] = true;
          }else{
            m.decline();
            logData[m.key] = false;
          }
        }
      };
    });
    this.loggerService.write(logData, false);

    if(navigator.userAgent.indexOf('MSIE')!==-1|| navigator.appVersion.indexOf('Trident/') > -1){
      const uuid = this.uuidService.generate4IE().toString();
      this.cookieService.set(this.cookieConsentName, uuid);
      this.doShowSettings = false;
      window.location.reload();
    }else{
      this.uuidService.generate().then((uuid) => {
        this.cookieService.set(this.cookieConsentName, uuid);
        this.doShowSettings = false;
        window.location.reload();
      });
    }
    
  }

  @Method()
  async openBanner() {
    this.doShowSettings = true;
    this.doShowBanner   = 0;
  }

  openDataPrivacy(){
    document.location.href = this.privacyUrl;
  }

  render() {
      return <Host>
        <div class="link" onClick={() => this.toggleSettings()}><slot/></div>
          <div class="an-modal-back"  style={{ display: this.showBanner()  ? 'block' : 'none' }}></div>
          <div class={'an-modal-container ' + this.color}  style={{ display: this.showBanner()  ? 'block' : 'none' }}>
            <div class="an-modal-header">
              <h2>{this.translations['title']}</h2>
            </div>
            <div class="an-modal-body" style={{ display: this.doShowSettings  ? 'none' : 'block' }}>
              {this.translations['description']}
              <span style={{ display: this.isMinimal  ? 'none' : 'inline' }}> {this.translations['descriptionExtended']}</span>    
    
            </div>
            <div class="an-modal-body an-settings" style={{ display: this.doShowSettings  ? 'block' : 'none' }}>
              <label class="an-settings-row">
                <div class="an-label">
                  <div>
                    <b>{this.translations['technical']}</b><br/>
                    <span class="an-description">{this.translations['description']}</span>
                  </div>
                  <div class="an-notes">
                    <div class="an-notes-header" onClick={(event)=>this.toogleCookies(-1, event)} >
                      <div class="an-notes-toogle"> <b>Cookies</b></div>
                      <div style={{ display: this.showCookieNote(-1) ? 'block' : 'none' }}><b>{this.translations['note']}</b></div>
                      <div style={{ display: this.showCookieNote(-1)  ? 'block' : 'none' }}><b>{this.translations['validity']}</b></div>
                    </div>
                    <div onClick={(event)=>this.toogleCookies(-1, event)}>
                      <div class="an-notes-list"  style={{ display: this.showCookieNote(-1)  ? 'flex' : 'none' }}>
                        <div class="an-first"><span>areanet-cookiebanner-consent</span></div>
                        <div>{this.translations['cookieSettings']}</div>
                        <div>{this.translations['oneYear']}</div>
                      </div>
                      <div class="an-notes-list"  style={{ display: this.showCookieNote(-1)  ? 'flex' : 'none' }}>
                        <div class="an-first"><span>areanet-cookiebanner-protect</span></div>
                        <div>{this.translations['cookieSettings']}</div>
                        <div>{this.translations['temp']}</div>
                      </div>
                      {this.cookiesRequired.map((c) => {
                          return <div class="an-notes-list"  style={{ display: this.showCookieNote(-1)  ? 'flex' : 'none' }}>
                            <div class="an-first"><span>{c.name}</span></div>
                            <div>{c.note[this.lang]}</div>
                            <div>{c.lifetime[this.lang]}</div>
                          </div>
                        })}
                    </div>
                  </div>    
                </div>            
                <div class="an-disabled">
                  <input id="req" type="checkbox" class="an-checkbox" disabled checked/>
                  <div class="an-checbox-mark">&#10004;</div>
                </div>
              </label>
              {this.modules.map((m, index) => {
                return <label class="an-settings-row">
                  <div class="an-label" key={index}>
                    <div class="an-cursor">
                      <b>{m.label}</b><br/>
                    
                      <span class="an-description">{m.description[this.lang]}</span>
                    </div>
                    <div class="an-notes">
                    <div class="an-notes-header" onClick={(event)=>this.toogleCookies(index, event)} style={{ display: m.useExternalSource  ? 'flex' : 'none' }}>
                        <div class="an-notes-toogle an-external"> {this.translations['externalScript']}</div>
                      </div>
                      <div class="an-notes-header" onClick={(event)=>this.toogleCookies(index, event)} style={{ display: m.cookiesOptional.length > 0 ? 'flex' : 'none' }}>
                        <div class="an-notes-toogle"> <b>Cookies</b></div>
                        <div style={{ display: this.showCookieNote(index) ? 'block' : 'none' }}><b>{this.translations['note']}</b></div>
                        <div style={{ display: this.showCookieNote(index)  ? 'block' : 'none' }}><b>{this.translations['validity']}</b></div>
                      </div>
                  
                      <div onClick={(event)=>this.toogleCookies(index, event)}>
                        {m.cookiesOptional.map((c) => {
                          return <div class="an-notes-list"  style={{ display: this.showCookieNote(index)  ? 'flex' : 'none' }}>
                            <div class="an-first"><span>{c.name}</span></div>
                            <div>{c.note[this.lang]}</div>
                            <div>{c.lifetime[this.lang]}</div>
                          </div>
                        })}
                      </div>
                      <div class="an-notes-header"  onClick={(event)=>this.toogleVendor(index, event)}>
                        <div class="an-notes-toogle an-vendor"> <b>{this.translations['vendor']}</b></div>
                      </div>
                      <div  onClick={(event)=>this.toogleVendor(index, event)}>
                        <div class="an-notes-list" style={{ display: this.showVendorNote(index)  ? 'flex' : 'none' }}>
                          <div class="an-first"><span>{m.vendor}</span></div>
                          <div><a href={m.privacyUrl}>{this.translations['privacy']}</a></div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class="an-cursor">
                    <input id={m.key} key={m.key} class="an-checkbox an-checkbox-module" type="checkbox" checked={m.isAccept()} />
                    <div class="an-checbox-mark">&#10004;</div>
                  </div>
                </label>  
              })}  
            
            </div>
            
            <div class="an-modal-footer"  style={{ display: this.doShowSettings ? 'flex' : 'none' }} >
              <button class="an-secondary" onClick={() => this.toggleSettings()}>{this.translations['closeSettings']}</button>
              <button class="an-secondary" style={{ display: this.isMinimal ? 'none' : 'inline-block' }} onClick={() => this.acceptChoosen()}>{this.translations['saveOptions']}</button>
              <button class="an-primary" style={{ display: this.isMinimal ? 'none' : 'inline-block' }} onClick={() => this.acceptAll()}>{this.translations['allowAll']}</button>
            </div>
            <div class="an-modal-footer"  style={{ display: this.doShowBanner == 1 ? 'flex' : 'none' }} >
            <button class="an-secondary" onClick={() => this.toggleSettings()}>{this.translations['settings']}</button>
              <button class="an-primary" onClick={() => this.acceptAll()}>{this.translations['ok']}</button>
            </div>
            <div class="an-modal-footer"  style={{ display: this.doShowBanner == 2 ? 'flex' : 'none' }} >
              <button class="an-secondary" onClick={() => this.toggleSettings()}>{this.translations['settings']}</button>
              <button class="an-secondary" onClick={() => this.acceptRequired()}>{this.translations['allowTechnical']}</button>
              <button class="an-primary"  onClick={() => this.acceptAll()}>{this.translations['allowAll']}</button>
            </div>
            <div class="an-modal-body an-privacy" >
              <p>
                Version {this.version} by <a href="https://www.area-net.de">AREA-NET GmbH</a>
                <span style={{ display: (this.privacyUrl || this.imprintUrl) ? 'inline' : 'none' }}> | </span>
                <a style={{ display: this.privacyUrl ? 'inline' : 'none' }} href={this.privacyUrl}>{this.translations['privacy']}</a>  
                <span style={{ display: (this.privacyUrl && this.imprintUrl) ? 'inline' : 'none' }}> | </span>
                <a style={{ display: this.imprintUrl ? 'inline' : 'none' }} href={this.imprintUrl}>{this.translations['imprint']}</a> 
              </p>
            </div>
          </div>
        </Host>;

  }

  showBanner(){
    return this.doShowSettings || this.doShowBanner > 0;
  }

  showCookieNote(index){
    return this.showCookieNotes.includes(index);
  }

  showVendorNote(index){
    return this.showVendorNotes.includes(index);
  }

  toogleCookies(index, evt){

    if(!this.showCookieNotes.includes(index)){
      this.showCookieNotes = [
        ...this.showCookieNotes,
        index
      ];
    }else{
      this.showCookieNotes = this.showCookieNotes.filter(i => i != index);
    }

    evt.preventDefault();
  }

  toogleVendor(index, evt){
    if(!this.showVendorNotes.includes(index)){
      this.showVendorNotes = [
        ...this.showVendorNotes,
        index
      ];
    }else{
      this.showVendorNotes = this.showVendorNotes.filter(i => i != index);
    }
    evt.preventDefault();
  }

  toggleSettings(){
    if(this.doShowSettings){
      this.doShowSettings = false;
      this.doShowBanner   = this.doShowBannerStore;
    }else{
      this.doShowSettings = true;
      this.doShowBanner   = 0;
    }
  
  }

}
