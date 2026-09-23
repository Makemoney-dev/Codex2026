import React from 'react';
import { useInView } from '../hooks/useInView';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px',
    triggerOnce: true,
  });

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-8';
      case 'down':
        return '-translate-y-8';
      case 'left':
        return 'translate-x-8';
      case 'right':
        return '-translate-x-8';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '700ms',
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) ${
        isInView
          ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
          : `opacity-0 ${getTransform()} scale-[0.98]`
      } ${className}`}
    >
      {children}
    </div>
  );
};
