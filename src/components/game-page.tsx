
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
  const [lastVolume, setLastVolume] = useState(0.2);
  const { prepareInterstitial, showInterstitial, isInitialized } = useAdMob();
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const levelCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = volume === 0;
  const [userInteracted, setUserInteracted] = useState(false);

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
    if (!userInteracted) return;

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
  }, [currentLevel, isLoading, volume, userInteracted]);

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
        if(userInteracted && !isLoading && activeAudio.paused) {
            activeAudio.play().catch(e => console.log(e));
        }
    }


  }, [volume, currentLevel, isLoading, userInteracted]);

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
    if (!userInteracted) setUserInteracted(true);
    setCurrentLevel(level);
  };

  const handleGameWin = () => {
    if (currentLevel) {
      gameAudioRef.current?.pause();
      if (!isMuted) {
        levelCompleteAudioRef.current?.play().catch(e => console.error("Could not play win sound", e));
      }

      let adShown = false;
      if (currentLevel.difficulty === 'Easy') {
        const newCount = easyLevelsCompleted + 1;
        setEasyLevelsCompleted(newCount);
        localStorage.setItem('easyLevelsCompleted', JSON.stringify(newCount));
        if (newCount % 5 === 0) {
          showInterstitial();
          adShown = true;
        }
      }

      // Unlock next level logic
      const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty);
      const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
      
      if (currentIndexInDifficulty < levelsInDifficulty.length - 1) {
        const nextLevelInDifficulty = levelsInDifficulty[currentIndexInDifficulty + 1];
        const newUnlocked = [...new Set([...unlockedLevels, nextLevelInDifficulty.id])];
        setUnlockedLevels(newUnlocked);
        localStorage.setItem('unlockedLevels', JSON.stringify(newUnlocked));
      }
      return adShown;
    }
    return false;
  };

  const handleExitGame = () => {
    if (!userInteracted) setUserInteracted(true);
    setCurrentLevel(null);
  }

  const handleNextLevel = () => {
    if (currentLevel) {
        const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty);
        const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
        
        if (currentIndexInDifficulty < levelsInDifficulty.length - 1) {
            const nextLevel = levelsInDifficulty[currentIndexInDifficulty + 1];
            if (unlockedLevels.includes(nextLevel.id)) {
                setCurrentLevel(nextLevel);
            }
        }
    }
  }
  
  const handlePreviousLevel = () => {
    if (currentLevel) {
        const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty);
        const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);

        if (currentIndexInDifficulty > 0) {
            const previousLevel = levelsInDifficulty[currentIndexInDifficulty - 1];
            setCurrentLevel(previousLevel);
        }
    }
  }

  const isNextLevelAvailable = currentLevel ? (() => {
    const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty);
    const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
    if (currentIndexInDifficulty < levelsInDifficulty.length - 1) {
      const nextLevel = levelsInDifficulty[currentIndexInDifficulty + 1];
      return unlockedLevels.includes(nextLevel.id);
    }
    return false;
  })() : false;

  const isPreviousLevelAvailable = currentLevel ? levels.filter(l => l.difficulty === currentLevel.difficulty).findIndex(l => l.id === currentLevel.id) > 0 : false;
  
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
      if (!userInteracted) setUserInteracted(true);
      const newVolume = value[0] / 100;
      setVolume(newVolume);
      if (newVolume > 0) {
          setLastVolume(newVolume);
      }
  }

  const toggleMute = () => {
    if (!userInteracted) setUserInteracted(true);
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
                <Image src="/assets/emoji/music/logo/logo.png" alt="EmojiSliderz Logo" width={52} height={52} />
                <h1 className="text-5xl font-extrabold tracking-tighter text-primary font-headline">EmojiSliderz</h1>
              </div>
              {currentLevel ? (
                <p className="text-xl font-bold text-primary">Level {currentLevel.levelNumber}</p>
              ) : (
                <p className="text-muted-foreground text-lg">Slide the tiles to solve the emoji puzzle!</p>
              )}
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
                easyLevelsCompleted={easyLevelsCompleted}
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
            <div className="flex justify-center items-center gap-4 px-4">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground">
                  {renderVolumeIcon()}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-full max-w-xs"
                />
            </div>
            {currentLevel && (
              <div className="flex justify-center mt-2">
                <Button onClick={handleExitGame} variant="secondary">Back to Levels</Button>
              </div>
            )}
            <AdBanner position="bottom" className="mt-2" />
          </footer>
        </div>
    </div>
  );
}
