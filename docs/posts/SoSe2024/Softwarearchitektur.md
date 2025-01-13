---
date: 2024-07-18
author: Linus Englert
timeline: false
article: false
---

# Softwarearchitektur

## 1 Schnittstellen

Alltagsgegenstände haben bekannte und wohldefinierte **Schnittstellen**, daher sind diese einfach zu bedienen. Die sogenannten **Interna** bleiben dabei verborgen und können auch relativ einfach gewechselt werden. Für die Bedienung ist es unerheblich, wie das Objekt tatsächlich funktioniert.

Schnittstellen definieren **Verträge**, es ist keine Verhandlung zwischen Produzent und Konsument mehr notwendig. $\rightarrow$ **Design by Contract (DbC)**, nach Bertrand Meyer, 1992

- Bindender Vertrag bei jedem Aufruf
  - Leistung wird erfüllt, falls alle Annahmen erfüllt
  - Ansonsten wird Leistung verweigert
- Dadurch Sicherstellung der Semantik

### 1.1 Information Hiding

- nach David Parnas, 1972
- **"Geheimnisprinzip"**
- Datenkapselung als mögliche Technik zur Umsetzung
- Funktionalität hinter Schnittstelle verborgen
- Implementierung einfach austauschbar

#### 1.1.1 Umsetzung in Java

- über **Zugriffsmodifikatoren**: public, private, etc.
- über **Module** (OSGi, seit 2000, oder Java Jigsaw, seit Java 9, 2017)
- über **Annotationen**, Verletzungen der Annotationen werden über Build Tools geprüft

### 1.2 Interfaces in Programmiersprachen

Unterteilung einer Klasse in:

- **Schnittstelle und Verhalten**: öffentliche Methoden
- **Daten**: Daten die zur Funktion benötigt werden

Ein Interface (in Java) definiert einen **Vertrag**

- Festlegung der Anforderungen durch Methodensignaturen und Dokumentation
- Der Produzent implementiert das Interface
- Der Konsument nutzt das Interface über dessen vordefinierte Methoden

Alternativ kann (in Java) eine **abstrakte Klasse** eingesetzt werden

- Allerdings keine Mehrfachvererbung
- Dafür leichtere Weiterentwicklung möglich, da Interfaces nach der Veröffentlichung nicht mehr geändert werden können

## 2 SOLID-Prinzipien

Es handelt sich um bewährte Prinzipien, die von **Robert C. Martin** zusammengefasst wurden.

- wie Funktionen und Daten **gekoppelt** werden können
- wie Klassen untereinander **angeordnet** werden können
- wie **Schnittstellen** konzipiert werden sollen

Vorteile

- **Erweiterbarkeit**: weniger Wartung durch erweiterbaren/änderbaren Code
- **Wiederverwendung**: durch Modularisierung
- **Verständlichkeit**: Einarbeitung fällt leichter
- **Testbarkeit**: durch Trennung von Schnittstelle und Implementierung werden Tests vereinfacht

### 2.1 Single Responsibility Principle

- Eine Klasse sollte **nur für einen Akteur relevant** sein
- Gegenbeispiel: God-Class Anti-Pattern
- Möglicher Verstoß bei häufigen Änderungen oder zahlreichen, verschiedenen Imports; Erkennung über Jenkins Git Forensics Plugin, PMD oder CheckStyle

### 2.2 Open-Closed Principle

- **Offenheit für Erweiterung** aber **Geschlossenheit für Veränderung**
- Erweiterung ohne Veränderung de bestehenden Code, idealerweise einfach Hinzufügung
- Erweiterungen haben keine Auswirkung auf bestehenden Code → keine neue Auslieferung, keine neuen Tests erforderlich

### 2.3 Liskov Substitution Principle

- **Subklasse** muss immer **eingesetzt werden können**, wenn Superklasse erwartet wird
- bei einer Schnittstelle muss jede Implementierung eingesetzt werden können
- führt zu einer guten, konsistenten Vererbungshierarchie

### 2.4 Interface Segregation Principle

