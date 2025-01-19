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

### Fragestellungen zur Einleitung

- Wie hängen CG und BV zusammen?
- Wie entsteht ein Farbeindruck aus einem Farbreiz?
- Nennen Sie Anwendungsgebiete für CG/BV
- Aufgabe: Projektion eines Objekts auf Bildebene einzeichnen

## Bildverarbeitung

Bild als Funktion s

$s: \mathbb{R}^M \rightarrow \mathbb{R}^N$, M = 2, N = \{1,3\}

Ein zweidimensionaler Bildpunkt bekommt hier 1 oder 3 Kanäle zugewiesen. Bild ist Funktion auf kontinuierlichen Mengen $\rightarrow$ für Digitalisierung ist Diskretisierung notwendig, dafür 2 Strategien:

- **Rasterung** (Abtastung): Festlegung eines einzelnen Werts pro Bildbereich / Pixel
- **Quantisierung**: Festlegung von Flächen mit demselben Wert

Gerastertes Bild kann als Matrix (**Bildmatrix**) definiert werden, Einträge sind über **Koordinatentupel** referenzierbar

Bildarten: Binärbilder, Grauwertbilder und Farbbilder

Kanal als letzter Eintrag im Tupel für Referenzierung einzelner Farbwerte:

$$s(x,y,n) = g,g \in G$$

### Statistische Größen

- Extraktion aussagekräftiger Merkmale als Vorverarbeitung
- Visualisierung anwendungsbezogener Bildeigenschaften
- für das Bild $S = s(x,y,n)$, hier nur Grauwertbild

#### Mittelwert

Durchschnittshelligkeit (pro Kanal)

$$m_S = {1 \over L~\cdot~R} \sum _{x=0}^{L-1} \sum _{y=0}^{R-1} s(x,y)$$

#### Quadratische Abweichung

Variation / Lebhaftigkeit (pro Kanal)

$$q_S = {1 \over L~\cdot~R} \sum _{x=0}^{L-1} \sum _{y=0}^{R-1} (s(x,y) - m_S)^2$$

#### Relative Häufigkeit

Beschreibung von Helligkeitsverteilungen

$$p_S(g_0,...,g_{N-1}) = {a_{g_0,...,g_{N-1}} \over L~\cdot~R}, g_n \in G$$

#### Histogramme

Darstellung der Relativen Häufigkeit

Charakterisierung von **Beleuchtung** und **Dynamik**:

![Dynamik in Histogrammen](img/histogramme-dynamik.png)

Bei zwei lokalen Maxima $\rightarrow$ **Bimodales Histogramm** $\rightarrow$ Segmentierung möglich

#### Relative Summenhäufigkeit

Kumulative Relative Häufigkeit

$$h_S(g) = \sum _{i=0}^g p_S(i), g \in G$$

#### Co-Occurence-Matrix

- mit einer **Relation** $r$ (z.B. "rechter Nachbar")
- zählt Häufigkeiten von Wertkombinationen
- Eintragung bei Spalten- und Zeilenindex der Wertkombination, z.B. 2 "rechter Nachbar" 3 in Zeile mit Index 2 und Spalte mit Index 3
- Die **Hauptdiagonale** entspricht **homogenen** Bereichen, starke Besetzung der linken unteren und rechten oberen **Ecke** bedeuten viel **Kontrast**
- Einsatz in **medizinischer Bildverarbeitung**
- **Haralick Features**: 14 Merkmale aus Co-Occurence-Matrix
- Für Richtungsinvarianz: Rotation der Relation und anschließende Mittelung

### Fragestellungen zu Digitalen Bildern

- Was ist ein bimodales Histogramm?
- Was kann man im Histogramm erkennen?
- Wozu lässt sich die Co-Occurrence nutzen?

- Aufgabe: Berechnung statistischer Größen (z.B. Relative Häufigkeiten, Histogramm, ...) für ein Bild mit gegebener Grauwert-Matrix
- Aufgabe: gg. Grauwertbilder $\rightarrow$ Histogramme zuordnen
- Aufgabe: gg. Histogramm $\rightarrow$ Beleuchtung und Dynamik zuordnen
- Aufgabe: gg. Grauwertbild, Relation $\rightarrow$ Co-Occurrence Matrix berechnen

### Punktoperationen

Modifikation der Bildpixel (Grauwerte $G = \{0, ..., 255\}$) ohne Berücksichtigung der Umgebung, ist Funktion, die Eingabebild $S_e$ auf Ausgabebild $S_a$ abbildet

- bessere bildliche Reproduktionsqualität bei der **Videodigitalisierung**
- für Ausdrucke mit weniger als 256 Graustufen

#### Lineare Skalierung

