import React from 'react';

export const AnimatedHeading = ({
  children,
  as: Component = 'h2',
  variant = 'shimmer', // 'shimmer' | 'gold-shimmer' | 'glow' | 'reveal' | 'gradient'
  className = '',
  style = {},
  ...props
}) => {
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
