
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
      items.forEach(item => item.classList.remove('ring-4', 'ring-accent'));
      const currentItem = items[idx];
      currentItem.focus();
      currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentItem.classList.add('ring-4', 'ring-accent');
    }

    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement && !el.contains(document.activeElement) && !items.includes(document.activeElement as HTMLElement)) {
          // If focus is outside our list, bring it back
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
             setFocus(idx);
             e.preventDefault();
          }
      } else {
        if (e.key === "ArrowDown") { setFocus(idx + 1); e.preventDefault(); }
        if (e.key === "ArrowUp")   { setFocus(idx - 1); e.preventDefault(); }
      }
    };

    window.addEventListener("keydown", onKey);
    // Set initial focus after a short delay
    const initialFocusTimeout = setTimeout(()=> setFocus(0), 500); 
    
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(initialFocusTimeout);
    };
  }, [containerRef]);
}
