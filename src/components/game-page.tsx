
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Level } from '@/lib/game-data';
import { levels } from '@/lib/game-data';
import LevelSelect from '@/components/game/level-select';
import Game from '@/components/game/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import useAdMob from '@/hooks/use-admob';
import Image from 'next/image';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import AdBanner from './game/ad-banner';

export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [easyLevelsCompleted, setEasyLevelsCompleted] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const { prepareInterstitial, showInterstitial, isInitialized } = useAdMob();
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const levelCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = volume === 0;

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
    }
  }, []);
  
  useEffect(() => {
    const menuAudio = menuAudioRef.current;
    const gameAudio = gameAudioRef.current;
    if (!menuAudio || !gameAudio) return;

    const playAudio = (audio: HTMLAudioElement) => {
        if (audio.paused && volume > 0) {
            audio.play().catch(error => console.log("Audio play failed:", error));
        }
    };
    
    if (currentLevel === null && !isLoading) {
      gameAudio.pause();
      gameAudio.currentTime = 0;
      playAudio(menuAudio);
    } else if (currentLevel !== null) {
      menuAudio.pause();
      menuAudio.currentTime = 0;
      playAudio(gameAudio);
    } else {
        menuAudio.pause();
        gameAudio.pause();
    }
  }, [currentLevel, isLoading, volume]);

  useEffect(() => {
    const menuAudio = menuAudioRef.current;
    const gameAudio = gameAudioRef.current;
    const levelCompleteAudio = levelCompleteAudioRef.current;
    if (!menuAudio || !gameAudio || !levelCompleteAudio) return;

    menuAudio.volume = volume;
    gameAudio.volume = volume;
    levelCompleteAudio.volume = volume;
    
    const activeAudio = currentLevel ? gameAudio : menuAudio;
    if(volume === 0) {
        activeAudio.pause()
    } else {
        if(!isLoading && activeAudio.paused) {
            activeAudio.play().catch(e => console.log(e));
        }
    }


  }, [volume, currentLevel, isLoading]);

  useEffect(() => {
    if (isInitialized) {
      prepareInterstitial();
    }
  }, [isInitialized, prepareInterstitial]);
  
  useEffect(() => {
    const defaultUnlocked = levels
      .filter(level => level.levelNumber === 1)
      .map(level => level.id);

    const savedProgress = localStorage.getItem('unlockedLevels');
    let initialUnlocked = defaultUnlocked;
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        if (Array.isArray(parsedProgress)) {
          initialUnlocked = [...new Set([...defaultUnlocked, ...parsedProgress])];
        }
      } catch (e) {
        console.error("Failed to parse unlocked levels from localStorage", e);
      }
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

  const handleGameWin = () => {
    if (currentLevel) {
      gameAudioRef.current?.pause();
      if (!isMuted) {
        levelCompleteAudioRef.current?.play().catch(e => console.error("Could not play win sound", e));
      }

      // Show Ad logic
      if (currentLevel.difficulty === 'Hard') {
        showInterstitial();
      } else if (currentLevel.difficulty === 'Easy') {
        const newCount = easyLevelsCompleted + 1;
        setEasyLevelsCompleted(newCount);
        localStorage.setItem('easyLevelsCompleted', JSON.stringify(newCount));
        if (newCount % 3 === 0) {
          showInterstitial();
        }
      }

      // Unlock next level logic
      const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
      if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1];
        const newUnlocked = [...new Set([...unlockedLevels, nextLevel.id])];
        setUnlockedLevels(newUnlocked);
        localStorage.setItem('unlockedLevels', JSON.stringify(newUnlocked));
      }
    }
  };

  const handleExitGame = () => {
    setCurrentLevel(null);
  }

  const handleNextLevel = () => {
    if (currentLevel) {
        const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
        if (currentIndex < levels.length - 1) {
            const nextLevel = levels[currentIndex + 1];
            if (unlockedLevels.includes(nextLevel.id)) {
                setCurrentLevel(nextLevel);
            }
        }
    }
  }
  
  const handlePreviousLevel = () => {
    if (currentLevel) {
        const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
        if (currentIndex > 0) {
            const previousLevel = levels[currentIndex - 1];
            setCurrentLevel(previousLevel);
        }
    }
  }

  const isNextLevelAvailable = currentLevel ? levels.findIndex(l => l.id === currentLevel.id) < levels.length - 1 && unlockedLevels.includes(levels[levels.findIndex(l => l.id === currentLevel.id) + 1].id) : false;
  const isPreviousLevelAvailable = currentLevel ? levels.findIndex(l => l.id === currentLevel.id) > 0 : false;
  
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

  return (
    <div className="flex flex-col text-foreground font-body h-full flex-grow">
      <div className="w-full max-w-md mx-auto flex flex-col p-4 flex-grow">
          <header className="relative text-center mb-4">
            {currentLevel && (
                <Button variant="ghost" size="icon" className="absolute top-1/2 left-0 -translate-y-1/2" onClick={handleExitGame}>
                    <ArrowLeft className="h-8 w-8" strokeWidth={2.5} />
                </Button>
            )}
            
            <div className="flex justify-center items-center gap-3">
              <Image src="/assets/emoji/music/logo/logo.png" alt="EmojiSliderz Logo" width={42} height={42} />
              <h1 className="text-4xl font-extrabold tracking-tighter text-primary font-headline">EmojiSliderz</h1>
            </div>
            <p className="text-muted-foreground mt-2 text-lg">Slide the tiles to solve the emoji puzzle!</p>
          </header>
          
          <main className="flex-grow flex flex-col justify-center">
            {isLoading ? (
              renderLoadingSkeleton()
            ) : currentLevel ? (
              <Game 
                level={currentLevel} 
                onWin={handleGameWin}
                onExit={handleExitGame}
                onNextLevel={handleNextLevel}
                onPreviousLevel={handlePreviousLevel}
                isNextLevelAvailable={isNextLevelAvailable}
                isPreviousLevelAvailable={isPreviousLevelAvailable}
              />
            ) : (
              <LevelSelect 
                levels={levels} 
                unlockedLevels={unlockedLevels} 
                onLevelSelect={handleLevelSelect}
              />
            )}
          </main>
          <footer className="mt-auto pt-4 space-y-4">
             <div className="flex justify-center items-center gap-4 px-4 py-2">
                <div className="text-muted-foreground">
                  {renderVolumeIcon()}
                </div>
                <Slider
                  defaultValue={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  className="w-full max-w-xs"
                />
              </div>
              <AdBanner position="bottom" />
          </footer>
        </div>
    </div>
  );
}

    
