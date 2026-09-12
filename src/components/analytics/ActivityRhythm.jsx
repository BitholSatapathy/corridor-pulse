import React from 'react';
import { Clock, Coffee, Sun, Sunset, Moon } from 'lucide-react';
import { formatDaypartShort, formatDaypartTime } from '../../utils/formatters';

const DAYPART_KEYS = [
  { key: 'weekday_am', label: 'Weekday AM', icon: Coffee, sub: 'Commute' },
  { key: 'weekday_midday', label: 'Weekday Midday', icon: Sun, sub: 'Workforce & Lunch' },
  { key: 'weekday_evening', label: 'Weekday Evening', icon: Sunset, sub: 'Social & Dinner' },
  { key: 'late_night', label: 'Late Night', icon: Moon, sub: 'Nightlife' },
  { key: 'weekend_day', label: 'Weekend Day', icon: Clock, sub: 'Leisure & Retail' }
];

export default function ActivityRhythm({ corridor }) {
  if (!corridor) return null;

  const dayparts = corridor.behavior?.daypart_occasion_density || {};
  const values = DAYPART_KEYS.map(d => dayparts[d.key] || 0);
  const maxVal = Math.max(...values, 100);
  const peakVal = Math.max(...values);

  return (
    <div className="editorial-card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-label">Diurnal Rhythm</span>
          <h3 className="card-title">Activity by Daypart</h3>
        </div>
        <span className="badge badge-status-active">
          <span className="badge-dot" />
          Occasion Density (0–100)
        </span>
      </div>

      <div className="daypart-chart-container">
        {/* Visual Vertical Density Chart */}
        <div className="daypart-bars-row">
          {DAYPART_KEYS.map(({ key, label }) => {
            const val = dayparts[key] ?? 0;
            const heightPct = Math.max(12, Math.round((val / 100) * 100));
            const isPeak = val === peakVal;

            return (
              <div key={key} className={`daypart-bar-wrapper ${isPeak ? 'peak' : ''}`}>
                <span className="daypart-bar-val tabular-nums">{val}</span>
                <div
                  className="daypart-bar-visual"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Tabular Metric Row Below Chart */}
        <div className="daypart-table-row">
          {DAYPART_KEYS.map(({ key, label, sub }) => {
            const val = dayparts[key] ?? 0;
            const isPeak = val === peakVal;

            return (
              <div key={key} className="daypart-cell">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="daypart-cell-name">{label}</span>
                  {isPeak && (
                    <span className="badge badge-status-active" style={{ padding: '0.1rem 0.35rem', fontSize: '0.625rem' }}>
                      Peak
                    </span>
                  )}
                </div>
                <span className="daypart-cell-time">{formatDaypartTime(key)}</span>
                <span className="daypart-cell-density tabular-nums">{val} / 100</span>
              </div>
            );
          })}
        </div>

        {/* Footfall Rhythm Summary */}
        <div style={{
          padding: '0.75rem',
          background: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Rhythm Insight:</span>
          <span>
            {dayparts.weekend_day > dayparts.weekday_midday
              ? 'Leisure and weekend-driven corridor with strong community weekend activation.'
              : 'Workday commuter-driven corridor anchored by morning and midday workplace footfall.'}
            {dayparts.late_night > 40
              ? ' Maintains substantial late-night vitality extending past midnight.'
              : ' Activity tapers off significantly following evening hours.'}
          </span>
        </div>
      </div>
    </div>
  );
}