- Verschiedene **Nutzungsarten** eines Bausteins werden über **unterschiedliche Schnittstellen**
realisiert
- Entkopplung unterschiedlicer Nutzer
- spezialisierte Schnittstellen

### 2.5 Dependency Inversion Principle

- Im Idealfall: **Abhängigkeiten von Abstraktion** statt von konkreten Implementierungen
  - keine konkrete Klasse referenzieren
  - von keiner konkreten Klasse ableiten
  - keine konkreten Methoden überschreiben
- eigentlich nie vollständig erreichbar

## 3 Java Idiome

Idiome sind die **spezifische und typische Verwendung** von Sprachmitteln, also das was sich in der jeweiligen Sprache und Laufzeitumgebung bewährt hat.

Kommt aus den Sprachwissenschaften und meint dabei eine “typische Art” etwas auszudrücken. Entstehungsweg:

- häufige **Fragestellung** mit **unklarer Implementierung**
- parallele Entwicklung verschiedener Lösungen, viele falsch oder unvollständig
- Dokumentation der **"Best Practices"**
- Unterstützung durch Entwicklungsumgebung (Code Assistent)
- Bereitstellung von Kurzformen durch **Bibliotheken**
- Einzug von Kurzform in die **Sprache**

### 3.1 equals und hashCode

- komplexe Anforderungen
- **Algorithmus zum Generieren** schon lange verfügbar

### 3.2 null Handling

- als Default für Objektreferenzen
- weil es einfach umzusetzen war (rückblickend nicht ideal)
- Verwendung bei: optionalen Parametern, ergebnislosen Methoden, ungesetzter Wert
- sollte möglichst vermieden werden, da overhead bei ständiger prüfung auf null
- Alternativen:
  - Verwendung von **Optional** oder **Null Object**
  - Rückgabe leerer Mengen
  - Methoden mit weniger Parametern überladen
- Ansonsten Validierung (Objects.requireNonNull) und Annotation (@CheckForNull)

### 3.3 Exception Handling

Laufzeitfehler treten wegen logischer Fehler, fehlerhafter Bedienungen, unberechtigter Benutzungen, temporärer Störungen (Internet etc.) oder Probleme in der Java Runtime (z.B. Speichermangel) auf.

Je nach dem muss der Fehler im Code ausgebessert, der Benutzer zur Korrektur aufgefordert
oder ein neuer Versuch gestartet werden.
In Java werden dafür Exceptions geworfen:

- Zwingende Behandlung von Laufzeitfehlern
- Lokalisierung des Fehlers möglich
- Trennung von Programmlogik und Fehlerbehandlung

**Best Practice**: try und catch Blöcke separieren

- Aufruf privater Submethode im try Block, nicht direkt den Code reinschreiben
- Fehlerbehandlung in catch Blöcken

**Best Practice**: Exceptions nicht für Steuerung verwenden

- Bei Exception-Wurf sollte analoge boolesche Prüfmethode vorhanden sein
  - Vor Zugriff auf einen Index _get(index)_ prüfen, ob dieser existiert: z.B. _size()_
  - Bei Key-Value mit _hasKey(key)_
  - Beim Iterator _hasNext()_

Exceptiontypen:

- **checked**: erbt von Exception, aber nicht von RuntimeException, muss deklariert und
gefangen werden
- **unchecked**: erbt von RuntimeException, muss nicht gefangen werden, dann würde aber
das Programm abstürzen

Unterscheidung in checked und unchecked hat sich in der Praxis nicht bewährt. Generell führen Exceptions schnell zu Spaghetti-Code.

Verletzung des Information Hiding durch Exceptions, da Implementierungsdetails offenbart werden.

Umgang mit Exceptions:

- In Geschäftsanwendungen
  - **A-Exceptions**: integraler Bestandteil der Schnittstelle, deklariert, beschrieben, beim
Aufruf behandelt
  - **T-Exceptions**: technische Ursache, können nicht aufgezählt werden (Murphy’s Law),
können zwar deklariert werden, sollten aber nicht weiter behandelt werden
- Bei Fremdbibliotheken
  - oftmals Nutzung von checked Exceptions, langsame Abkehr erkennbar
  - Wrapping über Fassade kann sinnvoll sein

