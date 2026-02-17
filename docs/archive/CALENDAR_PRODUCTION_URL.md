# Production Configuration for The Oaks PDX Calendar

## Google Calendar ICS URL (Production)

This document contains the production calendar URL for deployment to Vercel.

### Environment Variable

Set this in Vercel Production and Preview environments:

```
OAKS_EVENTS_ICS_URL=https://calendar.google.com/calendar/ical/37d9dde590472fbab54c6be316817abf744850e509e6eb439df922649b87b38d%40group.calendar.google.com/public/basic.ics
```

### Calendar Details

- **Calendar ID**: `37d9dde590472fbab54c6be316817abf744850e509e6eb439df922649b87b38d@group.calendar.google.com`
- **Format**: Public ICS feed
- **Access**: Public read-only
- **Usage**: Powers the unified ticker and events page

### Setting in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add a new variable:
   - **Name**: `OAKS_EVENTS_ICS_URL`
   - **Value**: The URL above
   - **Environments**: Production, Preview (both should be checked)
3. Save and redeploy

### Testing

After deployment, verify:
1. The unified ticker shows upcoming events
2. The /events page displays calendar events
3. No "calendar not configured" errors in server logs

### Security Note

This calendar URL is public and can be shared. It provides read-only access to event data. No authentication is required.
