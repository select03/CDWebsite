import React, { useState, useEffect } from 'react';
import { STATIC_ASSETS } from '../constants/assets';
import { Film } from 'lucide-react';

interface CineDimensionLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  customLogo?: string;
}

export const CineDimensionLogo: React.FC<CineDimensionLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  customLogo,
}) => {
  // Sanitize customLogo: ignore broken /images/logo.svg or empty strings, fallback to R2 logo.JPG
  const getInitialLogo = () => {
    if (
      customLogo &&
      typeof customLogo === 'string' &&
      customLogo.trim() &&
      !customLogo.includes('/images/logo.svg') &&
      !customLogo.includes('assets/images/image.jpeg')
    ) {
      return customLogo.trim();
    }
    return STATIC_ASSETS.LOGO;
  };

  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(getInitialLogo);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const nextLogo = getInitialLogo();
    setCurrentLogoUrl(nextLogo);
    setImageError(false);
  }, [customLogo]);

  // Height mappings for adaptive responsive display without distortion
  const logoHeightClasses = {
    sm: 'h-8 sm:h-9 md:h-10 max-h-10 w-auto',
    md: 'h-10 sm:h-12 max-h-12 w-auto',
    lg: 'h-14 sm:h-16 max-h-16 w-auto',
    xl: 'h-20 sm:h-24 max-h-24 w-auto',
  };

  const titleTextClasses = {
    sm: 'text-base sm:text-lg tracking-wide',
    md: 'text-xl sm:text-2xl tracking-wide',
    lg: 'text-2xl sm:text-3xl tracking-wider',
    xl: 'text-3xl sm:text-4xl tracking-wider',
  };

  const subTextClasses = {
    sm: 'text-[9px] sm:text-[10px] tracking-[0.2em]',
    md: 'text-[11px] sm:text-xs tracking-[0.22em]',
    lg: 'text-xs sm:text-sm tracking-[0.25em]',
    xl: 'text-sm sm:text-base tracking-[0.28em]',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none shrink-0 min-w-max ${className}`}>
      {/* Brand Icon / Logo (Dynamic R2 Logo with Graceful Fallback) */}
      <div className="relative flex items-center justify-center shrink-0">
        {!imageError && currentLogoUrl ? (
          <img
            src={currentLogoUrl}
            alt="維度影學 Cine Dimension Logo"
            className={`${logoHeightClasses[size]} object-contain drop-shadow-sm transition-opacity duration-200 rounded-sm`}
            onError={() => {
              if (currentLogoUrl !== STATIC_ASSETS.LOGO) {
                // Try fallback to static R2 logo.JPG
                setCurrentLogoUrl(STATIC_ASSETS.LOGO);
              } else {
                setImageError(true);
              }
            }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`${logoHeightClasses[size]} aspect-square flex items-center justify-center bg-stone-200 rounded-lg p-1 text-stone-700`}>
            <Film className="w-5 h-5 text-amber-600" />
          </div>
        )}
      </div>

      {/* Brand Text Block */}
      {showText && (
        <div className="flex flex-col text-left justify-center shrink-0">
          {/* Chinese Title "維度影學" - Gradient Metallic Orange/Gold Text */}
          <span
            className={`font-serif font-black leading-none bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(180,60,0,0.2)] ${titleTextClasses[size]}`}
          >
            維度影學
          </span>
          {/* English Subtitle "CINE DIMENSION" - Dark Navy Blue */}
          <span
            className={`font-sans font-extrabold uppercase text-[#0B2545] mt-0.5 leading-none ${subTextClasses[size]}`}
          >
            Cine Dimension
          </span>
        </div>
      )}
    </div>
  );
};





