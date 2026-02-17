# Ticker Fix Documentation

## Issue
The ticker was showing the fallback message "Check Events for What's Happening" instead of pulling content from the TickerItems tab in Google Sheets.

## Root Cause
The documentation was inconsistent - the `.env.example` file incorrectly referred to the tab as "Ticker Messages" when it should be "TickerItems". This caused confusion about which tab to edit in Google Sheets.

## Solution
Updated all documentation to correctly reference the "TickerItems" tab:

1. **`.env.example`**: Changed comment from "Ticker Messages tab" to "TickerItems tab"
2. **`DEPLOYMENT.md`**: 
   - Added `OAKS_TICKER_CSV_URL` to the environment variables section
   - Added TickerItems tab to the content management section
   - Updated deployment notes to explain ticker configuration

## How the Ticker Works

The ticker system pulls data from Google Sheets and displays active messages based on date/time filters:

```
app/layout.tsx (line 67)
  ↓
  const tickerItems = await getTickerData()
  ↓
lib/ticker-data.ts (line 35)
  ↓
  export async function getTickerData()
  ↓
  return await getTickerItemsFromCSV()
  ↓
lib/ticker-csv.ts (line 143)
  ↓
  Fetches from: process.env.OAKS_TICKER_CSV_URL
```

## Required Environment Variable

In Vercel (or your deployment platform), set:

```bash
OAKS_TICKER_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6AerF_P9DPnZ9h0kOcOxs2V5HUFfBSacGc6uRd2bruCXjtJF9B0ZtwBi7SryMEmIRTjN7s3Cji4K2/pub?gid=478435834&single=true&output=csv"
```

**Note:** `gid=478435834` corresponds to the **TickerItems** tab in Google Sheets.

## Google Sheets Tab Structure

The TickerItems tab should have these columns:

| Column | Type | Description |
|--------|------|-------------|
| Id | String | Unique identifier for the ticker message |
| Message | String | The ticker message text to display |
| StartDate | String (YYYY-MM-DD) | Optional - Message will only show after this date |
| EndDate | String (YYYY-MM-DD) | Optional - Message will only show until this date |
| DaysOfWeek | String | Optional - Comma-separated days (mon,tue,wed,thu,fri,sat,sun) |
| StartTime | String (HH:MM) | Optional - Message will only show after this time |
| EndTime | String (HH:MM) | Optional - Message will only show until this time |
| Active | String | true/1/yes/y or false/0/no/n |
| Order | Number | Sort order (lower numbers appear first) |

## Example Ticker Items

| Id | Message | StartDate | EndDate | DaysOfWeek | StartTime | EndTime | Active | Order |
|----|---------|-----------|---------|------------|-----------|---------|--------|-------|
| 1 | Happy Hour 3-6pm Daily! 🍺 | | | | | | true | 1 |
| 2 | Live Music This Friday! 🎵 | 2026-02-14 | 2026-02-14 | fri | | | true | 2 |
| 3 | Trivia Night Every Wednesday! 🧠 | | | wed | | | true | 3 |

## Fallback Behavior

If `OAKS_TICKER_CSV_URL` is not set or returns no active messages, the ticker will display:

```
🎉 Check Events for What's Happening
```

This is by design - see `components/UnifiedTicker.tsx` line 17.

## Verification Steps

To verify the ticker is working correctly:

1. **Check Environment Variable**: Ensure `OAKS_TICKER_CSV_URL` is set in your deployment platform
2. **Check Google Sheets**: Verify the TickerItems tab (gid=478435834) has at least one active message
3. **Check Message Filters**: Ensure messages have `Active=true` and meet any date/time/day filters
4. **Deploy**: After setting the environment variable, redeploy the application
5. **Test**: Visit the live site and verify ticker messages appear at the top of the page

## Troubleshooting

### Ticker shows "Check Events for What's Happening"

This means:
- `OAKS_TICKER_CSV_URL` is not set, OR
- The TickerItems tab is empty, OR
- No messages have `Active=true`, OR
- No messages meet the current date/time/day filters

**Solution:** Check the environment variable, verify Google Sheets data, and ensure at least one message is active and valid for the current date/time.

### Ticker messages not updating

The ticker data is cached for 5 minutes (300 seconds) by default. Changes to Google Sheets may take up to 5 minutes to appear on the live site.

**Solution:** Wait 5 minutes or adjust `OAKS_MENU_REVALIDATE_SECONDS` environment variable.

## Files Modified

- `.env.example` - Updated comment to reference "TickerItems tab"
- `DEPLOYMENT.md` - Added OAKS_TICKER_CSV_URL to deployment instructions and content management section

## Related Documentation

- `TICKER_VERIFICATION.md` - Previous verification report confirming ticker uses CSV only
- `lib/ticker-csv.ts` - CSV parsing and filtering logic
- `lib/ticker-data.ts` - Data fetching function
- `components/UnifiedTicker.tsx` - Display component
