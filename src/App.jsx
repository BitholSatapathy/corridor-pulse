import React, { useState } from 'react';
import {
  corridors,
  defaultCorridor,
  corridorsById
} from './data/corridorsData';
import Header from './components/Header';
import CorridorSelector from './components/CorridorSelector';
import CorridorSummary from './components/CorridorSummary';
import PulseScorecard from './components/PulseScorecard';
import MetricCards from './components/MetricCards';
import PulseInsight from './components/PulseInsight';
import ActivityChart from './components/ActivityChart';
import AudienceSection from './components/AudienceSection';
import DemandProfile from './components/DemandProfile';
import PlaceEcosystem from './components/PlaceEcosystem';
import ResilienceProfile from './components/ResilienceProfile';
import AnchorDependency from './components/AnchorDependency';
import CorridorComparison from './components/CorridorComparison';

export default function App() {
  const [selectedCorridor, setSelectedCorridor] = useState(defaultCorridor);
  const [isComparing, setIsComparing] = useState(false);

  // Default Corridor B to a contrasting prominent corridor (e.g. Chelsea–Meatpacking or Fordham)
  const defaultCompareCorridor = corridors.find(c => c.corridor_id !== defaultCorridor.corridor_id && c.level === 'MACRO') || corridors[1];
  const [compareCorridor, setCompareCorridor] = useState(defaultCompareCorridor);

  const macroCount = corridors.filter(c => c.level === 'MACRO').length;
  const subCount = corridors.filter(c => c.level === 'SUB_CORRIDOR').length;

  // Resolve parent corridor if selected corridor is a sub-corridor
  const parentCorridor = selectedCorridor?.parent_corridor_id
    ? corridorsById.get(selectedCorridor.parent_corridor_id)
    : null;

  const handleToggleCompare = () => {
    setIsComparing(prev => !prev);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        totalCorridors={corridors.length}
        macroCount={macroCount}
        subCount={subCount}
      />

      {/* Main Dashboard Workspace */}
      <main className="main-content">
        {/* Main Corridor Selection Control with Compare Toggle */}
        <CorridorSelector
          corridors={corridors}
          selectedCorridor={selectedCorridor}
          onSelectCorridor={setSelectedCorridor}
          onToggleCompare={handleToggleCompare}
          isComparing={isComparing}
        />

        {/* CONDITIONAL RENDERING: COMPARISON MODE VS SINGLE-CORRIDOR EXPERIENCE */}
        {isComparing ? (
          <CorridorComparison
            corridorA={selectedCorridor}
            corridorB={compareCorridor}
            onSelectCorridorA={setSelectedCorridor}
            onSelectCorridorB={setCompareCorridor}
            onExitComparison={() => setIsComparing(false)}
            allCorridors={corridors}
          />
        ) : (
          <>
            {/* Corridor Summary & Identity */}
            <CorridorSummary
              corridor={selectedCorridor}
              parentCorridor={parentCorridor}
              onSelectParent={setSelectedCorridor}
            />

            {/* FEATURE 3: THE CORRIDOR PULSE SCORECARD (Top Focal Point) */}
            <PulseScorecard corridor={selectedCorridor} />

            {/* Narrative & Metric Highlights */}
            <PulseInsight corridor={selectedCorridor} />

            {/* 5 Core Behavioral Diagnostic Metrics */}
            <MetricCards corridor={selectedCorridor} />

            {/* Intelligence Layer: Diurnal Rhythm & Audience Segments */}
            <div className="dashboard-grid">
              <ActivityChart corridor={selectedCorridor} />
              <AudienceSection corridor={selectedCorridor} />
            </div>

            {/* Intelligence Layer: Demand Profile & Place Ecosystem */}
            <div className="dashboard-grid">
              <DemandProfile corridor={selectedCorridor} />
              <PlaceEcosystem corridor={selectedCorridor} />
            </div>

            {/* Intelligence Layer: Resilience Profile & Anchor Dependency */}
            <div className="dashboard-grid">
              <ResilienceProfile corridor={selectedCorridor} />
              <AnchorDependency corridor={selectedCorridor} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          CORRIDOR PULSE &copy; {new Date().getFullYear()} &bull; Behavioral Commercial Corridor Intelligence for New York City &bull; Hackathon Edition
        </p>
      </footer>
    </div>
  );
}
