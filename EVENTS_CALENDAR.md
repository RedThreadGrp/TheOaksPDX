# Events Calendar Integration

This document explains the Google Calendar ICS integration for displaying upcoming events on The Oaks PDX website.

## Overview

The Events Calendar feature fetches events from a Google Calendar ICS feed and displays them in a clean, mobile-friendly UI. It includes:

- Server-side ICS fetching and parsing
- In-memory caching (15-minute TTL)
- Support for recurring events (RRULE)
- Support for all-day events
- Support for cancelled events (EXDATE/RECURRENCE-ID)
- Mobile-responsive design

## Setup

### 1. Configure Environment Variable

Add the following environment variable to your `.env.local` file:

```bash
OAKS_EVENTS_ICS_URL=https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/public/basic.ics
```

**To get your Google Calendar ICS URL:**

1. Open Google Calendar
2. Click on the calendar settings (three dots next to the calendar name)
3. Click "Settings and sharing"
4. Scroll to "Integrate calendar"
5. Copy the "Public URL in iCal format"
6. URL encode any special characters (the provided example is already encoded)

### 2. Make Your Calendar Public

For the ICS feed to be accessible:

1. In Google Calendar settings, go to "Access permissions"
2. Check "Make available to public"
3. Set the permission level (we recommend "See all event details")

**Security Note:** Only make the calendar public if you're comfortable with events being visible to anyone with the URL.

## Architecture

### Components

1. **`/lib/ics-parser.ts`** - ICS parsing utility using ical.js
   - Parses ICS data into structured events
   - Handles recurring events with RRULE expansion
   - Filters cancelled events
   - Sorts events by start date

2. **`/app/api/events/route.ts`** - API endpoint
   - Fetches ICS data from Google Calendar
   - Implements 15-minute in-memory cache
   - Returns parsed events as JSON
   - Graceful fallback to stale cache on errors

3. **`/app/events/EventsList.tsx`** - Client component
   - Fetches events from API
   - Displays loading/error states
   - Renders event cards with proper formatting

4. **`/app/events/page.tsx`** - Events page
   - Server-rendered page layout
   - Integrates EventsList component
   - Displays static event sections (Happy Hour, Weekly Events, Private Parties)

### Data Flow

```
Google Calendar ICS Feed
         ↓
/api/events (fetch + cache + parse)
         ↓
EventsList Component (client-side fetch)
         ↓
Rendered Event Cards
```

## Features

### Event Types Supported

- **Timed Events**: Standard events with specific start/end times
- **All-Day Events**: Events without specific times (e.g., festivals)
- **Recurring Events**: Weekly, monthly, or custom recurring patterns
- **Cancelled Events**: Automatically filtered out from display

### Caching Strategy

- **Cache Duration**: 15 minutes
- **Cache Location**: In-memory (server process)
- **Fallback**: Returns stale cache if fresh fetch fails
- **Benefits**:
  - Reduces load on Google Calendar API
  - Improves page load time
  - Provides resilience during outages

### Mobile Responsiveness

- Compact event cards on mobile
- Date badges for easy scanning
- Touch-friendly tap targets
- Responsive typography and spacing

## Development

### Testing Locally

1. Set up the environment variable
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000/events`

### Building for Production

```bash
npm run build
```

The build will verify that all TypeScript types are correct and all routes compile successfully.

## API Reference

### GET /api/events

Returns a list of upcoming events from the Google Calendar ICS feed.

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "unique-event-id",
      "title": "Event Title",
      "description": "Event description",
      "startDate": "2026-02-15T18:00:00.000Z",
      "endDate": "2026-02-15T21:00:00.000Z",
      "isAllDay": false,
      "location": "The Oaks Pub PDX",
      "isRecurring": true
    }
  ],
  "cached": true
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Troubleshooting

### Events not showing up

1. Verify the `OAKS_EVENTS_ICS_URL` environment variable is set correctly
2. Check that the calendar is public
3. Verify events are in the future (past events are filtered out)
4. Check server logs for fetch errors

### "fetch failed" error

- This usually means the server cannot reach the Google Calendar URL
- Check your internet connection
- Verify the URL is correct and accessible
- Check if there are any firewall or network restrictions

### Incorrect times displayed

- Events are displayed in the user's local timezone
- Verify that events in Google Calendar have the correct timezone set
- All-day events should not show times

## Future Enhancements

Possible improvements for the future:

- Add filtering by event type/category
- Add search functionality
- Add calendar view option
- Support for event images
- Add to calendar buttons (.ics download)
- Email reminders for events

## Dependencies

- **ical.js** (v2.2.1): ICS parsing library
- **Next.js** (v16.1.6): React framework with API routes
- **TypeScript**: Type safety

## License

This feature is part of The Oaks PDX website. All rights reserved.