## 4 Patterns

Ein Muster ist eine bewährte Lösung für eine häufig wiederkehrende Problemstellung.

- (abstrakte) Wiederverwendung
- dokumentiert bewährte und elegante Lösung
- gemeinsames Vokabular
- einfachere Auswahl von Alternativen

Patterns können aber auch zur Plage werden:

- nur einsetzen, falls wirklich benötigt (muss Mehrwert bringen)
- Komplexität der Software nimmt zu (mehr Klassen, mehr Methodenaufrufe)
- wichtig zu beachten, wann Pattern nicht eingesetzt werden sollte
- Negativbeispiel Singleton: einfach aber meist unnütz

Einordnung in Erzeugung, Struktur und Verhalten.

### 4.1 Erzeugung

Im Folgenden die wichtigsten Erzeugung Patterns:

#### 4.1.1 Builder

Das **Builder Pattern** dient der vereinfachten Erzeugung komplexer Objekte durch Auslagerung
in eine spezielle Klasse.

Vorteile

- bessere Erweiterung durch Modularisierung
- einfache Integration und Wiederverwendung
- "zeitlich gestreckte" Konstruktion: Fehlerbehandlung mit anschließender Fortsetzung möglich, keine Wiederholung vorheriger Schritte notwendig
- erleichterte Entwicklung im Team

Nachteile

- enge Kopplung von Builder, Produkt und beteiligten Klassen

#### 4.1.2 Factory Method

Das **Factory Method Pattern** dient als Schnittstelle zur Objekterzeugung. Die Entscheidung welche konkrete Klasse genommen wird bleibt in der implementierenden Klasse.

Vorteile

- gekapselter (also austauschbarer) Konstruktionsprozess
- Default-Implementierungen möglich
- kann sicherstellen, dass immer ein Objekt zurückgegeben wird

Nachteile

- enge Kopplung an das zu erstellende Produkt

### 4.2 Struktur

Im Folgenden die wichtigsten Struktur Patterns:

#### 4.2.1 Adapter

Das **Adapter Pattern** macht die Anpassung einer Schnittstelle an eine von Clients erwartete Schnittstelle. Das lässt Klassen zusammenarbeiten, die dazu sonst nicht in der Lage wären.

Vorteile

- Nutzung vorhandener Bibliotheken ohne sich an deren Schnittstelle anpassen zu müssen
- Entkoppelung von den Details vorhandener Komponenten
- Austausch der Schnittstelle im Adapter einfach möglich
- einzige Abhängigkeit ist Erzeugung des Adapters

Nachteile

- Zusätzliche Delegation, Performance-Verlust
- scheinbar banale Operationen (z.B. sortieren einer Liste) können unerwartet teuer sein, da Datenstruktur im Hintergrund verborgen ist

#### 4.2.2 Decorator

Beim **Decorator Pattern** werden dynamische Ergänzungen um Funktionalität vorgenommen, ohne die Komponente dabei zu ändern.

Vorteile

- Komposition statt Vererbung → flexiblere Klassen, Modifikation zur Laufzeit
- Komponenten kennen Decorator nicht

Nachteile

- Eventuell wenig übersichtlich bei vielen ähnlich aussehenden Klassen

#### 4.2.3 Facade

Das **Facade Pattern** dient dem vereinfachten Zugriff auf ein komplexes Subsystem oder eine Menge zusammengehöriger Objekte.

Vorteile

- Entkoppelung der Clients von den Details des Subsystems

Nachteile

- kann umgangen werden, da in der Regel nur organisatorisches Mittel, nicht technisches
- Anpassung der Fassade bei Änderung interner Schnittstellen notwendig

### 4.3 Verhalten

Im Folgenden die wichtigsten Verhalten Patterns:

#### 4.3.1 Null Object

Das **Null Object Pattern** umfasst ein Objekt, das "nichts" tut, was aber fachlich und gewollt ist.

Vorteile

- Verzicht auf Abfragen bzw. Exception-Behandlung
- Konzentration auf Fachlogik
- Code wird leserlicher

Nachteile

