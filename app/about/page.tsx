import { getSiteConfig } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | The Oaks Pub PDX',
  description: 'Learn about The Oaks Pub PDX - your neighborhood pub in Southeast Portland.',
};

export default function AboutPage() {
  const siteConfig = getSiteConfig();

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About Us</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            {siteConfig.description}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-6">
            Located in the heart of the Sellwood-Moreland neighborhood, The Oaks Pub PDX has been
            serving the community with great food, craft drinks, and a welcoming atmosphere.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            {siteConfig.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-primary-600 text-xl">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Visit Us</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong><br />
              {siteConfig.address.street}<br />
              {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong>{' '}
              <a href={`tel:${siteConfig.phone}`} className="text-primary-600 hover:text-primary-700">
                {siteConfig.phone}
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong>{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-primary-600 hover:text-primary-700">
                {siteConfig.email}
              </a>
            </p>
          </div>

          <p className="text-center text-gray-600 mt-8">
            We look forward to seeing you at The Oaks Pub PDX!
          </p>
        </div>
      </div>
    </div>
  );
}
