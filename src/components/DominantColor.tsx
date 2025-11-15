"use client";

import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

interface DominantColorProps {
  imageSrc: string;
}

// Helper to convert RGB array to HSL string
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function DominantColor({ imageSrc }: DominantColorProps) {
  const [gradient, setGradient] = useState<string | null>(null);

  useEffect(() => {
    if (!imageSrc) return;

    const colorThief = new ColorThief();
    const img = new Image();
    // Use a CORS proxy to prevent tainted canvas errors
    img.crossOrigin = 'Anonymous';
    img.src = `https://images.weserv.nl/?url=${encodeURIComponent(imageSrc)}`;

    img.onload = () => {
      try {
        const dominantColor = colorThief.getColor(img);
        const [h, s, l] = rgbToHsl(dominantColor[0], dominantColor[1], dominantColor[2]);
        
        // Make the color darker and less saturated for a subtle background
        const bgHue = h;
        const bgSaturation = Math.max(0, s - 30);
        const bgLightness = Math.min(20, l * 0.4);

        const newGradient = `linear-gradient(180deg, hsl(${bgHue}, ${bgSaturation}%, ${bgLightness}%) 0%, transparent 50%)`;
        setGradient(newGradient);
      } catch (e) {
        console.error('Error getting dominant color', e);
        setGradient(null);
      }
    };
    img.onerror = (e) => {
        console.error('Error loading image for color thief', e);
        setGradient(null);
    }
  }, [imageSrc]);

  useEffect(() => {
    if (gradient) {
      document.body.style.setProperty('--dynamic-gradient', gradient);
      document.body.classList.add('has-dynamic-bg');
    }

    // Cleanup function to remove the style when the component unmounts or image changes
    return () => {
      document.body.classList.remove('has-dynamic-bg');
      document.body.style.removeProperty('--dynamic-gradient');
    };
  }, [gradient]);

  // This component doesn't render any UI itself
  return null;
}
