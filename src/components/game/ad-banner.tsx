
'use client';
import { Capacitor } from '@capacitor/core';
import useAdMob from '@/hooks/use-admob';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'middle';
  className?: string;
}

const AdBanner = ({ position, className }: AdBannerProps) => {
  const { showBanner, hideBanner } = useAdMob();
  const isNative = Capacitor.isNativePlatform();
  const adRef = useRef<HTMLDivElement>(null);
  const [isAdVisible, setIsAdVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAdVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAdVisible && position !== 'middle') {
      showBanner(position);
    } else {
      hideBanner();
    }
  }, [isAdVisible, position, showBanner, hideBanner]);

  // Use a consistent height for both native and web placeholders
  const placeholderHeight = "h-[60px]";

  if (isNative && position !== 'middle') {
    // On native, Capacitor overlays the ad, so we just return a placeholder of the correct height
    return <div ref={adRef} className={cn("w-full bg-transparent", placeholderHeight, className)} />;
  }
  
  // On web, we want a visible placeholder
  return (
    <div
      ref={adRef}
      className={cn(
        "w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center text-sm text-gray-500",
        placeholderHeight,
        className
      )}
    >
      Advertisement
    </div>
  );
};
      
export default AdBanner;
