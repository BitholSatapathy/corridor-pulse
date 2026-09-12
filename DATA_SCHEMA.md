# DATA_SCHEMA.md: Corridor Pulse Data Specification

## 1. Overview & Top-Level Structure

The primary data source is `NYC_CORRIDORS.full.json` (version `v26-corridor-portable-export-v1`, exported `2026-09-11`). It is a single JSON root object with 9 top-level keys:

| Top-Level Key | Type | Count / Description |
| :--- | :--- | :--- |
| `export_schema_version` | `string` | Version identifier (`"v26-corridor-portable-export-v1"`) |
| `exported_at` | `string` | ISO 8601 timestamp (`"2026-09-11T12:11:07.316668+00:00"`) |
| `source` | `object` | Provenance metadata (database, bundle SHA256, release manifests) |
| `corridors` | `array<object>` | **65 corridor profiles** (core entity for the dashboard) |
| `audience_segments` | `array<object>` | 55 audience segment definitions (`segment_id`, `family_id`, `label`) |
| `archetypes` | `array<object>` | 31 business archetype definitions (`archetype_id`, `name`, signals, rules) |
| `corridor_archetype_scores` | `array<object>` | 1,860 evaluated archetype scores (31 archetypes × 60 available corridors) |
| `special_zones` | `array<object>` | 25 special point/venue zones (arenas, parks, campuses, e.g. Barclays, Central Park) |
| `map` | `object` | Spatial data: `geometry` (empty array) and `corridor_context` (60 corridor geocoded sample points) |

---

## 2. Corridor Entity Specification (20 Target Fields)

All corridor records live in the `corridors` array (`corridors[]`).

| # | Requested Field | Exact JSON Field Path | Data Type | Populated Count | Example Value |
|---|---|---|---|---|---|
| 1 | **Corridor ID** | `corridors[].corridor_id` | `string` | 65 / 65 | `"0gyhIgdbWEHM"` |
| 2 | **Corridor Name** | `corridors[].name` | `string` | 65 / 65 | `"St. George–North Shore"` |
| 3 | **Borough** | `corridors[].borough` | `string` | 65 / 65 | `"Staten Island"` |
| 4 | **Neighborhoods** | `corridors[].neighborhoods` | `array<string>` | 65 / 65 | `["St. George", "Tompkinsville", ...]` |
| 5 | **Level** | `corridors[].level` | `string` | 65 / 65 | `"MACRO"` (60) or `"SUB_CORRIDOR"` (5) |
| 6 | **Character** | `corridors[].character` | `string` | 65 / 65 | `"The free ferry terminal funnels every island commuter..."` |
| 7 | **Access** | `corridors[].access` | `object` | 65 / 65 | `{"gateway_dependency": "MODERATE", "barrier_note": "..."}` |
| 8 | **Behavior** | `corridors[].behavior` | `object` | 65 / 65 | Nested metrics object (momentum, friction, safety, etc.) |
| 9 | **Daypart Activity** | `corridors[].behavior.daypart_occasion_density` | `object` | 65 / 65 | `{"weekday_am": 68, "weekday_midday": 55, ...}` |
| 10 | **Audience Scores** | `corridors[].audience_scores` | `object<string, int>` | 65 / 65 | `{"after_work_social": 4, "airport_travel": 1, ...}` (55 keys) |
| 11 | **Audience Confidence** | `corridors[].audience_confidence` | `object<string, string>`| 65 / 65 | `{"after_work_social": "LOW", "car_errands": "MEDIUM", ...}` |
| 12 | **Places** | `corridors[].places` | `object \| null` | 60 / 65 | `{"inventory": {...}, "classes": {...}, "categories": [...], "adjacent": {...}}` |
| 13 | **Place Classes** | `corridors[].places.classes` | `object<string, object>`| 60 / 65 | `{"CAFE": {"listing_count": 38, "coordinate_site_count": 38, ...}, ...}` (25 classes) |
| 14 | **Demand Sources** | `corridors[].demand_sources` | `object<string, float>` | 60 / 65 | `{"residential": 0.641, "workplace": 0.158, ...}` (7 keys) |
| 15 | **Demand Magnets** | `corridors[].demand_magnets` | `object<string, float>` | 60 / 65 | `{"transit": 0.064, "office": 0.272, ...}` (15 keys) |
| 16 | **Magnet Diversity** | `corridors[].magnet_diversity` | `float \| null` | 60 / 65 | `0.921543` (0.85 to 0.99) |
| 17 | **Anchor Concentration**| `corridors[].anchor_concentration` | `object \| null` | 60 / 65 | `{"anchor_concentration_proxy": 0.373, "hhi": 0.139, ...}` |
| 18 | **Resilience** | `corridors[].behavior.resilience` | `object` | 65 / 65 | `{"shock_resilience": 55, "seasonality_amplitude": 32, ...}` |
| 19 | **Anchors** | `corridors[].anchors` | `array<object> \| null` | 60 / 65 | `[{"place_id": "...", "name": "Snug Harbor", "class": "MUSEUM", "relation": "CORE"}]` |
| 20 | **Cafe Archetype Matches** | `corridors[].cafe_archetype_matches` | `array<object> \| null` | 60 / 65 | `[{"archetype_id": "...", "name": "Residential amenity cafe", "score": 0.627, ...}]` |

