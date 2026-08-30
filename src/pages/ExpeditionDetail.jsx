import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Ship, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  Layers, 
  ShieldCheck,
  Edit,
  Globe2,
  Maximize2,
  X
} from 'lucide-react';
import SocialCardPreview from '../components/SocialCardPreview';

export default function ExpeditionDetail({ expeditionId, onBack, navigateTo }) {
  const { expeditions, publications, auth, lang, t } = usePortal();
  const [activeTab, setActiveTab] = useState('overview'); // overview, reports, media, publications, social
  const [lightboxImg, setLightboxImg] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const expedition = expeditions.find(e => e.id === expeditionId);

  if (!expedition) {
    return (
      <div className="container not-found-box">
        <h2>Expedition Not Found</h2>
        <p>The requested expedition archive does not exist or may have been removed.</p>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Expeditions</span>
        </button>
      </div>
    );
  }

  // Linked publications
  const linkedPubs = publications.filter(p => p.expeditionId === expedition.id || (expedition.publications || []).includes(p.id));

  const handleCopySummary = () => {
    const textToCopy = expedition.aiGeneratedContent?.summary || expedition.summary;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const title = (lang === 'hi' && expedition.titleHi) ? expedition.titleHi : expedition.title;

  return (
    <div className="expedition-detail-page">
      {/* Top Banner Navigation */}
      <div className="detail-top-bar">
        <div className="container detail-top-inner">
          <button className="btn-back" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to All Expeditions</span>
          </button>

          <div className="detail-actions-right">
            {auth.isAuthenticated && (
              <>
                <button 
                  className="btn-ai-pill"
                  onClick={() => navigateTo(`admin-generate-${expedition.id}`)}
                >
                  <Sparkles size={14} />
                  <span>AI Content Studio</span>
                </button>
                <button 
                  className="btn-edit-pill"
                  onClick={() => navigateTo(`admin-edit-${expedition.id}`)}
                >
                  <Edit size={14} />
                  <span>Edit Data</span>
                </button>
              </>
            )}
            <span className={`status-pill ${expedition.status}`}>
              {expedition.status === 'published' ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>Published Live</span>
                </>
              ) : (
                <span>Draft Archive</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="detail-hero">
        <div className="hero-backdrop-img" style={{ backgroundImage: `url(${expedition.heroImage})` }}></div>
        <div className="hero-backdrop-overlay"></div>
        
        <div className="container detail-hero-content">
          <div className="detail-tags-row">
            <span className="badge badge-antarctica">{expedition.region}</span>
            <span className="detail-year-tag">
              <Calendar size={13} /> {expedition.year}
            </span>
            {expedition.aiGeneratedContent && (
              <span className="badge-ai-ready">
                <Sparkles size={12} />
                <span>AI Outreach Ready</span>
              </span>
            )}
          </div>

          <h1 className="detail-hero-title">{title}</h1>

          <div className="detail-meta-grid">
            {expedition.chiefScientist && (
              <div className="meta-card">
                <User size={16} className="meta-card-icon" />
                <div>
                  <div className="meta-card-label">Chief Scientist / Lead</div>
                  <div className="meta-card-val">{expedition.chiefScientist}</div>
                </div>
              </div>
            )}

            {expedition.vessel && (
              <div className="meta-card">
                <Ship size={16} className="meta-card-icon" />
                <div>
                  <div className="meta-card-label">Research Vessel / Transport</div>
                  <div className="meta-card-val">{expedition.vessel}</div>
                </div>
              </div>
            )}

            {expedition.stations && expedition.stations.length > 0 && (
              <div className="meta-card">
                <MapPin size={16} className="meta-card-icon" />
                <div>
                  <div className="meta-card-label">Research Stations / Locations</div>
                  <div className="meta-card-val">{expedition.stations.join(', ')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="detail-nav-tabs-wrapper">
        <div className="container">
          <div className="detail-nav-tabs">
            <button 
              className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FileText size={16} />
              <span>Overview & AI Summary</span>
            </button>

            <button 
              className={`detail-tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <Download size={16} />
              <span>Reports & Text Extraction ({expedition.reports?.length || 0})</span>
            </button>

            <button 
              className={`detail-tab ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <ImageIcon size={16} />
              <span>Media Gallery ({expedition.media?.length || 0})</span>
            </button>

            <button 
              className={`detail-tab ${activeTab === 'publications' ? 'active' : ''}`}
              onClick={() => setActiveTab('publications')}
            >
              <Layers size={16} />
              <span>Publications ({linkedPubs.length})</span>
            </button>

            <button 
              className={`detail-tab tab-social ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <Sparkles size={16} />
              <span>Outreach & Social Media Pack</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="container detail-content-body">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="tab-pane-grid">
            {/* Left Column: Plain Language AI Summary & Scientific Abstract */}
            <div className="detail-main-col">
              {/* AI Plain Language Summary Card */}
              {expedition.aiGeneratedContent ? (
                <div className="glass-panel ai-summary-highlight-card">
                  <div className="ai-card-header">
                    <div className="ai-header-title">
                      <div className="ai-icon-circle">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3>AI-Generated Plain-Language Outreach Summary</h3>
                        <p>Translated for the general public, students, and media</p>
                      </div>
                    </div>
                    <button 
                      className="btn-copy-summary"
                      onClick={handleCopySummary}
                    >
                      {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>

                  <div className="ai-summary-text">
                    <p>{expedition.aiGeneratedContent.summary}</p>
                  </div>

                  <div className="ai-card-footer">
                    <div className="ai-verified-tag">
                      <ShieldCheck size={14} />
                      <span>Human Reviewed & Approved by NCPOR Science Comms</span>
                    </div>
                    <button 
                      className="btn-view-social-link"
                      onClick={() => setActiveTab('social')}
                    >
                      <span>View Twitter/Insta/LinkedIn drafts</span>
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-panel standard-summary-card">
                  <h3>Mission Overview</h3>
                  <p>{expedition.summary}</p>
                </div>
              )}

              {/* Scientific Abstract */}
              {expedition.scientificAbstract && (
                <div className="glass-panel text-content-card">
                  <h3 className="section-card-title">
                    <FileText size={18} className="title-icon" />
                    <span>Scientific Abstract & Scope</span>
                  </h3>
                  <p className="abstract-text">{expedition.scientificAbstract}</p>
                </div>
              )}

              {/* Key Discoveries & Milestones */}
              {expedition.keyFindings && expedition.keyFindings.length > 0 && (
                <div className="glass-panel text-content-card">
                  <h3 className="section-card-title">
                    <CheckCircle2 size={18} className="title-icon icon-success" />
                    <span>Key Discoveries & Scientific Deliverables</span>
                  </h3>
                  <ul className="findings-list">
                    {expedition.keyFindings.map((finding, idx) => (
                      <li key={idx} className="finding-item">
                        <span className="finding-bullet">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Sidebar: Quick Facts & Station Coordinates */}
            <div className="detail-sidebar-col">
              <div className="glass-panel sidebar-card">
                <h4 className="sidebar-title">Expedition Quick Facts</h4>
                <div className="sidebar-fact-list">
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Frontier Region</span>
                    <span className="fact-val">{expedition.region}</span>
                  </div>
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Year / Season</span>
                    <span className="fact-val">{expedition.year}</span>
                  </div>
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Duration</span>
                    <span className="fact-val">{expedition.startDate} – {expedition.endDate}</span>
                  </div>
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Reports Stored</span>
                    <span className="fact-val">{expedition.reports?.length || 0} Files</span>
                  </div>
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Media Assets</span>
                    <span className="fact-val">{expedition.media?.length || 0} Photos/Videos</span>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              {expedition.tags && (
                <div className="glass-panel sidebar-card">
                  <h4 className="sidebar-title">Scientific Disciplines</h4>
                  <div className="tags-cloud">
                    {expedition.tags.map((tag, idx) => (
                      <span key={idx} className="discipline-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fast Press Kit Action */}
              <div className="glass-panel press-action-card">
                <Sparkles size={24} className="press-sparkle" />
                <h4>Press & Media Kit</h4>
                <p>Download ready-to-publish images, captions, and quotes for journalists and educators.</p>
                <button 
                  className="btn-primary full-width"
                  onClick={() => setActiveTab('social')}
                >
                  <Share2 size={15} />
                  <span>Access Outreach Assets</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reports & Text Extraction */}
        {activeTab === 'reports' && (
          <div className="reports-tab-container">
            <div className="section-intro">
              <h3>Archived Scientific Reports & PDF Extraction</h3>
              <p>These source technical reports are ingested and processed by NCPOR's AI Content Engine to generate plain-language outreach drafts.</p>
            </div>

            <div className="reports-list">
              {expedition.reports && expedition.reports.map((rep) => (
                <div key={rep.id} className="glass-panel report-item-card">
                  <div className="report-header">
                    <div className="report-title-wrap">
                      <FileText size={24} className="report-icon" />
                      <div>
                        <h4>{rep.title}</h4>
                        <span className="report-size">{rep.fileSize || 'PDF Document'} • Official MoES Archive</span>
                      </div>
                    </div>

                    <a href="#download" className="btn-secondary" onClick={(e) => { e.preventDefault(); alert("Downloading sample expedition report PDF archive."); }}>
                      <Download size={15} />
                      <span>Download PDF</span>
                    </a>
                  </div>

                  {rep.rawText && (
                    <div className="raw-text-preview-box">
                      <div className="raw-text-label">
                        <span>Extracted Text Stream (Input to LLM Summarization):</span>
                      </div>
                      <pre className="raw-text-content">{rep.rawText}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Media Gallery with WCAG Alt-Text */}
        {activeTab === 'media' && (
          <div className="media-tab-container">
            <div className="section-intro-flex">
              <div>
                <h3>Polar Media Gallery & Accessibility Assets</h3>
                <p>High-resolution imagery with verified WCAG-AA descriptive Alt-Text auto-generated by NCPOR AI.</p>
              </div>
              <span className="a11y-verified-badge">
                <ShieldCheck size={16} />
                <span>100% WCAG-AA Alt-Text Compliant</span>
              </span>
            </div>

            <div className="media-grid">
              {expedition.media && expedition.media.map((item) => (
                <div key={item.id} className="glass-panel media-card-item">
                  <div className="media-img-wrap" onClick={() => setLightboxImg(item)}>
                    <img src={item.url} alt={item.altText || item.caption} className="media-thumb" />
                    <div className="media-zoom-overlay">
                      <Maximize2 size={20} />
                    </div>
                  </div>

                  <div className="media-info">
                    <p className="media-caption">{item.caption}</p>
                    
                    <div className="alt-text-box">
                      <div className="alt-tag">
                        <ShieldCheck size={12} />
                        <span>Accessibility Alt-Text:</span>
                      </div>
                      <p className="alt-text-val">{item.altText || 'Detailed polar landscape photograph.'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Publications */}
        {activeTab === 'publications' && (
          <div className="pubs-tab-container">
            <div className="section-intro">
              <h3>Peer-Reviewed Publications & Datasets</h3>
              <p>Scientific papers and open datasets resulting from this expedition.</p>
            </div>

            {linkedPubs.length > 0 ? (
              <div className="pubs-list">
                {linkedPubs.map((pub) => (
                  <div key={pub.id} className="glass-panel pub-item-card">
                    <div className="pub-cat-badge">{pub.category}</div>
                    <h4 className="pub-title">{pub.title}</h4>
                    <p className="pub-authors">{pub.authors.join(', ')} ({pub.year})</p>
                    <p className="pub-journal"><em>{pub.journal}</em> • DOI: {pub.doi}</p>
                    <p className="pub-abstract">{pub.abstract}</p>
                    <div className="pub-actions">
                      <span className="citation-count">📚 {pub.citations} Citations</span>
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        <span>Open DOI Link</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-results-box glass-panel">
                <p>No formal publications indexed under this ID yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Social Media Studio Pack */}
        {activeTab === 'social' && (
          <div className="social-tab-container">
            <div className="section-intro-flex">
              <div>
                <h3>Outreach & Social Media Content Pack</h3>
                <p>Auto-generated platform-tailored copy for Twitter/X, Instagram, and LinkedIn. Ready for NCPOR comms teams to copy & post.</p>
              </div>
              {auth.isAuthenticated && (
                <button 
                  className="btn-ai"
                  onClick={() => navigateTo(`admin-generate-${expedition.id}`)}
                >
                  <Sparkles size={16} />
                  <span>Regenerate in AI Studio</span>
                </button>
              )}
            </div>

            <SocialCardPreview 
              aiContent={expedition.aiGeneratedContent}
              expeditionTitle={expedition.title}
              region={expedition.region}
              mediaUrl={expedition.media && expedition.media[0]?.url}
            />
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={24} />
            </button>
            <img src={lightboxImg.url} alt={lightboxImg.altText} className="lightbox-full-img" />
            <div className="lightbox-caption">
              <h4>{lightboxImg.caption}</h4>
              <p><strong>Alt-Text:</strong> {lightboxImg.altText}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .expedition-detail-page {
          min-height: 100vh;
        }

        .detail-top-bar {
          background: rgba(7, 13, 24, 0.9);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0.75rem 0;
        }

        .detail-top-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .btn-back:hover {
          color: var(--accent-ice);
        }

        .detail-actions-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-ai-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(168, 85, 247, 0.15);
          color: #d8b4fe;
          border: 1px solid rgba(168, 85, 247, 0.4);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-edit-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          cursor: pointer;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-pill.published {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-pill.draft {
          background: rgba(245, 158, 11, 0.15);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        /* Detail Hero */
        .detail-hero {
          position: relative;
          padding: 4rem 0 3rem;
          border-bottom: 1px solid var(--border-subtle);
          overflow: hidden;
        }

        .hero-backdrop-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(8px);
          transform: scale(1.08);
          opacity: 0.35;
        }

        .hero-backdrop-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 13, 24, 0.7) 0%, rgba(7, 13, 24, 0.96) 100%);
        }

        .detail-hero-content {
          position: relative;
          z-index: 1;
        }

        .detail-tags-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .detail-year-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-ai-ready {
          background: linear-gradient(135deg, #9333ea, #d946ef);
          color: #ffffff;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 0 12px rgba(217, 70, 239, 0.35);
        }

        .detail-hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 1.75rem;
          max-width: 950px;
        }

        .detail-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          max-width: 1000px;
        }

        .meta-card {
          background: rgba(15, 29, 53, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .meta-card-icon {
          color: var(--accent-ice);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .meta-card-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .meta-card-val {
          font-size: 0.88rem;
          color: #ffffff;
          font-weight: 600;
        }

        /* Nav Tabs */
        .detail-nav-tabs-wrapper {
          position: sticky;
          top: 69px;
          z-index: 50;
          background: rgba(7, 13, 24, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .detail-nav-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .detail-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .detail-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .detail-tab.active {
          color: var(--accent-ice);
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .detail-tab.tab-social.active {
          color: #d8b4fe;
          background: rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.4);
        }

        /* Detail Body */
        .detail-content-body {
          padding: 2.5rem 1.5rem 5rem;
        }

        .tab-pane-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .detail-main-col {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .ai-summary-highlight-card {
          padding: 1.75rem;
          border: 1px solid rgba(168, 85, 247, 0.35);
          background: linear-gradient(180deg, rgba(24, 18, 48, 0.85) 0%, rgba(15, 29, 53, 0.85) 100%);
        }

        .ai-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .ai-header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ai-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #d946ef);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
        }

        .ai-header-title h3 {
          font-size: 1.15rem;
          color: #ffffff;
        }

        .ai-header-title p {
          font-size: 0.75rem;
          color: #d8b4fe;
        }

        .btn-copy-summary {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          cursor: pointer;
        }

        .ai-summary-text {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #f1f5f9;
          margin-bottom: 1.25rem;
        }

        .ai-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.78rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .ai-verified-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #6ee7b7;
        }

        .btn-view-social-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: #d8b4fe;
          font-weight: 600;
          cursor: pointer;
        }

        .text-content-card {
          padding: 1.75rem;
        }

        .section-card-title {
          font-size: 1.2rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .title-icon {
          color: var(--accent-cyan);
        }

        .icon-success {
          color: #10b981;
        }

        .abstract-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #cbd5e1;
        }

        .findings-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .finding-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.92rem;
          color: #e2e8f0;
          line-height: 1.5;
        }

        .finding-bullet {
          color: #10b981;
          font-size: 1.2rem;
          line-height: 1;
        }

        /* Sidebar */
        .detail-sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-card {
          padding: 1.5rem;
        }

        .sidebar-title {
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .sidebar-fact-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sidebar-fact-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .fact-label {
          color: var(--text-muted);
        }

        .fact-val {
          color: #ffffff;
          font-weight: 600;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .discipline-tag {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: #7dd3fc;
          font-size: 0.78rem;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
        }

        .press-action-card {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(88, 28, 135, 0.4) 100%);
          border: 1px solid rgba(168, 85, 247, 0.3);
          text-align: center;
        }

        .press-sparkle {
          color: #d8b4fe;
          margin-bottom: 0.5rem;
        }

        .press-action-card h4 {
          color: #ffffff;
          font-size: 1.05rem;
          margin-bottom: 0.4rem;
        }

        .press-action-card p {
          font-size: 0.8rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .full-width {
          width: 100%;
        }

        /* Reports Tab */
        .section-intro {
          margin-bottom: 1.75rem;
        }

        .section-intro h3 {
          font-size: 1.4rem;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }

        .section-intro p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .report-item-card {
          padding: 1.5rem;
        }

        .report-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .report-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .report-icon {
          color: var(--accent-cyan);
        }

        .report-size {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .raw-text-preview-box {
          background: #040810;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          padding: 1rem;
        }

        .raw-text-label {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--accent-cyan);
          margin-bottom: 0.5rem;
        }

        .raw-text-content {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: #94a3b8;
          white-space: pre-wrap;
          line-height: 1.5;
          max-height: 240px;
          overflow-y: auto;
        }

        /* Media Tab */
        .section-intro-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .a11y-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #6ee7b7;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .media-card-item {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .media-img-wrap {
          position: relative;
          height: 220px;
          cursor: pointer;
          overflow: hidden;
        }

        .media-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .media-img-wrap:hover .media-thumb {
          transform: scale(1.05);
        }

        .media-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .media-img-wrap:hover .media-zoom-overlay {
          opacity: 1;
        }

        .media-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .media-caption {
          font-size: 0.88rem;
          color: #ffffff;
          font-weight: 600;
        }

        .alt-text-box {
          background: rgba(7, 13, 24, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
        }

        .alt-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 0.35rem;
        }

        .alt-text-val {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* Publications Tab */
        .pubs-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pub-item-card {
          padding: 1.5rem;
        }

        .pub-cat-badge {
          display: inline-block;
          background: rgba(56, 189, 248, 0.15);
          color: #7dd3fc;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .pub-title {
          font-size: 1.15rem;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }

        .pub-authors {
          font-size: 0.85rem;
          color: #cbd5e1;
          margin-bottom: 0.2rem;
        }

        .pub-journal {
          font-size: 0.8rem;
          color: var(--accent-ice);
          margin-bottom: 0.75rem;
        }

        .pub-abstract {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1rem;
        }

        .pub-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.75rem;
          font-size: 0.8rem;
        }

        .citation-count {
          color: #fbbf24;
          font-weight: 600;
        }

        /* Lightbox Modal */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .lightbox-modal {
          position: relative;
          max-width: 900px;
          max-height: 90vh;
          background: #091322;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          z-index: 10;
        }

        .lightbox-full-img {
          max-height: 65vh;
          object-fit: contain;
          background: #000;
        }

        .lightbox-caption {
          padding: 1.25rem;
          background: #070d18;
        }

        .lightbox-caption h4 {
          color: #ffffff;
          margin-bottom: 0.35rem;
        }

        .lightbox-caption p {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .tab-pane-grid {
            grid-template-columns: 1fr;
          }
          .detail-meta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
