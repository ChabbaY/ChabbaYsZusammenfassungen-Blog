---
date: 2025-01-14
author: Linus Englert
timeline: false
article: false
---

# Computergarfik und Bildverarbeitung

## Einführung

Computergrafik (Bildsynthese) $\iff$ Bildverarbeitung (Bildanalyse)

Bildverarbeitung ist die Aufbereitung eines Bildes, die Generierung einer abstrakten Beschreibung zu einem Bild heißt Computer Vision.

### Farbwahrnehmung

- **Farbe** entsteht durch Licht (elektromagnetische Wellen), **Farbreiz** ist die Spektralverteilung sichtbarer elektromagnetischer Strahlung
- **Farbeindruck** ist die Verarbeitung neuronaler Signale im Visuellen Cortex, hängt von Umgebung und Anapssung des Auges an die Lichtverhältnisse ab

### Zentralperspektive

- Perspektive in Malerei große Kulturleistung
- heute: Projektion von 3D-Punkten auf Bildebene und 3D-Rekonstruktion aus 2D-Bildern
- vereinfachte Darstellung ohne Linsengeometrie oder dergleichen

### Anwendungsgebiete

- 3D-Computergrafik: Ausbildungssimulation, Telepräsenz (virtuelle Museen), Datenvisualisierung, Entwicklungssimulationen (CAD), Unterhaltung (Computerspiele), Datenübertragung (Bilddatenkodierung)
- mit harter Echtzeit (min. 60 Hz / fixe Deadlines) oder weicher Echtzeit
- Bildverarbeitung: Qualitätskontrolle, Robotik, Überwachung, Medizin, autonomes Fahren, Kriminilogie, Photographie, Multimedia, Wettervorhersage, Astronomie, Archäologie, Militär

## Bildverarbeitung

Bild als Funktion s

$s: \mathbb{R}^M \rightarrow \mathbb{R}^N$, M = 2, N = \{1,3\}

Ein zweidimensionaler Bildpunkt bekommt hier 1 oder 3 Kanäle zugewiesen. Bild ist Funktion auf kontinuierlichen Mengen $\rightarrow$ für Digitalisierung ist Diskretisierung notwendig, dafür 2 Strategien:

- **Rasterung** (Abtastung): Festlegung eines einzelnen Werts pro Bildbereich / Pixel
- **Quantisierung**: Festlegung von Flächen mit demselben Wert

Gerastertes Bild kann als Matrix (**Bildmatrix**) definiert werden, Einträge sind über **Koordinatentupel** referenzierbar

Bildarten: Binärbilder, Grauwertbilder und Farbbilder

Kanal als letzter Eintrag im Tupel für Referenzierung einzelner Farbwerte:

$s(x,y,n) = g,g \in G$
