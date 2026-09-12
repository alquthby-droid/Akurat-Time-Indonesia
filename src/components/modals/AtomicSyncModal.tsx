import React, { useState } from 'react';
import { X, RefreshCw, Radio, CheckCircle2, ShieldCheck, Activity, Wifi, Volume2, Info } from 'lucide-react';
import { AtomicSyncState } from '../../types';
import { playAtomicTick } from '../../utils/audio';

interface AtomicSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  atomicState: AtomicSyncState;
  onSync: (source?: string) => Promise<boolean>;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const AtomicSyncModal: React.FC<AtomicSyncModalProps> = ({
  isOpen,
  onClose,
  atomicState,
  onSync,
  soundEnabled,
  onToggleSound,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>('/api/time');
  const [testPlaying, setTestPlaying] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = () => {
    onSync(selectedSource);
  };

  const handleTestBeep = () => {
    setTestPlaying(true);
    playAtomicTick(true);
    setTimeout(() => setTestPlaying(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sinkronisasi Jam Atom (Atomic Time Sync)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Presisi waktu mikrodetik berstandar NTP & Pusat Waktu Indonesia
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
          
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {atomicState.statusText}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Sumber Aktif: <strong>{atomicState.syncSource}</strong> (Stratum {atomicState.stratum})
              </p>
            </div>

            <button
              onClick={handleManualSync}
              disabled={atomicState.isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${atomicState.isSyncing ? 'animate-spin' : ''}`} />
              <span>{atomicState.isSyncing ? 'Mengkalibrasi...' : 'Sinkronkan Sekarang'}</span>
            </button>
          </div>

          {/* Metric telemetry tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Offset Jam Perangkat
              </span>
              <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {atomicState.offsetMs > 0 ? `+${atomicState.offsetMs}` : atomicState.offsetMs} ms
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Deviasi dari jam atom
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Latensi RTT (Round Trip)
              </span>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {atomicState.roundTripDelayMs} ms
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Waktu bolak-balik data
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Variasi Jitter
              </span>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {atomicState.jitterMs} ms
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Stabilitas transmisi
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Tingkat Presisi
              </span>
              <div className="font-mono text-lg font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                {atomicState.precisionString}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Estimasi akurasi
              </span>
            </div>
          </div>

          {/* NTP Source Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pilih Server Jam Atom Referensi (NTP Stratum 1 / 2)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: '/api/time', label: 'Host Jam Atom Server', sub: 'Latensi terendah (Lokal)' },
                { id: 'worldtimeapi', label: 'id.pool.ntp.org (WorldTime)', sub: 'Server NTP Global' },
                { id: 'cloudflare_head', label: 'Cloudflare Atomic Edge', sub: 'Transmisi Akurat Anycast' },
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSource(src.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSource === src.id
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {src.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {src.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Atomic Time Signal Sound (Bip RRI / BMKG) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Sinyal Suara Detik Atom (Time Signal Beep)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bunyi bip penanda detik 57, 58, 59, dan 00 (seperti radio RRI / BMKG)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestBeep}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Uji Bip
              </button>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {soundEnabled ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>

          {/* Sync History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Riwayat Kalibrasi Terakhir
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="p-2.5">Waktu Kalibrasi</th>
                    <th className="p-2.5">Sumber</th>
                    <th className="p-2.5">Offset Drift</th>
                    <th className="p-2.5">Latensi RTT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {atomicState.syncHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 font-sans">
                        Belum ada riwayat kalibrasi. Klik "Sinkronkan Sekarang" untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    atomicState.syncHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-sans">
                          {new Date(item.timestamp).toLocaleTimeString('id-ID')}
                        </td>
                        <td className="p-2.5 font-sans">{item.source}</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.offset > 0 ? `+${item.offset}` : item.offset} ms
                        </td>
                        <td className="p-2.5">{item.delay} ms</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info note */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-300">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Catatan Presisi:</strong> Algoritma jam atom menghitung waktu bolak-balik transmisi (Round-Trip Time) dan mengompensasi penundaan jaringan untuk menghasilkan waktu nyata yang sinkron dengan jam atom nasional tanpa terpengaruh kelambatan jam perangkat lokal.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
