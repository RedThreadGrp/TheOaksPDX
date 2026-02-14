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
    <div className={`inline-flex items-center gap-2 bg-[#2b1e16] text-sm text-[#f3e6d2] px-4 py-1.5 rounded-full border border-white/10 ${className}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
      <span className="font-semibold">
        {isOpen ? `OPEN – Closes at ${todayHours.close}` : `CLOSED – Opens at ${todayHours.open}`}
      </span>
    </div>
  );
}
