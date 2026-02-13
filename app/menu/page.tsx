import { getFoodMenu } from '@/lib/content';
import MenuPageClient from './MenuPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food Menu | The Oaks Pub PDX',
  description: 'View our full food menu featuring pub favorites, appetizers, entrees, and more.',
};

export default function MenuPage() {
  const menu = getFoodMenu();
  return <MenuPageClient menu={menu} />;
}
