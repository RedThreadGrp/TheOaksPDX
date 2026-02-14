'use client';

import { hasOrdering, siteConfig, getOrderLabel } from '@/lib/siteConfig';
import { trackEvent, type EventName } from '@/lib/analytics';

interface OrderButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  source: 'header' | 'hero' | 'stickybar' | 'menu_banner' | 'drinks_banner';
  children?: React.ReactNode;
}

/**
 * OrderButton - Centralized component for "Order Online" CTAs
 * 
 * Behavior:
 * - If ordering URL is configured: displays "Order [Pickup/Delivery/Online]" link
 * - If no URL: displays "Call to Order" with tel: link fallback
 * - Tracks analytics based on source
 * - Opens in new tab for external links
 */
export default function OrderButton({
  variant = 'primary',
  className = '',
  source,
  children,
}: OrderButtonProps) {
  const getSiteConfig = () => {
    // Import dynamically to access phone number for fallback
    if (typeof window !== 'undefined') {
      return { phone: '503-232-1728' };
    }
    return { phone: '503-232-1728' };
  };

  const handleClick = () => {
    const eventMap: Record<typeof source, EventName> = {
      header: 'order_click_header',
      hero: 'order_click_hero',
      stickybar: 'order_click_stickybar',
      menu_banner: 'order_click_menu_banner',
      drinks_banner: 'order_click_drinks_banner',
    };
    
    trackEvent(eventMap[source]);
  };

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-[#1f5f3a] text-cream hover:bg-[#267348] focus:ring-deep-green shadow-lg tracking-wide py-4 px-12 text-lg md:text-xl',
    secondary: 'bg-oak-brown text-cream hover:bg-warm-charcoal focus:ring-oak-brown shadow-md hover:shadow-lg py-4 px-8 text-base',
    outline: 'border-2 border-cream text-cream hover:bg-cream hover:text-oak-brown focus:ring-cream backdrop-blur-sm py-4 px-8 text-base',
  };

  // Determine link and label based on ordering availability
  const orderingEnabled = hasOrdering;
  const href = orderingEnabled ? siteConfig.orderOnlineUrl : 'tel:503-232-1728';
  const label = children || (orderingEnabled ? getOrderLabel() : 'Call to Order');
  const isExternal = orderingEnabled;

  return (
    <a
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
    >
      {label}
    </a>
  );
}
