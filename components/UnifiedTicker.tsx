'use client';

interface TickerItem {
  id: string;
  text: string;
  emoji: string;
}

interface UnifiedTickerProps {
  specialsItems: TickerItem[];
  nextEventItem: TickerItem | null;
}

export default function UnifiedTicker({ specialsItems, nextEventItem }: UnifiedTickerProps) {
  // Combine specials and next event
  const allItems = [...specialsItems];
  if (nextEventItem) {
    allItems.push(nextEventItem);
  }

  // If no items, show a default message
  const tickerItems = allItems.length > 0 
    ? allItems 
    : [{ id: 'default', text: 'Check Events for What\'s Happening', emoji: '🎉' }];

  // Create doubled content for seamless scrolling
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-warm-charcoal border-b border-gold/10 overflow-hidden h-10 flex items-center">
      <div 
        className="flex whitespace-nowrap animate-scroll"
        style={{
          animation: 'scroll 40s linear infinite',
        }}
      >
        {doubledItems.map((item, index) => (
          <span 
            key={`${item.id}-${index}`}
            className="inline-block px-8 text-cream/90 text-sm md:text-base font-medium"
          >
            {item.emoji} {item.text}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
