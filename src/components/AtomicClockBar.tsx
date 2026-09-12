import React from 'react';
import { MapPin, RefreshCw, Radio, CheckCircle2, AlertCircle, ChevronRight, Zap } from 'lucide-react';
import { AtomicSyncState, HijriDate, LocationInfo } from '../types';

interface AtomicClockBarProps {
  currentTimeFormatted: {
    hoursStr: string;
    minutesStr: string;
    secondsStr: string;
    millisStr: string;
    timeZoneLabel: string;
  };
  currentDate: Date;
  hijriDate: HijriDate;
  location: LocationInfo;
  atomicState: AtomicSyncState;
  onOpenLocationModal: () => void;
  onOpenAtomicModal: () => void;
  onSyncNow: () => void;
  classicTheme?: boolean;
}

export const AtomicClockBar: React.FC<AtomicClockBarProps> = ({
  currentTimeFormatted,
  currentDate,
  hijriDate,
  location,
  atomicState,
  onOpenLocationModal,
  onOpenAtomicModal,
  onSyncNow,
  classicTheme = false,
}) => {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formattedDate = `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()} ${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  if (classicTheme) {
    // Retro Windows 95 / Accurate Times 5.7 exact styling
    return (
      <div className="bg-slate-200 border-2 border-slate-400 p-4 rounded text-center shadow-inner my-4">
        <div className="bg-yellow-300 border-2 border-blue-800 text-blue-900 font-bold px-4 py-1 text-sm inline-block uppercase tracking-wider mb-2">
          Today's Prayer Times
        </div>
        <div className="bg-yellow-300 border border-blue-800 text-blue-900 font-bold px-3 py-1 text-xs mx-auto max-w-xl mb-2">
          Machine's Date: {formattedDate} ( {hijriDate.day} {hijriDate.monthName} {hijriDate.year} H / {hijriDate.pasaran} )
        </div>
        <div className="bg-yellow-300 border border-blue-800 text-blue-900 font-bold px-4 py-1 text-base inline-block mb-2 font-mono">
          Machine's Time: {currentTimeFormatted.hoursStr}:{currentTimeFormatted.minutesStr}:{currentTimeFormatted.secondsStr}
          <span className="text-xs text-blue-700">.{currentTimeFormatted.millisStr}</span> ({currentTimeFormatted.timeZoneLabel})
        </div>
        <div>
          <button
            onClick={onOpenLocationModal}
            className="bg-yellow-300 border border-blue-800 text-blue-900 font-bold px-6 py-1 text-sm uppercase tracking-widest hover:bg-yellow-400 cursor-pointer shadow"
          >
            {location.name.toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Atomic Clock display */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Radio className="w-3 h-3 animate-pulse text-emerald-600 dark:text-emerald-400" />
              Waktu Atomik Standar
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              {location.timezoneName} (UTC+{location.timezoneOffset})
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <button
              onClick={onOpenAtomicModal}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>{atomicState.syncSource}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Time digits */}
          <div className="flex items-baseline gap-2">
            <div className="font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              <span>{currentTimeFormatted.hoursStr}</span>
              <span className="text-emerald-600 dark:text-emerald-400 animate-pulse">:</span>
              <span>{currentTimeFormatted.minutesStr}</span>
              <span className="text-emerald-600 dark:text-emerald-400 animate-pulse">:</span>
              <span>{currentTimeFormatted.secondsStr}</span>
            </div>

            <div className="font-mono text-lg sm:text-2xl font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
              .{currentTimeFormatted.millisStr}
            </div>

            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-center">
              {currentTimeFormatted.timeZoneLabel}
            </span>
          </div>

          {/* Dates (Masehi & Hijriah) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formattedDate}
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {hijriDate.day} {hijriDate.monthName} {hijriDate.year} H
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Pasaran: {hijriDate.pasaran}
            </span>
          </div>
        </div>

        {/* Right: Location selector & Atomic Health */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
          
          {/* Location button */}
          <button
            onClick={onOpenLocationModal}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Lokasi Observasi
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{location.name}</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({location.province})
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors ml-1" />
          </button>

          {/* Atomic Sync Action */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Drift Jam: {atomicState.offsetMs > 0 ? `+${atomicState.offsetMs}` : atomicState.offsetMs} ms</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">
                Latensi RTT: {atomicState.roundTripDelayMs} ms
              </div>
            </div>

            <button
              onClick={onSyncNow}
              disabled={atomicState.isSyncing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Sinkronkan dengan Server Jam Atom"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${atomicState.isSyncing ? 'animate-spin' : ''}`} />
              <span>{atomicState.isSyncing ? 'Sinkronisasi...' : 'Sinkronkan'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
