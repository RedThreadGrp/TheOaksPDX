import { getEvents, getSiteConfig } from '@/lib/content';
import { formatDayName } from '@/lib/hours';
import type { Metadata } from 'next';
import EventsList from './EventsList';

export const metadata: Metadata = {
  title: 'Events & Specials | The Oaks Pub PDX',
  description: 'Check out our weekly events, specials, and happy hour at The Oaks Pub PDX.',
};

export default function EventsPage() {
  const events = getEvents();
  const siteConfig = getSiteConfig();

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Events & Specials</h1>

        {/* Happy Hour */}
        {events.happyHour && events.happyHour.enabled && (
          <section className="mb-12 bg-primary-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Happy Hour</h2>
            <div className="mb-4">
              <p className="text-gray-700 font-medium">
                {events.happyHour.days.map(day => formatDayName(day)).join(', ')}
              </p>
              <p className="text-gray-700">
                {events.happyHour.startTime} - {events.happyHour.endTime}
              </p>
            </div>
            <p className="text-gray-700 mb-4">{events.happyHour.description}</p>
            {events.happyHour.items && events.happyHour.items.length > 0 && (
              <div className="space-y-2">
                {events.happyHour.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recurring Events */}
        {events.recurringEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Events</h2>
            <div className="grid gap-6">
              {events.recurringEvents.map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-primary-600 font-medium mb-2">
                    Every {formatDayName(event.dayOfWeek)} at {event.time}
                  </p>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events from Google Calendar */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          <EventsList 
            fallbackMessage={`Follow us on social media or call ${siteConfig.phone} for the latest updates.`}
          />
        </section>

        {/* Private Parties */}
        {events.privateParties.enabled && (
          <section className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Private Events</h2>
            <p className="text-gray-700 mb-6">{events.privateParties.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${events.privateParties.contactPhone}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Call {events.privateParties.contactPhone}
              </a>
              <a
                href={`mailto:${events.privateParties.contactEmail}`}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
