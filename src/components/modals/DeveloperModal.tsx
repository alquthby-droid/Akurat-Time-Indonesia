import React from 'react';
import {
  X,
  UserCheck,
  Award,
  Radio,
  ShieldCheck,
  Mail,
  MapPin,
  Building,
  FileCheck2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { KemenagLogo } from '../KemenagLogo';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQiblaCertificate?: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  onOpenQiblaCertificate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 shadow-xs">
              <KemenagLogo className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tentang Pengembang & Aplikasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akurat Time Indonesia Versi 5.7 ID
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
          
          {/* Hero Profile Card with Official Kemenag RI Affiliation */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-900 to-emerald-800 text-white text-center shadow-lg relative overflow-hidden">
            {/* Top decorative emblem */}
            <div className="w-20 h-20 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 mx-auto flex items-center justify-center p-2 mb-3 shadow-md">
              <KemenagLogo className="w-16 h-16" />
            </div>
            
            <div className="text-[11px] uppercase tracking-widest text-emerald-200 font-bold mb-1">
              PENGEMBANG UTAMA & HISAB FALAK
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Husni, S. Kom. I
            </h2>
            <div className="text-xs font-semibold text-emerald-300 mt-0.5">
              Penyuluh Agama Islam
            </div>
            
            <div className="text-xs text-emerald-100/90 max-w-sm mx-auto mt-2 leading-relaxed font-medium">
              KUA Kecamatan Gerung, Kantor Kementerian Agama Kabupaten Lombok Barat
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-center gap-3 text-xs text-emerald-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Kemenag RI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-300" /> Jam Atom Presisi
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-300" /> Hisab & Rukyat
              </span>
            </div>
          </div>

          {/* Contact & Agency Details Card */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Informasi Instansi & Layanan Konsultasi
            </h4>

            <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Alamat Kantor:</span>
                  <p className="text-[11px] leading-snug">
                    Jl. Gatot Subroto Gerung Utara, Kecamatan Gerung, Kabupaten Lombok Barat, Nusa Tenggara Barat (NTB)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Email Resmi KUA:</span>
                  <p className="text-[11px] font-mono">
                    <a
                      href="mailto:kuagerung2025@gmail.com"
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      kuagerung2025@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="w-full">
                  <span className="font-semibold text-slate-900 dark:text-white">Layanan Kalibrasi Arah Kiblat:</span>
                  <p className="text-[11px] leading-snug mb-2">
                    Melayani pengukuran, penetapan garis kiblat saf salat untuk masjid/musholla, dan penerbitan Sertifikat Kalibrasi Arah Kiblat resmi.
                  </p>
                  {onOpenQiblaCertificate && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenQiblaCertificate();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Buat Sertifikat Kalibrasi Sekarang</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Software Heritage */}
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Latar Belakang & Dedikasi Sistem
            </h4>
            <p>
              Aplikasi <strong>Akurat Time Indonesia</strong> dibangun sebagai adaptasi modern dan penyempurnaan dari software astronomi internasional legendaris <em>Accurate Times 5.7</em> karya Mohammad Odeh (International Astronomical Center - IAC).
            </p>
            <p>
              Sistem ini disesuaikan sepenuhnya untuk kebutuhan umat Islam di seluruh Indonesia dengan menghadirkan:
            </p>

            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Standar Hisab Kemenag RI:</strong> Menggunakan parameter resmi Kementerian Agama Republik Indonesia (Subuh -20°, Isya -18°, Ihtiyat +2 menit, dan kriteria Baru MABIMS 2021).
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Sinkronisasi Jam Atom (NTP):</strong> Mengintegrasikan penghitungan offset drift milidetik waktu atomik untuk memastikan adzan dan detik waktu sholat tepat tanpa selisih sedetik pun.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Penerbitan Sertifikat Kalibrasi Kiblat & PDF:</strong> Memudahkan pengurus masjid/musholla mencetak berita acara kalibrasi arah kiblat dan jadwal waktu sholat bulanan ke format PDF.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
            Akurat Time Indonesia © 2026 • Dikembangkan oleh <strong>Husni, S. Kom. I</strong><br />
            Penyuluh Agama Islam KUA Kecamatan Gerung, Kab. Lombok Barat
          </div>

        </div>

      </div>
    </div>
  );
};
