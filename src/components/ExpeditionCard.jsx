import { usePortal } from '../context/PortalContext';
import { 
  Calendar, 
  MapPin, 
  User, 
  ArrowRight, 
  Image as ImageIcon,
  Sparkles
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
            <span>{expedition.media?.length || 0} Photos</span>
          </div>
          {expedition.aiGeneratedContent && (
            <div className="card-ai-pill" title="Outreach Package Ready">
              <Sparkles size={12} />
              <span>Outreach Pack</span>
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
        {(expedition.tags && expedition.tags.length > 0) ? (
          <div className="card-tags">
            {expedition.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="mini-tag">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="card-tags">
            <span className="mini-tag">{expedition.region || 'Polar'}</span>
            <span className="mini-tag">Glaciology</span>
            <span className="mini-tag">Climate Research</span>
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
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
          height: 100%;
        }

        .expedition-card:hover {
          transform: translateY(-4px);
          border-color: #94a3b8;
          box-shadow: var(--shadow-lg);
        }

        .card-image-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .card-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .expedition-card:hover .card-hero-img {
          transform: scale(1.04);
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
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          padding: 0.2rem 0.55rem;
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
          background: rgba(255, 255, 255, 0.92);
          color: #334155;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .card-ai-pill {
          background: #059669;
          color: #ffffff;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #ffffff;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.35;
          margin-bottom: 0.65rem;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #64748b;
          font-size: 0.78rem;
          margin-bottom: 0.85rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .meta-icon {
          color: #0284c7;
          flex-shrink: 0;
        }

        .meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-desc {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.55;
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
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }

        .card-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid #f1f5f9;
          color: #059669;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .action-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          transition: all 0.15s ease;
        }

        .expedition-card:hover .action-arrow {
          background: #059669;
          color: #ffffff;
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .card-image-wrap {
            height: 180px;
          }
          .card-body {
            padding: 1rem;
          }
          .card-title {
            font-size: 1.02rem;
          }
          .card-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }
        }
      `}</style>
    </div>
  );
}
