---
date: 2024-07-21
author: Linus Englert
timeline: false
article: false
---

# Rechnerarchitektur

## 1 Übersicht

Computerentwicklung

- um 1700: **Leibniz Rechenmaschine**
- 1941: **Zuse Z3** (Deutschland)
  - Hardware Schaltung (Relais)
- 1947: **ENIAC** (USA)
  - Elektrische Schaltung (> 17000 Elektronenröhren, sehr anfällig!)
  - ab 1950 mit **Transistoren**
- 1968: IBM System/360 (Mainframe)
- 1976: Apple I (Minicomputer)
- 1981: IBM PC (Minicomputer)
- 1999: HP Workstation
- 2016: Dell Latitude
- 2018: Google Pixel 3 XL

Zunehmende Miniaturisierung & Integration

- **Integrated Circuits** statt diskreter Elemente
- Immer mehr Transistoren auf der selben Fläche
- Immer mehr Funktionalität in einem Chip: **System-on-Chip**

Gegenstände mit prozessorbasierter Steuerung

- Fabrik
- Rechenzentrum
- Smartphone / Tablet
- Laptop
- Smart Home
- Aufzug
- Automotive
- Zug
- Fernseher

## 2 Grundlagen

### Von Neumann Architektur

- generischer Computer
- alles in einem Speicher (Daten, Programme), in homogenen Zellen, die linear adressiert
werden
- Kontrollfluss
  - Load Instruction
  - Store Instruction to Control Register
  - Decode Instruction
  - Execute Instruction
- Operationen
  - Arithmetic and Logical
  - Transport
  - Control Flow
  - Input / Output

### Harvard Architektur

- Trennt Daten- und Instruktionenspeicher
- wird heute modifiziert verwendet (getrennte Cache-Level)

### Instruction Set Architecture (ISA)

- Operationen der CPU als “Vertrag”
- Definiert Instruktionen (und deren binäre Codierung), Register, Zustände, Speicherzugriff und die Schnittstelle zur Außenwelt
- Oftmals mit vielen optionalen Erweiterungen

### Microarchitecture (Blackbox)

- eigentliche Implementierung der ISA (muss diese einhalten)
- hochgradig optimiert

### Register

- schnellstes Speicherelement der CPU
- **General Purpose Register (GPR)**: Zwischenergebnisse der Execution
- **Special Purpose Registers (SPR) / Control and Status Register (CSR)**
  - Program Counter (PC)
  - Stack Pointer
  - Status Registers (flags)
  - Link Register
  - Index Register (Adressberechnungen)

### Instruktionen

- Interpretation basiert auf ISA
- Sequenzielle Ausführung
- Integer Computational Instructions / Memory Access / Control Flow / Input/Output

### Speicherzugriff

- Transport zwischen Speicher und Registern, da Register limitiert
- Unterschied zwischen Hauptspeicher und Langzeit-Speicher (disk)

### 5 Phasen der Ausführung

- **Fetch** (FE)
- **Decode** (DE)
- **Execute** (EX)
- **Memory Access** (MA)
- **Write Back** (WB)

## 3 RISC-V Grundlagen und Arithmetik

### RISC-V

- 2010: akademisches Projekt der UC Berkeley
- Offene Befehlssatzarchitektur
- rapide Adaption in der Industrie
- klar und gut strukturiert, erweiterbar
- Open Source und proprietäre Prozessor-Implementierungen
- **Reduced Instruction Set Computer (RISC)**: max. 2 Operanden und 1 Ergebnis, geringe funktionale Komplexität, Speicherzugriff nur bei Load und Store

### RISC-V Register

- 32 General Purpose Register (x0 .. x31), x0 ist 0 (read only)
- mit 32, 64 oder 128 Bit möglich
- Bis zu 4096 Control and Status Register

Einfache arithmetische Instruktionen:

- add rd, rs1, rs2 (rd = rs1 + rs2)
- sub rd, rs1, rs2 (rd = rs1 - rs2)

