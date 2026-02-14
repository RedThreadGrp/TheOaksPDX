import { getFoodMenuFromSheets } from '@/lib/menus/sheetsCsv';
import MenuPageClient from './MenuPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food Menu | The Oaks Pub PDX',
  description: 'View our full food menu featuring pub favorites, appetizers, entrees, and more.',
};

export default async function MenuPage() {
  const menu = await getFoodMenuFromSheets();
  return <MenuPageClient menu={menu} />;
}
