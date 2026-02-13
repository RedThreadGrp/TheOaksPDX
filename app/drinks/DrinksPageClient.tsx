'use client';

import { useState } from 'react';
import MenuSection from '@/components/MenuSection';
import { trackEvent } from '@/lib/analytics';
import type { Menu } from '@/lib/content';

interface DrinksPageClientProps {
  menu: Menu;
}

export default function DrinksPageClient({ menu }: DrinksPageClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const dietaryFilters = [
    { id: 'v', label: 'Vegetarian', icon: '🌱' },
    { id: 'vg', label: 'Vegan', icon: '🌿' },
    { id: 'gf', label: 'Gluten-Free', icon: '🌾' },
    { id: 'df', label: 'Dairy-Free', icon: '🥛' },
  ];

  const handleFilterClick = (filterId: string) => {
    setSelectedFilter(selectedFilter === filterId ? null : filterId);
    trackEvent('menu_filter_used', { filter: filterId });
  };

  const filteredSections = selectedFilter
    ? menu.sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.dietary?.includes(selectedFilter as any)
        ),
      })).filter(section => section.items.length > 0)
    : menu.sections;

  if (menu.sections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Drinks Menu</h1>
          <p className="text-lg text-gray-600">
            Our drinks menu is being updated. Please call us at{' '}
            <a href="tel:503-232-1728" className="text-primary-600 hover:text-primary-700">
              503-232-1728
            </a>{' '}
            for current offerings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Drinks Menu</h1>
          {menu.lastUpdatedISO && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(menu.lastUpdatedISO).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Dietary Filters */}
        <div className="mb-8 no-print">
          <div className="flex flex-wrap gap-2 justify-center">
            {dietaryFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
          {selectedFilter && (
            <div className="text-center mt-4">
              <button
                onClick={() => setSelectedFilter(null)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Menu Sections */}
        <div>
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <MenuSection key={section.id} section={section} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No items match your dietary preferences.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