$$f(g) = (g + c_1) \cdot c_2 = c_2 g + c_1 c_2$$

- $c_1 < 0$: dunkler, Histogramm nach links
- $c_1 > 0$: heller, Histogramm nach rechts
- $0 < c_2 < 1$: weniger Kontrast, Histogramm gestaucht
- $c_2 > 1$: mehr Kontrast, Histogramm gestreckt
- $c_1 = 0, c_2 = 1$: Identitätsabbildun

Grauwerte < 0 und > 255 werden abgeschnitten, dadurch gehen ggf. Informationen verloren

Anpassung für bessere Ergebnisse:

$$f(g) = c_2(g - 128) + 128 + c_1$$

Dadurch "dreht" die Multiplikation um den Ursprung

Für **Falschfarbendarstellung** oder eine **Beschleunigung** der Berechnung kann eine **Lookup-Tabelle** eingesetzt werden: Zuordnung Grauwert $\rightarrow$ Grauwert

#### Äquidensiten

Eine stückweise konstante Skalierung

- **1\. Ordnung**: Direktes Ergebnis mit Flächendarstellung
- **2\. Ordnung**: Nur die Ränder der Flächen werden dargestellt
- **Gemischte Ordnung**: Sowohl Flächen als auch Ränder werden dargestellt

Grenzen können aus Relativer Summenhäufigkeit abgeleitet werden $\rightarrow$ **Randerkennung**

Problem: **Rauschanfälligkeit**

Spezialfall: Binär- (0 und 255) oder Zweipegelbild (2 beliebige Graustufen)

- Anwendung in der **Segmentierung**
- **Binarisierung** über Schwellenwert, der automatisch ermittelt werden kann

#### Histogrammlinearisierung

Skalierungsfunktion, die dafür sorgt, dass $g$ **gleichverteilt** ist und den gesamten Wertebereich füllt (effizient mit Lookup-Tabelle da keine Parameter)

$$f_n(g) = 255 \cdot h_S(g)$$

- mehr **Kontrast** (in dunklen und in hellen Bereichen), hilfreich bei kontrastarmen Bildern
- feine **Bildstrukturen** sind besser sichtbar
- mittlere Grauwerte nahezu unverändert
- Problem: **sichtbares Rauschen** in hellen Bildbereichen

### Fragestellungen zu Punktoperationen

- Wie lassen sich bei der linearen Skalierung entstehende Grauwerte > 255 behandeln?
- Wie wirkt sich ein c_2 > 1 auf das resultierende Grauwerthistogramm aus?
- Was ist die Folge des Abschneidens von Werten > 255?
- Warum gilt bei einem Ausgabebild, das alle Grauwerte enthält, nicht exakt p_s(g)=1/256?
- Für welche Bilder eignet sich Histogrammlinearisierung nicht?
- Aufgabe: gg. Bilder von Äquidensiten $\rightarrow$ Zuordnung der Ordnung
- Aufgabe: gg. Eingabebild, linear skaliertes Bild $\rightarrow$ Zuordnung

### Lineare Filter

Im Gegensatz zu Punktoperationen **Einbezug der Umgebung** (Nachbarpixel) $\rightarrow$ lineare Abhängigkeit (gewichtete Summe) von seinen Nachbarn

Operationen **im Ortsbereich** (vs. im Frequenzbereich)

Anwendung in:

- **Vorverarbeitungsschritten** bspw. vor Segmentierung
- **Rauschunterdrückung** (Videosequenz / einfache Bilder)
- **Hervorhebung von Kanten**
- als Teil eines **Neuronalen Netzes** zur Erkennung von Bildinhalten

#### Bewegter Mittelwert

$$s'(x,y) = {1 \over 9} \sum _{u=-1}^{+1} \sum _{v=-1}^{+1} s(x-u, y-v)$$

### Fragestellungen zu Linearen Filtern

- Was ist der Unterschied zwischen linearen und nichtlinearen Filtern?
- Welchen Vorteil bietet die Filtereigenschaft der Separierbarkeit?
- Was versteht man unter dem Grauwertgradient? Wozu kann er verwendet werden?
- Was passiert bei der Bildschärfung, wenn der Parameter c einen Wert kleiner 1 annimmt?
- Warum ist der Laplace-Filter richtungsunabhängig?
- Aufgabe: gg. Grauwertbild (Matrix), Filterkern $\rightarrow$ Ergebnis
- Aufgabe: gg. Grauwertbild (Matrix) $\rightarrow$ Bewegter Mittelwert
- Aufgabe: gg. Gefiltertes Grauwertbild $\rightarrow$ Filter
- Aufgabe: gg. Filterkernel $\rightarrow$ Glättungs- oder Differenzoperator?
