import { parse } from 'csv-parse/sync';

export type Special = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  type: 'food' | 'drinks' | 'event' | 'happyhour' | 'other';
  startDate?: string;
  endDate?: string;
  daysOfWeek?: string[];
  startTime?: string;
  endTime?: string;
  active: boolean;
  featured: boolean;
  order: number;
  badge?: string;
};

export type SpecialsData = {
  lastUpdatedISO: string;
  specials: Special[];
};

// CSV column interface
interface SpecialCSVRow {
  Id: string;
  Title: string;
  Description: string;
  Price: string;
  Type: string;
  StartDate: string;
  EndDate: string;
  DaysOfWeek: string;
  StartTime: string;
  EndTime: string;
  Active: string;
  Featured: string;
  Order: string;
  Badge: string;
}

// Parse Active/Featured columns
function parseBoolean(value: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(normalized);
}

// Parse Order column
function parseOrder(value: string): number {
  if (!value) return 999999;
  const parsed = parseInt(value.trim(), 10);
  return isNaN(parsed) ? 999999 : parsed;
}

// Parse Type column
function parseType(value: string): Special['type'] {
  if (!value) return 'other';
  const normalized = value.trim().toLowerCase();
  const validTypes: Special['type'][] = ['food', 'drinks', 'event', 'happyhour', 'other'];
  return validTypes.includes(normalized as Special['type']) 
    ? (normalized as Special['type']) 
    : 'other';
}

// Parse DaysOfWeek column
function parseDaysOfWeek(value: string): string[] | undefined {
  if (!value) return undefined;
  const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return value
    .split(',')
    .map(day => day.trim().toLowerCase())
    .filter(day => validDays.includes(day));
}

// Get current time in America/Los_Angeles timezone
function getCurrentPTTime(): Date {
  const tz = process.env.OAKS_TZ || 'America/Los_Angeles';
  // Create a date string in the target timezone
  const dateStr = new Date().toLocaleString('en-US', { timeZone: tz });
  return new Date(dateStr);
}

// Check if special is currently valid based on date/time windows
function isSpecialValid(special: Special): boolean {
  const now = getCurrentPTTime();
  
  // Check date window
  if (special.startDate) {
    const startDate = new Date(special.startDate + 'T00:00:00');
    if (now < startDate) return false;
  }
  
  if (special.endDate) {
    const endDate = new Date(special.endDate + 'T23:59:59');
    if (now > endDate) return false;
  }
  
  // Check day of week
  if (special.daysOfWeek && special.daysOfWeek.length > 0) {
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDay = dayNames[now.getDay()];
    if (!special.daysOfWeek.includes(currentDay)) return false;
  }
  
  // Check time window
  if (special.startTime || special.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    if (special.startTime) {
      const [startHour, startMin] = special.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      if (currentTime < startMinutes) return false;
    }
    
    if (special.endTime) {
      const [endHour, endMin] = special.endTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMin;
      if (currentTime > endMinutes) return false;
    }
  }
  
  return true;
}

// Convert CSV row to Special
function rowToSpecial(row: SpecialCSVRow, order: number): Special {
  const special: Special = {
    id: row.Id?.trim() || '',
    title: row.Title?.trim() || '',
    description: row.Description?.trim() || undefined,
    price: row.Price?.trim() || undefined,
    type: parseType(row.Type),
    startDate: row.StartDate?.trim() || undefined,
    endDate: row.EndDate?.trim() || undefined,
    daysOfWeek: parseDaysOfWeek(row.DaysOfWeek),
    startTime: row.StartTime?.trim() || undefined,
    endTime: row.EndTime?.trim() || undefined,
    active: parseBoolean(row.Active),
    featured: parseBoolean(row.Featured),
    order: order,
    badge: row.Badge?.trim() || undefined,
  };
  
  return special;
}

// Fetch and parse CSV from URL
async function fetchAndParseCSV(url: string, revalidateSeconds: number): Promise<SpecialCSVRow[]> {
  const response = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();

  // Parse CSV with robust handling
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    quote: '"',
    escape: '"',
  }) as SpecialCSVRow[];

  return records;
}

// Main function to get specials from Sheets
export async function getSpecialsFromSheets(): Promise<SpecialsData | null> {
  try {
    const url = process.env.OAKS_SPECIALS_CSV_URL;
    
    if (!url) {
      console.warn('OAKS_SPECIALS_CSV_URL not set, specials will not be displayed');
      return null;
    }

    const revalidateSecondsStr = process.env.OAKS_MENU_REVALIDATE_SECONDS || '300';
    const revalidateSeconds = parseInt(revalidateSecondsStr, 10);
    
    // Validate parsed value
    const validRevalidate = isNaN(revalidateSeconds) || revalidateSeconds < 0 
      ? 300 
      : revalidateSeconds;

    const records = await fetchAndParseCSV(url, validRevalidate);

    // Filter and process specials
    const specials = records
      .map(row => {
        const order = parseOrder(row.Order);
        return rowToSpecial(row, order);
      })
      .filter(special => {
        // Must be active
        if (!special.active) return false;
        
        // Must satisfy date/time windows
        if (!isSpecialValid(special)) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by: Featured desc, Order asc, Title asc
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.title.localeCompare(b.title);
      });

    if (specials.length === 0) {
      return null;
    }

    return {
      lastUpdatedISO: new Date().toISOString(),
      specials,
    };
  } catch (error) {
    console.error('Error fetching specials from Sheets:', error);
    return null;
  }
}
