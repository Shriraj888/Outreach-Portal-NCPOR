import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Shield, ArrowRight, Compass, Sparkles, KeyRound, Mail } from 'lucide-react';

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
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <Compass size={28} className="login-compass" />
          </div>
          <span className="login-gov-tag">MINISTRY OF EARTH SCIENCES • GOVT. OF INDIA</span>
          <h2>NCPOR Outreach & Science Comms Admin Studio</h2>
          <p>Secure portal for polar science content archiving, metadata tagging, and outreach generation.</p>
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

          <button type="submit" className="btn-login-submit full-width" disabled={loading}>
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
          <p>Click below to instantly access the full Admin & Outreach Studio with pre-seeded staff credentials.</p>
          <button 
            type="button" 
            className="btn-demo-fast full-width"
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
          max-width: 500px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-card);
          background: #ffffff;
          box-shadow: var(--shadow-md);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo-wrap {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #0a2540;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: #d97706;
          box-shadow: var(--shadow-sm);
        }

        .login-gov-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: #d97706;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .login-header h2 {
          font-size: 1.35rem;
          color: var(--navy);
          margin-bottom: 0.5rem;
          font-weight: 800;
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
          color: var(--navy);
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
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem 0.75rem 2.4rem;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .input-wrap input:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
          box-shadow: 0 0 0 3px var(--ice-glow);
        }

        .btn-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--navy);
          color: #ffffff;
          font-weight: 700;
          padding: 0.8rem;
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          font-size: 0.92rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.15s ease;
        }

        .btn-login-submit:hover:not(:disabled) {
          background: #0d3153;
        }

        .demo-access-box {
          background: #eff6ff;
          border: 1px dashed #93c5fd;
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
          color: var(--navy);
          margin-bottom: 0.35rem;
        }

        .demo-sparkle {
          color: #d97706;
        }

        .demo-access-box p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 0.85rem;
        }

        .btn-demo-fast {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          color: var(--navy);
          font-weight: 700;
          padding: 0.65rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.15s ease;
        }

        .btn-demo-fast:hover {
          background: #dbeafe;
          border-color: #93c5fd;
        }

        .full-width {
          width: 100%;
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
          transition: color 0.15s ease;
        }

        .btn-back-home:hover {
          color: var(--navy);
        }

        @media (max-width: 640px) {
          .admin-login-page {
            padding: 2rem 0;
            min-height: auto;
          }
          .login-card {
            padding: 1.5rem 1rem;
            border-radius: var(--radius-md);
          }
          .login-header h2 {
            font-size: 1.15rem;
          }
          .btn-login-submit, .btn-demo-fast {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
