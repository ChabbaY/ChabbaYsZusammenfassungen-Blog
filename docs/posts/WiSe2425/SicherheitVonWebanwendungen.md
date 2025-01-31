---
date: 2025-01-28
author: Linus Englert
timeline: false
article: false
---

# Sicherheit von Webanwendungen

## Grundlagen

- Authentifizierung
  - Nachweis der Identität durch den Server
- Verschlüsselung
  - Von Klartext zu Ciphertext durch Cipher / Chiffre, symmetrisch oder asymmetrisch, umkehrbar
- kryptografische Prüfsumme
  - Synonym für Hash
- Sicherheitsziele
  - CIA: Confidentiality, Integrity, Availability; Privatheit; Authentizität; Verbindlichkeit / Nichtabstreitbarkeit
- Härtung
  - Verbesserung der Resilienz eines Systems
- Passwörter
  - gehasht gespeichert, gesalzen, Übertragung im Klartext
- Zertifikate
  - asymmetrische Kryptografie, Nachweis der Echtheit, Baumstruktur mit Root CA
- Angriffswerkzeuge bei Webanwendungen
  - ZAP, burp, hydra, john the ripper, cupps
- OWASP TOP 10
  - neues Ranking erste Hälfte von 2025
  - Ergebnis von 2021:
    1. Broken Access Control
    2. Cryptographic Failures
    3. Injection
    4. Insecure Design
    5. Security Misconfiguration
    6. Vulnerable and Outdated Components
    7. Identification and Authentication Failures
    8. Software and Data Integrity Failures
    9. Security Logging and Monitoring Failures
    10. Server Side Request Forgery

### HTTP (Hypertext Transfer Protocol)

Bestandteile eines HTTP Requests

