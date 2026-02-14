'use client';

import { trackEvent } from '@/lib/analytics';
import { hasOrdering, siteConfig, getOrderLabel } from '@/lib/siteConfig';
import type { SiteConfig } from '@/lib/schemas';

interface StickyActionBarProps {
  siteConfig: SiteConfig;
}

export default function StickyActionBar({ siteConfig: siteCfg }: StickyActionBarProps) {
  const { phone, address } = siteCfg;

  const handleCall = () => {
    trackEvent('cta_call_click');
  };

  const handleDirections = () => {
    trackEvent('cta_directions_click');
  };

  const handleOrder = () => {
    trackEvent('order_click_stickybar');
  };

  const handleMenu = () => {
    trackEvent('cta_menu_click');
  };

  const directionsUrl = siteCfg.googleMapsUrl || 
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${address.street}, ${address.city}, ${address.state} ${address.zip}`
    )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-oak-brown border-t border-gold/30 shadow-lg z-50 no-print">
      <div className="grid grid-cols-4 gap-0">
        {/* Call */}
        <a
          href={`tel:${phone}`}
          onClick={handleCall}
          className="flex flex-col items-center justify-center py-4 hover:bg-warm-charcoal active:bg-warm-charcoal transition-colors"
        >
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-xs mt-1 font-semibold text-cream">CALL</span>
        </a>

        {/* Directions */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDirections}
          className="flex flex-col items-center justify-center py-4 hover:bg-warm-charcoal active:bg-warm-charcoal transition-colors"
        >
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs mt-1 font-semibold text-cream">DIRECTIONS</span>
        </a>

        {/* Menu */}
        <a
          href="/menu"
          onClick={handleMenu}
          className="flex flex-col items-center justify-center py-4 hover:bg-warm-charcoal active:bg-warm-charcoal transition-colors"
        >
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1 font-semibold text-cream">MENU</span>
        </a>

        {/* Order or Hours */}
        {hasOrdering ? (
          <a
            href={siteConfig.orderOnlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOrder}
            className="flex flex-col items-center justify-center py-4 hover:bg-warm-charcoal active:bg-warm-charcoal transition-colors"
          >
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs mt-1 font-semibold text-cream">ORDER</span>
          </a>
        ) : (
          <a
            href="/contact"
            className="flex flex-col items-center justify-center py-4 hover:bg-warm-charcoal active:bg-warm-charcoal transition-colors"
          >
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1 font-semibold text-cream">HOURS</span>
          </a>
        )}
      </div>
    </div>
  );
}
