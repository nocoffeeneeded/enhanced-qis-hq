# Enhanced QIS for Hochschule Trier
Enhanced QIS verbessert das QIS-System (für die Hochschule Trier)

# Installation
## Chrome, Edge, Brave und andere Chromium-Browser
1. Dieses Repository herunterladen oder klonen.
2. Die Erweiterungsverwaltung öffnen (zum Beispiel `chrome://extensions`).
3. Den **Entwicklermodus** aktivieren.
4. **Entpackte Erweiterung laden** auswählen und den Ordner dieses Repositories öffnen.

Die Erweiterung verwendet Manifest V3 und kann damit in aktuellen Chromium-basierten Browsern geladen werden.

## Firefox
Download aus dem Mozilla Add-on Store:
[https://addons.mozilla.org/de/firefox/addon/enhanced-qis/](https://addons.mozilla.org/de/firefox/addon/enhanced-qis/)
# Features
## Notenübersicht
Die Notenübersicht wird aufpoliert und erweitert.

Aus dem ursprünglichen Design:
![see docs/images/GradeOverview_before.png](docs/images/GradeOverview_before.png)

Wird die verbesserte Übersicht:
![see docs/images/GradeOverview_after_annotated.png](docs/images/GradeOverview_after_annotated.png)
- Es werden die alten farblichen Markierungen für bestandene, angemeldete, und nicht bestandene Prüfungsleistungen wieder eingeführt
- Es werden unnötige Informationen aus der Notenübersicht entfernt
    - Prüfungsrücktritte
    - Modulgruppierungen
- Es wird ein Notenschnitt ermittelt (wird in der Tabellenüberschrift "Note" angezeigt)
    - Berechnung: ![see docs/images/AVGGrade.png](docs/images/AVGGrade.png)
    - Leistungen im Abschnitt **„Freiwillige, zusätzliche Leistungen (keine Prüfungen)“** fließen nicht in den Notenschnitt ein
