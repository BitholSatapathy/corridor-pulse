import React, { useMemo } from 'react';
import { Sparkles, Clock, Users, Compass, ShieldCheck } from 'lucide-react';
import {
  formatDaypartShort,
  formatDemandSourceName,
  formatMagnetName,
  getAnchorConcentrationCategory
} from '../../utils/formatters';
import { computeCorridorPulseScore } from '../../utils/scoring';
import { audienceSegmentsMap } from '../../data/corridorsData';

export default function ExecutiveBrief({ corridor }) {
  if (!corridor) return null;

  const pulseData = useMemo(() => computeCorridorPulseScore(corridor), [corridor]);
  const behavior = corridor.behavior || {};
  const dayparts = behavior.daypart_occasion_density || {};
  const resilience = behavior.resilience || {};
  const demandSources = corridor.demand_sources;
  const demandMagnets = corridor.demand_magnets;
  const anchorConc = corridor.anchor_concentration;

  // 1. WHEN STRONGEST
  const whenData = useMemo(() => {
    let peakKey = 'weekday_evening';
    let peakVal = 0;
    Object.entries(dayparts).forEach(([k, v]) => {
      if (typeof v === 'number' && v > peakVal) {
        peakVal = v;
        peakKey = k;
      }
    });

    const weekdayAvg = ((dayparts.weekday_am || 0) + (dayparts.weekday_midday || 0) + (dayparts.weekday_evening || 0)) / 3;
    const weekendVal = dayparts.weekend_day || 0;
    let balanceDesc = 'Balanced diurnal pattern';
    if (weekendVal > weekdayAvg + 8) {
      balanceDesc = 'Weekend-skewed leisure & shopping destination';
    } else if (weekdayAvg > weekendVal + 8) {
      balanceDesc = 'Weekday-dominated commuter & workplace flow';
    } else {
      balanceDesc = 'Consistent 7-day diurnal footfall balance';
    }

    return {
      peakName: formatDaypartShort(peakKey),
      peakScore: peakVal,
      balanceDesc
    };
  }, [dayparts]);

  // 2. WHO MATTERS
  const whoData = useMemo(() => {
    const sortedAud = Object.entries(corridor.audience_scores || {}).sort((a, b) => b[1] - a[1]);
    if (sortedAud.length === 0 || sortedAud[0][1] === 0) {
      return {
        name: 'General Population',
        score: '5/10',
        desc: 'Broad, non-specialized local footfall base'
      };
    }
    const topEntry = sortedAud[0];
    const meta = audienceSegmentsMap.get(topEntry[0]);
    const name = meta?.label || topEntry[0].replace(/_/g, ' ');
    const score = topEntry[1];
    const conf = corridor.audience_confidence?.[topEntry[0]] || 'MEDIUM';

    return {
      name,
      score: `${score}/10`,
      desc: `${conf.toLowerCase()} confidence profile &bull; primary behavioral cohort`
    };
  }, [corridor]);

  // 3. WHAT DRIVES IT
  const whatData = useMemo(() => {
    let topSource = 'Diverse signals';
    if (demandSources) {
      const sortedDS = Object.entries(demandSources).sort((a, b) => b[1] - a[1]);
      if (sortedDS.length > 0) {
        topSource = formatDemandSourceName(sortedDS[0][0]);
      }
    }

    let topMagnet = 'Local storefronts';
    if (demandMagnets) {
      const sortedDM = Object.entries(demandMagnets).sort((a, b) => b[1] - a[1]);
      if (sortedDM.length > 0) {
        topMagnet = formatMagnetName(sortedDM[0][0]);
      }
    }

    return {
      leadDemand: topSource,
      leadMagnet: topMagnet,
      desc: `Propelled by ${topSource.toLowerCase()} with anchor pull from ${topMagnet.toLowerCase()}.`
    };
  }, [demandSources, demandMagnets]);

  // 4. HOW RESILIENT
  const howData = useMemo(() => {
    const shock = resilience.shock_resilience ?? 50;
    const season = resilience.seasonality_amplitude ?? 30;
    const eventDep = resilience.event_dependency ?? 20;

    let flag = 'Stable baseline';
    if (season > 45) {
      flag = 'Heightened seasonal variance';
    } else if (eventDep > 45) {
      flag = 'High event dependency';
    } else if (shock >= 60) {
      flag = 'Strong baseline shock buffer';
    } else if (shock < 40) {
      flag = 'Elevated structural vulnerability';
    }

    return {
      shockScore: `${shock}/100`,
      flag,
      desc: shock >= 55 ? 'High footfall stability with durable daily demand' : 'Sensitive to external macroeconomic or seasonal shifts'
    };
  }, [resilience]);

  // Synthesis Narrative Paragraph
  const pulseReadParagraph = useMemo(() => {
    const name = corridor.name;
    const status = pulseData?.status || 'ACTIVE';
    const peak = whenData.peakName;
    const who = whoData.name;
    const demand = whatData.leadDemand;
    const shock = resilience.shock_resilience ?? 50;

    return `${name} exhibits a ${status.toLowerCase()} commercial profile, registering its highest occasion density during ${peak}. Daily activity is predominantly anchored by ${who.toLowerCase()}, driven by ${demand.toLowerCase()}. With a shock resilience index of ${shock}/100, the corridor maintains a ${shock >= 55 ? 'resilient baseline against external disruptions' : 'more delicate footfall equilibrium requiring diversified anchor retention'}.`;
  }, [corridor.name, pulseData?.status, whenData.peakName, whoData.name, whatData.leadDemand, resilience.shock_resilience]);

  return (
    <div className="executive-brief-card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-label">Executive Brief</span>
          <h3 className="card-title">The Pulse Read</h3>
        </div>
        <span className="badge badge-status-active">
          <span className="badge-dot" />
          10-Second Synthesis
        </span>
      </div>

      {/* 4 Editorial Columns */}
      <div className="brief-columns-grid">
        <div className="brief-col">
          <span className="brief-col-header">1. When Strongest</span>
          <div className="brief-col-metric tabular-nums">
            {whenData.peakName} ({whenData.peakScore})
          </div>
          <p className="brief-col-desc">{whenData.balanceDesc}</p>
        </div>

        <div className="brief-col">
          <span className="brief-col-header">2. Who Matters</span>
          <div className="brief-col-metric" style={{ textTransform: 'capitalize' }}>
            {whoData.name} <span className="tabular-nums" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>({whoData.score})</span>
          </div>
          <p className="brief-col-desc" dangerouslySetInnerHTML={{ __html: whoData.desc }} />
        </div>

        <div className="brief-col">
          <span className="brief-col-header">3. What Drives It</span>
          <div className="brief-col-metric">
            {whatData.leadDemand}
          </div>
          <p className="brief-col-desc">{whatData.desc}</p>
        </div>

        <div className="brief-col">
          <span className="brief-col-header">4. How Resilient</span>
          <div className="brief-col-metric tabular-nums">
            {howData.shockScore} &bull; <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{howData.flag}</span>
          </div>
          <p className="brief-col-desc">{howData.desc}</p>
        </div>
      </div>

      {/* Pulse Read Paragraph */}
      <div className="pulse-narrative-box">
        <p>{pulseReadParagraph}</p>
      </div>
    </div>
  );
}
