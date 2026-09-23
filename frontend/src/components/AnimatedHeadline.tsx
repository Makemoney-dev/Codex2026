import React, { useEffect, useState } from 'react';

interface AnimatedHeadlineProps {
  className?: string;
}

export const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({ className = '' }) => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Hide typing cursor after entrance animation completes
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const segments = [
    { text: 'Credit', delay: 0 },
    { text: 'scoring', delay: 70 },
    { text: 'for', delay: 140 },
    { text: 'the', delay: 210 },
    {
      text: 'financially active',
      delay: 320,
      highlight: true,
    },
    { text: ', ', delay: 420, isPunctuation: true },
    { text: 'not', delay: 490 },
    { text: 'just', delay: 560 },
    { text: 'the', delay: 630 },
    { text: 'credit-visible.', delay: 720 },
  ];

  return (
    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.highlight) {
          return (
            <span
              key={idx}
              className="inline-block animate-word-reveal"
              style={{ animationDelay: `${seg.delay}ms` }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 animate-gradient-shift drop-shadow-[0_0_24px_rgba(6,182,212,0.4)] font-black mr-2">
                {seg.text}
              </span>
            </span>
          );
        }

        if (seg.isPunctuation) {
          return (
            <span
              key={idx}
              className="inline-block animate-word-reveal mr-2 text-slate-300"
              style={{ animationDelay: `${seg.delay}ms` }}
            >
              {seg.text.trim()}
            </span>
          );
        }

        return (
          <span
            key={idx}
            className="inline-block animate-word-reveal mr-2"
            style={{ animationDelay: `${seg.delay}ms` }}
          >
            {seg.text}
          </span>
        );
      })}

      {showCursor && (
        <span className="inline-block w-1 h-8 sm:h-10 lg:h-12 bg-cyan-400 ml-1 translate-y-1 sm:translate-y-1.5 animate-cursor rounded-full shadow-glow-cyan align-middle" />
      )}
    </h1>
  );
};
