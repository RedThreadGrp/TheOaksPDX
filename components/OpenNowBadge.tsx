'use client';

import { isOpenNow, getTodayHours, formatHours } from '@/lib/hours';
import type { WeeklyHours } from '@/lib/schemas';

interface OpenNowBadgeProps {
  hours: WeeklyHours;
  className?: string;
}

export default function OpenNowBadge({ hours, className = '' }: OpenNowBadgeProps) {
  const isOpen = isOpenNow(hours);
  const todayHours = getTodayHours(hours);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm ${isOpen ? 'bg-deep-green' : 'bg-gray-700'} text-cream ${className}`}>
      <span className={`flex h-2 w-2 relative`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOpen ? 'bg-green-300' : 'bg-red-300'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOpen ? 'bg-white' : 'bg-red-400'
          }`}
        />
      </span>
      <span className="font-semibold">
        {isOpen ? 'OPEN NOW' : 'CLOSED'}
      </span>
    </div>
  );
}
