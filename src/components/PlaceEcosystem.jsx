import React from 'react';
import { Store, Building2, AlertCircle, ShoppingBag, Coffee, Utensils, Trees, School, Stethoscope, Sparkles } from 'lucide-react';
import { formatPlaceClassName } from '../utils/formatters';

const PRIORITIZED_CLASSES = [
  'RESTAURANT',
  'CAFE',
  'RETAIL',
  'GROCERY_SUPERMARKET',
  'PARK',
  'K12_SCHOOL',
  'HOSPITAL_MEDICAL_CAMPUS',
  'NIGHTLIFE',
  'EVENT_VENUE',
  'TRANSIT_HUB',
  'UNIVERSITY_CAMPUS',
  'HOTEL',
  'MALL_MARKET_HALL'
];

export default function PlaceEcosystem({ corridor }) {
  if (!corridor) return null;

  const places = corridor.places;
  const isPending = corridor.enrichment_status === 'PENDING' || !places;

  if (isPending) {
    return (
      <div className="section-card">
        <div className="section-header">
          <div className="section-title-group">
            <Store className="icon-sm text-cyan" />
            <h3 className="section-title">PLACE ECOSYSTEM</h3>
          </div>
          <span className="section-subtitle">Commercial & Public Places</span>
        </div>
        <div className="pending-notice-card">
          <AlertCircle className="icon-md text-amber" />
          <div>
            <h4 className="pending-title">Place Inventory Pending for Sub-Corridor</h4>
            <p className="pending-desc">
              Physical place listings, categories, and density counts for <strong>{corridor.name}</strong> are pending catalog ingestion.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const classesMap = places.classes || {};
  const inventory = places.inventory || {};

  // Filter prioritized classes, map listings, and sort descending
  const sortedClasses = PRIORITIZED_CLASSES
    .map(clsKey => {
      const clsData = classesMap[clsKey] || { listing_count: 0, coordinate_site_count: 0 };
      return {
        key: clsKey,
        label: formatPlaceClassName(clsKey),
        listingCount: clsData.listing_count || 0,
        siteCount: clsData.coordinate_site_count || 0
      };
    })
    .filter(item => item.listingCount > 0)
    .sort((a, b) => b.listingCount - a.listingCount)
    .slice(0, 10); // Show top 8-10

  const maxListings = sortedClasses.length > 0 ? sortedClasses[0].listingCount : 1;

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <Store className="icon-sm text-cyan" />
          <h3 className="section-title">PLACE ECOSYSTEM</h3>
        </div>
        <span className="section-subtitle">
          Top Commercial & Civic Place Classes
        </span>
      </div>

      {/* Place Summary Stats Strip */}
      <div className="place-stats-strip">
        <div className="place-stat-col">
          <span className="place-stat-num">{inventory.listing_count?.toLocaleString() || '--'}</span>
          <span className="place-stat-lbl">Total Places</span>
        </div>
        <div className="place-stat-divider" />
        <div className="place-stat-col">
          <span className="place-stat-num">{inventory.coordinate_site_count?.toLocaleString() || '--'}</span>
          <span className="place-stat-lbl">Physical Sites</span>
        </div>
        <div className="place-stat-divider" />
        <div className="place-stat-col">
          <span className="place-stat-num text-cyan">{inventory.classified_listing_count?.toLocaleString() || '--'}</span>
          <span className="place-stat-lbl">Classified Venues</span>
        </div>
      </div>

      {/* Place Classes Breakdown */}
      <div className="place-classes-list">
        {sortedClasses.map((item, index) => {
          const barWidth = Math.round((item.listingCount / maxListings) * 100);

          return (
            <div key={item.key} className="place-class-row">
              <div className="place-class-info">
                <div className="place-class-name-row">
                  <span className="place-rank">#{index + 1}</span>
                  <span className="place-class-name">{item.label}</span>
                </div>
                <span className="place-site-count">{item.siteCount} sites</span>
              </div>

              <div className="place-class-track">
                <div
                  className="place-class-fill"
                  style={{ width: `${Math.max(barWidth, 2)}%` }}
                />
              </div>

              <div className="place-count-badge">
                <span className="place-listing-count">{item.listingCount}</span>
                <span className="place-listing-unit">listings</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
