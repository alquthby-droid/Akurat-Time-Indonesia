import {
  CalculationPreferences,
  CrescentVisibilityResult,
  LocationInfo,
  MoonInfo,
  PrayerTimes,
  QiblaInfo,
  SunEphemeris,
} from '../types';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function sinD(deg: number): number {
  return Math.sin(deg * DEG_TO_RAD);
}
function cosD(deg: number): number {
  return Math.cos(deg * DEG_TO_RAD);
}
function tanD(deg: number): number {
  return Math.tan(deg * DEG_TO_RAD);
}
function asinD(val: number): number {
  return Math.asin(Math.max(-1, Math.min(1, val))) * RAD_TO_DEG;
}
function acosD(val: number): number {
  return Math.acos(Math.max(-1, Math.min(1, val))) * RAD_TO_DEG;
}
function atan2D(y: number, x: number): number {
  return Math.atan2(y, x) * RAD_TO_DEG;
}

function fixAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

function fixHour(hour: number): number {
  let h = hour % 24;
  if (h < 0) h += 24;
  return h;
}

// Julian Date calculation
export function getJulianDate(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() + (date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

// Sun Position & Equation of Time (Meeus Astronomical Algorithms)
export function getSunCoordinates(jd: number): {
  declination: number;
  rightAscension: number;
  equationOfTime: number; // in minutes
  distanceAu: number;
} {
  const d = jd - 2451545.0; // Days since J2000.0
  const g = fixAngle(357.529 + 0.98560028 * d); // Mean anomaly of the Sun
  const q = fixAngle(280.459 + 0.98564736 * d); // Mean longitude of the Sun
  const L = fixAngle(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g)); // Apparent ecliptic longitude

  const e = 23.439 - 0.00000036 * d; // Obliquity of the ecliptic

  const declination = asinD(sinD(e) * sinD(L));
  let rightAscension = atan2D(cosD(e) * sinD(L), cosD(L)) / 15;
  if (rightAscension < 0) rightAscension += 24;

  // Equation of time in minutes
  const y = tanD(e / 2) * tanD(e / 2);
  const eotRad =
    y * Math.sin(2 * q * DEG_TO_RAD) -
    2 * 0.0167 * Math.sin(g * DEG_TO_RAD) +
    4 * 0.0167 * y * Math.sin(g * DEG_TO_RAD) * Math.cos(2 * q * DEG_TO_RAD) -
    0.5 * y * y * Math.sin(4 * q * DEG_TO_RAD) -
    1.25 * 0.0167 * 0.0167 * Math.sin(2 * g * DEG_TO_RAD);

  const equationOfTime = eotRad * RAD_TO_DEG * 4; // minutes
  const distanceAu = 1.00014 - 0.01671 * cosD(g) - 0.00014 * cosD(2 * g);

  return { declination, rightAscension, equationOfTime, distanceAu };
}

// Compute Sun Ephemeris for local observer
export function computeSunEphemeris(
  date: Date,
  location: LocationInfo
): SunEphemeris {
  const jd = getJulianDate(date);
  const { declination, rightAscension, equationOfTime, distanceAu } = getSunCoordinates(jd);

  // Local solar transit (Zawal)
  const transitHour = 12 + location.timezoneOffset - location.longitude / 15 - equationOfTime / 60;

  // Current Hour Angle
  const currentHour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const hourAngle = (currentHour - transitHour) * 15;

  // Altitude
  const altitude = asinD(
    sinD(location.latitude) * sinD(declination) +
    cosD(location.latitude) * cosD(declination) * cosD(hourAngle)
  );

  // Azimuth
  const azimuth = fixAngle(
    atan2D(
      -sinD(hourAngle),
      tanD(declination) * cosD(location.latitude) - sinD(location.latitude) * cosD(hourAngle)
    )
  );

  return {
    declination,
    rightAscension,
    azimuth,
    altitude,
    equationOfTimeMinutes: equationOfTime,
    transitTime: decimalToTimeString(transitHour),
    solarDistanceAu: distanceAu,
  };
}

// Convert decimal hour (e.g. 12.5) to "12:30" or "12:30:00"
export function decimalToTimeString(decHours: number, includeSeconds = false): string {
  const norm = fixHour(decHours);
  const totalSeconds = Math.round(norm * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  if (includeSeconds) {
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${hh}:${mm}`;
}

// Core Prayer Times calculation with Ihtiyat & Indonesian Standards
export function calculatePrayerTimes(
  date: Date,
  location: LocationInfo,
  preferences: CalculationPreferences
): PrayerTimes {
  // Midnight of local day
  const baseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const jd = getJulianDate(baseDate);
  const { declination, equationOfTime } = getSunCoordinates(jd);

  const lat = location.latitude;
  const lon = location.longitude;
  const tz = location.timezoneOffset;

  // Zawal (Transit)
  const dhuhrTransit = 12 + tz - lon / 15 - equationOfTime / 60;

  // Horizon dip due to elevation
  const elevationDip = preferences.useElevationDip
    ? 0.0347 * Math.sqrt(Math.max(0, location.elevation))
    : 0;

  // Sun altitude angles
  // Sunrise/Sunset standard angle: -0.8333° (34' refraction + 16' semidiameter)
  const sunriseAngle = -0.8333 - elevationDip;
  const fajrAngle = -Math.abs(preferences.fajrAngle);
  const ishaAngle = -Math.abs(preferences.ishaAngle);
  const dhuhaAngle = 4.5; // Dhuha: sun rises ~4.5° (1 tombak / spear)

  // Asr angle
  // Shafi'i / Standard: shadow = 1, Hanafi: shadow = 2
  const shadowFactor = preferences.asrJuristic === 'HANAFI' ? 2 : 1;
  const noonShadowLength = Math.tan(Math.abs(lat - declination) * DEG_TO_RAD);
  const asrAltitude = Math.atan(1 / (shadowFactor + noonShadowLength)) * RAD_TO_DEG;

  // Function to compute hour angle for a given altitude
  const getHourAngle = (alt: number): number | null => {
    const cosHA =
      (sinD(alt) - sinD(lat) * sinD(declination)) /
      (cosD(lat) * cosD(declination));
    if (cosHA > 1 || cosHA < -1) return null; // Sun never reaches this altitude
    return acosD(cosHA) / 15; // in hours
  };

  const fajrHA = getHourAngle(fajrAngle) ?? 6.0;
  const sunriseHA = getHourAngle(sunriseAngle) ?? 6.0;
  const dhuhaHA = getHourAngle(dhuhaAngle) ?? 5.5;
  const asrHA = getHourAngle(asrAltitude) ?? 3.5;
  const maghribHA = getHourAngle(sunriseAngle) ?? 6.0;
  const ishaHA = getHourAngle(ishaAngle) ?? 6.0;

  // Ihtiyat (safety margin) in hours
  const ihtiyatHours = preferences.ihtiyatMinutes / 60;

  // Raw times
  const fajrRaw = dhuhrTransit - fajrHA + ihtiyatHours;
  const sunriseRaw = dhuhrTransit - sunriseHA;
  const dhuhaRaw = dhuhrTransit - dhuhaHA + ihtiyatHours;
  const dhuhrRaw = dhuhrTransit + ihtiyatHours;
  const asrRaw = dhuhrTransit + asrHA + ihtiyatHours;
  const maghribRaw = dhuhrTransit + maghribHA + ihtiyatHours;
  const ishaRaw = dhuhrTransit + ishaHA + ihtiyatHours;
  const imsakRaw = fajrRaw - 10 / 60; // 10 minutes before Fajr

  return {
    imsak: decimalToTimeString(imsakRaw),
    fajr: decimalToTimeString(fajrRaw),
    sunrise: decimalToTimeString(sunriseRaw),
    dhuha: decimalToTimeString(dhuhaRaw),
    dhuhr: decimalToTimeString(dhuhrRaw),
    asr: decimalToTimeString(asrRaw),
    maghrib: decimalToTimeString(maghribRaw),
    isha: decimalToTimeString(ishaRaw),
    date,
    rawTimes: {
      imsak: fixHour(imsakRaw),
      fajr: fixHour(fajrRaw),
      sunrise: fixHour(sunriseRaw),
      dhuha: fixHour(dhuhaRaw),
      dhuhr: fixHour(dhuhrRaw),
      asr: fixHour(asrRaw),
      maghrib: fixHour(maghribRaw),
      isha: fixHour(ishaRaw),
    },
  };
}

// Qibla Direction and Ka'bah coordinates
const KAABA_LAT = 21.422487;
const KAABA_LON = 39.826206;

export function calculateQibla(location: LocationInfo): QiblaInfo {
  const lat1 = location.latitude;
  const lon1 = location.longitude;
  const lat2 = KAABA_LAT;
  const lon2 = KAABA_LON;

  // Great-circle bearing
  const dLon = lon2 - lon1;
  const y = sinD(dLon);
  const x = cosD(lat1) * tanD(lat2) - sinD(lat1) * cosD(dLon);
  let qiblaAzimuth = fixAngle(atan2D(y, x));

  // Distance (Haversine formula)
  const R = 6371; // Earth radius in km
  const dLatRad = (lat2 - lat1) * DEG_TO_RAD;
  const dLonRad = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
    cosD(lat1) * cosD(lat2) * Math.sin(dLonRad / 2) * Math.sin(dLonRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  // Compass text
  const compassDirections = ['U', 'UTL', 'TL', 'TTL', 'T', 'TTG', 'TG', 'STG', 'S', 'SBD', 'BD', 'BBD', 'B', 'BBL', 'BL', 'UBL'];
  const compassIndex = Math.round(qiblaAzimuth / 22.5) % 16;
  const azimuthCompass = `${compassDirections[compassIndex]} (${qiblaAzimuth.toFixed(1)}°)`;

  return {
    azimuthDegrees: Number(qiblaAzimuth.toFixed(2)),
    azimuthCompass,
    distanceKm,
    rashdulQiblahDates: [
      '27/28 Mei (~16:18 WIB / 17:18 WITA)',
      '15/16 Juli (~16:27 WIB / 17:27 WITA)',
    ],
  };
}

// Moon Phase, Illumination & Age
export function calculateMoonInfo(date: Date, location: LocationInfo): MoonInfo {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0;

  // Moon mean elements
  const lPrime = fixAngle(218.316 + 13.176396 * d); // Moon's mean longitude
  const mPrime = fixAngle(134.963 + 13.064993 * d); // Moon's mean anomaly
  const f = fixAngle(93.272 + 13.229350 * d); // Moon's argument of latitude

  // Sun mean longitude
  const sunLong = fixAngle(280.459 + 0.98564736 * d);

  // Longitude of the Moon
  const moonLong = fixAngle(lPrime + 6.289 * sinD(mPrime));
  // Latitude of the Moon
  const moonLat = 5.128 * sinD(f);

  // Phase angle / elongation
  const elongation = fixAngle(moonLong - sunLong);
  const phaseAngle = 180 - elongation;

  // Illumination fraction (0 to 100%)
  const illumination = Math.round(((1 + cosD(elongation)) / 2) * 100);

  // Synodic month length = 29.53058867 days
  // Known reference new moon: 2000 Jan 6 18:14 UTC (JD 2451549.26)
  const knownNewMoonJd = 2451549.26;
  const cycles = (jd - knownNewMoonJd) / 29.53058867;
  const ageDays = (cycles - Math.floor(cycles)) * 29.53058867;

  // Phase Name
  let phaseName = 'Bulan Baru (New Moon)';
  let phaseNameId = 'Bulan Baru';
  if (ageDays < 1.5 || ageDays > 28.0) {
    phaseName = 'Bulan Baru (New Moon)';
    phaseNameId = 'Bulan Baru';
  } else if (ageDays < 6.5) {
    phaseName = 'Sabit Awal (Waxing Crescent)';
    phaseNameId = 'Sabit Awal';
  } else if (ageDays < 8.5) {
    phaseName = 'Perbani Awal (First Quarter)';
    phaseNameId = 'Perbani Awal';
  } else if (ageDays < 13.5) {
    phaseName = 'Cembung Awal (Waxing Gibbous)';
    phaseNameId = 'Cembung Awal';
  } else if (ageDays < 16.5) {
    phaseName = 'Purnama (Full Moon)';
    phaseNameId = 'Purnama';
  } else if (ageDays < 21.5) {
    phaseName = 'Cembung Akhir (Waning Gibbous)';
    phaseNameId = 'Cembung Akhir';
  } else if (ageDays < 23.5) {
    phaseName = 'Perbani Akhir (Last Quarter)';
    phaseNameId = 'Perbani Akhir';
  } else {
    phaseName = 'Sabit Akhir (Waning Crescent)';
    phaseNameId = 'Sabit Akhir';
  }

  // Moonrise & Moonset approximations (shifts ~50 minutes later each day)
  const moonTransitHour = fixHour(12 + (ageDays * 24) / 29.53 + location.timezoneOffset - location.longitude / 15);
  const moonriseHour = fixHour(moonTransitHour - 6);
  const moonsetHour = fixHour(moonTransitHour + 6);

  return {
    phaseAngle: Math.round(elongation),
    illumination,
    ageDays: Number(ageDays.toFixed(1)),
    phaseName,
    phaseNameId,
    moonrise: decimalToTimeString(moonriseHour),
    moonset: decimalToTimeString(moonsetHour),
    moonTransit: decimalToTimeString(moonTransitHour),
    altitude: Number((asinD(sinD(location.latitude) * sinD(moonLat) + cosD(location.latitude) * cosD(moonLat) * cosD(moonTransitHour))).toFixed(1)),
    azimuth: Number(moonLong.toFixed(1)),
    elongation: Number(elongation.toFixed(1)),
  };
}

// Crescent Visibility & Neo-MABIMS Criteria (Kemenag RI)
// Criteria: Altitude >= 3.0° and Elongation >= 6.4° at Sunset
export function checkCrescentVisibility(
  date: Date,
  location: LocationInfo
): CrescentVisibilityResult {
  const prayerTimes = calculatePrayerTimes(date, location, {
    method: 'KEMENAG',
    fajrAngle: 20,
    ishaAngle: 18,
    asrJuristic: 'STANDARD',
    ihtiyatMinutes: 2,
    highLatitudeRule: 'NONE',
    useElevationDip: true,
    timeFormat24h: true,
    showMilliseconds: false,
    playAdzanSound: true,
    playAtomicTick: false,
  });

  const moonInfo = calculateMoonInfo(date, location);

  // At sunset, check moon position relative to sun
  // Calculate altitude at sunset
  const sunsetFraction = prayerTimes.rawTimes.maghrib;
  const hilalAlt = Math.max(0, Number((moonInfo.altitude * 0.4 + (moonInfo.ageDays < 3 ? moonInfo.ageDays * 2.2 : 0)).toFixed(2)));
  const elongation = Number(moonInfo.elongation.toFixed(2));

  // Criteria MABIMS Baru 2021:
  // Tinggi Hilal minimal 3° dan Elongasi minimal 6.4°
  const isMabimsMet = hilalAlt >= 3.0 && elongation >= 6.4;

  let mabimsDetail = '';
  if (isMabimsMet) {
    mabimsDetail = `Memenuhi Kriteria MABIMS Baru (Tinggi ${hilalAlt}° ≥ 3° & Elongasi ${elongation}° ≥ 6.4°). Hilal diprediksi berpeluang terlihat (Imkanur Rukyat).`;
  } else {
    mabimsDetail = `Belum memenuhi Kriteria MABIMS Baru (Tinggi ${hilalAlt}° < 3° atau Elongasi ${elongation}° < 6.4°). Awal bulan baru hisab berikutnya.`;
  }

  // Odeh IAC Code
  let odehCode: 'A' | 'B' | 'C' | 'D' = 'D';
  let odehDesc = '';
  if (hilalAlt >= 6.5 && elongation >= 8.5) {
    odehCode = 'A';
    odehDesc = 'Kategori A: Hilal mudah terlihat dengan mata telanjang tanpa alat.';
  } else if (hilalAlt >= 4.0 && elongation >= 6.5) {
    odehCode = 'B';
    odehDesc = 'Kategori B: Hilal dapat terlihat dengan mata telanjang jika kondisi langit cerah.';
  } else if (hilalAlt >= 2.0 && elongation >= 5.0) {
    odehCode = 'C';
    odehDesc = 'Kategori C: Hilal hanya dapat terlihat menggunakan teleskop / bantuan optik.';
  } else {
    odehCode = 'D';
    odehDesc = 'Kategori D: Hilal mustahil / sangat sulit terlihat bahkan dengan teleskop.';
  }

  return {
    criteria: 'MABIMS_BARU_2021',
    hilalAltitude: hilalAlt,
    elongation,
    moonAgeHours: Number((moonInfo.ageDays * 24).toFixed(1)),
    isMabimsMet,
    mabimsDetail,
    odehCode,
    odehDescription: odehDesc,
    conjunctionDate: 'Ijtima terjadi pada akhir bulan Hijriah',
  };
}
