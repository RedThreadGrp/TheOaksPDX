import { getSiteConfig } from '@/lib/content';
import { hasOrdering, siteConfig as orderingConfig, getOrderLabel } from '@/lib/siteConfig';
import ContactForm from './ContactForm';
import { formatHours, formatDayName } from '@/lib/hours';
import type { DayOfWeek } from '@/lib/hours';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | The Oaks Pub PDX',
  description: 'Get in touch with The Oaks Pub PDX. Find our location, hours, and contact information.',
};

export default function ContactPage() {
  const siteConfig = getSiteConfig();
  const { address, phone, email, hours } = siteConfig;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    {address.street}<br />
                    {address.city}, {address.state} {address.zip}
                  </p>
                  {siteConfig.googleMapsUrl ? (
                    <a
                      href={siteConfig.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                    >
                      Get Directions →
                    </a>
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${address.street}, ${address.city}, ${address.state} ${address.zip}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                    >
                      Get Directions →
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href={`tel:${phone}`} className="text-primary-600 hover:text-primary-700">
                    {phone}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href={`mailto:${email}`} className="text-primary-600 hover:text-primary-700">
                    {email}
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hours</h2>
              <div className="space-y-2">
                {Object.entries(hours).map(([day, dayHours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      {formatDayName(day as DayOfWeek)}
                    </span>
                    <span className="text-gray-600">{formatHours(dayHours)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Online Ordering Section */}
            <section className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Online Ordering</h2>
              {hasOrdering ? (
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Pickup ordering available online.
                  </p>
                  <p className="text-gray-700">
                    For changes or special requests, please call us at{' '}
                    <a href={`tel:${phone}`} className="text-primary-600 hover:text-primary-700 font-semibold">
                      {phone}
                    </a>
                  </p>
                  <div className="pt-2">
                    <a
                      href={orderingConfig.orderOnlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-deep-green text-cream font-semibold rounded-lg hover:bg-oak-brown transition-colors"
                    >
                      {getOrderLabel()}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Pickup orders available by phone:
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="inline-block text-xl font-bold text-deep-green hover:text-oak-brown"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </section>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>

        {/* Map */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Find Us</h2>
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(
                `${address.street}, ${address.city}, ${address.state} ${address.zip}`
              )}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location map"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">
            Free parking available. Near public transit.
          </p>
        </section>
      </div>
    </div>
  );
}
