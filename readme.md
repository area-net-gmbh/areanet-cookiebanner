# Kostenloser Cookie-Banner der AREA-NET GmbH

## Hinweise

- Wird kein externes Modul (z.B. Google Analytics genutzt), wird ein reiner Info-Banner angezeigt
- Folgende Module und Anbieter werden aktuelle untersützt. Die entsprechenden Codes werden dynamisch bei Aktivierung durch den Benutzer eingebunden:
  - Google Analytics
  - Facebook Pixel
- Third-Party Cookies, nicht technisch-notwendige Cookies und externe Skripte der obigen Anbieter werden erst nach der Zustimmung durch den Benutzer eingebunden
  - Sollte im Browser Javascript deaktiviert sein, werden diese Cookies und externe Skripte nicht eingebunden
- Google Analytics und Facebook Pixel darf nicht manuell eingebunden sein.

## Installation

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

### Attribute

Alle Attribute sind optional. Das Setzen von Impressum und Datenschutzerklärung wird empfohlen, da die normalen Links eventuell vom Banner überdeckt sein könnten.

| Attribut | Wert/e | Beispiel | Beschreibung |
| --- | --- | --- | --- |
| cookies | Name1,Beschreibung1,Laufzeit1;Name2,... | phpsessid,Session,temporär | Fügt eingesetzte technisch notwendige Cookie bei der Auflistung dieser Cookies im Banner hinzu. Name, Beschreibung und Laufzeit pro Cookie kommagetrennt, mehrere Cookies können per Semikolen erfasst werden. |
| module-fb | Facebook Pixel-ID | | |
| module-ga | Google Analytics-ID | | |
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

## Lizenz

Der Cookie-Banner darf kostenlos - auch kommerziell - eingesetzt weden. Es ist nicht erlaubt Änderungen am Quellcode vorzunehmen oder den Hinweis auf die AREA-NET GmbH zu entfernen oder auszublenden. Rechtliche Gewährleistung und/oder Haftung sind ausgeschlossen und werden nicht übernommen.

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