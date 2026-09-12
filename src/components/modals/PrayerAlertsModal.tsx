import React, { useState } from 'react';
import { X, Bell, Volume2, Check, VolumeX } from 'lucide-react';
import { playAdzanChime, playAtomicTick } from '../../utils/audio';

interface PrayerAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PrayerAlertsModal: React.FC<PrayerAlertsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
}) => {
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({
    imsak: true,
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  const [reminderMinutes, setReminderMinutes] = useState<number>(5);

  if (!isOpen) return null;

  const prayers = [
    { key: 'imsak', name: 'Imsak', time: '10 mnt sebelum Subuh' },
    { key: 'fajr', name: 'Subuh', time: 'Waktu fajar shodiq' },
    { key: 'dhuhr', name: 'Dzuhur', time: 'Matahari tergelincir' },
    { key: 'asr', name: 'Ashar', time: 'Bayangan 1:1' },
    { key: 'maghrib', name: 'Maghrib', time: 'Matahari terbenam' },
    { key: 'isha', name: 'Isya', time: 'Syafaq merah hilang' },
  ];

  const toggleAlert = (key: string) => {
    setActiveAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pengaturan Alarm & Notifikasi Sholat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peringatan adzan dan sinyal waktu tepat saat masuk sholat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Master sound toggle */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                soundEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Audio & Nada Peringatan
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {soundEnabled ? 'Suara aktif (Adzan & Bip Atom)' : 'Suara dimatikan / senyap'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {soundEnabled ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* Test buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={playAdzanChime}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Uji Nada Adzan</span>
            </button>
            <button
              onClick={() => playAtomicTick(true)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-rose-500" />
              <span>Uji Bip Jam Atom</span>
            </button>
          </div>

          {/* Prayer list checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pilih Waktu Sholat yang Diberi Peringatan
            </label>
            <div className="space-y-1.5">
              {prayers.map((p) => {
                const isActive = activeAlerts[p.key];
                return (
                  <div
                    key={p.key}
                    onClick={() => toggleAlert(p.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'border-emerald-500/70 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {p.time}
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 dark:border-slate-600'
                    }`}>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
