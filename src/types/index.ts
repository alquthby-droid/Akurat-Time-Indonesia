export type TimezoneCode = 'WIB' | 'WITA' | 'WIT';

export interface LocationInfo {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  elevation: number; // meters above sea level
  timezoneOffset: number; // UTC offset in hours: +7, +8, or +9
  timezoneName: TimezoneCode;
  isCustom?: boolean;
}

export type CalculationMethodId = 
  | 'KEMENAG' // Kementerian Agama RI (Fajr: 20°, Isha: 18°, Ihtiyat: +2m)
  | 'IAC' // International Astronomical Center (Mohammad Odeh)
  | 'UMM_AL_QURA' // Makkah Umm al-Qura
  | 'MWL' // Muslim World League
  | 'EGYPT'; // Egyptian General Authority of Survey

export interface CalculationPreferences {
  method: CalculationMethodId;
  fajrAngle: number;
  ishaAngle: number;
  asrJuristic: 'STANDARD' | 'HANAFI'; // Standard (Shafi'i/Maliki/Hanbali) = 1, Hanafi = 2
  ihtiyatMinutes: number; // Safety buffer minutes (default: 2 for Kemenag)
  highLatitudeRule: 'NONE' | 'MIDDLE_NIGHT' | 'ONE_SEVENTH' | 'ANGLE_BASED';
  useElevationDip: boolean; // Horizon dip correction = 0.0347 * sqrt(h)
  timeFormat24h: boolean;
  showMilliseconds: boolean;
  playAdzanSound: boolean;
  playAtomicTick: boolean;
}

export interface PrayerTimes {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuha: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: Date;
  rawTimes: {
    imsak: number; // fractional hours
    fajr: number;
    sunrise: number;
    dhuha: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface NextPrayerInfo {
  name: string;
  arabicName: string;
  timeString: string;
  timeRemainingSeconds: number;
  isPassed: boolean;
  progressPercent: number;
  currentPrayerName: string;
}

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  monthNameAr: string;
  year: number;
  pasaran: 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';
  dayNameId: string;
  dayNameAr: string;
  formatted: string;
}

export interface MoonInfo {
  phaseAngle: number; // 0-360
  illumination: number; // 0-100%
  ageDays: number;
  phaseName: string;
  phaseNameId: string;
  moonrise: string;
  moonset: string;
  moonTransit: string;
  altitude: number; // degrees
  azimuth: number; // degrees
  elongation: number; // degrees from sun
}

export interface CrescentVisibilityResult {
  criteria: 'MABIMS_BARU_2021' | 'ODEH_IAC';
  hilalAltitude: number; // degrees at sunset
  elongation: number; // degrees at sunset
  moonAgeHours: number;
  isMabimsMet: boolean; // altitude >= 3° and elongation >= 6.4°
  mabimsDetail: string;
  odehCode: 'A' | 'B' | 'C' | 'D'; // A: easily visible, B: visible with optical aid, C: optical aid only, D: impossible
  odehDescription: string;
  conjunctionDate: string; // Ijtima'
}

export interface SunEphemeris {
  declination: number; // degrees
  rightAscension: number; // hours
  azimuth: number; // degrees
  altitude: number; // degrees
  equationOfTimeMinutes: number; // EoT
  transitTime: string; // True solar noon
  solarDistanceAu: number;
}

export interface QiblaInfo {
  azimuthDegrees: number; // degrees from true North
  azimuthCompass: string;
  distanceKm: number;
  rashdulQiblahDates: string[]; // Istiwa A'zam
  localDailyRashdulQiblaTime?: string; // when sun's azimuth = qibla azimuth
}

export interface AtomicSyncState {
  isSyncing: boolean;
  lastSyncTime: number | null;
  offsetMs: number; // Server - Client
  roundTripDelayMs: number;
  jitterMs: number;
  syncSource: string;
  stratum: number;
  statusText: string;
  precisionString: string;
  syncHistory: Array<{
    timestamp: number;
    offset: number;
    delay: number;
    source: string;
  }>;
}
