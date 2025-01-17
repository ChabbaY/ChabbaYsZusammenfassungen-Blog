---
date: 2025-01-15
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
