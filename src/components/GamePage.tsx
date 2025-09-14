
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Level } from '@/lib/game-data';
import { levels } from '@/lib/game-data';
import LevelSelect from '@/components/game/level-select';
import Game from '@/components/game/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume1, Volume2, VolumeX, Info } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import AdBanner from './game/ad-banner';
import useAdMob from '@/hooks/use-admob';
import { Capacitor } from '@capacitor/core';
import { BannerAdPosition } from '@capacitor-community/admob';
import useSound from '@/hooks/use-sound'; // Import the custom hook
import Confetti from './game/confetti';
import InfoDialog from './game/info-dialog';

export default function GamePage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppStarted, setIsAppStarted] = useState(false); // New state for initial interaction
  const [easyLevelsCompleted, setEasyLevelsCompleted] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0); // New state for hints used
  const [volume, setVolume] = useState(0.2);
  const [lastVolume, setLastVolume] = useState(0.2);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const isMuted = volume === 0;
  const { showBanner, hideBanner, showInterstitial, showRewarded } = useAdMob();

  // Use the custom useSound hook for all audio
  const { play: playMenuMusic, stop: stopMenuMusic } = useSound('/assets/music/Opening.mp3', volume, 'music', isMuted, true); // Loop menu music
  const { play: playBgMusic, pause: pauseBgMusic, resume: resumeBgMusic, stop: stopBgMusic } = useSound('/assets/music/bgmusic.mp3', volume, 'music', isMuted, true); // Loop background music
  const { play: playLevelCompleteSound } = useSound('/assets/music/level_complete.mp3', volume, 'effect');
  const { play: playTileSlideSound } = useSound('/assets/music/slide_1.mp3', volume, 'effect'); // Assuming slide_1.mp3 is the tile sliding sound

  // Consolidated effect to manage audio playback
  useEffect(() => {
    if (isLoading || !isAppStarted) return; // Don't play music until app is started by user

    if (currentLevel) {
      // In game
      stopMenuMusic();
      playBgMusic(); // Play background music when in game
    } else {
      // In menu
      stopBgMusic(); // Stop background music when in menu
      playMenuMusic();
    }
  }, [currentLevel, isLoading, isAppStarted, playMenuMusic, stopMenuMusic, playBgMusic, stopBgMusic]);

  useEffect(() => {
    if (!isAppStarted) return; // Don't show banner until app is started by user

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
  }, [showBanner, hideBanner, isAppStarted]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('unlockedLevels');
    let initialUnlocked: string[] = ['easy-1', 'hard-1']; // Default unlocked levels

    if (savedProgress) {
        try {
            const parsedProgress = JSON.parse(savedProgress) as string[];
            if (Array.isArray(parsedProgress) && parsedProgress.length > 0) {
              initialUnlocked = parsedProgress;
            }
        } catch (e) {
            console.error("Failed to parse unlocked levels, sticking to default.", e);
        }
    }
    
    setUnlockedLevels(initialUnlocked);
    localStorage.setItem('unlockedLevels', JSON.stringify(initialUnlocked)); // Use initialUnlocked here
    
    const savedEasyCompleted = localStorage.getItem('easyLevelsCompleted');
    if(savedEasyCompleted) {
        setEasyLevelsCompleted(JSON.parse(savedEasyCompleted));
    }

    const savedHintsUsed = localStorage.getItem('hintsUsedCount');
    if(savedHintsUsed) {
        setHintsUsedCount(JSON.parse(savedHintsUsed));
    }
    
    setIsLoading(false);
  }, []);

  const handleHintUsed = useCallback((levelId: string) => {
    setHintsUsedCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('hintsUsedCount', JSON.stringify(newCount));
      return newCount;
    });
  }, []);
  
  const handleLevelSelect = (level: Level) => {
    setCurrentLevel(level);
  };

  const handleGameWin = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    playLevelCompleteSound();
    if (currentLevel) {
      pauseBgMusic();
  
      if (currentLevel.difficulty === 'Easy' && currentLevel.gridSize === 2) {
        setEasyLevelsCompleted(prev => {
          const newCount = prev + 1;
          localStorage.setItem('easyLevelsCompleted', JSON.stringify(newCount));
          if (newCount % 3 === 0 && Capacitor.getPlatform() !== 'web') {
            showRewarded();
          }
          return newCount;
        });
      }
  
      setUnlockedLevels(prevUnlocked => {
        const newUnlocked = new Set(prevUnlocked);
        newUnlocked.add(currentLevel.id);
  
        const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty).sort((a, b) => a.levelNumber - b.levelNumber);
        const currentIndexInDifficulty = levelsInDifficulty.findIndex(l => l.id === currentLevel.id);
  
        if (currentIndexInDifficulty < levelsInDifficulty.length - 1) {
          const nextLevelInDifficulty = levelsInDifficulty[currentIndexInDifficulty + 1];
          newUnlocked.add(nextLevelInDifficulty.id);
        }
  
        if (currentLevel.id === 'easy-1') {
          newUnlocked.add('hard-1');
        }
  
        const updatedUnlocked = Array.from(newUnlocked);
        localStorage.setItem('unlockedLevels', JSON.stringify(updatedUnlocked));
        return updatedUnlocked;
      });
    }
  }, [currentLevel, pauseBgMusic, showRewarded, playLevelCompleteSound]);


  const handleExitGame = () => {
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
  
    const isLastLevelOfDifficulty = currentLevel ? (() => {
    const levelsInDifficulty = levels.filter(l => l.difficulty === currentLevel.difficulty);
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
    if (volume === 0) return <VolumeX className="h-6 w-6 text-white" />;
    if (volume < 0.5) return <Volume1 className="h-6 w-6 text-white" />;
    return <Volume2 className="h-6 w-6 text-white" />;
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

  const handleStartApp = () => {
    setIsAppStarted(true);
    playMenuMusic();
  };

  if (!isAppStarted) {
    return (
      <div 
        className="flex flex-col items-center justify-center w-full h-full flex-grow bg-background cursor-pointer" 
        onClick={handleStartApp}
      >
        <div className="flex justify-center items-center gap-2">
          <Image src="/assets/emoji/music/logo/logo.png" alt="Emoji sliderz Logo" width={64} height={64} />
          <h1 className="text-6xl font-extrabold tracking-tighter text-primary font-headline">Emoji sliderz</h1>
        </div>
        <p className="mt-4 text-2xl text-muted-foreground font-bold blinking-text">Tap to start</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-foreground font-body flex-grow">
      <Confetti isOpen={showConfetti} />
      <InfoDialog isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
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
             <Button variant="ghost" size="icon" className="absolute top-1/2 right-0 -translate-y-1/2" onClick={() => setShowInfoModal(true)}>
                <Info className="h-8 w-8" strokeWidth={2.5} />
            </Button>
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
                onTileSlide={playTileSlideSound}
                isMuted={isMuted}
                easyLevelsCompleted={easyLevelsCompleted}
                hintsUsedCount={hintsUsedCount} // Pass hintsUsedCount
                onHintUsedInLevel={handleHintUsed} // Pass handleHintUsed
                showRewarded={showRewarded}
                unlockedLevels={unlockedLevels}
                pauseBgMusic={pauseBgMusic} // Pass pause function
                resumeBgMusic={resumeBgMusic} // Pass resume function
              />
            ) : (
              <LevelSelect 
                levels={levels} 
                unlockedLevels={unlockedLevels} 
                onLevelSelect={handleLevelSelect}
              />
            )}
          </main>
        </div>
        <footer className="bg-background/80 backdrop-blur-sm mt-auto py-2 px-4 pb-4 sm:pb-6 lg:pb-8">
            <div className="flex justify-center items-center gap-4 mb-2">
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
            <div className="mb-2">
              <AdBanner position="bottom" visible={true} />
            </div>
            {currentLevel && (
              <div className="flex justify-center mt-2">
                <Button onClick={handleExitGame} variant="secondary">Back to Levels</Button>
              </div>
            )}
        </footer>
    </div>
  );
}