- erheblicher Aufwand bei nachträglicher Umsetzung

#### 4.3.2 Template Method

Das **Template Method Pattern** beinhaltet die Struktur eines Algorithmus, wobei einzelne, konkrete Schritte in Unterklassen verlagert werden. Operationen können dabei überschrieben werden, ohne die Struktur des Algorithmus zu ändern.

Vorteile

- "invertierter Kontrollfluss": Aufruf der Operationen aus der Unterklasse und nicht umgekehrt $\rightarrow$ wichtige Grundlage für Wiederverwendung

## 5 Komponenten

Merkmale einer **Komponente**:

- importiert und exportiert **Schnittstellen**
- verbirgt Implementierung
- wiederverwendbar
- kann andere Komponenten enthalten
- **optional**: Versionsnummer, Auslieferungseinheit

Inhalt:

- Klassen, Interfaces, Datentypen
- Ressourcen (Bilder, Texte, etc.)
- Metadaten (Beschreibung, Version)

### 5.1 Umsetzung in Java

- **Module** mit strikter Zugriffsbeschränkung (OSGi / Java Jigsaw)
- **Simple JAR Files**
- **Java Enterprise Beans**
- **Spring Components**, Beans
- Custom-made **Plugin System** (z.B. Jenkins)

### 5.2 Komponentendesign

Das Komponentendesign kann statisch oder dynamisch sein und definiert die Struktur der Elemente innerhalb einer Komponente.

Wie bei Interfaces wird eine äußere und eine innere Ebene spezifiziert. Nach außen die Schnittstellen und Beziehungen zu anderen Komponenten. Nach innen die zentralen Klassen und Beziehungen der Klassen untereinander.

Grundsätze:

- **Information Hiding**
  - Zugriff über Interfaces
  - Daten nur als Kopien herausgeben (Transferobjekte)
  - keine Vererbung über Komponentengrenzen
- **Designentscheidungen**
  - Services der Schnittstellen
  - Welche Komponente welche Entitäten verwaltet
  - Wo und wie Fachdaten exportiert werden können
- **Kreativität** ist wichtig!

## 6 Komponentenstrukturierung

Aufteilung eines Systems in Komponenten anhand bestimmter Kriterien:

- **Separation of Concerns**
  - Gruppierung **nach Verantwortlichkeiten**
  - Unterscheidung in fachliches, technisches, und Mischungen
- **Blutgruppen**
  - siehe Unterkapitel 6.1 Blutgruppen
- **Kohäsion**
  - Zusammenfassung nach **inhaltlichem Zusammenhang**
  - Bringe zusammen, was zusammen gehört $\rightarrow$ möglichst hohe **Kohäsion**
- **Kopplung**
  - Ziel: **Minimierung der Abhängigkeiten** und möglichst lose Kopplung
  - Kopplung durch: Vererbung, Instanziierung, Parameter, Attribute, Exceptions, Annotationen, etc.
  - in Java über **Imports** sichtbar
  - zusätzlich Kopplung durch
    - **Datenstrukturen**: Datenbank-Tabellen, REST-Schnittstellen, Datei-Formate
    - **Hardware oder Laufzeitumgebung**: gleiche virtuelle Maschine, gleiches Netzwerksegment
    - **Zeit**: Reihenfolge, Laufzeit
  - **enge Kopplung** (objektorientiert): arbeitet mit Objektreferenzen
  - **lose Kopplung** (dienstorientiert): arbeitet mit Werten
- **Conway’s Law**
  - Beeinflusst durch **Organisation eines Unternehmens**, also fachliche/technische Abteilungen, Standorte
- **Common-Closure Principle (CCP)**
  - Zusammengehörigkeit auf Basis **gemeinsamer Änderungen**
  - was typischerweise gemeinsam geändert wird, gehört zusammen
  - Folge von Single Responsibility Principle und Open Closed Principle
- **Reuse-Release-Equivalence Principle (REP)**
  - Zusammengehörigkeit auf Basis **gemeinsamer Release Zeitpunkte**
  - wenn gemeinsam in ein Release gebündelt werden kann
