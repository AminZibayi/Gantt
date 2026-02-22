import moment from 'moment-jalaali';

export function toJalali(date: Date | string): string {
  return moment(date).format('jYYYY/jMM/jDD');
}

export function fromJalali(jalaliDate: string): Date {
  return moment(jalaliDate, 'jYYYY/jMM/jDD').toDate();
}

export function formatJalaliDate(date: Date | string): string {
  return moment(date).format('jYYYY/jMM/jDD');
}

export function getJalaliMonthName(monthIndex: number): string {
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند',
  ];
  return months[monthIndex] || '';
}

export function gregorianToJalali(
  year: number,
  month: number,
  day: number
): [number, number, number] {
  const m = moment(
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  );
  return [m.jYear(), m.jMonth(), m.jDate()];
}
