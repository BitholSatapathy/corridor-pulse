/**
 * CORRIDOR PULSE SCORECARD — Scoring Methodology Module
 * 
 * IMPORTANT:
 * This is our own derived analytical diagnostic layer.
 * It must NOT be presented as an official dataset score, prediction of revenue,
 * success probability, or census population count.
 * 
 * Methodology & Weight Distribution:
 * 1. ACTIVITY (30%): Mean diurnal density across 5 dayparts.
 * 2. DEMAND (25%): Balance of top demand source intensity and magnet diversity.
 * 3. RESILIENCE (25%): Shock absorption capacity dampened by volatility and event/dev dependencies.
 * 4. ANCHOR DIVERSIFICATION (20%): Dispersion across effective anchors and top-3 concentration resistance.
 * 
 * Sub-corridors with pending place/anchor enrichment are scored using a normalized
 * re-weighted formula across available components (Activity 30/55, Resilience 25/55)
 * and explicitly flagged as PARTIAL.
 */

/**
 * 1. Activity Component (30%)
 * Calculates the mean diurnal occasion density across the five standardized dayparts.
 * Input values range from ~12 to 97, naturally fitting a 0–100 scale.
 */
export function calculateActivityScore(corridor) {
  const dayparts = corridor?.behavior?.daypart_occasion_density;
  if (!dayparts) return { score: 50, details: 'Default baseline' };

  const values = [
    dayparts.weekday_am ?? 0,
    dayparts.weekday_midday ?? 0,
    dayparts.weekday_evening ?? 0,
    dayparts.late_night ?? 0,
    dayparts.weekend_day ?? 0
  ];

  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  const normalized = Math.min(100, Math.max(0, Math.round(mean * 10) / 10));

  return {
    score: normalized,
    meanDaypart: normalized,
    peakDaypart: Math.max(...values),
    details: 'Mean intensity across 5 standardized dayparts'
  };
}

/**
 * 2. Demand Component (25%)
 * Evaluates the depth and breadth of contextual demand sources.
 * - Strength (55%): Average intensity of the primary & secondary demand sources.
 * - Diversity (45%): Spread across the 15 demand driver categories (magnet diversity index 0.85–0.99).
 * Returns null if demand_sources is not available (e.g. pending sub-corridor).
 */
export function calculateDemandScore(corridor) {
  const sources = corridor?.demand_sources;
  if (!sources || typeof sources !== 'object') {
    return { score: null, isPending: true, details: 'Demand source data pending ingestion' };
  }

  const values = Object.values(sources).filter(v => typeof v === 'number');
  if (values.length === 0) {
    return { score: null, isPending: true, details: 'Demand source data pending ingestion' };
  }

  // Top 2 source intensity
  const sorted = [...values].sort((a, b) => b - a);
  const top2Avg = sorted.length >= 2 ? (sorted[0] + sorted[1]) / 2 : sorted[0];
  const strengthScore = Math.min(100, Math.max(0, top2Avg * 100));

  // Magnet diversity index (empirical range: ~0.85 to 0.99)
  const magDiv = corridor?.magnet_diversity ?? 0.90;
  const diversityScore = Math.min(100, Math.max(0, ((magDiv - 0.80) / 0.20) * 100));

  // Combined score
  const score = Math.round((0.55 * strengthScore + 0.45 * diversityScore) * 10) / 10;

  return {
    score,
    strengthScore: Math.round(strengthScore),
    diversityScore: Math.round(diversityScore),
    isPending: false,
    details: 'Composite of primary source pull & magnet category diversity'
  };
}

/**
 * 3. Resilience Component (25%)
 * Diagnostic stress-tolerance score:
 * - Shock Resilience (60% weight, positive): Higher shock resistance improves the diagnostic.
 * - Volatility & Dependency Dampener (40% weight, penalty):
 *     Penalizes heightened seasonality amplitude, event calendar reliance, and dev dependency.
 * Available across all 65 corridors.
 */
export function calculateResilienceScore(corridor) {
  const resilience = corridor?.behavior?.resilience;
  if (!resilience) return { score: 50, details: 'Default baseline' };

  const shock = resilience.shock_resilience ?? 50;
  const seasonality = resilience.seasonality_amplitude ?? 30;
  const event = resilience.event_dependency ?? 20;
  const development = resilience.development_dependency ?? 40;

  // Composite penalty (0–100)
  const penalty = seasonality * 0.35 + event * 0.35 + development * 0.30;
  const penaltyDamping = Math.max(0, 100 - penalty);

  // Combined diagnostic resilience
  const score = Math.min(100, Math.max(0, Math.round((0.60 * shock + 0.40 * penaltyDamping) * 10) / 10));

  return {
    score,
    shockScore: shock,
    penaltyScore: Math.round(penalty),
    details: 'Shock capacity balanced against seasonal & event vulnerability'
  };
}

