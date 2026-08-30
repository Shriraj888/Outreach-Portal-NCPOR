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
  Award 
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon } from './SocialIcons';

export default function SocialCardPreview({ aiContent, expeditionTitle, region, mediaUrl }) {
  const [activePlatform, setActivePlatform] = useState('twitter');
  const [copiedKey, setCopiedKey] = useState(null);

  if (!aiContent || !aiContent.socialCaptions) {
    return (
      <div className="empty-social-box">
        <Sparkles size={24} className="empty-sparkle" />
        <p>No outreach social package generated yet. Click "Generate AI Content" in Admin Studio.</p>
      </div>
    );
  }

  const { twitter, instagram, linkedin } = aiContent.socialCaptions;
  const factCards = aiContent.factCards || [];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="social-studio-container">
      {/* Platform Selector Tabs */}
      <div className="platform-tab-bar">
        <button
          className={`platform-btn twitter ${activePlatform === 'twitter' ? 'active' : ''}`}
          onClick={() => setActivePlatform('twitter')}
        >
          <TwitterIcon size={15} />
          <span>Twitter / X</span>
          <span className="char-badge">{twitter ? `${twitter.length} chars` : ''}</span>
        </button>

        <button
          className={`platform-btn instagram ${activePlatform === 'instagram' ? 'active' : ''}`}
          onClick={() => setActivePlatform('instagram')}
        >
          <InstagramIcon size={15} />
          <span>Instagram</span>
        </button>

        <button
          className={`platform-btn linkedin ${activePlatform === 'linkedin' ? 'active' : ''}`}
          onClick={() => setActivePlatform('linkedin')}
        >
          <LinkedinIcon size={15} />
          <span>LinkedIn</span>
        </button>

        <button
          className={`platform-btn factcards ${activePlatform === 'factcards' ? 'active' : ''}`}
          onClick={() => setActivePlatform('factcards')}
        >
          <Award size={15} />
          <span>Classroom Fact Cards</span>
        </button>
      </div>

      {/* Preview Card Body */}
      <div className="platform-card-wrapper">
        {/* Twitter / X Mock */}
        {activePlatform === 'twitter' && (
          <div className="mock-card mock-twitter">
            <div className="mock-header">
              <div className="mock-avatar-wrap">
                <div className="avatar-ncpor">NC</div>
              </div>
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

            <div className="mock-post-body">
              <p className="tweet-text">{twitter}</p>
            </div>

            {mediaUrl && (
              <div className="mock-media-container">
                <img src={mediaUrl} alt={expeditionTitle} className="mock-post-img" />
              </div>
            )}

            <div className="mock-actions twitter-actions">
              <span><MessageCircle size={15} /> 48</span>
              <span><Repeat size={15} /> 182</span>
              <span><Heart size={15} /> 942</span>
              <span><Share2 size={15} /></span>
            </div>

            <div className="copy-action-bar">
              <button 
                className="btn-copy-caption"
                onClick={() => handleCopy(twitter, 'twitter')}
              >
                {copiedKey === 'twitter' ? (
                  <>
                    <Check size={14} className="check-icon" />
                    <span>Copied for Twitter!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Ready-to-Post Tweet</span>
                  </>
                )}
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

            {mediaUrl && (
              <div className="insta-image-box">
                <img src={mediaUrl} alt={expeditionTitle} className="insta-img" />
              </div>
            )}

            <div className="insta-actions-row">
              <div className="left-icons">
                <Heart size={20} className="insta-heart" />
                <MessageCircle size={20} />
                <Share2 size={20} />
              </div>
              <Bookmark size={20} />
            </div>

            <div className="insta-likes">Liked by <strong>moes_goi</strong> and <strong>1,842 others</strong></div>

            <div className="insta-caption-box">
              <span className="caption-handle">ncpor_india</span>
              <p className="insta-caption-text">{instagram}</p>
            </div>

            <div className="copy-action-bar">
              <button 
                className="btn-copy-caption"
                onClick={() => handleCopy(instagram, 'instagram')}
              >
                {copiedKey === 'instagram' ? (
                  <>
                    <Check size={14} className="check-icon" />
                    <span>Copied Instagram Caption!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Full Instagram Caption & Hashtags</span>
                  </>
                )}
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

            <div className="li-body">
              <p className="li-text">{linkedin}</p>
            </div>

            {mediaUrl && (
              <div className="li-media">
                <img src={mediaUrl} alt={expeditionTitle} className="li-img" />
              </div>
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
              <button 
                className="btn-copy-caption"
                onClick={() => handleCopy(linkedin, 'linkedin')}
              >
                {copiedKey === 'linkedin' ? (
                  <>
                    <Check size={14} className="check-icon" />
                    <span>Copied LinkedIn Post!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Executive LinkedIn Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Fact Cards */}
        {activePlatform === 'factcards' && (
          <div className="mock-card mock-facts">
            <div className="facts-header">
              <Award size={20} className="facts-icon" />
              <h4>Bite-Sized Educational Fact Cards (Smart Education)</h4>
            </div>
            
            <div className="facts-grid">
              {factCards.map((fact, idx) => (
                <div key={idx} className="fact-card-item">
                  <div className="fact-num">0{idx + 1}</div>
                  <p className="fact-content">{fact}</p>
                </div>
              ))}
            </div>

            <div className="copy-action-bar">
              <button 
                className="btn-copy-caption"
                onClick={() => handleCopy(factCards.join('\n• '), 'facts')}
              >
                {copiedKey === 'facts' ? (
                  <>
                    <Check size={14} className="check-icon" />
                    <span>Copied Fact Cards!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy All Fact Bullets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .social-studio-container {
          background: rgba(11, 22, 40, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .platform-tab-bar {
          display: flex;
          background: rgba(7, 13, 24, 0.8);
          border-bottom: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .platform-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }

        .platform-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .platform-btn.active.twitter {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
        }

        .platform-btn.active.instagram {
          color: #f43f5e;
          border-bottom-color: #f43f5e;
          background: rgba(244, 63, 94, 0.08);
        }

        .platform-btn.active.linkedin {
          color: #60a5fa;
          border-bottom-color: #60a5fa;
          background: rgba(96, 165, 250, 0.08);
        }

        .platform-btn.active.factcards {
          color: #fbbf24;
          border-bottom-color: #fbbf24;
          background: rgba(251, 191, 36, 0.08);
        }

        .char-badge {
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .platform-card-wrapper {
          padding: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .mock-card {
          width: 100%;
          max-width: 580px;
          border-radius: var(--radius-sm);
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        .mock-twitter {
          padding: 1rem;
        }

        .mock-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .avatar-ncpor, .insta-avatar, .li-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          color: #ffffff;
        }

        .user-name-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.88rem;
          color: #ffffff;
        }

        .gov-verified-badge {
          background: #38bdf8;
          color: #000;
          font-size: 0.65rem;
          font-weight: 900;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-handle, .post-time, .post-subtitle {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .tweet-text {
          font-size: 0.92rem;
          line-height: 1.5;
          color: #e2e8f0;
          white-space: pre-line;
          margin-bottom: 0.85rem;
        }

        .mock-media-container {
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mock-post-img {
          width: 100%;
          max-height: 280px;
          object-fit: cover;
          display: block;
        }

        .twitter-actions {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0.5rem 0;
          color: var(--text-muted);
          font-size: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .twitter-actions span {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* Instagram */
        .mock-instagram {
          background: #121212;
        }

        .insta-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
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
          color: #ffffff;
        }

        .left-icons {
          display: flex;
          gap: 1rem;
        }

        .insta-likes {
          padding: 0 1rem;
          font-size: 0.82rem;
          margin-bottom: 0.5rem;
        }

        .insta-caption-box {
          padding: 0 1rem 1rem;
          font-size: 0.85rem;
          line-height: 1.45;
        }

        .caption-handle {
          font-weight: 700;
          margin-right: 0.5rem;
        }

        .insta-caption-text {
          white-space: pre-line;
          display: inline;
          color: #cbd5e1;
        }

        /* LinkedIn */
        .mock-linkedin {
          background: #1b1f23;
          padding: 1.25rem;
        }

        .li-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .li-info {
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }

        .li-followers {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .li-text {
          font-size: 0.88rem;
          line-height: 1.55;
          color: #e2e8f0;
          white-space: pre-line;
          margin-bottom: 1rem;
        }

        .li-media img {
          width: 100%;
          max-height: 240px;
          object-fit: cover;
          border-radius: 6px;
        }

        .li-reactions-stat {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .li-action-bar {
          display: flex;
          justify-content: space-around;
          padding: 0.75rem 0 0;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .li-action-bar span {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
        }

        /* Facts */
        .mock-facts {
          background: rgba(15, 29, 53, 0.95);
          padding: 1.25rem;
        }

        .facts-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fbbf24;
          margin-bottom: 1rem;
        }

        .facts-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .fact-card-item {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
        }

        .fact-num {
          font-family: var(--font-mono);
          font-weight: 800;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.78rem;
        }

        .fact-content {
          font-size: 0.85rem;
          color: #f1f5f9;
          line-height: 1.45;
        }

        .copy-action-bar {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-copy-caption {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #7dd3fc;
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy-caption:hover {
          background: rgba(56, 189, 248, 0.25);
          color: #ffffff;
        }

        .check-icon {
          color: #4ade80;
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
          color: #a855f7;
        }
      `}</style>
    </div>
  );
}
