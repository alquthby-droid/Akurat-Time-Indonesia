import React from 'react';
import { Camera, CheckCircle2, QrCode, Upload, RotateCcw } from 'lucide-react';
import { LocationInfo, QiblaInfo } from '../../types';
import { KemenagLogo } from '../KemenagLogo';
import { CalibrationPhoto } from '../../data/calibrationPhotos';

interface QiblaAttachmentSheetProps {
  attachmentRef?: React.RefObject<HTMLDivElement | null>;
  mosqueName: string;
  mosqueAddress: string;
  certNumber: string;
  dateFormatted: string;
  location: LocationInfo;
  qibla: QiblaInfo;
  azimuthDMS: string;
  falakAccuracy: string;
  calibratorName: string;
  takmirName: string;
  kuaHeadName: string;
  photos: CalibrationPhoto[];
  showCount?: number;
  onPhotoUpload?: (id: string, file: File) => void;
  onResetPhoto?: (id: string) => void;
  onOpenPhotoManager?: () => void;
}

export const QiblaAttachmentSheet: React.FC<QiblaAttachmentSheetProps> = ({
  attachmentRef,
  mosqueName,
  mosqueAddress,
  certNumber,
  dateFormatted,
  location,
  qibla,
  azimuthDMS,
  falakAccuracy,
  calibratorName,
  takmirName,
  kuaHeadName,
  photos,
  showCount = 4,
  onPhotoUpload,
  onResetPhoto,
  onOpenPhotoManager,
}) => {
  const displayedPhotos = photos.slice(0, showCount);

  return (
    <div
      id="printable-qibla-attachment"
      ref={attachmentRef}
      className="w-full max-w-[820px] bg-white text-slate-900 px-6 py-6 sm:px-8 sm:py-7 pb-8 sm:pb-9 shadow-2xl rounded-sm border-4 border-double border-emerald-900 relative my-2 select-text box-border print:my-0 print:border-4 print:shadow-none print-page"
      style={{ minHeight: '1060px', fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Background Watermark Official Emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <KemenagLogo className="w-[450px] h-[450px]" />
      </div>

      {/* 1. KOP SURAT DINAS RESMI (Sama dengan Lembar Utama) */}
      <div className="border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="shrink-0">
            <KemenagLogo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="flex-1 text-center font-serif text-slate-900 px-1 sm:px-2">
            <h4 className="text-[11.5px] sm:text-[13px] md:text-[14px] font-bold tracking-wider uppercase leading-tight text-slate-800">
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </h4>
            <h3 className="text-[11px] sm:text-[12.5px] md:text-[13.5px] font-bold uppercase leading-tight text-emerald-950 mt-0.5 tracking-normal whitespace-normal sm:whitespace-nowrap">
              KANTOR KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT
            </h3>
            <h2 className="text-[13px] sm:text-[14.5px] md:text-[15.5px] font-black uppercase leading-tight text-emerald-900 mt-0.5 tracking-wide whitespace-normal sm:whitespace-nowrap">
              KANTOR URUSAN AGAMA KECAMATAN GERUNG
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-700 mt-1 leading-snug">
              Jl. Gatot Subroto, Gerung Utara, Kecamatan Gerung, Kabupaten Lombok Barat, NTB
            </p>
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-600 leading-snug font-mono">
              Email: <span className="font-semibold text-emerald-800">kuagerung2025@gmail.com</span> • Kode Pos: 83363
            </p>
          </div>
          <div className="shrink-0 w-16 sm:w-20 flex justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border border-slate-300 p-1 flex flex-col items-center justify-center text-center bg-slate-50">
              <QrCode className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-900" />
              <span className="text-[7px] font-sans font-bold text-slate-600">LAMPIRAN</span>
            </div>
          </div>
        </div>
        {/* Double Horizontal Line */}
        <div className="border-b-4 border-slate-900 mt-3" />
        <div className="border-b border-slate-900 mt-0.5" />
      </div>

      {/* 2. JUDUL LAMPIRAN RESMI */}
      <div className="text-center my-2 sm:my-3">
        <h1 className="text-[13px] sm:text-[15px] md:text-[16px] font-bold uppercase tracking-normal text-emerald-950 underline decoration-1 decoration-slate-900 underline-offset-4 leading-normal">
          LAMPIRAN BERITA ACARA PENGUKURAN ARAH KIBLAT
        </h1>
        <h2 className="text-[11.5px] sm:text-[13px] font-bold uppercase text-slate-800 mt-0.5">
          DOKUMENTASI FOTO PELAKSANAAN & PENANDAAN SAF
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-[12px] text-slate-700 mt-1 font-sans">
          <span>
            Nomor Dokumen: <strong className="font-mono text-slate-900">{certNumber}</strong>
          </span>
          <span>•</span>
          <span>
            Tempat: <strong className="font-bold text-emerald-950">{mosqueName}</strong>
          </span>
          <span>•</span>
          <span>
            Azimut: <strong className="font-mono text-emerald-900">{azimuthDMS}</strong> ({qibla.azimuthDegrees}°)
          </span>
        </div>
      </div>

      {/* 3. GRID FOTO DOKUMENTASI RESMI */}
      <div className={`grid gap-3.5 my-3 ${displayedPhotos.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {displayedPhotos.map((photo, idx) => {
          const inputId = `upload-photo-sheet-${photo.id}`;
          return (
            <div
              key={photo.id}
              className="border-2 border-slate-300 rounded-sm bg-slate-50/50 p-2.5 flex flex-col justify-between shadow-2xs relative"
            >
              {/* Image Box with Direct Click-to-Upload */}
              <div
                onClick={() => {
                  const input = document.getElementById(inputId) as HTMLInputElement | null;
                  input?.click();
                }}
                className="relative rounded overflow-hidden border border-slate-300 bg-black aspect-video flex items-center justify-center group cursor-pointer block select-none"
                title={`Klik untuk ganti atau unggah foto #${idx + 1}`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="eager"
                />

                {/* Screen Only: Hover Overlay to change photo */}
                <div className="absolute inset-0 bg-emerald-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 print:hidden z-20 p-2 text-center">
                  <Upload className="w-5 h-5 text-emerald-300 animate-bounce" />
                  <span className="text-[11px] font-bold font-sans">Klik Ganti / Unggah Foto #{idx + 1}</span>
                  <span className="text-[9px] text-emerald-200 font-sans">Pilih file gambar atau kamera</span>
                </div>

                {/* Photo Order Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-900/90 text-white text-[9.5px] font-sans font-bold shadow-xs flex items-center gap-1 z-10">
                  <Camera className="w-3 h-3" />
                  <span>Foto {idx + 1}</span>
                </div>
                {/* Category Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/85 text-emerald-300 text-[9px] font-mono font-semibold z-10">
                  {photo.category}
                </div>
              </div>

              {/* Single Shared File Input for this Card */}
              <input
                id={inputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onPhotoUpload) {
                    onPhotoUpload(photo.id, file);
                  }
                  e.target.value = '';
                }}
              />

              {/* Photo Caption / Information */}
              <div className="mt-2 text-left">
                <div className="font-bold text-xs sm:text-[12.5px] text-emerald-950 font-serif leading-snug">
                  {photo.title}
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-slate-700 leading-snug mt-1 font-sans">
                  {photo.caption}
                </p>
                <div className="mt-1.5 pt-1 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>GPS: {location.latitude}°, {location.longitude}°</span>
                  <span>Waktu: {dateFormatted}</span>
                </div>

                {/* Direct Screen Action Buttons (Print Hidden) */}
                <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between gap-1.5 print:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(inputId) as HTMLInputElement | null;
                      input?.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs select-none"
                    title="Buka pemilih file untuk mengganti foto ini"
                  >
                    <Upload className="w-3 h-3 shrink-0" />
                    <span>Ganti / Unggah Foto</span>
                  </button>

                  {photo.isCustom && onResetPhoto && (
                    <button
                      type="button"
                      onClick={() => onResetPhoto(photo.id)}
                      className="px-2 py-1.5 rounded bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-300 text-[10.5px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Kembalikan ke gambar ilustrasi falak resmi"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. KETERANGAN TEKNIS DOKUMENTASI */}
      <div className="p-2.5 my-2 border border-emerald-800 bg-emerald-50/50 rounded flex items-center gap-2.5 text-xs text-emerald-950 font-sans">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
        <div className="text-[11px] leading-snug">
          <strong>Pernyataan Dokumentasi:</strong> Seluruh foto di atas merupakan dokumentasi faktual hasil pelaksanaan hisab, pengukuran instrumen, dan penandaan saf salat di <strong>{mosqueName}</strong> ({mosqueAddress}) dengan tingkat akurasi <strong>{falakAccuracy}</strong>.
        </div>
      </div>

      {/* 5. TANDA TANGAN PENGESAHAN LAMPIRAN */}
      <div className="mt-4 pt-1">
        <div className="text-right text-xs text-slate-800 mb-2 font-serif">
          Gerung, {dateFormatted}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-900 font-serif">
          {/* Takmir */}
          <div className="flex flex-col justify-between h-28">
            <div>
              <div className="font-bold">Pengurus / Takmir</div>
              <div className="text-[10.5px] text-slate-600">{mosqueName}</div>
            </div>
            <div>
              <div className="font-bold underline uppercase">{takmirName}</div>
              <div className="text-[9.5px] text-slate-500">Ketua Takmir</div>
            </div>
          </div>

          {/* Petugas Kalibrasi */}
          <div className="flex flex-col justify-between h-28 relative">
            <div>
              <div className="font-bold">Petugas Kalibrasi</div>
              <div className="text-[10.5px] text-slate-600">Penyuluh Agama Islam KUA</div>
            </div>
            <div className="my-auto text-emerald-800 font-serif italic text-xs select-none opacity-80">
              [Tanda Tangan Digital]
            </div>
            <div>
              <div className="font-bold underline uppercase text-emerald-950">
                {calibratorName}
              </div>
              <div className="text-[9.5px] text-slate-600">NIP / Reg. Penyuluh</div>
            </div>
          </div>

          {/* Kepala KUA */}
          <div className="flex flex-col justify-between h-28 relative">
            <div>
              <div className="font-bold">Mengetahui:</div>
              <div className="font-bold leading-tight">Kepala KUA Kec. Gerung</div>
            </div>

            {/* Official Stamp Simulation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-900 flex flex-col items-center justify-center p-1 text-center transform -rotate-12">
                <span className="text-[6.5px] font-black uppercase text-emerald-900">KEMENTERIAN AGAMA</span>
                <span className="text-[5.5px] font-extrabold text-emerald-950">KUA KEC. GERUNG</span>
                <span className="text-[4.5px] text-emerald-800">LOMBOK BARAT</span>
              </div>
            </div>

            <div>
              <div className="font-bold underline uppercase">{kuaHeadName}</div>
              <div className="text-[9.5px] text-slate-600">Kepala KUA Kec. Gerung</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. FOOTER RESMI DOKUMEN */}
      <div className="mt-4 pt-2 border-t border-slate-400 flex items-center justify-between text-[9.5px] text-slate-500 font-sans">
        <div>
          Lampiran Dokumentasi Berita Acara • <strong>Akurat Time Indonesia v5.7 ID</strong>
        </div>
        <div>
          Halaman 2 dari 2 Lembar Berita Acara Resmi
        </div>
      </div>
    </div>
  );
};
