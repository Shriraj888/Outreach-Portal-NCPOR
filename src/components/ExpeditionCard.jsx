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
  const { auth, lang, t } = usePortal();

  const getRegionBadgeClass = (region) => {
    switch (region) {
      case 'Antarctica': return 'badge-antarctica';
      case 'Arctic': return 'badge-arctic';
      case 'Himalaya': return 'badge-himalaya';
      default: return 'badge-ocean';
    }
  };

  const title = (lang === 'hi' && expedition.titleHi) ? expedition.titleHi : expedition.title;
  const rawSummary = (lang === 'hi' && expedition.summaryHi) ? expedition.summaryHi : expedition.summary;
  const summary = (rawSummary || '').replace(/—/g, ', ');

  // Clean scientist & station names for compact display
  const scientistName = expedition.chiefScientist ? expedition.chiefScientist.replace(/\s*\(.*?\)/g, '').trim() : '';
  const stationName = expedition.stations?.[0] ? expedition.stations[0].replace(/\s*\(.*?\)/g, '').trim() : '';

  return (
    <div className="expedition-card" onClick={() => onSelect(expedition.id)}>
      {/* Image Banner */}
      <div className="card-image-wrap">
        <img 
          src={expedition.heroImage} 
          alt={expedition.title} 
          className="card-hero-img" 
          loading="lazy"
        />
        <div className="card-img-gradient"></div>
        
        {/* Top Badges */}
        <div className="card-top-badges">
          <span className={`badge ${getRegionBadgeClass(expedition.region)} card-region-pill`}>
            <MapPin size={11} />
            <span>{expedition.region}</span>
          </span>
          <span className="card-year-badge">
            <Calendar size={11} />
            <span>{expedition.year}</span>
          </span>
        </div>

        {/* Bottom Floating Stats */}
        <div className="card-bottom-badges">
          <div className="card-stat-pill">
            <ImageIcon size={11} />
            <span>{expedition.media?.length || 0} Photos</span>
          </div>
          {expedition.aiGeneratedContent && (
            <div className="card-ai-pill" title={auth?.isAuthenticated ? "Outreach Package Ready" : "AI Summary Available"}>
              <Sparkles size={11} />
              <span>{auth?.isAuthenticated ? "Outreach Ready" : "Summary Ready"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="card-body">
        <h3 className="card-title" title={title}>{title}</h3>
        
        <div className="card-meta">
          {scientistName && (
            <div className="meta-item" title={expedition.chiefScientist}>
              <User size={12} className="meta-icon" />
              <span className="meta-text">{scientistName}</span>
            </div>
          )}
          {stationName && (
            <div className="meta-item" title={expedition.stations?.[0]}>
              <MapPin size={12} className="meta-icon" />
              <span className="meta-text">{stationName}</span>
            </div>
          )}
        </div>

        <p className="card-desc">
          {summary}
        </p>

        {/* Tags */}
        <div className="card-tags">
          {(expedition.tags && expedition.tags.length > 0) ? (
            expedition.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="mini-tag">
                {tag.replace(/—/g, ' ')}
              </span>
            ))
          ) : (
            <>
              <span className="mini-tag">{expedition.region || 'Polar'}</span>
              <span className="mini-tag">Glaciology</span>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="card-action-footer">
          <span className="action-label">{t?.common?.readMore || 'Explore Expedition'}</span>
          <div className="action-arrow">
            <ArrowRight size={14} />
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
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
          position: relative;
          height: 100%;
        }

        .expedition-card:hover {
          transform: translateY(-5px);
          border-color: #cbd5e1;
          box-shadow: 0 16px 30px -8px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.04);
        }

        .expedition-card:active {
          transform: translateY(-2px);
        }

        .card-image-wrap {
          position: relative;
          height: 185px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .card-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .expedition-card:hover .card-hero-img {
          transform: scale(1.06);
        }

        .card-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, transparent 40%, rgba(0, 0, 0, 0.4) 100%);
          pointer-events: none;
        }

        .card-top-badges {
          position: absolute;
          top: 0.65rem;
          left: 0.65rem;
          right: 0.65rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .card-region-pill {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .card-year-badge {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .card-bottom-badges {
          position: absolute;
          bottom: 0.65rem;
          left: 0.65rem;
          right: 0.65rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .card-stat-pill {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #1e293b;
          padding: 0.18rem 0.5rem;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .card-ai-pill {
          background: rgba(5, 150, 105, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 0.18rem 0.55rem;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .card-body {
          padding: 1.15rem 1.15rem 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #ffffff;
        }

        .card-title {
          font-size: 1.02rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin-bottom: 0.45rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.75rem;
          transition: color 0.2s ease;
        }

        .expedition-card:hover .card-title {
          color: #0369a1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          color: #64748b;
          font-size: 0.74rem;
          font-weight: 600;
          margin-bottom: 0.65rem;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.28rem;
          min-width: 0;
        }

        .meta-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .card-desc {
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
          min-height: 1.5rem;
        }

        .mini-tag {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.18rem 0.5rem;
          border-radius: 5px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .expedition-card:hover .mini-tag {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .card-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid #f1f5f9;
          color: #059669;
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: auto;
        }

        .action-arrow {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .expedition-card:hover .action-arrow {
          background: #059669;
          color: #ffffff;
          transform: translateX(3px);
          box-shadow: 0 3px 8px rgba(5, 150, 105, 0.35);
        }

        @media (max-width: 640px) {
          .card-image-wrap {
            height: 175px;
          }
          .card-body {
            padding: 1rem;
          }
          .card-title {
            font-size: 0.98rem;
            min-height: auto;
          }
          .meta-text {
            max-width: 120px;
          }
        }
      `}</style>
    </div>
  );
}
