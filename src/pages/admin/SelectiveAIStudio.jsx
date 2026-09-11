import { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  AI_AUDIENCE_TONES, 
  chunkDocumentText, 
  generateFromSelectedChunks 
} from '../../services/aiService';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Layers, 
  CheckSquare, 
  Square, 
  Copy, 
  Download, 
  SlidersHorizontal, 
  Info, 
  Check, 
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  Newspaper,
  Wand2,
  Share2,
  Volume2
} from 'lucide-react';
import SocialCardPreview from '../../components/SocialCardPreview';

export default function SelectiveAIStudio({ initialAssetId, onBack }) {
  const { 
    expeditions, 
    datasets, 
    publications, 
    saveGeneratedContent 
  } = usePortal();

  // Unified available assets list
  const availableAssets = useMemo(() => {
    return [
      ...expeditions.map(e => ({
        id: e.id,
        type: 'expedition',
        typeLabel: 'Expedition Report',
        title: e.title,
        region: e.region,
        year: e.year,
        heroImage: e.heroImage,
        rawText: (e.reports && e.reports[0]?.rawText) || e.scientificAbstract || e.summary || ''
      })),
      ...datasets.map(d => ({
        id: d.id,
        type: 'dataset',
        typeLabel: 'Scientific Dataset',
        title: d.title,
        region: d.region,
        year: d.year,
        heroImage: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1200&q=80',
        rawText: `DATASET: ${d.title}\nFormat: ${d.format}\nVariables: ${d.parameters?.join(', ')}\nCoverage: ${d.spatialCoverage}\n\nSummary:\n${d.summary}`
      })),
      ...publications.map(p => ({
        id: p.id,
        type: 'publication',
        typeLabel: 'Research Publication',
        title: p.title,
        region: 'Polar / Global',
        year: p.year,
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        rawText: `TITLE: ${p.title}\nAuthors: ${p.authors?.join(', ')}\nJournal: ${p.journal}\nDOI: ${p.doi}\n\nAbstract:\n${p.abstract}`
      }))
    ];
  }, [expeditions, datasets, publications]);

  // Selected Asset ID or 'custom'
  const [selectedAssetId, setSelectedAssetId] = useState(() => {
    if (initialAssetId && availableAssets.some(a => a.id === initialAssetId)) {
      return initialAssetId;
    }
    return availableAssets[0]?.id || 'isea-44';
  });

  const [inputMode, setInputMode] = useState('asset'); // 'asset' | 'custom'
  const [customText, setCustomText] = useState('');
  const [customTitle, setCustomTitle] = useState('Custom Polar Field Survey Dossier');
  const [customRegion, setCustomRegion] = useState('Antarctica');

  // Currently active asset object
  const currentAsset = useMemo(() => {
    if (inputMode === 'custom') {
      return {
        id: 'custom-entry',
        title: customTitle,
        region: customRegion,
        year: 2024,
        type: 'custom',
        typeLabel: 'Custom Text Input',
        heroImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
        rawText: customText
      };
    }
    return availableAssets.find(a => a.id === selectedAssetId) || availableAssets[0];
  }, [inputMode, customTitle, customRegion, customText, selectedAssetId, availableAssets]);

  // Extract chunks from the current asset
  const documentChunks = useMemo(() => {
    return chunkDocumentText(currentAsset?.rawText || '');
  }, [currentAsset]);

  // Selected chunk IDs state
  const [selectedChunkIds, setSelectedChunkIds] = useState(() => {
    return documentChunks.map(c => c.id);
  });

  // When document chunks change, select all by default
  const [prevAssetId, setPrevAssetId] = useState(selectedAssetId);
  if (selectedAssetId !== prevAssetId) {
    setPrevAssetId(selectedAssetId);
    setSelectedChunkIds(documentChunks.map(c => c.id));
  }

  // Generation options
  const [audience, setAudience] = useState('general');
  const [customFocus, setCustomFocus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileTab, setMobileTab] = useState('input'); // 'input' | 'output'

  // Main output category tabs: 'article' | 'image' | 'video' | 'socials' | 'summary' | 'inspector'
  const [outputTab, setOutputTab] = useState('article');

  // Generated package state
  const [generatedResult, setGeneratedResult] = useState(null);
  const [draftSummary, setDraftSummary] = useState('');
  const [draftTwitter, setDraftTwitter] = useState('');
  const [draftInstagram, setDraftInstagram] = useState('');
  const [draftLinkedin, setDraftLinkedin] = useState('');
  const [draftFactCards, setDraftFactCards] = useState([]);
  const [draftArticle, setDraftArticle] = useState(null);
  const [draftImageGen, setDraftImageGen] = useState(null);
  const [draftVideoGen, setDraftVideoGen] = useState(null);

  // UI state
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeVideoSceneIdx, setActiveVideoSceneIdx] = useState(0);

  // Toggle Chunk
  const toggleChunk = (id) => {
    setSelectedChunkIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAllChunks = () => {
    setSelectedChunkIds(documentChunks.map(c => c.id));
  };

  const clearAllChunks = () => {
    setSelectedChunkIds([]);
  };

  // Selected chunks objects
  const activeSelectedChunks = useMemo(() => {
    return documentChunks.filter(c => selectedChunkIds.includes(c.id));
  }, [documentChunks, selectedChunkIds]);

  const totalSelectedWords = useMemo(() => {
    return activeSelectedChunks.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  }, [activeSelectedChunks]);

  // Run Synthesis on selected chunks
  const handleSynthesize = async () => {
    if (activeSelectedChunks.length === 0) {
      alert("Please select at least one chunk to synthesize.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateFromSelectedChunks({
        asset: currentAsset,
        selectedChunks: activeSelectedChunks,
        customFocus,
        audience
      });

      setGeneratedResult(res);
      setDraftSummary(res.summary);
      setDraftTwitter(res.socialCaptions.twitter);
      setDraftInstagram(res.socialCaptions.instagram);
      setDraftLinkedin(res.socialCaptions.linkedin);
      setDraftFactCards(res.factCards);
      setDraftArticle(res.article);
      setDraftImageGen(res.imageGen);
      setDraftVideoGen(res.videoGen);
      setOutputTab('article');
      setMobileTab('output'); // auto-switch to output suite on mobile
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Save to Portal Context
  const handleApplyToArchive = () => {
    if (!currentAsset || currentAsset.type === 'custom') return;

    const pkg = {
      summary: draftSummary,
      article: draftArticle,
      imageGen: draftImageGen,
      videoGen: draftVideoGen,
      socialCaptions: {
        twitter: draftTwitter,
        instagram: draftInstagram,
        linkedin: draftLinkedin
      },
      factCards: draftFactCards,
      isApproved: true,
      approvedAt: new Date().toISOString(),
      sourceChunksUsed: activeSelectedChunks.map(c => c.title)
    };

    saveGeneratedContent(currentAsset.id, pkg, true, currentAsset.type);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="container selective-ai-page">
      {/* Top Header */}
      <div className="page-top-bar">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="page-header-row">
        <div>
          <div className="section-eyebrow">CHUNK-LEVEL TARGETED AI PRODUCTION</div>
          <h1 className="page-title">Selective AI Studio: Articles, Images, Video & Socials</h1>
          <p className="page-sub">
            Generate high-impact <strong>articles & blogs</strong>, <strong>AI concept imagery</strong>, <strong>short-form video storyboards</strong>, and <strong>social campaigns</strong> from strictly selected data chunks or custom excerpted sections.
          </p>
        </div>
      </div>

      {/* Mobile Step/View Switcher (visible only on mobile <= 900px) */}
      <div className="mobile-studio-switcher">
        <button 
          type="button"
          className={`mobile-switch-btn ${mobileTab === 'input' ? 'active' : ''}`}
          onClick={() => setMobileTab('input')}
        >
          <SlidersHorizontal size={15} />
          <span>1. Setup & Chunks</span>
          <span className="mobile-switch-badge">{activeSelectedChunks.length}</span>
        </button>
        <button 
          type="button"
          className={`mobile-switch-btn ${mobileTab === 'output' ? 'active' : ''}`}
          onClick={() => setMobileTab('output')}
        >
          <Sparkles size={15} />
          <span>2. AI Media Suite</span>
          {generatedResult ? (
            <span className="mobile-switch-badge success">Ready</span>
          ) : (
            <span className="mobile-switch-badge pending">Draft</span>
          )}
        </button>
      </div>

      {/* Main Studio Grid: Left Configuration & Right Output */}
      <div className="studio-layout-grid">
        {/* Left Column: Source Selection & Chunk Manager */}
        <div className={`studio-col-left ${mobileTab !== 'input' ? 'mobile-hidden' : ''}`}>
          {/* 1. Source Asset Selector */}
          <div className="glass-panel studio-card">
            <div className="card-header-bar">
              <div className="card-title-group">
                <FileText size={16} className="text-emerald" />
                <h3>1. Select Source Document or Data</h3>
              </div>

              <div className="input-mode-pills">
                <button 
                  type="button"
                  className={`mode-pill ${inputMode === 'asset' ? 'active' : ''}`}
                  onClick={() => setInputMode('asset')}
                >
                  Archived Assets
                </button>
                <button 
                  type="button"
                  className={`mode-pill ${inputMode === 'custom' ? 'active' : ''}`}
                  onClick={() => setInputMode('custom')}
                >
                  Custom Excerpt
                </button>
              </div>
            </div>

            {inputMode === 'asset' ? (
              <div className="asset-select-group">
                <label className="field-label">Choose Archived Polar Asset:</label>
                <select 
                  className="custom-select select-full"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                >
                  {availableAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.typeLabel}] {asset.title} ({asset.region}, {asset.year})
                    </option>
                  ))}
                </select>

                <div className="asset-meta-strip">
                  <span><strong>Region:</strong> {currentAsset.region}</span>
                  <span><strong>Year:</strong> {currentAsset.year}</span>
                  <span><strong>Type:</strong> {currentAsset.typeLabel}</span>
                </div>
              </div>
            ) : (
              <div className="custom-input-group">
                <div className="input-row-2">
                  <div>
                    <label className="field-label">Document / Excerpt Title:</label>
                    <input 
                      type="text" 
                      className="text-input"
                      value={customTitle} 
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. 44th ISEA Green Microgrid Trial Notes"
                    />
                  </div>
                  <div>
                    <label className="field-label">Region:</label>
                    <select 
                      className="custom-select select-full"
                      value={customRegion} 
                      onChange={(e) => setCustomRegion(e.target.value)}
                    >
                      <option value="Antarctica">Antarctica</option>
                      <option value="Arctic">Arctic</option>
                      <option value="Himalaya">Himalaya</option>
                      <option value="Southern Ocean">Southern Ocean</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label">Paste Raw Scientific Text / Chunks:</label>
                  <textarea 
                    className="custom-textarea"
                    rows={6}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Paste report excerpts, scientific findings, or operational paragraphs here..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Interactive Chunks Manager */}
          <div className="glass-panel studio-card">
            <div className="card-header-bar">
              <div className="card-title-group">
                <Layers size={16} className="text-emerald" />
                <h3>2. Select Required Data Chunks</h3>
              </div>

              <div className="chunk-controls-group">
                <button type="button" className="btn-chip" onClick={selectAllChunks}>
                  <CheckSquare size={13} />
                  <span>Select All</span>
                </button>
                <button type="button" className="btn-chip" onClick={clearAllChunks}>
                  <Square size={13} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="chunks-stat-banner">
              <span className="stat-count">
                <strong>{activeSelectedChunks.length}</strong> of {documentChunks.length} chunks selected
              </span>
              <span className="stat-words">
                {totalSelectedWords} words in synthesis prompt
              </span>
            </div>

            {documentChunks.length > 0 ? (
              <div className="chunks-scroll-list">
                {documentChunks.map((chunk) => {
                  const isChecked = selectedChunkIds.includes(chunk.id);
                  return (
                    <div 
                      key={chunk.id} 
                      className={`chunk-card ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleChunk(chunk.id)}
                    >
                      <div className="chunk-card-header">
                        <div className="chunk-checkbox-wrap">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => toggleChunk(chunk.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="chunk-title">{chunk.title}</span>
                        </div>
                        <span className="chunk-word-badge">{chunk.wordCount} words</span>
                      </div>
                      <p className="chunk-preview">{chunk.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-chunks-box">
                <Info size={20} />
                <p>No text chunks detected. Please select an archived asset or paste custom text above.</p>
              </div>
            )}
          </div>

          {/* 3. Synthesis Directives & Audience */}
          <div className="glass-panel studio-card">
            <div className="card-header-bar">
              <div className="card-title-group">
                <SlidersHorizontal size={16} className="text-emerald" />
                <h3>3. Audience, Tone & Directives</h3>
              </div>
            </div>

            <div className="directives-body">
              <div>
                <label className="field-label">Target Audience & Tone:</label>
                <div className="audience-pills-row">
                  {AI_AUDIENCE_TONES.map((aud) => (
                    <button 
                      key={aud.id}
                      type="button"
                      className={`audience-pill ${audience === aud.id ? 'active' : ''}`}
                      onClick={() => setAudience(aud.id)}
                      title={aud.desc}
                    >
                      <span>{aud.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="field-label">Optional Specific Focus / Directives:</label>
                <input 
                  type="text"
                  className="text-input"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder="e.g. Focus on clean energy transition and ice coring for high-school students"
                />
              </div>

              <button 
                type="button"
                className="btn-saffron btn-synthesize"
                onClick={handleSynthesize}
                disabled={isGenerating || activeSelectedChunks.length === 0}
              >
                <Sparkles size={18} className={isGenerating ? 'spin' : ''} />
                <span>
                  {isGenerating 
                    ? 'Synthesizing Articles, Visuals & Video...' 
                    : `Synthesize Full Media Package (${activeSelectedChunks.length} Chunks)`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Synthesized Media & Content Suite */}
        <div className={`studio-col-right ${mobileTab !== 'output' ? 'mobile-hidden' : ''}`}>
          {/* Mobile Back Banner to switch back to setup */}
          <div className="mobile-only-back-banner">
            <button 
              type="button" 
              className="btn-back-to-chunks"
              onClick={() => setMobileTab('input')}
            >
              <SlidersHorizontal size={14} />
              <span>← Back to Document & Chunks Configuration</span>
            </button>
          </div>

          <div className="glass-panel studio-card output-card">
            <div className="card-header-bar">
              <div className="card-title-group">
                <Sparkles size={18} className="text-emerald" />
                <h3>Multi-Modal AI Outreach Suite</h3>
              </div>

              {generatedResult && (
                <span className="timestamp-badge">
                  Generated from {generatedResult.chunkCount} selected chunks
                </span>
              )}
            </div>

            {/* Output Category Navigation Strip */}
            <div className="output-tabs-strip">
              <button 
                type="button"
                className={`output-tab-btn ${outputTab === 'article' ? 'active' : ''}`}
                onClick={() => setOutputTab('article')}
              >
                <Newspaper size={14} />
                <span>Article / Blog</span>
              </button>

              <button 
                type="button"
                className={`output-tab-btn ${outputTab === 'image' ? 'active' : ''}`}
                onClick={() => setOutputTab('image')}
              >
                <ImageIcon size={14} />
                <span>AI Concept Image</span>
              </button>

              <button 
                type="button"
                className={`output-tab-btn ${outputTab === 'video' ? 'active' : ''}`}
                onClick={() => setOutputTab('video')}
              >
                <Video size={14} />
                <span>Video Reel & Script</span>
              </button>

              <button 
                type="button"
                className={`output-tab-btn ${outputTab === 'socials' ? 'active' : ''}`}
                onClick={() => setOutputTab('socials')}
              >
                <Share2 size={14} />
                <span>Social Media Pack</span>
              </button>

              <button 
                type="button"
                className={`output-tab-btn ${outputTab === 'summary' ? 'active' : ''}`}
                onClick={() => setOutputTab('summary')}
              >
                <FileText size={14} />
                <span>Public Summary</span>
              </button>

              <button 
                type="button"
                className={`output-tab-btn ${outputTab === 'inspector' ? 'active' : ''}`}
                onClick={() => setOutputTab('inspector')}
              >
                <Layers size={14} />
                <span>Chunk Inspector</span>
              </button>
            </div>

            {/* Output Workspace Body */}
            <div className="output-body">
              {generatedResult ? (
                <>
                  {/* TAB 1: ARTICLE & SCIENTIFIC BLOG */}
                  {outputTab === 'article' && draftArticle && (
                    <div className="output-tab-content">
                      <div className="content-meta-bar">
                        <div className="article-meta-tags">
                          <span className="tag-pill category-tag">{draftArticle.category}</span>
                          <span className="read-time-pill">{draftArticle.readTime}</span>
                        </div>

                        <div className="btn-group-sm">
                          <button 
                            type="button" 
                            className="btn-copy"
                            onClick={() => {
                              const md = `# ${draftArticle.title}\n*${draftArticle.subtitle}*\n\n**Published:** ${draftArticle.publishedDate} | **By:** ${draftArticle.author}\n\n${draftArticle.lead}\n\n` + 
                                draftArticle.sections.map(s => `## ${s.heading}\n\n${s.body}`).join('\n\n') +
                                `\n\n## Climate Impact & Subcontinent Teleconnections\n\n${draftArticle.climateImpact}\n\n### Key Takeaways\n` +
                                draftArticle.takeaways.map(t => `- ${t}`).join('\n');
                              handleCopy(md, 'article-md');
                            }}
                          >
                            {copiedKey === 'article-md' ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedKey === 'article-md' ? 'Copied Markdown' : 'Copy Markdown'}</span>
                          </button>

                          <button 
                            type="button" 
                            className="btn-copy"
                            onClick={() => {
                              const text = `${draftArticle.title}\n${draftArticle.subtitle}\n\n${draftArticle.lead}\n\n` + 
                                draftArticle.sections.map(s => `${s.heading}\n${s.body}`).join('\n\n') +
                                `\n\nCLIMATE IMPACT:\n${draftArticle.climateImpact}\n\nTAKEAWAYS:\n` +
                                draftArticle.takeaways.map(t => `• ${t}`).join('\n');
                              const blob = new Blob([text], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${currentAsset.id || 'polar'}-article.txt`;
                              a.click();
                            }}
                          >
                            <Download size={13} />
                            <span>Download Article</span>
                          </button>
                        </div>
                      </div>

                      <div className="article-preview-container">
                        <h2 className="article-title">{draftArticle.title}</h2>
                        <p className="article-subtitle">{draftArticle.subtitle}</p>
                        
                        <div className="article-byline">
                          <span>By <strong>{draftArticle.author}</strong></span>
                          <span>•</span>
                          <span>{draftArticle.publishedDate}</span>
                        </div>

                        <div className="article-lead-box">
                          <p>{draftArticle.lead}</p>
                        </div>

                        {/* Article Inline Hero Image */}
                        {draftImageGen && (
                          <div className="article-inline-image">
                            <img src={draftImageGen.imageUrl} alt={draftImageGen.suggestedAlt} />
                            <figcaption>
                              <strong>Fig 1:</strong> AI-rendered visualization illustrating {currentAsset.title} ({currentAsset.region}).
                            </figcaption>
                          </div>
                        )}

                        <div className="article-sections-list">
                          {draftArticle.sections.map((section, idx) => (
                            <div key={idx} className="article-section-block">
                              <h3>{section.heading}</h3>
                              <p>{section.body}</p>
                            </div>
                          ))}
                        </div>

                        <div className="climate-impact-card">
                          <h4>🌊 Teleconnections & Indian Monsoon Relevance</h4>
                          <p>{draftArticle.climateImpact}</p>
                        </div>

                        <div className="article-takeaways-box">
                          <h4>Executive Summary Takeaways</h4>
                          <ul>
                            {draftArticle.takeaways.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: AI CONCEPT IMAGE GENERATION */}
                  {outputTab === 'image' && draftImageGen && (
                    <div className="output-tab-content">
                      <div className="content-meta-bar">
                        <span className="tag-pill">AI Scientific Concept Visualizer</span>
                        <div className="btn-group-sm">
                          <button 
                            type="button" 
                            className="btn-copy"
                            onClick={() => handleCopy(draftImageGen.prompt, 'img-prompt')}
                          >
                            {copiedKey === 'img-prompt' ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedKey === 'img-prompt' ? 'Copied Prompt' : 'Copy Prompt'}</span>
                          </button>
                          <a 
                            href={draftImageGen.imageUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            download="polar-visual.jpg"
                            className="btn-copy"
                          >
                            <Download size={13} />
                            <span>Download Image</span>
                          </a>
                        </div>
                      </div>

                      <div className="image-gen-workspace">
                        <div className="image-preview-frame">
                          <img src={draftImageGen.imageUrl} alt={draftImageGen.suggestedAlt} className="rendered-polar-img" />
                          <div className="image-overlay-badge">
                            <span>16:9 • Ultra HD 4K</span>
                          </div>
                        </div>

                        <div className="prompt-spec-panel">
                          <div className="spec-row">
                            <label className="spec-label">Generated Synthesized Prompt:</label>
                            <div className="spec-code-box">
                              <code>{draftImageGen.prompt}</code>
                            </div>
                          </div>

                          <div className="spec-row">
                            <label className="spec-label">WCAG-AA Accessibility Alt-Text:</label>
                            <div className="spec-input-box">
                              <p>{draftImageGen.suggestedAlt}</p>
                              <button 
                                type="button" 
                                className="btn-chip"
                                onClick={() => handleCopy(draftImageGen.suggestedAlt, 'alt-text')}
                              >
                                {copiedKey === 'alt-text' ? <Check size={11} /> : <Copy size={11} />}
                                <span>Copy Alt</span>
                              </button>
                            </div>
                          </div>

                          <div className="spec-row">
                            <label className="spec-label">Negative Prompt Filter:</label>
                            <div className="spec-code-box negative">
                              <code>{draftImageGen.negativePrompt}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: AI VIDEO SCRIPT & STORYBOARD */}
                  {outputTab === 'video' && draftVideoGen && (
                    <div className="output-tab-content">
                      <div className="content-meta-bar">
                        <div className="video-meta-tags">
                          <span className="tag-pill">{draftVideoGen.targetDuration}</span>
                          <span className="tag-pill format">{draftVideoGen.aspectRatio}</span>
                        </div>

                        <div className="btn-group-sm">
                          <button 
                            type="button" 
                            className="btn-copy"
                            onClick={() => {
                              const scriptText = `TITLE: ${draftVideoGen.title}\nDuration: ${draftVideoGen.targetDuration}\nFormat: ${draftVideoGen.aspectRatio}\n\n` +
                                draftVideoGen.storyboard.map(s => 
                                  `SCENE ${s.scene} [${s.timestamp}]\n` +
                                  `Visual: ${s.visual}\n` +
                                  `Narration: "${s.narration}"\n` +
                                  `On-Screen Text: ${s.onScreenText}\n` +
                                  `Sound FX: ${s.soundFx}\n`
                                ).join('\n---\n\n');
                              handleCopy(scriptText, 'video-script');
                            }}
                          >
                            {copiedKey === 'video-script' ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedKey === 'video-script' ? 'Copied Script' : 'Copy Script'}</span>
                          </button>

                          <button 
                            type="button" 
                            className="btn-copy"
                            onClick={() => {
                              const srt = draftVideoGen.storyboard.map((s, i) => {
                                const start = `00:00:${i * 15 < 10 ? '0' + (i * 15) : i * 15},000`;
                                const end = `00:00:${(i + 1) * 15 < 10 ? '0' + ((i + 1) * 15) : (i + 1) * 15},000`;
                                return `${i + 1}\n${start} --> ${end}\n${s.narration}\n`;
                              }).join('\n');
                              const blob = new Blob([srt], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${currentAsset.id || 'polar'}-subtitles.srt`;
                              a.click();
                            }}
                          >
                            <Download size={13} />
                            <span>Download .SRT</span>
                          </button>
                        </div>
                      </div>

                      {/* Video Player & Storyboard Grid */}
                      <div className="video-studio-grid">
                        {/* Interactive Video Simulation Player */}
                        <div className="video-player-card">
                          <div className="video-viewport-wrapper">
                            <img src={draftVideoGen.videoUrl} alt="Polar footage" className="video-sim-img" />
                            <div className="video-overlay-hud">
                              <span className="live-rec-badge">● PREVIEW REEL</span>
                              <span className="hud-time">{draftVideoGen.storyboard[activeVideoSceneIdx]?.timestamp || '0:00 - 0:10'}</span>
                            </div>

                            {/* Center Play Button Overlay */}
                            <div className="video-controls-center">
                              <button 
                                type="button" 
                                className="btn-play-circle"
                                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                              >
                                {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
                              </button>
                            </div>

                            {/* Kinetic Text Overlay on simulated video */}
                            <div className="video-kinetic-text">
                              <p>{draftVideoGen.storyboard[activeVideoSceneIdx]?.onScreenText}</p>
                            </div>
                          </div>

                          <div className="video-player-footer">
                            <div className="active-narration-box">
                              <Volume2 size={15} className="text-emerald" />
                              <p>"{draftVideoGen.storyboard[activeVideoSceneIdx]?.narration}"</p>
                            </div>
                          </div>
                        </div>

                        {/* Scene Storyboard Cards */}
                        <div className="storyboard-list">
                          {draftVideoGen.storyboard.map((scene, idx) => (
                            <div 
                              key={scene.scene} 
                              className={`storyboard-item ${activeVideoSceneIdx === idx ? 'active' : ''}`}
                              onClick={() => setActiveVideoSceneIdx(idx)}
                            >
                              <div className="storyboard-item-header">
                                <span className="scene-badge">SCENE 0{scene.scene}</span>
                                <span className="timestamp-pill">{scene.timestamp}</span>
                              </div>

                              <p className="scene-visual"><strong>Visual:</strong> {scene.visual}</p>
                              <p className="scene-narration"><strong>Voiceover:</strong> "{scene.narration}"</p>
                                                 <div className="scene-tags-row">
                                <span className="sfx-tag">🔊 {scene.soundFx}</span>
                                <span className="kinetic-tag">💬 {scene.onScreenText.replace('\n', ' ')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: SOCIAL MEDIA PACK & INTERACTIVE FEED MOCKUP */}
                  {outputTab === 'socials' && (
                    <div className="output-tab-content">
                      <SocialCardPreview 
                        aiContent={{
                          socialCaptions: {
                            twitter: draftTwitter,
                            instagram: draftInstagram,
                            linkedin: draftLinkedin,
                            facebook: `❄️ Scientific outreach bulletin from ${currentAsset.title || 'Polar Expedition'} in ${currentAsset.region || 'Polar Region'}.\n\n🔬 Key Highlights:\n${draftFactCards.map(f => `• ${f}`).join('\n')}\n\n👉 Follow NCPOR for open polar data access.\n\n#NCPOR #MoES #PolarScience #IndiaInAntarctica`,
                            blog: `# ${draftArticle?.title || currentAsset.title}\n\n${draftArticle?.lead || ''}\n\n${draftArticle?.sections?.map(s => `### ${s.heading}\n\n${s.body}`).join('\n\n') || ''}\n\n### Climate Impact & Subcontinent Teleconnections\n${draftArticle?.climateImpact || ''}`,
                            article: `PRESS RELEASE / NATIONAL SCIENCE DISPATCH\n\nDATELINE: GOA / NEW DELHI — MINISTRY OF EARTH SCIENCES, GOVT. OF INDIA\n\nSUBJECT: NCPOR Issues Scientific Report on ${currentAsset.title || 'Polar Expedition'}\n\n${draftArticle?.lead || ''}\n\nKey Highlights:\n${draftFactCards.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nThe complete archive is publicly accessible on the NCPOR Outreach Portal.`
                          }
                        }}
                        expeditionTitle={currentAsset.title}
                        region={currentAsset.region}
                        mediaUrl={draftImageGen?.imageUrl || currentAsset.heroImage || 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80'}
                        mediaList={[
                          {
                            url: draftImageGen?.imageUrl || currentAsset.heroImage,
                            caption: draftImageGen?.subject || currentAsset.title,
                            altText: draftImageGen?.prompt || currentAsset.title
                          }
                        ]}
                        defaultViewMode="mock"
                        defaultPlatform="linkedin"
                      />

                      {draftFactCards.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <div className="content-meta-bar">
                            <span className="tag-pill">Polar Fact Cards Series ({draftFactCards.length})</span>
                            <button 
                              type="button" 
                              className="btn-copy"
                              onClick={() => handleCopy(draftFactCards.join('\n\n'), 'facts')}
                            >
                              {copiedKey === 'facts' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'facts' ? 'Copied Fact Cards' : 'Copy Fact Cards'}</span>
                            </button>
                          </div>

                          <div className="fact-cards-grid">
                            {draftFactCards.map((fact, idx) => (
                              <div key={idx} className="fact-card-item">
                                <span className="fact-num">0{idx + 1}</span>
                                <p>{fact}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: PUBLIC OUTREACH SUMMARY */}
                  {outputTab === 'summary' && (
                    <div className="output-tab-content">
                      <div className="content-meta-bar">
                        <span className="tag-pill">Targeted Public Summary</span>
                        <button 
                          type="button" 
                          className="btn-copy"
                          onClick={() => handleCopy(draftSummary, 'summary')}
                        >
                          {copiedKey === 'summary' ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedKey === 'summary' ? 'Copied!' : 'Copy Summary'}</span>
                        </button>
                      </div>
                      <textarea 
                        className="output-textarea"
                        rows={12}
                        value={draftSummary}
                        onChange={(e) => setDraftSummary(e.target.value)}
                      />
                    </div>
                  )}

                  {/* TAB 6: CHUNK & PROMPT INSPECTOR */}
                  {outputTab === 'inspector' && (
                    <div className="output-tab-content">
                      <div className="content-meta-bar">
                        <span className="tag-pill">Chunk Scope & Reproducibility</span>
                      </div>
                      <div className="inspector-box">
                        <p className="inspector-intro">
                          The following {activeSelectedChunks.length} data chunks were explicitly fed into the AI synthesizer to generate this multi-modal package:
                        </p>
                        {activeSelectedChunks.map((c, i) => (
                          <div key={c.id} className="inspector-chunk">
                            <h4>{i + 1}. {c.title} ({c.wordCount} words)</h4>
                            <pre>{c.content}</pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="output-actions-bar">
                    {currentAsset.type !== 'custom' && (
                      <button 
                        type="button"
                        className="btn-saffron"
                        onClick={handleApplyToArchive}
                      >
                        <CheckCircle2 size={16} />
                        <span>{appliedSuccess ? 'Saved to Portal Archive!' : 'Apply Complete Pack to Archive'}</span>
                      </button>
                    )}

                    <button 
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        const fullKit = `=== ${currentAsset.title} FULL OUTREACH KIT ===\nAudience: ${audience}\nSelected Chunks: ${activeSelectedChunks.map(c => c.title).join(', ')}\n\n[ARTICLE: ${draftArticle?.title}]\n${draftArticle?.lead}\n\n[TWITTER/X]\n${draftTwitter}\n\n[INSTAGRAM]\n${draftInstagram}\n\n[LINKEDIN]\n${draftLinkedin}\n\n[FACT CARDS]\n${draftFactCards.join('\n')}\n\n[AI IMAGE PROMPT]\n${draftImageGen?.prompt}\n\n[AI VIDEO SCRIPT]\n${draftVideoGen?.storyboard?.map(s => `${s.scene}. [${s.timestamp}] ${s.narration}`).join('\n')}`;
                        const blob = new Blob([fullKit], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${currentAsset.id || 'outreach'}-complete-kit.txt`;
                        a.click();
                      }}
                    >
                      <Download size={15} />
                      <span>Export Complete Media Kit</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-workspace-state">
                  <div className="empty-icon-wrap">
                    <Wand2 size={34} />
                  </div>
                  <h3>Multi-Modal Targeted Synthesis</h3>
                  <p>
                    Select your preferred data chunks on the left panel, choose your audience, and click <strong>Synthesize Full Media Package</strong> to generate full articles/blogs, photorealistic polar imagery, short-form video reels & storyboards, and social media posts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .selective-ai-page {
          padding: 2rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .page-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .top-badge-info {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--navy);
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.04em;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0284c7;
        }

        .page-header-row {
          margin-bottom: 0.5rem;
        }

        .studio-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 1.75rem;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }

        .studio-col-left, .studio-col-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .studio-card {
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xs);
          box-sizing: border-box;
          min-width: 0;
        }

        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-title-group h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0;
        }

        .text-emerald { color: #059669; }

        /* Mobile Segmented Switcher */
        .mobile-studio-switcher {
          display: none;
        }

        .mobile-only-back-banner {
          display: none;
        }

        .input-mode-pills {
          display: flex;
          background: #f1f5f9;
          border-radius: var(--radius-sm);
          padding: 3px;
          gap: 3px;
        }

        .mode-pill {
          background: transparent;
          border: none;
          font-size: 0.76rem;
          font-weight: 600;
          color: #475569;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-pill.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        .field-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 0.35rem;
        }

        .select-full {
          width: 100%;
          min-height: 42px;
          padding: 0.55rem 0.85rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          background: #f8fafc;
          color: var(--text-primary);
          box-sizing: border-box;
        }

        .asset-meta-strip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.65rem;
        }

        .asset-meta-strip span {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          font-size: 0.72rem;
          color: #334155;
        }

        .input-row-2 {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .text-input, .custom-textarea {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          background: #f8fafc;
          color: var(--text-primary);
          box-sizing: border-box;
        }

        /* Chunk Manager */
        .chunk-controls-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          color: #334155;
          transition: all 0.15s ease;
        }

        .btn-chip:hover {
          background: #e2e8f0;
          color: var(--navy);
        }

        .chunks-stat-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          margin-bottom: 0.85rem;
          font-size: 0.76rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stat-count { color: var(--navy); }
        .stat-words { color: #0284c7; font-weight: 600; }

        .chunks-scroll-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 380px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding-right: 0.35rem;
        }

        .chunk-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem 0.85rem;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .chunk-card:hover {
          border-color: #94a3b8;
          background: #f8fafc;
        }

        .chunk-card.selected {
          border-color: #059669;
          background: #f0fdf4;
          box-shadow: 0 0 0 1px #059669;
        }

        .chunk-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
          gap: 0.5rem;
        }

        .chunk-checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
        }

        .chunk-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chunk-word-badge {
          font-size: 0.68rem;
          font-weight: 600;
          color: #059669;
          background: #d1fae5;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .chunk-preview {
          font-size: 0.75rem;
          color: #475569;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }

        .no-chunks-box {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
        }

        /* Directives */
        .directives-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .audience-pills-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .audience-pill {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.55rem 0.65rem;
          border-radius: 6px;
          cursor: pointer;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .audience-pill:hover {
          background: #e2e8f0;
          color: var(--navy);
        }

        .audience-pill.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.15);
        }

        .btn-synthesize {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          min-height: 48px;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .btn-synthesize:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(234, 88, 12, 0.45);
        }

        .btn-synthesize:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Output Card (AI Media Suite) */
        .output-card {
          min-height: 640px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
        }

        .timestamp-badge {
          font-size: 0.7rem;
          color: #059669;
          background: #ecfdf5;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          flex-shrink: 0;
        }

        .output-tabs-strip {
          display: flex;
          gap: 0.4rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.65rem;
          margin-bottom: 1rem;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          box-sizing: border-box;
        }

        .output-tabs-strip::-webkit-scrollbar { display: none; }

        .output-tab-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .output-tab-btn:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .output-tab-btn.active {
          color: #ffffff;
          background: #0f172a;
          border-color: #0f172a;
          font-weight: 700;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.2);
        }

        .output-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .output-tab-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .content-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          gap: 0.5rem;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }

        .btn-group-sm {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .tag-pill {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--navy);
          background: #f1f5f9;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }

        .tag-pill.format {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .btn-copy {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--navy);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          text-decoration: none;
          box-sizing: border-box;
        }

        .btn-copy:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        /* 1. Article View Styles */
        .article-meta-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-tag {
          background: #e0f2fe;
          color: #0369a1;
        }

        .read-time-pill {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .article-preview-container {
          background: #fafbfc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          max-height: 520px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }

        .article-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 0.4rem;
          line-height: 1.3;
          word-break: break-word;
        }

        .article-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          font-style: italic;
          word-break: break-word;
        }

        .article-byline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.76rem;
          color: var(--text-muted);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .article-lead-box {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--navy);
          font-weight: 500;
          margin-bottom: 1.25rem;
          word-break: break-word;
        }

        .article-inline-image {
          margin: 1.25rem 0;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          width: 100%;
          box-sizing: border-box;
        }

        .article-inline-image img {
          width: 100%;
          max-height: 280px;
          object-fit: cover;
          display: block;
        }

        .article-inline-image figcaption {
          font-size: 0.72rem;
          color: var(--text-muted);
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          word-break: break-word;
        }

        .article-sections-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .article-section-block h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 0.35rem;
          word-break: break-word;
        }

        .article-section-block p {
          font-size: 0.86rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin: 0;
          word-break: break-word;
        }

        .climate-impact-card {
          background: #ecfdf5;
          border-left: 4px solid #059669;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.25rem;
          box-sizing: border-box;
          word-break: break-word;
        }

        .climate-impact-card h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 0.35rem;
        }

        .climate-impact-card p {
          font-size: 0.82rem;
          line-height: 1.55;
          color: #047857;
          margin: 0;
          word-break: break-word;
        }

        .article-takeaways-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: var(--radius-sm);
          box-sizing: border-box;
          word-break: break-word;
        }

        .article-takeaways-box h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 0.5rem;
        }

        .article-takeaways-box ul {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .article-takeaways-box li {
          margin-bottom: 0.3rem;
          word-break: break-word;
        }

        /* 2. Image Workspace Styles */
        .image-gen-workspace {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          box-sizing: border-box;
        }

        .image-preview-frame {
          position: relative;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid #cbd5e1;
          background: #0f172a;
          width: 100%;
          aspect-ratio: 16/9;
          max-height: 320px;
          box-sizing: border-box;
        }

        .rendered-polar-img {
          width: 100%;
          height: 100%;
          max-height: 320px;
          object-fit: cover;
          display: block;
        }

        .image-overlay-badge {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .prompt-spec-panel {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          width: 100%;
          box-sizing: border-box;
        }

        .spec-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          width: 100%;
          box-sizing: border-box;
        }

        .spec-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--navy);
        }

        .spec-code-box {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 0.75rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.75rem;
          color: #334155;
          line-height: 1.45;
          max-height: 120px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
          box-sizing: border-box;
        }

        .spec-code-box.negative {
          color: #dc2626;
          background: #fef2f2;
          border-color: #fecaca;
        }

        .spec-input-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          box-sizing: border-box;
          gap: 0.5rem;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .spec-input-box p {
          margin: 0;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        /* 3. Video Studio Styles */
        .video-studio-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 1.25rem;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }

        .video-player-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .video-viewport-wrapper {
          position: relative;
          aspect-ratio: 16/9;
          background: #0f172a;
          overflow: hidden;
          width: 100%;
        }

        .video-sim-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          display: block;
        }

        .video-overlay-hud {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .live-rec-badge {
          background: rgba(220, 38, 38, 0.85);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .hud-time {
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.72rem;
          font-family: monospace;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .video-controls-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-play-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          border: none;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .btn-play-circle:hover {
          background: #ffffff;
          transform: scale(1.08);
        }

        .video-kinetic-text {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          padding: 0.4rem 0.65rem;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 700;
          word-break: break-word;
        }

        .video-kinetic-text p {
          margin: 0;
        }

        .video-player-footer {
          padding: 0.75rem;
          background: #f8fafc;
        }

        .active-narration-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: var(--navy);
          font-style: italic;
          line-height: 1.4;
          word-break: break-word;
        }

        .active-narration-box p {
          margin: 0;
        }

        .storyboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 440px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          box-sizing: border-box;
        }

        .storyboard-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .storyboard-item:hover {
          border-color: #94a3b8;
          background: #f8fafc;
        }

        .storyboard-item.active {
          border-color: #059669;
          background: #f0fdf4;
          box-shadow: 0 0 0 1px #059669;
        }

        .storyboard-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
          gap: 0.5rem;
        }

        .scene-badge {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--navy);
        }

        .timestamp-pill {
          font-size: 0.68rem;
          color: var(--text-muted);
          background: #f1f5f9;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-family: monospace;
        }

        .scene-visual {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin-bottom: 0.35rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .scene-narration {
          font-size: 0.76rem;
          color: var(--navy);
          font-style: italic;
          margin-bottom: 0.45rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .scene-tags-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .sfx-tag, .kinetic-tag {
          font-size: 0.68rem;
          color: var(--text-muted);
          background: #f1f5f9;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          word-break: break-word;
        }

        /* 4. Social Tabs Styles */
        .social-subtabs-row {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          box-sizing: border-box;
        }

        .social-subtabs-row::-webkit-scrollbar { display: none; }

        .social-subtab {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .social-subtab:hover {
          background: #f1f5f9;
          color: var(--navy);
        }

        .social-subtab.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          font-weight: 700;
        }

        .output-textarea {
          width: 100%;
          font-family: inherit;
          font-size: 0.86rem;
          line-height: 1.55;
          color: var(--text-primary);
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          box-sizing: border-box;
          resize: vertical;
        }

        /* Fact Cards Grid & Items */
        .fact-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.85rem;
          margin-top: 0.85rem;
          width: 100%;
          box-sizing: border-box;
        }

        .fact-card-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          box-sizing: border-box;
          word-break: break-word;
        }

        .fact-num {
          font-size: 0.72rem;
          font-weight: 800;
          color: #0284c7;
          background: #e0f2fe;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          align-self: flex-start;
        }

        .fact-card-item p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
          word-break: break-word;
        }

        /* 5. Chunk Inspector */
        .inspector-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: var(--radius-sm);
          max-height: 400px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          box-sizing: border-box;
          width: 100%;
        }

        .inspector-intro {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          word-break: break-word;
        }

        .inspector-chunk {
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed #cbd5e1;
          box-sizing: border-box;
        }

        .inspector-chunk:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .inspector-chunk h4 {
          font-size: 0.78rem;
          color: var(--navy);
          margin-bottom: 0.35rem;
          word-break: break-word;
        }

        .inspector-chunk pre {
          font-size: 0.72rem;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
          color: #475569;
          font-family: monospace;
          background: #ffffff;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          line-height: 1.45;
          box-sizing: border-box;
        }

        .output-actions-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
          width: 100%;
          box-sizing: border-box;
        }

        .btn-apply-archive {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #059669;
          color: #ffffff;
          border: none;
          font-size: 0.86rem;
          font-weight: 700;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .btn-apply-archive:hover {
          background: #047857;
        }

        .applied-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #059669;
          font-weight: 600;
        }

        .empty-workspace-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3.5rem 1.5rem;
          color: var(--text-muted);
          box-sizing: border-box;
        }

        .empty-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          margin-bottom: 1rem;
        }

        .empty-workspace-state h3 {
          font-size: 1.2rem;
          color: var(--navy);
          margin-bottom: 0.5rem;
        }

        .empty-workspace-state p {
          font-size: 0.85rem;
          max-width: 440px;
          line-height: 1.55;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1100px) {
          .studio-layout-grid {
            grid-template-columns: 1fr;
          }
          .video-studio-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .mobile-studio-switcher {
            display: flex;
            gap: 6px;
            background: #e2e8f0;
            padding: 4px;
            border-radius: 10px;
            margin-bottom: 1rem;
            width: 100%;
            box-sizing: border-box;
          }
          .mobile-switch-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            padding: 0.65rem 0.5rem;
            font-size: 0.82rem;
            font-weight: 700;
            border: none;
            background: transparent;
            color: #475569;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            min-height: 42px;
            box-sizing: border-box;
          }
          .mobile-switch-btn.active {
            background: #0f172a;
            color: #ffffff;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
          }
          .mobile-switch-badge {
            font-size: 0.7rem;
            font-weight: 700;
            padding: 0.1rem 0.45rem;
            border-radius: 10px;
            background: #cbd5e1;
            color: #1e293b;
          }
          .mobile-switch-btn.active .mobile-switch-badge {
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
          }
          .mobile-switch-badge.success {
            background: #059669;
            color: #ffffff;
          }
          .mobile-switch-badge.pending {
            background: #cbd5e1;
            color: #475569;
          }
          .mobile-hidden {
            display: none !important;
          }
          .mobile-only-back-banner {
            display: block;
            margin-bottom: 0.85rem;
            width: 100%;
            box-sizing: border-box;
          }
          .btn-back-to-chunks {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            padding: 0.65rem 0.85rem;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #0284c7;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 700;
            cursor: pointer;
            min-height: 44px;
            transition: all 0.15s ease;
            box-sizing: border-box;
          }
          .btn-back-to-chunks:hover {
            background: #dbeafe;
          }
        }

        @media (max-width: 768px) {
          .selective-ai-page {
            padding: 1.25rem 0.75rem 4rem;
            gap: 1rem;
          }
          .page-title {
            font-size: clamp(1.15rem, 4vw, 1.45rem);
            line-height: 1.3;
          }
          .page-sub {
            font-size: 0.82rem;
            line-height: 1.5;
          }
          .studio-card {
            padding: 1rem 0.85rem;
          }
          .output-card {
            min-height: auto;
            padding: 1rem 0.85rem;
          }
          .card-header-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .output-tabs-strip {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            overflow: visible;
            padding-bottom: 0.75rem;
            margin-bottom: 1rem;
            width: 100%;
          }
          .output-tab-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            padding: 0.55rem 0.5rem;
            font-size: 0.76rem;
            font-weight: 600;
            border-radius: 6px;
            white-space: normal;
            text-align: center;
            min-height: 42px;
            width: 100%;
            box-sizing: border-box;
          }
          .social-subtabs-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.45rem;
            overflow: visible;
            padding-bottom: 0.5rem;
            margin-bottom: 0.75rem;
            width: 100%;
          }
          .social-subtab {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.35rem;
            padding: 0.5rem 0.4rem;
            font-size: 0.74rem;
            font-weight: 600;
            white-space: normal;
            text-align: center;
            min-height: 40px;
            width: 100%;
            box-sizing: border-box;
          }
          .input-row-2 {
            grid-template-columns: 1fr;
          }
          .content-meta-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
            margin-bottom: 0.75rem;
          }
          .article-meta-tags, .video-meta-tags {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.4rem;
            flex-wrap: wrap;
          }
          .btn-group-sm {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            gap: 0.4rem;
          }
          .btn-group-sm .btn-copy,
          .btn-group-sm button,
          .btn-group-sm a {
            justify-content: center;
            min-height: 38px;
            font-size: 0.76rem;
            padding: 0.4rem 0.5rem;
            text-align: center;
          }
          .content-meta-bar > .btn-copy {
            width: 100%;
            justify-content: center;
            min-height: 38px;
            font-size: 0.76rem;
          }
          .output-actions-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
            margin-top: 1.25rem;
            padding-top: 1rem;
          }
          .output-actions-bar button {
            width: 100%;
            justify-content: center;
            min-height: 46px;
            font-size: 0.86rem;
          }
          .article-preview-container {
            max-height: none;
            padding: 0.85rem;
          }
          .article-title {
            font-size: 1.15rem;
            line-height: 1.35;
          }
          .article-subtitle {
            font-size: 0.85rem;
          }
          .article-lead-box {
            font-size: 0.85rem;
            line-height: 1.6;
            padding: 0.75rem;
          }
          .article-inline-image img {
            max-height: 220px;
          }
          .article-section-block h3 {
            font-size: 0.95rem;
          }
          .article-section-block p {
            font-size: 0.82rem;
            line-height: 1.55;
          }
          .image-preview-frame {
            max-height: 240px;
          }
          .rendered-polar-img {
            max-height: 240px;
          }
          .spec-code-box {
            font-size: 0.72rem;
            padding: 0.6rem;
            max-height: 100px;
          }
          .spec-input-box {
            flex-direction: column;
            align-items: stretch;
            gap: 0.4rem;
          }
          .spec-input-box .btn-chip {
            align-self: flex-start;
          }
          .video-studio-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .video-viewport-wrapper {
            max-height: 220px;
          }
          .btn-play-circle {
            width: 44px;
            height: 44px;
          }
          .storyboard-list {
            max-height: 320px;
          }
          .storyboard-item {
            padding: 0.65rem;
          }
          .output-textarea {
            font-size: 0.84rem;
            line-height: 1.5;
            padding: 0.65rem;
          }
          .fact-cards-grid {
            grid-template-columns: 1fr;
            gap: 0.6rem;
          }
          .fact-card-item {
            padding: 0.65rem;
          }
          .inspector-box {
            padding: 0.65rem;
          }
          .inspector-chunk pre {
            font-size: 0.7rem;
            padding: 0.45rem;
          }
          .empty-workspace-state {
            padding: 2.25rem 0.85rem;
          }
          .empty-icon-wrap {
            width: 52px;
            height: 52px;
            margin-bottom: 0.75rem;
          }
          .empty-workspace-state h3 {
            font-size: 1.05rem;
          }
          .empty-workspace-state p {
            font-size: 0.8rem;
            line-height: 1.5;
          }
          .audience-pills-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.4rem;
          }
          .audience-pill {
            padding: 0.45rem 0.5rem;
            font-size: 0.74rem;
            min-height: 40px;
          }
          .chunks-stat-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          .asset-meta-strip {
            flex-wrap: wrap;
            gap: 0.35rem;
          }
        }

        @media (max-width: 480px) {
          .page-top-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .card-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .input-mode-pills {
            width: 100%;
            display: flex;
          }
          .mode-pill {
            flex: 1;
            text-align: center;
            padding: 0.35rem 0.5rem;
            font-size: 0.72rem;
          }
          .chunk-card {
            padding: 0.65rem 0.75rem;
          }
          .chunk-controls-group {
            width: 100%;
            display: flex;
          }
          .chunk-controls-group .btn-chip {
            flex: 1;
            justify-content: center;
          }
          .btn-synthesize {
            font-size: 0.84rem;
            padding: 0.75rem 0.6rem;
          }
          .btn-group-sm {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.4rem;
            width: 100%;
          }
          .btn-group-sm .btn-copy,
          .btn-group-sm button,
          .btn-group-sm a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.45rem 0.35rem;
            font-size: 0.74rem;
            white-space: nowrap;
          }
      `}</style>
    </div>
  );
}