- **Common-Reuse Principle (CRP)**
  - was **gemeinsam verwendet** wird, kommt in eine Komponente
  - umgekehrt: eine andere Komponente sollte möglichst alle Bausteine der Komponente nutzen
  - Verallgemeinerung des Interface Segregaion Principle
  - Beispiel: Container und zugehörige Iteratoren

### 6.1 Blutgruppen

Blutgruppen lassen sich auf Johannes Siedersleben, sd&m, 2004, zurückführen. Dabei wird Anwendung von Technik getrennt. Anwendungscode sollte möglichst nie technischen Code referenzieren. Vermischungen verschlechtern Wartbarkeit, Erweiterbarkeit und Wiederverwendbarkeit.

- **0-Komponente**
  - unabhängig von Anwendung und Technik
  - widerverwendbar
  - alleine genommen nutzlos
- **A-Komponente**
  - nur Anwendungslogik
  - ganz oder teilweise wiederverwendbar
- **T-Komponente**
  - nur Technik
  - manchmal wiederverwendbar
- **AT-Komponente**
  - Anwendungslogik und Technik
  - schwer wartbar und kaum wiederverwendbar
  - verletzt das Single Responsibility Principle

Ein **Adapter** kann hier helfen

- neue Blutgruppe R
- Transformation zwischen zwei Repräsentationen
- kann oft generiert werden

## 7 Systemarchitektur

Eine Systemarchitektur beschreibt die physische Verteilung einer Anwendung.

- über mehrere Rechner hinweg, kein gemeinsamer Speicher, sondern Nachrichtenaustausch
- aus Sicht des Anwenders “ein System”
- welche Komponente wo läuft und welche Aufgabe übernimmt
- wie die Kommunikation abläuft und was bei einem Teilausfall passiert

### 7.1 Client Server Architektur

- viele Clients, einige wenige Server, synchrone Kommunikation
- verbreitet bei verteilter Nutzung gemeinsamer Daten
- Datenhaltung beim Server, Präsentation bei den Clients, Aufteilung der Logik
- Lastverteilung über Partitionierung oder Replikation
- Klassisch 3-Tier (Client, Anwendung, Datenhaltung), Erweiterung um zusätzliche Schichten mögich: Webserver, Reverse Proxy, Load Balancer, Datawarehouse, SAP, ...

### 7.2 Coordinator Worker Architektur

Koordination der Abarbeitung durch eine Komponente.

- eigentliche Arbeit durch **Reihe gleichartiger Komponenten**
- **asymmetrische Arbeitsteilung**: ein Coordinator, viele Worker
- Sonderfall **"Leader Election"**: Coordinator wird unter gleichartigen Knoten gewählt, bei Ausfall übernimmt ein anderer
- sehr verbreitet
  - beliebige Skalierung möglich $\rightarrow$ Verteilung rechenintensiver Aufgaben
  - **Ausfallsicherung**: Replika springen bei Bedarf ein
- Anwendung in Jenkins

### 7.3 Peer-to-Peer Architektur

Gleichberechtigte Knoten sind über ein Netz verbunden.

- gleichartige Dienste
- symmetrische Arbeitsteilung: bidirektionale Kommunikation, verschieden leistungsstarke Peers, sowohl Anbieter als auch Nutzer
- vor allem bei gemeinsamer Ressourcennutzung
- höchste Ausfallsicherheit, da kein **single point of failure**
- **Aber**: Sicherheit der verarbeiteten Daten nur schwer zu gewährleisten (keine Kontrolle)

### 7.4 Batch-Verarbeitung

Auch "Stapelverarbeitung" genannt.

- Standard bei Verarbeitung großer Datenmengen
  - bspw. zum Quartalsende die Quartalsdaten
  - langlaufende Jobs
  - stoppen und fortsetzen möglich
- u.a. Spring Batch

### 7.5 Pipes und Filter

- Verarbeitung auf unabhängigen Knoten (Transformation Eingabe zu Ausgabe)
- Schritte relativ unabhängig voneinander
- Geschwindigkeit höngt am langsamsten Schritt, aber Skalierung der einzelnen Filter leicht möglich

