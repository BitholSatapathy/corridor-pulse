/**
 * CORRIDOR PULSE — Corridor Comparison Utility Module
 * 
 * Compares two NYC commercial corridors across:
 * 1. Pulse Composite Score & 4 Components (Activity, Demand, Resilience, Diversification)
 * 2. 5 Diurnal Daypart Densities
 * 3. Top 3 Behavioral Audience Segments
 * 4. Top 3 Demand Sources & Top 3 Demand Magnets
 * 5. 4 Resilience Profile Dimensions
 * 6. Anchor Concentration Metrics & Key Anchor Landmarks
 * 7. Top 5 Place Classes (by listing count)
 * 8. Deterministic Rules-Based "Key Differences" Narrative Synthesis
 */

import { computeCorridorPulseScore } from './scoring.js';
import {
  formatDaypartShort,
  formatDemandSourceName,
  formatMagnetName,
  formatPlaceClassName,
  getAnchorConcentrationCategory,
  getConfidenceBadge
} from './formatters.js';
import { audienceSegmentsMap } from '../data/corridorsData.js';

export function compareCorridors(corridorA, corridorB) {
  if (!corridorA || !corridorB) return null;

  // 1. Pulse Scores
  const pulseA = computeCorridorPulseScore(corridorA);
  const pulseB = computeCorridorPulseScore(corridorB);

  // Component Winner & Delta Helpers
  function compareComponent(compKey) {
    const compA = pulseA.components[compKey];
    const compB = pulseB.components[compKey];

    const isPendingA = compA?.isPending || compA?.score == null;
    const isPendingB = compB?.isPending || compB?.score == null;

    if (isPendingA || isPendingB) {
      return {
        scoreA: compA?.score,
        scoreB: compB?.score,
        isPendingA,
        isPendingB,
        diff: null,
        winner: null
      };
    }

    const diff = Math.round(Math.abs(compA.score - compB.score) * 10) / 10;
    const winner = compA.score > compB.score ? 'A' : compB.score > compA.score ? 'B' : 'TIE';

    return {
      scoreA: compA.score,
      scoreB: compB.score,
      isPendingA: false,
      isPendingB: false,
      diff,
      winner
    };
  }

  const overallDiff = Math.round(Math.abs(pulseA.overallScore - pulseB.overallScore) * 10) / 10;
  const overallWinner = pulseA.overallScore > pulseB.overallScore ? 'A' : pulseB.overallScore > pulseA.overallScore ? 'B' : 'TIE';

  const componentComparison = {
    overall: {
      scoreA: pulseA.overallScore,
      scoreB: pulseB.overallScore,
      statusA: pulseA.status,
      statusB: pulseB.status,
      isPartialA: pulseA.isPartial,
      isPartialB: pulseB.isPartial,
      diff: overallDiff,
      winner: overallWinner
    },
    activity: compareComponent('activity'),
    demand: compareComponent('demand'),
    resilience: compareComponent('resilience'),
    diversification: compareComponent('diversification')
  };

  // 2. Activity Dayparts Breakdown
  const DAYPART_KEYS = ['weekday_am', 'weekday_midday', 'weekday_evening', 'late_night', 'weekend_day'];
  const dpA = corridorA.behavior?.daypart_occasion_density || {};
  const dpB = corridorB.behavior?.daypart_occasion_density || {};

  const daypartsComparison = DAYPART_KEYS.map(key => {
    const valA = dpA[key] ?? 0;
    const valB = dpB[key] ?? 0;
    const diff = Math.abs(valA - valB);
    const winner = valA > valB ? 'A' : valB > valA ? 'B' : 'TIE';

    return {
      key,
      label: formatDaypartShort(key),
      valA,
      valB,
      diff,
      winner
    };
  });

  // 3. Top 3 Audiences
  function getTop3Audiences(c) {
    const scores = c.audience_scores || {};
    const conf = c.audience_confidence || {};
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([segId, score]) => {
        const meta = audienceSegmentsMap.get(segId) || {};
        return {
          id: segId,
          label: meta.label || segId.replace(/_/g, ' '),
          familyId: meta.family_id || 'general',
          score,
          confidence: conf[segId] || 'LOW'
        };
      });
  }

  const audiencesA = getTop3Audiences(corridorA);
  const audiencesB = getTop3Audiences(corridorB);

  // 4. Demand Sources & Magnets
  function getTop3Sources(c) {
    if (!c.demand_sources) return null;
    return Object.entries(c.demand_sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({
        key: k,
        label: formatDemandSourceName(k),
        value: v
      }));
  }

  function getTop3Magnets(c) {
    if (!c.demand_magnets) return null;
    return Object.entries(c.demand_magnets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({
        key: k,
        label: formatMagnetName(k),
        value: v
      }));
  }

  const demandSourcesA = getTop3Sources(corridorA);
  const demandSourcesB = getTop3Sources(corridorB);
  const demandMagnetsA = getTop3Magnets(corridorA);
  const demandMagnetsB = getTop3Magnets(corridorB);

  // 5. Resilience Matrix
  const resA = corridorA.behavior?.resilience || {};
  const resB = corridorB.behavior?.resilience || {};

  const resilienceMatrix = [
    {
      key: 'shock_resilience',
      name: 'Shock Resilience',
      valA: resA.shock_resilience ?? '--',
      valB: resB.shock_resilience ?? '--',
      semantics: 'Capacity Metric (Higher is better)',
      higherIsBetter: true
    },
    {
      key: 'seasonality_amplitude',
      name: 'Seasonality Amplitude',
      valA: resA.seasonality_amplitude ?? '--',
      valB: resB.seasonality_amplitude ?? '--',
      semantics: 'Volatility Signal (Variance magnitude)',
      higherIsBetter: false
    },
    {
      key: 'event_dependency',
      name: 'Event Dependency',
      valA: resA.event_dependency ?? '--',
      valB: resB.event_dependency ?? '--',
      semantics: 'Sensitivity (Higher = greater reliance)',
      higherIsBetter: false
    },
    {
      key: 'development_dependency',
      name: 'Development Dependency',
      valA: resA.development_dependency ?? '--',
      valB: resB.development_dependency ?? '--',
      semantics: 'Sensitivity (Capital pipeline dependent)',
      higherIsBetter: false
    }
  ];

  // 6. Anchor Concentration & Anchors
  const acA = corridorA.anchor_concentration;
  const acB = corridorB.anchor_concentration;
  const catA = acA ? getAnchorConcentrationCategory(acA.top_three_anchor_share, acA.effective_anchor_count) : null;
  const catB = acB ? getAnchorConcentrationCategory(acB.top_three_anchor_share, acB.effective_anchor_count) : null;

  const anchorsComparison = {
    isPendingA: !acA,
    isPendingB: !acB,
    categoryA: catA?.label || 'Pending',
    categoryB: catB?.label || 'Pending',
    categoryClassA: catA?.class || 'badge-conc-pending',
    categoryClassB: catB?.class || 'badge-conc-pending',
    top1ShareA: acA ? (acA.top_anchor_share * 100).toFixed(1) : null,
    top1ShareB: acB ? (acB.top_anchor_share * 100).toFixed(1) : null,
    top3ShareA: acA ? (acA.top_three_anchor_share * 100).toFixed(1) : null,
    top3ShareB: acB ? (acB.top_three_anchor_share * 100).toFixed(1) : null,
    effectiveAnchorsA: acA ? acA.effective_anchor_count?.toFixed(1) : null,
    effectiveAnchorsB: acB ? acB.effective_anchor_count?.toFixed(1) : null,
    hhiA: acA ? acA.hhi?.toFixed(3) : null,
    hhiB: acB ? acB.hhi?.toFixed(3) : null,
    anchorsListA: corridorA.anchors || [],
    anchorsListB: corridorB.anchors || []
  };

  // 7. Places Comparison (Top 5 Classes)
  function getTop5Places(c) {
    if (!c.places?.classes) return null;
    return Object.entries(c.places.classes)
      .map(([cls, data]) => ({
        class: cls,
        label: formatPlaceClassName(cls),
        listingCount: data.listing_count || 0,
        siteCount: data.coordinate_site_count || 0
      }))
      .filter(p => p.listingCount > 0)
      .sort((a, b) => b.listingCount - a.listingCount)
      .slice(0, 5);
  }

  const placesA = getTop5Places(corridorA);
  const placesB = getTop5Places(corridorB);

  // 8. Deterministic "Key Differences" Narrative Synthesis
  const keyDifferences = [];

  // Sentence 1: Pulse Score & Driver Attribution
  if (overallWinner === 'A') {
    const drivers = [];
    if (componentComparison.activity.winner === 'A') drivers.push('higher diurnal activity density');
    if (componentComparison.resilience.winner === 'A') drivers.push('superior shock resilience');
    if (componentComparison.demand.winner === 'A') drivers.push('broader demand draw');
    if (componentComparison.diversification.winner === 'A') drivers.push('more diversified anchor dispersion');
    const driverText = drivers.length > 0 ? `, driven by ${drivers.slice(0, 2).join(' and ')}` : '';
    keyDifferences.push(`${corridorA.name} holds a higher composite Pulse score (${pulseA.overallScore} vs ${pulseB.overallScore}${pulseB.isPartial ? ' [partial]' : ''})${driverText}.`);
  } else if (overallWinner === 'B') {
    const drivers = [];
    if (componentComparison.activity.winner === 'B') drivers.push('higher diurnal activity density');
    if (componentComparison.resilience.winner === 'B') drivers.push('superior shock resilience');
    if (componentComparison.demand.winner === 'B') drivers.push('broader demand draw');
    if (componentComparison.diversification.winner === 'B') drivers.push('more diversified anchor dispersion');
    const driverText = drivers.length > 0 ? `, driven by ${drivers.slice(0, 2).join(' and ')}` : '';
    keyDifferences.push(`${corridorB.name} holds a higher composite Pulse score (${pulseB.overallScore} vs ${pulseA.overallScore}${pulseA.isPartial ? ' [partial]' : ''})${driverText}.`);
  } else {
    keyDifferences.push(`${corridorA.name} and ${corridorB.name} register identical overall Pulse scores (${pulseA.overallScore}/100), but diverge in their structural drivers.`);
  }

  // Sentence 2: Demand Source Character Contrast
  if (demandSourcesA && demandSourcesB) {
    const leadA = demandSourcesA[0];
    const leadB = demandSourcesB[0];
    if (leadA.key === leadB.key) {
      keyDifferences.push(`Both corridors share ${leadA.label.toLowerCase()} as their primary demand driver, though intensity differs (${leadA.value.toFixed(2)} in ${corridorA.name} vs ${leadB.value.toFixed(2)} in ${corridorB.name}).`);
    } else {
      keyDifferences.push(`${corridorA.name} is primarily ${leadA.label.toLowerCase()}-driven (${leadA.value.toFixed(2)}), whereas ${corridorB.name} is anchored by ${leadB.label.toLowerCase()} (${leadB.value.toFixed(2)}).`);
    }
  } else if (demandSourcesA && !demandSourcesB) {
    const leadA = demandSourcesA[0];
    keyDifferences.push(`${corridorA.name} demonstrates strong ${leadA.label.toLowerCase()} (${leadA.value.toFixed(2)}), while ${corridorB.name}'s demand source cataloging is pending.`);
  } else if (!demandSourcesA && demandSourcesB) {
    const leadB = demandSourcesB[0];
    keyDifferences.push(`${corridorB.name} demonstrates strong ${leadB.label.toLowerCase()} (${leadB.value.toFixed(2)}), while ${corridorA.name}'s demand source cataloging is pending.`);
  }

  // Sentence 3: Resilience Profile Contrast (Across all 4 verified dimensions)
  const shockA = resA.shock_resilience ?? 50;
  const shockB = resB.shock_resilience ?? 50;
  const eventA = resA.event_dependency ?? 20;
  const eventB = resB.event_dependency ?? 20;
  const seasonA = resA.seasonality_amplitude ?? 30;
  const seasonB = resB.seasonality_amplitude ?? 30;
  const devA = resA.development_dependency ?? 40;
  const devB = resB.development_dependency ?? 40;

  if (Math.abs(eventA - eventB) >= 10 || Math.abs(shockA - shockB) >= 8) {
    if (eventA < eventB && shockA >= shockB) {
      keyDifferences.push(`${corridorA.name} exhibits a more insulated profile with lower event sensitivity (${eventA} vs ${eventB}/100) and equal-to-higher shock capacity (${shockA} vs ${shockB}/100).`);
    } else if (eventB < eventA && shockB >= shockA) {
      keyDifferences.push(`${corridorB.name} exhibits a more insulated profile with lower event sensitivity (${eventB} vs ${eventA}/100) and equal-to-higher shock capacity (${shockB} vs ${shockA}/100).`);
    } else if (eventA < eventB) {
      keyDifferences.push(`${corridorA.name} has lower event dependency (${eventA} vs ${eventB}/100), reducing its vulnerability to calendar or stadium voids.`);
    } else {
      keyDifferences.push(`${corridorB.name} has lower event dependency (${eventB} vs ${eventA}/100), reducing its vulnerability to calendar or stadium voids.`);
    }
  } else if (Math.abs(seasonA - seasonB) >= 10) {
    if (seasonA < seasonB) {
      keyDifferences.push(`${corridorA.name} demonstrates lower seasonality amplitude (${seasonA} vs ${seasonB}/100), sustaining more consistent demand across calendar cycles.`);
    } else {
      keyDifferences.push(`${corridorB.name} demonstrates lower seasonality amplitude (${seasonB} vs ${seasonA}/100), sustaining more consistent demand across calendar cycles.`);
    }
  } else if (Math.abs(devA - devB) >= 10) {
    if (devA < devB) {
      keyDifferences.push(`${corridorA.name} operates with lower development dependency (${devA} vs ${devB}/100), having greater independence from active real estate construction cycles.`);
    } else {
      keyDifferences.push(`${corridorB.name} operates with lower development dependency (${devB} vs ${devA}/100), having greater independence from active real estate construction cycles.`);
    }
  }

  // Sentence 4: Anchor Dependency Contrast
  if (acA && acB) {
    if (catA.label !== catB.label) {
      keyDifferences.push(`${corridorA.name} reflects ${catA.label.toLowerCase()} anchor concentration (${anchorsComparison.top3ShareA}% in top 3), compared to ${catB.label.toLowerCase()} concentration in ${corridorB.name} (${anchorsComparison.top3ShareB}%).`);
    } else {
      keyDifferences.push(`Both corridors exhibit ${catA.label.toLowerCase()} anchor concentration, with effective anchor counts of ${anchorsComparison.effectiveAnchorsA} vs ${anchorsComparison.effectiveAnchorsB}.`);
    }
  }

  return {
    corridorA,
    corridorB,
    pulseA,
    pulseB,
    componentComparison,
    daypartsComparison,
    audiencesA,
    audiencesB,
    demandSourcesA,
    demandSourcesB,
    demandMagnetsA,
    demandMagnetsB,
    resilienceMatrix,
    anchorsComparison,
    placesA,
    placesB,
    keyDifferences
  };
}
