// src/components/game/ad-banner.tsx
import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'middle' | 'native'; // Added 'native'
  className?: string;
  visible: boolean;
}

const AdBanner = ({ position, className, visible }: AdBannerProps) => {
  // If the placeholder is not visible, render nothing
  if (!visible) {
    return null;
  }

  // Hide the top banner entirely (remove "Ad Banner - top") while keeping other positions unchanged
  if (position === 'top') {
    return null;
  }

  // Render a different style for 'native' ad
  if (position === 'native') {
    return (
      <div className={`ad-placeholder ${className} w-full h-[100px] bg-blue-800 flex items-center justify-center text-white text-sm`}>
        {`Native Advanced Ad Placeholder`}
      </div>
    );
  }

  return (
    <div className={`ad-placeholder ${className} w-full h-[50px] bg-gray-800 flex items-center justify-center text-gray-400 text-sm`}>
      {`Ad Banner - ${position}`}
    </div>
  );
};

export default AdBanner;
