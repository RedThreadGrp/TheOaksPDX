import type { SpecialsData } from '@/lib/specials/sheetsSpecialsCsv';

interface SpecialsStripProps {
  specialsData: SpecialsData;
}

export default function SpecialsStrip({ specialsData }: SpecialsStripProps) {
  const { specials } = specialsData;

  if (!specials || specials.length === 0) {
    return null;
  }

  // Determine layout: stack for 1-2 items, horizontal scroll for 3+
  const useHorizontalScroll = specials.length >= 3;

  return (
    <section className="py-12 bg-gradient-to-br from-gold/10 via-cream to-gold/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-oak-brown mb-2">
            Today's Specials
          </h2>
          <p className="text-gray-600 text-lg">
            Limited time offers you don't want to miss
          </p>
        </div>

        {useHorizontalScroll ? (
          // Horizontal scroll layout for 3+ specials
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
              {specials.map((special) => (
                <div
                  key={special.id}
                  className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-auto snap-center"
                >
                  <SpecialCard special={special} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Vertical stack for 1-2 specials
          <div className="max-w-2xl mx-auto space-y-6">
            {specials.map((special) => (
              <SpecialCard key={special.id} special={special} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface SpecialCardProps {
  special: SpecialsData['specials'][0];
}

function SpecialCard({ special }: SpecialCardProps) {
  // Truncate description to ~140 characters
  const truncateDescription = (text: string | undefined, maxLength: number = 140) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const typeColors = {
    food: 'bg-oak-brown text-cream',
    drinks: 'bg-deep-green text-cream',
    event: 'bg-gold text-oak-brown',
    happyhour: 'bg-warm-charcoal text-gold',
    other: 'bg-gray-600 text-white',
  };

  const typeColor = typeColors[special.type] || typeColors.other;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      {/* Badge */}
      {special.badge && (
        <div className="px-6 pt-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${typeColor}`}>
            {special.badge}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-oak-brown mb-3">
            {special.title}
          </h3>
          
          {special.description && (
            <p className="text-gray-600 leading-relaxed mb-4">
              {truncateDescription(special.description, 160)}
            </p>
          )}
        </div>

        {/* Price at bottom */}
        {special.price && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-2xl font-bold text-gold">
              {special.price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
