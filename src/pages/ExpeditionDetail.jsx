import { useState } from 'react';
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
  Layers,
  ShieldCheck,
  Edit,
  Maximize2,
  X,
  Compass,
  Globe2,
  ArrowRight,
  Award,
  ChevronDown,
  Eye,
  EyeOff,
  FileCode
} from 'lucide-react';
import SocialCardPreview from '../components/SocialCardPreview';
import { TwitterIcon, InstagramIcon, LinkedinIcon } from '../components/SocialIcons';

export default function ExpeditionDetail({ expeditionId, onBack, navigateTo }) {
  const { expeditions, publications, auth, lang } = usePortal();
  const [activeTab, setActiveTab] = useState('overview'); // overview, reports, media, publications, social
  const [lightboxImg, setLightboxImg] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTwitter, setCopiedTwitter] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [copiedInstagram, setCopiedInstagram] = useState(false);
  const [expandedReports, setExpandedReports] = useState({});
  const [copiedReportId, setCopiedReportId] = useState(null);

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

  const handleCopyTwitter = () => {
    const tweet = expedition.aiGeneratedContent?.socialCaptions?.twitter || expedition.summary;
    navigator.clipboard.writeText(tweet);
    setCopiedTwitter(true);
    setTimeout(() => setCopiedTwitter(false), 2000);
  };

  const handleCopyLinkedIn = () => {
    const linkedin = expedition.aiGeneratedContent?.socialCaptions?.linkedin || expedition.summary;
    navigator.clipboard.writeText(linkedin);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 2000);
  };

  const handleCopyInstagram = () => {
    const insta = expedition.aiGeneratedContent?.socialCaptions?.instagram || expedition.summary;
    navigator.clipboard.writeText(insta);
    setCopiedInstagram(true);
    setTimeout(() => setCopiedInstagram(false), 2000);
  };

  const toggleReportExpanded = (repId) => {
    setExpandedReports(prev => ({
      ...prev,
      [repId]: !prev[repId]
    }));
  };

  const handleCopyReportText = (text, repId) => {
    navigator.clipboard.writeText(text);
    setCopiedReportId(repId);
    setTimeout(() => setCopiedReportId(null), 2000);
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
                  <span>Published</span>
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
        <div className="container detail-hero-content">
          <div className="detail-tags-row">
            <span className="badge badge-antarctica">{expedition.region}</span>
            <span className="detail-year-tag">
              <Calendar size={13} /> {expedition.year}
            </span>
            {expedition.aiGeneratedContent && (
              <span className="badge-ai-ready">
                <Sparkles size={12} />
                <span>Outreach Pack Ready</span>
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
              <FileText size={15} />
              <span>Overview & Outreach Summary</span>
            </button>

            <button
              className={`detail-tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <Download size={15} />
              <span>Reports ({expedition.reports?.length || 0})</span>
            </button>

            <button
              className={`detail-tab ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <ImageIcon size={15} />
              <span>Media Gallery ({expedition.media?.length || 0})</span>
            </button>

            <button
              className={`detail-tab ${activeTab === 'publications' ? 'active' : ''}`}
              onClick={() => setActiveTab('publications')}
            >
              <Layers size={15} />
              <span>Publications ({linkedPubs.length})</span>
            </button>

            <button
              className={`detail-tab tab-social ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <Sparkles size={16} className="tab-social-sparkle" />
              <span className="tab-social-title">Social Outreach Pack</span>
              <span className="tab-social-ready-badge">READY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="container detail-content-body">
        {/* Tab 1: Overview & Outreach Summary */}
        {activeTab === 'overview' && (
          <div className="tab-pane-grid">
            {/* Left Column: Plain Language Summary & Key Discoveries & Abstract */}
            <div className="detail-main-col">
              {/* Plain Language Summary Card */}
              {expedition.aiGeneratedContent ? (
                <div className="glass-panel ai-summary-highlight-card">
                  <div className="ai-card-header">
                    <div className="ai-header-title">
                      <div className="ai-icon-circle">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="ai-badge-pill">NCPOR AI Comms Engine</div>
                        <h3>Public Outreach Plain-Language Summary</h3>
                      </div>
                    </div>

                    <div className="ai-header-actions">
                      <button
                        className={`btn-outreach-action ${copiedSummary ? 'copied' : ''}`}
                        onClick={handleCopySummary}
                        title="Copy entire summary"
                      >
                        {copiedSummary ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="ai-summary-text">
                    <p>{expedition.aiGeneratedContent.summary}</p>
                  </div>

                  {/* Redesigned 1-Click Multi-Channel Outreach Bar */}
                  <div className="outreach-drafts-panel">
                    <div className="outreach-drafts-left">
                      <div className="drafts-title-badge">
                        <Share2 size={13} className="drafts-title-icon" />
                        <span>1-Click Drafts</span>
                      </div>

                      <div className="draft-buttons-group">
                        {expedition.aiGeneratedContent.socialCaptions?.twitter && (
                          <button
                            className={`social-draft-btn btn-twitter ${copiedTwitter ? 'copied' : ''}`}
                            onClick={handleCopyTwitter}
                            title="Copy 280-char X (Twitter) Post"
                          >
                            <span className="social-icon-wrapper twitter-icon-wrap">
                              {copiedTwitter ? <Check size={13} /> : <TwitterIcon size={12} />}
                            </span>
                            <span className="draft-btn-text">
                              {copiedTwitter ? 'Copied X Post!' : 'Copy X / Twitter Post'}
                            </span>
                          </button>
                        )}

                        {expedition.aiGeneratedContent.socialCaptions?.linkedin && (
                          <button
                            className={`social-draft-btn btn-linkedin ${copiedLinkedIn ? 'copied' : ''}`}
                            onClick={handleCopyLinkedIn}
                            title="Copy Professional LinkedIn Post"
                          >
                            <span className="social-icon-wrapper linkedin-icon-wrap">
                              {copiedLinkedIn ? <Check size={13} /> : <LinkedinIcon size={12} />}
                            </span>
                            <span className="draft-btn-text">
                              {copiedLinkedIn ? 'Copied LinkedIn!' : 'Copy LinkedIn Post'}
                            </span>
                          </button>
                        )}

                        {expedition.aiGeneratedContent.socialCaptions?.instagram && (
                          <button
                            className={`social-draft-btn btn-instagram ${copiedInstagram ? 'copied' : ''}`}
                            onClick={handleCopyInstagram}
                            title="Copy Instagram Caption"
                          >
                            <span className="social-icon-wrapper instagram-icon-wrap">
                              {copiedInstagram ? <Check size={13} /> : <InstagramIcon size={12} />}
                            </span>
                            <span className="draft-btn-text">
                              {copiedInstagram ? 'Copied Instagram!' : 'Copy Instagram'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      className="btn-open-studio-pill"
                      onClick={() => setActiveTab('social')}
                    >
                      <Sparkles size={13} className="studio-pill-sparkle" />
                      <span>Full Social Studio</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="ai-card-footer">
                    <div className="ai-verified-tag">
                      <ShieldCheck size={14} />
                      <span>Verified & Approved for Public Outreach by MoES / NCPOR</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel standard-summary-card">
                  <h3>Mission Overview</h3>
                  <p>{expedition.summary}</p>
                </div>
              )}

              {/* Key Discoveries & Milestones */}
              {expedition.keyFindings && expedition.keyFindings.length > 0 && (
                <div className="glass-panel text-content-card">
                  <div className="section-card-header">
                    <div className="section-card-title">
                      <Award size={18} className="title-icon icon-success" />
                      <span>Key Discoveries & Scientific Deliverables</span>
                    </div>
                    <span className="findings-counter-badge">{expedition.keyFindings.length} Breakthroughs</span>
                  </div>

                  <div className="findings-grid">
                    {expedition.keyFindings.map((finding, idx) => (
                      <div key={idx} className="finding-card">
                        <span className="finding-num">0{idx + 1}</span>
                        <div className="finding-text">
                          {finding}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scientific Abstract & Scope */}
              {expedition.scientificAbstract && (
                <div className="glass-panel text-content-card">
                  <div className="section-card-title">
                    <FileText size={18} className="title-icon" />
                    <span>Scientific Abstract & Scope</span>
                  </div>
                  <p className="abstract-text">{expedition.scientificAbstract}</p>
                </div>
              )}
            </div>

            {/* Right Sidebar: Quick Facts, Polar Coordinates & Press Kit */}
            <div className="detail-sidebar-col">
              {/* Mission Quick Facts */}
              <div className="glass-panel sidebar-card">
                <h4 className="sidebar-title">
                  <Compass size={15} />
                  <span>Expedition Quick Facts</span>
                </h4>
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
                    <span className="fact-label">Technical Reports</span>
                    <button className="fact-jump-link" onClick={() => setActiveTab('reports')}>
                      {expedition.reports?.length || 0} Files →
                    </button>
                  </div>
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Media Assets</span>
                    <button className="fact-jump-link" onClick={() => setActiveTab('media')}>
                      {expedition.media?.length || 0} Photos →
                    </button>
                  </div>
                  <div className="sidebar-fact-row">
                    <span className="fact-label">Publications</span>
                    <button className="fact-jump-link" onClick={() => setActiveTab('publications')}>
                      {linkedPubs.length} Papers →
                    </button>
                  </div>
                </div>
              </div>

              {/* Polar Location & Interactive Map Jump */}
              {expedition.coordinates && (
                <div className="glass-panel sidebar-card map-jump-card">
                  <h4 className="sidebar-title">
                    <MapPin size={15} />
                    <span>Deployment Site</span>
                  </h4>
                  <p className="map-site-label">{expedition.coordinates.label || expedition.stations?.[0]}</p>
                  <div className="map-coords-badge">
                    <span>{expedition.coordinates.lat.toFixed(4)}°, {expedition.coordinates.lng.toFixed(4)}°</span>
                  </div>
                  <button
                    className="btn-view-on-map"
                    onClick={() => navigateTo('map')}
                  >
                    <Globe2 size={14} />
                    <span>View on 3D Polar Map</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* Scientific Disciplines */}
              {expedition.tags && (
                <div className="glass-panel sidebar-card">
                  <h4 className="sidebar-title">
                    <Layers size={15} />
                    <span>Scientific Disciplines</span>
                  </h4>
                  <div className="tags-cloud">
                    {expedition.tags.map((tag, idx) => (
                      <span key={idx} className="discipline-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fast Outreach Press Package Action */}
              <div className="glass-panel press-action-card">
                <Sparkles size={20} className="press-sparkle" />
                <h4>Press & Outreach Package</h4>
                <p>Ready-to-publish summary, verified social captions, and accessible photos for media and schools.</p>
                <button
                  className="btn-primary full-width press-btn"
                  onClick={() => setActiveTab('social')}
                >
                  <Share2 size={14} />
                  <span>Open Outreach Pack</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reports & Text Extraction */}
        {activeTab === 'reports' && (
          <div className="reports-tab-container">
            <div className="reports-tab-header">
              <div className="reports-header-text">
                <div className="reports-section-title-wrap">
                  <span className="reports-section-badge">
                    <Sparkles size={13} />
                    <span>NCPOR AI Ingestion Pipeline</span>
                  </span>
                  <h3>Archived Scientific Reports & PDF Extraction</h3>
                </div>
                <p>These official expedition technical reports and field dossiers are parsed into NLP text streams to generate public outreach summaries.</p>
              </div>
            </div>

            <div className="reports-list">
              {expedition.reports && expedition.reports.map((rep) => {
                const isExpanded = !!expandedReports[rep.id];
                const isCopied = copiedReportId === rep.id;
                const wordCount = rep.rawText ? rep.rawText.trim().split(/\s+/).length : 0;
                const charCount = rep.rawText ? rep.rawText.length : 0;

                return (
                  <div key={rep.id} className="glass-panel report-card-refined">
                    <div className="report-card-main-row">
                      <div className="report-doc-info">
                        <div className="report-pdf-badge-icon">
                          <FileText size={22} className="report-pdf-icon" />
                          <span className="pdf-tag">PDF</span>
                        </div>
                        <div className="report-doc-details">
                          <h4 className="report-doc-title">{rep.title}</h4>
                          <div className="report-doc-meta-pills">
                            <span className="doc-meta-pill size-pill">{rep.fileSize || 'PDF Document'}</span>
                            <span className="doc-meta-pill moes-pill">
                              <ShieldCheck size={12} />
                              <span>Official MoES Archive</span>
                            </span>
                            {rep.rawText && (
                              <span className="doc-meta-pill ocr-pill">
                                <Sparkles size={12} />
                                <span>OCR Text Stream ({wordCount} words)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="report-card-actions">
                        {rep.rawText && (
                          <button 
                            className={`btn-rep-toggle-stream ${isExpanded ? 'active' : ''}`}
                            onClick={() => toggleReportExpanded(rep.id)}
                            title="Inspect extracted OCR text stream"
                          >
                            {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span>{isExpanded ? 'Hide Extracted Stream' : 'Inspect Text Stream'}</span>
                            <ChevronDown size={14} className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                          </button>
                        )}

                        <a 
                          href="#download" 
                          className="btn-rep-download-primary" 
                          onClick={(e) => { e.preventDefault(); alert("Downloading sample expedition report PDF archive."); }}
                        >
                          <Download size={14} />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    </div>

                    {/* Collapsible Extracted Text Stream Box */}
                    {rep.rawText && isExpanded && (
                      <div className="report-stream-inspector">
                        <div className="inspector-top-bar">
                          <div className="inspector-title">
                            <FileCode size={14} className="inspector-icon" />
                            <span>NLP Ingestion Stream Buffer</span>
                            <span className="inspector-stats-badge">{wordCount} Words • {charCount} Chars</span>
                          </div>

                          <button 
                            className={`btn-copy-stream-code ${isCopied ? 'copied' : ''}`}
                            onClick={() => handleCopyReportText(rep.rawText, rep.id)}
                            title="Copy entire raw text buffer"
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                            <span>{isCopied ? 'Stream Copied!' : 'Copy Stream'}</span>
                          </button>
                        </div>

                        <div className="inspector-code-body">
                          <pre className="inspector-pre-text">{rep.rawText}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
          background: #f8fafc;
        }

        .detail-top-bar {
          background: #ffffff;
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
          transition: color 0.15s ease;
        }

        .btn-back:hover {
          color: var(--navy);
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
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
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
          background: #f1f5f9;
          color: var(--navy);
          border: 1px solid #cbd5e1;
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
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .status-pill.draft {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        /* Detail Hero */
        .detail-hero {
          position: relative;
          padding: 3.5rem 0 2.5rem;
          background: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
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
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .detail-hero-title {
          font-size: clamp(1.45rem, 4.5vw + 0.2rem, 2.3rem);
          font-weight: 800;
          color: var(--navy);
          line-height: 1.25;
          margin-bottom: 1.5rem;
          max-width: 950px;
        }

        .detail-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          max-width: 1000px;
        }

        .meta-card {
          background: #f8fafc;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm);
          padding: 0.9rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .meta-card-icon {
          color: #059669;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .meta-card-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-weight: 600;
        }

        .meta-card-val {
          font-size: 0.88rem;
          color: var(--navy);
          font-weight: 600;
        }

        /* Nav Tabs */
        .detail-nav-tabs-wrapper {
          position: sticky;
          top: 69px;
          z-index: 50;
          background: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .detail-nav-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0.5rem 0;
        }

        .detail-nav-tabs::-webkit-scrollbar {
          display: none;
        }

        .detail-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .detail-tab:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .detail-tab.active {
          color: var(--navy);
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .detail-tab.tab-social {
          color: #059669;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
        }

        .detail-tab.tab-social .tab-social-sparkle {
          color: #059669;
          flex-shrink: 0;
        }

        .detail-tab.tab-social .tab-social-title {
          color: #059669;
          font-weight: 700;
        }

        .tab-social-ready-badge {
          background: #00875a;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: 6px;
          text-transform: uppercase;
          line-height: 1.2;
          display: inline-block;
          margin-left: 0.2rem;
        }

        .detail-tab.tab-social:hover {
          background: #ecfdf5;
          color: #047857;
        }

        .detail-tab.tab-social.active {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .detail-tab.tab-social.active .tab-social-title {
          color: #047857;
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
          padding: 1.5rem;
          border: 1px solid #bfdbfe;
          background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
          border-radius: 12px;
        }

        .ai-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .ai-header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ai-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .ai-badge-pill {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0284c7;
          margin-bottom: 0.15rem;
        }

        .ai-header-title h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0;
        }

        .ai-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-outreach-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-outreach-action:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .btn-outreach-action.copied {
          background: #ecfdf5;
          color: #059669;
          border-color: #a7f3d0;
        }

        .ai-summary-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #1e293b;
          margin-bottom: 1.15rem;
        }

        /* Redesigned 1-Click Multi-Channel Outreach Bar */
        .outreach-drafts-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%);
          border: 1px solid #bae6fd;
          border-radius: 12px;
          margin-bottom: 1.15rem;
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.05);
        }

        .outreach-drafts-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .drafts-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: rgba(2, 132, 199, 0.1);
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
        }

        .drafts-title-icon {
          color: #0284c7;
        }

        .draft-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .social-draft-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .social-draft-btn:hover {
          border-color: #94a3b8;
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
        }

        .social-icon-wrapper {
          width: 22px;
          height: 22px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        /* Twitter / X Specific */
        .twitter-icon-wrap {
          background: #0f172a;
          color: #ffffff;
        }

        .social-draft-btn.btn-twitter:hover {
          border-color: #0f172a;
          color: #0f172a;
        }

        /* LinkedIn Specific */
        .linkedin-icon-wrap {
          background: #0a66c2;
          color: #ffffff;
        }

        .social-draft-btn.btn-linkedin:hover {
          border-color: #0a66c2;
          color: #0a66c2;
        }

        /* Instagram Specific */
        .instagram-icon-wrap {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #ffffff;
        }

        .social-draft-btn.btn-instagram:hover {
          border-color: #e1306c;
          color: #e1306c;
        }

        /* Copied State */
        .social-draft-btn.copied {
          background: #ecfdf5 !important;
          border-color: #a7f3d0 !important;
          color: #059669 !important;
        }

        .social-draft-btn.copied .social-icon-wrapper {
          background: #059669 !important;
          color: #ffffff !important;
        }

        .draft-btn-text {
          font-weight: 600;
        }

        /* Full Studio Jump Pill */
        .btn-open-studio-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #0f172a;
          color: #ffffff;
          border: 1px solid #0f172a;
          padding: 0.42rem 0.85rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
          margin-left: auto;
        }

        .btn-open-studio-pill:hover {
          background: #0284c7;
          border-color: #0284c7;
          transform: translateY(-1px);
        }

        .studio-pill-sparkle {
          color: #38bdf8;
        }

        .ai-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid #dbeafe;
          font-size: 0.75rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .ai-verified-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #059669;
          font-weight: 600;
        }

        .text-content-card {
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: 12px;
        }

        .section-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .section-card-title {
          font-size: 1.08rem;
          font-weight: 700;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0;
        }

        .title-icon {
          color: #0284c7;
        }

        .icon-success {
          color: #059669;
        }

        .findings-counter-badge {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #059669;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
        }

        .findings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 0.85rem;
        }

        .finding-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.85rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .finding-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .finding-num {
          font-size: 0.75rem;
          font-weight: 800;
          color: #059669;
          background: #ecfdf5;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          line-height: 1;
          flex-shrink: 0;
        }

        .finding-text {
          font-size: 0.83rem;
          color: #334155;
          line-height: 1.5;
        }

        .abstract-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #475569;
        }

        /* Sidebar */
        .detail-sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .sidebar-card {
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: 12px;
        }

        .sidebar-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .sidebar-fact-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .sidebar-fact-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          padding-bottom: 0.45rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .fact-label {
          color: #64748b;
        }

        .fact-val {
          color: #0f172a;
          font-weight: 600;
        }

        .fact-jump-link {
          background: none;
          border: none;
          color: #0284c7;
          font-weight: 700;
          font-size: 0.78rem;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }

        .fact-jump-link:hover {
          color: #0369a1;
          text-decoration: underline;
        }

        .map-jump-card {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .map-site-label {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.35rem;
        }

        .map-coords-badge {
          display: inline-block;
          background: #e2e8f0;
          color: #475569;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .btn-view-on-map {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0.5rem 0.85rem;
          border-radius: 7px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-view-on-map:hover {
          background: #0284c7;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .discipline-tag {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 5px;
        }

        .press-action-card {
          padding: 1.25rem;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          text-align: center;
        }

        .press-sparkle {
          color: #059669;
          margin-bottom: 0.35rem;
        }

        .press-action-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 0.3rem;
        }

        .press-action-card p {
          font-size: 0.76rem;
          color: #047857;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .press-btn {
          font-size: 0.8rem;
          padding: 0.45rem 0.8rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .full-width {
          width: 100%;
        }

        /* Refined Reports Tab Styling */
        .reports-tab-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .reports-tab-header {
          margin-bottom: 0.5rem;
        }

        .reports-section-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 0.35rem;
        }

        .reports-section-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(2, 132, 199, 0.1);
          border: 1px solid rgba(2, 132, 199, 0.2);
          color: #0284c7;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          width: fit-content;
        }

        .reports-section-title-wrap h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .reports-header-text p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .report-card-refined {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .report-card-refined:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .report-card-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.4rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .report-doc-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 280px;
        }

        .report-pdf-badge-icon {
          width: 44px;
          height: 48px;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 1px solid #fca5a5;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.12);
        }

        .report-pdf-icon {
          color: #dc2626;
        }

        .pdf-tag {
          font-size: 0.6rem;
          font-weight: 900;
          color: #b91c1c;
          letter-spacing: 0.02em;
          line-height: 1;
          margin-top: 1px;
        }

        .report-doc-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .report-doc-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0;
          line-height: 1.35;
        }

        .report-doc-meta-pills {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .doc-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: 5px;
        }

        .doc-meta-pill.size-pill {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .doc-meta-pill.moes-pill {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .doc-meta-pill.ocr-pill {
          background: #eff6ff;
          color: #0284c7;
          border: 1px solid #bfdbfe;
        }

        .report-card-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .btn-rep-toggle-stream {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-rep-toggle-stream:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .btn-rep-toggle-stream.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #0284c7;
        }

        .chevron-icon {
          transition: transform 0.2s ease;
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .btn-rep-download-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #0f172a;
          border: 1px solid #0f172a;
          color: #ffffff;
          padding: 0.45rem 0.95rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
        }

        .btn-rep-download-primary:hover {
          background: #0284c7;
          border-color: #0284c7;
          transform: translateY(-1px);
        }

        /* Extracted Stream Code Inspector */
        .report-stream-inspector {
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #1e293b;
          animation: slideDownStream 0.2s ease-out;
        }

        @keyframes slideDownStream {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .inspector-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1.15rem;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .inspector-title {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.76rem;
          font-weight: 700;
          color: #0369a1;
          font-family: var(--font-mono, monospace);
        }

        .inspector-icon {
          color: #0284c7;
        }

        .inspector-stats-badge {
          font-size: 0.7rem;
          color: #0369a1;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          margin-left: 0.35rem;
        }

        .btn-copy-stream-code {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.25rem 0.65rem;
          border-radius: 5px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .btn-copy-stream-code:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0284c7;
        }

        .btn-copy-stream-code.copied {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #059669;
        }

        .inspector-code-body {
          padding: 1.15rem 1.35rem;
          max-height: 280px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .inspector-pre-text {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.8rem;
          color: #334155;
          line-height: 1.6;
          white-space: pre-wrap;
          margin: 0;
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
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
          gap: 1.5rem;
        }

        .media-card-item {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #ffffff;
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
          background: rgba(0, 0, 0, 0.3);
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
          color: var(--navy);
          font-weight: 600;
        }

        .alt-text-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 0.75rem;
        }

        .alt-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 0.35rem;
        }

        .alt-text-val {
          font-size: 0.78rem;
          color: #475569;
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
          background: #ffffff;
        }

        .pub-cat-badge {
          display: inline-block;
          background: #ecfdf5;
          color: #047857;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .pub-title {
          font-size: 1.15rem;
          color: var(--navy);
          margin-bottom: 0.35rem;
        }

        .pub-authors {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.2rem;
        }

        .pub-journal {
          font-size: 0.8rem;
          color: #059669;
          margin-bottom: 0.75rem;
        }

        .pub-abstract {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 1rem;
        }

        .pub-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
          padding-top: 0.75rem;
          font-size: 0.8rem;
        }

        .citation-count {
          color: #d97706;
          font-weight: 600;
        }

        /* Lightbox Modal */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.85);
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
          background: #ffffff;
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
        }

        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(15, 23, 42, 0.8);
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
          background: #f1f5f9;
        }

        .lightbox-caption {
          padding: 1.25rem;
          background: #ffffff;
        }

        .lightbox-caption h4 {
          color: var(--navy);
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
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .detail-top-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .detail-actions-right {
            width: 100%;
            justify-content: space-between;
          }
          .detail-hero {
            padding: 2.25rem 0 1.75rem;
          }
          .detail-content-body {
            padding: 1.5rem 0 3.5rem;
          }
        }

        @media (max-width: 640px) {
          .detail-meta-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .lightbox-backdrop {
            padding: 0.75rem;
          }
          .lightbox-full-img {
            max-height: 48vh;
          }
          .lightbox-caption {
            padding: 1rem;
          }
          .ai-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .outreach-drafts-panel {
            flex-direction: column;
            align-items: stretch;
          }
          .outreach-drafts-left {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }
          .draft-buttons-group {
            width: 100%;
          }
          .social-draft-btn {
            flex: 1;
            justify-content: center;
          }
          .btn-open-studio-pill {
            width: 100%;
            justify-content: center;
          }
          .report-card-main-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .report-card-actions {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .btn-rep-toggle-stream,
          .btn-rep-download-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
