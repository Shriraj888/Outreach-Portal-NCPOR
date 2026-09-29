import { useEffect, useRef, useCallback } from 'react';

const REVEAL_SELECTOR = '.reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right';

/**
 * useScrollRevealAll — observes ALL `.reveal` children inside a container.
 * Automatically handles dynamically loaded items (API responses, tabs, filters, pagination)
 * using a MutationObserver so dynamically injected content never stays hidden at opacity: 0.
 *
 * Includes dual-detection via IntersectionObserver and scroll/viewport checking to ensure
 * reliable revelation even with smooth scroll libraries (Lenis), asynchronous data fetching,
 * or immediate viewport rendering.
 */
export default function useScrollRevealAll(options = {}) {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const observeElements = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion preference: immediately reveal all
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('visible'));
      return;
    }

    if (!observerRef.current && typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: options.threshold ?? 0.05,
          rootMargin: options.rootMargin ?? '0px 0px -20px 0px',
        }
      );
    }

    // Find all unrevealed elements in the container
    const unrevealed = container.querySelectorAll(
      '.reveal:not(.visible), .reveal-fade:not(.visible), .reveal-scale:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
    );

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    unrevealed.forEach((el) => {
      // Check if element is already within the viewport or slightly above it
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < windowHeight && rect.bottom > 0;

      if (inViewport) {
        el.classList.add('visible');
        if (observerRef.current) {
          observerRef.current.unobserve(el);
        }
      } else if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });
  }, [options.threshold, options.rootMargin]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial check
    observeElements();

    // Scroll & resize listener fallback for smooth scrolling engines
    const handleScrollOrResize = () => {
      observeElements();
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Setup MutationObserver so ANY dynamically loaded items (API responses, search filters, tabs) reveal automatically
    let mutationObserver = null;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        observeElements();
      });

      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [observeElements]);

  return containerRef;
}
