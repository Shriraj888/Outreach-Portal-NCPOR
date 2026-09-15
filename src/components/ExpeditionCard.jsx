import { usePortal } from '../context/PortalContext';
import { ArrowRight } from 'lucide-react';

export default function ExpeditionCard({ expedition, onSelect }) {
  const { lang } = usePortal();

  const getPoleLabel = (region) => {
    switch (region) {
      case 'Antarctica':
        return 'SOUTH POLE';
      case 'Arctic':
        return 'NORTH POLE';
      case 'Himalaya':
        return 'THIRD POLE';
      default:
        return (region || 'POLAR').toUpperCase();
    }
  };

  const title = (lang === 'hi' && expedition.titleHi) ? expedition.titleHi : expedition.title;
  const rawSummary = (lang === 'hi' && expedition.summaryHi) ? expedition.summaryHi : expedition.summary;
  const summary = (rawSummary || '').replace(/—/g, ', ');

  // Clean scientist & station names for display
  const scientistName = expedition.chiefScientist ? expedition.chiefScientist.replace(/\s*\(.*?\)/g, '').trim() : '';
  const stationName = expedition.stations?.[0] ? expedition.stations[0].replace(/\s*\(.*?\)/g, '').trim() : '';
  const vesselName = expedition.vessel ? expedition.vessel.replace(/\s*\(.*?\)/g, '').trim() : '';

  return (
    <div 
      className="expedition-card-immersive" 
      onClick={() => onSelect(expedition.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(expedition.id);
        }
      }}
    >
      {/* Background Hero Image */}
      <div 
        className="card-immersive-bg"
        style={{ backgroundImage: `url('${expedition.heroImage}')` }}
      />

      {/* Cinematic Dark Gradient Overlay */}
      <div className="card-immersive-overlay" />

      {/* Top Badges */}
      <div className="card-immersive-top">
        <span className="card-pole-badge">
          {getPoleLabel(expedition.region)}
        </span>
        {expedition.year && (
          <span className="card-year-badge">
            {expedition.year}
          </span>
        )}
      </div>

      {/* Floating Content Area */}
      <div className="card-immersive-content">
        <h3 className="card-immersive-title" title={title}>
          {title}
        </h3>

        <p className="card-immersive-desc">
          {summary}
        </p>

        {/* Science Chips */}
        <div className="card-immersive-chips">
          {(expedition.tags && expedition.tags.length > 0 ? expedition.tags.slice(0, 2) : [expedition.region || 'Polar', 'Science']).map((tag, i) => (
            <span key={i} className="card-immersive-chip">
              {tag.replace(/—/g, ' ')}
            </span>
          ))}
        </div>

        {/* Footer Row */}
        <div className="card-immersive-footer">
          <div className="card-immersive-meta" title={scientistName ? `${scientistName} • ${stationName || vesselName || `${expedition.year}`}` : ''}>
            {scientistName ? (
              <>
                <span className="meta-name">{scientistName}</span>
                <span className="meta-dot">•</span>
                <span className="meta-sub">{stationName || vesselName || `${expedition.year}`}</span>
              </>
            ) : (
              <>
                <span>{stationName || vesselName || `${expedition.region || 'Polar'}`}</span>
                <span className="meta-dot">•</span>
                <span>{expedition.media?.length || 0} Photos</span>
              </>
            )}
          </div>

          <div className="card-immersive-action">
            <span>Explore</span>
            <ArrowRight size={14} className="action-arrow" />
          </div>
        </div>
      </div>

      <style>{`
        .expedition-card-immersive {
          position: relative;
          height: 385px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.2), 0 4px 12px -2px rgba(15, 23, 42, 0.08);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
          user-select: none;
        }

        .expedition-card-immersive:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.32), 0 6px 16px -4px rgba(15, 23, 42, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .expedition-card-immersive:active {
          transform: translateY(-2px);
        }

        .expedition-card-immersive:focus-visible {
          outline: 2px solid #38bdf8;
          outline-offset: 2px;
        }

        .card-immersive-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .expedition-card-immersive:hover .card-immersive-bg {
          transform: scale(1.06);
        }

        .card-immersive-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(15, 23, 42, 0) 0%, 
            rgba(15, 23, 42, 0.04) 26%, 
            rgba(15, 23, 42, 0.62) 52%, 
            rgba(12, 18, 32, 0.93) 76%, 
            rgba(8, 14, 26, 0.98) 100%
          );
          transition: background 0.35s ease;
        }

        .expedition-card-immersive:hover .card-immersive-overlay {
          background: linear-gradient(
            180deg, 
            rgba(15, 23, 42, 0) 0%, 
            rgba(15, 23, 42, 0.02) 24%, 
            rgba(15, 23, 42, 0.58) 48%, 
            rgba(12, 18, 32, 0.95) 74%, 
            rgba(8, 14, 26, 1) 100%
          );
        }

        .card-immersive-top {
          position: absolute;
          top: 1.1rem;
          left: 1.1rem;
          right: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .card-pole-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.32rem 0.75rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(26, 34, 48, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .expedition-card-immersive:hover .card-pole-badge {
          background: rgba(32, 42, 60, 0.95);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .card-year-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.32rem 0.65rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(26, 34, 48, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .card-immersive-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.25rem;
          z-index: 1;
        }

        .card-immersive-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.35rem;
          letter-spacing: -0.015em;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.85rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
          transition: transform 0.25s ease;
        }

        .expedition-card-immersive:hover .card-immersive-title {
          transform: translateX(2px);
        }

        .card-immersive-desc {
          font-size: 0.78rem;
          color: rgba(241, 245, 249, 0.9);
          line-height: 1.42;
          margin: 0 0 0.65rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .card-immersive-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }

        .card-immersive-chip {
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          background: rgba(30, 38, 52, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 0.22rem 0.62rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .expedition-card-immersive:hover .card-immersive-chip {
          background: rgba(38, 48, 66, 0.9);
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .card-immersive-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0;
          gap: 0.45rem;
        }

        .card-immersive-meta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(203, 213, 225, 0.85);
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 65%;
        }

        .meta-name {
          font-weight: 600;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta-sub {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta-dot {
          opacity: 0.55;
          margin: 0 0.08rem;
          flex-shrink: 0;
        }

        .card-immersive-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.36rem 0.9rem;
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(34, 42, 58, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .action-arrow {
          transition: transform 0.25s ease;
        }

        .expedition-card-immersive:hover .card-immersive-action {
          background: rgba(48, 60, 82, 0.98);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .expedition-card-immersive:hover .action-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .expedition-card-immersive {
            height: 420px;
          }
          .card-immersive-content {
            padding: 1.25rem;
          }
          .card-immersive-title {
            font-size: 1.2rem;
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}
