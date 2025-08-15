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
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);

  useEffect(() => {
    // Unlock the first level of each difficulty by default.
    const defaultUnlocked = levels
      .filter(level => level.levelNumber === 1)
      .map(level => level.id);

    const savedProgress = localStorage.getItem('unlockedLevels');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        if (Array.isArray(parsedProgress)) {
          // Merge saved progress with default unlocked levels
          setUnlockedLevels([...new Set([...defaultUnlocked, ...parsedProgress])]);
        } else {
           setUnlockedLevels(defaultUnlocked);
        }
      } catch (e) {
        console.error("Failed to parse unlocked levels from localStorage", e);
        setUnlockedLevels(defaultUnlocked);
      }
    } else {
        setUnlockedLevels(defaultUnlocked);
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
        // Only unlock if the difficulty is the same.
        if(nextLevel.difficulty === currentLevel.difficulty) {
          const newUnlocked = [...new Set([...unlockedLevels, nextLevel.id])];
          setUnlockedLevels(newUnlocked);
          localStorage.setItem('unlockedLevels', JSON.stringify(newUnlocked));
        }
      }
    }
  };

  const handleExitGame = () => {
    setCurrentLevel(null);
  }

  const handleNextLevel = () => {
    if (currentLevel) {
        const currentDifficultyLevels = levels.filter(l => l.difficulty === currentLevel.difficulty);
        const unsolvedLevels = currentDifficultyLevels.filter(l => !unlockedLevels.includes(l.id) || l.id === currentLevel.id);

        let nextLevel: Level | undefined;

        if (unsolvedLevels.length > 1) {
             // Find the next level in the difficulty that is not the current one
             nextLevel = unsolvedLevels.find(l => l.id !== currentLevel.id);
        }

        // If no more unsolved levels, pick a random one from the same difficulty
        if (!nextLevel) {
            const sameDifficultyUnlocked = currentDifficultyLevels.filter(l => unlockedLevels.includes(l.id) && l.id !== currentLevel.id);
            if(sameDifficultyUnlocked.length > 0) {
              nextLevel = sameDifficultyUnlocked[Math.floor(Math.random() * sameDifficultyUnlocked.length)];
            }
        }
        
        // Final fallback to just a random emoji on the same level structure if all else fails
        if(!nextLevel) {
            const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
            const newLevelData: Level = {
                ...currentLevel,
                emoji: randomEmoji,
                imageSrc: `https://placehold.co/400x400.png?text=${randomEmoji}`,
            };
            setCurrentLevel(newLevelData);
        } else {
            setCurrentLevel(nextLevel);
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
