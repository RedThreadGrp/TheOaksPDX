import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Oaks Pub PDX',
  description: 'Privacy policy for The Oaks Pub PDX website.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <p className="text-sm text-gray-500 mb-8">Last updated: February 13, 2026</p>

        <h2>Information We Collect</h2>
        <p>
          When you use our website or contact us through our forms, we may collect personal
          information such as your name, email address, and any message content you provide.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your inquiries and requests</li>
          <li>Improve our website and services</li>
          <li>Send you information about our restaurant (only if you opt in)</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties.
          This does not include trusted third parties who assist us in operating our website or
          conducting our business, as long as those parties agree to keep this information
          confidential.
        </p>

        <h2>Cookies and Analytics</h2>
        <p>
          We use cookies and analytics tools to understand how visitors use our website. This
          helps us improve your experience. You can choose to disable cookies through your browser
          settings.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:info@theoakspubpdx.com">info@theoakspubpdx.com</a> or call{' '}
          <a href="tel:503-232-1728">503-232-1728</a>.
        </p>
      </div>
    </div>
  );
}
