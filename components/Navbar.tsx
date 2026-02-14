'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/content';
import { hasOrdering, siteConfig as orderingConfig, getOrderLabel } from '@/lib/siteConfig';
import { trackEvent } from '@/lib/analytics';

interface NavbarProps {
  siteConfig: ReturnType<typeof getSiteConfig>;
}

export default function Navbar({ siteConfig }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/menu', label: 'Menu' },
    { href: '/drinks', label: 'Drinks' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleOrderClick = () => {
    trackEvent('order_click_header');
  };

  return (
    <nav className="sticky top-0 z-50 bg-oak-brown/95 backdrop-blur-sm border-b border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-cream hover:text-gold transition-colors">
            {siteConfig.businessName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Order Link (conditionally displayed) */}
            {hasOrdering ? (
              <a
                href={orderingConfig.orderOnlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                className="text-gold hover:text-cream font-semibold transition-colors"
              >
                {getOrderLabel()}
              </a>
            ) : (
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={handleOrderClick}
                className="text-gold hover:text-cream font-semibold transition-colors"
              >
                Call to Order
              </a>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream hover:text-gold font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-cream hover:text-gold transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold/20">
            {/* Order Link as first item in mobile menu */}
            {hasOrdering ? (
              <a
                href={orderingConfig.orderOnlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleOrderClick();
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-gold hover:text-cream font-semibold transition-colors"
              >
                {getOrderLabel()}
              </a>
            ) : (
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={() => {
                  handleOrderClick();
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-gold hover:text-cream font-semibold transition-colors"
              >
                Call to Order
              </a>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-cream hover:text-gold font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
