import type { WeeklyHours } from './schemas';

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

const DAYS: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getCurrentDay(): DayOfWeek {
  const dayIndex = new Date().getDay();
  return DAYS[dayIndex];
}

export function getTodayHours(weeklyHours: WeeklyHours) {
  const today = getCurrentDay();
  return weeklyHours[today];
}

export function isOpenNow(weeklyHours: WeeklyHours): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayHours = getTodayHours(weeklyHours);
  
  return currentTime >= todayHours.open && currentTime < todayHours.close;
}

export function formatHours(hours: { open: string; close: string }): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };
  
  return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
}

export function formatDayName(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function getNextEvent(weeklyHours: WeeklyHours): { day: DayOfWeek; hours: { open: string; close: string } } | null {
  const today = getCurrentDay();
  const todayIndex = DAYS.indexOf(today);
  
  // Check if open later today
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayHours = weeklyHours[today];
  
  if (currentTime < todayHours.open) {
    return { day: today, hours: todayHours };
  }
  
  // Check tomorrow
  const tomorrowIndex = (todayIndex + 1) % 7;
  const tomorrow = DAYS[tomorrowIndex];
  return { day: tomorrow, hours: weeklyHours[tomorrow] };
}