Ein Übertrag ist aufgetreten, wenn nach a = b + c (vorzeichenlos) gilt: a < c

Ein Überlauf ist aufgetreten, wenn nach a = b + c (vorzeichenbehaftet) gilt: a hat das umgekehrte Vorzeichen

Wenn bei Addition überlauf: Carry Status-Bit als Übertrag gesetzt (nicht im Ergebnis sichtbar)
Vergleiche

- weder Condition Codes (Zero Flag, Carry Flag, ...) noch Predications (Operation wenn
Flag gesetzt)
- slt rd, rs1, rs2 ($rd = (rs1<rs2)~?~1~:~0$)
- sltu rd, rs1, rs2 (unsigned)
- sgt rd, rs1, rs2 (greater than)

Bedingte Sprünge

- beq rs1, rs2, imm
- bge rs1, rs2, imm
- blt rs1, rs2, imm

## 4 Abstraktion und Hardware-Implementierung

**Code Size** als wichtiges Optimierungs-Ziel, v.a. bei Embedded

- weniger Instruktionen im Programm
- kürzere Instruktionen (z.B. compressed mode mit 16 Bit)
- höhere Instruktionsdichte $\rightarrow$ weniger Instruktionen notwendig

### 4.1 RISC-V Instruction Coding

- bestimmte Felder immer an derselben Stelle → weniger Hardware Overhead
- verschieden Formate für verschiedene Typen von Befehlen (register-register, registerimmediate, ...)

### 4.2 Von der Hochsprache zum Maschinencode

- **Assembler-Sprache** als Abstraktion (symbolische Sprache, die Maschinenbefehle beschreibt)
- **Assembler-Programm** übersetzt Assembler-Sprache in Maschinenbefehle
- da Assembler-Programmierung aufwändig, Abstraktion durch **Hochsprache**: Übersetzung in Assembler-Befehle durch Compiler

## 5 CPU-Pipelining und Kontrollfluss

**Problem**: serielle Ausführung dauert viel zu lange $\rightarrow$ Parallelisierung durch **Instruction Pipelining**

Bei $n = 4$ Befehlen und $p = 4$ Pipelineschritten, bräuchte seriell $n∗p = 16$ Zyklen, mit Pipelining $n + (p − 1) = 7$ Zyklen. Der Speedup beträgt damit $16/7$.

In der Hardware werden dafür zusätzliche Zwischenregister benötigt, die die Zwischenergebnisse halten, bis diese in den nächsten Schritt gelangen. Außerdem zusätzliche Taktsignale.

### 5.1 Data Hazard

- wenn Daten einer vorherigen Instruktion noch nicht zurückgeschrieben wurden (RAW =
Read after Write)
- bewirkt Pipeline Stall: warten, bis Hazard behoben, alternativ:
  - **Umsortieren** der Anweisungen: wird vom Compiler gemacht
  - **Forwarding**: Daten direkt von Execute oder Memory Access abgreifen
- Auswirkung auf **CPI/IPC**: bei Hazard Rate $r = 1/4$ und Penalty $p = 2$: $CPI = 1 + 1/4∗2 = 1.5$
- kann für Load Instructions nicht behoben werden, da Ergebnis erst nach MA verfügbar, lediglich Umsortierung durch Compiler möglich

### 5.2 Control Hazard

- bei Branches ist erst nach Execute klar, welcher Zweig genommen wird
- bei Branch Rate $b$ und Penalty $p$ beträgt $IPC = {1\over1+b∗p}$
- wo möglich **Branches vermeiden**
  - **Bedingte Instruktionen** (nicht in RISC-V), z.B. cmp in ARM
  - **Loop Unrolling**: Erhöhte Code Size, aber bessere Performance (wird vom Compiler
gemacht)
- ansonsten **Branch Prediction** (statisch oder dynamisch)
  - Bei Branch Rate $b$, Penalty $p$ und Misprediction Rate $m$ beträgt $IPC = {1\over1+b∗m∗p}$

## 6 Statische Branch Prediction