### 7.6 Reactive Streams

- keine Verarbeitung der Daten als Ganzes, Datenteile sollen sofort verarbeitet werden
- **Beispiel**: Video Streaming (asynchrone Streams)
- Pull- oder Push-Ansatz (bei Push steuert ein Processor die Auslastung)
- **Problem**: Überlauf, wenn zu schnell gesendet wird
- **Reactive Streams in Java**: Steuerung der Austauschgeschwindigkeit, verhindert Blockierung und benötigt keine Pufferung auf Quell-Seite

### 7.7 Service Oriented Architecture

Service Bus als standardisierte Schnittstelle, die heterogene Landschaften miteinander verbindet, Verschlüsselung vorgibt und ein Dienstverzeichnis verwaltet.

- Kapselung der Services
- lose Kopplung über (XML) Schnittstellen
- Kopplung im Service Bus

### 7.8 Cloud Computing und Microservices

- kleine, abgegrenzte Dienste, die unabhängig skaliert werden können
- "Service Discovery" als eigener Dienst
- individuelle Datenhaltungen statt zentralem DB-Server
- Containerisierung und Kommunikation über leichtgewichtiges Protokoll (z.B. HTTP)
- Anpassungen zur Laufzeit möglich: Auslieferung automatisiert über CD, Austausch von
Services, einfache Auslagerung möglich
- Das Produkt steht im Vordergrund und wird über den gesamten Lebenszyklus betreut
- Verringerung der Abhängigkeiten

## 8 Architekturtests

Statische Analyse ist ein Teilbereich der Statischen Tests (Tests ohne Programmausführung). Statische Analyse mittels:

- **Compiler & IDE**: Warnungen
- **ErrorProne, CheckStyle, PMD, SpotBugs**: Verletzung von Richtlinien, typische Bugs
- **AnimalSniffer**: keine verbotenen APIs (Kompatibilität zu älteren Java-Versionen)
- **Maven Enforcer**: unverträgliche Abhängigkeiten
- **OWASP Dependency-Check**: Sicherheitslücken
- **RevApi**: Abwärtskompatibilität von APIs
- **ArchUnit**: Design- und Architekturrichtlinien

Prüfbare Elemente (nach Carola Lilienthal: "Langlebige Softwarearchitekturen"):

- **Modularität**: Klassen und Komponenten
- **Hierarchische Struktur**: Schichten und Verantwortung
- **Muster Konsistenz**: Klassentypen und Lösungstypen

Varianten zur Prüfung:

- Manuelle Reviews
- Manuelle Werkzeuge der IDE (Structure101, JArchitect)
- Automatisierte statische Code Analyse Tools
  - mit Source Code: CheckStyle und PMD
  - mit Byte Code: ErrorProne und SpotBugs
- Automatisierte Testfälle (Jenkins, ArchUnit)

### 8.1 ArchUnit

Validierung der Architektur über Testfälle in JUnit 5.

- umfassende vordefinierte Funktionalität
  - Layering
  - verbotene Aufrufe
  - Sicherheitsrichtlinien, Konventionen, Information Hiding
  - vordefinierte Regeln
    - Nur Java Logging
    - Kein Joda Time
    - Keine generischen Exceptions
    - Kein Präfix oder Suffix bei Interfaces
    - Schichten- oder Zwiebelarchitektur
    - Abhängigkeiten
    - Vererbungsstruktur
    - Nutzung von Annotationen
    - Sichtbarkeiten
- einlesen relevanter Klassen und ausführen gewünschter Regeln über Fluent API
- Aufbau der Architekturregeln (**Element** that **Predicate** should **Condition**)
  - **Element**: Klassen, Methoden, Attribute, etc.
  - **Prädikat**: Filterung der Menge an Elementen
  - **Bedingung**: gewünschte Kriterien
  - Prädikate und Bedingungen sind wiederverwendbar
- Weitere Features
  - **Freezing Rules**: bestehender Code wird eingefroren, aber neuer Code muss konform sein
  - **Architektur-Metriken**
  - **sprechende Fehlermeldungen**
  - **Ignore List** mit erlaubten Verstößen
