// Formatting helpers for Corridor Pulse

export function formatDaypartName(key) {
  const map = {
    weekday_am: 'Weekday AM (Early Commute)',
    weekday_midday: 'Weekday Midday (Lunch & Work)',
    weekday_evening: 'Weekday Evening (PM Social)',
    late_night: 'Late Night (Nightlife & Off-Peak)',
    weekend_day: 'Weekend Day (Leisure & Shopping)'
  };
  return map[key] || key.replace(/_/g, ' ');
}

export function formatDaypartShort(key) {
  const map = {
    weekday_am: 'Weekday AM',
    weekday_midday: 'Weekday Midday',
    weekday_evening: 'Weekday Evening',
    late_night: 'Late Night',
    weekend_day: 'Weekend Day'
  };
  return map[key] || key.replace(/_/g, ' ');
}

export function formatDaypartTime(key) {
  const map = {
    weekday_am: '6:00 AM – 10:00 AM',
    weekday_midday: '11:00 AM – 2:00 PM',
    weekday_evening: '4:00 PM – 9:00 PM',
    late_night: '10:00 PM – 4:00 AM',
    weekend_day: '10:00 AM – 6:00 PM'
  };
  return map[key] || '';
}

export function getBoroughBadgeColor(borough) {
  switch (borough?.toLowerCase()) {
    case 'manhattan':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'brooklyn':
      return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    case 'queens':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'bronx':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'staten island':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function getConfidenceBadge(confidence) {
  if (confidence === 'HIGH') {
    return { label: 'High Confidence', class: 'badge-confidence-high' };
  }
  if (confidence === 'MEDIUM') {
    return { label: 'Medium Confidence', class: 'badge-confidence-medium' };
  }
  return { label: 'Low Confidence', class: 'badge-confidence-low' };
}

export function getFamilyColor(familyId) {
  const map = {
    evening: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    residential: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    destination: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    leisure: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    campus: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    workplace: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    routine: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
  };
  return map[familyId?.toLowerCase()] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
}

export function formatDemandSourceName(key) {
  const map = {
    residential: 'Residential Demand',
    workplace: 'Workplace & Office Flow',
    commuter: 'Commuter Corridor Flow',
    hotel_guest_context: 'Hotel & Hospitality Visitor',
    university_context: 'University & Student Population',
    tourist_destination_context: 'Tourism & Destination Visitors',
    medical_context: 'Medical Campus & Healthcare Context'
  };
  return map[key] || key.replace(/_/g, ' ');
}

export function formatMagnetName(key) {
  const map = {
    transit: 'Transit Hubs',
    office: 'Commercial Office Space',
    retail: 'Neighborhood Retail',
    restaurant_district: 'Dining & Restaurants',
    retail_destination: 'Destination Retail',
    entertainment: 'Entertainment & Arts',
    nightlife: 'Bars & Nightlife',
    park_waterfront: 'Parks & Waterfront',
    tourist_attraction: 'Tourist Attractions',
    education: 'Schools & Education',
    medical: 'Medical Campuses',
    stadium_event: 'Arenas & Stadiums',
    grocery_routine: 'Groceries & Daily Essentials',
    civic_community: 'Civic & Community Centers',
    hospitality: 'Hotels & Accommodations'
  };
  return map[key] || key.replace(/_/g, ' ');
}

export function formatPlaceClassName(cls) {
  const map = {
    CAFE: 'Cafes & Coffee',
    RESTAURANT: 'Restaurants & Dining',
    GROCERY_SUPERMARKET: 'Groceries & Supermarkets',
    RETAIL: 'Retail Stores',
    PARK: 'Parks & Public Spaces',
    K12_SCHOOL: 'K-12 Schools',
    HOSPITAL_MEDICAL_CAMPUS: 'Medical & Hospital Campuses',
    NIGHTLIFE: 'Nightlife & Bars',
    EVENT_VENUE: 'Event & Performing Venues',
    TRANSIT_HUB: 'Transit Hubs',
    UNIVERSITY_CAMPUS: 'Universities & Colleges',
    HOTEL: 'Hotels & Hospitality',
    MALL_MARKET_HALL: 'Malls & Market Halls',
    GOVERNMENT_CIVIC: 'Civic & Government',
    HISTORICAL_LANDMARK: 'Historical Landmarks',
    RELIGIOUS_COMMUNITY: 'Religious & Community',
    THEATER_CINEMA: 'Theaters & Cinemas',
    STADIUM_ARENA: 'Stadiums & Arenas'
  };
  return map[cls] || cls.replace(/_/g, ' ');
}

/**
 * Anchor Concentration Category
 * Internal rule documented:
 * - top_three_anchor_share >= 50% or effective_anchor_count < 6.5 -> HIGH
 * - top_three_anchor_share >= 42% or effective_anchor_count < 7.5 -> MODERATE
 * - top_three_anchor_share < 42% -> LOW
 * (Non-causal descriptive grouping based on empirical NYC corridor distribution)
 */
export function getAnchorConcentrationCategory(topThreeShare, effectiveCount) {
  if (topThreeShare == null) return { label: 'PENDING', class: 'badge-conc-pending', desc: 'Data pending' };
  
  if (topThreeShare >= 0.50 || (effectiveCount != null && effectiveCount < 6.5)) {
    return {
      label: 'HIGH',
      class: 'badge-conc-high',
      desc: 'Significant footfall reliance concentrated in top 1–3 anchors'
    };
  }
  if (topThreeShare >= 0.42 || (effectiveCount != null && effectiveCount < 7.5)) {
    return {
      label: 'MODERATE',
      class: 'badge-conc-mod',
      desc: 'Balanced distribution across key anchors with moderate core concentration'
    };
  }
  return {
    label: 'LOW',
    class: 'badge-conc-low',
    desc: 'Broadly dispersed anchor base with diverse independent traffic drivers'
  };
}
