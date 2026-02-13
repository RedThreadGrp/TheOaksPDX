import { getDrinksMenu } from '@/lib/content';
import DrinksPageClient from './DrinksPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drinks Menu | The Oaks Pub PDX',
  description: 'Explore our craft cocktails, local beers, wines, and spirits selection.',
};

export default function DrinksPage() {
  const menu = getDrinksMenu();
  return <DrinksPageClient menu={menu} />;
}
