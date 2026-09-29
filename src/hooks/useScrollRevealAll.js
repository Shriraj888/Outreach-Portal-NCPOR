import { useEffect, useRef, useCallback } from 'react';

/**
 * useScrollRevealAll — observes ALL `.reveal` children inside a container.
 * Each child independently receives `.visible` when it enters the viewport.
 * Supports stagger delays via CSS custom property `--delay` set on each child.
 *
 * Usage:
 *   const containerRef = useScrollRevealAll();
 *   <div ref={containerRef}>
 *     {items.map((item, i) => (
 *       <div key={i} className="reveal" style={{ '--delay': `${i * 80}ms` }}>…</div>
 *     ))}
 *   </div>
 */
export default function useScrollRevealAll(options = {}) {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const setupObserver = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
      return;
    }

    // Disconnect previous observer if re-running
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -30px 0px',
      }
    );

    container.querySelectorAll('.reveal').forEach((el) => {
      if (!el.classList.contains('visible')) {
        observerRef.current.observe(el);
      }
    });
  }, [options.threshold, options.rootMargin]);

  useEffect(() => {
    setupObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  return containerRef;
}