Heute ausschließlich "Machine decision" und nicht mehr "User-controlled" (Bit im Opcode),
da Coding Space zu wertvoll und keine besseren Ergebnisse dadurch.

### 6.1 Always

Wahrscheinlichkeit, dass ein Branch genommen wird bei **60-70%**, also einfach immer davon ausgehen. Dafür dann aber Penalty in **30-40%** der Fälle.

### 6.2 Backward Taken, Forward Not Taken (BTFNT)

Wahrscheinlichkeiten von **90%/23%**, dass ein backward/forward Branch genommen wird, also nur bei rückwärts Branches davon ausgehen. Auch hier noch eine gewisse Penalty übrig.

## 7 Dynamische Branch Prediction

Basiert auf Historie, funktioniert wegen:

- **Temporal Correlation**: wiederholt gleiche Entscheidung (Loops)
- **Spatial Correlation**: Branches auf einem Pfad verhalten sich vermutlich bei jeder Ausführung ähnlich

### 7.1 1-Bit Prädiktor

- **2 Zustände** 0 und 1, Penalty bei Zustandswechsel
- Bei mehreren Branches würde der selbe Prädiktor verwendet, daher werden mehrere 1-Bit
Prädiktoren parallel eingesetzt
  - Teil des PC bestimmt Prädiktor
  - Signifikante Bits ändern sich nicht schnell genug (aliasing) und letzte 2 Bits immer 0 $\rightarrow$ die weniger signifikanten Bits, aber nicht die statischen
- Performt bereits besser als die statische Vorhersage, erkennt aber keine Muster (z.B. Inner
loops)

### 7.2 2-Bit Prädiktor

- **4 Zustände**, wobei das erste Bit der Vorhersage entspricht
- Prädiktor muss zweimal falsch liegen, um seine Vorhersage zu ändern, dadurch werden
Ausreißer kompensiert

### 7.3 2-Way Adaptive Predictor

Auswahl des 2-Bit Prädiktors basierend auf **Historie** letzter Branch Entscheidungen, z.B. letzte 5 Entscheidungen $\rightarrow$ 32 Prädiktoren

#### 7.3.1 2-Way Adaptive Global Predictor

Hier fließt **auch ein Teil des PC** in die Prädiktor-Auswahl mit ein, z.B. 2 Bit aus PC + 3 Bit Historie $\rightarrow$ 32 Prädiktoren

#### 7.3.2 2-Way Adaptive Local Predictor

Hier wird ein **Teil des PC** für die Auswahl der Historie verwendet.

**Historie und ein Teil des PC** bestimmen dann den Prädiktor, z.B. 4 Bit des PC bestimmen 4 Bit Historie, mit 2 Bit des PC $\rightarrow$ 64 Prädiktoren

### 7.4 Branch Target Prediction

Bei unbedingten Sprüngen kann die Zieladresse dynamisch sein. In diesem Fall wäre sie erst
bei Execute bekannt (Jump and Link Register (jalr)).
Dafür wird das **Branch Target Buffer (BTB)** eingeführt

- speichert letzte Zieladresse zu bestimmtem PC
- ist aber teure Hardware (limitierte Einträge)

Zusätzlich **Return Address Stack (RAS)**

- die Return Adresse wird bei function calls auf einen separaten Stack gelegt
- damit immer Rücksprungadresse parat

## 8 Komplexes Pipelining

Noch bessere Performance durch Superskalarität (vertikale Skalierung) und **Out-of-Order-Exceution**.

### 8.1 Functional Units

- Statt Execute verschiedene **Functional Units (FU)**: ALU, MUL, DIV, FPU
- manche Operationen benötigen mehrere Zyklen, z.B. Multiplikation über 3 Zyklen
- oft auch Parallelisierung in einer FU möglich
- Metriken:
  - **Latency**: Zyklen, welche die FU für eine Instruktion benötigt
  - **Initiation Interval**: Zyklen zwischen zwei Instruktionen
- **Structural Hazard** wenn benötigte FU nicht verfügbar

### 8.2 Memory Access

