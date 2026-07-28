import React from 'react';
import { ShieldCheck, Sparkles, Zap, Shield } from 'lucide-react';

export const AnimatedHeading = ({
  children,
  as: Component = 'h2',
  variant = 'shimmer',
  className = '',
  style = {},
  ...props
}) => {
  if (variant === 'marquee') {
    const SeparatorIcon = () => (
      <span className="inline-flex items-center justify-center space-x-2 px-2">
        <span className="w-8 h-8 rounded-full bg-rose/15 border border-rose/30 flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-4.5 h-4.5 text-rose stroke-[2.5px]" />
        </span>
        <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
      </span>
    );

    return (
      <div className={`overflow-hidden whitespace-nowrap w-full py-2 ${className}`} style={style} {...props}>
        <div className="animate-marquee flex items-center space-x-8">
          <span className="font-black text-rose tracking-tight flex items-center space-x-6">
            <span>{children}</span>
            <SeparatorIcon />
            <span>{children}</span>
            <SeparatorIcon />
          </span>
          <span className="font-black text-rose tracking-tight flex items-center space-x-6">
            <span>{children}</span>
            <SeparatorIcon />
            <span>{children}</span>
            <SeparatorIcon />
          </span>
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`font-black text-tichi-text ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AnimatedHeading;