---

## 3. Nested Structure Details

### 3.1 Access (`corridors[].access`)
- `gateway_dependency`: `string` (`"NONE"` | `"LOW"` | `"MODERATE"` | `"HIGH"`)
- `barrier_note`: `string` (Descriptive text; empty string `""` in 34 corridors)

### 3.2 Behavior (`corridors[].behavior`)
Contains 10 key sub-dimensions:
- `neighborhood_momentum`: `int` (0–100)
- `timing_alpha`: `int` (0–100)
- `crime_safety`: `{"day": int, "evening": int, "late_night": int}`
- `socioeconomic_shift`: `{"direction": string, "intensity": int}` (Directions: `"GENTRIFYING"`, `"STABLE"`, `"IMMIGRANT_SUCCESSION"`, `"STABILIZING"`, `"FAMILY_INFILL"`, `"STUDENTIFYING"`, `"TOURISTIFYING"`)
- `daypart_occasion_density`: `{"weekday_am": int, "weekday_midday": int, "weekday_evening": int, "late_night": int, "weekend_day": int}` (Values: 12–97)
- `path_of_travel_friction`: `int` (0–100)
- `transit_car_orientation`: `int` (0–100, higher = more transit-oriented)
- `brand_ecology`: `{"halo_strength": int, "migration": string ("INFLOWING"|"STABLE"), "chain_dominance": int}`
- `whitespace_quality`: `{"cafe": int, "qsr": int, "fast_casual": int, "fitness": int, "beauty_wellness": int, "grocery_convenience": int}`
- `resilience`: `{"shock_resilience": int, "seasonality_amplitude": int, "event_dependency": int, "development_dependency": int}` (Values: 5–80)

### 3.3 Audience Profiles (`audience_scores`, `audience_confidence`, `dominant_audience`, `audience_evidence`)
- `audience_scores`: Maps 55 segment IDs to integer scores (0 to 10). Always present across all 65 corridors.
- `audience_confidence`: Maps 55 segment IDs to confidence levels (`"LOW"` or `"MEDIUM"`). Always present.
- `dominant_audience`: Array of uppercase audience categories, e.g. `["RESIDENTS", "SHOPPERS", "TOURISTS"]`.
- `audience_evidence`: Map of segment ID to rationale objects:
  ```json
  {
    "score": 4,
    "certainty": "MEDIUM",
    "family_id": "evening",
    "evidence_refs": ["..."],
    "rationale": "snug harbor and zoo provide stronger cultural outings...",
    "knowledge_note": "..."
  }
  ```

### 3.4 Demand Sources & Magnets
- `demand_sources`: 7 normalized float weights (0.0 to 1.0):
  `residential`, `workplace`, `commuter`, `hotel_guest_context`, `university_context`, `tourist_destination_context`, `medical_context`
- `demand_magnets`: 15 normalized float weights (0.0 to 1.0):
  `transit`, `office`, `retail`, `restaurant_district`, `retail_destination`, `entertainment`, `nightlife`, `park_waterfront`, `tourist_attraction`, `education`, `medical`, `stadium_event`, `grocery_routine`, `civic_community`, `hospitality`

