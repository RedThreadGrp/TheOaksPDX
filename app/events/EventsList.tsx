'use client';

import { useState, useEffect } from 'react';
import type { ParsedEvent } from '@/lib/ics-parser';

interface EventsListProps {
  fallbackMessage?: string;
}

export default function EventsList({ fallbackMessage }: EventsListProps) {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          setError(data.error || 'Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 mb-4">{error}</p>
        <p className="text-gray-600">
          {fallbackMessage || 'Please check back later or call us for the latest updates.'}
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">
          No upcoming events scheduled at the moment.
        </p>
        <p className="text-gray-600">
          {fallbackMessage || 'Check back soon for upcoming events!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

interface EventCardProps {
  event: ParsedEvent;
}

function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  // Format date
  const dateStr = event.isAllDay
    ? startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  // Format time
  const timeStr = event.isAllDay
    ? 'All Day'
    : `${startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })} - ${endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;

  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0">
          <div className="bg-primary-600 text-white rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-2xl font-bold">
              {startDate.toLocaleDateString('en-US', { day: 'numeric' })}
            </div>
            <div className="text-sm uppercase">
              {startDate.toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          
          <div className="space-y-1 text-gray-700 mb-3">
            <p className="font-medium text-primary-600">
              {dateStr}
            </p>
            <p className="text-sm">
              🕒 {timeStr}
            </p>
            {event.location && (
              <p className="text-sm">
                📍 {event.location}
              </p>
            )}
            {event.isRecurring && (
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Recurring Event
              </span>
            )}
          </div>

          {event.description && (
            <p className="text-gray-600 whitespace-pre-wrap">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
