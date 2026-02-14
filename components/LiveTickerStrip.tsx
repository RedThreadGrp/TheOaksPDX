'use client';

export default function LiveTickerStrip() {
  // Duplicate content for seamless loop
  const tickerItems = [
    '🍺 Happy Hour Mon–Fri 3–6pm',
    '🥣 Fresh Clam Chowder Fridays',
    '🎸 Live Music This Saturday',
  ];

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
            key={index}
            className="inline-block px-8 text-cream/90 text-sm md:text-base font-medium"
          >
            {item}
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
