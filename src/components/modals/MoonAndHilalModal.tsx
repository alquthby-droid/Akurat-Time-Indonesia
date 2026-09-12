import React from 'react';
import { X, Moon, Eye, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { CrescentVisibilityResult, LocationInfo, MoonInfo } from '../../types';

interface MoonAndHilalModalProps {
  isOpen: boolean;
  onClose: () => void;
  moon: MoonInfo;
  hilal: CrescentVisibilityResult;
  location: LocationInfo;
}

export const MoonAndHilalModal: React.FC<MoonAndHilalModalProps> = ({
  isOpen,
  onClose,
  moon,
  hilal,
  location,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fase Bulan & Visibilitas Hilal (MABIMS)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hisab astronomis penentuan awal bulan Hijriah standar Kemenag RI
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
          
          {/* Moon Visual Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            
            {/* Visual Moon Disc */}
            <div className="relative w-28 h-28 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Moon illuminated segment */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 rounded-full transition-all"
                style={{
                  clipPath: moon.illumination <= 50
                    ? `inset(0 0 0 ${100 - moon.illumination * 2}%)`
                    : 'inset(0)',
                  opacity: Math.max(0.15, moon.illumination / 100),
                }}
              />
              <div className="relative z-10 text-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-white drop-shadow">
                  {moon.illumination}%
                </span>
                <div className="text-[10px] text-amber-200 uppercase tracking-widest font-semibold">
                  Iluminasi
                </div>
              </div>
            </div>

            {/* Moon Phase Details */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Fase Astronomis Saat Ini
              </span>
              <h4 className="text-xl font-extrabold text-white">
                {moon.phaseNameId}
              </h4>
              <p className="text-xs text-slate-300">
                {moon.phaseName} • Umur Bulan: <strong>{moon.ageDays} hari</strong>
              </p>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Terbit Bulan</div>
                  <div className="font-bold text-slate-200">{moon.moonrise}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Transit Bulan</div>
                  <div className="font-bold text-slate-200">{moon.moonTransit}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Terbenam Bulan</div>
                  <div className="font-bold text-slate-200">{moon.moonset}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Neo-MABIMS 2021 Hilal Analysis */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Kriteria Baru MABIMS 2021 (Kemenag RI)</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                Tinggi ≥ 3° & Elongasi ≥ 6.4°
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${
              hilal.isMabimsMet
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-start gap-2.5">
                {hilal.isMabimsMet ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold">
                    {hilal.isMabimsMet
                      ? 'MEMENUHI KRITERIA IMKANUR RUKYAT'
                      : 'BELUM MEMENUHI KRITERIA MABIMS'}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {hilal.mabimsDetail}
                  </p>
                </div>
              </div>
            </div>

            {/* Telemetry Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Tinggi Hilal Mar'i</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {hilal.hilalAltitude}°
                </div>
                <span className="text-[10px] text-slate-400">Syarat MABIMS: ≥ 3°</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Sudut Elongasi</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {hilal.elongation}°
                </div>
                <span className="text-[10px] text-slate-400">Syarat MABIMS: ≥ 6.4°</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Umur Hilal</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {hilal.moonAgeHours} jam
                </div>
                <span className="text-[10px] text-slate-400">Sejak konjungsi</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Kode Visibilitas Odeh</span>
                <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Kategori {hilal.odehCode}
                </div>
                <span className="text-[10px] text-slate-400">IAC Mohammad Odeh</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Deskripsi Kriteria Odeh: </strong>
              <span>{hilal.odehDescription}</span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              Kriteria MABIMS (Menteri Agama Brunei, Indonesia, Malaysia, Singapura) diadopsi resmi oleh Kementerian Agama RI sejak tahun 2022 guna menyelaraskan penentuan kalender Hijriah di kawasan Asia Tenggara.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
