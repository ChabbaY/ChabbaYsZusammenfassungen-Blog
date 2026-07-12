---
date: 2026-07-12
author: Linus Englert
timeline: false
article: false
---

# AI for Games

## Introduction

### Games

- Interaction, Experience, Learning & Mastering
- First success: PONG (Atari 1972)
- Business Models:
  - Boxed Games (GTA)
  - Subscription Games (WoW)
  - Micro-Transaction Games (Farmville)
- 2024 market of **95 Bn $**
- Success Factors: appealing experience, challenging, quality of service, sufficient number of players, time spent
- Classification Criteria:
  - number of controlled entities
  - perspective
  - temporal organisation (real-time, game-time, turn-based)
  - control complexity
  - graphics and gaming world
  - number of players
  - avatar development (RPG)
  - influence of randomization
- Genres:
  - Real-Time Strategy Games (**RTS**): Age of Empires
  - Massive Multiplayer Online Role Playing Games (**MMORPGs**): WoW
  - Multiplayer Online Battle Arena Games (**MOBAs**): LoL
  - Firs-Person-Shooter (**FPS**): CS
  - Racing Games: Gran Tourismo
  - Fighting Games: Mortal Combat
  - Economic Simulations & Turn-based Strategy Games: Civilization
  - Adventure Games & Interactive Movies: Leisure Suit Larry
  - Jump 'n' Run: Super Mario
  - Singing, Music, Rythm Games: Sing Star

### AI

- analyze & generate behavior of game entities
- **Environment**:
  - contains game state (partially / fully observable)
  - executes reactions to actions (deterministic / non-deterministic)
  - known model / model free
  - competitive / collaborative
  - static / dynamic / semi-dynamic
- **Agents**:
  - autonomous within the environment
  - types:
    - simple reflex agent (condition-action-rule)
    - model-based reflex agent (with state)
    - goal-based agents
    - utility-based agents (optimizes reward)
    - learning agents
- Usage:
  - check game balance
  - detect fraud
  - analyse revenue of micro-transactions $\rightarrow$ adapt pricing
  - control environment: NPCs, Mobs, etc.
  - challenging opponents (adapted to player skill)
- Games are great to train & test autonomous systems
  - clearly defined goals & rewards
  - known action set
  - available experience (observing humans, simulating gameplay)

## Game Core

- **Game State**:
  - objects, attributes, relationships, etc.
- **Transition**:
  - change of game state over time
  - triggered by player, agent or transition model (e.g. gravity)
  - game time model for synchronization
    - temporal order of changes
    - restrict number of actions
    - allow all players to act
    - synchronize with wall-clock time
  - **Transition Model**:
    - computes valid reactions or prevents prohibited actions
    - often based on rough approximations of physical laws
    - **Temporal Models**:
      - **Turn based methods**: fixed order, sequential or parallel, game state is fixed during decision
        - Pro: clear & easy to understand, progress based on slowest agent
        - Con: no wall-clock progression, being fast is no advantage
      - **Transaction Systems**: FIFO queue, sequential, no limit on actions
        - Pro: valid state is guaranteed, being fast is an advantage
        - Con: time depends on processing time of transition, no simultaneous actions
      - **Tick Systems** (Soft Real-Time): fixed time intervals, actions within a tick are treated as simultaneous, joint transition, processing the tick can take longer than the defined time interval
        - Pro: synchronizes with wall-clock time, fair action processing, concurrency is possible
        - Con: lags (if transition not computed in time), conflicts possible for concurrent actions, no chronological order
        - shadow memory for consistency: all actions within tick based on same game state
- Games as **Stochastic Process**
  - random elements & varying player actions
  - a discrete time, homogenous **Marcov process** is defined by
    - a set of states S
    - a stochastic function t(s) including start distribution & terminal states
    - and is memoryless: only depends on current state
    - applies for environments without player agents
  - continuous time Markov chains would additionally need to predict the next time a transition might happen
  - inhomogenous processes allow the transition function to vary for different times (i.e. at night)

## Spatial Management

### Spatial Queries

- get game entities within interaction range: Area of Interest (**AoI**)
- for small game worlds, sequential scans over a list would be sufficient $\rightarrow$ processing cost strongly increases with game state
- possible spatial queries:
  - **$\epsilon$-Range Queries**: Euclidian distance lower or equal to $\epsilon$
  - **Box-Query**: within specific range on each axis
  - **Intersection Query**: all entities with overlapping AoIs
  - **Nearest Neighbor Query**: nearest entity within AoI
