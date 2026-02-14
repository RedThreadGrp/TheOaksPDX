import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getSiteConfig } from '@/lib/content'
import { generateRestaurantSchema, generateJSONLD } from '@/lib/schema'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StickyActionBar from '@/components/StickyActionBar'
import UnifiedTicker from '@/components/UnifiedTicker'
import { getTickerData } from '@/lib/ticker-data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.theoakspubpdx.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'The Oaks Pub PDX | Neighborhood Pub in Southeast Portland',
    template: '%s | The Oaks Pub PDX',
  },
  description: 'Your neighborhood pub in Southeast Portland serving great food, craft drinks, and good times in Sellwood-Moreland.',
  keywords: ['pub', 'restaurant', 'Portland', 'Sellwood', 'Moreland', 'craft beer', 'food', 'drinks', 'happy hour'],
  authors: [{ name: 'The Oaks Pub PDX' }],
  creator: 'The Oaks Pub PDX',
  publisher: 'The Oaks Pub PDX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'The Oaks Pub PDX | Neighborhood Pub in Southeast Portland',
    description: 'Your neighborhood pub in Southeast Portland serving great food, craft drinks, and good times.',
    siteName: 'The Oaks Pub PDX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Oaks Pub PDX',
    description: 'Your neighborhood pub in Southeast Portland',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteConfig = getSiteConfig();
  const restaurantSchema = generateRestaurantSchema(siteConfig, siteUrl);
  const jsonLd = generateJSONLD(restaurantSchema);
  
  // Fetch ticker data server-side
  const tickerItems = await getTickerData();
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className="font-sans antialiased">
        <UnifiedTicker tickerItems={tickerItems} />
        <Navbar siteConfig={siteConfig} />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer siteConfig={siteConfig} />
        <StickyActionBar siteConfig={siteConfig} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
