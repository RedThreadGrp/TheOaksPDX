import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getSiteConfig } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StickyActionBar from '@/components/StickyActionBar'

export const metadata: Metadata = {
  title: 'The Oaks Pub PDX',
  description: 'Neighborhood pub in Portland, Oregon serving great food and drinks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteConfig = getSiteConfig();
  
  return (
    <html lang="en">
      <body className="font-sans antialiased">
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
