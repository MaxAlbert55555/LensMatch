# Lensmatch

## Installation des Projektes
1. Projekt von Github Clonen
2. Im Terminal folgende Befehle eingeben:

```sh
npm install
``` 
```sh
npm run dev
```

*Voraussetzung ist node.js

3. Ein Server wird erstellt und im Browser öffnet sich ein Fenster. Wenn nicht, bitte den Link aus dem Terminal im Browser eingeben

## Nutzung des Projekts
Das Projekt soll Objektive miteinander vergleichen. 
Zur Zeit ist es noch nicht so ausgereift wie es sollte.
Die Berechnungen sind physikalisch noch nicht korrekt. 

Die Veränderung der Optik funktioniert leider erst nach einer weiteren Interaktion des Fensters. Es wird also leider nicht dynamisch live gerendert.

### Optik zuverlässig anpassen
In der Datei "threeScene.js" können folgenden Zeilen angepasst werden:

```sh
let focalLength = 50;
```
- Hier wird die Brennweite eingegeben z.B. 50 für 50mm

```sh
let aperture = 8; 
```
- Hier wird der Blendenwert in umgekehrter Reihenfolge eingegeben. Echter Blendenwert 8 -> 1, 1 -> 8

```sh
let focus = 5.729; 
```
- Fokus in mm. Nutze folgende Werte: 5.729 (Haus), 0.9337 (linkes von den 3 Fässern), 0.387 (liegendes Fass)