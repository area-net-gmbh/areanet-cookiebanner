import { Component, h, Prop, Element, State, Host} from '@stencil/core';
import { Modules } from "./modules/modules";
import { Module } from './modules/module';
import { CookieService } from './services/cookie.service';
import { CookieInterface } from './interfaces/cookie.interface';

@Component({
  tag: 'areanet-cookiebanner',
  styleUrl: 'areanet-cookiebanner.css',
  shadow: true,
})
export class AreanetCookiebanner {
  cookieService : CookieService = new CookieService();
  cookieConsentName: string = 'areanet-cookiebanner-consent';
  cookiesRequired : CookieInterface[] = [];
  modules : Module[] = [];
  
  doShowBannerStore: number = 0;

  @Element() el: HTMLElement;
  @Prop() thirdparty: string;
  @Prop() gaeProperty: number;
  @Prop() privacyUrl: string;
  @Prop() imprintUrl: string;
  @Prop() cookies: string;

  @State() isMinimal: boolean = true;
  @State() description: string = 'Für die optimale Anzeige und Funktionsweise unserer Website setzen wir technisch notwendige Cookies und Technologien ein.';
  @State() descriptionExtended: string = 'Darüberhinaus nutzen wir Analyse-, Tracking und/oder Werbetools, um unsere Dienstleistungen entsprechend optimieren und präsentieren können.';
  @State() doShowBanner: number = 0;
  @State() doShowSettings: boolean = false;
  @State() showCookieNotes: number[] = [];
  @State() showVendorNotes: number[] = [];
  @State() show : boolean = false;

  componentWillLoad(){
   
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
      
      for(const m of this.modules){
        m.decline();
      }
    }else{
      for(const m of this.modules){
        m.render();
      }  
    }

