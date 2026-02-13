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
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`flex h-3 w-3 relative`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOpen ? 'bg-green-400' : 'bg-red-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            isOpen ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </span>
      <span className="font-semibold">
        {isOpen ? 'Open Now' : 'Closed'}
      </span>
      <span className="text-sm text-gray-600">
        {isOpen ? `until ${formatHours(todayHours).split(' - ')[1]}` : `Opens ${formatHours(todayHours).split(' - ')[0]}`}
      </span>
    </div>
  );
}
