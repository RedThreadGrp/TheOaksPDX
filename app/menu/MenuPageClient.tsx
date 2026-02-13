'use client';

import { useState } from 'react';
import MenuSection from '@/components/MenuSection';
import { trackEvent } from '@/lib/analytics';
import type { Menu } from '@/lib/content';

interface MenuPageClientProps {
  menu: Menu;
}

export default function MenuPageClient({ menu }: MenuPageClientProps) {
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
          <h1 className="text-4xl md:text-5xl font-bold text-oak-brown mb-4">Food Menu</h1>
          <p className="text-lg text-gray-600">
            Our menu is being updated. Please call us at{' '}
            <a href="tel:503-232-1728" className="text-deep-green hover:text-oak-brown">
              503-232-1728
            </a>{' '}
            for current offerings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-oak-brown text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Food Menu</h1>
            {menu.lastUpdatedISO && (
              <p className="text-cream/80">
                Last updated: {new Date(menu.lastUpdatedISO).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Dietary Filters */}
          <div className="mb-12 no-print sticky top-16 bg-cream py-4 z-10 border-b border-gold/30">
            <div className="flex flex-wrap gap-3 justify-center">
              {dietaryFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-deep-green text-white shadow-md'
                      : 'bg-white text-oak-brown hover:bg-oak-brown hover:text-white shadow-sm'
                  }`}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
            {selectedFilter && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="text-sm text-deep-green hover:text-oak-brown font-semibold"
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
              <div className="text-center py-16">
                <p className="text-lg text-gray-600">No items match your dietary preferences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
