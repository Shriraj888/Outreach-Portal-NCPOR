import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lock, Shield, ArrowRight, Compass, Sparkles, KeyRound, Mail } from 'lucide-react';

export default function AdminLogin({ navigateTo }) {
  const { login } = usePortal();
  const [email, setEmail] = useState('comms.officer@ncpor.res.in');
  const [password, setPassword] = useState('MoES@Polar2026');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      navigateTo('admin-dashboard');
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    login('outreach.head@ncpor.res.in', 'MoES@Polar2026');
    navigateTo('admin-dashboard');
  };

  return (
    <div className="container admin-login-page">
      <div className="glass-panel login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <Compass size={28} className="login-compass pulse-glow" />
          </div>
          <span className="login-gov-tag">MINISTRY OF EARTH SCIENCES • GOVT. OF INDIA</span>
          <h2>NCPOR Outreach & Science Comms Admin Studio</h2>
          <p>Secure portal for polar science content archiving, metadata tagging, and AI-assisted outreach generation.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>NCPOR Institutional Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@ncpor.res.in"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <KeyRound size={16} className="input-icon" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Studio'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Fast Access for SIH Judges */}
        <div className="demo-access-box">
          <div className="demo-header">
            <Sparkles size={16} className="demo-sparkle" />
            <span>SIH 2026 Evaluator 1-Click Access</span>
          </div>
          <p>Click below to instantly access the full Admin & AI Content Generation Studio with pre-seeded staff credentials.</p>
          <button 
            type="button" 
            className="btn-ai full-width"
            onClick={handleQuickDemoLogin}
          >
            <Shield size={16} />
            <span>Instant Demo Login (Evaluators)</span>
          </button>
        </div>

        <div className="login-footer">
          <button className="btn-back-home" onClick={() => navigateTo('home')}>
            ← Back to Public Outreach Portal
          </button>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          padding: 4rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
        }

        .login-card {
          width: 100%;
          max-width: 520px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(56, 189, 248, 0.35);
          background: linear-gradient(180deg, rgba(15, 29, 53, 0.95) 0%, rgba(7, 13, 24, 0.98) 100%);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo-wrap {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(37, 99, 235, 0.35));
          border: 1px solid rgba(56, 189, 248, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: var(--accent-ice);
        }

        .login-gov-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .login-header h2 {
          font-size: 1.4rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-ice);
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
        }

        .input-wrap input {
          width: 100%;
          background: #040810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem 0.75rem 2.4rem;
          color: #ffffff;
          font-size: 0.9rem;
        }

        .input-wrap input:focus {
          outline: none;
          border-color: var(--accent-ice);
        }

        .demo-access-box {
          background: rgba(147, 51, 234, 0.12);
          border: 1px dashed rgba(168, 85, 247, 0.4);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .demo-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #d8b4fe;
          margin-bottom: 0.35rem;
        }

        .demo-access-box p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 0.85rem;
        }

        .login-footer {
          text-align: center;
        }

        .btn-back-home {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.82rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .btn-back-home:hover {
          color: var(--accent-ice);
        }
      `}</style>
    </div>
  );
}
