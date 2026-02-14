# Specials Feature

This module provides Google Sheets CSV integration for the restaurant's daily/weekly specials with automatic timezone-aware filtering.

## Environment Variables

Required environment variables (add to `.env.local` for local development, and to Vercel project settings for production):

```env
OAKS_SPECIALS_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6AerF_P9DPnZ9h0kOcOxs2V5HUFfBSacGc6uRd2bruCXjtJF9B0ZtwBi7SryMEmIRTjN7s3Cji4K2/pub?gid=272315194&single=true&output=csv"
OAKS_MENU_REVALIDATE_SECONDS="300"
OAKS_TZ="America/Los_Angeles"
```

- `OAKS_SPECIALS_CSV_URL`: CSV feed URL for specials (Specials tab, gid=272315194)
- `OAKS_MENU_REVALIDATE_SECONDS`: Cache revalidation interval in seconds (default: 300)
- `OAKS_TZ`: Timezone for date/time filtering (default: America/Los_Angeles)

## CSV Format

The Google Sheets must have the following columns (case-insensitive, with whitespace trimmed):

### Required Columns

- **Id**: Unique identifier for the special (e.g., "special-1")
- **Title**: Display title for the special (e.g., "Happy Hour Wings")
- **Description**: Description of the special (can be longer, will be truncated in UI)
- **Price**: Price (e.g., "$8" or "8")
- **Type**: Category - `food`, `drinks`, `event`, `happyhour`, or `other`
- **StartDate**: Start date in YYYY-MM-DD format (optional)
- **EndDate**: End date in YYYY-MM-DD format (optional)
- **DaysOfWeek**: Comma-separated days: Mon,Tue,Wed,Thu,Fri,Sat,Sun (optional)
- **StartTime**: Start time in HH:MM 24-hour format (optional, e.g., "15:00")
- **EndTime**: End time in HH:MM 24-hour format (optional, e.g., "18:00")
- **Active**: Boolean flag to show/hide (TRUE/true/1/yes/y = show)
- **Featured**: Boolean flag for featured items (TRUE/true/1/yes/y = featured)
- **Order**: Sort order (integer, lower numbers appear first)
- **Badge**: Optional badge text (e.g., "Limited Time", "Happy Hour")

### Example CSV

```csv
Id,Title,Description,Price,Type,StartDate,EndDate,DaysOfWeek,StartTime,EndTime,Active,Featured,Order,Badge
hh-wings,Happy Hour Wings,Crispy buffalo or BBQ wings,$8,drinks,,,Mon,Tue,Wed,Thu,Fri,15:00,18:00,TRUE,1,10,Happy Hour
taco-tue,Taco Tuesday,Three tacos with sides,$12,food,,,Tue,,,TRUE,1,20,Limited Time
weekend,Weekend Brunch Special,Bottomless mimosas with any entree,$15,drinks,2026-02-15,2026-02-16,"Sat,Sun",10:00,14:00,TRUE,0,30,
```

## Filtering Rules

Specials are automatically filtered based on:

1. **Active Flag**: Must be TRUE/true/1/yes/y
2. **Date Window**: If StartDate is set, current date must be >= StartDate. If EndDate is set, current date must be <= EndDate
3. **Day of Week**: If DaysOfWeek is set, current day must be in the list
4. **Time Window**: If StartTime/EndTime is set, current time must be within the window

All filtering uses the **America/Los_Angeles** timezone (configurable via `OAKS_TZ`).

## Sorting Rules

Specials are sorted by:
1. **Featured** (descending) - Featured specials appear first
2. **Order** (ascending) - Lower Order values appear first
3. **Title** (alphabetically) - Tiebreaker

## UI Behavior

### Layout
- **1-2 specials**: Vertical stack (centered, max-width)
- **3+ specials**: Horizontal scroll on mobile, 3-column grid on desktop

### Display
- Badge pill (if present) - color-coded by type
- Title (large, bold)
- Description (truncated to ~160 characters)
- Price (large, gold color, at bottom)

