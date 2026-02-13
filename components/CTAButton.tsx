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
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
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
