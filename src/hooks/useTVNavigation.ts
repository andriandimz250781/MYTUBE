
"use client";
import { useEffect } from "react";

export function useTVNavigation(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-tv-item]"));
    if (items.length === 0) return;

    let idx = 0;
    function setFocus(i: number) {
      idx = Math.max(0, Math.min(items.length - 1, i));
      items[idx].focus();
      items[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { setFocus(idx + 1); e.preventDefault(); }
      if (e.key === "ArrowUp")   { setFocus(idx - 1); e.preventDefault(); }
      // We are in a vertical list, left/right aren't very useful here.
      // if (e.key === "ArrowLeft") { setFocus(idx - 1); e.preventDefault(); }
      // if (e.key === "ArrowRight"){ setFocus(idx + 1); e.preventDefault(); }
      
      // Let the element's own keydown handler deal with Enter.
    };

    window.addEventListener("keydown", onKey);
    setTimeout(()=> setFocus(0), 500); // Set initial focus
    
    return () => window.removeEventListener("keydown", onKey);
  }, [containerRef]);
}
