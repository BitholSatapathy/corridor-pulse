import React from 'react';
import {
  ArrowLeft,
  GitCompare,
  Sparkles,
  Trophy,
  Activity,
  Compass,
  ShieldCheck,
  Layers,
  Clock,
  Users,
  Store,
  Anchor,
  AlertCircle,
  Landmark,
  CheckCircle2,
  Info
} from 'lucide-react';
import { compareCorridors } from '../utils/comparison';
import { getBoroughBadgeColor, getConfidenceBadge } from '../utils/formatters';

export default function CorridorComparison({
  corridorA,
  corridorB,
  onExitComparison,
  onSelectCorridorA,
  onSelectCorridorB,
  allCorridors
}) {
  if (!corridorA || !corridorB) return null;

  const comparison = compareCorridors(corridorA, corridorB);
  if (!comparison) return null;

  const {
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
  } = comparison;

  return (
    <div className="comparison-container">
      {/* Top Controls & Dual Corridor Selectors Header */}
      <div className="comparison-top-bar">
        <div className="comparison-title-row">
          <div className="comp-title-group">
            <GitCompare className="icon-md text-cyan" />
            <div>
              <h2 className="comparison-main-title">SIDE-BY-SIDE CORRIDOR COMPARISON</h2>
              <p className="comparison-subtitle">
                Differential behavioral intelligence across two NYC commercial corridors
              </p>
            </div>
          </div>

          <button
            type="button"
            className="exit-comparison-btn"
            onClick={onExitComparison}
          >
            <ArrowLeft className="icon-sm" />
            <span>Exit Comparison</span>
          </button>
        </div>

        {/* Dual Corridor Selector Bar */}
        <div className="dual-selector-grid">
          {/* Corridor A Selector */}
          <div className="corridor-select-card card-corridor-a">
            <div className="select-card-header">
              <span className="corridor-tag tag-a">CORRIDOR A</span>
              <span className={`badge-borough-sm ${getBoroughBadgeColor(corridorA.borough)}`}>
                {corridorA.borough}
              </span>
              {corridorA.level === 'SUB_CORRIDOR' && <span className="badge-sub-sm">Sub-Corridor</span>}
            </div>

            <select
              className="corridor-native-select"
              value={corridorA.corridor_id}
              onChange={(e) => {
                const found = allCorridors.find(c => c.corridor_id === e.target.value);
                if (found) onSelectCorridorA(found);
              }}
            >
              {allCorridors.map(c => (
                <option key={c.corridor_id} value={c.corridor_id}>
                  {c.name} ({c.borough}) {c.level === 'SUB_CORRIDOR' ? '[Sub]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="vs-divider-badge">VS</div>

          {/* Corridor B Selector */}
          <div className="corridor-select-card card-corridor-b">
            <div className="select-card-header">
              <span className="corridor-tag tag-b">CORRIDOR B</span>
              <span className={`badge-borough-sm ${getBoroughBadgeColor(corridorB.borough)}`}>
                {corridorB.borough}
              </span>
              {corridorB.level === 'SUB_CORRIDOR' && <span className="badge-sub-sm">Sub-Corridor</span>}
            </div>

            <select
              className="corridor-native-select"
              value={corridorB.corridor_id}
              onChange={(e) => {
                const found = allCorridors.find(c => c.corridor_id === e.target.value);
                if (found) onSelectCorridorB(found);
              }}
            >
              {allCorridors.map(c => (
                <option key={c.corridor_id} value={c.corridor_id}>
                  {c.name} ({c.borough}) {c.level === 'SUB_CORRIDOR' ? '[Sub]' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KEY DIFFERENCES INSIGHT BANNER */}
      <div className="comparison-insight-card">
        <div className="comp-insight-header">
          <div className="pulse-indicator">
            <Sparkles className="icon-xs text-cyan" />
            <span className="comp-insight-tag">KEY DIFFERENCES & CONTRASTS</span>
          </div>
          <span className="rules-tag">Rules-Based Comparative Synthesis</span>
        </div>

        <div className="comp-insight-body">
          {keyDifferences.map((sentence, idx) => (
            <p key={idx} className="comp-insight-sentence">
              <span className="sentence-marker text-cyan">{idx + 1}.</span>
              <span>{sentence}</span>
            </p>
          ))}
        </div>
      </div>

      {/* 1. PULSE SCORE & 4 COMPONENTS COMPARISON */}
      <div className="comparison-section-card">
        <div className="comp-sec-header">
          <div className="comp-sec-title-group">
            <Trophy className="icon-sm text-cyan" />
            <h3 className="comp-sec-title">PULSE SCORE & CORE COMPONENTS</h3>
          </div>
          <span className="comp-sec-subtitle">Standardized 0–100 Diagnostic Comparison</span>
        </div>

        {/* Overall Score Comparison Hero */}
        <div className="overall-comp-grid">
          {/* Corridor A Score Card */}
          <div className={`overall-score-hero hero-a ${componentComparison.overall.winner === 'A' ? 'is-winner' : ''}`}>
            <div className="hero-top">
              <span className="hero-corridor-name">{corridorA.name}</span>
              <span className="hero-tag tag-a">Corridor A</span>
            </div>
            <div className="hero-score-row">
              <span className="hero-score-number text-cyan">{pulseA.overallScore}</span>
              <span className="hero-score-unit">/ 100</span>
            </div>
            <div className="hero-badge-row">
              <span className="badge-pulse-status">{pulseA.status}</span>
              {pulseA.isPartial && <span className="badge-partial">Partial Diagnostic</span>}
              {componentComparison.overall.winner === 'A' && (
                <span className="winner-chip chip-a">+ {componentComparison.overall.diff} Lead</span>
              )}
            </div>
          </div>

          <div className="comp-score-delta-col">
            <span className="delta-label">DIAGNOSTIC MARGIN</span>
            <span className="delta-number">
              {componentComparison.overall.diff === 0 ? 'TIED' : `Δ ${componentComparison.overall.diff} pts`}
            </span>
            <span className="delta-sub">
              {componentComparison.overall.winner === 'TIE'
                ? 'Equivalent overall pulse'
                : `Higher: ${componentComparison.overall.winner === 'A' ? corridorA.name : corridorB.name}`}
            </span>
          </div>

          {/* Corridor B Score Card */}
          <div className={`overall-score-hero hero-b ${componentComparison.overall.winner === 'B' ? 'is-winner' : ''}`}>
            <div className="hero-top">
              <span className="hero-corridor-name">{corridorB.name}</span>
              <span className="hero-tag tag-b">Corridor B</span>
            </div>
            <div className="hero-score-row">
              <span className="hero-score-number text-purple">{pulseB.overallScore}</span>
              <span className="hero-score-unit">/ 100</span>
            </div>
            <div className="hero-badge-row">
              <span className="badge-pulse-status">{pulseB.status}</span>
              {pulseB.isPartial && <span className="badge-partial">Partial Diagnostic</span>}
              {componentComparison.overall.winner === 'B' && (
                <span className="winner-chip chip-b">+ {componentComparison.overall.diff} Lead</span>
              )}
            </div>
          </div>
        </div>

        {/* 4 Component Side-by-Side Comparison Bars */}
        <div className="components-comp-list">
          {[
            { key: 'activity', name: 'Activity Density', weight: '30%', icon: Activity, data: componentComparison.activity },
            { key: 'demand', name: 'Demand Pull', weight: '25%', icon: Compass, data: componentComparison.demand },
            { key: 'resilience', name: 'Stress Resilience', weight: '25%', icon: ShieldCheck, data: componentComparison.resilience },
            { key: 'diversification', name: 'Anchor Diversification', weight: '20%', icon: Layers, data: componentComparison.diversification }
          ].map(({ key, name, weight, icon: Icon, data }) => (
            <div key={key} className="comp-metric-row">
              <div className="comp-metric-name-col">
                <Icon className="icon-xs text-muted" />
                <div>
                  <span className="comp-name">{name}</span>
                  <span className="comp-wt">({weight})</span>
                </div>
              </div>

              {/* Bar & Values Grid */}
              <div className="comp-bars-track-grid">
                {/* Value A */}
                <div className="bar-val-col text-cyan">
                  {data.isPendingA ? <span className="badge-pending-comp">Enrichment pending</span> : data.scoreA}
                </div>

                {/* Comparative Dual Bars */}
                <div className="dual-progress-track">
                  <div
                    className={`dual-fill fill-cyan ${data.winner === 'A' ? 'lead-bar' : ''}`}
                    style={{ width: `${data.scoreA || 0}%` }}
                  />
                  <div
                    className={`dual-fill fill-purple ${data.winner === 'B' ? 'lead-bar' : ''}`}
                    style={{ width: `${data.scoreB || 0}%` }}
                  />
                </div>

                {/* Value B */}
                <div className="bar-val-col text-purple">
                  {data.isPendingB ? <span className="badge-pending-comp">Enrichment pending</span> : data.scoreB}
                </div>
              </div>

              {/* Winner Pill */}
              <div className="comp-winner-col">
                {data.winner === 'A' && <span className="winner-tag tag-a">A Leads +{data.diff}</span>}
                {data.winner === 'B' && <span className="winner-tag tag-b">B Leads +{data.diff}</span>}
                {data.winner === 'TIE' && <span className="winner-tag tag-tie">Equal</span>}
                {data.diff == null && <span className="winner-tag tag-pending">Partial Diagnostic</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ACTIVITY (DAYPARTS) COMPARISON */}
      <div className="comparison-section-card">
        <div className="comp-sec-header">
          <div className="comp-sec-title-group">
            <Clock className="icon-sm text-cyan" />
            <h3 className="comp-sec-title">ACTIVITY RHYTHM COMPARISON</h3>
          </div>
          <span className="comp-sec-subtitle">5 Diurnal Occasion Dayparts</span>
        </div>

        <div className="dayparts-comp-grid">
          {daypartsComparison.map(({ key, label, valA, valB, diff, winner }) => (
            <div key={key} className="daypart-comp-cell">
              <div className="daypart-cell-header">
                <span className="daypart-cell-name">{label}</span>
                <span className="daypart-cell-diff">
                  {winner === 'A' ? `A +${diff}` : winner === 'B' ? `B +${diff}` : 'Equal'}
                </span>
              </div>

              <div className="daypart-dual-bars">
                {/* A Bar */}
                <div className="daypart-sub-bar">
                  <span className="daypart-sub-lbl text-cyan">A</span>
                  <div className="daypart-mini-track">
                    <div className="mini-fill fill-cyan" style={{ width: `${valA}%` }} />
                  </div>
                  <span className="daypart-sub-val">{valA}</span>
                </div>

                {/* B Bar */}
                <div className="daypart-sub-bar">
                  <span className="daypart-sub-lbl text-purple">B</span>
                  <div className="daypart-mini-track">
                    <div className="mini-fill fill-purple" style={{ width: `${valB}%` }} />
                  </div>
                  <span className="daypart-sub-val">{valB}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. DUAL COLUMN: AUDIENCE & DEMAND */}
      <div className="dashboard-grid">
        {/* Audiences Side-by-Side */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title-group">
              <Users className="icon-sm text-cyan" />
              <h3 className="section-title">TOP AUDIENCES</h3>
            </div>
            <span className="section-subtitle">Top 3 Behavioral Segments</span>
          </div>

          <div className="side-by-side-cols">
            {/* Column A */}
            <div className="sub-column col-a">
              <span className="col-header-tag tag-a">{corridorA.name}</span>
              <div className="ranked-list">
                {audiencesA.map((aud, i) => (
                  <div key={aud.id} className="ranked-item-compact">
                    <div className="ranked-item-left">
                      <span className="item-rank">#{i + 1}</span>
                      <div>
                        <div className="item-title">{aud.label}</div>
                        <span className="item-sub-tag">{aud.familyId}</span>
                      </div>
                    </div>
                    <div className="item-score-badge text-cyan">
                      {aud.score} / 10
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column B */}
            <div className="sub-column col-b">
              <span className="col-header-tag tag-b">{corridorB.name}</span>
              <div className="ranked-list">
                {audiencesB.map((aud, i) => (
                  <div key={aud.id} className="ranked-item-compact">
                    <div className="ranked-item-left">
                      <span className="item-rank">#{i + 1}</span>
                      <div>
                        <div className="item-title">{aud.label}</div>
                        <span className="item-sub-tag">{aud.familyId}</span>
                      </div>
                    </div>
                    <div className="item-score-badge text-purple">
                      {aud.score} / 10
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demand Drivers Side-by-Side */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title-group">
              <Compass className="icon-sm text-emerald" />
              <h3 className="section-title">TOP DEMAND DRIVERS</h3>
            </div>
            <span className="section-subtitle">Top 3 Sources & Magnets</span>
          </div>

          <div className="side-by-side-cols">
            {/* Column A */}
            <div className="sub-column col-a">
              <span className="col-header-tag tag-a">{corridorA.name}</span>
              {!demandSourcesA ? (
                <div className="pending-mini-box">Demand Data: Enrichment pending</div>
              ) : (
                <div className="demand-ranked-block">
                  <span className="sub-block-title">Demand Sources</span>
                  <div className="ranked-list">
                    {demandSourcesA.map((src, i) => (
                      <div key={src.key} className="ranked-item-compact">
                        <span className="item-title">{src.label}</span>
                        <span className="item-score-badge text-cyan">{src.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <span className="sub-block-title mt-2">Top Magnets</span>
                  <div className="ranked-list">
                    {demandMagnetsA.map((mag, i) => (
                      <div key={mag.key} className="ranked-item-compact">
                        <span className="item-title">{mag.label}</span>
                        <span className="item-score-badge text-cyan">{mag.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column B */}
            <div className="sub-column col-b">
              <span className="col-header-tag tag-b">{corridorB.name}</span>
              {!demandSourcesB ? (
                <div className="pending-mini-box">Demand Data: Enrichment pending</div>
              ) : (
                <div className="demand-ranked-block">
                  <span className="sub-block-title">Demand Sources</span>
                  <div className="ranked-list">
                    {demandSourcesB.map((src, i) => (
                      <div key={src.key} className="ranked-item-compact">
                        <span className="item-title">{src.label}</span>
                        <span className="item-score-badge text-purple">{src.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <span className="sub-block-title mt-2">Top Magnets</span>
                  <div className="ranked-list">
                    {demandMagnetsB.map((mag, i) => (
                      <div key={mag.key} className="ranked-item-compact">
                        <span className="item-title">{mag.label}</span>
                        <span className="item-score-badge text-purple">{mag.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. DUAL COLUMN: RESILIENCE & ANCHORS */}
      <div className="dashboard-grid">
        {/* Resilience Matrix */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title-group">
              <ShieldCheck className="icon-sm text-purple" />
              <h3 className="section-title">RESILIENCE COMPARISON MATRIX</h3>
            </div>
            <span className="section-subtitle">Stress Tolerance & Dependencies</span>
          </div>

          <div className="resilience-matrix-table">
            <div className="matrix-table-header">
              <span>Dimension</span>
              <span className="text-center text-cyan">{corridorA.name}</span>
              <span className="text-center text-purple">{corridorB.name}</span>
            </div>

            {resilienceMatrix.map((row) => {
              const valA = row.valA;
              const valB = row.valB;
              const diff = typeof valA === 'number' && typeof valB === 'number' ? Math.abs(valA - valB) : null;
              const isFavA = row.higherIsBetter ? valA > valB : valA < valB;
              const isFavB = row.higherIsBetter ? valB > valA : valB < valA;

              return (
                <div key={row.key} className="matrix-table-row">
                  <div className="matrix-dim-cell">
                    <span className="matrix-dim-name">{row.name}</span>
                    <span className="matrix-dim-sem">{row.semantics}</span>
                  </div>
                  <div className={`matrix-val-cell ${isFavA ? 'fav-cell-a' : ''}`}>
                    {valA} {isFavA && diff > 0 && <span className="fav-tick">✓</span>}
                  </div>
                  <div className={`matrix-val-cell ${isFavB ? 'fav-cell-b' : ''}`}>
                    {valB} {isFavB && diff > 0 && <span className="fav-tick">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Anchor Dependency Comparison */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title-group">
              <Anchor className="icon-sm text-amber" />
              <h3 className="section-title">ANCHOR DEPENDENCY COMPARISON</h3>
            </div>
            <span className="section-subtitle">Concentration & Landmark Mix</span>
          </div>

          <div className="side-by-side-cols">
            {/* Corridor A Anchors */}
            <div className="sub-column col-a">
              <span className="col-header-tag tag-a">{corridorA.name}</span>
              {anchorsComparison.isPendingA ? (
                <div className="pending-mini-box">Anchor Data: Enrichment pending</div>
              ) : (
                <div className="anchor-comp-block">
                  <div className="anchor-level-row">
                    <span className="conc-lbl">Concentration:</span>
                    <span className={`badge-conc ${anchorsComparison.categoryClassA}`}>{anchorsComparison.categoryA}</span>
                  </div>
                  <div className="anchor-stat-pills">
                    <div className="stat-pair"><span>Top 3 Share:</span> <strong>{anchorsComparison.top3ShareA}%</strong></div>
                    <div className="stat-pair"><span>Eff. Anchors:</span> <strong>{anchorsComparison.effectiveAnchorsA}</strong></div>
                    <div className="stat-pair"><span>HHI:</span> <strong>{anchorsComparison.hhiA}</strong></div>
                  </div>
                  <div className="anchors-mini-list">
                    {anchorsComparison.anchorsListA.slice(0, 3).map((anc, i) => (
                      <div key={i} className="mini-anchor-row">
                        <Landmark className="icon-xs text-amber shrink-0" />
                        <span className="mini-anchor-name">{anc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Corridor B Anchors */}
            <div className="sub-column col-b">
              <span className="col-header-tag tag-b">{corridorB.name}</span>
              {anchorsComparison.isPendingB ? (
                <div className="pending-mini-box">Anchor Data: Enrichment pending</div>
              ) : (
                <div className="anchor-comp-block">
                  <div className="anchor-level-row">
                    <span className="conc-lbl">Concentration:</span>
                    <span className={`badge-conc ${anchorsComparison.categoryClassB}`}>{anchorsComparison.categoryB}</span>
                  </div>
                  <div className="anchor-stat-pills">
                    <div className="stat-pair"><span>Top 3 Share:</span> <strong>{anchorsComparison.top3ShareB}%</strong></div>
                    <div className="stat-pair"><span>Eff. Anchors:</span> <strong>{anchorsComparison.effectiveAnchorsB}</strong></div>
                    <div className="stat-pair"><span>HHI:</span> <strong>{anchorsComparison.hhiB}</strong></div>
                  </div>
                  <div className="anchors-mini-list">
                    {anchorsComparison.anchorsListB.slice(0, 3).map((anc, i) => (
                      <div key={i} className="mini-anchor-row">
                        <Landmark className="icon-xs text-amber shrink-0" />
                        <span className="mini-anchor-name">{anc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. TOP 5 PLACE CLASSES COMPARISON */}
      <div className="comparison-section-card">
        <div className="comp-sec-header">
          <div className="comp-sec-title-group">
            <Store className="icon-sm text-cyan" />
            <h3 className="comp-sec-title">PLACE ECOSYSTEM BREAKDOWN (TOP 5 CLASSES)</h3>
          </div>
          <span className="comp-sec-subtitle">Commercial & Public Venues by Listing Count</span>
        </div>

        <div className="side-by-side-cols">
          {/* Places A */}
          <div className="sub-column col-a">
            <span className="col-header-tag tag-a">{corridorA.name}</span>
            {!placesA ? (
              <div className="pending-mini-box">Place Inventory: Enrichment pending</div>
            ) : (
              <div className="places-mini-list">
                {placesA.map((p, i) => (
                  <div key={p.class} className="place-comp-item">
                    <span className="place-comp-rank">#{i + 1}</span>
                    <span className="place-comp-name">{p.label}</span>
                    <span className="place-comp-count text-cyan">{p.listingCount} listings</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Places B */}
          <div className="sub-column col-b">
            <span className="col-header-tag tag-b">{corridorB.name}</span>
            {!placesB ? (
              <div className="pending-mini-box">Place Inventory: Enrichment pending</div>
            ) : (
              <div className="places-mini-list">
                {placesB.map((p, i) => (
                  <div key={p.class} className="place-comp-item">
                    <span className="place-comp-rank">#{i + 1}</span>
                    <span className="place-comp-name">{p.label}</span>
                    <span className="place-comp-count text-purple">{p.listingCount} listings</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
