import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { AtomicClockBar } from './components/AtomicClockBar';
import { PrayerTimesCard } from './components/PrayerTimesCard';
import { DesktopNav } from './components/DesktopNav';
import { KemenagLogo } from './components/KemenagLogo';

// Modals
import { AtomicSyncModal } from './components/modals/AtomicSyncModal';
import { LocationModal } from './components/modals/LocationModal';
import { QiblaModal } from './components/modals/QiblaModal';
import { QiblaCertificateModal } from './components/modals/QiblaCertificateModal';
import { MoonAndHilalModal } from './components/modals/MoonAndHilalModal';
import { MonthlyScheduleModal } from './components/modals/MonthlyScheduleModal';
import { EphemerisModal } from './components/modals/EphemerisModal';
import { HijriConverterModal } from './components/modals/HijriConverterModal';
import { PreferencesModal } from './components/modals/PreferencesModal';
import { DeveloperModal } from './components/modals/DeveloperModal';
import { DateModal } from './components/modals/DateModal';
import { PrayerAlertsModal } from './components/modals/PrayerAlertsModal';

import { DEFAULT_LOCATION } from './data/indonesianCities';
import {
  AtomicSyncState,
  CalculationPreferences,
  LocationInfo,
} from './types';
import {
  atomicTimeEngine,
  formatAtomicTime,
} from './utils/atomicTime';
import {
  calculateMoonInfo,
  calculatePrayerTimes,
  calculateQibla,
  checkCrescentVisibility,
  computeSunEphemeris,
} from './utils/astronomy';
import { gregorianToHijri } from './utils/hijri';
import { playAdzanChime, playAtomicTick } from './utils/audio';
import { ShieldCheck, Sparkles, Heart, FileCheck2, Mail, MapPin } from 'lucide-react';

