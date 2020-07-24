# Kostenloser Cookie-Banner der AREA-NET GmbH

## Hinweise

- Wird kein externes Modul (z.B. Google Analytics genutzt), wird ein reiner Info-Banner angezeigt
- Folgende Module und Anbieter werden aktuelle untersützt. Die entsprechenden Codes werden dynamisch bei Aktivierung durch den Benutzer eingebunden:
  - Google Analytics
  - Google Maps
  - Youtube Videos
  - Facebook Pixel
- Third-Party Cookies, nicht technisch-notwendige Cookies und externe Skripte der obigen Anbieter werden erst nach der Zustimmung durch den Benutzer eingebunden
  - Sollte im Browser Javascript deaktiviert sein, werden diese Cookies und externe Skripte nicht eingebunden
- Google Analytics und Facebook Pixel darf nicht manuell eingebunden sein.


## Dokumentation

- Die Zustimmungen der Benutzer werden aufgrund der DSGVO-Dokumentationspflichten anonymisiert in der SQLite-Datenbank *areanet-cookiebanner/api/.htstore* gespeichert
- Die Datei .htstore sollte in der Regel nicht direkt über den Browser aufrufbar sein. Sollte die Datei über den Browser aufrufbar sein, sollte z.B. die .htaccess-Datei entsprechend angepasst werden
- Die Daten werden (wenn mcrypt installiert) verschlüsselt in der Datenbank gespeichert und können von dort im Falle eines Audits ausgelesen werden
- Eine Oberfläche zum Auslesen der Dokumentation besteht aktuell noch nicht

## Installation

(0) Für die Dokumentation wird auf dem Server PHP7 mit SQLite-Unterstützung vorausgesetzt. Empfohlene zusätzliche Erweiterungen: mcyrpt

(1) Download release.zip und entpacken

(2) Upload des Ordners "areanet-cookiebanner" auf den Server

(3) Einbindung der Skripte im Header

```
<script type="module" src="areanet-cookiebanner/areanet-cookiebanner.esm.js"></script>
<script nomodule src="areanet-cookiebanner/areanet-cookiebanner.js"></script>
```

(4) Einbdung des Buttons z.B. in der Footer-Navigation

```
<areanet-cookiebanner module-ga="UAE-32323-2323" cookies="phpsessid,Session,temporär" module-fb="FB-ID" imprint-url="impressum.html" privacy-url="datenschutz.html">Cookie-Einstellungen</areanet-cookiebanner>
```

## Konfiguration 

### PHP-Skript

Standardmäßig wird eine Default-Schlüssel zur Verschlüsselung der DB-Einträge (wenn PHP-Bibliothek mcrypt verfügbar ist) und *api/.htstore* als SQLite-Datenbankpfad verwendet. Es ist zu empfehlen beide Werte anzupassen und die Datenbank außerhalb des Ordners *areanet-cookiebanner* abzuspeichern.

Um die Werte anzupassen muss außerhalb des Ordners *areanet-cookiebanner* auf der gleichen Ebene ein Skript mit dem Namen *areanet-cookiebanner.php* mit folgende Inhalt erstellt werden:

```
define('ANCB_SECURE_KEY', 'neuer-key-moeglichst-32-stellen);
define('ANCB_DB_PATH', 'pfad-und-name-der-sqlite-db);
```

Der DB-Pfad ist absolut oder relativ zum Skript *areanet-cookiebanner/api/index.php* anzugeben.

### Javascript-API

### openBanner()
Öffnet die Einstellungen des Cookie-Banners.

```
<areanet-cookiebanner id="cookie-banner" module-gmap="loadMap" >Cookie-Einstellungen</areanet-cookiebanner>
<script>
  document.getElementById('cookie-banner').openBanner();
</script>
```

### HTML-Attribute

Alle Attribute sind optional. Das Setzen von Impressum und Datenschutzerklärung wird empfohlen, da die normalen Links eventuell vom Banner überdeckt sein könnten.

| Attribut | Wert/e | Beispiel | Beschreibung |
| --- | --- | --- | --- |
| color | Farbschema | light/dark | default=dark |
| cookies | Name1,Beschreibung1,Laufzeit1;Name2,... | phpsessid,Session,temporär | Fügt eingesetzte technisch notwendige Cookie bei der Auflistung dieser Cookies im Banner hinzu. Name, Beschreibung und Laufzeit pro Cookie kommagetrennt, mehrere Cookies können per Semikolen erfasst werden. |
| lang | de/en | | Sprache |
| module-fb | Facebook Pixel-ID | | |
| module-ga | Google Analytics-ID | | |
| module-gmap | Callback-Funktion | initMap(isEnabled) | Die Funktion wird aufgerufen, wenn der Benutzer der Nutzung von Google Maps zugestimmt hat. Als Parameter wird ein Bool-Wert übergeben, ob der Benutzer zugestimmt hat oder nicht. |
| module-yt | Callback-Funktion | initYoutube(isEnabled) | Die Funktion wird aufgerufen, wenn der Benutzer der Nutzung von Youtube zugestimmt hat. Als Parameter wird ein Bool-Wert übergeben, ob der Benutzer zugestimmt hat oder nicht. |
| imprint-url | URL | impressum.html | Pfad/URL zur Impressumsseite |
| privacy-url | URL | datenschutz.html | Pfad/URL zur Datenschutzseite |

