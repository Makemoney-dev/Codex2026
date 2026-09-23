import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatCommas?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1400,
  prefix = '',
  suffix = '',
  decimals = 0,
  formatCommas = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const prevValueRef = useRef<number>(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Scroll detection via IntersectionObserver
  useEffect(() => {
    const el = spanRef.current;
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
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation runs only once scrolled into view
  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const startValue = prevValueRef.current;
    const targetValue = value;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
        prevValueRef.current = targetValue;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, hasStarted]);

  const formattedNumber = (() => {
    let formatted = displayValue.toFixed(decimals);
    if (formatCommas) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }
    return formatted;
  })();

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