- nur bei rund 20% der Instruktionen
- kann daher weggelassen werden, bzw. ist optional nach ALU, wobei die ALU die Adressberechnung vornimmt
- oftmals eigene **Load-Store Unit (LSU)**, die eine ALU und den Memory Access umfasst

### 8.3 Load-and-Store Optimierungen

- **Nonblocking loads**: Überlappung von Memory Acess Phasen, paralleles Laden
- **Store Buffer**: Posted stores: Speicherung wird in Auftrag gegeben (in Puffer geschrieben), dann wird weitergemacht; Soeicherung erfolgt unabhängig von Pipeline

## 9 Out-of-Order Execution

Verschiedene Arten des Scheduling

- Static: Ausführung vorbestimmt
- Dynamic: Auswahl der nächsten Instruktion zur Laufzeit
  - In-Order Execution (sequenziell)
  - **Out-of-Order-Execution** (sobald möglich)
- durch Data Hazards limitiert, zusätzlich zu In-Order (Read-after-Write):
  - **Write-after-Read**
  - **Write-after-Write**
  - kann in einem Datenfluss-Graphen visualisiert werden

Dynamisches Scheduling

- unter Beachtung der Hazards
  - Structural: FU muss frei sein
  - Data: Abhängigkeiten müssen aufgelöst sein (richtige Reihenfolge)
- werden Instruktionen so früh wie möglich begonnen
- Speicherung im Instruction Buffer

Unterteilung der Decode-Phase

- **Issue**: Dekodierung und Beachtung von Structural Hazards bzw. voller Instruction Buffer
- **Read Operands**: Operanden werden erst gelesen, wenn alle Data Hazards behoben wurden

Verwendung eines **Scoreboard**

- welche Instruktion in welcher FU aktiv ist
- ob es einen Konflikt bei der aktuellen Instruktion gibt
- Instruktionen werden bei Start eingetragen und nach dem Write Back wieder ausgetragen

Limits von **Out-of-Order**:

- durch limitierte Register treten viele WAW und WAR Hazards auf, vor allem bei mehreren
Ausführungspfaden
  - Behebung durch **Register Renaming**: virtuelle Registernamen (nach außen nicht sichtbar)

## 10 Speicher

Ziele

- kostengünstig
- ausreichend groß
- mit guter Performance (Entwicklung schleppend im Vergleich zu Prozessoren)

Lokalität

- **Räumlich**: nahe Adressen zu ähnlichen Zeitpunkten
- **Zeitlich**: nach kürzlichem Zugriff wahrscheinlich wieder in naher Zukunft
- Optimierung durch Speicherhierarchien

Preis/Performance

- Register > Cache > Hauptspeicher > Hintergrundspeicher

Klassen

- **volatil: Random Access Memory (RAM)**
  - beliebig oft und schnell beschreibbar
  - verliert Daten bei Spannungswegfall
- **nicht-volatil: Read-Only Memory (ROM)**
  - aufwändig oder überhaupt nicht wiederbeschreibbar

### 10.1 Nicht-volatile Speicher

- Speicherelement: Durchbrennmetallisierung oder -Diode
- nicht wiederbeschreibbar
  - **Maskenprogrammierbares ROM (MROM)**: vom Hersteller programmiert, ab ca. 1000 Stück rentabel
  - **Programmierbares ROM (PROM)**: vom Anwender mit Programmiergerät programmierbar
    - **Erasable PROM (EPROM)**: durch UV-Licht löschbar
    - **Electrically Erasable PROM (EEPROM)**: elektrisch löschbar (max. ca. 106
mal) & byteweise beschreibbar
    - **Flash-EEPROM**: blockweiser Zugriff, jeder Block 105 mal beschreibbar, in Mobilgeräten und SSDs

### 10.2 Volatile Speicher

Kernspeicher (Core)

- 1970 am verbreitetsten, heute historisch
- Ferritkernring als Speicherelement

Unterscheidung des RAM

