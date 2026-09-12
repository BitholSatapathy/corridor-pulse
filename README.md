# CORRIDOR PULSE

> Behavioral intelligence for commercial corridors.

---

## 1. Overview

**Corridor Pulse** is a data-driven web application built for the **Beyond the Prompt Day 02 Hackathon**.

The application transforms complex New York City commercial corridor data into an intuitive, interpretable behavioral profile. Rather than sifting through thousands of lines of raw JSON, urban planners, small business operators, and researchers can rapidly explore:

- **When** a corridor is active across morning, midday, evening, late-night, and weekend cycles
- **Who** is associated with the corridor through comparative audience affinities and confidence ratings
- **What demand sources and magnets** drive footfall (residential, workplace, commuter, tourism, healthcare, etc.)
- **What places and ecosystems** form the corridor’s physical retail and civic fabric
- **How resilient** the corridor is against economic shocks, seasonality swings, and event calendar dependencies
- **How two corridors differ** when compared side-by-side across behavioral, structural, and anchor dimensions

The project directly utilizes the supplied NYC commercial corridor export dataset (`NYC_CORRIDORS.full.json`).

---

## 2. Why We Built It

The supplied dataset contains a dense web of interconnected signals: diurnal occasion densities, 55 audience affinities, 15 demand magnets, 7 demand sources, Herfindahl anchor concentration indices, resilience metrics, and 25 semantic place classes.

Looking at raw JSON files makes it nearly impossible to evaluate a commercial corridor holistically. Key trade-offs—such as high footfall that is vulnerable to seasonal swings, or strong daytime activity that completely vanishes after dark—get lost in the numbers.

**Corridor Pulse** organizes these disparate signals into a unified, transparent analytical experience. It allows stakeholders to move from raw data to actionable spatial and behavioral understanding in seconds.

---

## 3. Key Features

### Corridor Explorer
Search, filter, and inspect all **65 NYC commercial corridors** across the five boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island). Features quick borough filter chips and real-time autocomplete search.

### Corridor Pulse Score
A transparent, derived **0–100 composite diagnostic** synthesizing four balanced behavioral components:
- **Activity (30%)**: Mean occasion density across 5 standardized diurnal dayparts.
- **Demand (25%)**: Contextual demand source intensity and 15-category magnet diversity.
- **Resilience (25%)**: Shock absorption capacity offset by seasonal swings, event voids, and development pipeline dependency.
- **Anchor Diversification (20%)**: Effective anchor count and resistance to top-3 anchor footfall concentration.

> **Important Analytical Notice:** The Corridor Pulse Score is our own transparent derived analytical diagnostic layer. It is **NOT** an official dataset score, census count, or predictive revenue model.

### Executive Pulse ("The Pulse Read")
A high-density 10-second briefing providing four editorial takeaways:
- **When Strongest**: Peak daypart occasion density and weekend vs. weekday balance
- **Who Matters**: Top audience segment, affinity rating, and confidence profile
- **What Drives It**: Primary demand source and strongest commercial magnet
- **How Resilient**: Shock resilience score and vulnerability flags
- **Synthesis Read**: An editorial narrative synthesizing the corridor’s behavioral personality

### Activity Rhythm
Visualizes diurnal occasion densities (indexed 0–100) across five key operational periods:
- **Weekday AM** (6:00 AM – 10:00 AM) &bull; Morning commute and breakfast routines
- **Weekday Midday** (11:00 AM – 2:00 PM) &bull; Workplace footfall and lunch flows
- **Weekday Evening** (4:00 PM – 9:00 PM) &bull; Social dining, dinner, and shopping
- **Late Night** (10:00 PM – 4:00 AM) &bull; Nightlife, entertainment, and off-peak vitality
- **Weekend Day** (10:00 AM – 6:00 PM) &bull; Leisure, retail, and community activation

Includes clear peak indicators and a tabular metric row.

### Audience Intelligence
Displays the top 5 behavioral audience segments associated with the corridor, complete with:
- Comparative affinity scores (0–10 scale)
- Empirical confidence badges (`HIGH`, `MEDIUM`, `LOW`)
- Segment family tags (Evening, Residential, Destination, Leisure, Campus, Workplace, Routine)
- Contextual rationale notes

### Demand Intelligence
Breaks down the corridor’s operational demand drivers:
- **7 Normalized Demand Sources**: Residential, Workplace, Commuter, Hotel Guest, University, Tourist Destination, and Medical Campus
- **Top 5 Demand Magnets** (out of 15 classified categories) indicating physical storefront and institutional pull

### Place Ecosystem
Summarizes physical commercial listings, coordinate site density, and venue distributions across prioritized place classes (Restaurants, Cafés, Retail, Supermarkets, Parks, Schools, Medical, Nightlife, and Transit Hubs).

### Resilience Profile
A four-dimensional diagnostic separating **capacity** from **sensitivity**:
- **Shock Resilience** (*Capacity*): Ability to absorb disruptions and tenant turnover
- **Seasonality Amplitude** (*Sensitivity*): Fluctuation magnitude between peak and trough seasons
- **Event Dependency** (*Sensitivity*): Vulnerability to event calendar voids (arenas, stadiums, theaters)
- **Development Dependency** (*Sensitivity*): Reliance on ongoing capital pipeline delivery and construction infill

### Anchor Landscape
Evaluates commercial footfall concentration:
- Empirical concentration tiers: `LOW`, `MODERATE`, or `HIGH`
- Top 1 anchor share and Top 3 anchor share percentages
- Effective anchor count & Herfindahl-Hirschman Index (HHI)
- Compact catalog of identified landmark and anchor destinations