- **Methode** (GET, POST, PUT, DELETE, HEAD, PATCH)
- **URL** (Uniform Resource Locator)
  - Protokoll (http / https)
  - Host
  - Port (sonst 80 / 443)
  - Verzeichnis
  - Ressource
  - Parameter (? ... & ...)
  - Anker (#)
- Protokoll **Version** (z.B. HTTP/1.1)
- **Headers** (Host, User-Agent, Accept, ...)
- **Body** (optional) nach einer Leerzeile

Bestandteile der HTTP Response

- Version
- Status
- Status-Nachricht
- Headers
- Body nach einer Leerzeile

### HTML (Hypertext Markup Language)

markiert und attributiert Bestandteile eines Dokuments, Darstellung durch Browser

Baumstruktur durch Schachtelung der Tags $\rightarrow$ **DOM** (Document Object Model)

- **Programmierschnittstelle** für Manipulation der Seite
  - Animationen
  - Rich Internet Applications
  - browserunabhängig, in Skriptsprachen integriert

### Web-Browser

Client-Programm für die Darstellung von Webseiten / Webanwendungen

Basiert in der Regel auf Chromium oder Firefox

![Aufbau Browser](img/aufbau-browser.png)

- **User Interface**: Menüleiste und Navigation
- **Browser Engine**: Koordination zwischen UI und Rendering Engine
- **Rendering Engine**: Parsing von HTML und CSS $\rightarrow$ Darstellung
- **Data Storage**: Persistierung (z.B. Cookies)
- **UI Backend**: benutzt Methoden des OS
- **JavaScript Interpreter**: kann JavaScript ausführen
- **Networking**: Kommunikation über das Internet

### Web-Anwendung

Software, die auf einem Webserver ausgeführt wird und auf Benutzereingaben (HTTP) dynamisch reagiert

Angreifbar sind sowohl Client-Anwendung als auch Kommunikation und Server-Anwendung

## 01 Broken Access Control

Fehlerhafte **Autorisierung** (Konfiguration oder Code der Authentifizierung)

Beinhaltet ehemalige Kategorien **Insecure Direct Object References** und **Missing Function Level Access Control**

### Direct Object References

- Referenz durch Pfad nach außen sichtbar
- Referenz kann manipuliert werden
- Dadurch möglicherweise Zugriff auf Objekt, für das der Anwender keine Rechte hat
- Jeder Zugriff auf direkte Objektreferenzen MUSS eine Überprüfung der Autorisierung beinhalten

### Access Control

- **Role-based Access Control** (RBAC)
  - zugewiesene Rollen $\rightarrow$ daraus Berechtigungen
- **Attribute-based Access Control** (ABAC)
  - zugewiesene Policies $\rightarrow$ beinhalten Attribute $\rightarrow$ Evaluation über Bool'sche Berechnung
  - auch "policy-based" (PBAC) oder "claims-based" (CBAC)

### Angriffsmöglichkeiten von Access Control

- Directory Traversal
  - **Local File**: durch bspw. "../" o.ä. wird eine lokale Datei wie /etc/passwd eingebunden
  - **Remote File**: eine potenziell schädliche Datei wird als Parameter übergeben
  - **Environment Discovery**: Rückschluss auf Netzwerkstruktur
  - **Show Source Code**: Rückschluss auf Quelltext
- URL Encoding und Double URL Encoding
  - "../" als "%2e%2e%2f"
- Unicode /UTF-8 Encoding
  - "../" als "..%c0%af"
- Forced Browsing (bruteforce)
  - Testen von "Standard"-Verzeichnissen

### Schutzmechanismen bei Access Control

- **DRY** (don't repeat yourself): einmalige Implementierung + Vererbung
- konfigurierbare Rollen
- nur anzeigen, worauf zugegriffen werden kann
- OWASP "Guide to Authorization":
  1. regelmäßig Rechte **neu testen** oder Benutzer abmelden
  2. **Least Privilege**: so wenige Rechte wie möglich, so viele Rechte wie nötig
  3. **Zentralisierte Autorisierung**: <ins>eine</ins> Schnittstelle
  4. Zugangskontrolle bei geschützten Ressourcen: nicht nur prüfen ob Aktion erlaubt, sondern auch ob Zugriff erlaubt
  5. Auch Zugriff auf statische Ressourcen schützen: z.B. zufälliger Datei- oder Ordnername
  6. Reautorisierung oder sogar Reauthentifizierung bei wichtigen Aktionen
  7. Geeignetes **Framework** nutzen, kein eigener Code
  8. **Session Management** beachten, Autorisierung an Session koppeln

### 08/2013 Cross Site Request Forgery

Angreifer erzeugt gefälschten HTTP Request, der von Opfer übermittelt wird (Image Tags, XSS, ...)

Wenn der Nutzer angemeldet ist, können Aktionen in dessen Namen ausgeführt werden:

- Logout
- Nachricht senden
- Nutzer anlegen / löschen
- Passwortänderung
- Transfer von Geld / Daten

#### Mögliche Verwundbarkeitstests

- **Black Box Test**: Nachstellung eines Angriffs mit zwei Accounts
- **Gray Box Test**: Werden nur Browserdaten (z.B. Cookies) für Authentifizierung / Autorisierung benötigt?

#### Gegenmaßnahmen gegen CSRF

- **Synchronizer Token** (auch CSRF Token)
  - zufälliges Token für Benutzer-Session
  - wird Formularen als "hidden" Parameter hinzugefügt
  - HTTP Request muss Token beinhalten
  - Server muss Token prüfen
  - **Problem**: kann wegen GET-Request in Browser Historie auftauchen
- **Double Submit Cookie**
  - kryptografisch stark zufällig
  - Cookie und "hidden" Parameter
  - Server kann Wert berechnen
  - Angreifer kann Cookie nicht auslesen
- **Encrypted Token Pattern**
  - Verschlüsselung von Informationen und Zufallswert (**NONCE**)
  - Nutzer muss dies zurück übermitteln
  - Server kann entschlüsseln und prüfen $\rightarrow$ UserID und Timestamp sollten als Schutz vor **Replay Angriffen** geprüft werden
- **Custom Request Headers** (REST Services)
  - eigener Header, z.B. X-Requested-With: XMLHttpRequest
  - Same-Origin Policy
    - nur JavaScript in der selben Domain (Same-Origin) könnte den Header hinzufügen
    - Browser verbietet JavaScript über verschiedene Domains standardmäßig
  - eingeschränkt empfohlen
- **SameSite** Cookie Attribut
  - Verhindert Zugriff auf Cookie bei CSRF
- **HttpOnly** Attribut
  - Verhindert Zugriff mit JavaScript, eingeschränkte Wirksamkeit
- **Challenge Response**
  - individuelle "Aufgabe", Lösung durch Client: CAPTCHA, Re-Authentication, One-Time-Token
  - sehr wirkungsvoll, aber weder benutzerfreundlich noch barrierefrei
- Maßnahmen des **Benutzers**
  - Logout verwenden
  - keine Anmeldedaten im Browser speichern
  - keine Anmeldedaten in Seite speichern
  - ggf. mehrere Browser für verschiedene Sicherheitslevel
  - Deaktivierung von JavaScript im Browser

## 02 Cryptographic Failures

Unbeabsichtigte Offenlegung vertraulicher Informationen: Passwörter, personenbezogene Daten, Finanzdaten

- **Kein Schutz**
  - Speicherung im Klartext
  - Verschlüsselte Speicherung aber Entschlüsselung bei jedem Zugriff (SQLI)
  - Übertragung im Klartext (auch durch Downgrade-Attacke)
  - Ungeschütztes Backup
- **Kein ausreichender Schutz**
  - Passwort-Hashes ohne Salz
  - Verwendung schwacher Krypto-Algorithmen

### Gegenmaßnahmen gegen Cryptographic Failures

- Geeignete Speicherung: vertrauliche Daten **verschlüsselt** bzw. Passwörter **gehasht** (und gesalzen)
- Reduzierung der gespeicherten vertraulichen Daten $\rightarrow$ "Data you don't have can't be stolen"
- Falls möglich: **Hardware-Sicherheitsmodul** (HSM)verwenden
- Starke Passwörter erzwingen
- Keine Auto-Vervollständigung sensitiver Informationen

### Sichere kryptographische Speicherung

Nach OWASP "Cryptographic Storage Cheat Sheet"

- 1: **nur benötigte** Daten speichern
- 2: Verwendung **starker** kryptografischer Algorithmen
  - AES, RSA, SHA-256, CCM, GCM
  - <ins>NICHT</ins>: MD5, SHA1
  - kann sich ändern, auf Empfehlungen des BSI achten
  - Seed muss genügend **Entropie** haben
  - nur bekannte und anerkannte Implementierungen verwenden
- 3: Passwörter in **mehreren Iterationen** hashen und salzen
  - pbkdf2, bcrypt, scrypt, argon2
- 4: **Sicherheit** muss **immer gewährleistet** sein (principle of defense in depth)
  - verschiedene Layer von Security
- 5: Geheime **Schlüssel** vor unbefugtem Zugriff **schützen**
  - Key Lifecycle (regelmäßiges Rekeying, max. nach einem Jahr "umschlüsseln")
  - nicht am selben Ort wie Daten speichern
  - bei mehreren Schlüsseln: Unabhängigkeit
  - an sicherem Ort
  - Menge pro Schlüssel limitieren
  - Prozedur bei kompromittiertem Schlüssel dokumentieren

### Verwendung von SSL / TLS (by Design)

Nach OWASP "Transport Layer Protection Cheat Sheet"

- 1: für **alle Seiten** aktivieren
- 2: bei vertraulichen Daten auch in internen Netzen
- 3: wenn SSL / TLS zur Verfügung steht, dann **erzwingen**
- 4: ausschließlich Inhalte über SSL / TLS einbinden
- 5: **Secure Cookie Flag** verwenden: Übertragung nur per SSL / TLS
- 6: keine sensitiven Daten **in URLs**
- 7: **Kein Caching** sensitiver Daten
- 8: **HTTP Strict Transport Security** (HSTS) nutzen
  - erzwungenes https
  - ungültige Zertifikate können nicht akzeptiert werden

#### Certificate Transparency (CT)

- unveränderbares Logfile, das alle ausgestellten **Zertifikate** einer **CA** (Certificate Authority) enthält

#### Certificate Authority Authorization (CAA)

- **DNS-Eintrag**, wer zu einer Domäne Zertifikate erstellen darf

#### SSL / TLS Server-Zertifikate

- nur geschützte, **starke Schlüssel**
- **geeignete CA** verwenden
- Fully Qualified Domain Names (**FQDN**) in DNS verwenden
- keine Wildcard-Zertifikate (Verstoß gegen "least privilege principle")
- keine lokalen IP-Adressen als FQDN oder Subject Alternate Names (SAN) verwenden
- alle benötigten Zertifikate zur Validierung sollen ausgeliefert werden

#### SSL / TLS Protokolle und Chiffren

- nur kryptografisch **starke Protokolle** & Chiffren bzw. **Cipher Suites** (Kombination kryptographischer Verfahren) verwenden
  - AES, 3-key 3DES, CBC mode
  - AES/CTR
  - SHA2
  - Ephemeral Diffie-Hellman für Schlüsselaustausch
- <ins>NICHT</ins>:
  - Cipher Suites ohne Authentication (NULL, aNULL, eNULL)
  - Anonymous Diffie-Hellman (ADH)
  - Export Level Cipher (EXP)
  - Schlüssellänge < 128 Bit
  - MD5
- flüchtige Session-Keys verwenden $\rightarrow$ **Perfect Forward Secrecy** (PFS)
- Schwächen des TLS vermeiden
  - Kompression abschalten (exploitbar)
  - TLS Renegotiation abschalten bzw. Secure Renegotiation verwenden (expolitbar)
- aktuelle Versionen verwenden

## 03 Injection-Angriffe

Umfasst seit 2021 auch Cross Site Scripting (XSS)

- **SQL Injection**
- Format String
- Command Injection
- Log Injection
- Reflection Injection
- Interpreter Injection
- **eXternal XML Entities** ($\rightarrow$ Security Misconfiguration)
- XSS (**stored, reflected, dom-based, mutated**)

### SQL Injection

Wenn dynamische Datenbank-Abfrage mit (ungeprüfter) Benutzereingabe gebildet wird

- kann Logik der Abfrage ändern
- kann Datenbank beschädigen (Inhalte löschen) oder vertrauliche Daten preisgeben

#### Beispiele

- `'` $\rightarrow$ Fehler 500 (Syntaxfehler wegen zusätzlichem Anführungszeichen) $\rightarrow$ verwundbar für SQL Injection
- `' OR 'x'='x` $\rightarrow$ kann bei einem SELECT alle Elemente selektieren
- `' AND email IS NULL;--` $\rightarrow$ wird nie wahr, aber falls kein Fehler 500 kommt existiert das Feld, hier _email_
- `' AND 1=(SELECT COUNT(*) FROM tabname);--` oder `' AND member.email is NULL` $\rightarrow$ ebenfalls Erraten eines Feldnamen
- `' OR full_name LIKE '%Alice%` $\rightarrow$ Überprüfung auf teilweise Übereinstimmung
- `alice@example.com' AND passwd='geraten` $\rightarrow$ Erraten eines Passworts
- `'; DROP TABLE members; --` $\rightarrow$ beliebiges eigenes Statement durch Konkatenation
- **UNION ALL**: Vereinigung anderer Tabelle, auch mit unterschiedlichen Datentypen, lediglich Spaltenanzahl muss gleich sein
- **LOAD_FILE()**: kann lokale Datei ausgeben, wenn diese für alle Benutzer lesbar ist
- **INTO OUTFILE()**: schreibt Ergebnis in Datei, Verzeichnis muss schreibbar sein
- **LIMIT** position, anzahl: auch wenn nur das erste Element gezeigt wird, ist Iteration möglich

#### Blind SQL Injection

- **Partially Blind Injection**: leicht abweichendes Verhalten bei Erfolg / Misserfolg
- **Totally Blind Injection**: kein Unterschied in Ausgabe, Erfolg nur schwer feststellbar

Hier kann das Zeitverhalten ausgenutzt werden

- MySQL:

```sql
UNION ALL SELECT BENCHMARK(1000000, MD5(CHAR(118)))
```

- MSSQL:

```sql
WAITFOR DELAY '0:0:10'--
```

- PostgreSQL:

```sql
SELECT pg_sleep(10);
```

#### Vermeidung von SQL Injection

- **Safe API** / ORM Tools
  - parametrisiertes Interface oder objektrelationales Mapping
- **Server Side Input Validation** (Whitelisting)
  - nicht immer möglich
  - gut geeignet für strukturierte Daten wie E-Mail-Adressen oder Telefonnummern
- **Prepared Statements** (Parameterized Queries)
  - Platzhalter werden validiert und befüllt
  - Unterschied zwischen Code und Daten klar sichtbar
  - können anfällig sein
- **Stored Procedures**
  - Vorkompilierter Code in Datenbank
  - Lediglich Übergabe von Funktionsname und Parametern, auch hier Unterschied zwischen Code und Daten klar
  - können anfällig sein, wenn dynamisches SQL erzeugt wird
- **Escaping** von Benutzereingaben
  - nur für Legacy Code wenn Änderung zu aufwendig oder Performance Probleme
  - vorhandene Bibliotheken nutzen, da Implementierung sehr schwierig

Zusätzlich sollte das **Least Privilege Principle** angewandt werden: nur minimale Rechte vergeben um möglichen Schaden zu begrenzen

### 07/2017 Cross Site Scripting

Gefährdung wenn Input (von Benutzer oder Datenbank) in dynamische Inhalte eingebunden wird, die an den Browser eines Benutzers gesendet werden

Verschiedene Arten:

- Drive-By
  - **Stored XSS**: feindlicher Code wird permanent auf Server gespeichert (Datenbank, Forum, Kommentare, ...) $\rightarrow$ wird an alle Clients verteilt
- Social Engineering
  - **Reflected XSS**: feindlicher Code wird reflektiert durch Fehlermeldungen, Suchergebnisse, etc.
    - über Link in E-Mail oder anderen Webserver
  - **DOM-based XSS**: Manipulation des DOM beim Opfer $\rightarrow$ Nutzung des originalen Codes auf unbeabsichtigte Weise
    - im Gegensatz zu Stored / Reflected lediglich Änderungen im Client
- **Mutation XSS** (mXSS)

#### Gegenmaßnahmen zu Stored / Reflected XSS

- nie nicht-vertrauenswürdige Daten einfügen (außer erlaubte Bereiche)
- **Escaping** von User Input
- **HTML Policy Engine**: Bereinigung von User Input

#### Gegenmaßnahmen zu DOM-based XSS

- Encoding und dessen Reihenfolge beachten
- Vorsichtiges Vorgehen beim Einfügen von JavaScript
- nicht-vertrauenswürdige Daten immer als darstellbaren Text behandeln
- Vermeidung gefährlicher Methoden wie implizites eval()
  - direktes Setzen von HTML Code: element.innerHTML, document.write(), ...
- Verständnis für Datenfluss

## 04 Insecure Design

Schwachstellen in Architektur und Design $\rightarrow$ **Secure by Design**

- mehr Bedrohungsmodellierung
- sichere Design Patterns
- Verwendung von Referenzarchitekturen

Requirements and Resource Management

- Schutzziele und Exponiertheit von Anwendungen
- Security Requirements & Budget

### Secure Design

Kultur & Methodik für robusten Code

#### Secure Development Lifecycle

- Durchgängiges Involvieren von Security-ExpertInnen
- Library Management & Security Design Patterns
- Unit- und Integrationstests (v.a. für kritische Abläufe)
- Robuste Trennung von Mandanten / Schutzbedarf
- Begrenzung des Ressourcenverbrauchs nach Benutzer / Dienst

### Bedrohungsanalyse

Erfassung von technischen, organisatorischen und benutzerbedingten Bedrohungen in einer **Bedrohungsmatrix** (Gefährdungsbereiche & Auslöser) oder einem **Bedrohungsbaum** (Wurzel als mögliches Angriffsziel, Knoten als Zwischenziele zum Erreichen des Elternknoten, Verknüpfung mit UND bzw. ODER)

#### Klassifikation nach STRIDE

Spoofing Tampering Repudiation Information disclosure Denial of service Elevation of privilege

#### Risikoanalyse

Eintrittswahrscheinlichkeit & Schwere des Schadens

Eintrittswahrscheinlichkeit abhängig von

- Aufwand des Angriffs
- möglicher Nutzen des Angriffs
- mögliches Schadensausmaß
- Fähigkeiten und Risikobereitschaft der Angreifer

Sicherheitsdesigner muss erfinderischer sein als Angreifer

#### Sicherheitsstrategie und -modell

Aus den Ergebnissen der Risikoanalyse, Ermittelung von Maßnahmen zur Abwehr der Bedrohungen

**Design Patterns** für wiederholt auftretende Probleme

### Security Patterns

#### Einzelner Zugriffspunkt

- externer Zugriff auf ein System
- Schutz vor Missbrauch und Schaden im Fokus
- einfach anwendbarer, einzelner Zugriff zum System
- Zugriff kann **erlaubt oder verweigert** werden

#### Check Point

- Erweiterung des Einzelnen Zugriffspunktes
- Erkennen und **Melden von Angriffen**
- legitimer Zugriff soll aber nicht beeinträchtigt werden
- Vorteile
  - konkrete, anpassbare Sicherheitspolicy
  - unabhängige Tests verschiedener Policies
- Nachteile
  - Fehler / Sicherheitslücken in der Implementierung gefährden das gesamte System
  - Erkennung unnatürlichen Nutzerverhaltens oft sehr aufwändig
  - Konfiguration kann sehr aufwändig werden

#### Security Session

- an Benutzer-Session gekoppelte Security Session, die über SessionID referenziert wird
- beinhaltet z.B. Zugriffsberechtigungen
- bei entsprechenden Anfragen wird die Zugriffsberechtigung in der Security Session geprüft
- Vorteile
  - einfacher, spezifischer Zugriffspunkt
  - einfach erweiterbar
  - Caching $\rightarrow$ Performance
- Nachteile
  - Globale Objekte meist unerwünscht
  - Austausch von großen Objekten schwierig: geht auf Performance, muss sicher übertragen werden
  - nachträgliches Hinzufügen zu einem System kann sehr aufwändig sein

#### Vollzugriff mit Fehlern

- Oberfläche stellt alle Funktionalitäten dar (keine versteckten Elemente)
- vor einer Ausführung muss Zugriffsberechtigung geprüft werden
- im Verbotsfall soll eine Fehlermeldung erscheinen (einheitliche Fehlerbehandlung)
- dem Nutzer sollte ersichtlich sein, welche Aktionen erlaubt sind
- Vorteile
  - konsistente Oberfläche
  - einfache Integration
- Nachteile
  - Frustration wenn nicht ganz klar ist, was erlaubt ist
  - aufwendig, weil immer geprüft werden muss
  - Oberfläche kann aufgebläht wirken

#### Begrenzter Zugriff

Gegenteil von Vollzugriff mit Fehlern

- nur ausführbare Funktionalität wird angezeigt
- Vorteile
  - übersichtliche Oberfläche
- Nachteile
  - angepasste Trainings für verschiedene Nutzerkreise
  - Implementierung der Zugriffsberechtigung in der Oberfläche vergrößert den Angriffsvektor

### Sicherheit in Internet Anwendungen

#### Information Obscurity

- Verschleierung sensitiver Daten: Versionsnummer, geöffnete Ports, ...
- wenn möglich ohne Verschlüsselung (Zeitfaktor)
- nach Wichtigkeit klassifizieren und wichtigste Daten verschlüsseln
- Vorteile
  - Erhöhung der Informationssicherheit
  - wichtige Daten für einen Angriff sind nur schwer identifizierbar
- Nachteile
  - Beeinträchtigung der Performance
  - schlechtere Wartbarkeit
  - aufwändigere Programmierung

#### Sichere Kanäle

Sichere Kanäle für kritische Daten, damit diese nicht ausspioniert werden können

- Verschlüsselung ist starker Overhead
- Vorteile
  - ohne weitere Kenntnisse sind mitgelesene Daten nutzlos
  - Schlüsselaustausch-Verfahren ermöglichen eine sichere Verbindung, wenn sich Gesprächspartner nicht kennen
- Nachteile
  - kostet Performance
  - kann Verfügbarkeit einschränken
  - erhöhte Instandhaltungskosten

#### Known Partners

Beide Gesprächspartner können sich gegenseitig eindeutig identifizieren

- Schutz vor Identitätsdiebstahl
- gegenseitiger Nachweis, Kommunikation über sichere Kanäle
- Vorteile
  - dem system ist bekannt, wer agiert
  - der Nutzer kann das System eindeutig erkennen und Fälschungen identifizieren
- Nachteile
  - schlechtere Performance
  - schlechtere Wartbarkeit
  - Verfügbarkeit kann beeinträchtigt sein

#### Demilitarisierte Zone (DMZ)

Trennt Business Funktionalität von Webservern, welche diese ausliefern

- reduziert die Angriffsfläche
- erschwert das unerlaubte Eindringen in ein System
- Vorteile
  - weniger Systeme können direkt angegriffen werden
- Nachteile
  - Firewall als "Single Point of Failure"
  - höhere Wartungskosten
  - kann Performance beeinträchtigen

#### Protection Reverse Proxy

Schützt eine Anwendung auf Software Protokoll Ebene

- Vorteile
  - macht es schwerer Schwachstellen im Backend Server direkt auszunutzen
  - einfacheres Patchmanagement, da nur eine Maschine mit dem Internet verbunden ist
- Nachteile
  - Block List Filter können trügerische Sicherheit darstellen
  - Allow List Filter schränken in der Regel erheblich ein
  - "Single Point of Failure"

#### Integration Reverse Proxy

Homogene Sicht auf verteilte Systeme einer Domäne

- Vorteile
  - ein Server, eine IP-Adresse
  - einfache Erweiterung möglich
  - Load Balancing möglich
  - zentralisiertes Logging möglich
- Nachteile
  - "Single Point of Failure"
  - Beschränkung max. paralleler Verbindungen
  - Schwierigkeit: Session-Management

#### Front Door

Idealer Einstiegspunkt für Authentifizierung / Autorisierung, ebenfalls ein Reverse Proxy

- Vorteile
  - "Single Sign On" möglich
  - ein Benutzerprofil für diverse Backend Anwendungen
  - Backend Server müssen sich nicht um Authentifizierung kümmern
  - ermöglicht zentralisiertes Logging
- Nachteile
  - Inkonsistenzen möglich wenn bestimmte zusätzliche Nutzerdaten auf Backend Servern gespeichert werden müssen
  - verschiedene Richtlinien / Vorgaben müssen unter einen Hut gebracht werden

## 05 Security Misconfiguration

Robuste Konfiguration dämmt Auswirkungen erfolgreicher Angriffe ein ("least privilege")

Umfasst

- Anwendungen
- Frameworks
- Web Server
- Datenbank Server
- Plattform

und regelmäßiges Patchen

Beinhaltet seit 2021 auch XML eXternal Entities (XXE)

### Sichere Konfiguration

- keine unnötige Veröffentlichung interner Informationen
  - Fehlerausgabe
  - Versionsnummer
  - Banner
- Default Accounts deaktivieren
- Frameworks beachten
- feingranulare Rechte, möglichst eingeschränkt ("least privilege")
- Security Guide berücksichtigen
- Logging aktivieren
- Sichere Speicherung von Passwörtern

#### Sichere Konfiguration von Webservern

- Zugriffsrechte des Web-Server Nutzer-Accounts beschränken
- Fehlerausgaben minimieren bzw. verallgemeinern
- Programme und Daten in verschiedenen Verzeichnissen (heute nicht mehr so wichtig)
- geeignete Protokollierung

#### Sichere Konfiguration von Datenbankservern

- nicht mit DB-Admin arbeiten
  - eigener Account pro Anwendung
- DB-Admin Passwort setzen
- wo möglich nur Zugriff über localhost
- Zugriff auf Systemtabellen begrenzen / verbieten

### XML eXternal Entities (XXE)

XML-Format wird für Datenaustausch verwendet

Schwachstelle, wenn XML ungeprüft vom Server ausgewertet wird

**XML Entitäten** werden in **Document Type Declaration** (DTD) als Tags definiert

- **Classic**: external Entity wird in lokales DTD eingefügt
- **Blind**: keine Ausgabe oder Error Message
- **Error**: gewünschten Inhalt in Error Message erhalten

Typen von Entitäten

- **General Entities**

```xml
<!ENTITY name "Hello World">
```

- **Parameter Entities** (können weitere Entities enthalten)

```xml
<!ENTITY % name "Hello World">
<!ENTITY % name "Hello %myEntity;">
```

- **External Entities** (können externe Ressourcen einbinden, auch im DOCTYPE möglich)

```xml
<!ENTITY name SYSTEM "URI/URL">
<!ENTITY name PUBLIC "any_text" "URI/URL">
<!DOCTYPE name SYSTEM "address.dtd" [...]>
<!DOCTYPE name PUBLIC "any_text" "http://evil.com/evil.dtd">
```

Beispiel (Definition und Zugriff auf eine Entität):

```xml
<?xml version="1.0" standalone="yes" ?>
  <!DOCTYPE author [
    <!ELEMENT author (#PCDATA)>
    <!ENTITY js "Jo Smith">
  ]>

  <author>&js;</author>
```

Beispiel geänderter XML Request für Zugriff auf /etc/passwd:

```xml
<?xml version="1.0" encoding="ISO-8859-1" ?>
  <!DOCTYPE foo [
    <!ELEMENT foo ANY>
    <!ENTITY xxe SYSTEM "file:///etc/passwd">
  ]>

  <foo>&xxe;</foo>
```

#### Schwachstelle bei XML erkennen

- Mit Metacharakteren auf XML Injection testen
  - ', ", <>, \<!--/-->, &, \<![CDATA[ / ]]>
- ein einfaches Beispiel testen
- Tag Injection: Eingabe von XML Tags in Eingabefelder testen

#### Mögliche Auswirkungen von XXE

- Zugriff auf Ressourcen eines lokalen Netzwerks
- Remote Code Execution (eher selten)
- Denial-of-Service (DoS)

#### Gegenmaßnahmen gegen XXE

- DTDs External Entities vollständig deaktivieren
- Alternativ Unterbindung der Auflösung von "External Entities"
- auch die Content-Type und Accept Headers validieren
- Benutzereingaben, die zu XML geparst werden immer server-seitig mit Allowlist validieren
- böswillige Anfragen mit "406/Not Acceptable" beantworten

## 06 Vulnerable and Outdated Components

Software ist nie fehlerfrei

Fehler können aus verwendeten Bibliotheken / Frameworks stammen, oft weil diese nicht aktuell gehalten werden

### Common Vulnerabilty and Exposures (CVE)

Einheitliche Namenskonvention für Schwachstellen, eindeutige Nummer inkl. Jahr

- ID
- Status $\rightarrow$ {Reserved, Disputed, Reject, "active"}
- Kurzbeschreibung
- Referenzen: Reports, Metasploit, ...
- Kritikalität: CVSS Score (Base Score, Temporal Score, Environmental Score)

### Schutzmaßnahmen gegen Vulnerable and Outdated Components

- wenn möglich: keine fremden Komponenten
- regelmäßige Upgrades
- Langzeitsupport (LTS) verwenden
- verwendete Komponenten erfassen & überwachen
- nicht benötigte Funktionalität mittels Wrapper deaktivieren
- regelmäßige Security Tests

### Gateways

Stelle, an der Komponenten aufgenommen werden können: Abweisung, Entfernung und Verwaltung der Komponente muss möglich sein

- **Selection / Consumption**
  - Untersuchung der Herkunft: Lizenzbedingungen, Security, Qualität
  - Check, dass richtige Komponente heruntergeladen
  - Policy, die eine Komponente erfüllen muss (Updates, Umgang mit Schwachstellen, Vertrauenswürdigkeit)
- **Integration**
  - unveränderte Übernahme in das Projekt
  - über gesamte Entwicklung Konformität mit Policies prüfen
- **Deployment**
  - im Endprodukt selbe Komponente wie in der Entwicklung
  - fehlerfreie Konfiguration
  - aktive Suche nach Verwundbarkeiten in den verwendeten Komponenten
  - regelmäßige Updates

## 07 Identification and Authorization Failures

Schwachstelle in Authentifikation oder Session Management gefährdet Accounts (insbesondere privilegierte) $\rightarrow$ Passwörter und Session-IDs sind besonders gut zu schützen

### Mögliche Schwachstellen zu Authentifikation und Session Management

- Session ID steht in URL $\rightarrow$ kann versehentlich geteilt werden
- Logout an öffentlichem Ort vergessen und Session Timeout zu hoch
- Angreifer hat Zugang zur Passwort-Datenbank, welche nicht ausreichend geschützt ist

### Möglicher Angriff: Session Fixation

1. Angreifer beschafft gültige Session ID
2. schiebt Session ID Opfer unter
3. Opfer authentifiziert sich
4. Angreifer hat authentifizierte Session

Session ID an das Opfer durch

- Link der Session ID enthält
- gefälschte Login-Seite (dann auch Passwort bekannt)
- XSS und einen Cookie

### Allgemeine Richtlinien zur Authentifizierung

- starke Passwörter erzwingen
- sicheres Passwort-Recovery anbieten (inkl. persönlicher Daten und "geheimer" Fragen, Benutzername nur server-seitig zu Session ID gespeichert, Verwendung zweiter Faktor)
- Multifaktor Authetifizierung verwenden
- Fehlermeldungen generisch halten (zusätzlich zufällige Verzögerung $\rightarrow$ Verhinderung Informationsgewinn)
- Passwörter nur in sicheren Kanälen übermitteln
- bei mehreren erfolglosen Anmeldeversuchen temporär sperren

### Allgemeine Richtlinien zum Session Management

Zustandshaltung mit Zugriffsrechten & Lokalisierung, Pre-Auth oder Post-Auth

- temporär gleichwertig mit verwendeten Credentials
- muss vor **Session Hijacking** geschützt werden
- nichtssagender Name z.B. "id", damit kein Schluss auf verwendetes Framework
- sollte mehr als 128 Bit lang sein und mehr als 64 Bit **Entropie** beinhalten
- Bedeutung ist nur auf dem Server gespeichert
- am besten Speicherung in Cookie
  - lässt auch Verfallszeit und granulare Einschränkung definieren
  - ansonsten auch Body Argument, Hidden Field, Http Header, etc. denkbar
- am besten vorhandene Implementierung von **Framework** verwenden
  - keine Default Konfiguration
  - aktuell halten
- HTTPS für gesamte Session verwenden
- Cookie Attribute
  - **Secure**: Übertragung nur über sicheren Kanal
  - **HttpOnly**: kein Zugriff per JavaScript
  - **Domain**: Cookie darf nur an definerte Domain und deren Subdomains gesendet werden
  - **Path**: Einschränkung von Verzeichnissen
  - **Expire**: Ablaufzeit
  - **Max-Age**: geht vor Expire
- Lbenszyklus
  - Art der Erzeugung: **permissive** (zu Session ID von Benutzer wird Session erzeugt), heute meist **strict** (nur der Server kann eine Session ID erzeugen, sonst kommt ein Alarm)
  - muss wie nicht vertrauenswürdiges Datum behandelt werden
  - muss bei Rechteänderung neu erzeugt werden
  - Lebensdauer sollte so kurz wie möglich sein (kritisch: 2-5 Minuten, niedriges Risiko: 15-30 Minuten)

## 08 Software and Data Integrity Failures

- **Code** und **Infrastruktur** schützen die Integrität nicht (Anwendungen, Bibliotheken)
- **unsichere CI/CD Pipelines** (kompromittierte Systeme, Malicious Code)
- nicht vertrauenswürdige **Updates** (fehlende Signatur, dubiose Quelle)

$\rightarrow$ Angreifer können eigenen Code ausführen lassen

### Gegenmaßnahmen zu Software and Data Integrity Failures

- Verwendung von **Signaturen**
- **Vertrauenswürdigkeit** eines Projektes
  - Maturity Status
  - AutorInnen
- Bibliotheks- und Artefakte-Management (z.B. Nexuslib)
- **Supply Chain** Management (z.B. OWASP Dependency Check)
- für **Intrastructure as Code**
  - IDE Plugins
  - Risikoanalyse
  - Verwaltung von **Secrets**
  - Versionskontrolle (Transparenz)
  - **Least Privilege** für Entwickler
  - **Statische Analyse**
  - **Artifact Signing**
  - Deployment
    - **Inventory Management**: Ressourcen labeln, tracken und loggen
    - **Dynamische Analyse** der Interoperabilität: erkennt potenzielle Risiken
  - zur Laufzeit
    - bei Änderung **gesamte** Intrastruktur **neu** provisionieren
    - aktiviertes **Logging**
    - **Security Monitoring** (z.B. Prometheus, Grafana)
    - Bedrohungserkennung: unerwartetes Verhalten

## 09 Security Logging and Monitoring Failures

Unzureichendes Logging:

- **kritische Events** nicht gespeichert
- Warnung / Fehler erzeugt fehlerhafte oder unzureichende Informationen
- nicht überwachte oder nur lokal gespeicherte **Logfiles**
- keine **Schwellenwerte** oder keine Überwachung von Warnungen
- durch Penetrationstests oder Dynamic Application Security Testing Tools werden keine **Alerts** erzeugt
- Angriffsversuche werden nicht oder nicht in **Echtzeit** erkannt

### Vorteile durch Logging

- Erkennung von sicherheitsrelevanten Vorfällen (**security incidents**)
- Erkennung von Verstößen gegen eine **Policy**
- unterstützt **Nicht-Abstreitbarkeit**
- kann **Fehler** erkennen
- zusätzliche Informationen für Incident Response Prozess

### Sicheres Logging

- Anmelde- und Zugriffssteuerung sowie serverseitige Eingabeüberprüfung sollte mit ausreichendem **Benutzerkontext** protokolliert werden $\rightarrow$ Aufbewahrung für verzögerte **forensische Analyse**
- Logfiles in universellem **Format** $\rightarrow$ einfache Auswertung
- korrekte **Codierung** (Vermeidung von Injection)
- **Audit-Trail** mit Integritätskontrollen (Verhinderung von Manipulation / Löschung)
- effektive Überwachung mit Alarmierung, um schnell reagieren zu können
- Events für das Logging:
  - Änderung Zugriffsberechtigung oder Konfiguration
  - Lesen / Schreiben von sensiblen Daten
  - Löschen
  - Zugriffsaktionen mit Berechtigungen
  - Authentifizierungs-Ereignisse
  - Starten / Stoppen von Services
- Informationen des Logevents:
  - **Wann** (Zeitstempel)
  - **Wo**: Anwendung, Service, Seite, Codestelle
  - **Wer**: IP-Adresse, Benutzername
  - **Was**: Art, Kritikalität, Sicherheitsrelevanz, Beschreibung, ggf. Ergebnisstatus
- <ins>Nicht</ins> Teil des Logevents:
  - Quellcode
  - Session-Identifier, Access Token, Passwörter, private Schlüssel
  - PII und sensible Daten
  - Datenbank oder Verbindungsdaten
  - Bank- oder Kreditkartendaten
  - Business-kritische Daten
  - Daten, die - bspw. per Gesetz - nicht gesammelt werden dürfen
- Schutz der Logging-Informationen
  - **At Rest**: Backup auf "read-only"-Speicher, Monitoring, eingeschränkter Zugriff
  - **In Transit**: verschlüsselte Übertragung, Due Diligence Checks
  - **sofortige Kopie** auf getrenntes System (z.B. via syslog-ng)
  - massives Erzeugen von Logereignissen darf Ressourcen des Systems nicht ausschöpfen
  - lokale Logfiles auf **getrennter Partition**
  - Anschluss des Servers an **zentrale Zeitsynchronisierung** (NTP)

## 10/2013 Unvalidated Redirects and Forwards

Ungeprüfte Um- und Weiterleitung wird gerne für **Phishing**-Angriffe verwendet

Manchmal steht Zielseite in unvalidiertem Parameter $\rightarrow$ kann möglicherweise für Umgehung der Autorisierung verwendet werden

### Gegenmaßnahmen zu Unvalidated Redirects and Forwards

- keine Redirects und Forwards verwenden
- falls doch notwendig
  - URL mit Allowlist prüfen
  - nicht den Benutzerinput für die Ermittlung des Ziels verwenden
- immer auch am Ziel die Autorisierung prüfen
- keine URL als Parameter, sondern Wert, der serverseitig in URL übersetzt wird

## Prinzipien sicherer Webanwendungen

### 1. Kenne das Sicherheitsmodell des verwendeten Frameworks

"Kenne deinen Werkzeugkasten"

- **Session Management**, Datenbankzugriff, etc.
- Unterstützung durch **Browser-Features**
  - **Sandboxing**: Separation des Codes und Zugriffsregeln $\rightarrow$ Schutz des Clients vor schädlichem Code
  - **Same-Origin Policy**: Begrenzung auf einen einzigen Kontext (Protokoll, Host & Port)
- oft nicht bekannt oder falsch eingesetzt

### 2. Vertraue nicht dem Client

"You handshake with your client, but you never trust it"

Wenn ein Angreifer den Client kontrolliert

- veränderte **Verarbeitungsreihenfolge** $\rightarrow$ z.B. **XSS**
- veränderte Daten: z.B. Ablaufdatum in Cookie, Hidden Field, ...
- erneutes Einspielen alter Daten: bspw. wenn Zustandshaltung in Cookie
- veränderte **Metadaten**: bspw. Zugriff ohne Login für GoogleBot UserAgent $\rightarrow$ Änderung des UserAgent im Request
- client-seitige Ausführung von Code: Veränderung im lokalen JavaScript

Daher

- wichtige Entscheidungen nur auf dem Server treffen: Authentifizierung, Autorisierung, kritische Entscheidungen
- Daten an den Client als öffentlich betrachten
- **Input-Validierung** auf dem Server
- **Paranoides Vertrauensmodell**: "Vertraue nur dem, was du selbst beobachtest"

### 3. Vermeide die Nutzung gefährlicher Methoden

"eval() ist evil" (kompiliert String und führt diesen aus)

auch problematisch: setTimeout(), setInterval() und Function Constructor

### 4. Verwende sichere Kommunikation

Wo möglich **SSL / TLS** (inkl. gültiges Zertifikat)

### 5. Härte den Web-Server

Erhöhung der Sicherheit durch **Reduzierung der Angriffsfläche** (Konfiguration oder Erweiterung)

- Deaktivierung nicht benötigter Dienste
- Einsatz gehärteter Betriebssysteme
- Einspielen von **Patches**

Bei Linux

- Dienste bekommen **Service Account** ohne Login Shell (/bin/false) und mit minimalen Rechten
- Verzeichnis-Rechte maximal beschränken, durch **umask** vorgeben
- Passwortrichtlinie, Tarpitting um Bruteforce zu verlangsamen
- ssh Konfiguration anpassen: Port, kein root Login, ...
- Speicherverbrauch und Rechenzeit limitieren (ulimit)
- Prioritäten setzen (nice)

Bei Apache

- Versionsnummern aus Fingerprint entfernen
- unsichere Request-Methoden deaktivieren
- Zugriff auf Infos über Server-Status/Infos einschränken
- Anzahl Zugriffe beschränken
- SSL konfigurieren

Bei PHP

- Fingerprinting verhindern
- Anzeige von Fehlermeldungen deaktivieren
- Verzeichniszugriff beschränken
- temporäres Verzeichnis für Uploads
- Deaktivierung bestimmter Funktionen / Klassen

### 6. Beschränke die Komplexität auf das Notwendige

"Keep it simple, stupid" (**KISS**)

- verbesserte Wartbarkeit
- Übersichtlichkeit

### 7. Verwende Security Patterns wo möglich

- **Role-based Access Control**
- **Client Input Filters**, **Intercepting Validator**
- **Authentication / Authorization Enforcer**
- **Secure Base Action**
  - Sicherheitsaktionen gebündelt in einem Modul
- **Secure Logger**, **Secure Storage**
- **Secure Session Manager**
- **Web Agent Interceptor**
  - Proxy vor Webserver, welcher Security Policies erzwingt
- ...

### 8. Defense in Depth

"Man kann nie genug Sicherheitsmaßnahmen in Stellung haben"

- nicht nur auf eine Schutzmaßnahme verlassen, sozusagen Redundanz
- verschieden Produkte und Hersteller
- "wie eine Artischocke" aufbauen

### 9. Check at the Gate

"Lass keinen Angreifer in dein Haus"

**Perimeterschutz**: eingehenden Verkehr so früh wie möglich prüfen

### 10. Fail securely

Durch eine gebrochene Sicherheitsmaßnahme sollte nur minimaler Schaden entstehen können

### 11. Secure Defaults

"Stelle Sicherheit von Anfang an sicher" $\rightarrow$ sichere Grundeinstellungen

- maximal geschützte Accounts
- i.d.R. schlechtere Usability

## Testen von Webanwendungen

**OWASP Testing Project**: Testing-Framework für eigene Tests

Prinzipien für das Testen:

- möglichst weitreichend denken
- am besten im Rahmen eines SDLC
- früh beginnen
- Verständnis entwickeln
- die richtigen Werkzeuge verwenden
  - **manuelle Reviews**: überprüft Auswirkungen auf die Sicherheit (Analyse der Dokumentation, Interviews mit Architekten / System Owner)
    - flexibel einsetzbar, aber aufwändig in der Durchführung
    - erfordert guten Umgang mit Menschen
  - **Bedrohungs- und Risikoanalyse**: Bedrohungen frühzeitig erkennen können
  - **Code Review**: manuelle Überprüfung des Quellcodes
    - viele Verwundbarkeiten können gar nicht gefunden werden (Bibliotheken, Laufzeitfehler, etc.)
    - häufige Fehler, offensichtliche Schwachstellen, Schadcode, etc. kann eliminiert werden
  - **Penetration Testing**
    - schnelle Durchführung, aber prüft nur "erste Verteidigungslinie" (falls diese hält)
- auf Details achten
- Metriken entwickeln
- Ergebnisse dokumentieren

### Penetration Testing

**Black Box Test** aus **Sicht eines Angreifers** (teilweise mit automatisierten Tools)

#### Sammeln von Informationen

Anfangs **passive** Tests (Google, wget, etc.)

- Ressourcen entdecken und festhalten
  - Webseite netcraft
- Versionsnummern herausfinden (**Fingerprinting**): httprint
- verfügbare Anwendungen analysieren
  - manche Webserver haben typische Header-Reihenfolge
  - **Portscanner**: nmap
- ggf. Fehlermeldungen analysieren

#### Überprüfungen

Configuration Management ("schwache Konfiguration")

- schwache Verschlüsselung
- Behandlung von File Extensions
- alte Dateien $\rightarrow$ Hinweise auf Aufbau der Anwendung
- Admin Interfaces
- zu umfangreiche Fehlermeldungen
- Directory Traversal

Authentifikation

- unsichere Übermittlung von Credentials
- User Enumeration
- Brute Force
- mögliche Umgehungen
- Nebenläufigkeitsprobleme (Race Conditions)

Session Management

- Session Hijacking
- Session Fixation
- CSRF
- Cookies falls verwendet
  - fehlendes Secure Attribut
  - ungeschützte Übermittlung
  - Ablaufzeiten
  - Cache Einstellungen

Autorisierung

- Rechtezuweisung
- Directory Traversal
- Privilege Escalation
- mögliche Umgehungen

Business Logic

- mögliche Brechung der Anwendung durch ungewähnliche Reihenfolge von Aktionen

Daten-Validierung

- Input Validation
- XSS
- Injections

Denial of Service

- SQL Wildcard Attack $\rightarrow$ sehr aufwändige Suche durch komplizierten Vergleich
- Buffer Overflows

AJAX Testing

### OWASP Testing Framework

- Phase 1: **vor** der Entwicklung
  - Dokumentation der Security Policies
  - Reviews bestehender Regeln
  - Sicherheitsbedarf feststellen
  - Metriken und Mess-Zeitpunkte festlegen
- Phase 2: während des **Designs**
  - Annahmen prüfen
  - Überprüfung der sicherheitsrelevanten Mechanismen
  - Überprüfung der Architektur (und dass diese ausreichend dokumentiert ist)
  - Bedrohungs- und Risikoanalyse
- Phase 3: während der **Implementierung**
  - Code Review
  - Code Walkthroughs
  - am Ende: Penetration Testing
- Phase 4: während des **Deployments**
  - "Last Minute Penetration Testing": erfahrungsgemäß notwendig
  - überprüft auch korrekte Konfiguration
- Phase 5: während des **Betriebs**
  - Anwendung aktuell halten (Application Patching)
  - Policies regelmäßig prüfen
  - Penetration Testing nach vorgegebenem Zeitplan (Health Check)
  - Quality Assurance für ALLE Änderungen
