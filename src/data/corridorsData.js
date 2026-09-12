// Source of truth: NYC_CORRIDORS.full.json
import rawData from '../../NYC_CORRIDORS.full.json';

export const corridors = rawData.corridors || [];
export const audienceSegments = rawData.audience_segments || [];
export const archetypes = rawData.archetypes || [];
export const specialZones = rawData.special_zones || [];
export const mapContext = rawData.map?.corridor_context || [];

// Lookup map for audience segments metadata: segment_id -> { label, family_id }
export const audienceSegmentsMap = new Map();
audienceSegments.forEach(seg => {
  audienceSegmentsMap.set(seg.segment_id, {
    label: seg.label || seg.segment_id.replace(/_/g, ' '),
    family_id: seg.family_id || 'general'
  });
});

// Lookup map for corridors: corridor_id -> corridor
export const corridorsById = new Map();
corridors.forEach(c => {
  corridorsById.set(c.corridor_id, c);
});

// Default demo corridor: St. George–North Shore (Macro Enriched)
export const defaultCorridor = corridors.find(
  c => c.name.includes('St. George') && c.level === 'MACRO'
) || corridors[0];
