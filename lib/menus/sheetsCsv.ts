import { parse } from 'csv-parse/sync';
import type { MenuItem as MenuItemType } from '@/lib/schemas';
import { getFoodMenu, getDrinksMenu } from '@/lib/content';

export type MenuSection = {
  id: string;
  title: string;
  description?: string;
  items: MenuItemType[];
};

export type MenuData = {
  lastUpdatedISO: string;
  sections: MenuSection[];
};

// CSV column interface
interface CSVRow {
  SectionId: string;
  SectionTitle: string;
  Name: string;
  Description: string;
  Price: string;
  Dietary: string;
  Spicy: string;
  AddOns: string;
  Active: string;
  Featured: string;
  Order: string;
}

// Parse Active column
function parseActive(value: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(normalized);
}

// Parse Spicy column
function parseSpicy(value: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(normalized);
}

// Parse Dietary column
function parseDietary(value: string): Array<'v' | 'vg' | 'gf' | 'df' | 'n'> {
  if (!value) return [];
  const validDietaryOptions = ['v', 'vg', 'gf', 'df', 'n'];
  return value
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(item => item && validDietaryOptions.includes(item)) as Array<'v' | 'vg' | 'gf' | 'df' | 'n'>;
}

// Parse Order column
function parseOrder(value: string): number {
  if (!value) return 999999;
  const parsed = parseInt(value.trim(), 10);
  return isNaN(parsed) ? 999999 : parsed;
}

// Parse AddOns column (conservative approach)
// Expected format: "Name (+$2), Name2 (+$3)" or "Name ($2), Name2 ($3)"
function parseAddOns(value: string): Array<{ name: string; price: string }> | undefined {
  if (!value || !value.trim()) return undefined;
  
  // Try to parse pattern like "Name (+$2)" or "Name ($2)"
  const addOnPattern = /([^(]+)\s*\(\+?\$?([\d.]+)\)/g;
  const matches = [...value.matchAll(addOnPattern)];
  
  if (matches.length === 0) {
    // If no matches, don't parse - return undefined
    return undefined;
  }
  
  return matches.map(match => ({
    name: match[1].trim(),
    price: `$${match[2]}`,
  }));
}

// Convert CSV row to MenuItem
function rowToMenuItem(row: CSVRow, order: number): MenuItemType {
  const item: MenuItemType = {
    name: row.Name?.trim() || '',
    description: row.Description?.trim() || undefined,
    price: row.Price?.trim() || undefined,
  };

  const dietary = parseDietary(row.Dietary);
  if (dietary.length > 0) {
    item.dietary = dietary;
  }

  const spicy = parseSpicy(row.Spicy);
  if (spicy) {
    item.spicy = true;
  }

  const addOns = parseAddOns(row.AddOns);
  if (addOns) {
    item.addOns = addOns;
  }

  return item;
}

// Group and sort rows into sections
function groupIntoSections(rows: Array<{ row: CSVRow; order: number }>): MenuSection[] {
  // Group by SectionId
  const sectionMap = new Map<string, {
    id: string;
    title: string;
    description?: string;
    items: Array<{ item: MenuItemType; order: number }>;
    minOrder: number;
  }>();

  for (const { row, order } of rows) {
    const sectionId = row.SectionId?.trim();
    const sectionTitle = row.SectionTitle?.trim();
    
    if (!sectionId || !sectionTitle) continue;

    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, {
        id: sectionId,
        title: sectionTitle,
        items: [],
        minOrder: order,
      });
    }

    const section = sectionMap.get(sectionId)!;
    section.items.push({
      item: rowToMenuItem(row, order),
      order,
    });
    
    // Update minOrder for section sorting
    if (order < section.minOrder) {
      section.minOrder = order;
    }
  }

  // Convert to array and sort sections
  const sections = Array.from(sectionMap.values()).sort((a, b) => {
    if (a.minOrder !== b.minOrder) {
      return a.minOrder - b.minOrder;
    }
    return a.title.localeCompare(b.title);
  });

  // Sort items within each section and extract final items
  return sections.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description,
    items: section.items
      .sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.item.name.localeCompare(b.item.name);
      })
      .map(({ item }) => item),
  }));
}

// Fetch and parse CSV from URL
async function fetchAndParseCSV(url: string, revalidateSeconds: number): Promise<CSVRow[]> {
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
    // Handle quoted commas and special characters
    quote: '"',
    escape: '"',
  }) as CSVRow[];

  return records;
}

// Main function to get menu from Sheets
async function getMenuFromSheets(
  url: string,
  fallbackFn: () => MenuData
): Promise<MenuData> {
  try {
    const revalidateSecondsStr = process.env.OAKS_MENU_REVALIDATE_SECONDS || '300';
    const revalidateSeconds = parseInt(revalidateSecondsStr, 10);
    
    // Validate parsed value
    if (isNaN(revalidateSeconds) || revalidateSeconds < 0) {
      console.warn(`Invalid OAKS_MENU_REVALIDATE_SECONDS value: ${revalidateSecondsStr}, using default 300`);
      const records = await fetchAndParseCSV(url, 300);
      return processRecords(records, fallbackFn);
    }

    const records = await fetchAndParseCSV(url, revalidateSeconds);
    return processRecords(records, fallbackFn);
  } catch (error) {
    console.error('Error fetching menu from Sheets:', error);
    console.log('Falling back to hardcoded menu');
    return fallbackFn();
  }
}

// Helper to process records into MenuData
function processRecords(records: CSVRow[], fallbackFn: () => MenuData): MenuData {
  // Filter active rows and parse
  const activeRows = records
    .filter(row => parseActive(row.Active))
    .map(row => ({
      row,
      order: parseOrder(row.Order),
    }));

  if (activeRows.length === 0) {
    console.warn('No active rows found in CSV, falling back to hardcoded menu');
    return fallbackFn();
  }

  const sections = groupIntoSections(activeRows);

  return {
    lastUpdatedISO: new Date().toISOString(),
    sections,
  };
}

// Export public functions
export async function getFoodMenuFromSheets(): Promise<MenuData> {
  const url = process.env.OAKS_FOOD_CSV_URL;
  
  if (!url) {
    console.warn('OAKS_FOOD_CSV_URL not set, using hardcoded menu');
    return getFoodMenu();
  }

  return getMenuFromSheets(url, getFoodMenu);
}

export async function getDrinksMenuFromSheets(): Promise<MenuData> {
  const url = process.env.OAKS_DRINKS_CSV_URL;
  
  if (!url) {
    console.warn('OAKS_DRINKS_CSV_URL not set, using hardcoded menu');
    return getDrinksMenu();
  }

  return getMenuFromSheets(url, getDrinksMenu);
}
