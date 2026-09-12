import React, { useState } from 'react';
import {
  corridors,
  defaultCorridor,
  corridorsById
} from '../data/corridorsData';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CorridorSelector from '../components/corridor/CorridorSelector';
import CorridorIdentity from '../components/corridor/CorridorIdentity';
import PulseScoreHero from '../components/analytics/PulseScoreHero';
import ExecutiveBrief from '../components/analytics/ExecutiveBrief';
import ActivityRhythm from '../components/analytics/ActivityRhythm';
import CorridorSignals from '../components/analytics/CorridorSignals';
import AnchorLandscape from '../components/analytics/AnchorLandscape';
import CorridorComparison from '../components/comparison/CorridorComparison';
import TeamSection from '../components/team/TeamSection';

export default function App() {
  const [selectedCorridor, setSelectedCorridor] = useState(defaultCorridor);
  const [isComparing, setIsComparing] = useState(false);

  // Default Corridor B to a contrasting prominent corridor (e.g. Chelsea–Meatpacking)
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
      {/* 1. Product Header */}
      <Header
        totalCorridors={corridors.length}
        macroCount={macroCount}
        subCount={subCount}
      />

      {/* 2. Corridor Selector & Controls */}
      <CorridorSelector
        corridors={corridors}
        selectedCorridor={selectedCorridor}
        onSelectCorridor={setSelectedCorridor}
        onToggleCompare={handleToggleCompare}
        isComparing={isComparing}
      />

      {/* Main Workspace: Comparison Mode vs Single Corridor Experience */}
      <main className="main-workspace">
        {isComparing ? (
          /* 9. Corridor Comparison Workspace */
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
            {/* FIRST VIEWPORT GROUPING */}
            <div className="first-viewport-section">
              {/* 3. Corridor Identity & Context Strip */}
              <CorridorIdentity
                corridor={selectedCorridor}
                parentCorridor={parentCorridor}
                onSelectParent={setSelectedCorridor}
              />

              {/* 4. Hero Diagnostic: The Corridor Pulse Scorecard */}
              <PulseScoreHero corridor={selectedCorridor} />

              {/* 5. Executive Brief: "The Pulse Read" */}
              <ExecutiveBrief corridor={selectedCorridor} />
            </div>

            {/* 6. Activity Rhythm (Diurnal Dayparts) */}
            <ActivityRhythm corridor={selectedCorridor} />

            {/* 7. Corridor Signals (Audience & Demand 2-Column Grid) */}
            <CorridorSignals corridor={selectedCorridor} />

            {/* 8. Resilience & Anchor Landscape (2-Column Grid) */}
            <AnchorLandscape corridor={selectedCorridor} />
          </>
        )}

        {/* 10. Team Section */}
        <TeamSection />
      </main>

      {/* 11. Editorial Footer */}
      <Footer />
    </div>
  );
}
