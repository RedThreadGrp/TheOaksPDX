import fs from 'fs';
import path from 'path';
import {
  SiteConfigSchema,
  MenuSchema,
  EventsSchema,
  type SiteConfig,
  type Menu,
  type Events,
} from './schemas';

const contentDir = path.join(process.cwd(), 'content');

function loadAndValidateJSON<T>(filePath: string, schema: any): T {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return schema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

export function getSiteConfig(): SiteConfig {
  return loadAndValidateJSON<SiteConfig>(
    path.join(contentDir, 'site.json'),
    SiteConfigSchema
  );
}

export function getFoodMenu(): Menu {
  return loadAndValidateJSON<Menu>(
    path.join(contentDir, 'menu.food.json'),
    MenuSchema
  );
}

export function getDrinksMenu(): Menu {
  return loadAndValidateJSON<Menu>(
    path.join(contentDir, 'menu.drinks.json'),
    MenuSchema
  );
}

export function getEvents(): Events {
  return loadAndValidateJSON<Events>(
    path.join(contentDir, 'events.json'),
    EventsSchema
  );
}

// Re-export types for convenience
export type { SiteConfig, Menu, Events };
