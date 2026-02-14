import { getDrinksMenuFromSheets } from '@/lib/menus/sheetsCsv';
import DrinksPageClient from './DrinksPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drinks Menu | The Oaks Pub PDX',
  description: 'Explore our craft cocktails, local beers, wines, and spirits selection.',
};

export default async function DrinksPage() {
  const menu = await getDrinksMenuFromSheets();
  return <DrinksPageClient menu={menu} />;
}