- **Static (SRAM)**
  - schnell, groß & teuer
  - Flip Flop Speicher (6 Transistoren)
  - für Caches, Datenspeicher mit Pufferbatterie (BIOS), ICs/FPGAs (lokaler Speicher)
- **Dynamic (DRAM)**
  - langsam, aber klein und billig
  - Kondensator Speicher (Transistor + Kondensator, refresh nötig)
  - für Hauptspeicher

Dynamischer Speicher (DRAM)

- Synchronous DRAM Dual Inline Memory Module (**SDRAM DIMM-Speichermodul**)
  - synchron bedeutet getaktet (durch Systembus, ggf. durch separaten Speicherbus)
  - abgelöst durch DDR-SDRAM (Ausnutzung beider Taktflanken → Verdopplung der
Datenrate)
- **Speicherzelle**
  - Speicher über kleine Kondensatorkapazität, entspricht 1 Bit
  - Adressierung über **Zeilenleitung**, Output über **Spaltenleitung**, Lesen löscht den gespeicherten Wert
  - Refresh notwendig aufgrund Selbstentladung
  - können dicht gepackt werden (Trench Zellen: Einätzung von Kondensatoren in das Wafermaterial)
- Anordnung der Zellen in einem **Speicherfeld**
- Mehrere Speicherfelder hintereinander sind eine **Bank**, Felder werden gleichzeitig gelesen, z.B. 8 Felder für byteweises Lesen
- Mehrere Bänke bilden einen **Chip**, zusätzliche Bits für Adressierung notwendig
- Mehrere Chips bilden ein **Modul**, hier wird wieder parallel gelesen, sodass 32 oder 64 Bit auf einmal gelesen werden können
- Zugriffe:
  - **Lesen**: Komplette Zeile in Leseverstärker (da Ladungen der ganzen Zeile verloren gehen), Anlegen der Spaltenadresse & Auslesen, Zurückschreiben der ganzen Zeile (spart Anschlussleitungen, da Adressen über eine Leitung)
  - **Schreiben**: wie Lesen, aber Veränderung des entsprechenden Bits vor dem Zurückschreiben

## 11 Cache

Weiterer Teil der Speicherhierarchie: Register sind sehr teuer und Hauptspeicher dauert zu lange

- prüfen, ob schon im Cache (**Cache Hit**)
- ansonsten aus nächst langsamerer Ebene anfordern (anderes Cache-Level oder Hauptspeicher) (**Cache Miss**)

speichert nur einen Teil des Hauptspeichers (KB bis MB)

- **Block Placement**: wo ein Block abgelegt wird
- **Block Identification**: wie ein Block gefunden wird
- **Block Replacement**: welcher Block bei einem Cache Miss ersetzt wird
- **Schreibstrategie**: wie ein Schreibvorgang abläuft

Organisation in Blöcken bzw. **Cache Lines**

- Mehrere Worte pro Cache Line

Adressierung über Tag + Offset + Byte-Offset (Innerhalb des Worts)

### 11.1 Voll Assoziativer Speicher

Ist teuer, da **viele Komparatoren erforderlich** sind. Block kann überall im Cache liegen.

### 11.2 Direct-Mapped Cache

Teil der Adresse ist **Index**, der auf genau eine Stelle im Cache zeigt (Tag wird dadurch kleiner).

### 11.3 n-Wege Assoziativer Cache

Aufteilung in Sets: Einschränkung des Suchraums, Indizierung der Sets

### 11.4 Verdrängungsstrategien

- bei Direct-Mapped kommt nur ein Block in Frage
- für assoziative Speicher:
  - **Random**: Zufall
  - **FIFO**: ältester Block (einfach zu implementieren, aber nicht optimal)
  - **Least Recently Used (LRU)**: am längsten nicht genutzter Block (Aufzeichnung
der Zugriffe)
- da LRU in Hardware sehr aufwändig ist, kann stattdessen durch **Pseudo-LRU** angenähert werden.
  - **Baum aus Status-Bits** (links/rechts), Blätter sind die Blöcke
  - nach Zugriff Umkehr aller Bits auf dem Pfad
