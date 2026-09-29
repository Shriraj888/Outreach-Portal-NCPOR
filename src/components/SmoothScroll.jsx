import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * SmoothScroll component initializes and coordinates Lenis smooth inertia momentum scrolling
 * across all pages of the portal.
 *
 * Features:
 * - Exponential decay easing for fluid, buttery-smooth mouse wheel & trackpad scrolling
 * - Preserves 100% natural, responsive 120Hz native touch gestures on mobile devices
 * - Respects prefers-reduced-motion for accessibility
 * - Automatically pauses when modals or mobile menus set body overflow to hidden
 * - Smoothly scrolls to top on route change
 * - Allows nested horizontal and modal scrolling without blocking
 */
export default function SmoothScroll({ currentRoute }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false, // Retain native touch momentum on iOS & Android
      autoResize: true,
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Observe body overflow changes (e.g. mobile navigation drawer, modal dialogs)
    const observer = new MutationObserver(() => {
      const isBodyLocked = document.body.style.overflow === 'hidden';
      if (isBodyLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observer.disconnect();
      lenis.destroy();
      if (window.lenis === lenis) {
        delete window.lenis;
      }
    };
  }, []);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false, duration: 0.7 });
    }
  }, [currentRoute]);

  return null;
}
