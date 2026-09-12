import React, { useState } from 'react';
import { X, Calendar, ArrowRightLeft, Sparkles, RefreshCw } from 'lucide-react';
import { gregorianToHijri, HIJRI_MONTHS, hijriToGregorian } from '../../utils/hijri';

interface HijriConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
}

export const HijriConverterModal: React.FC<HijriConverterModalProps> = ({
  isOpen,
  onClose,
  currentDate,
}) => {
  const [conversionDirection, setConversionDirection] = useState<'G2H' | 'H2G'>('G2H');
  const [rukyatAdjustment, setRukyatAdjustment] = useState<number>(0);

  // Masehi to Hijri states
  const [inputGDate, setInputGDate] = useState<string>(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
      currentDate.getDate()
    ).padStart(2, '0')}`
  );

  // Hijri to Masehi states
  const [inputHDay, setInputHDay] = useState<number>(1);
  const [inputHMonth, setInputHMonth] = useState<number>(9); // Ramadhan default
  const [inputHYear, setInputHYear] = useState<number>(1448);

  if (!isOpen) return null;

  // Calculation G to H
  const parsedGDate = new Date(inputGDate || currentDate.toISOString());
  const convertedHijri = gregorianToHijri(
    isNaN(parsedGDate.getTime()) ? currentDate : parsedGDate,
    rukyatAdjustment
  );

  // Calculation H to G
  const convertedGregorian = hijriToGregorian(inputHDay, inputHMonth, inputHYear);
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konverter Hijriah - Masehi & Pasaran
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penanggalan Islam, Masehi, dan Hari Pasaran Jawa
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
          
          {/* Mode Switcher */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center">
            <button
              onClick={() => setConversionDirection('G2H')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                conversionDirection === 'G2H'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Masehi ke Hijriah
            </button>
            <button
              onClick={() => setConversionDirection('H2G')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                conversionDirection === 'H2G'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Hijriah ke Masehi
            </button>
          </div>

          {conversionDirection === 'G2H' ? (
            /* Masehi to Hijri */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pilih Tanggal Masehi (Miladi)
                </label>
                <input
                  type="date"
                  value={inputGDate}
                  onChange={(e) => setInputGDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* Adjustment slider */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Koreksi Rukyatul Hilal Regional:
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {rukyatAdjustment > 0 ? `+${rukyatAdjustment}` : rukyatAdjustment} hari
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  value={rukyatAdjustment}
                  onChange={(e) => setRukyatAdjustment(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>-2 hari</span>
                  <span>Standar (0)</span>
                  <span>+2 hari</span>
                </div>
              </div>

              {/* Result Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Hasil Konversi Penanggalan Islam
                </span>
                <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100">
                  {convertedHijri.day} {convertedHijri.monthName} {convertedHijri.year} H
                </div>
                <div className="text-sm font-arabic text-emerald-800 dark:text-emerald-300">
                  {convertedHijri.day} {convertedHijri.monthNameAr} {convertedHijri.year} هـ
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Hari: {convertedHijri.dayNameId}</span>
                  <span>•</span>
                  <span>Pasaran: {convertedHijri.pasaran}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Hijri to Masehi */
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tanggal
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={inputHDay}
                    onChange={(e) => setInputHDay(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bulan Hijriah
                  </label>
                  <select
                    value={inputHMonth}
                    onChange={(e) => setInputHMonth(parseInt(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
                  >
                    {HIJRI_MONTHS.map((m) => (
                      <option key={m.no} value={m.no}>
                        {m.no}. {m.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tahun Hijriah
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1700"
                    value={inputHYear}
                    onChange={(e) => setInputHYear(parseInt(e.target.value) || 1448)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Result Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Hasil Perkiraan Tanggal Masehi
                </span>
                <div className="text-2xl font-black text-teal-950 dark:text-teal-100">
                  {dayNames[convertedGregorian.getDay()]}, {convertedGregorian.getDate()}{' '}
                  {monthNames[convertedGregorian.getMonth()]} {convertedGregorian.getFullYear()}
                </div>
                <div className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                  Perkiraan hisab astronomi kalender Umm al-Qura / MABIMS
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
