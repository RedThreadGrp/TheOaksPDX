import { getSpecialsFromSheets } from './specials/sheetsSpecialsCsv';
import { parseICS } from './ics-parser';

export interface TickerItem {
  id: string;
  text: string;
  emoji: string;
}

/**
 * Fetches the next upcoming event from the calendar ICS feed
 */
async function getNextCalendarEvent(): Promise<TickerItem | null> {
  try {
    const icsUrl = process.env.OAKS_EVENTS_ICS_URL;
    
    // Check if URL is configured and not a placeholder
    if (!icsUrl || icsUrl.includes('YOUR_CALENDAR_ID')) {
      console.log('Calendar URL not configured, skipping calendar ticker items');
      return null;
    }

    // Fetch and parse ICS data
    const response = await fetch(icsUrl, {
      headers: {
        'User-Agent': 'TheOaksPDX/1.0',
      },
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch calendar for ticker:', response.status);
      return null;
    }

    const icsData = await response.text();
    const events = parseICS(icsData, 30); // Look 30 days ahead

    // Get the next upcoming event
    if (events.length === 0) {
      return null;
    }

    const nextEvent = events[0]; // Events are already sorted by start date
    
    // Format date
    const eventDate = new Date(nextEvent.startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateStr = '';
    if (eventDate.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Format time if not all-day
    let timeStr = '';
    if (!nextEvent.isAllDay) {
      timeStr = eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }

    const text = `${nextEvent.title} - ${dateStr}${timeStr ? ' at ' + timeStr : ''}`;

    return {
      id: `event-${nextEvent.id}`,
      text,
      emoji: '🎉',
    };
  } catch (error) {
    console.error('Error fetching calendar for ticker:', error);
    return null;
  }
}

/**
 * Fetches ticker items from Specials
 */
async function getSpecialsTickerItems(): Promise<TickerItem[]> {
  try {
    const specialsData = await getSpecialsFromSheets();
    
    if (!specialsData || specialsData.specials.length === 0) {
      return [];
    }

    // Convert specials to ticker items (limit to first 3 for ticker)
    return specialsData.specials.slice(0, 3).map(special => {
      // Choose emoji based on type
      const emojiMap: Record<string, string> = {
        food: '🍽️',
        drinks: '🍻',
        event: '🎸',
        happyhour: '🍺',
        other: '✨',
      };

      const emoji = emojiMap[special.type] || '✨';
      
      return {
        id: `special-${special.id}`,
        text: `${special.title}${special.price ? ' - ' + special.price : ''}`,
        emoji,
      };
    });
  } catch (error) {
    console.error('Error fetching specials for ticker:', error);
    return [];
  }
}

/**
 * Gets all ticker data (specials + next calendar event)
 */
export async function getTickerData(): Promise<{
  specialsItems: TickerItem[];
  nextEventItem: TickerItem | null;
}> {
  const [specialsItems, nextEventItem] = await Promise.all([
    getSpecialsTickerItems(),
    getNextCalendarEvent(),
  ]);

  return {
    specialsItems,
    nextEventItem,
  };
}