### CSS-Anpassungen

CSS-Anpassungen können über CSS-Variable durchgeführt werden.

```
<style>
    :root{
        --areanet-cookiebanner-color-primary: #e1001a;
    }
</style>
```

**CSS-Variablen**

- --areanet-cookiebanner-color-background *(Hintergrundfarbe)*
- --areanet-cookiebanner-color-text *(Schriftfarbe)*
- --areanet-cookiebanner-color-primary *(Hintergrundfarbe des hervorgehobenen Buttons)*
- --areanet-cookiebanner-color-primary-text *(Schriftfarbe des hervorgehobenen Buttons)*
- --areanet-cookiebanner-color-secondary *(Hintergrundfarbe der normalen Buttons)*
- --areanet-cookiebanner-color-secondary-text *(Schriftfarbe der normalen Buttons)*
- --areanet-cookiebanner-font-family *(Schriftart)*
- --areanet-cookiebanner-font-size *(Schriftgröße des Textes, Headlines etc. werden automatisch angepasst)*

## Beispiele

### Google Maps Einbindung

```
<areanet-cookiebanner id="cookie-banner" module-gmap="loadMap" >Cookie-Einstellungen</areanet-cookiebanner>
...
<div id="map">
  <div id="no-maps">
    <p><b>Google Maps ist deaktiviert</b><br>
      Aktivieren Sie Google Maps in den Cookie Einstellungen, um die Karte anzeigen zu lassen.
    </p>
    <button id="btn-cookie-banner">Cookie-Einstellungen öffnen</button>
  </div>
</div>
...
<script type="text/javascript">
  var map;
  
  window.loadMap = function(isEnabled){
    if(isEnabled){
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=GOOGLE_API_KEY&callback=initMap';
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }else{
      document.getElementById('no-maps').style.display = 'block';
    }
    
  }
  
  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: LAT, lng: LNG},
        zoom: 15
    });
    var marker = new google.maps.Marker({
        position: partnerLocation,
        map: map,
        animation: google.maps.Animation.DROP,
        title: "Name de Pins",
        label: {
            color: '#d8232a',
            fontWeight: 'bold',
            text: "Name de Pins",
        },
        icon: {
            labelOrigin: new google.maps.Point(25, -15),
            url: '/images/marker_red.png',
            size: new google.maps.Size(22, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(11, 40),
        }
    });
  };

  document.getElementById('btn-cookie-banner').addEventListener('click', function(){
    document.getElementById('cookie-banner').openBanner(); 
  });
  
</script>
```

### Youtube Einbindung

```
<iframe style="display:none;" data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID" allowfullscreen="" class="youtube embed-responsive-item" allow="fullscreen"></iframe>
<div style="display:none;" class="no-youtube">Youtube ist deaktiviert.</div>
...
<areanet-cookiebanner id="cookie-banner" module-yt="loadYoutube" >Cookie-Einstellungen</areanet-cookiebanner>
...
<script>

  window.loadYoutube = function(isEnabled){
    if(isEnabled){
      for(let el of document.getElementsByClassName('.youtube')){
        el.setAttribute('src', el.getAttribute('data-src'));
        el.style.display = 'block';
      }
    }else{
      for(let el of document.getElementsByClassName('.no-youtube')){
        el.style.display = 'block';
      }
    }
  }

</script>
```

## Entwicklung

- Die Entwicklung basiert auf Stencil.js
- Starten des Testservers
  - npm start
- Erstellen eines Release-Builds
  - npm run release  

## Lizenz

Der Cookie-Banner darf kostenlos - auch kommerziell - eingesetzt weden. Es ist nicht erlaubt Änderungen am Quellcode vorzunehmen oder den Hinweis auf die AREA-NET GmbH zu entfernen oder auszublenden. 

## Disclaimer

Rechtliche Gewährleistung und/oder Haftung sind ausgeschlossen und werden nicht übernommen.

## Anbieter

AREA-NET GmbH  
Öschstrasse 33  
73072 Donzdorf 

E-Mail: info@area-net.de  
Web: https://www.area-net.de

Geschäftsführer  
Gaugler Stephan, Köller Holger, Schmid Markus

Handelsregister HRB 541303 Ulm  
Sitz der Gesellschaft: Donzdorf  
UST-ID: DE208051892