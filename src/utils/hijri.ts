import { HijriDate } from '../types';
import { getJulianDate } from './astronomy';

export const HIJRI_MONTHS = [
  { no: 1, id: "Muharram", ar: "محرم" },
  { no: 2, id: "Safar", ar: "صفر" },
  { no: 3, id: "Rabi'ul Awwal", ar: "ربيع الأول" },
  { no: 4, id: "Rabi'ul Akhir", ar: "ربيع الآخر" },
  { no: 5, id: "Jumadil Awwal", ar: "جمادى الأولى" },
  { no: 6, id: "Jumadil Akhir", ar: "جمادى الآخرة" },
  { no: 7, id: "Rajab", ar: "رجب" },
  { no: 8, id: "Sya'ban", ar: "شعبان" },
  { no: 9, id: "Ramadhan", ar: "رمضان" },
  { no: 10, id: "Syawwal", ar: "شوال" },
  { no: 11, id: "Dzulqa'dah", ar: "ذو القعدة" },
  { no: 12, id: "Dzulhijjah", ar: "ذو الحجة" },
];

export const PASARAN_NAMES = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'] as const;
export const HARI_INDONESIA = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
export const HARI_ARAB = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// Calculate Javanese Pasaran day
export function getPasaran(date: Date): 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon' {
  const jd = Math.floor(getJulianDate(date) + 0.5);
  // Reference calibration: JD 2451545 (2000-01-01) was Sabtu Pahing
  const pasaranIdx = (jd + 1) % 5;
  const list: ('Wage' | 'Kliwon' | 'Legi' | 'Pahing' | 'Pon')[] = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'];
  return list[pasaranIdx >= 0 ? pasaranIdx : pasaranIdx + 5];
}

// Gregorian to Hijri calculation (Kuwaiti algorithm + MABIMS adjustment)
export function gregorianToHijri(date: Date, adjustmentDays = 0): HijriDate {
  const adjustedDate = new Date(date.getTime() + adjustmentDays * 86400000);
  const jd = getJulianDate(adjustedDate);

  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const lPrime = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - lPrime) / 5316) * Math.floor((50 * lPrime) / 17719) +
    Math.floor(lPrime / 5670) * Math.floor((43 * lPrime) / 15238);
  const lDoublePrime =
    lPrime -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const m = Math.floor((24 * lDoublePrime) / 709);
  const day = Math.floor(lDoublePrime - Math.floor((709 * m) / 24));
  const year = Math.floor(30 * n + j - 30);
  const month = m;

  const safeMonth = Math.min(12, Math.max(1, month));
  const monthObj = HIJRI_MONTHS[safeMonth - 1];

  const dayOfWeek = adjustedDate.getDay();
  const pasaran = getPasaran(adjustedDate);

  return {
    day: Math.max(1, Math.min(30, day)),
    month: safeMonth,
    monthName: monthObj.id,
    monthNameAr: monthObj.ar,
    year,
    pasaran,
    dayNameId: HARI_INDONESIA[dayOfWeek],
    dayNameAr: HARI_ARAB[dayOfWeek],
    formatted: `${day} ${monthObj.id} ${year} H`,
  };
}

// Hijri to Gregorian conversion
export function hijriToGregorian(day: number, month: number, year: number): Date {
  const jd =
    Math.floor((11 * year + 3) / 30) +
    354 * year +
    30 * month -
    Math.floor((month - 1) / 2) +
    day +
    1948440 -
    385;

  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const gDay = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const gMonth = j + 2 - 12 * l;
  const gYear = 100 * (n - 49) + i + l;

  return new Date(gYear, gMonth - 1, gDay);
}
