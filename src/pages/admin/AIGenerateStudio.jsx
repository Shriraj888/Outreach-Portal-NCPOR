import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  generateOutreachPackage, 
  AI_AUDIENCE_TONES, 
  buildPromptTemplate 
} from '../../services/aiService';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  FileText, 
  Share2, 
  RotateCcw, 
  Code,
  Terminal,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon, FacebookIcon, BlogIcon, ArticleIcon } from '../../components/SocialIcons';
import SocialCardPreview from '../../components/SocialCardPreview';

const SOCIAL_CHANNELS = [
  { id: 'twitter', name: 'Twitter / X', icon: TwitterIcon, subtag: 'Under 280 chars', borderClass: 'twitter-border', colorClass: 'twitter' },
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, subtag: 'Storytelling', borderClass: 'instagram-border', colorClass: 'instagram' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon, subtag: 'Executive', borderClass: 'linkedin-border', colorClass: 'linkedin' },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon, subtag: 'Community Post', borderClass: 'facebook-border', colorClass: 'facebook' },
  { id: 'blog', name: 'Science Blog', icon: BlogIcon, subtag: 'Long-Form Markdown', borderClass: 'blog-border', colorClass: 'blog' },
  { id: 'article', name: 'Press Article', icon: ArticleIcon, subtag: 'Official Dispatch', borderClass: 'article-border', colorClass: 'article' }
];

