'use client';

import { useEffect, useState } from 'react';

const messages = [
  '🍲 Fresh Clam Chowder Fridays',
  '🍻 Happy Hour Mon–Fri 3–6pm',
  '🎶 Live Music This Saturday',
  "Check Events for What's Happening"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#120e0a] border-b border-white/10 text-[#f3e6d2] text-sm tracking-wide">
      <div className="max-w-7xl mx-auto py-2 text-center transition-opacity duration-700">
        {messages[index]}
      </div>
    </div>
  );
}
