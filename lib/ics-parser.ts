import ICAL from 'ical.js';

export interface ParsedEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  location?: string;
  isRecurring: boolean;
}

/**
 * Parses an ICS feed and returns a list of events within a specified date range.
 * Handles recurring events (RRULE), all-day events, and cancelled exceptions (EXDATE/RECURRENCE-ID).
 */
export function parseICS(icsData: string, daysAhead: number = 90): ParsedEvent[] {
  try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const now = new Date();
    const endRange = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const events: ParsedEvent[] = [];

    // Track cancelled instances by UID and recurrence-id
    const cancelledInstances = new Map<string, Set<string>>();

    // First pass: identify cancelled instances
    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);
      const uid = event.uid;
      
      // Check if this is a cancelled instance (status is CANCELLED)
      const status = vevent.getFirstPropertyValue('status');
      if (status === 'CANCELLED' && event.recurrenceId) {
        const recurrenceIdStr = event.recurrenceId.toString();
        if (!cancelledInstances.has(uid)) {
          cancelledInstances.set(uid, new Set());
        }
        cancelledInstances.get(uid)!.add(recurrenceIdStr);
      }
    }

    // Second pass: process events
    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);
      const uid = event.uid;

      // Skip if this specific instance is cancelled
      const status = vevent.getFirstPropertyValue('status');
      if (status === 'CANCELLED') {
        continue;
      }

      // Check if event is recurring
      const isRecurring = event.isRecurring();

      if (isRecurring) {
        // Get recurrence iterator
        const iterator = event.iterator();
        let next;
        let count = 0;
        const maxIterations = 1000; // Safety limit

        while ((next = iterator.next()) && count < maxIterations) {
          const occurrenceStart = next.toJSDate();
          
          // Stop if we're past the end range
          if (occurrenceStart > endRange) {
            break;
          }

          // Only include events from now onwards
          if (occurrenceStart >= now) {
            const recurrenceIdStr = next.toString();
            
            // Skip if this specific occurrence was cancelled
            if (cancelledInstances.get(uid)?.has(recurrenceIdStr)) {
              count++;
              continue;
            }

            // Calculate end date based on duration
            const duration = event.duration;
            const occurrenceEnd = new Date(occurrenceStart.getTime() + duration.toSeconds() * 1000);

            events.push({
              id: `${uid}-${next.toString()}`,
              title: event.summary || 'Untitled Event',
              description: event.description || '',
              startDate: occurrenceStart,
              endDate: occurrenceEnd,
              isAllDay: isAllDayEvent(event),
              location: event.location || undefined,
              isRecurring: true,
            });
          }
          count++;
        }
      } else {
        // Non-recurring event
        const startDate = event.startDate.toJSDate();
        const endDate = event.endDate.toJSDate();

        // Only include if within our date range
        if (startDate >= now && startDate <= endRange) {
          events.push({
            id: uid,
            title: event.summary || 'Untitled Event',
            description: event.description || '',
            startDate,
            endDate,
            isAllDay: isAllDayEvent(event),
            location: event.location || undefined,
            isRecurring: false,
          });
        }
      }
    }

    // Sort events by start date
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return events;
  } catch (error) {
    console.error('Error parsing ICS data:', error);
    throw new Error('Failed to parse ICS data');
  }
}

/**
 * Determines if an event is an all-day event.
 */
function isAllDayEvent(event: ICAL.Event): boolean {
  // In iCal, all-day events are represented as DATE values (not DATE-TIME)
  // We can check if the start date has time components
  try {
    const startDate = event.startDate;
    // If isDate is true, it's an all-day event
    return startDate.isDate === true;
  } catch {
    return false;
  }
}

/**
 * Groups events by date for easier rendering.
 */
export function groupEventsByDate(events: ParsedEvent[]): Map<string, ParsedEvent[]> {
  const grouped = new Map<string, ParsedEvent[]>();

  for (const event of events) {
    const dateKey = event.startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  }

  return grouped;
}
