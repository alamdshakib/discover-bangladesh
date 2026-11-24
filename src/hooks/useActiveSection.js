import { useEffect, useState } from 'react';

/**
 * Tracks which section (by element id) currently occupies the reading band of the viewport.
 * Returns null when none of the sections are in view or when disabled.
 */
export function useActiveSection(ids, { enabled = true, rootMargin = '-40% 0px -55% 0px' } = {}) {
  const [activeId, setActiveId] = useState(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled) return undefined;

    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return undefined;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        });
        if (visible.size === 0) {
          setActiveId(null);
          return;
        }
        const [topMost] = [...visible.entries()].sort((a, b) => a[1] - b[1]);
        setActiveId(topMost[0]);
      },
      { rootMargin, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      setActiveId(null);
    };
  }, [key, enabled, rootMargin]);

  return enabled ? activeId : null;
}
