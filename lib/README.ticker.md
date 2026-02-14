# Ticker System

This directory contains the ticker message system that displays scrolling messages at the top of the website.

## Overview

The ticker pulls messages from the **TickerItems** tab in Google Sheets and displays them in a scrolling banner. Messages can be scheduled with date/time windows and filtered by days of the week.

## Files

- `ticker-csv.ts` - Fetches and parses ticker messages from Google Sheets CSV
- `ticker-data.ts` - Server-side data fetching wrapper

## Environment Variables

### Required

```bash
OAKS_TICKER_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6AerF_P9DPnZ9h0kOcOxs2V5HUFfBSacGc6uRd2bruCXjtJF9B0ZtwBi7SryMEmIRTjN7s3Cji4K2/pub?gid=478435834&single=true&output=csv"
```

This URL points to the **TickerItems** tab (gid=478435834) in the published Google Sheets.

### Optional

```bash
OAKS_MENU_REVALIDATE_SECONDS="300"  # Cache duration in seconds (default: 300 = 5 minutes)
OAKS_TZ="America/Los_Angeles"       # Timezone for date/time filtering
```

## Google Sheets Format

The **TickerItems** tab should have these columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Id | String | Yes | Unique identifier for the message |
| Message | String | Yes | The ticker message text to display |
| Active | String | Yes | `true`, `1`, `yes`, `y` (case-insensitive) to show the message |
| Order | Number | Yes | Sort order (lower numbers appear first, 999999 if empty) |
| StartDate | String | No | YYYY-MM-DD format - message shows after this date |
| EndDate | String | No | YYYY-MM-DD format - message shows until this date |
| DaysOfWeek | String | No | Comma-separated: `mon,tue,wed,thu,fri,sat,sun` |
| StartTime | String | No | HH:MM format (24-hour) - message shows after this time |
| EndTime | String | No | HH:MM format (24-hour) - message shows until this time |

## Example Data

```csv
Id,Message,StartDate,EndDate,DaysOfWeek,StartTime,EndTime,Active,Order
1,Happy Hour 3-6pm Daily! 🍺,,,,,,,true,1
2,Live Music This Friday! 🎵,2026-02-14,2026-02-14,fri,,,true,2
3,Trivia Night Every Wednesday! 🧠,,,wed,,,true,3
4,Weekend Brunch 10am-2pm! 🥞,,,"sat,sun",10:00,14:00,true,4
5,New Menu Coming Soon!,2026-03-01,,,,,true,5
```

## Filtering Logic

Messages are only displayed if they meet ALL of these criteria:

1. **Active**: The `Active` column must be `true`, `1`, `yes`, or `y`
2. **Message**: The `Message` column must not be empty
3. **Date Window**: Current date must be between `StartDate` and `EndDate` (if specified)
4. **Day of Week**: Current day must be in `DaysOfWeek` list (if specified)
5. **Time Window**: Current time must be between `StartTime` and `EndTime` (if specified)

All date/time comparisons use the `America/Los_Angeles` timezone (or `OAKS_TZ` if set).

## Sorting

Messages are sorted by:
1. `Order` column (ascending)
2. `Message` text (alphabetically) if Order values are equal

## Fallback Behavior

If no messages pass the filters or `OAKS_TICKER_CSV_URL` is not set, the ticker displays:

```
🎉 Check Events for What's Happening
```

This fallback is defined in `components/UnifiedTicker.tsx`.

## Usage

The ticker is automatically included in the root layout (`app/layout.tsx`):

```tsx
import UnifiedTicker from '@/components/UnifiedTicker'
import { getTickerData } from '@/lib/ticker-data'

export default async function RootLayout({ children }) {
  const tickerItems = await getTickerData();
  
  return (
    <html>
      <body>
        <UnifiedTicker tickerItems={tickerItems} />
        {/* ... */}
      </body>
    </html>
  )
}
```

## Caching

Ticker data is cached for `OAKS_MENU_REVALIDATE_SECONDS` (default: 300 seconds = 5 minutes). This means:

- Changes to Google Sheets may take up to 5 minutes to appear on the site
- Reduces API calls to Google Sheets
- Improves performance

## Tips

### Time-Based Messages

Show happy hour message only during happy hour:
```csv
Id,Message,StartTime,EndTime,Active,Order
1,Happy Hour NOW! 🍺,15:00,18:00,true,1
```

### Weekend-Only Messages

Show brunch message only on weekends:
```csv
Id,Message,DaysOfWeek,Active,Order
2,Weekend Brunch Available! 🥞,"sat,sun",true,2
```

### Event Promotion

Show event message only on the event day:
```csv
Id,Message,StartDate,EndDate,Active,Order
3,Live Band Tonight! 🎸,2026-02-14,2026-02-14,true,1
```

### Multiple Messages

The ticker will cycle through all active messages in order:
```csv
Id,Message,Active,Order
1,Happy Hour 3-6pm! 🍺,true,1
2,Trivia Wednesday Nights! 🧠,true,2
3,Live Music Fridays! 🎵,true,3
```

## Troubleshooting

### Messages not appearing

1. Check `OAKS_TICKER_CSV_URL` is set in deployment environment
2. Verify the TickerItems tab exists and has data
3. Ensure at least one message has `Active=true`
4. Check date/time/day filters aren't excluding all messages
5. Wait 5 minutes for cache to refresh after Google Sheets changes

### Messages showing at wrong times

1. Verify `OAKS_TZ` environment variable is set to `America/Los_Angeles`
2. Check time format is HH:MM in 24-hour format (e.g., `15:00` not `3:00 PM`)
3. Verify day names are lowercase: `mon,tue,wed,thu,fri,sat,sun`

### Messages not updating

The ticker cache lasts 5 minutes. Either:
- Wait 5 minutes for cache to expire
- Trigger a new deployment to clear cache
- Reduce `OAKS_MENU_REVALIDATE_SECONDS` (not recommended for production)

## Development

Run locally with environment variable:

```bash
export OAKS_TICKER_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=478435834&single=true&output=csv"
npm run dev
```

Without the environment variable, you'll see the fallback message in the ticker.

## Related Files

- `components/UnifiedTicker.tsx` - Client component that displays the ticker
- `app/layout.tsx` - Root layout that includes the ticker
- `TICKER_FIX.md` - Documentation about the ticker fix
- `TICKER_VERIFICATION.md` - Verification report
