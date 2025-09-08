
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Level } from '@/lib/game-data';
import { levels } from '@/lib/game-data';
import LevelSelect from '@/components/game/level-select';
import Game from '@/components/game/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import AdBanner from './game/ad-banner';
import useAdMob from '@/hooks/use-admob';
import { Capacitor } from '@capacitor/core';
import { BannerAdPosition } from '@capacitor-community/admob';

export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [easyLevelsCompleted, setEasyLevelsCompleted] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [lastVolume, setLastVolume] = useState(0.2);
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const levelCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = volume === 0;
  const { showBanner, hideBanner, showInterstitial, showRewarded } = useAdMob();

  
  const [audioReady, setAudioReady] = useState(false);

  // 1. Initialize Audio and check when it's ready to play
  useEffect(() => {
    if (typeof window !== "undefined") {
      const menuAudio = new Audio('/assets/emoji/music/Opening.mp3');
      menuAudio.loop = true;
      menuAudioRef.current = menuAudio;
      
      const gameAudio = new Audio('/assets/emoji/music/bgmusic.mp3');
      gameAudio.loop = true;
      gameAudioRef.current = gameAudio;
      
      const levelCompleteAudio = new Audio('/assets/emoji/music/level_complete.mp3');
      levelCompleteAudioRef.current = levelCompleteAudio;

      const checkAudioReady = () => {
        if (menuAudio.readyState >= 4 && gameAudio.readyState >= 4) {
          setAudioReady(true);
        }
      };

      menuAudio.addEventListener('canplaythrough', checkAudioReady);
      gameAudio.addEventListener('canplaythrough', checkAudioReady);

      return () => {
        menuAudio.removeEventListener('canplaythrough', checkAudioReady);
        gameAudio.removeEventListener('canplaythrough', checkAudioReady);
      };
    }
  }, []);

  // 2. Consolidated effect to manage audio playback
  useEffect(() => {
    const menuAudio = menuAudioRef.current;
    const gameAudio = gameAudioRef.current;
    const levelCompleteAudio = levelCompleteAudioRef.current;

    if (!menuAudio || !gameAudio || !levelCompleteAudio) return;

    // Always keep volume updated
    menuAudio.volume = volume;
    gameAudio.volume = volume;
    levelCompleteAudio.volume = volume;
    
    // Determine which track should be playing
    const activeAudio = currentLevel ? gameAudio : menuAudio;
    const inactiveAudio = currentLevel ? menuAudio : gameAudio;

    // Always pause the inactive track
    if (!inactiveAudio.paused) {
      inactiveAudio.pause();
      inactiveAudio.currentTime = 0;
    }

    // Only play the active track if all conditions are met
    if (audioReady && !isLoading && volume > 0 && activeAudio.paused) {
      const playPromise = activeAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented.
          if (error.name === 'NotAllowedError') {
            console.log("Autoplay was prevented by the browser.");
          } else {
            console.error("Audio playback failed:", error);
          }
        });
      }
    } else if (volume === 0 && !activeAudio.paused) {
      activeAudio.pause();
    }
  }, [currentLevel, isLoading, volume, audioReady]);

  useEffect(() => {
      const showBottomBanner = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        await showBanner(BannerAdPosition.BOTTOM_CENTER);
      }
    };

    showBottomBanner();

    return () => {
      const hide = async () => {
        if (Capacitor.getPlatform() !== 'web') {
          await hideBanner();
        }
      };
      hide();
    };
  }, [showBanner, hideBanner]);

  useEffect(() => {
    // Only unlock level 1 of each difficulty by default
    const defaultUnlocked = levels
      .filter(level => level.levelNumber === 1)
      .map(level => level.id);

    const savedProgress = localStorage.getItem('unlockedLevels');
    let initialUnlocked: string[];

    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress) as string[];
        // Combine saved progress with default unlocks to ensure level 1 is always available
        initialUnlocked = [...new Set([...defaultUnlocked, ...parsedProgress])];
      } catch (e) {
        console.error("Failed to parse unlocked levels from localStorage", e);
        initialUnlocked = defaultUnlocked; // Fallback to default on error
      }
    } else {
      initialUnlocked = defaultUnlocked;
    }
    
    setUnlockedLevels(initialUnlocked);
    
    const savedEasyCompleted = localStorage.getItem('easyLevelsCompleted');
    if(savedEasyCompleted) {
        setEasyLevelsCompleted(JSON.parse(savedEasyCompleted));
    }
    
    setIsLoading(false);
  }, []);
  
  const handleLevelSelect = (level: Level) => {
    setCurrentLevel(level);
  };

  const handleGameWin = useCallback(() => {
    if (currentLevel) {
      gameAudioRef.current?.pause();

      if (currentLevel.difficulty === 'Easy') {
        setEasyLevelsCompleted(prev => {
          const newCount = prev + 1;
          localStorage.setItem('easyLevelsCompleted', JSON.stringify(newCount));
          if (newCount % 4 === 0 && Capacitor.getPlatform() !== 'web') {
            showInterstitial();
          }
          return newCount;
        });
      }

      const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty).sort((a,b) => a.levelNumber - b.levelNumber);
      const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
      
      const nextLevelIndex = currentIndexInDifficulty + 1;
      if (nextLevelIndex < levelsInDifficulty.length) {
        const nextLevelInDifficulty = levelsInDifficulty[nextLevelIndex];
        setUnlockedLevels(prev => {
          const newUnlocked = [...new Set([...prev, nextLevelInDifficulty.id])];
          localStorage.setItem('unlockedLevels', JSON.stringify(newUnlocked));
          return newUnlocked;
        });
      }
    }
  }, [currentLevel, showInterstitial]);


  const handleExitGame = () => {
    setCurrentLevel(null);
  }

  const handleNextLevel = () => {
    if (currentLevel) {
        const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty).sort((a, b) => a.levelNumber - b.levelNumber);
        const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
        
        const nextLevelIndex = currentIndexInDifficulty + 1;
        if (nextLevelIndex < levelsInDifficulty.length) {
            const nextLevel = levelsInDifficulty[nextLevelIndex];
            if (unlockedLevels.includes(nextLevel.id)) {
                setCurrentLevel(nextLevel);
            }
        }
    }
  }
  
  const handlePreviousLevel = () => {
    if (currentLevel) {
        const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty).sort((a, b) => a.levelNumber - b.levelNumber);
        const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);

        if (currentIndexInDifficulty > 0) {
            const previousLevel = levelsInDifficulty[currentIndexInDifficulty - 1];
            setCurrentLevel(previousLevel);
        }
    }
  }

  const isNextLevelAvailable = currentLevel ? (() => {
    const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty).sort((a, b) => a.levelNumber - b.levelNumber);
    const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
    const nextLevelIndex = currentIndexInDifficulty + 1;
    if (nextLevelIndex < levelsInDifficulty.length) {
      const nextLevel = levelsInDifficulty[nextLevelIndex];
      return unlockedLevels.includes(nextLevel.id);
    }
    return false;
  })() : false;

  const isPreviousLevelAvailable = currentLevel ? levels.filter(l => l.difficulty === currentLevel.difficulty).findIndex(l => l.id === currentLevel.id) > 0 : false;
  
    const isLastLevelOfDifficulty = currentLevel ? (() => {
    const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty).sort((a, b) => a.levelNumber - b.levelNumber);
    const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
    return currentIndexInDifficulty === levelsInDifficulty.length - 1;
  })() : false;

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    </div>
  );
  
  const renderVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-6 w-6" />;
    if (volume < 0.5) return <Volume1 className="h-6 w-6" />;
    return <Volume2 className="h-6 w-6" />;
  }

  const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0] / 100;
      setVolume(newVolume);
      if (newVolume > 0) {
          setLastVolume(newVolume);
      }
  }

  const toggleMute = () => {
    if(volume > 0) {
        setLastVolume(volume);
        setVolume(0);
    } else {
        setVolume(lastVolume > 0 ? lastVolume : 0.2);
    }
  }

  return (
    <div className="flex flex-col text-foreground font-body flex-grow pb-8">
      <div className="w-full mx-auto flex flex-col px-4 sm:px-6 lg:px-8 flex-grow">
          <header className="relative text-center pt-8 mb-4">
            {currentLevel && (
                <Button variant="ghost" size="icon" className="absolute top-1/2 left-0 -translate-y-1/2" onClick={handleExitGame}>
                    <ArrowLeft className="h-8 w-8" strokeWidth={2.5} />
                </Button>
            )}
            
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center gap-2">
                <Image src="/assets/emoji/music/logo/logo.png" alt="Emoji sliderz Logo" width={52} height={52} />
                <h1 className="text-5xl font-extrabold tracking-tighter text-primary font-headline">Emoji sliderz</h1>
              </div>
              {currentLevel ? (
                <p className="text-xl font-bold text-primary">Level {currentLevel.levelNumber}</p>
              ) : (
                <p className="text-muted-foreground text-lg">Slide the tiles to solve the emoji puzzle!</p>
              )}
            </div>
            
            <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center gap-2">
               <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground">
                  {renderVolumeIcon()}
                </Button>
            </div>
          </header>
          
          <main className="flex-grow flex flex-col justify-center">

            {isLoading ? (
              renderLoadingSkeleton()
            ) : currentLevel ? (
              <Game 
                key={currentLevel.id}
                level={currentLevel} 
                onWin={handleGameWin}
                onExit={handleExitGame}
                onNextLevel={handleNextLevel}
                onPreviousLevel={handlePreviousLevel}
                isNextLevelAvailable={isNextLevelAvailable}
                isPreviousLevelAvailable={isPreviousLevelAvailable}
                isLastLevelOfDifficulty={isLastLevelOfDifficulty}
                levelCompleteAudioRef={levelCompleteAudioRef}
                isMuted={isMuted}
                easyLevelsCompleted={easyLevelsCompleted}
                showRewarded={showRewarded}
              />
            ) : (
              <LevelSelect 
                levels={levels} 
                unlockedLevels={unlockedLevels} 
                onLevelSelect={handleLevelSelect}
              />
            )}
          </main>
          <footer className="mt-auto pt-2">
            {!currentLevel && (
              <div className="flex justify-center items-center gap-4 px-4">
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-full max-w-xs"
                  />
              </div>
            )}
            <AdBanner position="bottom" visible={!currentLevel} />
            {currentLevel && (
              <div className="flex justify-center mt-2">
                <Button onClick={handleExitGame} variant="secondary">Back to Levels</Button>
              </div>
            )}
           </footer>
        </div>
    </div>
  );
}