### 3.5 Places & Place Classes (`corridors[].places`)
- `inventory`: Aggregate counts (`listing_count`, `coordinate_site_count`, `shared_coordinate_listing_count`, `national_regional_share_among_branded`, etc.)
- `classes`: Dictionary of 25 semantic place classes (`AIRPORT_GATEWAY`, `CAFE`, `DEPARTMENT_STORE`, `EVENT_VENUE`, `GOVERNMENT_CIVIC`, `GROCERY_SUPERMARKET`, `HISTORICAL_LANDMARK`, `HOSPITAL_MEDICAL_CAMPUS`, `HOTEL`, `K12_SCHOOL`, `MALL_MARKET_HALL`, `MUSEUM`, `NIGHTLIFE`, `OFFICE_LISTING_CONTEXT`, `PARK`, `PARKING_CONTEXT`, `RELIGIOUS_COMMUNITY`, `RESIDENTIAL_BUILDING_CONTEXT`, `RESTAURANT`, `RETAIL`, `STADIUM_ARENA`, `THEATER_CINEMA`, `TOURIST_ATTRACTION`, `TRANSIT_HUB`, `UNIVERSITY_CAMPUS`).
  Each class object contains: `{"listing_count": int, "coordinate_site_count": int, "shared_coordinate_listing_count": int}`
- `categories`: Array of L1 category totals (`Health & Medical`, `Food & Beverage`, `Retail`, etc.)
- `adjacent`: Surrounding H3 cell buffer stats and semantic classes.

### 3.6 Anchors & Concentration
- `anchors`: Array of up to 8 landmark objects:
  ```json
  {
    "place_id": "a129aaf0-9c04-4b2d-ae18-07600af343d9" | null,
    "name": "Snug Harbor Cultural Center & Botanical Garden",
    "class": "MUSEUM",
    "h3_10": "8a2a10624b47fff" | null,
    "relation": "CORE" | "OVERLAY_CONTEXT"
  }
  ```
  *(Note: 30 of 480 anchors have `place_id: null` and `h3_10: null`, typically overlay/terminal contexts).*
- `anchor_concentration`:
  - `anchor_concentration_proxy`: `float` (0.35 to 0.43)
  - `top_anchor_share`: `float` (share of top anchor)
  - `top_three_anchor_share`: `float` (share of top 3 anchors)
  - `hhi`: `float` (Herfindahl-Hirschman index)
  - `effective_anchor_count`: `float`

### 3.7 Cafe Archetype Matches (`corridors[].cafe_archetype_matches`)
Array of 31 evaluated cafe business concepts:
```json
{
  "archetype_id": "us.cafe.residential_amenity_cafe.v1",
  "name": "Residential amenity cafe",
  "score": 0.62697375,
  "decision_track": "CONTROLLED_HOST" | "OPEN_MARKET_SITE" | "LIVE_OPPORTUNITY",
  "host_context_present": true,
  "location_check": "HOST_AVAILABILITY_REQUIRED" | "PROPERTY_REQUIRED" | "HOST_REQUIRED",
  "policy_id": "nyc-v26-cafe-corridor-context-pull-v2"
}
```

---

## 4. Availability, Nullability & Edge Cases

### 4.1 The Two Corridor Tiers (`enrichment_status`)
There are **65 total corridors** partitioned cleanly into two tiers:
1. **60 MACRO Corridors** (`level: "MACRO"`, `enrichment_status: "AVAILABLE"`):
   - **All 20 requested fields are 100% populated.**
2. **5 SUB_CORRIDOR Corridors** (`level: "SUB_CORRIDOR"`, `enrichment_status: "PENDING"`):
   - Corridors: `Red Hook` (`QPkI026dCXN8`), `Roosevelt Island` (`bDDLHESYLI9r`), `Hudson Yards` (`mK6wmOBCZn5M`), `South Williamsburg` (`xD6JYrAHlLl6`), `West Shore–Richmond Valley` (`xoQ10TKm9AVm`).
   - Populated fields: Identity, borough, neighborhoods, `character`, `access`, `behavior` (including `daypart_occasion_density` and `resilience`), `audience_scores`, `audience_confidence`, `dominant_audience`.
   - **Null fields in these 5 corridors:** `places`, `demand_sources`, `demand_magnets`, `magnet_diversity`, `anchor_concentration`, `anchors`, `cafe_archetype_matches`, `occasions`.
   - **Handling rule:** The UI must check `corridor.enrichment_status === 'AVAILABLE'` before attempting to render place classes, demand donuts/bars, anchor tables, or cafe archetypes, or display a graceful "Enrichment Pending / Sub-Corridor" badge with parent corridor linkage.

