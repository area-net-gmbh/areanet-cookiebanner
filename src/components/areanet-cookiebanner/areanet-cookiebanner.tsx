import { Component, h, Prop, Element, State, Host} from '@stencil/core';
import { Modules } from "./modules/modules";
import { Module } from './modules/module';
import { Cookies } from './cookies';

@Component({
  tag: 'areanet-cookiebanner',
  styleUrl: 'areanet-cookiebanner.css',
  shadow: true,
})
export class AreanetCookiebanner {
  cookies : Cookies = new Cookies();
  cookieConsentName: string = 'areanet-cookiebanner-consent-v5';
  modules : Module[] = [];
  
  doShowBannerStore: number = 0;

  @Element() el: HTMLElement;
  @Prop() thirdparty: string;
  @Prop() gaeProperty: number;
  @Prop() privacyUrl: string;

  @State() isMinimal: boolean = true;
  @State() description: string = 'Für die optimale Anzeige und Funktionsweise unserer Website setzen wir technisch notwendige Cookies ein.';
  @State() descriptionExtended: string = 'Darüberhinaus nutzen wir Analyse- und Werbetools, um unsere Dienstleistungen entsprechend optimieren und präsentieren können.';
  @State() doShowBanner: number = 0;
  @State() doShowSettings: boolean = false;

  componentWillLoad(){
   
    for(const moduleName in Modules){
      const module : Module = new Modules[moduleName]();
      const propertyName    = 'module-' + module.key;

      if(this.el.attributes[propertyName]){
        const module = new Modules[moduleName]();
        module.init(this.el.attributes[propertyName].value);
        this.isMinimal = false;
        this.modules.push(module);
      }      
    }

    if(!this.cookies.get(this.cookieConsentName)){
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
    this.cookies.set(this.cookieConsentName);
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
    this.cookies.set(this.cookieConsentName);
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

    this.cookies.set(this.cookieConsentName);
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
              <h2>Cookie-Einstellungen</h2>
              <p>Kostenloser Cookie-Banner powered by <a href="https://www.area-net.de">AREA-NET GmbH</a></p>
            </div>
            <div class="modal-body" style={{ display: this.doShowSettings  ? 'none' : 'block' }}>
              {this.description}
              <span style={{ display: this.isMinimal  ? 'none' : 'block' }}> {this.descriptionExtended}</span>    
            </div>
            <div class="modal-body settings" style={{ display: this.doShowSettings  ? 'block' : 'none' }}>
              <label class="settings-row">
                <div class="label">
                  <b>Techisch notwendige</b><br/>
                  {this.description}
                </div>
                <div>
                  <input id="req" type="checkbox" class="checkbox" disabled checked/>
                  <div class="checbox-mark">&#10004;</div>
                </div>
              </label>
              {this.modules.map((m) => {
                return <label class="settings-row">
                  <div class="label">
                    <b>{m.label}</b><br/>
                    {m.description}
                  </div>
                  <div>
                    <input id={m.key} key={m.key} class="checkbox checkbox-module" type="checkbox" checked={m.isAccept()} />
                    <div class="checbox-mark">&#10004;</div>
                  </div>
                </label>  
              })}  
            
            </div>
            
            <div class="modal-footer"  style={{ display: this.doShowSettings ? 'block' : 'none' }} >
              <button class="secondary" onClick={() => this.toggleSettings()}>Einstellungen schließen</button>
              <button class="secondary" style={{ display: this.isMinimal ? 'none' : 'inline-block' }} onClick={() => this.acceptChoosen()}>Auswahl speichern</button>
              <button class="primary" style={{ display: this.isMinimal ? 'none' : 'inline-block' }} onClick={() => this.acceptAll()}>Alle erlauben</button>
            </div>
            <div class="modal-footer"  style={{ display: this.doShowBanner == 1 ? 'block' : 'none' }} >
            <button class="secondary" onClick={() => this.toggleSettings()}>Einstellungen</button>
              <button class="primary" onClick={() => this.acceptAll()}>Ok, das habe ich verstanden.</button>
            </div>
            <div class="modal-footer"  style={{ display: this.doShowBanner == 2 ? 'block' : 'none' }} >
              <button class="secondary" onClick={() => this.toggleSettings()}>Einstellungen</button>
              <button class="secondary" onClick={() => this.acceptRequired()}>Nur notwendige erlauben</button>
              <button class="primary"  onClick={() => this.acceptAll()}>Alle erlauben</button>
            </div>
            <div class="modal-body privacy"  style={{ display: this.privacyUrl ? 'block' : 'none' }}>
              <p>Weitere Informationen finden Sie unter unserer <a href={this.privacyUrl}>Datenschutzerklärung</a></p>
            </div>
          </div>
        </Host>;

  }

  showBanner(){
    return this.doShowSettings || this.doShowBanner > 0;
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
