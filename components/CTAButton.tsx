'use client';

import { trackEvent } from '@/lib/analytics';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  eventName?: string;
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  onClick,
  eventName,
}: CTAButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-[#1f5f3a] text-[#f5f2ec] hover:bg-[#267348] focus:ring-deep-green shadow-lg tracking-wide px-10 py-4 text-lg',
    secondary: 'bg-oak-brown text-[#f5f2ec] hover:bg-warm-charcoal focus:ring-oak-brown shadow-md hover:shadow-lg px-8 py-3 text-base md:text-lg',
    outline: 'border-2 border-[#f5f2ec] text-[#f5f2ec] hover:bg-[#f5f2ec] hover:text-oak-brown focus:ring-[#f5f2ec] backdrop-blur-sm px-8 py-3 text-base md:text-lg',
  };

  const handleClick = () => {
    if (eventName) {
      trackEvent(eventName as any);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