/**
 * 4. Anchor Diversification Component (20%)
 * Measures ecosystem decentralization:
 * - Top 3 Anchor Share (50%): Lower top-3 share yields higher diversification.
 * - Effective Anchor Count (50%): Higher effective anchor count yields higher score.
 * Returns null if anchor_concentration is not available (e.g. pending sub-corridor).
 */
export function calculateDiversificationScore(corridor) {
  const conc = corridor?.anchor_concentration;
  if (!conc || typeof conc !== 'object') {
    return { score: null, isPending: true, details: 'Anchor concentration data pending ingestion' };
  }

  const top3Share = conc.top_three_anchor_share ?? 0.45; // range: 0.39 – 0.59
  const effCount = conc.effective_anchor_count ?? 7.0;  // range: 5.4 – 8.0

  // Top 3 Share Score: 0.39 -> ~87 score, 0.59 -> ~20 score
  const shareScore = Math.max(0, Math.min(100, ((0.65 - top3Share) / 0.30) * 100));

  // Effective Count Score: 5.4 -> ~13 score, 8.0 -> ~100 score
  const countScore = Math.max(0, Math.min(100, ((effCount - 5.0) / 3.0) * 100));

  const score = Math.round((0.50 * shareScore + 0.50 * countScore) * 10) / 10;

  return {
    score,
    top3Share: Math.round(top3Share * 100),
    effectiveCount: effCount,
    isPending: false,
    details: 'Resistance to single-anchor footfall bottlenecking'
  };
}

/**
 * Interpretive Status Classification
 * Rules documented:
 * - FRAGILE: Resilience diagnostic < 50
 * - CONCENTRATED: Anchor diversification < 55 or high top-3 concentration
 * - ACTIVE: Activity score >= 65 and overall score >= 60
 * - BALANCED: Demand >= 60 & Diversification >= 60 with moderate resilience
 * - STABLE: Resilience >= 60 with consistent baseline activity
 */
export function getPulseStatus(overallScore, act, dem, res, div, isPartial) {
  if (isPartial) {
    if (act >= 65) return { status: 'ACTIVE', desc: 'High diurnal footfall intensity across morning and evening windows.' };
    if (res >= 60) return { status: 'STABLE', desc: 'Durable residential baseline with strong shock absorption.' };
    return { status: 'BALANCED', desc: 'Balanced baseline activity with moderate stress tolerance.' };
  }

  if (res < 50) {
    return {
      status: 'FRAGILE',
      desc: 'Heightened sensitivity to demand volatility, event voids, or macro disruption.'
    };
  }
  if (div != null && div < 55) {
    return {
      status: 'CONCENTRATED',
      desc: 'Heavy footfall reliance on a small cluster of dominant destination anchors.'
    };
  }
  if (act >= 65 && overallScore >= 65) {
    return {
      status: 'ACTIVE',
      desc: 'Dynamic, high-density pedestrian flow sustained across multiple dayparts.'
    };
  }
  if (dem != null && dem >= 65 && div != null && div >= 65) {
    return {
      status: 'BALANCED',
      desc: 'Equitable blend of diverse demand drivers and well-dispersed anchors.'
    };
  }
  if (res >= 60) {
    return {
      status: 'STABLE',
      desc: 'Steady, shock-resilient commercial fabric insulated from extreme swings.'
    };
  }
  return {
    status: 'BALANCED',
    desc: 'Moderate balance across activity, demand sources, and anchor diversity.'
  };
}

/**
 * Composite Pulse Score Calculator
 * Main entry point for the Scorecard.
 */
export function computeCorridorPulseScore(corridor) {
  if (!corridor) return null;

  const activity = calculateActivityScore(corridor);
  const demand = calculateDemandScore(corridor);
  const resilience = calculateResilienceScore(corridor);
  const diversification = calculateDiversificationScore(corridor);

  const isPartial = demand.isPending || diversification.isPending;

  let overallScore = 0;
  if (isPartial) {
    // Re-weight available Activity (30/55) and Resilience (25/55)
    overallScore = activity.score * (30 / 55) + resilience.score * (25 / 55);
  } else {
    // Canonical 30% / 25% / 25% / 20% weighting
    overallScore =
      activity.score * 0.30 +
      demand.score * 0.25 +
      resilience.score * 0.25 +
      diversification.score * 0.20;
  }

  overallScore = Math.min(100, Math.max(0, Math.round(overallScore * 10) / 10));

  const statusInfo = getPulseStatus(
    overallScore,
    activity.score,
    demand.score,
    resilience.score,
    diversification.score,
    isPartial
  );

  return {
    overallScore,
    status: statusInfo.status,
    statusDescription: statusInfo.desc,
    isPartial,
    weights: isPartial
      ? { activity: '54.5% (adj.)', demand: 'Pending', resilience: '45.5% (adj.)', diversification: 'Pending' }
      : { activity: '30%', demand: '25%', resilience: '25%', diversification: '20%' },
    components: {
      activity,
      demand,
      resilience,
      diversification
    }
  };
}
