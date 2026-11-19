import {useEffect, useState} from 'react';

interface PreloaderProps {
  studioName: string;
}

export function Preloader({studioName}: PreloaderProps) {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (removed) return;

    const fadeTimer = window.setTimeout(() => setFading(true), 680);
    const removeTimer = window.setTimeout(() => setRemoved(true), 1020);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [removed]);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0D] text-[#F4F4F2] transition-opacity duration-300 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6">
        {/* Precision hexagonal ceramic emblem */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-16 w-16 text-[#D8A44C]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="32,4 56,18 56,46 32,60 8,46 8,18"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <polygon
              points="32,12 49,22 49,42 32,52 15,42 15,22"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M23 36L28.5 24H35.5L41 36M26.5 31.5H37.5"
              stroke="#F4F4F2"
              strokeWidth="1.75"
              strokeLinecap="square"
            />
          </svg>
        </div>

        <div className="text-center">
          <p className="font-display text-lg font-semibold tracking-tight text-[#F4F4F2]">
            {studioName}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Islamabad · 9H Ceramic & Paint Correction
          </p>
        </div>

        <div className="h-[2px] w-48 overflow-hidden bg-white/10">
          <div className="animate-preloader-bar h-full w-full bg-[#D8A44C]" />
        </div>
      </div>
    </div>
  );
}
