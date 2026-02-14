# Menu CSV Integration

This module provides Google Sheets CSV integration for the restaurant's food and drinks menus with automatic fallback to hardcoded JSON files.

## Environment Variables

Required environment variables (add to `.env.local` for local development, and to Vercel project settings for production):

```env
OAKS_FOOD_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6AerF_P9DPnZ9h0kOcOxs2V5HUFfBSacGc6uRd2bruCXjtJF9B0ZtwBi7SryMEmIRTjN7s3Cji4K2/pub?gid=0&single=true&output=csv"
OAKS_DRINKS_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6AerF_P9DPnZ9h0kOcOxs2V5HUFfBSacGc6uRd2bruCXjtJF9B0ZtwBi7SryMEmIRTjN7s3Cji4K2/pub?gid=1210313943&single=true&output=csv"
OAKS_MENU_REVALIDATE_SECONDS="300"
```

- `OAKS_FOOD_CSV_URL`: CSV feed URL for the food menu (FoodItems tab, gid=0)
- `OAKS_DRINKS_CSV_URL`: CSV feed URL for the drinks menu (DrinkItems tab, gid=1210313943)
- `OAKS_MENU_REVALIDATE_SECONDS`: Cache revalidation interval in seconds (default: 300)

## CSV Format

The Google Sheets must have the following columns (case-insensitive, with whitespace trimmed):

### Required Columns

- **SectionId**: Unique identifier for the section (e.g., "appetizers", "burgers")
- **SectionTitle**: Display title for the section (e.g., "Appetizers", "Burgers & Sandwiches")
- **Name**: Menu item name
- **Description**: Item description (can be empty)
- **Price**: Item price (e.g., "$12" or "12")
- **Dietary**: Comma-separated dietary tags: `v` (vegetarian), `vg` (vegan), `gf` (gluten-free), `df` (dairy-free), `n` (contains nuts)
- **Spicy**: Boolean flag (TRUE/true/1/yes/y = spicy)
- **AddOns**: Optional add-ons in format "Name (+$2), Name2 (+$3)" or "Name ($2), Name2 ($3)"
- **Active**: Boolean flag to show/hide items (TRUE/true/1/yes/y = show, FALSE/false/0/no/n = hide)
- **Featured**: Boolean flag for featured items (not currently used in UI)
- **Order**: Sort order within section (integer, lower numbers appear first)

### Example CSV

```csv
SectionId,SectionTitle,Name,Description,Price,Dietary,Spicy,AddOns,Active,Featured,Order
appetizers,Appetizers,The Totchos,Tater tots loaded with cheese,$12,v,FALSE,Sour Cream (+$1),TRUE,1,10
appetizers,Appetizers,Wings,Crispy chicken wings,$14,,TRUE,Ranch (+$1),TRUE,0,20
burgers,Burgers & Sandwiches,The Burger,Classic pub burger,$15,,FALSE,Bacon (+$3),TRUE,1,5
```

## Parsing Rules

- **Active**: Items with `Active=FALSE` are filtered out and not displayed
- **Dietary**: Split on commas, trimmed, filtered to valid values (v, vg, gf, df, n)
- **Spicy**: Treated as boolean (TRUE/1/yes/y = true)
- **Order**: Parsed as integer; invalid/missing values default to 999999
- **AddOns**: Conservative parsing - only parses if format matches "Name (+$2)" pattern

## Grouping and Sorting

1. Rows are grouped by `SectionId`
2. Sections are sorted by:
   - Minimum `Order` value in that section (ascending)
   - Then by `SectionTitle` (alphabetically)
3. Items within each section are sorted by:
   - `Order` value (ascending)
   - Then by `Name` (alphabetically)

## Caching

- Uses Next.js `fetch()` with `revalidate` option
- Default revalidation: 300 seconds (5 minutes)
- Pages with menu data automatically get ISR (Incremental Static Regeneration)
- Menu data is cached and only refetched after the revalidation period

## Fallback Behavior

If CSV fetching or parsing fails for any reason (network error, invalid CSV, no active items, etc.):

1. An error is logged to console
2. The system automatically falls back to hardcoded JSON files in `content/` directory
3. The application continues to function normally with static menu data

## Usage

```typescript
import { getFoodMenuFromSheets, getDrinksMenuFromSheets } from '@/lib/menus/sheetsCsv';

// In a Next.js page (async server component)
export default async function MenuPage() {
  const menu = await getFoodMenuFromSheets();
  return <MenuPageClient menu={menu} />;
}
```

## Testing

To test the CSV integration locally:

1. Ensure `.env.local` has the environment variables set
2. Run `npm run dev`
3. Visit `/menu` and `/drinks` pages
4. Check server console for any errors or fallback messages

To test fallback behavior:

1. Set invalid CSV URL in `.env.local` or remove the environment variables
2. The system should automatically fall back to JSON files
3. No errors should appear in the UI

## Architecture

- **Server-side only**: All CSV fetching and parsing happens on the server
- **Type-safe**: Uses TypeScript with proper type definitions
- **Robust parsing**: Uses `csv-parse` library with quoted comma support
- **Graceful degradation**: Automatic fallback to existing hardcoded menus
- **UI-agnostic**: Returns data in same format as existing system, no UI changes needed
