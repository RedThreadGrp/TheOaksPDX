import { NextResponse } from 'next/server';
import { parseICS, type ParsedEvent } from '@/lib/ics-parser';

// Cache configuration
// Note: In serverless environments (Vercel, AWS Lambda), this in-memory cache
// may not persist across function invocations. For production deployments with
// high traffic, consider using Next.js unstable_cache or a distributed cache like Redis.
const CACHE_TTL = parseInt(process.env.EVENTS_CACHE_TTL_MINUTES || '15', 10) * 60 * 1000;
let cachedData: { events: ParsedEvent[]; timestamp: number } | null = null;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Fetches and parses the ICS feed, with caching to avoid rate limits.
 */
async function fetchAndParseICS(): Promise<ParsedEvent[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
    console.log('Returning cached ICS data');
    return cachedData.events;
  }

  const icsUrl = process.env.OAKS_EVENTS_ICS_URL;
  if (!icsUrl) {
    throw new Error('OAKS_EVENTS_ICS_URL environment variable is not configured');
  }

  console.log('Fetching fresh ICS data from:', icsUrl);

  try {
    const response = await fetch(icsUrl, {
      headers: {
        'User-Agent': 'TheOaksPDX/1.0',
      },
      // Don't use Next.js default caching, we handle it ourselves
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ICS feed: ${response.status} ${response.statusText}`);
    }

    const icsData = await response.text();
    const events = parseICS(icsData);

    // Update cache
    cachedData = {
      events,
      timestamp: now,
    };

    return events;
  } catch (error) {
    console.error('Error fetching ICS data:', error);
    
    // If we have cached data (even if expired), return it as fallback
    if (cachedData) {
      console.log('Returning stale cached data as fallback');
      return cachedData.events;
    }

    throw error;
  }
}

export async function GET() {
  try {
    const events = await fetchAndParseICS();

    return NextResponse.json({
      success: true,
      events,
      cached: cachedData ? Date.now() - cachedData.timestamp < CACHE_TTL : false,
    });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events',
      },
      { status: 500 }
    );
  }
}
