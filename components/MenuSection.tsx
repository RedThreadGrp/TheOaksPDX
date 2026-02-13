import type { MenuSection as MenuSectionType } from '@/lib/schemas';
import MenuItem from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
}

export default function MenuSection({ section }: MenuSectionProps) {
  return (
    <section className="mb-16 print-break-inside-avoid">
      <div className="mb-8 pb-4 border-b-2 border-gold/30">
        <h2 className="text-3xl md:text-4xl font-bold text-oak-brown mb-2">{section.title}</h2>
        {section.description && (
          <p className="text-lg text-gray-600">{section.description}</p>
        )}
      </div>
      <div className="space-y-8">
        {section.items.map((item, index) => (
          <MenuItem key={`${section.id}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}
