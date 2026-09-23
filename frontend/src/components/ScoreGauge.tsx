import React, { useEffect, useState, useRef } from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  band: string;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  maxScore = 900,
  band,
  size = 260,
}) => {
  const [displayScore, setDisplayScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG gauge dimensions
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270-degree sweep arc (3/4 of circle)
  const arcLength = circumference * 0.75;

  // Scroll detection via IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animated arc offset based on displayScore
  const clampedDisplayScore = Math.max(0, Math.min(displayScore, maxScore));
  const progressRatio = clampedDisplayScore / maxScore;
  const progressOffset = arcLength * (1 - progressRatio);

  // Smooth Count-Up Animation (runs only once scrolled into view)
  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const duration = 1800; // 1.8 seconds smooth sweep
    const targetScore = Math.max(0, Math.min(score, maxScore));

    setIsCompleted(false);

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic: fast initial count, gentle landing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetScore * easeOut);

      setDisplayScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayScore(targetScore);
        setIsCompleted(true);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [score, maxScore, hasStarted]);

  // Dynamic band calculation during count-up
  const getCurrentBand = (currentScore: number, finalBand: string) => {
    if (currentScore >= 750) return 'Excellent';
    if (currentScore >= 650) return 'Good';
    if (currentScore >= 500) return 'Fair';
    if (currentScore > 0) return 'Poor';
    return finalBand;
  };

  const activeBand = isCompleted ? band : getCurrentBand(displayScore, band);

  // Band color mapping
  const getBandStyles = (b: string) => {
    const lower = b.toLowerCase();
    if (lower.includes('excellent')) {
      return {
        text: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
        glow: 'drop-shadow-[0_0_16px_rgba(6,182,212,0.7)]',
        stroke: '#06b6d4',
      };
    }
    if (lower.includes('good')) {
      return {
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        glow: 'drop-shadow-[0_0_16px_rgba(16,185,129,0.7)]',
        stroke: '#10b981',
      };
    }
    if (lower.includes('fair')) {
      return {
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        glow: 'drop-shadow-[0_0_16px_rgba(245,158,11,0.7)]',
        stroke: '#f59e0b',
      };
    }
    return {
      text: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      glow: 'drop-shadow-[0_0_16px_rgba(244,63,94,0.7)]',
      stroke: '#f43f5e',
    };
  };

  const styles = getBandStyles(activeBand);

  // Calculate tip position in rotated coordinates
  const sweepAngleDeg = 270 * progressRatio;
  const sweepAngleRad = (sweepAngleDeg * Math.PI) / 180;
  const tipX = size / 2 + radius * Math.cos(sweepAngleRad);
  const tipY = size / 2 + radius * Math.sin(sweepAngleRad);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center p-4 select-none">
      <svg
        width={size}
        height={size}
        className="transform -rotate-135"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="45%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <filter id="tipGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#131b2e"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Active Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          className={styles.glow}
        />

        {/* Glowing Head / Tip of Arc */}
        {progressRatio > 0.02 && (
          <circle
            cx={tipX}
            cy={tipY}
            r={strokeWidth / 2.5}
            fill="#ffffff"
            filter="url(#tipGlow)"
            className="transition-opacity duration-300"
          />
        )}
      </svg>

      {/* Center Animated Score Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none">
        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          Inclusion Score
        </span>

        <div className="flex items-baseline space-x-1 my-1">
          <span
            className={`text-5xl font-black tracking-tight font-sans transition-transform duration-300 ${
              isCompleted ? 'text-white scale-100' : 'text-cyan-200 scale-105'
            }`}
          >
            {displayScore}
          </span>
          <span className="text-lg font-medium text-slate-500">
            /{maxScore}
          </span>
        </div>

        <div
          className={`mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border transition-all duration-300 ${styles.badge}`}
        >
          {activeBand}
        </div>
      </div>
    </div>
  );
};
