import React, { useState } from 'react';
import { X, Search, MapPin, Navigation, Check, Globe, Sliders } from 'lucide-react';
import { INDONESIAN_CITIES } from '../../data/indonesianCities';
import { LocationInfo, TimezoneCode } from '../../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Custom coordinate inputs
  const [customName, setCustomName] = useState('Lokasi Kustom');
  const [customLat, setCustomLat] = useState(currentLocation.latitude.toString());
  const [customLon, setCustomLon] = useState(currentLocation.longitude.toString());
  const [customElev, setCustomElev] = useState(currentLocation.elevation.toString());
  const [customTz, setCustomTz] = useState<TimezoneCode>(currentLocation.timezoneName);

  if (!isOpen) return null;

  const filteredCities = INDONESIAN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      setGpsError('Peramban Anda tidak mendukung sensor GPS.');
      return;
    }

    setIsLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGps(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));
        const elev = pos.coords.altitude ? Math.round(pos.coords.altitude) : 25;

        // Determine Indonesian timezone based on longitude
        let tzOffset = 7;
        let tzName: TimezoneCode = 'WIB';
        if (lon >= 115 && lon < 125) {
          tzOffset = 8;
          tzName = 'WITA';
        } else if (lon >= 125) {
          tzOffset = 9;
          tzName = 'WIT';
        }

        const gpsLoc: LocationInfo = {
          id: 'gps-location',
          name: 'Posisi GPS Saya',
          province: 'Deteksi Otomatis',
          latitude: lat,
          longitude: lon,
          elevation: elev,
          timezoneOffset: tzOffset,
          timezoneName: tzName,
          isCustom: true,
        };

        onSelectLocation(gpsLoc);
        onClose();
      },
      (err) => {
        setIsLocatingGps(false);
        setGpsError(`Gagal memperoleh sinyal GPS: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    const elev = parseFloat(customElev) || 0;

    let tzOffset = 7;
    if (customTz === 'WITA') tzOffset = 8;
    if (customTz === 'WIT') tzOffset = 9;

    if (isNaN(lat) || isNaN(lon)) {
      setGpsError('Koordinat lintang dan bujur harus berupa angka yang valid.');
      return;
    }

    const loc: LocationInfo = {
      id: `custom-${Date.now()}`,
      name: customName || 'Lokasi Kustom',
      province: 'Koordinat Manual',
      latitude: lat,
      longitude: lon,
      elevation: elev,
      timezoneOffset: tzOffset,
      timezoneName: customTz,
      isCustom: true,
    };

    onSelectLocation(loc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pilih Lokasi & Koordinat Observasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pusat data hisab 38 provinsi di Indonesia atau koordinat GPS
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

        {/* Mode Switcher */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                !isCustomMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Daftar Kota Indonesia
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isCustomMode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Input Manual / GPS</span>
            </button>
          </div>

          <button
            onClick={handleGpsDetect}
            disabled={isLocatingGps}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
            <span>{isLocatingGps ? 'Mencari GPS...' : 'Deteksi GPS'}</span>
          </button>
        </div>

        {gpsError && (
          <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs border-b border-rose-200 dark:border-rose-900">
            {gpsError}
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1">
          {!isCustomMode ? (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama kota atau provinsi (contoh: Lombok Barat, Jakarta, Surabaya)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="text-[11px] text-slate-400 self-center mr-1">Rekomendasi:</span>
                {[
                  { name: 'Lombok Barat', id: 'lombok-barat' },
                  { name: 'Mataram', id: 'mataram' },
                  { name: 'DKI Jakarta', id: 'jakarta-pusat' },
                  { name: 'Surabaya', id: 'surabaya' },
                  { name: 'Bandung', id: 'bandung' },
                  { name: 'Medan', id: 'medan' },
                  { name: 'Makassar', id: 'makassar' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const found = INDONESIAN_CITIES.find((c) => c.id === item.id);
                      if (found) {
                        onSelectLocation(found);
                        onClose();
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                      currentLocation.id === item.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* City List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {filteredCities.map((city) => {
                  const isSelected = currentLocation.id === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectLocation(city);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{city.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {city.timezoneName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {city.province}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                          {city.latitude > 0 ? `${city.latitude}° LU` : `${Math.abs(city.latitude)}° LS`},{' '}
                          {city.longitude}° BT • {city.elevation} m dpl
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Lokasi / Tempat
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
                  placeholder="Contoh: Masjid Agung Lombok / Kampus / Rumah"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Garis Lintang (Latitude dalam derajat desimal)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono"
                    placeholder="-8.6833 (minus untuk Lintang Selatan)"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Contoh Lombok Barat: -8.6833</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Garis Bujur (Longitude dalam derajat desimal)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono"
                    placeholder="116.1167 (Bujur Timur)"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Contoh Lombok Barat: 116.1167</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ketinggian Tempat (Elevasi mdpl)
                  </label>
                  <input
                    type="number"
                    value={customElev}
                    onChange={(e) => setCustomElev(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono"
                    placeholder="35 (meter di atas permukaan laut)"
                  />
                  <span className="text-[10px] text-slate-400">Digunakan untuk koreksi kerendahan ufuk (dip)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Zona Waktu Indonesia
                  </label>
                  <select
                    value={customTz}
                    onChange={(e) => setCustomTz(e.target.value as TimezoneCode)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="WIB">WIB - Waktu Indonesia Barat (UTC+7)</option>
                    <option value="WITA">WITA - Waktu Indonesia Tengah (UTC+8)</option>
                    <option value="WIT">WIT - Waktu Indonesia Timur (UTC+9)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Terapkan Koordinat Kustom
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
