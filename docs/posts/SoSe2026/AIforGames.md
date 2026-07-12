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

- Game State
  - objects, attributes, relationships, etc.
- Transition
  - change of game state over time
  - triggered by player, agent or transition model (e.g. gravity)
