import fs from 'fs';
import path from 'path';

// Define types based on the schema
interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  dietary?: Array<'v' | 'vg' | 'gf' | 'df' | 'n'>;
  addOns?: Array<{ name: string; price: string }>;
  spicy?: boolean;
}

interface MenuSection {
  id: string;
  title: string;
  description?: string;
  items: MenuItem[];
}

interface Menu {
  lastUpdatedISO: string;
  showSampleMenu?: boolean;
  sections: MenuSection[];
}

// CSV row structure
interface CSVRow {
  Type: string;
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
  Order: number;
}

function escapeCSV(value: string): string {
  // Escape double quotes by doubling them
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function convertToCSV(rows: CSVRow[]): string {
  const headers = [
    'Type',
    'SectionId',
    'SectionTitle',
    'Name',
    'Description',
    'Price',
    'Dietary',
    'Spicy',
    'AddOns',
    'Active',
    'Featured',
    'Order'
  ];
  
  const csvLines = [headers.join(',')];
  
  for (const row of rows) {
    const line = [
      escapeCSV(row.Type),
      escapeCSV(row.SectionId),
      escapeCSV(row.SectionTitle),
      escapeCSV(row.Name),
      escapeCSV(row.Description),
      escapeCSV(row.Price),
      escapeCSV(row.Dietary),
      escapeCSV(row.Spicy),
      escapeCSV(row.AddOns),
      escapeCSV(row.Active),
      escapeCSV(row.Featured),
      row.Order.toString()
    ].join(',');
    csvLines.push(line);
  }
  
  return csvLines.join('\n');
}

function menuToCSVRows(menu: Menu, type: string): CSVRow[] {
  const rows: CSVRow[] = [];
  let orderCounter = 0;
  
  for (const section of menu.sections) {
    // Skip sections with no items
    if (section.items.length === 0) {
      continue;
    }
    
    for (const item of section.items) {
      const addOnsString = item.addOns
        ? item.addOns.map(ao => `${ao.name}: ${ao.price}`).join('; ')
        : '';
      
      const dietaryString = item.dietary
        ? item.dietary.join(', ')
        : '';
      
      rows.push({
        Type: type,
        SectionId: section.id,
        SectionTitle: section.title,
        Name: item.name,
        Description: item.description || '',
        Price: item.price || '',
        Dietary: dietaryString,
        Spicy: item.spicy ? 'true' : '', // Empty if not spicy or undefined
        AddOns: addOnsString,
        Active: 'true', // Default for sheets - can be edited there
        Featured: 'false', // Default for sheets - can be edited there
        Order: orderCounter++
      });
    }
  }
  
  return rows;
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content');
  const exportsDir = path.join(process.cwd(), 'exports');
  
  // Ensure exports directory exists
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  
  // Read food menu
  const foodMenuPath = path.join(contentDir, 'menu.food.json');
  const foodMenuData = fs.readFileSync(foodMenuPath, 'utf-8');
  const foodMenu: Menu = JSON.parse(foodMenuData);
  
  // Read drinks menu
  const drinksMenuPath = path.join(contentDir, 'menu.drinks.json');
  const drinksMenuData = fs.readFileSync(drinksMenuPath, 'utf-8');
  const drinksMenu: Menu = JSON.parse(drinksMenuData);
  
  // Convert to CSV rows
  const foodRows = menuToCSVRows(foodMenu, 'food');
  const drinksRows = menuToCSVRows(drinksMenu, 'drinks');
  
  // Combine all rows
  const allRows = [...foodRows, ...drinksRows];
  
  // Convert to CSV string
  const csvContent = convertToCSV(allRows);
  
  // Write combined CSV
  const combinedOutputPath = path.join(exportsDir, 'menus-combined.csv');
  fs.writeFileSync(combinedOutputPath, csvContent, 'utf-8');
  console.log(`✓ Exported combined menu to: ${combinedOutputPath}`);
  console.log(`  Total items: ${allRows.length}`);
  
  // Also write separate files
  const foodCSV = convertToCSV(foodRows);
  const foodOutputPath = path.join(exportsDir, 'menu-food.csv');
  fs.writeFileSync(foodOutputPath, foodCSV, 'utf-8');
  console.log(`✓ Exported food menu to: ${foodOutputPath}`);
  console.log(`  Food items: ${foodRows.length}`);
  
  const drinksCSV = convertToCSV(drinksRows);
  const drinksOutputPath = path.join(exportsDir, 'menu-drinks.csv');
  fs.writeFileSync(drinksOutputPath, drinksCSV, 'utf-8');
  console.log(`✓ Exported drinks menu to: ${drinksOutputPath}`);
  console.log(`  Drink items: ${drinksRows.length}`);
}

main().catch((error) => {
  console.error('Error exporting menus:', error);
  process.exit(1);
});
