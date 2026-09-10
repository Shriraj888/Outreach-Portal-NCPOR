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
  BookOpen,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  Newspaper,
  Wand2,
  Share2,
  Volume2
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon } from '../../components/SocialIcons';

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

  // Main output category tabs: 'article' | 'image' | 'video' | 'socials' | 'summary' | 'inspector'
  const [outputTab, setOutputTab] = useState('article');
  const [socialSubTab, setSocialSubTab] = useState('twitter'); // 'twitter' | 'instagram' | 'linkedin' | 'factCards'

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

        <div className="top-badge-info">
          <span className="live-dot"></span>
          <span>NCPOR SELECTIVE AI STUDIO • CHUNKS, ARTICLES, IMAGES & VIDEO</span>
        </div>
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

      {/* Main Studio Grid: Left Configuration & Right Output */}
      <div className="studio-layout-grid">
        {/* Left Column: Source Selection & Chunk Manager */}
        <div className="studio-col-left">
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
        <div className="studio-col-right">
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

                  {/* TAB 4: SOCIAL MEDIA PACK */}
                  {outputTab === 'socials' && (
                    <div className="output-tab-content">
                      <div className="social-subtabs-row">
                        <button 
                          type="button" 
                          className={`social-subtab ${socialSubTab === 'twitter' ? 'active' : ''}`}
                          onClick={() => setSocialSubTab('twitter')}
                        >
                          <TwitterIcon size={12} />
                          <span>X / Twitter</span>
                        </button>
                        <button 
                          type="button" 
                          className={`social-subtab ${socialSubTab === 'instagram' ? 'active' : ''}`}
                          onClick={() => setSocialSubTab('instagram')}
                        >
                          <InstagramIcon size={12} />
                          <span>Instagram</span>
                        </button>
                        <button 
                          type="button" 
                          className={`social-subtab ${socialSubTab === 'linkedin' ? 'active' : ''}`}
                          onClick={() => setSocialSubTab('linkedin')}
                        >
                          <LinkedinIcon size={12} />
                          <span>LinkedIn</span>
                        </button>
                        <button 
                          type="button" 
                          className={`social-subtab ${socialSubTab === 'factCards' ? 'active' : ''}`}
                          onClick={() => setSocialSubTab('factCards')}
                        >
                          <BookOpen size={12} />
                          <span>Fact Cards ({draftFactCards.length})</span>
                        </button>
                      </div>

                      {socialSubTab === 'twitter' && (
                        <div>
                          <div className="content-meta-bar">
                            <span className="tag-pill">X / Twitter Thread Hook ({draftTwitter.length} chars)</span>
                            <button 
                              type="button" 
                              className="btn-copy"
                              onClick={() => handleCopy(draftTwitter, 'twitter')}
                            >
                              {copiedKey === 'twitter' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'twitter' ? 'Copied Tweet' : 'Copy Tweet'}</span>
                            </button>
                          </div>
                          <textarea 
                            className="output-textarea"
                            rows={6}
                            value={draftTwitter}
                            onChange={(e) => setDraftTwitter(e.target.value)}
                          />
                        </div>
                      )}

                      {socialSubTab === 'instagram' && (
                        <div>
                          <div className="content-meta-bar">
                            <span className="tag-pill">Instagram Narrative & Hashtags</span>
                            <button 
                              type="button" 
                              className="btn-copy"
                              onClick={() => handleCopy(draftInstagram, 'instagram')}
                            >
                              {copiedKey === 'instagram' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'instagram' ? 'Copied Post' : 'Copy Post'}</span>
                            </button>
                          </div>
                          <textarea 
                            className="output-textarea"
                            rows={10}
                            value={draftInstagram}
                            onChange={(e) => setDraftInstagram(e.target.value)}
                          />
                        </div>
                      )}

                      {socialSubTab === 'linkedin' && (
                        <div>
                          <div className="content-meta-bar">
                            <span className="tag-pill">LinkedIn Professional Press Announcement</span>
                            <button 
                              type="button" 
                              className="btn-copy"
                              onClick={() => handleCopy(draftLinkedin, 'linkedin')}
                            >
                              {copiedKey === 'linkedin' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'linkedin' ? 'Copied Announcement' : 'Copy Announcement'}</span>
                            </button>
                          </div>
                          <textarea 
                            className="output-textarea"
                            rows={11}
                            value={draftLinkedin}
                            onChange={(e) => setDraftLinkedin(e.target.value)}
                          />
                        </div>
                      )}

                      {socialSubTab === 'factCards' && (
                        <div>
                          <div className="content-meta-bar">
                            <span className="tag-pill">Key Takeaway Fact Cards</span>
                            <button 
                              type="button" 
                              className="btn-copy"
                              onClick={() => handleCopy(draftFactCards.join('\n\n'), 'facts')}
                            >
                              {copiedKey === 'facts' ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedKey === 'facts' ? 'Copied All' : 'Copy All'}</span>
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
        }

        .studio-col-left, .studio-col-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .studio-card {
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xs);
        }

        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
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

        .input-mode-pills {
          display: flex;
          background: #f1f5f9;
          padding: 0.2rem;
          border-radius: var(--radius-full);
          gap: 0.2rem;
        }

        .mode-pill {
          background: transparent;
          border: none;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .mode-pill.active {
          background: var(--navy);
          color: #ffffff;
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
          padding: 0.55rem 0.85rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          background: #f8fafc;
        }

        .asset-meta-strip {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .input-row-2 {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .text-input, .custom-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          background: #f8fafc;
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
          background: #f1f5f9;
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.55rem;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .btn-chip:hover {
          background: #e2e8f0;
          color: var(--navy);
        }

        .chunks-stat-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.85rem;
          font-size: 0.75rem;
        }

        .stat-count { color: var(--navy); }
        .stat-words { color: #059669; font-weight: 600; }

        .chunks-scroll-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 380px;
          overflow-y: auto;
          padding-right: 0.35rem;
        }

        .chunk-card {
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
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
        }

        .chunk-checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .chunk-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--navy);
        }

        .chunk-word-badge {
          font-size: 0.68rem;
          color: var(--text-muted);
          background: #f1f5f9;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .chunk-preview {
          font-size: 0.74rem;
          color: var(--text-secondary);
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
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .audience-pill {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .audience-pill:hover {
          background: #e2e8f0;
          color: var(--navy);
        }

        .audience-pill.active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }

        .btn-synthesize {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem;
          font-size: 0.92rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }

        .btn-synthesize:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Output Card */
        .output-card {
          min-height: 640px;
          display: flex;
          flex-direction: column;
        }

        .timestamp-badge {
          font-size: 0.7rem;
          color: #059669;
          background: #ecfdf5;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .output-tabs-strip {
          display: flex;
          gap: 0.35rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.65rem;
          margin-bottom: 1rem;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .output-tabs-strip::-webkit-scrollbar { display: none; }

        .output-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.4rem 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          white-space: nowrap;
        }

        .output-tab-btn:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .output-tab-btn.active {
          color: var(--navy);
          background: #e2e8f0;
          font-weight: 700;
        }

        .output-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .output-tab-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .content-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
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
        }

        .article-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }

        .article-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          font-style: italic;
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
        }

        .article-lead-box {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--navy);
          font-weight: 500;
          margin-bottom: 1.25rem;
        }

        .article-inline-image {
          margin: 1.25rem 0;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: #ffffff;
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
        }

        .article-sections-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .article-section-block h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 0.35rem;
        }

        .article-section-block p {
          font-size: 0.86rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin: 0;
        }

        .climate-impact-card {
          background: #ecfdf5;
          border-left: 4px solid #059669;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.25rem;
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
        }

        .article-takeaways-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: var(--radius-sm);
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

        /* 2. Image Workspace Styles */
        .image-gen-workspace {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .image-preview-frame {
          position: relative;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid #cbd5e1;
          background: #0f172a;
          max-height: 320px;
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
          backdrop-filter: blur(4px);
          color: #ffffff;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .prompt-spec-panel {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: var(--radius-sm);
        }

        .spec-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--navy);
          display: block;
          margin-bottom: 0.35rem;
        }

        .spec-code-box {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.65rem;
          border-radius: 4px;
          font-size: 0.76rem;
          line-height: 1.45;
          color: #334155;
          font-family: monospace;
          word-break: break-word;
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
        }

        /* 3. Video Studio Styles */
        .video-studio-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 1.25rem;
          align-items: start;
        }

        .video-player-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .video-viewport-wrapper {
          position: relative;
          aspect-ratio: 16/9;
          background: #0f172a;
          overflow: hidden;
        }

        .video-sim-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
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
        }

        .storyboard-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
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
        }

        .scene-narration {
          font-size: 0.76rem;
          color: var(--navy);
          font-style: italic;
          margin-bottom: 0.45rem;
          line-height: 1.4;
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
        }

        /* 4. Social Tabs Styles */
        .social-subtabs-row {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .social-subtab {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .social-subtab:hover {
          background: #f1f5f9;
          color: var(--navy);
        }

        .social-subtab.active {
          background: var(--navy);
          color: #ffffff;
          border-color: var(--navy);
        }

        .output-textarea {
          width: 100%;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          font-size: 0.85rem;
          line-height: 1.6;
          background: #fafbfc;
          color: var(--text-primary);
          font-family: inherit;
          resize: vertical;
        }

        .fact-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .fact-card-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
        }

        .fact-num {
          font-size: 0.85rem;
          font-weight: 800;
          color: #059669;
          background: #ecfdf5;
          padding: 0.2rem 0.45rem;
          border-radius: 4px;
        }

        .fact-card-item p {
          margin: 0;
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .inspector-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: var(--radius-sm);
          max-height: 400px;
          overflow-y: auto;
        }

        .inspector-intro {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .inspector-chunk {
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed #cbd5e1;
        }

        .inspector-chunk h4 {
          font-size: 0.78rem;
          color: var(--navy);
          margin-bottom: 0.35rem;
        }

        .inspector-chunk pre {
          font-size: 0.72rem;
          white-space: pre-wrap;
          color: #475569;
          font-family: monospace;
          background: #ffffff;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .output-actions-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
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

        @media (max-width: 768px) {
          .selective-ai-page {
            padding: 1.5rem 0 3.5rem;
          }
          .input-row-2 {
            grid-template-columns: 1fr;
          }
          .content-meta-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .output-actions-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .output-actions-bar button {
            width: 100%;
            justify-content: center;
            min-height: 40px;
          }
          .article-preview-container {
            max-height: 400px;
            padding: 1rem;
          }
          .article-title {
            font-size: 1.15rem;
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
            justify-content: space-between;
          }
          .mode-pill {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
