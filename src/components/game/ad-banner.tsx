
'use client';

import { useEffect } from 'react';
import useAdMob from '@/hooks/use-admob';
import { Card } from '../ui/card';
import { Capacitor } from '@capacitor/core';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

const AdBanner = ({ position }: AdBannerProps) => {
  const { showBanner, hideBanner } = useAdMob();

  useEffect(() => {
    showBanner(position);
    
    return () => {
      hideBanner();
    };
  }, [showBanner, hideBanner, position]);
  
  // On web, we just show a placeholder
  if (Capacitor.getPlatform() === 'web') {
      return (
         <Card className="w-full h-24 flex items-center justify-center bg-secondary/50 border-dashed">
            <p className="text-muted-foreground">Advertisement</p>
         </Card>
      );
  }

  // On native, Capacitor will overlay the ad, so we just return a placeholder of the correct height
  return <div className="w-full h-[50px] bg-transparent" />;
};

export default AdBanner;
