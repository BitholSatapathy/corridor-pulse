import React from 'react';
import { ExternalLink, Linkedin } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Krish Mathur',
    regNo: '24BCE10068',
    role: 'Corridor Intelligence & Behavioral Analytics',
    linkedin: 'https://www.linkedin.com/in/krish-mathur09/'
  },
  {
    name: 'Bithol Satapathy',
    regNo: '24BAI10972',
    role: 'System Architecture & Data Engineering',
    linkedin: 'https://www.linkedin.com/in/bithol-satapathy-3aaa99321/'
  }
];

export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="team-section-header">
        <h3 className="team-section-title">Presented by Team The Sixth Sense</h3>
        <p className="team-section-subtitle">
          Built for the NYC Commercial Corridor Intelligence Hackathon
        </p>
      </div>

      <div className="team-cards-grid">
        {TEAM_MEMBERS.map(member => (
          <div key={member.name} className="team-member-card">
            {/* Elegant Circular Photo Placeholder clearly marked */}
            <div className="team-photo-placeholder" aria-label="Photo placeholder">
              <span className="photo-placeholder-text">
                PHOTO TO BE ADDED
              </span>
            </div>

            <div className="team-info-group">
              <h4 className="team-member-name">{member.name}</h4>
              <span className="team-reg-no">Reg No: {member.regNo}</span>
              <p className="team-role">{member.role}</p>
            </div>

            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-linkedin"
            >
              <Linkedin size={15} />
              <span>LinkedIn Profile</span>
              <ExternalLink size={12} style={{ opacity: 0.7 }} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
