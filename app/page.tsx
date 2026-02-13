import { getSiteConfig } from '@/lib/content';
import OpenNowBadge from '@/components/OpenNowBadge';
import CTAButton from '@/components/CTAButton';
import { getTodayHours, formatHours } from '@/lib/hours';

export default function HomePage() {
  const siteConfig = getSiteConfig();
  const todayHours = getTodayHours(siteConfig.hours);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {siteConfig.businessName}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            {siteConfig.tagline}
          </p>
          <div className="flex justify-center mb-8">
            <OpenNowBadge hours={siteConfig.hours} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/menu" variant="primary">
              View Menu
            </CTAButton>
            <CTAButton href="/contact" variant="outline">
              Contact Us
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">
                {siteConfig.address.street}<br />
                {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a href={`tel:${siteConfig.phone}`} className="text-primary-600 hover:text-primary-700">
                {siteConfig.phone}
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hours Today</h3>
              <p className="text-gray-600">
                {formatHours(todayHours)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Neighborhood Pub
          </h2>
          <p className="text-lg text-gray-600">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Features */}
      {siteConfig.features.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What We Offer
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {siteConfig.features.map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="font-medium text-gray-900">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
