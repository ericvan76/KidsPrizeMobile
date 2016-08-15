const DAY_IN_MS = 24 * 60 * 60 * 1000;

const WEEKDAY_NAMES = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

export const today = () => {
  let dt = new Date();
  let dateStr = dt.toLocaleDateString('en-US', {year: 'numeric'}) + '-' + dt.toLocaleDateString('en-US', {month: '2-digit'}) + '-' + dt.toLocaleDateString('en-US', {day: '2-digit'});
  return new Date(dateStr);
};
export const thisWeek = () => {
  return firstDayOfWeek(today());
};
export const addDays = (date, count) => {
  if (date === undefined) {
    return undefined;
  }
  return new Date(date.valueOf() + count * DAY_IN_MS);
};
export const firstDayOfWeek = (date) => {
  if (date === undefined) {
    return undefined;
  }
  return addDays(date, -1 * date.getDay());
};
export const isFirstDayOfWeek = (date) => {
  if (date === undefined) {
    return undefined;
  }
  return firstDayOfWeek(date).valueOf() === date.valueOf();
};
export const getWeekDayName = (index) => {
  return WEEKDAY_NAMES[index];
};
export const substractAsDays = (d1, d2) => {
  if (d1 === undefined || d2 === undefined) {
    return undefined;
  }
  let diff = d1.valueOf() - d2.valueOf();
  if (diff < 0) {
    return -1 * Math.floor(Math.abs(diff) / DAY_IN_MS);
  }
  return Math.floor(diff / DAY_IN_MS);
};
