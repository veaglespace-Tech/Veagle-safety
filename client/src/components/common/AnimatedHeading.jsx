import React from 'react';

export const AnimatedHeading = ({
  children,
  as: Component = 'h2',
  variant = 'shimmer', // 'shimmer' | 'gold-shimmer' | 'glow' | 'reveal' | 'gradient' | 'marquee'
  className = '',
  style = {},
  speed = '22s',
  ...props
}) => {
  if (variant === 'marquee') {
    return (
      <div className={`overflow-hidden whitespace-nowrap w-full py-2 ${className}`} style={style} {...props}>
        <div className="animate-marquee flex items-center space-x-8">
          <span className="text-shimmer-animated font-black tracking-tight flex items-center space-x-6">
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
          </span>
          <span className="text-shimmer-animated font-black tracking-tight flex items-center space-x-6">
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
          </span>
        </div>
      </div>
    );
  }

  let variantClass = '';

  switch (variant) {
    case 'shimmer':
      variantClass = 'text-shimmer-animated text-glow-animated';
      break;
    case 'gold-shimmer':
      variantClass = 'text-gold-shimmer-animated text-glow-animated';
      break;
    case 'glow':
      variantClass = 'text-baby-pink-gradient text-glow-animated';
      break;
    case 'gradient':
      variantClass = 'text-baby-pink-gradient';
      break;
    case 'reveal':
      variantClass = 'animate-title-reveal';
      break;
    default:
      variantClass = 'text-shimmer-animated';
  }

  return (
    <Component
      className={`animate-title-reveal ${variantClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AnimatedHeading;
