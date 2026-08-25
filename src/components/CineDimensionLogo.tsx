import React, { useState } from 'react';
import { STATIC_ASSETS } from '../constants/assets';

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
}) => {
  // 全域死鎖 Logo 來源為 /images/logo.svg，徹底跳過外部動態覆蓋
  const activeLogo = STATIC_ASSETS.LOGO;
  const [imageError, setImageError] = useState(false);

  // Sizing mappings
  const iconSizeClasses = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
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
      {/* Brand Icon (Deadlocked to /images/logo.svg with SVG fallback) */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizeClasses[size]}`}>
        {!imageError ? (
          <img
            src={STATIC_ASSETS.LOGO}
            alt="維度影學 Cine Dimension"
            className="w-full h-full object-contain drop-shadow-sm"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-sm overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Blue Outer Orbital Ring */}
              <linearGradient id="blueRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0072CE" />
                <stop offset="50%" stopColor="#003E7E" />
                <stop offset="100%" stopColor="#001D40" />
              </linearGradient>

              {/* Gold Inner Orbital Ring */}
              <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD000" />
                <stop offset="50%" stopColor="#FF8500" />
                <stop offset="100%" stopColor="#C43B00" />
              </linearGradient>

              {/* Lens Aperture Body Gradient */}
              <linearGradient id="lensBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#004080" />
                <stop offset="60%" stopColor="#001E3D" />
                <stop offset="100%" stopColor="#000D1A" />
              </linearGradient>
            </defs>

            {/* 1. Left Outer Blue Film Ring */}
            <ellipse
              cx="100"
              cy="100"
              rx="92"
              ry="40"
              transform="rotate(-28 100 100)"
              stroke="url(#blueRing)"
              strokeWidth="9"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="92"
              ry="40"
              transform="rotate(-28 100 100)"
              stroke="#66B2FF"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.8"
            />

            {/* 2. Right Inner Gold Film Ring */}
            <ellipse
              cx="100"
              cy="100"
              rx="85"
              ry="36"
              transform="rotate(22 100 100)"
              stroke="url(#goldRing)"
              strokeWidth="8"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="85"
              ry="36"
              transform="rotate(22 100 100)"
              stroke="#FFF2A3"
              strokeWidth="1.2"
              strokeDasharray="5 3"
              opacity="0.9"
            />

            {/* 3. Central Lens Aperture Circle */}
            <circle cx="100" cy="100" r="54" fill="url(#lensBody)" stroke="url(#goldRing)" strokeWidth="3.5" />
            
            {/* Inner Dark Lens Rim */}
            <circle cx="100" cy="100" r="48" fill="#001226" stroke="#0055A5" strokeWidth="1.5" />

            {/* Curved Aperture Blades */}
            <g stroke="#FFB700" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9">
              <path d="M 100 52 C 118 68, 118 84, 100 100" />
              <path d="M 148 100 C 132 118, 116 118, 100 100" />
              <path d="M 100 148 C 82 132, 82 116, 100 100" />
              <path d="M 52 100 C 68 82, 84 82, 100 100" />
            </g>

            {/* Shiny Lens Core Flare */}
            <circle cx="100" cy="100" r="16" fill="#FFFFFF" opacity="0.9" />
            <circle cx="100" cy="100" r="10" fill="#FFE066" />
          </svg>
        )}
      </div>

      {/* Brand Text Block (100% Crisp Vector HTML Text - No Blobs!) */}
      {showText && (
        <div className="flex flex-col text-left justify-center shrink-0">
          {/* Chinese Title "維度影學" - Gradient Metallic Orange/Gold Text */}
          <span
            className={`font-serif font-black leading-none bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(180,60,0,0.25)] ${titleTextClasses[size]}`}
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