- tuning methods:
  - **pruning**: reducing number of considered objects (zoning, sharding, index structures, $\ldots$)
  - reducing number of spatial queries: less query ticks or spatial publish subscribe
  - efficient queries: nearest neighbor, $\epsilon$-Range Join
- **Sharding & Instantiation**:
  - copying a region for a specific group: limited number of players / entities
  - additional game state storage can become expensive for many parallel instances
- **Zoning**:
  - splitting into several fixed areas, only considering one area at a time
  - game state is partitioned and can be distributed over several computers
  - **Micro-Zoning**:
    - only micro zones that intersect with the AoI are relevant
    - grids or voronoi-cells
- **Spatial Publish Subscribe**:
  - combines micro zones with observer pattern
  - game entities are **registered** in micro zone and **subscribe** to micro zones within AoI
  - Pro: close-by objects can be found efficiently & no query is necessary as changes are sent actively to subscribers
  - Con: zones can be overcrowded, too much overhead if zones are small, high change-rate can increase overhead & slow down system

### Index Structures

- spatial search trees with restricted number of objects per page region
- **page region**: surrounds several objects
- **balancing**: variance of path lengths / objects per page region
- **page capacity**: min and max number of objects per page region
- **overlap**: intersections between page regions
- **dead space**: space without page regions
- **pruning**: excluding page regions outside AoI
- usually stored in main memory
- index creation time must be compensated by runtime advantage
- **Binary Space Partitioning Trees (BSP-Tree)**:
  - each inner node has 2 successors
  - data objects are leaf nodes
  - most popular: **kD-Tree**:
    - capacity: $[M/2, M]$
    - overflow: split 50/50 along axis, axis changes with every split
    - underflow: merge sibling nodes
  - not balanced, rebalancing is very expensive
  - **Bulk-Load**:
    - recursively distributing all known data objects until all leafs are within capacity
    - creates a balanced tree
- **Quad-Tree**:
  - each inner node has 4 successors (equal parts)
  - not balanced
  - only max capacity
- **R-Tree**:
  - uses data partitioning instead of space partitioning: minimal bounding rectangles (MBR)
  - between $m$ and $M$ successors ($m \leq M/2$)
  - successor's MBR is completely contained in node's MBR
  - all leaves are at the same level
  - **Bulk-Load** with **Sort-Tile Recursive** algorithm:
    - assembling bottom-up with no overlap (for points), for $n$ points / rectangles to store:
      - quantile $q = \lceil \sqrt{n / M} \rceil$
      - quantile after $q \cdot M$ objects in dimension 1
      - quantile after $M$ objects in dimension 2
      - create MBR for each cell
      - restart with MBRs or stop if $q < 2$ (root reached)
- **Throw-Away Indices**:
  - for highly volatile data: spatial movement of objects leads to huge computational overhead or degenerates data structures
    - changing existing data structure is more expensive than rebuilding with bulk load
  - use tree only if tree creation & query on tree is faster than brute force query processing

## Distributed Games

### Distributed Architecture

- **Client-Server**:
  - centralized solution for account-management, partitioning game-world, monitoring, persistence
- **Multi-Server**:
  - redundant data storage
  - less distance between client and server
- **Peer-to-Peer**:
  - no server
  - every peer hosts a part of the game-world (dynamically partitioned)
- **Brewer's CAP Theorem**:
  - any networked shared-data system can have at most 2 of the 3 desired properties: **C**onsistency, **A**vailability, **P**artition Tolerance
- Protocol Content:
  - **Action Result Protocol**: current parameter value / relative change
  - **Action Request Protocol**: user input
- **Thin-Client**:
  - uses Action Request Protocol: server calcualtes transition & sends update to clients, clients only have part of game state
  - Pro: game state centrally managed $\rightarrow$ ensures a consistent game state, low potential for cheating
  - Con: maximum server load, round trip times may cause high latencies, processing power of clients largely unused
- **Fat-Client**:
  - clients directly modify part of the game state
  - local game states may vary due to transmission delays
  - chronological sequence may be inconsistent between local & global changes
  - Action Result Protocol is used to get changes acknowledged by the server
  - **Local Lag** Mechanism:
    - local actions are delayed to allow for global actions to arrive in time
    - if this time frame is exceeded, conflict detection & reset are necessary
- Application:
  - **server side** processing where **accuracy & chronological order** are most important (e.g. damage, healing, item pickup)
  - **client side** processing where **response time** is most important (e.g. movements, animations, effects)
