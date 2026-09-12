import React from 'react';
import {
  Clock,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  UserCheck,
  FileCheck2,
} from 'lucide-react';
import { AtomicSyncState } from '../types';
import { KemenagLogo } from './KemenagLogo';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  classicTheme: boolean;
  onToggleClassicTheme: () => void;
  atomicState: AtomicSyncState;
  onQuickSync: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenDeveloperModal: () => void;
  onOpenAtomicModal: () => void;
  onOpenQiblaCertificate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  classicTheme,
  onToggleClassicTheme,
  atomicState,
  onQuickSync,
  soundEnabled,
  onToggleSound,
  onOpenDeveloperModal,
  onOpenAtomicModal,
  onOpenQiblaCertificate,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Developer Attribution with Official Kemenag Logo */}
        <div className="flex items-center gap-3">
          {/* Official Kemenag RI Logo */}
          <button
            onClick={onOpenDeveloperModal}
            className="flex items-center group cursor-pointer hover:scale-105 transition-transform"
            title="Kementerian Agama Republik Indonesia - KUA Kec. Gerung"
          >
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 shadow-xs">
              <KemenagLogo className="w-9 h-9" />
            </div>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Akurat Time Indonesia
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                v5.7 ID
              </span>
            </div>
            <button
              onClick={onOpenDeveloperModal}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
              title="Informasi Pengembang & Instansi KUA Gerung"
            >
              <span>Pengembang:</span>
              <strong className="font-semibold text-slate-700 dark:text-slate-200 group-hover:underline">
                Husni, S. Kom. I
              </strong>
              <span className="hidden md:inline text-[11px] text-slate-400 dark:text-slate-500">
                (Penyuluh KUA Kec. Gerung)
              </span>
            </button>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Certificate Calibration Shortcut button */}
          {onOpenQiblaCertificate && (
            <button
              onClick={onOpenQiblaCertificate}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer"
              title="Cetak Sertifikat Kalibrasi Arah Kiblat & Simpan PDF"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sertifikat Kiblat</span>
            </button>
          )}

          {/* Atomic status pill */}
          <button
            onClick={onOpenAtomicModal}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Klik untuk detail sinkronisasi jam atom"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Jam Atom</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
              {atomicState.offsetMs === 0
                ? '±0.0ms'
                : `${atomicState.offsetMs > 0 ? '+' : ''}${atomicState.offsetMs}ms`}
            </span>
          </button>

          {/* Quick sync button */}
          <button
            onClick={onQuickSync}
            disabled={atomicState.isSyncing}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            title="Sinkronkan Waktu dengan Server Jam Atom"
          >
            <RefreshCw className={`w-4 h-4 ${atomicState.isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundEnabled ? 'Suara Aktif (Bip Atom & Adzan)' : 'Suara Dimatikan'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Classic / Modern aesthetic toggle */}
          <button
            onClick={onToggleClassicTheme}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              classicTheme
                ? 'bg-yellow-100 text-yellow-900 border-yellow-400 dark:bg-yellow-950 dark:text-yellow-200'
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Beralih ke Tampilan Retro Klasik Accurate Times 5.7"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{classicTheme ? 'Tema Retro' : 'Tema Modern'}</span>
          </button>

          {/* Dark / Light toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
