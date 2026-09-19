import { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Share2,
  MessageCircle,
  Heart,
  Repeat,
  Bookmark,
  ThumbsUp,
  Download,
  ExternalLink,
  Smartphone,
  ImageIcon,
  BookOpen,
  FileText
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon, FacebookIcon, BlogIcon, ArticleIcon } from './SocialIcons';

export default function SocialCardPreview({
  aiContent,
  expeditionTitle,
  region,
  mediaUrl,
  mediaList = [],
  defaultPlatform = 'linkedin'
}) {
  const [activePlatform, setActivePlatform] = useState(defaultPlatform || 'linkedin');
  const [selectedMediaOverride, setSelectedMediaOverride] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const defaultCaptions = {
    twitter: "❄️ Setting sail for scientific discovery! The Indian Scientific Expedition #NCPOR #MoES has deployed critical cryosphere & climate monitoring assets. 🇮🇳🇦🇶 #PolarScience",
    instagram: "Into the White Wilderness! 🇦🇶✨\n\nNCPOR researchers are advancing frontline polar science—from autonomous weather buoys to ice-core climate archives!\n\n#Antarctica #NCPOR #PolarExploration #ClimateScience #IndiaInAntarctica",
    linkedin: "The National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, presents scientific updates on polar expedition operations.\n\nKey Milestones:\n🔹 Autonomous cryospheric sensor arrays deployed.\n🔹 Paleoclimate data records logged.\n🔹 Zero-emission station energy systems tested.",
    facebook: `❄️ Exploring the Ends of the Earth! 🌏 Discover how Indian scientists with the National Centre for Polar and Ocean Research (NCPOR) conducted vital research during the ${expeditionTitle || 'mission'} in ${region || 'Polar regions'}.\n\n🔬 Highlights of the Mission:\n• In-situ baseline recording under extreme conditions\n• Deployment of real-time telemetry sensor arrays\n• Uncovering critical links between polar weather and the Indian monsoon\n\n👉 Share this to celebrate Indian science! 🇮🇳\n\n#NCPOR #MoES #PolarScience #IndiaInAntarctica`,
    blog: `## Exploring the Frontiers of Polar Science: Insights from ${expeditionTitle || 'Polar Mission'}\n\n**By NCPOR Science Outreach Division**\n\nPolar regions may feel a world away, but the groundbreaking work conducted during **${expeditionTitle || 'the expedition'}** in ${region || 'the polar frontier'} directly influences our global climate and the Indian monsoon system.\n\n### Key Mission Milestones\n- **In-situ Cryospheric Probing**: High-resolution ice profiling across polar margins.\n- **Atmospheric Physics**: Continuous baseline monitoring of polar air masses.\n- **Green Hybrid Power Integration**: Reducing fuel dependency in sub-zero environments.\n\n### Why This Matters for India\nWhat happens at the poles drives deep oceanic and atmospheric teleconnections. By deploying cutting-edge instrumentation and retrieving unblemished climate records, Indian researchers are safeguarding our future and cementing India's leadership in the Antarctic Treaty System.\n\n*Explore open datasets and reports on the NCPOR Portal.*`,
    article: `PRESS RELEASE / NATIONAL SCIENCE DISPATCH\n\nDATELINE: GOA / NEW DELHI — MINISTRY OF EARTH SCIENCES, GOVT. OF INDIA\n\nSUBJECT: NCPOR Issues Scientific Report on ${expeditionTitle || 'Polar Expedition'}\n\nThe National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, announces the successful archival and validation of technical logs from ${expeditionTitle || 'the expedition'} in ${region || 'the polar region'}.\n\nKey Achievements:\n1. Recovery of benchmark scientific logs from extreme polar terrain.\n2. Deployment of autonomous sensor buoys with satellite links.\n3. Validation of cold-tolerant renewable microgrids.\n\nThe complete archive, comprising peer-reviewed papers, open datasets, and outreach multimedia, is publicly accessible on the NCPOR Outreach Portal.`
  };

  const captions = {
    ...defaultCaptions,
    ...(aiContent?.socialCaptions || {})
  };

  const selectedMediaUrl = selectedMediaOverride ?? mediaUrl ?? (mediaList[0]?.url) ?? '';

  const setSelectedMediaUrl = (url) => {
    setSelectedMediaOverride(url);
  };

  if (!aiContent || !aiContent.socialCaptions) {
    return (
      <div className="empty-social-box">
        <Sparkles size={24} className="empty-sparkle" />
        <p>No outreach social package generated yet. Click "Generate AI Content" in Admin Studio.</p>
      </div>
    );
  }

  const selectedMediaObj = mediaList.find(m => m.url === selectedMediaUrl) || mediaList[0] || {};

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadKit = () => {
    const fullBundle = `NCPOR COMPLETE MULTI-CHANNEL SOCIAL & PRESS OUTREACH KIT
Expedition: ${expeditionTitle || 'Polar Expedition'}
Generated: ${new Date().toLocaleDateString()}

================ TWITTER / X ================
${captions.twitter}

================ INSTAGRAM ================
${captions.instagram}

================ LINKEDIN ================
${captions.linkedin}

================ FACEBOOK ================
${captions.facebook}

================ SCIENCE BLOG POST ================
${captions.blog}

================ PRESS DISPATCH ARTICLE ================
${captions.article}

================ ATTACHED MEDIA ================
Image URL: ${selectedMediaUrl}
Accessibility Alt-Text: ${selectedMediaObj.altText || ''}
Caption: ${selectedMediaObj.caption || ''}
`;
    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NCPOR_Full_Outreach_Kit_${(expeditionTitle || 'Expedition').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareTwitter = (text) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = (text) => {
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const platforms = [
    { id: 'twitter', label: 'Twitter / X', icon: <TwitterIcon size={15} />, badge: 'Short Form' },
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon size={15} />, badge: 'Visual' },
    { id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon size={15} />, badge: 'Executive' },
    { id: 'facebook', label: 'Facebook', icon: <FacebookIcon size={15} />, badge: 'Community' },
    { id: 'blog', label: 'Science Blog', icon: <BlogIcon size={15} />, badge: 'Long Form' },
    { id: 'article', label: 'Press Article', icon: <ArticleIcon size={15} />, badge: 'Official News' }
  ];

  return (
    <div className="social-command-center">
      {/* Top Executive Toolbar */}
      <div className="social-executive-bar">
        <div className="exec-left-info">
          <div className="social-pack-ready-badge">
            <Sparkles size={14} className="sparkle-active" />
            <span>Interactive Feed Mockup</span>
            <span className="live-pill">LIVE DISPATCH READY</span>
          </div>
          <p className="exec-desc">
            Interactive social feed previews for Twitter/X, Instagram, LinkedIn, Facebook, Science Blog, and Press News Articles.
          </p>
        </div>

        <div className="exec-actions-right">
          <button
            className="btn-exec-download"
            onClick={handleDownloadKit}
            title="Download Social Media & Press Kit text file"
          >
            <Download size={15} />
            <span>Export Complete Kit (.txt)</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Feed Mockup Indicator & Media Switcher */}
      <div className="social-control-strip">
        <div className="view-mode-selector">
          <span className="ctrl-label">
            <Smartphone size={14} />
            <span>Interactive Feed Mockup</span>
          </span>
        </div>

        {/* Media Selector Strip */}
        {mediaList.length > 1 && (
          <div className="media-selector-box">
            <span className="ctrl-label">
              <ImageIcon size={13} />
              <span>Attached Media ({mediaList.length}):</span>
            </span>
            <div className="media-thumb-pills">
              {mediaList.map((m, idx) => (
                <button
                  key={m.id || idx}
                  className={`media-pill-btn ${selectedMediaUrl === m.url ? 'active' : ''}`}
                  onClick={() => setSelectedMediaUrl(m.url)}
                  title={m.caption || `Image ${idx + 1}`}
                >
                  <img src={m.url} alt="" className="pill-img-thumb" />
                  <span>Photo #{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AUTHENTIC FEED MOCKUP PREVIEW */}
      <div className="mock-preview-container">
          {/* Tab bar across all 6 channels */}
          <div className="platform-tab-bar">
            {platforms.map(p => (
              <button
                key={p.id}
                type="button"
                className={`platform-btn ${p.id} ${activePlatform === p.id ? 'active' : ''}`}
                onClick={() => setActivePlatform(p.id)}
              >
                <span className={`platform-btn-icon ${p.id}`}>
                  {p.icon}
                </span>
                <span className="platform-btn-label">{p.label}</span>
                <span className="char-badge">{p.badge}</span>
              </button>
            ))}
          </div>

          <div className="platform-card-wrapper">
            {/* Twitter / X Mock */}
            {activePlatform === 'twitter' && (
              <div className="mock-card mock-twitter">
                <div className="mock-header">
                  <div className="mock-avatar-wrap"><div className="avatar-ncpor">NC</div></div>
                  <div className="mock-user-info">
                    <div className="user-name-row">
                      <strong>NCPOR India</strong>
                      <span className="gov-verified-badge" title="Government Official">✓</span>
                      <span className="user-handle">@NCPOR_MoES</span>
                      <span className="post-dot">·</span>
                      <span className="post-time">1h</span>
                    </div>
                    <div className="post-subtitle">Ministry of Earth Sciences, Govt. of India</div>
                  </div>
                </div>
                <div className="mock-post-body"><p className="tweet-text">{captions.twitter}</p></div>
                {selectedMediaUrl && (
                  <div className="mock-media-container"><img src={selectedMediaUrl} alt={expeditionTitle} className="mock-post-img" /></div>
                )}
                <div className="mock-actions twitter-actions">
                  <span><MessageCircle size={15} /> 48</span>
                  <span><Repeat size={15} /> 182</span>
                  <span><Heart size={15} /> 942</span>
                  <span><Share2 size={15} /></span>
                </div>
                <div className="copy-action-bar">
                  <button className="btn-copy-caption" onClick={() => handleCopy(captions.twitter, 'twitter')}>
                    {copiedKey === 'twitter' ? <><Check size={14} className="check-icon" /><span>Copied for Twitter!</span></> : <><Copy size={14} /><span>Copy Ready-to-Post Tweet</span></>}
                  </button>
                  <button className="btn-direct-post-action twitter-btn" onClick={() => handleShareTwitter(captions.twitter)}>
                    <ExternalLink size={14} />
                    <span>Post Directly on X</span>
                  </button>
                </div>
              </div>
            )}

            {/* Instagram Mock */}
            {activePlatform === 'instagram' && (
              <div className="mock-card mock-instagram">
                <div className="insta-top-bar">
                  <div className="insta-user">
                    <div className="insta-avatar">NC</div>
                    <div className="insta-names">
                      <strong>ncpor_india</strong>
                      <span className="insta-location">{region || 'Antarctica'} Frontier</span>
                    </div>
                  </div>
                  <span className="insta-more">•••</span>
                </div>
                {selectedMediaUrl && (
                  <div className="insta-image-box"><img src={selectedMediaUrl} alt={expeditionTitle} className="insta-img" /></div>
                )}
                <div className="insta-actions-row">
                  <div className="left-icons"><Heart size={20} className="insta-heart" /><MessageCircle size={20} /><Share2 size={20} /></div>
                  <Bookmark size={20} />
                </div>
                <div className="insta-likes">Liked by <strong>moes_goi</strong> and <strong>1,842 others</strong></div>
                <div className="insta-caption-box">
                  <span className="caption-handle">ncpor_india</span>
                  <p className="insta-caption-text">{captions.instagram}</p>
                </div>
                <div className="copy-action-bar">
                  <button className="btn-copy-caption" onClick={() => handleCopy(captions.instagram, 'instagram')}>
                    {copiedKey === 'instagram' ? <><Check size={14} className="check-icon" /><span>Copied Instagram Caption!</span></> : <><Copy size={14} /><span>Copy Full Instagram Caption & Hashtags</span></>}
                  </button>
                </div>
              </div>
            )}

            {/* LinkedIn Mock */}
            {activePlatform === 'linkedin' && (
              <div className="mock-card mock-linkedin">
                <div className="li-header">
                  <div className="li-avatar">NC</div>
                  <div className="li-info">
                    <strong>National Centre for Polar and Ocean Research (NCPOR)</strong>
                    <span className="li-followers">58,920 followers • 2h • 🌐</span>
                  </div>
                </div>
                <div className="li-body"><p className="li-text">{captions.linkedin}</p></div>
                {selectedMediaUrl && (
                  <div className="li-media"><img src={selectedMediaUrl} alt={expeditionTitle} className="li-img" /></div>
                )}
                <div className="li-reactions-stat">
                  <span>👍💡❤️ 412 reactions</span>
                  <span>38 comments • 19 reposts</span>
                </div>
                <div className="li-action-bar">
                  <span><ThumbsUp size={16} /> Like</span>
                  <span><MessageCircle size={16} /> Comment</span>
                  <span><Repeat size={16} /> Repost</span>
                  <span><Share2 size={16} /> Send</span>
                </div>
                <div className="copy-action-bar">
                  <button className="btn-copy-caption" onClick={() => handleCopy(captions.linkedin, 'linkedin')}>
                    {copiedKey === 'linkedin' ? <><Check size={14} className="check-icon" /><span>Copied LinkedIn Post!</span></> : <><Copy size={14} /><span>Copy Executive LinkedIn Update</span></>}
                  </button>
                  <button className="btn-direct-post-action li-share-btn" onClick={() => handleShareLinkedIn(captions.linkedin)}>
                    <ExternalLink size={14} />
                    <span>Share on LinkedIn</span>
                  </button>
                </div>
              </div>
            )}

            {/* Facebook Mock */}
            {activePlatform === 'facebook' && (
              <div className="mock-card mock-facebook">
                <div className="fb-header">
                  <div className="fb-avatar">NC</div>
                  <div className="fb-info">
                    <div className="fb-name-row">
                      <strong>National Centre for Polar and Ocean Research - NCPOR</strong>
                      <span className="gov-verified-badge" title="Verified Public Organization">✓</span>
                    </div>
                    <span className="fb-time">Just now • 🌐 Public</span>
                  </div>
                </div>
                <div className="fb-body"><p className="fb-text">{captions.facebook}</p></div>
                {selectedMediaUrl && (
                  <div className="fb-media"><img src={selectedMediaUrl} alt={expeditionTitle} className="fb-img" /></div>
                )}
                <div className="fb-reactions-stat">
                  <span>👍❤️ 248 Likes • 29 Comments • 14 Shares</span>
                </div>
                <div className="fb-action-bar">
                  <span><ThumbsUp size={16} /> Like</span>
                  <span><MessageCircle size={16} /> Comment</span>
                  <span><Share2 size={16} /> Share</span>
                </div>
                <div className="copy-action-bar">
                  <button className="btn-copy-caption" onClick={() => handleCopy(captions.facebook, 'facebook')}>
                    {copiedKey === 'facebook' ? <><Check size={14} className="check-icon" /><span>Copied Facebook Post!</span></> : <><Copy size={14} /><span>Copy Facebook Post</span></>}
                  </button>
                  <button className="btn-direct-post-action fb-share-btn" onClick={handleShareFacebook}>
                    <ExternalLink size={14} />
                    <span>Share on Facebook</span>
                  </button>
                </div>
              </div>
            )}

            {/* Science Blog Post Mock */}
            {activePlatform === 'blog' && (
              <div className="mock-card mock-blog-full">
                <div className="mock-blog-header">
                  <div className="blog-meta-badge">
                    <BookOpen size={14} />
                    <span>NCPOR Polar Science Communications Blog</span>
                  </div>
                  <h3>Editorial & Science Outreach Feature</h3>
                </div>
                <div className="mock-blog-body">
                  <pre className="blog-full-pre">{captions.blog}</pre>
                </div>
                <div className="copy-action-bar">
                  <button className="btn-copy-caption" onClick={() => handleCopy(captions.blog, 'blog')}>
                    {copiedKey === 'blog' ? <><Check size={14} className="check-icon" /><span>Copied Blog Markdown!</span></> : <><Copy size={14} /><span>Copy Markdown Blog Post</span></>}
                  </button>
                </div>
              </div>
            )}

            {/* Press Article Mock */}
            {activePlatform === 'article' && (
              <div className="mock-card mock-article-full">
                <div className="mock-article-header">
                  <div className="article-meta-badge">
                    <FileText size={14} />
                    <span>Official Press Release Dispatch • Ministry of Earth Sciences</span>
                  </div>
                  <h3>National Polar Knowledge Series Article</h3>
                </div>
                <div className="mock-article-body">
                  <pre className="article-full-pre">{captions.article}</pre>
                </div>
                <div className="copy-action-bar">
                  <button className="btn-copy-caption" onClick={() => handleCopy(captions.article, 'article')}>
                    {copiedKey === 'article' ? <><Check size={14} className="check-icon" /><span>Copied Press Release!</span></> : <><Copy size={14} /><span>Copy Press Release Article</span></>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      <style>{`
        .social-command-center {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Executive Header */
        .social-executive-bar {
          background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
          border-bottom: 1px solid #dcfce7;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .exec-left-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1 1 auto;
          min-width: 0;
        }

        .social-pack-ready-badge {
          display: inline-flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0.65rem;
          font-size: 0.82rem;
          font-weight: 800;
          color: #065f46;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .sparkle-active {
          color: #059669;
          flex-shrink: 0;
        }

        .live-pill {
          background: #059669;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          line-height: 1;
          flex-shrink: 0;
        }

        .exec-desc {
          font-size: 0.84rem;
          color: #047857;
          margin: 0;
          line-height: 1.4;
        }

        .exec-actions-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .btn-exec-bulk {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #059669;
          border: 1px solid #047857;
          color: #ffffff;
          padding: 0.55rem 1.15rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25);
        }

        .btn-exec-bulk:hover {
          background: #047857;
          transform: translateY(-1px);
        }

        .btn-exec-bulk.copied {
          background: #065f46;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.3);
        }

        .btn-exec-download {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.55rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-exec-download:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
        }

        /* Control Strip */
        .social-control-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .view-mode-selector {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .ctrl-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .view-mode-buttons {
          display: flex;
          background: #e2e8f0;
          padding: 2px;
          border-radius: 8px;
          gap: 2px;
        }

        .btn-mode {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          color: #475569;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-mode.active {
          background: #ffffff;
          color: var(--navy);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }

        .media-selector-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .media-thumb-pills {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .media-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem 0.2rem 0.25rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .media-pill-btn:hover {
          border-color: #0284c7;
        }

        .media-pill-btn.active {
          background: #e0f2fe;
          border-color: #0284c7;
          color: #0369a1;
          font-weight: 700;
        }

        .pill-img-thumb {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          object-fit: cover;
        }

        /* 6-Channel Grid */
        .social-grid-6col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          padding: 1.5rem;
          background: #f8fafc;
        }

        @media (max-width: 1200px) {
          .social-grid-6col {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .social-grid-6col {
            grid-template-columns: 1fr;
          }
        }

        .channel-column-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .channel-column-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .channel-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.75rem;
        }

        .channel-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .channel-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .twitter-bg { background: #000000; }
        .instagram-bg { background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
        .linkedin-bg { background: #0a66c2; }
        .facebook-bg { background: #1877f2; }
        .blog-bg { background: #059669; }
        .article-bg { background: #7c3aed; }

        .channel-title-wrap h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
          line-height: 1.2;
        }

        .channel-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          display: block;
        }

        .char-meter-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .char-num.over-limit {
          color: #dc2626;
          font-weight: 900;
        }

        .channel-media-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          height: 130px;
          border: 1px solid #e2e8f0;
        }

        .grid-media-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-tag-overlay {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .channel-caption-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.85rem;
          min-height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .blog-scroll-container {
          max-height: 220px;
          overflow-y: auto;
        }

        .channel-text-display {
          font-size: 0.84rem;
          line-height: 1.55;
          color: #1e293b;
          margin: 0;
          white-space: pre-line;
          word-break: break-word;
        }

        .blog-pre-preview, .article-pre-preview {
          font-family: inherit;
          font-size: 0.8rem;
          line-height: 1.55;
          color: #334155;
          margin: 0;
          white-space: pre-wrap;
        }

        .channel-textarea {
          width: 100%;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.84rem;
          line-height: 1.55;
          color: #0f172a;
          resize: vertical;
          outline: none;
        }

        .quick-tags-wrap {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          font-size: 0.72rem;
        }

        .tags-label {
          font-weight: 700;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .tag-chips {
          display: flex;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .chip-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #0369a1;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .chip-btn:hover {
          background: #e0f2fe;
          border-color: #bae6fd;
        }

        .channel-actions-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
          padding-top: 0.75rem;
          margin-top: auto;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .edit-reset-actions {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .btn-edit-caption {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-edit-caption:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .btn-reset-caption {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #64748b;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .main-copy-share-btns {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-channel-copy {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.38rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-channel-copy:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .btn-channel-copy.copied {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #059669;
        }

        .blog-copy-btn {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .article-copy-btn {
          background: #f5f3ff;
          border-color: #ddd6fe;
          color: #6d28d9;
        }

        .btn-channel-share {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #ffffff;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.38rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .twitter-btn { background: #0f172a; }
        .twitter-btn:hover { background: #000000; }
        .linkedin-btn { background: #0a66c2; }
        .linkedin-btn:hover { background: #004182; }
        .facebook-btn { background: #1877f2; }
        .facebook-btn:hover { background: #0c63d4; }

        /* Mockup View */
        .mock-preview-container {
          background: #f8fafc;
        }

        .platform-tab-bar {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-subtle);
          box-sizing: border-box;
          width: 100%;
        }

        .platform-btn {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 0.45rem;
          padding: 0.5rem 0.65rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          box-sizing: border-box;
          width: 100%;
          min-height: 42px;
        }

        .platform-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-1px);
        }

        .platform-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25);
        }

        .platform-btn-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #f1f5f9;
          color: #334155;
          transition: all 0.15s ease;
        }

        .platform-btn.active .platform-btn-icon {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .platform-btn-label {
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .char-badge {
          margin-left: auto;
          font-size: 0.64rem;
          font-weight: 600;
          background: #f1f5f9;
          color: #64748b;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .platform-btn.active .char-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .platform-card-wrapper {
          padding: 2rem 1.5rem;
          display: flex;
          justify-content: center;
          background: #f8fafc;
        }

        .mock-card {
          width: 100%;
          max-width: 620px;
          border-radius: var(--radius-sm);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .mock-twitter, .mock-facebook, .mock-linkedin {
          padding: 1.25rem;
        }

        .mock-header, .fb-header, .li-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .avatar-ncpor, .insta-avatar, .li-avatar, .fb-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          color: #ffffff;
        }

        .fb-avatar {
          background: #1877f2;
        }

        .user-name-row, .fb-name-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.88rem;
          color: var(--navy);
          flex-wrap: wrap;
        }

        .gov-verified-badge {
          background: #0284c7;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 900;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-handle, .post-time, .post-subtitle, .fb-time, .li-followers {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .tweet-text, .fb-text, .li-text {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-primary);
          white-space: pre-line;
          margin-bottom: 0.85rem;
        }

        .mock-media-container, .fb-media, .li-media {
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0.85rem;
          border: 1px solid #e2e8f0;
        }

        .mock-post-img, .fb-img, .li-img {
          width: 100%;
          max-height: 280px;
          object-fit: cover;
          display: block;
        }

        .twitter-actions, .fb-action-bar, .li-action-bar {
          display: flex;
          justify-content: space-around;
          padding: 0.5rem 0 0;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          border-top: 1px solid #f1f5f9;
        }

        .fb-reactions-stat, .li-reactions-stat {
          padding: 0.5rem 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid #f8fafc;
        }

        /* Instagram */
        .mock-instagram {
          background: #ffffff;
        }

        .insta-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .insta-user {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .insta-avatar {
          width: 32px;
          height: 32px;
          font-size: 0.75rem;
        }

        .insta-names {
          display: flex;
          flex-direction: column;
          font-size: 0.82rem;
        }

        .insta-location {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .insta-image-box img {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
        }

        .insta-actions-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 1rem 0.5rem;
          color: #0f172a;
        }

        .left-icons {
          display: flex;
          gap: 1rem;
        }

        .insta-likes {
          padding: 0 1rem;
          font-size: 0.82rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .insta-caption-box {
          padding: 0 1rem 1rem;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .caption-handle {
          font-weight: 700;
          margin-right: 0.5rem;
          color: var(--navy);
        }

        .insta-caption-text {
          white-space: pre-line;
          display: inline;
          color: var(--text-secondary);
        }

        /* Mock Blog & Article */
        .mock-blog-full, .mock-article-full {
          padding: 1.5rem;
        }

        .mock-blog-header, .mock-article-header {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }

        .blog-meta-badge, .article-meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.35rem;
        }

        .blog-meta-badge { color: #059669; }
        .article-meta-badge { color: #7c3aed; }

        .mock-blog-header h3, .mock-article-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
        }

        .blog-full-pre, .article-full-pre {
          font-family: inherit;
          font-size: 0.88rem;
          line-height: 1.65;
          color: #334155;
          white-space: pre-wrap;
          margin: 0;
          max-height: 380px;
          overflow-y: auto;
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .copy-action-bar {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .btn-copy-caption {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: var(--navy);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-copy-caption:hover {
          background: #f1f5f9;
        }

        .btn-direct-post-action {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .fb-share-btn { background: #1877f2; }
        .fb-share-btn:hover { background: #0c63d4; }
        .li-share-btn { background: #0a66c2; }
        .li-share-btn:hover { background: #004182; }

        .check-icon {
          color: #059669;
        }

        .empty-social-box {
          padding: 2.5rem;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .empty-sparkle {
          color: #0284c7;
        }

        @media (max-width: 768px) {
          .social-command-center {
            width: 100%;
            overflow-x: hidden;
            border-radius: 12px;
          }
          .social-executive-bar {
            padding: 0.85rem 0.75rem;
            flex-direction: column;
            align-items: stretch;
            gap: 0.65rem;
          }
          .exec-left-info {
            min-width: 0;
            width: 100%;
          }
          .social-pack-ready-badge {
            font-size: 0.75rem;
            flex-wrap: wrap;
          }
          .exec-desc {
            font-size: 0.78rem;
          }
          .exec-actions-right {
            width: 100%;
          }
          .btn-exec-download {
            width: 100%;
            justify-content: center;
            min-height: 40px;
            font-size: 0.78rem;
          }
          .social-control-strip {
            padding: 0.75rem;
            flex-direction: column;
            align-items: stretch;
            gap: 0.65rem;
          }
          .view-mode-selector {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }
          .view-mode-buttons {
            width: 100%;
            display: flex;
          }
          .btn-mode {
            flex: 1;
            justify-content: center;
            text-align: center;
            padding: 0.5rem 0.35rem;
            font-size: 0.72rem;
            min-height: 36px;
          }
          .media-selector-box {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }
          .media-thumb-pills {
            width: 100%;
            overflow-x: auto;
            scrollbar-width: none;
            padding-bottom: 0.2rem;
          }
          .social-grid-6col {
            grid-template-columns: 1fr;
            padding: 0.75rem 0.6rem;
            gap: 0.85rem;
          }
          .channel-column-card {
            padding: 0.85rem 0.75rem;
            border-radius: 10px;
            width: 100%;
            box-sizing: border-box;
          }
          .channel-actions-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .edit-reset-actions {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          .main-copy-share-btns {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.4rem;
          }
          .btn-channel-copy, .btn-channel-share {
            width: 100%;
            justify-content: center;
            min-height: 38px;
            font-size: 0.72rem;
            padding: 0.4rem 0.5rem;
            text-align: center;
          }
          .platform-tab-bar {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            padding: 0.65rem 0.75rem;
            background: #f1f5f9;
            border-bottom: 1px solid var(--border-subtle);
            width: 100%;
            box-sizing: border-box;
          }
          .platform-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
            padding: 0.5rem 0.65rem;
            font-size: 0.75rem;
            text-align: left;
            white-space: nowrap;
            min-height: 42px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            width: 100%;
            box-sizing: border-box;
          }
          .platform-btn.active {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
            box-shadow: 0 3px 8px rgba(15, 23, 42, 0.3);
          }
          .platform-btn-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: #f1f5f9;
            color: #1e293b;
          }
          .platform-btn.active .platform-btn-icon {
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
          }
          .platform-btn-label {
            font-size: 0.75rem;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .char-badge {
            display: none;
          }
          .platform-card-wrapper {
            padding: 0.85rem 0.5rem;
          }
          .mock-card {
            max-width: 100%;
            border-radius: 10px;
          }
          .mock-twitter, .mock-facebook, .mock-linkedin {
            padding: 0.85rem 0.75rem;
          }
          .mock-blog-full, .mock-article-full {
            padding: 0.85rem 0.75rem;
          }
          .avatar-ncpor, .insta-avatar, .li-avatar, .fb-avatar {
            width: 34px;
            height: 34px;
            font-size: 0.75rem;
          }
          .user-name-row, .fb-name-row {
            font-size: 0.82rem;
            gap: 0.25rem;
          }
          .user-handle, .post-time, .post-subtitle, .fb-time, .li-followers {
            font-size: 0.72rem;
          }
          .tweet-text, .fb-text, .li-text {
            font-size: 0.84rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }
          .mock-post-img, .fb-img, .li-img, .insta-image-box img {
            max-height: 200px;
          }
          .twitter-actions, .fb-action-bar, .li-action-bar {
            font-size: 0.72rem;
            padding: 0.4rem 0 0;
            gap: 0.25rem;
          }
          .li-action-bar span, .fb-action-bar span, .twitter-actions span {
            display: inline-flex;
            align-items: center;
            gap: 0.2rem;
            font-size: 0.7rem;
          }
          .insta-top-bar, .insta-actions-row, .insta-caption-box, .insta-likes {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .insta-caption-text {
            font-size: 0.8rem;
            word-break: break-word;
            overflow-wrap: anywhere;
          }
          .blog-full-pre, .article-full-pre {
            font-size: 0.76rem;
            padding: 0.75rem;
            max-height: 260px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }
          .copy-action-bar {
            margin-top: 0.75rem;
            padding-top: 0.65rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.4rem;
            width: 100%;
          }
          .btn-copy-caption, .btn-direct-post-action {
            width: 100%;
            justify-content: center;
            min-height: 38px;
            font-size: 0.74rem;
            padding: 0.45rem 0.5rem;
            text-align: center;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
