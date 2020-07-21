# areanet-cookiebanner

## Todos

- Einstellungen-Popover
  - Label
  - Auswahl speichern
  - Abbrechen
  - Cookies
    - notwendige (Pflicht)
    - optional: Google Analytics 
    - optional: Facebook Pixel
  - Datenschutz-Link
- Minimal-Popover
  - Label
  - Einstellungen
  - Datenschutz
  - Ok-Button
- Standard-Popover
  - Label
  - Einstellungen
  - nur notwendige
  - alle zulassen
- Properties:
  - ThirdParty => Liste (ga,fbp)
- Slots:
  - Label
  - URL für Datenschutz
- Colors
  - Background
  - Text
  - Primary (alle-Button)
  - Secondary (andere Buttons)

## ThirdParty
 - https://stackoverflow.com/questions/753514/how-do-i-dynamically-load-google-analytics-javascript

## Ablauf
- cookie: {required: true, ga: true, fbp: true}
- Wenn keine ThirdParties verwendet
  - Wenn cookie noch nicht gesetzt: Minimal-Popover anzeigen
- Wenn ThirdParties verwendet
  - Wenn cookie noch nicht gesetzt: Standard-Popover anzeigen
  - Bei Klick auf Link => Einstellungen-Popover
- ThirdParty
  - wenn erlaubt: GA dynamisch einbunden
 


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default     |
| ------------- | -------------- | ----------- | -------- | ----------- |
| `color`       | `color`        |             | `string` | `undefined` |
| `cookies`     | `cookies`      |             | `string` | `undefined` |
| `gaeProperty` | `gae-property` |             | `number` | `undefined` |
| `imprintUrl`  | `imprint-url`  |             | `string` | `undefined` |
| `privacyUrl`  | `privacy-url`  |             | `string` | `undefined` |
| `thirdparty`  | `thirdparty`   |             | `string` | `undefined` |


## Methods

### `openBanner() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
