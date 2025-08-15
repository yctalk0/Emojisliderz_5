
'use client';
import { useState, useEffect } from 'react';
import type { Level } from '@/lib/game-data';
import { levels, emojiList } from '@/lib/game-data';
import LevelSelect from '@/components/game/level-select';
import Game from '@/components/game/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home(props: {}) {
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code now only runs on the client
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
    setIsLoading(false);
  }, []);

  const handleLevelSelect = (level: Level) => {
    setCurrentLevel(level);
  };

  const handleGameWin = () => {
    if (currentLevel) {
      const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
      if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1];
        // Unlock next level regardless of difficulty, as levels are now sequential
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
            setCurrentLevel(levels[currentIndex + 1]);
        }
    }
  }
  
  const handlePreviousLevel = () => {
    if (currentLevel) {
        const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
        if (currentIndex > 0) {
            setCurrentLevel(levels[currentIndex - 1]);
        }
    }
  }

  const isNextLevelAvailable = currentLevel ? levels.findIndex(l => l.id === currentLevel.id) < levels.length - 1 : false;
  const isPreviousLevelAvailable = currentLevel ? levels.findIndex(l => l.id === currentLevel.id) > 0 : false;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <header className="relative text-center mb-8">
            {currentLevel && (
                <Button variant="ghost" size="icon" className="absolute top-1/2 left-0 -translate-y-1/2" onClick={handleExitGame}>
                    <ArrowLeft className="h-8 w-8" strokeWidth={2.5} />
                </Button>
            )}
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-primary font-headline">EmojiSliderz</h1>
            <p className="text-muted-foreground mt-2 text-lg">Slide the tiles to solve the emoji puzzle!</p>
          </header>
          
          {isLoading ? (
             <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
             </div>
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
        </div>
      </main>
      <footer className="w-full p-4">
        <Card className="max-w-md mx-auto h-20 flex items-center justify-center bg-secondary/50 border-dashed">
            <p className="text-muted-foreground">Advertisement</p>
        </Card>
      </footer>
    </div>
  );
}