    this.doShowBannerStore = this.doShowBanner;

  }

  acceptAll(){
    this.cookieService.set(this.cookieConsentName);
    for(const m of this.modules){
      m.accept();
    }
    this.doShowBanner = 0;
    this.doShowSettings = false;
    window.location.reload();
  }

  acceptRequired(){
    for(const m of this.modules){
      m.decline();
    }
    this.cookieService.set(this.cookieConsentName);
    this.doShowBanner = 0;
  }


  acceptChoosen(){
    
    const checkboxes = this.el.shadowRoot.querySelectorAll('.checkbox-module');
    [].forEach.call(checkboxes, (c) => {
      for(const m of this.modules){
        
        if(m.key == c.id){
          if(c.checked){
            m.accept();
          }else{
            m.decline();
          }
        }
      };
    });

    this.cookieService.set(this.cookieConsentName);
    this.doShowSettings = false;
    window.location.reload();
  }


  openDataPrivacy(){
    document.location.href = this.privacyUrl;
  }

  render() {
      return <Host>
        <div class="link" onClick={() => this.toggleSettings()}><slot/></div>
          <div class="modal-container" style={{ display: this.showBanner()  ? 'block' : 'none' }}>
            <div class="modal-header">
              <h2>Cookie- und Tracking-Einstellungen</h2>
              <p>Kostenloser Cookie-Banner powered by <a href="https://www.area-net.de">AREA-NET GmbH</a></p>
            </div>
            <div class="modal-body" style={{ display: this.doShowSettings  ? 'none' : 'block' }}>
              {this.description}
              <span style={{ display: this.isMinimal  ? 'none' : 'inline' }}> {this.descriptionExtended}</span>    
            </div>
            <div class="modal-body settings" style={{ display: this.doShowSettings  ? 'block' : 'none' }}>
              <label class="settings-row">
                <div class="label">
                  <div>
                    <b>Techisch notwendige</b><br/>
                    <span class="description">{this.description}</span>
                  </div>
                  <div class="notes">
                    <div class="notes-header" onClick={(event)=>this.toogleCookies(-1, event)}>
                      <div class="notes-toogle"> <b>Cookies</b></div>
                      <div style={{ display: this.showCookieNote(-1) ? 'block' : 'none' }}><b>Bemerkung</b></div>
                      <div style={{ display: this.showCookieNote(-1)  ? 'block' : 'none' }}><b>Gültigkeit</b></div>
                    </div>
                    <div onClick={(event)=>this.toogleCookies(-1, event)}>
                      <div class="notes-list"  style={{ display: this.showCookieNote(-1)  ? 'flex' : 'none' }}>
                        <div class="first"><span>areanet-cookiebanner-consent</span></div>
                        <div>Cookie-Einstellungen</div>
                        <div>2 Jahre</div>
                      </div>
                      {this.cookiesRequired.map((c) => {
                          return <div class="notes-list"  style={{ display: this.showCookieNote(-1)  ? 'flex' : 'none' }}>
                            <div class="first"><span>{c.name}</span></div>
                            <div>{c.note}</div>
                            <div>{c.lifetime}</div>
                          </div>
                        })}
                    </div>
                  </div>    
                </div>            
                <div>
                  <input id="req" type="checkbox" class="checkbox" disabled checked/>
                  <div class="checbox-mark">&#10004;</div>
                </div>
              </label>
              {this.modules.map((m, index) => {
                return <label class="settings-row">
                  <div class="label" key={index}>
                    <div>
                      <b>{m.label}</b><br/>
                    
                      <span class="description">{m.description}</span>
                    </div>
                    <div class="notes">
                    <div class="notes-header" onClick={(event)=>this.toogleCookies(index, event)} style={{ display: m.useExternalSource  ? 'flex' : 'none' }}>
                        <div class="notes-toogle external"> Dieser Dienst bindet ein externes Skript des Anbieters auf der Website ein.</div>
                      </div>
                      <div class="notes-header" onClick={(event)=>this.toogleCookies(index, event)}>
                        <div class="notes-toogle"> <b>Cookies</b></div>
                        <div style={{ display: this.showCookieNote(index) ? 'block' : 'none' }}><b>Bemerkung</b></div>
                        <div style={{ display: this.showCookieNote(index)  ? 'block' : 'none' }}><b>Gültigkeit</b></div>
                      </div>
                  
                      <div onClick={(event)=>this.toogleCookies(index, event)}>
                        {m.cookiesOptional.map((c) => {
                          return <div class="notes-list"  style={{ display: this.showCookieNote(index)  ? 'flex' : 'none' }}>
                            <div class="first"><span>{c.name}</span></div>
                            <div>{c.note}</div>
                            <div>{c.lifetime}</div>
                          </div>
                        })}
                      </div>
                      <div class="notes-header"  onClick={(event)=>this.toogleVendor(index, event)}>
                        <div class="notes-toogle vendor"> <b>Anbieter</b></div>
                      </div>
                      <div  onClick={(event)=>this.toogleVendor(index, event)}>
                        <div class="notes-list" style={{ display: this.showVendorNote(index)  ? 'flex' : 'none' }}>
                          <div class="first"><span>{m.vendor}</span></div>
                          <div><a href={m.privacyUrl}>Datenschutzerklärung</a></div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div>
                    <input id={m.key} key={m.key} class="checkbox checkbox-module" type="checkbox" checked={m.isAccept()} />
                    <div class="checbox-mark">&#10004;</div>
                  </div>
                </label>  
              })}  
            
            </div>
            
            <div class="modal-footer"  style={{ display: this.doShowSettings ? 'flex' : 'none' }} >
              <button class="secondary" onClick={() => this.toggleSettings()}>Einstellungen schließen</button>
              <button class="secondary" style={{ display: this.isMinimal ? 'none' : 'inline-block' }} onClick={() => this.acceptChoosen()}>Auswahl speichern</button>
              <button class="primary" style={{ display: this.isMinimal ? 'none' : 'inline-block' }} onClick={() => this.acceptAll()}>Alle erlauben</button>
            </div>
            <div class="modal-footer"  style={{ display: this.doShowBanner == 1 ? 'flex' : 'none' }} >
            <button class="secondary" onClick={() => this.toggleSettings()}>Einstellungen</button>
              <button class="primary" onClick={() => this.acceptAll()}>Ok, das habe ich verstanden.</button>
            </div>
            <div class="modal-footer"  style={{ display: this.doShowBanner == 2 ? 'flex' : 'none' }} >
              <button class="secondary" onClick={() => this.toggleSettings()}>Einstellungen</button>
              <button class="secondary" onClick={() => this.acceptRequired()}>Nur notwendige erlauben</button>
              <button class="primary"  onClick={() => this.acceptAll()}>Alle erlauben</button>
            </div>
            <div class="modal-body privacy" >
              <p>
                <a style={{ display: this.privacyUrl ? 'inline' : 'none' }} href={this.privacyUrl}>Datenschutzerklärung</a>  
                <span style={{ display: (this.privacyUrl && this.imprintUrl) ? 'inline' : 'none' }}> | </span>
                <a style={{ display: this.imprintUrl ? 'inline' : 'none' }} href={this.imprintUrl}>Impressum</a>
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
