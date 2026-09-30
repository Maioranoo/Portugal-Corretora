export interface BusinessHours {
  timeZone: string;
  openHour: number;
  closeHour: number;
  days: readonly number[]; // 0 = domingo … 6 = sábado
}

export const DEFAULT_HOURS: BusinessHours = {
  timeZone: 'America/Sao_Paulo',
  openHour: 8,
  closeHour: 20,
  days: [1, 2, 3, 4, 5],
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function isWithinBusinessHours(date: Date, hours: BusinessHours = DEFAULT_HOURS): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: hours.timeZone,
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const day = WEEKDAYS.indexOf(parts.find((p) => p.type === 'weekday')?.value ?? '');
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  return hours.days.includes(day) && hour >= hours.openHour && hour < hours.closeHour;
}