export default function App() {
  // Theme state: dark mode & classic retro accurate times theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('akurat_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [classicTheme, setClassicTheme] = useState<boolean>(false);

  // Sync dark mode class to html document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('akurat_dark_mode', String(darkMode));
  }, [darkMode]);

  // Observer Location (Default to Lombok Barat as specified!)
  const [location, setLocation] = useState<LocationInfo>(() => {
    const saved = localStorage.getItem('akurat_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_LOCATION;
  });

  const handleSelectLocation = (loc: LocationInfo) => {
    setLocation(loc);
    localStorage.setItem('akurat_location', JSON.stringify(loc));
  };

  // Calculation Preferences
  const [preferences, setPreferences] = useState<CalculationPreferences>({
    method: 'KEMENAG',
    fajrAngle: 20,
    ishaAngle: 18,
    asrJuristic: 'STANDARD',
    ihtiyatMinutes: 2,
    highLatitudeRule: 'NONE',
    useElevationDip: true,
    timeFormat24h: true,
    showMilliseconds: true,
    playAdzanSound: true,
    playAtomicTick: false,
  });

  const handleUpdatePreferences = (updated: Partial<CalculationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  // Sound master toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Observation Date (can be overridden by user or real-time)
  const [manualObservationDate, setManualObservationDate] = useState<Date | null>(null);

  // Atomic Sync Engine State
  const [atomicState, setAtomicState] = useState<AtomicSyncState>(atomicTimeEngine.getState());

  useEffect(() => {
    const unsubscribe = atomicTimeEngine.subscribe((state) => {
      setAtomicState(state);
    });
    // Trigger initial background sync
    atomicTimeEngine.synchronize();
    return unsubscribe;
  }, []);

  // Live atomic ticker with high-frequency animation loop
  const [currentAtomicMs, setCurrentAtomicMs] = useState<number>(() => atomicTimeEngine.getAtomicTimestamp());
  const prevSecondRef = useRef<number>(-1);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const nowMs = atomicTimeEngine.getAtomicTimestamp();
      setCurrentAtomicMs(nowMs);

      // Check top of second for atomic tick if enabled
      const sec = Math.floor(nowMs / 1000) % 60;
      if (sec !== prevSecondRef.current) {
        prevSecondRef.current = sec;
        if (soundEnabled && preferences.playAtomicTick) {
          // Play tick on every second, higher pitch on 00
          playAtomicTick(sec === 0);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [soundEnabled, preferences.playAtomicTick]);

  // Formatted current time string
  const currentTimeFormatted = useMemo(() => {
    return formatAtomicTime(
      currentAtomicMs,
      location.timezoneOffset,
      preferences.showMilliseconds
    );
  }, [currentAtomicMs, location.timezoneOffset, preferences.showMilliseconds]);

  // Current effective Date
  const effectiveDate = useMemo(() => {
    if (manualObservationDate) return manualObservationDate;
    const utc = currentAtomicMs + new Date(currentAtomicMs).getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * location.timezoneOffset);
  }, [currentAtomicMs, location.timezoneOffset, manualObservationDate]);

  // Astronomical hisab computations
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(effectiveDate, location, preferences);
  }, [effectiveDate, location, preferences]);

  const hijriDate = useMemo(() => {
    return gregorianToHijri(effectiveDate);
  }, [effectiveDate]);

  const sunEphemeris = useMemo(() => {
    return computeSunEphemeris(effectiveDate, location);
  }, [effectiveDate, location]);

  const moonInfo = useMemo(() => {
    return calculateMoonInfo(effectiveDate, location);
  }, [effectiveDate, location]);

  const hilalResult = useMemo(() => {
    return checkCrescentVisibility(effectiveDate, location);
  }, [effectiveDate, location]);

  const qiblaInfo = useMemo(() => {
    return calculateQibla(location);
  }, [location]);

  // Modals state
  const [isAtomicModalOpen, setIsAtomicModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isQiblaModalOpen, setIsQiblaModalOpen] = useState(false);
  const [isQiblaCertOpen, setIsQiblaCertOpen] = useState(false);
  const [isMoonModalOpen, setIsMoonModalOpen] = useState(false);
  const [isEphemerisModalOpen, setIsEphemerisModalOpen] = useState(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [isHijriModalOpen, setIsHijriModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPrayerAlertsModalOpen, setIsPrayerAlertsModalOpen] = useState(false);

  // Handle URL query parameters for direct print / modal navigation (e.g. from standalone tab)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const printTarget = params.get('print');
      const modalTarget = params.get('modal');

      if (printTarget === 'monthly' || modalTarget === 'monthly') {
        setIsMonthlyModalOpen(true);
        if (printTarget === 'monthly') {
          const timer = setTimeout(() => {
            try {
              window.print();
            } catch {
              // silent
            }
          }, 800);
          return () => clearTimeout(timer);
        }
      } else if (printTarget === 'qibla' || modalTarget === 'qibla') {
        setIsQiblaCertOpen(true);
        if (printTarget === 'qibla') {
          const timer = setTimeout(() => {
            try {
              window.print();
            } catch {
              // silent
            }
          }, 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // silent
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      classicTheme
        ? 'bg-slate-300 text-slate-900 font-sans'
        : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        classicTheme={classicTheme}
        onToggleClassicTheme={() => setClassicTheme(!classicTheme)}
        atomicState={atomicState}
        onQuickSync={() => atomicTimeEngine.synchronize()}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
        onOpenAtomicModal={() => setIsAtomicModalOpen(true)}
        onOpenQiblaCertificate={() => setIsQiblaCertOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Retro Title Banner if classic theme enabled */}
        {classicTheme && (
          <div className="bg-slate-200 border-2 border-slate-400 p-3 rounded mb-4 text-center shadow-md">
            <div className="bg-yellow-300 border-2 border-blue-800 text-blue-900 font-extrabold text-xl sm:text-2xl px-4 py-2 uppercase tracking-wider mb-2 flex items-center justify-center gap-3">
              <KemenagLogo className="w-8 h-8 shrink-0" />
              <span>Kementerian Agama RI - Accurate Times 5.7 ID</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="bg-green-600 text-white font-extrabold text-sm sm:text-base px-5 py-1.5 border border-slate-700 w-full sm:w-auto">
                KUA Kec. Gerung, Kab. Lombok Barat
              </div>
              <div className="bg-green-600 text-white italic font-bold text-sm px-5 py-1.5 border border-slate-700 w-full sm:w-auto">
                Pengembang: Husni, S. Kom. I (Penyuluh Agama Islam)
              </div>
            </div>
          </div>
        )}

        {/* Hero Atomic Digital Clock Bar */}
        <AtomicClockBar
          currentTimeFormatted={currentTimeFormatted}
          currentDate={effectiveDate}
          hijriDate={hijriDate}
          location={location}
          atomicState={atomicState}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onOpenAtomicModal={() => setIsAtomicModalOpen(true)}
          onSyncNow={() => atomicTimeEngine.synchronize()}
          classicTheme={classicTheme}
        />

        {/* Today's Prayer Times Card */}
        <PrayerTimesCard
          prayerTimes={prayerTimes}
          location={location}
          currentDate={effectiveDate}
          onOpenMonthlyModal={() => setIsMonthlyModalOpen(true)}
          onTestAdzan={() => playAdzanChime()}
          classicTheme={classicTheme}
        />

        {/* Desktop Modules Grid */}
        <DesktopNav
          onOpenPreferences={() => setPreferencesModalOpen(true)}
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onOpenDate={() => setIsDateModalOpen(true)}
          onOpenPrayerAlerts={() => setIsPrayerAlertsModalOpen(true)}
          onOpenMonthlySchedule={() => setIsMonthlyModalOpen(true)}
          onOpenMoonTimes={() => setIsMoonModalOpen(true)}
          onOpenMoonPhases={() => setIsMoonModalOpen(true)}
          onOpenCrescentVisibility={() => setIsMoonModalOpen(true)}
          onOpenEphemeris={() => setIsEphemerisModalOpen(true)}
          onOpenQiblah={() => setIsQiblaModalOpen(true)}
          onOpenQiblaCertificate={() => setIsQiblaCertOpen(true)}
          onOpenHijriConverter={() => setIsHijriModalOpen(true)}
          onOpenAtomicSync={() => setIsAtomicModalOpen(true)}
          onOpenDeveloperInfo={() => setIsDeveloperModalOpen(true)}
          classicTheme={classicTheme}
        />

        {/* Highlight strip for Hilal & Qibla Quick Summary with Certificate Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Quick Hilal Summary */}
          <div
            onClick={() => setIsMoonModalOpen(true)}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Status Visibilitas Hilal (Kemenag & MABIMS)
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{hilalResult.isMabimsMet ? 'Memenuhi Kriteria MABIMS' : 'Belum Memenuhi MABIMS'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  hilalResult.isMabimsMet
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  Tinggi: {hilalResult.hilalAltitude}° • Elongasi: {hilalResult.elongation}°
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fase: {moonInfo.phaseNameId} ({moonInfo.illumination}% cahaya)
              </p>
            </div>
            <div className="text-emerald-600 font-semibold text-xs ml-3 shrink-0">
              Lihat Hilal →
            </div>
          </div>

          {/* Quick Qibla & Certificate Action */}
          <div
            onClick={() => setIsQiblaCertOpen(true)}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer flex items-center justify-between shadow-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Arah Kiblat {location.name}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                  Sertifikat PDF
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="font-mono text-base text-teal-700 dark:text-teal-300">{qiblaInfo.azimuthDegrees}°</span>
                <span className="text-xs text-slate-600 dark:text-slate-300">({qiblaInfo.azimuthCompass})</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jarak Ka'bah: {qiblaInfo.distanceKm.toLocaleString('id-ID')} km • Klik untuk buat sertifikat
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-xs ml-3 shrink-0">
              <FileCheck2 className="w-4 h-4" />
              <span>Cetak Sertifikat →</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer with Full Developer & Kemenag Information */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
                <KemenagLogo className="w-10 h-10 shrink-0" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  Akurat Time Indonesia v5.7 ID
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aplikasi Penentu Waktu Sholat Akurat & Kalibrasi Arah Kiblat Standar Kementerian Agama RI
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <button
                onClick={() => setIsQiblaCertOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                Cetak Sertifikat Kiblat (PDF)
              </button>
              <button
                onClick={() => setIsMonthlyModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Jadwal Imsakiyah (PDF)
              </button>
              <button
                onClick={() => setIsDeveloperModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Kontak Pengembang
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              <strong>Pengembang:</strong> Husni, S. Kom. I • Penyuluh Agama Islam, KUA Kecamatan Gerung, Kementerian Agama Kabupaten Lombok Barat
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-emerald-600" />
              <a href="mailto:kuagerung2025@gmail.com" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                kuagerung2025@gmail.com
              </a>
              <span>•</span>
              <span>Jl. Gatot Subroto Gerung Utara</span>
            </div>
          </div>
        </div>
      </footer>

      {/* All Modal Dialogs */}
      <AtomicSyncModal
        isOpen={isAtomicModalOpen}
        onClose={() => setIsAtomicModalOpen(false)}
        atomicState={atomicState}
        onSync={(source) => atomicTimeEngine.synchronize(source)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={handleSelectLocation}
      />

      <QiblaModal
        isOpen={isQiblaModalOpen}
        onClose={() => setIsQiblaModalOpen(false)}
        qibla={qiblaInfo}
        location={location}
        onOpenCertificate={() => setIsQiblaCertOpen(true)}
      />

      <QiblaCertificateModal
        isOpen={isQiblaCertOpen}
        onClose={() => setIsQiblaCertOpen(false)}
        qibla={qiblaInfo}
        location={location}
        currentDate={effectiveDate}
      />

      <MoonAndHilalModal
        isOpen={isMoonModalOpen}
        onClose={() => setIsMoonModalOpen(false)}
        moon={moonInfo}
        hilal={hilalResult}
        location={location}
      />

      <MonthlyScheduleModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        location={location}
        preferences={preferences}
        currentDate={effectiveDate}
      />

      <EphemerisModal
        isOpen={isEphemerisModalOpen}
        onClose={() => setIsEphemerisModalOpen(false)}
        sun={sunEphemeris}
        moon={moonInfo}
        location={location}
        currentDate={effectiveDate}
      />

      <HijriConverterModal
        isOpen={isHijriModalOpen}
        onClose={() => setIsHijriModalOpen(false)}
        currentDate={effectiveDate}
      />

      <PreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        onOpenQiblaCertificate={() => setIsQiblaCertOpen(true)}
      />

      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentDate={effectiveDate}
        onSelectDate={(d) => setManualObservationDate(d)}
        onResetToNow={() => setManualObservationDate(null)}
      />

      <PrayerAlertsModal
        isOpen={isPrayerAlertsModalOpen}
        onClose={() => setIsPrayerAlertsModalOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

    </div>
  );
}