### Corridor Comparison
A side-by-side comparative workspace comparing two selected corridors:
- Prominent **Key Differences** contrast banner identifying the largest behavioral divides
- Direct delta comparisons across composite Pulse Scores and the 4 component sub-indices
- Side-by-side daypart activity profiles, top audiences, demand drivers, and resilience metrics

### Pending Data Handling
Gracefully distinguishes fully enriched macro corridors from the 5 sub-corridors where place, demand, and anchor catalogs are pending ingestion. The application dynamically normalizes available signals without inventing synthetic data.

---

## 4. Dataset

The project is built around the verified export schema (`NYC_CORRIDORS.full.json`, version `v26-corridor-portable-export-v1`):

- **65 Corridors** across Manhattan, Brooklyn, Queens, Bronx, and Staten Island
- **55 Audience Segments** mapping behavioral affinities and confidence ratings
- **31 Café Archetypes** capturing business concept fit and whitespace
- **1,860 Corridor / Archetype Scores** (31 archetypes × 60 available corridors)
- **25 Special Zones** (arenas, parks, and major civic complexes)
- **81,767 H3-10 Spatial Ownership Records** (available for future fine-grained spatial modeling)

### Enrichment Coverage:
- **60 Macro Corridors**: Fully populated across all behavior, demand, place, anchor, and archetype dimensions.
- **5 Sub-Corridors** (`Red Hook`, `Hudson Yards`, `DUMBO`, `Greenpoint North`, `Lower East Side South`): Fully populated for dayparts, audience scores, and resilience; place and demand catalogs are flagged as pending.

> **Methodology Reminder:** Audience scores are comparative behavioral relevance signals across NYC corridors (0–10 scale), not census headcounts or demographic totals.

---

## 5. Tech Stack

Corridor Pulse was intentionally built with a lightweight, modern web architecture:

- **React 18** — Component-driven reactive UI architecture
- **Vite 5** — High-speed build tooling and Hot Module Replacement (HMR)
- **JavaScript (ES Modules)** — Clean, standard clientside execution
- **Modern CSS3** — Modular design tokens, custom layout grids, and accessible animations
- **Lucide React** — Minimalist, consistent icon system
- **Deterministic Analytics Engine** — Pure JavaScript scoring and comparative utilities (`src/utils/`)
- **Local JSON Data Pipeline** — Zero external API latency, 100% offline-capable demonstration

---

## 6. Project Structure

```text
corridor-pulse/
├── NYC_CORRIDORS.full.json          # Source NYC commercial corridor export dataset
├── DATA_SCHEMA.md                   # Verified data dictionary and schema specification
├── index.html                       # HTML5 application entry point
├── vite.config.js                   # Vite configuration
├── package.json                     # Project manifest and scripts
├── public/                          # Static assets served at root
│   └── assets/
│       └── team/                    # Team portraits
├── src/
│   ├── main.jsx                     # Application bootstrap and React DOM mount
│   ├── App.jsx                      # Root re-export forwarder
│   ├── app/
│   │   └── App.jsx                  # Main dashboard container orchestrating sections
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx           # Product title, subtitle & quiet team attribution
│   │   │   └── Footer.jsx           # Editorial product footer
│   │   ├── corridor/
│   │   │   ├── CorridorSelector.jsx # Searchable selector, borough chips & compare toggle
│   │   │   └── CorridorIdentity.jsx # Corridor header, tags, quote & context strip
│   │   ├── analytics/
│   │   │   ├── PulseScoreHero.jsx   # Derived Pulse Score (0–100), status & 4 component bars
│   │   │   ├── ExecutiveBrief.jsx   # 4-column brief + human-readable pulse narrative
│   │   │   ├── ActivityRhythm.jsx   # 5-daypart diurnal density chart & tabular metrics
│   │   │   ├── CorridorSignals.jsx  # Audience affinities & demand source/magnet panels
│   │   │   └── AnchorLandscape.jsx  # Resilience diagnostics & anchor concentration mix
│   │   ├── comparison/
│   │   │   └── CorridorComparison.jsx # Side-by-side comparative workspace with key contrasts
│   │   └── team/
│   │       └── TeamSection.jsx      # Team member cards with portraits and LinkedIn links
│   ├── data/
│   │   └── corridorsData.js         # Dataset loader, lookups & default demo corridor
│   ├── utils/
│   │   ├── scoring.js               # Transparent 4-component Corridor Pulse scoring logic
│   │   ├── comparison.js            # Differential analytics and key contrast extraction
│   │   └── formatters.js            # Label, badge, and number formatting helpers
│   ├── assets/
│   │   └── team/                    # Team portrait image assets
│   │       ├── krish.jpg
│   │       └── bithol.jpg
│   └── styles/
│       ├── tokens.css               # Design tokens (surfaces, borders, typography, colors)
│       ├── globals.css              # Global reset, typography, and scrollbars
│       ├── layout.css               # App container and responsive layout grids
│       ├── components.css           # Editorial card, badge, meter, and button styles
│       ├── animations.css           # Keyframe motions and prefers-reduced-motion rules
│       └── index.css                # Master CSS stylesheet bundle
```

---

## 7. Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (bundled with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
cd corridor-pulse
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to [`http://localhost:5173`](http://localhost:5173).

### Production Build

Compile the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 8. Team The Sixth Sense

Built with pride for the **NYC Commercial Corridor Intelligence Hackathon**:

- **Krish Mathur** &bull; Reg No: `24BCE10068`  
  *Corridor Intelligence & Behavioral Analytics*  
  [LinkedIn Profile](https://www.linkedin.com/in/krish-mathur09/)

- **Bithol Satapathy** &bull; Reg No: `24BAI10972`  
  *System Architecture & Data Engineering*  
  [LinkedIn Profile](https://www.linkedin.com/in/bithol-satapathy-3aaa99321/)
