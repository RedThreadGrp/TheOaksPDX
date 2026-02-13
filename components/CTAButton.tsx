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
    primary: 'bg-[#1f5f3a] text-cream hover:bg-[#267348] focus:ring-deep-green shadow-lg tracking-wide py-4 px-12 text-lg md:text-xl',
    secondary: 'bg-oak-brown text-cream hover:bg-warm-charcoal focus:ring-oak-brown shadow-md hover:shadow-lg py-4 px-8 text-base',
    outline: 'border-2 border-cream text-cream hover:bg-cream hover:text-oak-brown focus:ring-cream backdrop-blur-sm py-4 px-8 text-base',
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
