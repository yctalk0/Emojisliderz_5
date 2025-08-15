'use client';
import { useState, useEffect } from 'react';
import type { Level } from '@/lib/game-data';
import { levels, emojiList } from '@/lib/game-data';
import LevelSelect from '@/components/game/level-select';
import Game from '@/components/game/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home(props: {}) {
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(['easy-1']);

  useEffect(() => {
    const savedProgress = localStorage.getItem('unlockedLevels');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        if (Array.isArray(parsedProgress)) {
          setUnlockedLevels(parsedProgress);
        }
      } catch (e) {
        console.error("Failed to parse unlocked levels from localStorage", e);
        // Reset to default if data is corrupted
        localStorage.setItem('unlockedLevels', JSON.stringify(['easy-1']));
      }
    }
  }, []);

  const handleLevelSelect = (level: Level) => {
    setCurrentLevel(level);
  };

  const handleGameWin = () => {
    if (currentLevel) {
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
      // Logic to stay on the same level but change emoji
      if (unlockedLevels.includes(currentLevel.id)) {
        const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        const newLevelData: Level = {
            ...currentLevel,
            emoji: randomEmoji,
            imageSrc: `https://placehold.co/400x400.png?text=${randomEmoji}`,
        };
        setCurrentLevel(newLevelData);
      } else if (currentIndex < levels.length - 1) { // Fallback to original logic if needed
        const nextLevel = levels[currentIndex + 1];
        if (unlockedLevels.includes(nextLevel.id)) {
            setCurrentLevel(nextLevel);
        }
      }
    }
  }

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
          
          {currentLevel ? (
            <Game 
              level={currentLevel} 
              onWin={handleGameWin}
              onExit={handleExitGame}
              onNextLevel={handleNextLevel}
              nextLevelId={levels[levels.findIndex(l => l.id === currentLevel.id) + 1]?.id}
              isNextLevelUnlocked={unlockedLevels.includes(currentLevel.id)}
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