export default function AIGenerateStudio({ expeditionId, onBack, onSelectExpedition }) {
  const { 
    expeditions, 
    datasets, 
    publications, 
    mediaArchives, 
    activities, 
    saveGeneratedContent 
  } = usePortal();

  // Find asset across all 6 Problem Statement pillars
  const expeditionMatch = expeditions.find(e => e.id === expeditionId);
  const datasetMatch = datasets.find(d => d.id === expeditionId);
  const pubMatch = publications.find(p => p.id === expeditionId);
  const mediaMatch = mediaArchives.find(m => m.id === expeditionId);
  const actMatch = activities.find(a => a.id === expeditionId);

  const asset = expeditionMatch || datasetMatch || pubMatch || mediaMatch || actMatch || expeditions[0];
  const assetType = datasetMatch ? 'dataset' : pubMatch ? 'publication' : mediaMatch ? 'media' : actMatch ? 'activity' : 'expedition';
  const expedition = {
    ...asset,
    heroImage: asset.heroImage || asset.url || 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80'
  };

  const [audience, setAudience] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // summary, social, altText, compare

  const defaultSocial = {
    twitter: asset.aiGeneratedContent?.socialCaptions?.twitter || "❄️ Setting sail for scientific discovery! The Indian Scientific Expedition #NCPOR #MoES has deployed critical cryosphere & climate monitoring assets. 🇮🇳🇦🇶 #PolarScience",
    instagram: asset.aiGeneratedContent?.socialCaptions?.instagram || "Into the White Wilderness! 🇦🇶✨\n\nNCPOR researchers are advancing frontline polar science—from autonomous weather buoys to ice-core climate archives!\n\n#Antarctica #NCPOR #PolarExploration #ClimateScience #IndiaInAntarctica",
    linkedin: asset.aiGeneratedContent?.socialCaptions?.linkedin || "The National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, presents scientific updates on polar expedition operations.\n\nKey Milestones:\n🔹 Autonomous cryospheric sensor arrays deployed.\n🔹 Paleoclimate data records logged.\n🔹 Zero-emission station energy systems tested.",
    facebook: asset.aiGeneratedContent?.socialCaptions?.facebook || `❄️ Exploring the Ends of the Earth! 🌏 Discover how Indian scientists with the National Centre for Polar and Ocean Research (NCPOR) conducted vital research during the ${expedition.title || 'mission'} in ${expedition.region || 'Polar regions'}.\n\n🔬 Highlights of the Mission:\n• In-situ baseline recording under extreme conditions\n• Deployment of real-time telemetry sensor arrays\n• Uncovering critical links between polar weather and the Indian monsoon\n\n👉 Share this to celebrate Indian science! 🇮🇳\n\n#NCPOR #MoES #PolarScience #IndiaInAntarctica`,
    blog: asset.aiGeneratedContent?.socialCaptions?.blog || `## Exploring the Frontiers of Polar Science: Insights from ${expedition.title || 'Polar Mission'}\n\n**By NCPOR Science Outreach Division**\n\nPolar regions may feel a world away, but the groundbreaking work conducted during **${expedition.title || 'the expedition'}** in ${expedition.region || 'the polar frontier'} directly influences our global climate and the Indian monsoon system.\n\n### Key Mission Milestones\n- **In-situ Cryospheric Probing**: High-resolution ice profiling across polar margins.\n- **Atmospheric Physics**: Continuous baseline monitoring of polar air masses.\n- **Green Hybrid Power Integration**: Reducing fuel dependency in sub-zero environments.\n\n### Why This Matters for India\nWhat happens at the poles drives deep oceanic and atmospheric teleconnections. By deploying cutting-edge instrumentation and retrieving unblemished climate records, Indian researchers are safeguarding our future and cementing India's leadership in the Antarctic Treaty System.\n\n*Explore open datasets and reports on the NCPOR Portal.*`,
    article: asset.aiGeneratedContent?.socialCaptions?.article || `PRESS RELEASE / NATIONAL SCIENCE DISPATCH\n\nDATELINE: GOA / NEW DELHI — MINISTRY OF EARTH SCIENCES, GOVT. OF INDIA\n\nSUBJECT: NCPOR Issues Scientific Report on ${expedition.title || 'Polar Expedition'}\n\nThe National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, announces the successful archival and validation of technical logs from ${expedition.title || 'the expedition'} in ${expedition.region || 'the polar region'}.\n\nKey Achievements:\n1. Recovery of benchmark scientific logs from extreme polar terrain.\n2. Deployment of autonomous sensor buoys with satellite links.\n3. Validation of cold-tolerant renewable microgrids.\n\nThe complete archive, comprising peer-reviewed papers, open datasets, and outreach multimedia, is publicly accessible on the NCPOR Outreach Portal.`
  };

  // Working draft states
  const [draftSummary, setDraftSummary] = useState(asset.aiGeneratedContent?.summary || asset.summary || asset.abstract || '');
  const [draftTwitter, setDraftTwitter] = useState(defaultSocial.twitter);
  const [draftInstagram, setDraftInstagram] = useState(defaultSocial.instagram);
  const [draftLinkedin, setDraftLinkedin] = useState(defaultSocial.linkedin);
  const [draftFacebook, setDraftFacebook] = useState(defaultSocial.facebook);
  const [draftBlog, setDraftBlog] = useState(defaultSocial.blog);
  const [draftArticle, setDraftArticle] = useState(defaultSocial.article);
  const [altTextMap, setAltTextMap] = useState({});
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [editorChannel, setEditorChannel] = useState('twitter');
  const [mockupPlatform, setMockupPlatform] = useState('twitter');
  const [collapsedCards, setCollapsedCards] = useState({});

  const toggleCardCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const collapseAllCards = () => {
    setCollapsedCards({
      twitter: true,
      instagram: true,
      linkedin: true,
      facebook: true,
      blog: true,
      article: true
    });
  };

  const expandAllCards = () => {
    setCollapsedCards({});
  };

  const handleSelectEditorChannel = (channelId) => {
    setEditorChannel(channelId);
    if (channelId !== 'all') {
      setMockupPlatform(channelId);
    }
  };

  // Trigger Generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const rawReport = asset.reports && asset.reports[0]?.rawText 
        ? asset.reports[0].rawText 
        : asset.scientificAbstract || asset.summary || asset.abstract || asset.parameters?.join(', ') || '';

      const result = await generateOutreachPackage({
        asset: { ...asset, scientificAbstract: rawReport },
        assetType,
        audience
      });

      setDraftSummary(result.summary);
      if (result.socialCaptions?.twitter) setDraftTwitter(result.socialCaptions.twitter);
      if (result.socialCaptions?.instagram) setDraftInstagram(result.socialCaptions.instagram);
      if (result.socialCaptions?.linkedin) setDraftLinkedin(result.socialCaptions.linkedin);
      if (result.socialCaptions?.facebook) setDraftFacebook(result.socialCaptions.facebook);
      if (result.socialCaptions?.blog) setDraftBlog(result.socialCaptions.blog);
      if (result.socialCaptions?.article) setDraftArticle(result.socialCaptions.article);

      // Map Alt texts
      const newAltMap = {};
      (result.altTextSuggestions || []).forEach(item => {
        newAltMap[item.mediaId] = item.suggestedAlt;
      });
      setAltTextMap(newAltMap);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    const aiPackage = {
      summary: draftSummary,
      socialCaptions: {
        twitter: draftTwitter,
        instagram: draftInstagram,
        linkedin: draftLinkedin,
        facebook: draftFacebook,
        blog: draftBlog,
        article: draftArticle
      },
      isApproved: true,
      approvedAt: new Date().toISOString()
    };

    saveGeneratedContent(asset.id, aiPackage, true, assetType);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
    }, 4000);
  };

  const prompts = buildPromptTemplate({
    title: asset.title,
    region: asset.region || "Antarctica",
    year: asset.year || 2024,
    chiefScientist: asset.chiefScientist || asset.authors?.join(', ') || "NCPOR Research Corps",
    rawText: asset.reports?.[0]?.rawText || asset.scientificAbstract || asset.summary || asset.abstract || "",
    audience: AI_AUDIENCE_TONES.find(a => a.id === audience)?.label || "General Public",
    contentType: "summary",
    assetType
  });

  return (
    <div className="container ai-studio-page">
      {/* Top Banner */}
      <div className="studio-top-bar">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="studio-title-badge">
          <Sparkles size={16} className="studio-sparkle pulse-glow" />
          <span>NCPOR AI CONTENT GENERATION & REVIEW STUDIO</span>
        </div>

        <button 
          className="btn-text-action"
          onClick={() => setShowPromptInspector(!showPromptInspector)}
        >
          <Code size={14} />
          <span>{showPromptInspector ? 'Hide Prompt Design' : 'Inspect LLM Prompts'}</span>
        </button>
      </div>

      {/* Mission Context Bar */}
      <div className="glass-panel studio-mission-bar">
        <div className="mission-bar-left">
          <img src={expedition.heroImage} alt={expedition.title} className="mission-bar-thumb" />
          <div>
            <div className="mission-bar-tag">{expedition.region} • {expedition.year}</div>
            <h2 className="mission-bar-title">{expedition.title}</h2>
          </div>
        </div>

        <div className="mission-bar-right">
          <div className="tone-selector-wrap">
            <span className="tone-label">Target Audience & Tone:</span>
            <select 
              value={audience} 
              onChange={(e) => setAudience(e.target.value)}
              className="tone-select-field"
            >
              {AI_AUDIENCE_TONES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn-ai generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles size={16} className={isGenerating ? 'spin-anim' : ''} />
            <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate All Outreach Content'}</span>
          </button>
        </div>
      </div>

      {/* Prompt Inspector Modal / Collapsible */}
      {showPromptInspector && (
        <div className="glass-panel prompt-inspector-card">
          <div className="prompt-header">
            <Terminal size={16} className="prompt-term-icon" />
            <h4>Prompt Engineering & Institutional Grounding Architecture</h4>
          </div>
          <div className="prompt-grid">
            <div>
              <div className="prompt-box-label">System Role Prompt:</div>
              <pre className="prompt-code-block">{prompts.systemPrompt}</pre>
            </div>
            <div>
              <div className="prompt-box-label">Task Instruction Prompt ({audience}):</div>
              <pre className="prompt-code-block">{prompts.taskPrompt}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {publishSuccess && (
        <div className="publish-success-alert glass-panel">
          <div className="alert-content">
            <CheckCircle2 size={24} className="alert-icon" />
            <div>
              <h4>Successfully Approved & Published to Live Citizen Portal!</h4>
              <p>The AI-enhanced summary, alt-text tags, and social press kit are now publicly discoverable.</p>
            </div>
          </div>
          <button 
            className="btn-primary btn-sm"
            onClick={() => onSelectExpedition(expedition.id)}
          >
            <span>View Live Expedition Page</span>
            <Eye size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="studio-tabs-row">
        <button 
          className={`studio-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <FileText size={15} />
          <span>1. Plain-Language Summary Draft</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <Share2 size={15} />
          <span>2. Multi-Platform Social & Press Studio</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'altText' ? 'active' : ''}`}
          onClick={() => setActiveTab('altText')}
        >
          <ShieldCheck size={15} />
          <span>3. WCAG-AA Accessibility Alt-Text</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <RotateCcw size={15} />
          <span>4. Side-by-Side Verification (Raw vs AI)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="studio-main-body">
        {/* Tab 1: Plain-Language Summary */}
        {activeTab === 'summary' && (
          <div className="glass-panel studio-editor-card">
            <div className="editor-card-header">
              <div>
                <h3>Plain-Language Outreach Summary</h3>
                <p>Designed for students, journalists, and citizens. Edit directly below before final publishing.</p>
              </div>
              <span className="char-indicator">{draftSummary.length} characters</span>
            </div>

            <textarea 
              rows={6}
              value={draftSummary}
              onChange={(e) => setDraftSummary(e.target.value)}
              className="studio-textarea summary-field"
              placeholder="Click 'Generate All Outreach Content' above or type draft summary..."
            />
          </div>
        )}

        {/* Tab 2: Multi-Platform Social & Press Studio */}
        {activeTab === 'social' && (
          <div className="studio-social-layout">
            <div className="glass-panel social-editor-pane">
              <div className="social-editor-header">
                <div className="editor-title-wrap">
                  <div className="editor-badge-icon">
                    <Share2 size={16} />
                  </div>
                  <div>
                    <h3 className="editor-heading">Edit Social, Blog & Press Content</h3>
                    <p className="editor-subtext">
                      Multi-channel outreach variants tuned with Government of India and polar research tags for social networks, science blog, and official press releases.
                    </p>
                  </div>
                </div>

                {/* Channel Filter & View Mode Bar */}
                <div className="editor-channel-bar">
                  <div className="channel-pills-wrap">
                    {SOCIAL_CHANNELS.map(ch => {
                      const Icon = ch.icon;
                      const isActive = editorChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          className={`ch-filter-btn ${isActive ? 'active' : ''} ${ch.colorClass}`}
                          onClick={() => handleSelectEditorChannel(ch.id)}
                          title={`Edit ${ch.name}`}
                        >
                          <Icon size={13} />
                          <span>{ch.name}</span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      className={`ch-filter-btn all-btn ${editorChannel === 'all' ? 'active' : ''}`}
                      onClick={() => handleSelectEditorChannel('all')}
                      title="View all 6 channels simultaneously"
                    >
                      <Layers size={13} />
                      <span>All Channels (6)</span>
                    </button>
                  </div>
                </div>

                {editorChannel === 'all' ? (
                  <div className="all-channels-meta-bar">
                    <span className="meta-info">Showing all 6 channels · Click card headers to collapse</span>
                    <div className="meta-actions">
                      <button type="button" className="meta-toggle-btn" onClick={collapseAllCards}>Collapse All</button>
                      <button type="button" className="meta-toggle-btn" onClick={expandAllCards}>Expand All</button>
                    </div>
                  </div>
                ) : (
                  <div className="focused-channel-hint">
                    <span className="hint-dot"></span>
                    <span>Editing <strong>{SOCIAL_CHANNELS.find(c => c.id === editorChannel)?.name}</strong> · Select any pill above or click mockup tab to switch</span>
                  </div>
                )}
              </div>

              {/* Twitter / X */}
              {(editorChannel === 'all' || editorChannel === 'twitter') && (
                <div className={`social-card-item twitter-border ${editorChannel === 'all' && collapsedCards.twitter ? 'is-collapsed' : ''}`}>
                  <div 
                    className={`social-label-row ${editorChannel === 'all' ? 'clickable-header' : ''}`}
                    onClick={editorChannel === 'all' ? () => toggleCardCollapse('twitter') : undefined}
                  >
                    <div className="platform-tag twitter">
                      <TwitterIcon size={14} />
                      <span>Twitter / X</span>
                      <span className="platform-subtag">Under 280 chars</span>
                    </div>
                    <div className="card-header-controls">
                      <span className={`char-badge ${draftTwitter.length > 280 ? 'over-limit' : ''}`}>
                        {draftTwitter.length} / 280
                      </span>
                      {editorChannel === 'all' && (
                        <button type="button" className="chevron-toggle-btn" aria-label="Toggle collapse">
                          {collapsedCards.twitter ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {!(editorChannel === 'all' && collapsedCards.twitter) ? (
                    <>
                      <textarea 
                        rows={4}
                        value={draftTwitter}
                        onChange={(e) => setDraftTwitter(e.target.value)}
                        className="studio-textarea"
                        placeholder="Draft Twitter / X message..."
                      />
                      <div className="tag-chips-mini">
                        <span className="tags-hint">Tags:</span>
                        {['#NCPOR', '#PolarScience', '#MoES', '#Antarctica'].map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            className="chip-mini-btn"
                            onClick={() => {
                              if (!draftTwitter.includes(tag)) {
                                setDraftTwitter(prev => `${prev.trim()} ${tag}`);
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="collapsed-preview-snippet" onClick={() => toggleCardCollapse('twitter')}>
                      {draftTwitter.slice(0, 95)}...
                    </div>
                  )}
                </div>
              )}

              {/* Instagram */}
              {(editorChannel === 'all' || editorChannel === 'instagram') && (
                <div className={`social-card-item instagram-border ${editorChannel === 'all' && collapsedCards.instagram ? 'is-collapsed' : ''}`}>
                  <div 
                    className={`social-label-row ${editorChannel === 'all' ? 'clickable-header' : ''}`}
                    onClick={editorChannel === 'all' ? () => toggleCardCollapse('instagram') : undefined}
                  >
                    <div className="platform-tag instagram">
                      <InstagramIcon size={14} />
                      <span>Instagram</span>
                      <span className="platform-subtag">Storytelling</span>
                    </div>
                    <div className="card-header-controls">
                      <span className="char-badge">{draftInstagram.length} chars</span>
                      {editorChannel === 'all' && (
                        <button type="button" className="chevron-toggle-btn" aria-label="Toggle collapse">
                          {collapsedCards.instagram ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {!(editorChannel === 'all' && collapsedCards.instagram) ? (
                    <>
                      <textarea 
                        rows={5}
                        value={draftInstagram}
                        onChange={(e) => setDraftInstagram(e.target.value)}
                        className="studio-textarea"
                        placeholder="Draft Instagram story and description..."
                      />
                      <div className="tag-chips-mini">
                        <span className="tags-hint">Tags:</span>
                        {['#PolarExploration', '#ClimateScience', '#IndiaInAntarctica'].map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            className="chip-mini-btn"
                            onClick={() => {
                              if (!draftInstagram.includes(tag)) {
                                setDraftInstagram(prev => `${prev.trim()} ${tag}`);
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="collapsed-preview-snippet" onClick={() => toggleCardCollapse('instagram')}>
                      {draftInstagram.slice(0, 95)}...
                    </div>
                  )}
                </div>
              )}

              {/* LinkedIn */}
              {(editorChannel === 'all' || editorChannel === 'linkedin') && (
                <div className={`social-card-item linkedin-border ${editorChannel === 'all' && collapsedCards.linkedin ? 'is-collapsed' : ''}`}>
                  <div 
                    className={`social-label-row ${editorChannel === 'all' ? 'clickable-header' : ''}`}
                    onClick={editorChannel === 'all' ? () => toggleCardCollapse('linkedin') : undefined}
                  >
                    <div className="platform-tag linkedin">
                      <LinkedinIcon size={14} />
                      <span>LinkedIn</span>
                      <span className="platform-subtag">Executive</span>
                    </div>
                    <div className="card-header-controls">
                      <span className="char-badge">{draftLinkedin.length} chars</span>
                      {editorChannel === 'all' && (
                        <button type="button" className="chevron-toggle-btn" aria-label="Toggle collapse">
                          {collapsedCards.linkedin ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {!(editorChannel === 'all' && collapsedCards.linkedin) ? (
                    <>
                      <textarea 
                        rows={5}
                        value={draftLinkedin}
                        onChange={(e) => setDraftLinkedin(e.target.value)}
                        className="studio-textarea"
                        placeholder="Draft executive LinkedIn update..."
                      />
                      <div className="tag-chips-mini">
                        <span className="tags-hint">Tags:</span>
                        {['#NCPOR', '#EarthSciences', '#OpenScience', '#ClimateResilience'].map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            className="chip-mini-btn"
                            onClick={() => {
                              if (!draftLinkedin.includes(tag)) {
                                setDraftLinkedin(prev => `${prev.trim()} ${tag}`);
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="collapsed-preview-snippet" onClick={() => toggleCardCollapse('linkedin')}>
                      {draftLinkedin.slice(0, 95)}...
                    </div>
                  )}
                </div>
              )}

              {/* Facebook */}
              {(editorChannel === 'all' || editorChannel === 'facebook') && (
                <div className={`social-card-item facebook-border ${editorChannel === 'all' && collapsedCards.facebook ? 'is-collapsed' : ''}`}>
                  <div 
                    className={`social-label-row ${editorChannel === 'all' ? 'clickable-header' : ''}`}
                    onClick={editorChannel === 'all' ? () => toggleCardCollapse('facebook') : undefined}
                  >
                    <div className="platform-tag facebook">
                      <FacebookIcon size={14} />
                      <span>Facebook</span>
                      <span className="platform-subtag">Community Post</span>
                    </div>
                    <div className="card-header-controls">
                      <span className="char-badge">{draftFacebook.length} chars</span>
                      {editorChannel === 'all' && (
                        <button type="button" className="chevron-toggle-btn" aria-label="Toggle collapse">
                          {collapsedCards.facebook ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {!(editorChannel === 'all' && collapsedCards.facebook) ? (
                    <>
                      <textarea 
                        rows={5}
                        value={draftFacebook}
                        onChange={(e) => setDraftFacebook(e.target.value)}
                        className="studio-textarea"
                        placeholder="Draft community Facebook announcement..."
                      />
                      <div className="tag-chips-mini">
                        <span className="tags-hint">Tags:</span>
                        {['#NCPOR', '#MoES', '#PolarScience', '#IndiaInAntarctica'].map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            className="chip-mini-btn"
                            onClick={() => {
                              if (!draftFacebook.includes(tag)) {
                                setDraftFacebook(prev => `${prev.trim()} ${tag}`);
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="collapsed-preview-snippet" onClick={() => toggleCardCollapse('facebook')}>
                      {draftFacebook.slice(0, 95)}...
                    </div>
                  )}
                </div>
              )}

              {/* Science Blog */}
              {(editorChannel === 'all' || editorChannel === 'blog') && (
                <div className={`social-card-item blog-border ${editorChannel === 'all' && collapsedCards.blog ? 'is-collapsed' : ''}`}>
                  <div 
                    className={`social-label-row ${editorChannel === 'all' ? 'clickable-header' : ''}`}
                    onClick={editorChannel === 'all' ? () => toggleCardCollapse('blog') : undefined}
                  >
                    <div className="platform-tag blog">
                      <BlogIcon size={14} />
                      <span>Science Blog</span>
                      <span className="platform-subtag">Long-Form Markdown</span>
                    </div>
                    <div className="card-header-controls">
                      <span className="char-badge">
                        {draftBlog.length} chars · {draftBlog.split(/\s+/).filter(Boolean).length} words
                      </span>
                      {editorChannel === 'all' && (
                        <button type="button" className="chevron-toggle-btn" aria-label="Toggle collapse">
                          {collapsedCards.blog ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {!(editorChannel === 'all' && collapsedCards.blog) ? (
                    <>
                      <textarea 
                        rows={8}
                        value={draftBlog}
                        onChange={(e) => setDraftBlog(e.target.value)}
                        className="studio-textarea mono-textarea"
                        placeholder="Draft comprehensive Science Blog post (Markdown supported)..."
                      />
                      <div className="tag-chips-mini">
                        <span className="tags-hint">Tags:</span>
                        {['#NCPORBlog', '#PolarScience', '#ClimateResearch', '#Cryosphere'].map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            className="chip-mini-btn"
                            onClick={() => {
                              if (!draftBlog.includes(tag)) {
                                setDraftBlog(prev => `${prev.trim()}\n\n${tag}`);
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="collapsed-preview-snippet" onClick={() => toggleCardCollapse('blog')}>
                      {draftBlog.slice(0, 95)}...
                    </div>
                  )}
                </div>
              )}

              {/* Press Article */}
              {(editorChannel === 'all' || editorChannel === 'article') && (
                <div className={`social-card-item article-border ${editorChannel === 'all' && collapsedCards.article ? 'is-collapsed' : ''}`}>
                  <div 
                    className={`social-label-row ${editorChannel === 'all' ? 'clickable-header' : ''}`}
                    onClick={editorChannel === 'all' ? () => toggleCardCollapse('article') : undefined}
                  >
                    <div className="platform-tag article">
                      <ArticleIcon size={14} />
                      <span>Press Article</span>
                      <span className="platform-subtag">Official Dispatch</span>
                    </div>
                    <div className="card-header-controls">
                      <span className="char-badge">
                        {draftArticle.length} chars · {draftArticle.split(/\s+/).filter(Boolean).length} words
                      </span>
                      {editorChannel === 'all' && (
                        <button type="button" className="chevron-toggle-btn" aria-label="Toggle collapse">
                          {collapsedCards.article ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {!(editorChannel === 'all' && collapsedCards.article) ? (
                    <>
                      <textarea 
                        rows={8}
                        value={draftArticle}
                        onChange={(e) => setDraftArticle(e.target.value)}
                        className="studio-textarea mono-textarea"
                        placeholder="Draft official press release article dispatch..."
                      />
                      <div className="tag-chips-mini">
                        <span className="tags-hint">Tags:</span>
                        {['#PressRelease', '#MoES', '#GovernmentOfIndia', '#PolarMilestone'].map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            className="chip-mini-btn"
                            onClick={() => {
                              if (!draftArticle.includes(tag)) {
                                setDraftArticle(prev => `${prev.trim()}\n\n${tag}`);
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="collapsed-preview-snippet" onClick={() => toggleCardCollapse('article')}>
                      {draftArticle.slice(0, 95)}...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Interactive Preview */}
            <div className="social-preview-pane">
              <SocialCardPreview 
                aiContent={{
                  socialCaptions: {
                    twitter: draftTwitter,
                    instagram: draftInstagram,
                    linkedin: draftLinkedin,
                    facebook: draftFacebook,
                    blog: draftBlog,
                    article: draftArticle
                  }
                }}
                activePlatform={mockupPlatform}
                onPlatformChange={(p) => {
                  setMockupPlatform(p);
                  if (editorChannel !== 'all') {
                    setEditorChannel(p);
                  }
                }}
                expeditionTitle={expedition.title}
                region={expedition.region}
                mediaUrl={expedition.media && expedition.media[0]?.url}
                mediaList={expedition.media || []}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Accessibility Alt-Text */}
        {activeTab === 'altText' && (
          <div className="glass-panel alt-text-studio-card">
            <div className="editor-card-header">
              <div>
                <h3>WCAG-AA Automated Image Alt-Text</h3>
                <p>Ensures students with visual impairments and screen readers can fully experience polar science imagery.</p>
              </div>
              <span className="a11y-verified-badge">
                <ShieldCheck size={14} />
                <span>Accessibility Compliant</span>
              </span>
            </div>

            <div className="alt-text-grid">
              {(expedition.media || []).map((m, idx) => (
                <div key={m.id || idx} className="alt-item-card">
                  <img src={m.url} alt={m.caption} className="alt-item-thumb" />
                  <div className="alt-item-body">
                    <div className="alt-item-caption"><strong>Caption:</strong> {m.caption}</div>
                    <label className="alt-field-label">AI Suggested Alt-Text (Editable):</label>
                    <textarea 
                      rows={3}
                      value={altTextMap[m.id] || m.altText}
                      onChange={(e) => {
                        setAltTextMap({ ...altTextMap, [m.id]: e.target.value });
                      }}
                      className="studio-textarea"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Side-by-Side Comparison */}
        {activeTab === 'compare' && (
          <div className="compare-grid">
            <div className="glass-panel compare-pane">
              <div className="compare-pane-header">
                <FileText size={16} />
                <h4>Original Raw Technical Scientific Report (Extracted Text)</h4>
              </div>
              <pre className="compare-raw-box font-mono">
                {expedition.reports && expedition.reports[0]?.rawText ? expedition.reports[0].rawText : expedition.scientificAbstract}
              </pre>
            </div>

            <div className="glass-panel compare-pane ai-pane">
              <div className="compare-pane-header">
                <Sparkles size={16} />
                <h4>AI-Generated Public Outreach Summary</h4>
              </div>
              <div className="compare-ai-box">
                <p>{draftSummary}</p>
                <div className="compare-social-snippets">
                  <div className="snippet-item">
                    <strong>Twitter Draft:</strong> {draftTwitter}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publishing Action Footer */}
      <div className="studio-footer-bar glass-panel">
        <div className="footer-status-info">
          <ShieldCheck size={18} className="shield-icon" />
          <span>Human-in-the-Loop Review: Ready for Approval</span>
        </div>

        <div className="footer-action-btns">
          <button className="btn-secondary" onClick={onBack}>
            <span>Cancel</span>
          </button>

          <button className="btn-ai" onClick={handlePublish}>
            <CheckCircle2 size={16} />
            <span>Approve & Publish to Citizen Portal</span>
          </button>
        </div>
      </div>

      <style>{`
        .ai-studio-page {
          padding: 2.5rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .studio-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .studio-title-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #0369a1;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .studio-sparkle {
          color: #0284c7;
        }

        /* Mission Bar */
        .studio-mission-bar {
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .mission-bar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mission-bar-thumb {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid var(--border-subtle);
          background: #f1f5f9;
        }

        .mission-bar-tag {
          font-size: 0.75rem;
          color: #0284c7;
          font-weight: 700;
        }

        .mission-bar-title {
          font-size: 1.25rem;
          color: var(--navy);
          font-weight: 700;
        }

        .mission-bar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .tone-selector-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tone-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .tone-select-field {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          padding: 0.5rem 0.85rem;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .spin-anim {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* Prompt Inspector */
        .prompt-inspector-card {
          padding: 1.5rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .prompt-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--navy);
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .prompt-box-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
          font-weight: 600;
        }

        .prompt-code-block {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: pre-wrap;
          line-height: 1.45;
          max-height: 200px;
          overflow-y: auto;
        }

        /* Publish Success Alert */
        .publish-success-alert {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          gap: 1rem;
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .alert-icon {
          color: #059669;
          flex-shrink: 0;
        }

        .publish-success-alert h4 {
          color: #065f46;
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
          font-weight: 700;
        }

        .publish-success-alert p {
          font-size: 0.82rem;
          color: #047857;
        }

        /* Studio Tabs */
        .studio-tabs-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .studio-tabs-row::-webkit-scrollbar {
          display: none;
        }

        .studio-tab {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.6rem 1rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          box-shadow: var(--shadow-xs);
        }

        .studio-tab:hover {
          color: var(--navy);
          background: #f8fafc;
        }

        .studio-tab.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: var(--navy);
        }

        /* Editor Card */
        .studio-editor-card {
          padding: 2rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
        }

        .editor-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .editor-card-header h3 {
          font-size: 1.25rem;
          color: var(--navy);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .editor-card-header p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .char-indicator {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .studio-textarea {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 1rem;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .studio-textarea:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
        }

        .summary-field {
          font-size: 1.05rem;
          margin-bottom: 2rem;
        }

        /* Social Layout */
        .studio-social-layout {
          display: grid;
          grid-template-columns: minmax(360px, 480px) minmax(0, 1fr);
          gap: 1.75rem;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }

        .social-editor-pane {
          padding: 1.35rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border-radius: var(--radius-md);
          min-width: 0;
          box-sizing: border-box;
          max-height: calc(100vh - 140px);
          overflow-y: auto;
          position: sticky;
          top: 1rem;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .social-editor-pane::-webkit-scrollbar {
          width: 6px;
        }

        .social-editor-pane::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .social-editor-pane::-webkit-scrollbar-track {
          background: transparent;
        }

        .social-editor-header {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .editor-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .editor-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eff6ff;
          color: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .editor-heading {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0 0 0.25rem 0;
        }

        .editor-subtext {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.45;
        }

        /* Channel Selector Pills */
        .editor-channel-bar {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.35rem;
        }

        .channel-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .ch-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.65rem;
          border-radius: 7px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 0.76rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .ch-filter-btn:hover {
          background: #ffffff;
          color: var(--navy);
          border-color: #e2e8f0;
        }

        .ch-filter-btn.active {
          background: #ffffff;
          font-weight: 700;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .ch-filter-btn.active.twitter { color: #0284c7; border-color: #bae6fd; background: #f0f9ff; }
        .ch-filter-btn.active.instagram { color: #e11d48; border-color: #fecdd3; background: #fff1f2; }
        .ch-filter-btn.active.linkedin { color: #2563eb; border-color: #bfdbfe; background: #eff6ff; }
        .ch-filter-btn.active.facebook { color: #1877f2; border-color: #bfdbfe; background: #eff6ff; }
        .ch-filter-btn.active.blog { color: #059669; border-color: #a7f3d0; background: #ecfdf5; }
        .ch-filter-btn.active.article { color: #7c3aed; border-color: #ddd6fe; background: #f5f3ff; }
        .ch-filter-btn.active.all-btn { color: #0f172a; border-color: #cbd5e1; background: #ffffff; }

        .all-channels-meta-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 0.4rem 0.65rem;
          font-size: 0.72rem;
          color: #64748b;
        }

        .meta-actions {
          display: flex;
          gap: 0.35rem;
        }

        .meta-toggle-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-size: 0.68rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .meta-toggle-btn:hover {
          background: #f8fafc;
          color: var(--navy);
          border-color: #94a3b8;
        }

        .focused-channel-hint {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.74rem;
          color: #64748b;
          padding: 0.35rem 0.65rem;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px dashed #cbd5e1;
        }

        .hint-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0284c7;
          flex-shrink: 0;
        }

        .social-card-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          transition: all 0.15s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .social-card-item.is-collapsed {
          padding: 0.75rem 1.1rem;
          gap: 0.4rem;
          background: #ffffff;
        }

        .social-card-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .social-card-item.twitter-border {
          border-left: 3px solid #0284c7;
        }

        .social-card-item.instagram-border {
          border-left: 3px solid #e11d48;
        }

        .social-card-item.linkedin-border {
          border-left: 3px solid #2563eb;
        }

        .social-card-item.facebook-border {
          border-left: 3px solid #1877f2;
        }

        .social-card-item.blog-border {
          border-left: 3px solid #059669;
        }

        .social-card-item.article-border {
          border-left: 3px solid #7c3aed;
        }

        .social-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .social-label-row.clickable-header {
          cursor: pointer;
          user-select: none;
          border-radius: 6px;
          padding: 0.15rem 0.2rem;
          transition: background 0.15s ease;
        }

        .social-label-row.clickable-header:hover {
          background: #f1f5f9;
        }

        .card-header-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chevron-toggle-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .chevron-toggle-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: var(--navy);
        }

        .collapsed-preview-snippet {
          font-size: 0.76rem;
          color: #64748b;
          font-style: italic;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          padding-left: 0.2rem;
          line-height: 1.3;
        }

        .collapsed-preview-snippet:hover {
          color: #0284c7;
        }

        .platform-tag {
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
        }

        .platform-subtag {
          font-size: 0.68rem;
          font-weight: 600;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .platform-tag.twitter { color: #0284c7; }
        .platform-tag.instagram { color: #e11d48; }
        .platform-tag.linkedin { color: #2563eb; }
        .platform-tag.facebook { color: #1877f2; }
        .platform-tag.blog { color: #059669; }
        .platform-tag.article { color: #7c3aed; }

        .mono-textarea {
          font-family: inherit;
          line-height: 1.55;
          font-size: 0.88rem;
        }

        .char-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          font-family: var(--font-mono);
        }

        .char-badge.over-limit {
          color: #dc2626;
          background: #fef2f2;
          border-color: #fecaca;
        }

        .tag-chips-mini {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem;
          padding-top: 0.2rem;
        }

        .tags-hint {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .chip-mini-btn {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          font-size: 0.72rem;
          color: #475569;
          padding: 0.2rem 0.6rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .chip-mini-btn:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #0284c7;
        }

        .social-preview-pane {
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
          position: sticky;
          top: 1rem;
        }

        /* Alt-Text Studio */
        .alt-text-studio-card {
          padding: 2rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
        }

        .alt-text-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .alt-item-card {
          display: flex;
          gap: 1rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem;
        }

        .alt-item-thumb {
          width: 110px;
          height: 110px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }

        .alt-item-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .alt-item-caption {
          font-size: 0.82rem;
          color: var(--navy);
          font-weight: 600;
        }

        .alt-field-label {
          font-size: 0.72rem;
          color: #0284c7;
          font-weight: 600;
        }

        /* Compare Grid */
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
        }

        .compare-pane {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
        }

        .compare-pane-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--navy);
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.75rem;
          font-weight: 700;
        }

        .compare-raw-box {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
          white-space: pre-wrap;
          line-height: 1.5;
          max-height: 400px;
          overflow-y: auto;
          flex: 1;
        }

        .compare-ai-box {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .compare-social-snippets {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-sm);
          padding: 1rem;
          font-size: 0.85rem;
          color: var(--navy);
        }

        /* Studio Footer */
        .studio-footer-bar {
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-card);
          background: #ffffff;
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-status-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #047857;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .footer-action-btns {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        @media (max-width: 1180px) {
          .studio-social-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 1024px) {
          .prompt-grid, .alt-text-grid, .compare-grid {
            grid-template-columns: 1fr;
          }
          .studio-mission-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .mission-bar-right {
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .ai-studio-page {
            padding: 1.25rem 0.75rem 4rem;
            gap: 1.25rem;
          }
          .studio-top-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .studio-top-bar .btn-back {
            align-self: flex-start;
          }
          .studio-title-badge {
            font-size: clamp(0.68rem, 2.8vw, 0.78rem);
            padding: 0.35rem 0.75rem;
            text-align: center;
            justify-content: center;
          }
          .btn-text-action {
            align-self: flex-end;
          }
          .studio-mission-bar {
            padding: 1rem 0.85rem;
          }
          .mission-bar-left {
            gap: 0.75rem;
          }
          .mission-bar-thumb {
            width: 46px;
            height: 46px;
          }
          .mission-bar-title {
            font-size: 1.05rem;
          }
          .mission-bar-right {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .tone-selector-wrap {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
            width: 100%;
          }
          .tone-select-field {
            width: 100%;
          }
          .generate-btn {
            width: 100%;
            justify-content: center;
            min-height: 44px;
          }
          .studio-tabs-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            overflow: visible;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            width: 100%;
          }
          .studio-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            padding: 0.6rem 0.5rem;
            font-size: 0.76rem;
            font-weight: 600;
            text-align: center;
            white-space: normal;
            min-height: 42px;
            width: 100%;
            box-sizing: border-box;
          }
          .studio-editor-card {
            padding: 1rem 0.85rem;
          }
          .editor-card-header {
            flex-direction: column;
            gap: 0.4rem;
          }
          .social-editor-pane {
            padding: 1rem 0.85rem;
          }
          .alt-text-studio-card {
            padding: 1rem 0.85rem;
          }
          .alt-item-card {
            flex-direction: column;
            padding: 0.85rem;
          }
          .alt-item-thumb {
            width: 100%;
            height: 180px;
          }
          .compare-pane {
            padding: 1rem 0.85rem;
          }
          .publish-success-alert {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem 0.85rem;
          }
          .publish-success-alert button {
            width: 100%;
            justify-content: center;
          }
          .studio-footer-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.85rem;
            padding: 1rem 0.85rem;
          }
          .footer-action-btns {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
          }
          .footer-action-btns button {
            width: 100%;
            justify-content: center;
            min-height: 44px;
          }
        }

        @media (max-width: 480px) {
          .mission-bar-title {
            font-size: 0.95rem;
          }
          .prompt-inspector-card {
            padding: 1rem 0.75rem;
          }
          .prompt-code-block {
            font-size: 0.7rem;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