### Visibility
- If no specials match the filters, the entire Specials section is hidden
- No empty placeholder is shown
- Homepage continues to render normally

## Caching

- Uses Next.js `fetch()` with `revalidate` option
- Default revalidation: 300 seconds (5 minutes)
- Homepage automatically gets ISR (Incremental Static Regeneration)
- Specials data is cached and only refetched after the revalidation period

## Fallback Behavior

If CSV fetching or parsing fails:
1. Error is logged to console
2. Function returns `null`
3. Specials section is not rendered on homepage
4. Application continues to function normally

## Usage

```typescript
import { getSpecialsFromSheets } from '@/lib/specials/sheetsSpecialsCsv';
import SpecialsStrip from '@/components/specials/SpecialsStrip';

// In a Next.js page (async server component)
export default async function HomePage() {
  const specialsData = await getSpecialsFromSheets();
  
  return (
    <div>
      {/* Other content */}
      {specialsData && <SpecialsStrip specialsData={specialsData} />}
      {/* More content */}
    </div>
  );
}
```

## Testing

### Testing with Google Sheets

To test the Specials integration:

1. Ensure `.env.local` has the environment variables set
2. Create test specials in the Google Sheets
3. Set appropriate date/time/day filters to test filtering logic
4. Run `npm run dev`
5. Visit the homepage
6. Specials matching current date/time/day should appear

### Testing Specific Scenarios

**Always-visible special** (no filters):
```csv
Id,Title,Description,Price,Type,StartDate,EndDate,DaysOfWeek,StartTime,EndTime,Active,Featured,Order,Badge
test-1,Test Special,Always visible,$10,food,,,,,,,TRUE,0,1,New
```

**Happy hour special** (weekdays 3-6pm):
```csv
Id,Title,Description,Price,Type,StartDate,EndDate,DaysOfWeek,StartTime,EndTime,Active,Featured,Order,Badge
hh-1,Happy Hour,Half-price appetizers,$6,happyhour,,,"Mon,Tue,Wed,Thu,Fri",15:00,18:00,TRUE,1,10,Happy Hour
```

**Weekend special** (Saturday and Sunday):
```csv
Id,Title,Description,Price,Type,StartDate,EndDate,DaysOfWeek,StartTime,EndTime,Active,Featured,Order,Badge
weekend-1,Brunch Special,Eggs Benedict with mimosa,$18,food,,,"Sat,Sun",10:00,14:00,TRUE,0,20,Weekend Only
```

**Limited time special** (specific date range):
```csv
Id,Title,Description,Price,Type,StartDate,EndDate,DaysOfWeek,StartTime,EndTime,Active,Featured,Order,Badge
valentines,Valentine's Special,Prix fixe dinner for two,$75,food,2026-02-14,2026-02-14,,,17:00,22:00,TRUE,1,5,Valentine's Day
```

### Testing Fallback

To test fallback behavior:
1. Set invalid CSV URL in `.env.local` or remove it
2. The homepage should load normally without the Specials section
3. No errors should appear in the UI
4. Check server console for error log

## Type Definitions

```typescript
type Special = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  type: 'food' | 'drinks' | 'event' | 'happyhour' | 'other';
  startDate?: string;        // YYYY-MM-DD
  endDate?: string;          // YYYY-MM-DD
  daysOfWeek?: string[];     // ['mon', 'tue', 'wed', etc.]
  startTime?: string;        // HH:MM
  endTime?: string;          // HH:MM
  active: boolean;
  featured: boolean;
  order: number;
  badge?: string;
};

type SpecialsData = {
  lastUpdatedISO: string;
  specials: Special[];
};
```

## Architecture

- **Server-side only**: All CSV fetching and parsing happens on the server
- **Type-safe**: Uses TypeScript with proper type definitions
- **Robust parsing**: Uses `csv-parse` library with quoted comma support
- **Timezone-aware**: All date/time comparisons use America/Los_Angeles timezone
- **Graceful degradation**: Automatic fallback to no specials if fetch fails
- **UI-agnostic**: Returns structured data that UI components consume
