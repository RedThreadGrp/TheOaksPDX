import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | The Oaks Pub PDX',
  description: 'Terms of service for The Oaks Pub PDX website.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <p className="text-sm text-gray-500 mb-8">Last updated: February 13, 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound by the terms and
          provision of this agreement.
        </p>

        <h2>Use of Website</h2>
        <p>
          This website is provided for informational purposes about The Oaks Pub PDX. The content
          on this site, including but not limited to menu items, prices, and hours, is subject to
          change without notice.
        </p>

        <h2>Menu and Pricing</h2>
        <p>
          While we strive to keep our online menu accurate and up-to-date, menu items,
          descriptions, and prices are subject to change. Please contact us directly to confirm
          current offerings and prices.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, and images, is the
          property of The Oaks Pub PDX and protected by copyright laws.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          The Oaks Pub PDX shall not be liable for any direct, indirect, incidental, consequential,
          or punitive damages arising from your use of this website or any errors or omissions in
          its content.
        </p>

        <h2>Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:info@theoakspubpdx.com">info@theoakspubpdx.com</a> or call{' '}
          <a href="tel:503-232-1728">503-232-1728</a>.
        </p>
      </div>
    </div>
  );
}
