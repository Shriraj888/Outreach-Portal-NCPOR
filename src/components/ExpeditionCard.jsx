import { usePortal } from '../context/PortalContext';
import { 
  Calendar, 
  ArrowUpRight,
  Camera,
  Compass,
  Globe2,
  Mountain,
  Waves,
  GraduationCap,
  Radio,
  Ship,
  Tag
} from 'lucide-react';

export default function ExpeditionCard({ expedition, onSelect }) {
  const { lang, t } = usePortal();

  const getRegionTheme = (region) => {
    switch (region) {
      case 'Antarctica':
        return {
          regionClass: 'region-antarctica',
          gradient: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #7dd3fc 100%)',
          icon: <Compass size={12} className="region-glyph" />
        };
      case 'Arctic':
        return {
          regionClass: 'region-arctic',
          gradient: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)',
          icon: <Globe2 size={12} className="region-glyph" />
        };
      case 'Himalaya':
        return {
          regionClass: 'region-himalaya',
          gradient: 'linear-gradient(90deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)',
          icon: <Mountain size={12} className="region-glyph" />
        };
      default:
        return {
          regionClass: 'region-ocean',
          gradient: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #93c5fd 100%)',
          icon: <Waves size={12} className="region-glyph" />
        };
    }
  };

  const title = (lang === 'hi' && expedition.titleHi) ? expedition.titleHi : expedition.title;
  const rawSummary = (lang === 'hi' && expedition.summaryHi) ? expedition.summaryHi : expedition.summary;
  const summary = (rawSummary || '').replace(/—/g, ', ');

  // Clean scientist & station names for display
  const scientistName = expedition.chiefScientist ? expedition.chiefScientist.replace(/\s*\(.*?\)/g, '').trim() : '';
  const stationName = expedition.stations?.[0] ? expedition.stations[0].replace(/\s*\(.*?\)/g, '').trim() : '';
  const vesselName = expedition.vessel ? expedition.vessel.replace(/\s*\(.*?\)/g, '').trim() : '';
  
  const regionTheme = getRegionTheme(expedition.region);

  // Secondary location or transport metadata
  const isSouthernOcean = expedition.region === 'Southern Ocean';
  const secondaryMeta = (isSouthernOcean && vesselName) ? {
    icon: <Ship size={12} />,
    boxClass: 'ship-box',
    label: 'Vessel',
    val: vesselName,
    fullTitle: `Research Vessel: ${expedition.vessel}`
  } : stationName ? {
    icon: <Radio size={12} />,
    boxClass: 'station-box',
    label: 'Base',
    val: stationName,
    fullTitle: `Research Station: ${expedition.stations?.join(', ')}`
  } : vesselName ? {
    icon: <Ship size={12} />,
    boxClass: 'ship-box',
    label: 'Vessel',
    val: vesselName,
    fullTitle: `Research Vessel: ${expedition.vessel}`
  } : null;

  return (
    <div 
      className="expedition-card expedition-card-modern" 
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
      {/* Top 3-Stop Region Gradient Accent */}
      <div 
        className="card-accent-strip" 
        style={{ background: regionTheme.gradient }} 
      />

      {/* Hero Media Section */}
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
          <span className={`frost-region-pill ${regionTheme.regionClass}`}>
            {regionTheme.icon}
            <span>{expedition.region}</span>
          </span>
          <span className="frost-year-badge">
            <Calendar size={11} />
            <span>{expedition.year}</span>
          </span>
        </div>

        {/* Bottom Floating Stats */}
        <div className="card-bottom-badges">
          <div className="frost-stat-pill">
            <Camera size={11} />
            <span>{expedition.media?.length || 0} Photos</span>
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="card-body">
        <h3 className="card-title" title={title}>{title}</h3>
        
        {/* Structured Metadata List with Distinct Themed Icons */}
        <div className="card-meta-list">
          {scientistName && (
            <div className="meta-item-row" title={`Chief Scientist: ${expedition.chiefScientist}`}>
              <div className="meta-icon-container scientist-box">
                <GraduationCap size={13} />
              </div>
              <div className="meta-text-wrap">
                <span className="meta-role-label">Lead</span>
                <span className="meta-val-text">{scientistName}</span>
              </div>
            </div>
          )}

          {secondaryMeta && (
            <div className="meta-item-row" title={secondaryMeta.fullTitle}>
              <div className={`meta-icon-container ${secondaryMeta.boxClass}`}>
                {secondaryMeta.icon}
              </div>
              <div className="meta-text-wrap">
                <span className="meta-role-label">{secondaryMeta.label}</span>
                <span className="meta-val-text">{secondaryMeta.val}</span>
              </div>
            </div>
          )}
        </div>

        {/* Concise Description */}
        <p className="card-desc">
          {summary}
        </p>

        {/* Topic & Science Tags */}
        <div className="card-tags">
          {(expedition.tags && expedition.tags.length > 0 ? expedition.tags.slice(0, 3) : [expedition.region || 'Polar', 'Glaciology']).map((tag, i) => (
            <span key={i} className="science-tag-pill">
              <Tag size={10} className="tag-icon-svg" />
              <span>{tag.replace(/—/g, ' ')}</span>
            </span>
          ))}
        </div>

        {/* Footer Action */}
        <div className="card-action-footer">
          <span className="action-cta-text">
            {t?.common?.readMore || 'Explore Expedition'}
          </span>
          <div className="action-circle-btn" aria-hidden="true">
            <ArrowUpRight size={15} />
          </div>
        </div>
      </div>

      <style>{`
        .expedition-card-modern {
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 4px 14px -3px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          position: relative;
          height: 100%;
          user-select: none;
        }

        .expedition-card-modern:hover {
          transform: translateY(-5px);
          border-color: #cbd5e1;
          box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 6px 14px -4px rgba(15, 23, 42, 0.04);
        }

        .expedition-card-modern:focus-visible {
          outline: 2px solid #0284c7;
          outline-offset: 2px;
        }

        /* 3.5px Top Accent Strip */
        .card-accent-strip {
          height: 3.5px;
          width: 100%;
          flex-shrink: 0;
        }

        /* Media Container */
        .card-image-wrap {
          position: relative;
          height: 195px;
          overflow: hidden;
          background: #0f172a;
        }

        .card-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .expedition-card-modern:hover .card-hero-img {
          transform: scale(1.05);
        }

        .card-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(15, 23, 42, 0.58) 0%, 
            rgba(15, 23, 42, 0.08) 35%, 
            transparent 55%, 
            rgba(15, 23, 42, 0.62) 100%
          );
          pointer-events: none;
        }

        /* Top Overlays */
        .card-top-badges {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .frost-region-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 0.22rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .frost-region-pill.region-antarctica {
          color: #0284c7;
          border: 1px solid rgba(186, 230, 253, 0.9);
        }

        .frost-region-pill.region-arctic {
          color: #0d9488;
          border: 1px solid rgba(153, 246, 228, 0.9);
        }

        .frost-region-pill.region-himalaya {
          color: #6366f1;
          border: 1px solid rgba(199, 210, 254, 0.9);
        }

        .frost-region-pill.region-ocean {
          color: #2563eb;
          border: 1px solid rgba(191, 219, 254, 0.9);
        }

        .region-glyph {
          flex-shrink: 0;
        }

        .frost-year-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #ffffff;
          padding: 0.22rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        /* Bottom Overlays */
        .card-bottom-badges {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
          pointer-events: none;
        }

        .frost-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(15, 23, 42, 0.68);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #f8fafc;
          padding: 0.2rem 0.55rem;
          border-radius: 7px;
          font-size: 0.68rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
        }

        /* Card Body */
        .card-body {
          padding: 1.15rem 1.15rem 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #ffffff;
        }

        .card-title {
          font-size: 1.04rem;
          font-weight: 750;
          color: #0f172a;
          line-height: 1.38;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.85rem;
          transition: color 0.2s ease;
        }

        .expedition-card-modern:hover .card-title {
          color: #0284c7;
        }

        /* Meta List with Soft Shaded Container */
        .card-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 0.75rem;
          background: #f8fafc;
          padding: 0.55rem 0.7rem;
          border-radius: 10px;
          border: 1px solid #edf2f7;
        }

        .meta-item-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .meta-icon-container {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .meta-icon-container.scientist-box {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
        }

        .meta-icon-container.station-box {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .meta-icon-container.ship-box {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .meta-text-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          min-width: 0;
          overflow: hidden;
        }

        .meta-role-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          flex-shrink: 0;
        }

        .meta-val-text {
          font-size: 0.78rem;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Description */
        .card-desc {
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 0.8rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Science Tags */
        .card-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
          margin-top: auto;
        }

        .science-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.28rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.18rem 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .expedition-card-modern:hover .science-tag-pill {
          background: #e2e8f0;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .tag-icon-svg {
          color: #94a3b8;
        }

        /* Card Action Footer */
        .card-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
        }

        .action-cta-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0284c7;
          letter-spacing: 0.01em;
          transition: color 0.2s ease;
        }

        .expedition-card-modern:hover .action-cta-text {
          color: #0369a1;
        }

        .action-circle-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0284c7;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .expedition-card-modern:hover .action-circle-btn {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          border-color: #0284c7;
          transform: translateY(-1px) translateX(2px);
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.35);
        }

        @media (max-width: 640px) {
          .card-image-wrap {
            height: 180px;
          }
          .card-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
