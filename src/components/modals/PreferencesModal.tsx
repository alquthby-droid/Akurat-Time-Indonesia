import React from 'react';
import { X, Settings, Sliders, Check } from 'lucide-react';
import { CalculationMethodId, CalculationPreferences } from '../../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: CalculationPreferences;
  onUpdatePreferences: (updated: Partial<CalculationPreferences>) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  const methods: Array<{ id: CalculationMethodId; name: string; desc: string; fajr: number; isha: number }> = [
    {
      id: 'KEMENAG',
      name: 'Kementerian Agama RI (Standar Indonesia)',
      desc: 'Subuh: -20.0°, Isya: -18.0°, Ihtiyat: +2 mnt',
      fajr: 20,
      isha: 18,
    },
    {
      id: 'IAC',
      name: 'International Astronomical Center (IAC / Mohammad Odeh)',
      desc: 'Subuh: -18.0°, Isya: -18.0°',
      fajr: 18,
      isha: 18,
    },
    {
      id: 'UMM_AL_QURA',
      name: 'Umm al-Qura (Makkah al-Mukarramah)',
      desc: 'Subuh: -18.5°, Isya: 90 menit setelah Maghrib',
      fajr: 18.5,
      isha: 19,
    },
    {
      id: 'MWL',
      name: 'Muslim World League (Liga Muslim Dunia)',
      desc: 'Subuh: -18.0°, Isya: -17.0°',
      fajr: 18,
      isha: 17,
    },
    {
      id: 'EGYPT',
      name: 'Egyptian General Authority of Survey (Mesir)',
      desc: 'Subuh: -19.5°, Isya: -17.5°',
      fajr: 19.5,
      isha: 17.5,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Preferensi & Pengaturan Hisab
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Konfigurasi metode hisab, ihtiyat pengaman, dan tampilan
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
          
          {/* Method Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Metode Hisab Waktu Sholat
            </label>
            <div className="space-y-2">
              {methods.map((m) => {
                const isSelected = preferences.method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onUpdatePreferences({
                        method: m.id,
                        fajrAngle: m.fajr,
                        ishaAngle: m.isha,
                      });
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-slate-900 dark:text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{m.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {m.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ihtiyat (Pengaman Waktu Sholat) */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                Ihtiyat (Menit Pengaman Kehati-hatian):
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                +{preferences.ihtiyatMinutes} Menit
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={preferences.ihtiyatMinutes}
              onChange={(e) => onUpdatePreferences({ ihtiyatMinutes: parseInt(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Standar Kementerian Agama RI menambahkan +2 menit ihtiyat pada setiap waktu sholat untuk mengantisipasi perbedaan ketinggian tempat dan pembiasan cahaya.
            </p>
          </div>

          {/* Mazhab Ashar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Metode Mazhab Waktu Ashar
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onUpdatePreferences({ asrJuristic: 'STANDARD' })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                  preferences.asrJuristic === 'STANDARD'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Standar Syafi'i / Maliki / Hanbali</div>
                <div className="text-[10px] text-slate-500 mt-1">Panjang bayangan = 1x tinggi benda</div>
              </button>

              <button
                onClick={() => onUpdatePreferences({ asrJuristic: 'HANAFI' })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                  preferences.asrJuristic === 'HANAFI'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Mazhab Hanafi</div>
                <div className="text-[10px] text-slate-500 mt-1">Panjang bayangan = 2x tinggi benda</div>
              </button>
            </div>
          </div>

          {/* Additional Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Koreksi Kerendahan Ufuk (Elevasi mdpl):
              </span>
              <input
                type="checkbox"
                checked={preferences.useElevationDip}
                onChange={(e) => onUpdatePreferences({ useElevationDip: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Tampilkan Angka Milidetik pada Jam Utama:
              </span>
              <input
                type="checkbox"
                checked={preferences.showMilliseconds}
                onChange={(e) => onUpdatePreferences({ showMilliseconds: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>

        </div>

      </div>
    </div>
  );
};
