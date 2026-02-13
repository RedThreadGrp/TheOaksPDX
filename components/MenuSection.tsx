import type { MenuSection as MenuSectionType } from '@/lib/schemas';
import MenuItem from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
}

export default function MenuSection({ section }: MenuSectionProps) {
  return (
    <section className="mb-12 print-break-inside-avoid">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
        {section.description && (
          <p className="text-gray-600">{section.description}</p>
        )}
      </div>
      <div className="space-y-6">
        {section.items.map((item, index) => (
          <MenuItem key={`${section.id}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}
