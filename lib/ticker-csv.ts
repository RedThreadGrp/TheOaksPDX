import { parse } from 'csv-parse/sync';

export interface TickerMessage {
  id: string;
  message: string;
  startDate?: string;
  endDate?: string;
  daysOfWeek?: string[];
  startTime?: string;
  endTime?: string;
  active: boolean;
  order: number;
}

// CSV column interface
interface TickerCSVRow {
  Id: string;
  Message: string;
  StartDate: string;
  EndDate: string;
  DaysOfWeek: string;
  StartTime: string;
  EndTime: string;
  Active: string;
  Order: string;
}

// Parse Active column
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

// Check if ticker message is currently valid based on date/time windows
function isTickerMessageValid(ticker: TickerMessage): boolean {
  const now = getCurrentPTTime();
  
  // Check date window
  if (ticker.startDate) {
    const startDate = new Date(ticker.startDate + 'T00:00:00');
    if (now < startDate) return false;
  }
  
  if (ticker.endDate) {
    const endDate = new Date(ticker.endDate + 'T23:59:59');
    if (now > endDate) return false;
  }
  
  // Check day of week
  if (ticker.daysOfWeek && ticker.daysOfWeek.length > 0) {
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDay = dayNames[now.getDay()];
    if (!ticker.daysOfWeek.includes(currentDay)) return false;
  }
  
  // Check time window
  if (ticker.startTime || ticker.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    if (ticker.startTime) {
      const [startHour, startMin] = ticker.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      if (currentTime < startMinutes) return false;
    }
    
    if (ticker.endTime) {
      const [endHour, endMin] = ticker.endTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMin;
      if (currentTime > endMinutes) return false;
    }
  }
  
  return true;
}

// Convert CSV row to TickerMessage
function rowToTickerMessage(row: TickerCSVRow): TickerMessage {
  return {
    id: row.Id?.trim() || '',
    message: row.Message?.trim() || '',
    startDate: row.StartDate?.trim() || undefined,
    endDate: row.EndDate?.trim() || undefined,
    daysOfWeek: parseDaysOfWeek(row.DaysOfWeek),
    startTime: row.StartTime?.trim() || undefined,
    endTime: row.EndTime?.trim() || undefined,
    active: parseBoolean(row.Active),
    order: parseOrder(row.Order),
  };
}

// Fetch and parse CSV from URL
async function fetchAndParseCSV(url: string, revalidateSeconds: number): Promise<TickerCSVRow[]> {
  const response = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ticker CSV: ${response.status} ${response.statusText}`);
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
  }) as TickerCSVRow[];

  return records;
}

// Main function to get ticker messages from CSV
export async function getTickerMessagesFromCSV(): Promise<TickerMessage[]> {
  try {
    const url = process.env.OAKS_TICKER_CSV_URL;
    
    if (!url) {
      console.log('OAKS_TICKER_CSV_URL not set, ticker will not display messages from CSV');
      return [];
    }

    const revalidateSecondsStr = process.env.OAKS_MENU_REVALIDATE_SECONDS || '300';
    const revalidateSeconds = parseInt(revalidateSecondsStr, 10);
    
    // Validate parsed value
    const validRevalidate = isNaN(revalidateSeconds) || revalidateSeconds < 0 
      ? 300 
      : revalidateSeconds;

    const records = await fetchAndParseCSV(url, validRevalidate);

    // Filter and process ticker messages
    const messages = records
      .map(row => rowToTickerMessage(row))
      .filter(ticker => {
        // Must have a message
        if (!ticker.message) return false;
        
        // Must be active
        if (!ticker.active) return false;
        
        // Must satisfy date/time windows
        if (!isTickerMessageValid(ticker)) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by order ascending, then by message
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.message.localeCompare(b.message);
      });

    return messages;
  } catch (error) {
    console.error('Error fetching ticker messages from CSV:', error);
    return [];
  }
}
