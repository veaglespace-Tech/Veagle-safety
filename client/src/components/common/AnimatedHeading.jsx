import React from 'react';

export const AnimatedHeading = ({
  children,
  as: Component = 'h2',
  variant = 'shimmer',
  className = '',
  style = {},
  ...props
}) => {
  if (variant === 'marquee') {
    return (
      <div className={`overflow-hidden whitespace-nowrap w-full py-2 ${className}`} style={style} {...props}>
        <div className="animate-marquee flex items-center space-x-8">
          <span className="font-black text-rose tracking-tight flex items-center space-x-6">
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
          </span>
          <span className="font-black text-rose tracking-tight flex items-center space-x-6">
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
            <span>{children}</span>
            <span className="text-[#FF5C8A]">✦</span>
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
