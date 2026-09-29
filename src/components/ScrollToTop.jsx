import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollY / docHeight) * 100)) : 0;

      setScrollProgress(progress);
      setVisible(scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(0, { duration: 1.15 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  if (!visible) return null;

  // SVG circular progress calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      <button
        className="scroll-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
        title="Scroll to top"
      >
        <svg className="scroll-progress-ring" width="46" height="46" viewBox="0 0 46 46">
          <circle
            className="scroll-progress-ring-bg"
            cx="23"
            cy="23"
            r={radius}
            strokeWidth="2.5"
          />
          <circle
            className="scroll-progress-ring-fill"
            cx="23"
            cy="23"
            r={radius}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="scroll-to-top-icon">
          <ArrowUp size={18} strokeWidth={2.4} />
        </span>
      </button>

      <style>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 95;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid var(--border-subtle, #cbd5e1);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s ease,
                      background-color 0.2s ease;
          animation: scrollToTopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          padding: 0;
          outline: none;
        }

        @keyframes scrollToTopIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .scroll-to-top-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18), 0 2px 6px rgba(15, 23, 42, 0.1);
          background: #f8fafc;
        }

        .scroll-to-top-btn:active {
          transform: translateY(0) scale(0.96);
        }

        .scroll-to-top-btn:focus-visible {
          outline: 2px solid var(--emerald, #059669);
          outline-offset: 2px;
        }

        .scroll-progress-ring {
          position: absolute;
          inset: 0;
          transform: rotate(-90deg);
          pointer-events: none;
        }

        .scroll-progress-ring-bg {
          fill: none;
          stroke: #e2e8f0;
        }

        .scroll-progress-ring-fill {
          fill: none;
          stroke: var(--emerald, #059669);
          stroke-linecap: round;
          transition: stroke-dashoffset 0.15s ease-out;
        }

        .scroll-to-top-icon {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy, #0f172a);
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .scroll-to-top-btn:hover .scroll-to-top-icon {
          color: var(--emerald, #059669);
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .scroll-to-top-btn {
            bottom: 1.25rem;
            right: 1.25rem;
            width: 42px;
            height: 42px;
          }
          .scroll-progress-ring {
            width: 42px;
            height: 42px;
            viewBox: 0 0 42 42;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-to-top-btn {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
