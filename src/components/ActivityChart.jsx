import React from 'react';
import { Clock, BarChart3, Sun, Moon, Sunset, Coffee } from 'lucide-react';
import { formatDaypartShort, formatDaypartTime } from '../utils/formatters';

const DAYPART_KEYS = [
  { key: 'weekday_am', label: 'Weekday AM', icon: Coffee, sub: 'Commute' },
  { key: 'weekday_midday', label: 'Weekday Midday', icon: Sun, sub: 'Lunch & Workers' },
  { key: 'weekday_evening', label: 'Weekday Evening', icon: Sunset, sub: 'PM Social & Dinner' },
  { key: 'late_night', label: 'Late Night', icon: Moon, sub: 'Nightlife' },
  { key: 'weekend_day', label: 'Weekend Day', icon: Clock, sub: 'Leisure & Retail' }
];

export default function ActivityChart({ corridor }) {
  if (!corridor) return null;

  const dayparts = corridor.behavior?.daypart_occasion_density || {};

  // Find max value for relative bar width
  const values = DAYPART_KEYS.map(d => dayparts[d.key] || 0);
  const maxVal = Math.max(...values, 100);
  const peakVal = Math.max(...values);

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <BarChart3 className="icon-sm text-cyan" />
          <h3 className="section-title">WHEN THE CORRIDOR IS ACTIVE</h3>
        </div>
        <span className="section-subtitle">
          Diurnal Occasion Density (Indexed 0–100)
        </span>
      </div>

      <div className="activity-chart-wrapper">
        <div className="activity-bars-grid">
          {DAYPART_KEYS.map(({ key, label, icon: Icon, sub }) => {
            const score = dayparts[key] ?? 0;
            const percentWidth = Math.round((score / maxVal) * 100);
            const isPeak = score === peakVal;

            return (
              <div key={key} className={`activity-bar-row ${isPeak ? 'is-peak' : ''}`}>
                {/* Daypart Label & Icon */}
                <div className="activity-label-col">
                  <div className="activity-label-title">
                    <Icon className="icon-xs" />
                    <span className="activity-name">{label}</span>
                    {isPeak && <span className="peak-badge">Peak</span>}
                  </div>
                  <div className="activity-label-time">
                    {formatDaypartTime(key)}
                  </div>
                </div>

                {/* Bar Visual */}
                <div className="activity-track">
                  <div
                    className={`activity-fill ${isPeak ? 'fill-peak' : ''}`}
                    style={{ width: `${percentWidth}%` }}
                  >
                    <span className="activity-fill-glow" />
                  </div>
                </div>

                {/* Score Column */}
                <div className="activity-score-col">
                  <span className="activity-score-value">{score}</span>
                  <span className="activity-score-max">/ 100</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diurnal Summary Note */}
        <div className="activity-summary-footer">
          <div className="summary-rhythm-badge">
            Diurnal Profile:
          </div>
          <p className="summary-rhythm-text">
            {dayparts.weekend_day > dayparts.weekday_midday
              ? 'Leisure & weekend-led corridor with strong community weekend activation.'
              : 'Workday commuter-led corridor anchored by morning and midday workplace routines.'}
            {dayparts.late_night > 40
              ? ' Notable late-night activity extending past midnight.'
              : ' Low late-night activity, winding down after evening hours.'}
          </p>
        </div>
      </div>
    </div>
  );
}
