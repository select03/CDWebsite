import React, { useState, useEffect } from 'react';
import { FOUNDER_PORTRAIT_IMAGE } from '../data/founderImage';
import { STATIC_ASSETS, AVATAR_FALLBACK_CANDIDATES } from '../constants/assets';

interface FounderAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const FounderAvatar: React.FC<FounderAvatarProps> = ({
  src,
  alt = '維度影學 創辦人 悟哥',
  className = 'w-full h-full object-cover'
}) => {
  // Ordered sequence of fallback sources
  const candidateList = React.useMemo(() => {
    const list: string[] = [];
    if (src && src.trim()) {
      list.push(src.trim());
    }
    // Add default candidates (avoiding duplicates)
    AVATAR_FALLBACK_CANDIDATES.forEach(cand => {
      if (!list.includes(cand)) {
        list.push(cand);
      }
    });
    // Add ultimate SVG portrait fallback
    list.push(FOUNDER_PORTRAIT_IMAGE);
    return list;
  }, [src]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Reset index when src prop changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [src]);

  const handleError = () => {
    if (currentIndex < candidateList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentSource = candidateList[currentIndex] || FOUNDER_PORTRAIT_IMAGE;

  return (
    <img
      src={currentSource}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};
