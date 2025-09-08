
// src/components/game/ad-banner.tsx
import { useEffect } from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom'; // Indicate desired screen position, not arbitrary inline position
  className?: string;
  visible: boolean; // Controls whether the placeholder is rendered
}

const AdBanner = ({ position, className, visible }: AdBannerProps) => {
  if (!visible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div className={`ad-placeholder ${className} w-full h-[50px] bg-gray-800 flex items-center justify-center text-gray-400 text-sm`}>
      {`Ad Banner - ${position}`}
    </div>
  );
};

export default AdBanner;
