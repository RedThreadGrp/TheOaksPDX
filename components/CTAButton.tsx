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
  const baseStyles = 'inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-base md:text-lg';
  
  const variantStyles = {
    primary: 'bg-deep-green text-white hover:bg-primary-700 focus:ring-deep-green shadow-md hover:shadow-lg',
    secondary: 'bg-oak-brown text-white hover:bg-warm-charcoal focus:ring-oak-brown shadow-md hover:shadow-lg',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-oak-brown focus:ring-white backdrop-blur-sm',
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
