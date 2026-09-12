import React, { useState } from 'react';

const KEMENAG_LOGO_PNG = '/kemenag-logo.png';
const KEMENAG_LOGO_SVG = '/kemenag-logo.svg';

interface KemenagLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const KemenagLogo: React.FC<KemenagLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(KEMENAG_LOGO_PNG);

  const style = size ? { width: size, height: size } : undefined;

  const handleImageError = () => {
    // Fallback to svg if png fails
    if (imgSrc !== KEMENAG_LOGO_SVG) {
      setImgSrc(KEMENAG_LOGO_SVG);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? '' : 'shrink-0'}`}>
      <img
        src={imgSrc}
        alt="Logo Kementerian Agama Republik Indonesia - Ikhlas Beramal"
        className={`object-contain select-none transition-transform duration-200 ${className}`}
        style={style}
        referrerPolicy="no-referrer"
        loading="eager"
        onError={handleImageError}
      />

      {showText && (
        <div className="leading-tight">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Kementerian Agama RI
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            KUA Kec. Gerung • Kab. Lombok Barat
          </div>
        </div>
      )}
    </div>
  );
};
