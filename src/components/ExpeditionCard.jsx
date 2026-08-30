import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Calendar, 
  MapPin, 
  User, 
  Ship, 
  Sparkles, 
  ArrowRight, 
  Image as ImageIcon, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ExpeditionCard({ expedition, onSelect }) {
  const { lang, t } = usePortal();

  const getRegionBadgeClass = (region) => {
    switch (region) {
      case 'Antarctica': return 'badge-antarctica';
      case 'Arctic': return 'badge-arctic';
      case 'Himalaya': return 'badge-himalaya';
      default: return 'badge-ocean';
    }
  };

  const title = (lang === 'hi' && expedition.titleHi) ? expedition.titleHi : expedition.title;
  const summary = (lang === 'hi' && expedition.summaryHi) ? expedition.summaryHi : expedition.summary;

  return (
    <div className="glass-panel expedition-card" onClick={() => onSelect(expedition.id)}>
      {/* Image Banner with Badges */}
      <div className="card-image-wrap">
        <img 
          src={expedition.heroImage} 
          alt={expedition.title} 
          className="card-hero-img" 
          loading="lazy"
        />
        <div className="card-overlay-gradient"></div>
        
        {/* Top Badges */}
        <div className="card-top-badges">
          <span className={`badge ${getRegionBadgeClass(expedition.region)}`}>
            <MapPin size={12} />
            <span>{expedition.region}</span>
          </span>
          <span className="card-year-badge">
            <Calendar size={12} />
            <span>{expedition.year}</span>
          </span>
        </div>

        {/* Status & Media Count */}
        <div className="card-bottom-badges">
          <div className="card-stat-pill">
            <ImageIcon size={12} />
            <span>{expedition.media?.length || 0} Media</span>
          </div>
          {expedition.aiGeneratedContent && (
            <div className="card-ai-pill" title="AI Outreach Summary & Social Pack Generated">
              <Sparkles size={12} />
              <span>AI Outreach Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        
        <div className="card-meta">
          {expedition.chiefScientist && (
            <div className="meta-row">
              <User size={13} className="meta-icon" />
              <span className="meta-text">{expedition.chiefScientist}</span>
            </div>
          )}
          {expedition.stations && expedition.stations.length > 0 && (
            <div className="meta-row">
              <MapPin size={13} className="meta-icon" />
              <span className="meta-text">{expedition.stations[0]}</span>
            </div>
          )}
        </div>

        <p className="card-desc">
          {summary}
        </p>

        {/* Tags */}
        {expedition.tags && (
          <div className="card-tags">
            {expedition.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="mini-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Action */}
        <div className="card-action-footer">
          <span className="action-label">{t.common.readMore}</span>
          <div className="action-arrow">
            <ArrowRight size={15} />
          </div>
        </div>
      </div>

      <style>{`
        .expedition-card {
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          border-radius: var(--radius-md);
          position: relative;
        }

        .expedition-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-ice);
          box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15);
        }

        .card-image-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #091322;
        }

        .card-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .expedition-card:hover .card-hero-img {
          transform: scale(1.06);
        }

        .card-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 13, 24, 0.2) 0%, rgba(7, 13, 24, 0.85) 100%);
        }

        .card-top-badges {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-year-badge {
          background: rgba(7, 13, 24, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .card-bottom-badges {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-stat-pill {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: var(--text-secondary);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-ai-pill {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(217, 70, 239, 0.9));
          color: #ffffff;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 0 10px rgba(217, 70, 239, 0.4);
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title {
          font-size: 1.12rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.35;
          margin-bottom: 0.65rem;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 0.85rem;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          color: var(--text-ice);
        }

        .meta-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .mini-tag {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .card-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--accent-ice);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .action-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .expedition-card:hover .action-arrow {
          background: var(--accent-ice);
          color: #000000;
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}