### 4.2 Parent-Child Corridor Hierarchy
- `corridors[].parent_corridor_id`:
  - 4 sub-corridors link to a parent macro corridor ID:
    - Red Hook -> `FIaOuB84bGdf` (Gowanus–Red Hook)
    - Hudson Yards -> `9EjtYPylWJ6W` (Midtown West–Hudson Yards)
    - South Williamsburg -> `32KGGsjORd6x` (Williamsburg)
    - West Shore–Richmond Valley -> `FUJ1pBGpM8WR` (South Shore Staten Island)
  - Roosevelt Island has `parent_corridor_id: null`.
  - All 60 MACRO corridors have `parent_corridor_id: null`.

### 4.3 `spending_power` is Always Null
- `corridors[].spending_power` is `null` across **all 65 corridors**.
- **Handling rule:** Do not attempt to read or chart `spending_power`. Rely on `behavior.socioeconomic_shift` and audience profiles instead.

### 4.4 `access.barrier_note` May Be Empty
- 34 corridors have `access.barrier_note == ""`.
- **Handling rule:** Fall back to `gateway_dependency` rating if note is empty.

### 4.5 Character Encoding & Special Glyphs
- Text fields (`name`, `character`, `anchors[].name`) contain UTF-8 typographical characters such as en-dashes (`–`, `\u2013`), em-dashes (`—`), and curly quotes (`’`, `\u2019`).
- Example: `"West Shore–Richmond Valley"`, `"Empire Outlets–St. George Terminal"`.
- **Handling rule:** Ensure UTF-8 parsing throughout the frontend and backend stack.

### 4.6 Spatial Data (`map`)
- `data.map.geometry` is an **empty array** (`[]`).
- `data.map.corridor_context` contains **60 items** (one per AVAILABLE corridor). Each entry contains actual geographic representative points with `lat` and `lon`, category, family label, and place name.
- **Handling rule:** Map visualizations should consume `data.map.corridor_context` for coordinates and anchor points.

---

## 5. Summary of Safely Usable Fields for Dashboard Modules

| Dashboard View | Primary Field Sources | Safety / Fallback |
| :--- | :--- | :--- |
| **Corridor Selector & Header** | `corridor_id`, `name`, `borough`, `neighborhoods`, `level`, `enrichment_status` | 100% safe across all 65 |
| **Corridor Narrative & Insight**| `character`, `access`, `audience_evidence` | 100% safe across all 65 |
| **When Active (Dayparts)** | `behavior.daypart_occasion_density` (AM, Midday, Evening, Late Night, Weekend) | 100% safe across all 65 (12–97 scale) |
| **Who is Associated (Audience)**| `dominant_audience`, `audience_scores`, `audience_confidence`, `audience_segments` metadata | 100% safe across all 65 (0–10 scale) |
| **Resilience Profile** | `behavior.resilience` (shock, seasonality, event, development) | 100% safe across all 65 |
| **Demand Sources & Magnets** | `demand_sources`, `demand_magnets`, `magnet_diversity` | Safe for 60 AVAILABLE; check `enrichment_status` |
| **Place Composition** | `places.inventory`, `places.classes`, `places.categories` | Safe for 60 AVAILABLE; check `enrichment_status` |
| **Anchors & Concentration** | `anchors`, `anchor_concentration` | Safe for 60 AVAILABLE; check `enrichment_status` |
| **Business Archetype Fit** | `cafe_archetype_matches` | Safe for 60 AVAILABLE; check `enrichment_status` |
| **Interactive Map** | `map.corridor_context[].points` (`lat`, `lon`, `name`, `family`) | Available for 60 AVAILABLE corridors |
