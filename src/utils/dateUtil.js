const DAY_IN_MS = 24 * 60 * 60 * 1000;

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const today = () => {
  const t = new Date();
  return new Date(t.setHours(0, -1 * t.getTimezoneOffset(), 0, 0));
};

const thisWeek = () => {
  return firstDayOfWeek(today());
};

const addDays = (date, count) => {
  if (date === undefined) {
    return undefined;
  }
  return new Date(date.valueOf() + count * DAY_IN_MS);
};

const firstDayOfWeek = (date) => {
  if (date === undefined) {
    return undefined;
  }
  return addDays(date, -1 * date.getDay());
};

const isFirstDayOfWeek = (date) => {
  if (date === undefined) {
    return undefined;
  }
  return firstDayOfWeek(date).valueOf() === date.valueOf();
};

const getWeekDayName = (index) => {
  return WEEKDAY_NAMES[index];
};

const substractAsDays = (d1, d2) => {
  if (d1 === undefined || d2 === undefined) {
    return undefined;
  }
  let diff = d1.valueOf() - d2.valueOf();
  if (diff < 0) {
    return -1 * Math.floor(Math.abs(diff) / DAY_IN_MS);
  }
  return Math.floor(diff / DAY_IN_MS);
};

const allDaysOfWeek = (week) => {
  const wk = new Date(week);
  return Array.from({ length: 7 }, (v, k) => k).map(i => {
    return addDays(wk, i);
  });
};

export default {
  today,
  thisWeek,
  addDays,
  firstDayOfWeek,
  isFirstDayOfWeek,
  getWeekDayName,
  substractAsDays,
  allDaysOfWeek,
};