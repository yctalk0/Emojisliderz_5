
'use client';
import { useState, useEffect, useRef } from 'react';
import type { Level } from '@/lib/game-data';
import { levels, emojiList } from '@/lib/game-data';
import LevelSelect from '@/components/game/level-select';
import Game from '@/components/game/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Puzzle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home({ params, searchParams }: { params: {}; searchParams: {} }) {
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

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
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (hasInteracted && !isMuted) {
        audio.loop = true;
        audio.play().catch(error => console.error("Audio play failed:", error));
      } else {
        audio.pause();
      }
      audio.muted = isMuted;
    }
  }, [isMuted, hasInteracted]);


  const handleLevelSelect = (level: Level) => {
    if (!hasInteracted) {
        setHasInteracted(true);
    }
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

  const toggleMute = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      setIsMuted(!isMuted);
  }

  const isNextLevelAvailable = currentLevel ? levels.findIndex(l => l.id === currentLevel.id) < levels.length - 1 : false;
  const isPreviousLevelAvailable = currentLevel ? levels.findIndex(l => l.id === currentLevel.id) > 0 : false;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <audio ref={audioRef} src="/assets/emoji/music/bgmusic.mp3" preload="auto" />
      <main className="flex-grow flex flex-col items-center justify-center p-4 -mt-7">
        <div className="w-full max-w-md mx-auto">
          <header className="relative text-center mb-8">
            {currentLevel && (
                <Button variant="ghost" size="icon" className="absolute top-1/2 left-0 -translate-y-1/2" onClick={handleExitGame}>
                    <ArrowLeft className="h-8 w-8" strokeWidth={2.5} />
                </Button>
            )}
            <div className="flex justify-center items-center gap-3">
              <Puzzle className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary font-headline">EmojiSliderz</h1>
            </div>
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
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          ) : (
            <>
              <LevelSelect 
                levels={levels} 
                unlockedLevels={unlockedLevels} 
                onLevelSelect={handleLevelSelect} 
              />
               <div className="flex justify-center mt-4">
                  <Button onClick={toggleMute} variant="secondary" className="px-6 py-4">
                      {isMuted ? <VolumeX className="h-6 w-6 mr-2" /> : <Volume2 className="h-6 w-6 mr-2" />}
                      <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </Button>
               </div>
            </>
          )}
        </div>
      </main>
      <footer className="w-full p-4">
        <Card className="max-w-md mx-auto h-20 flex items-center justify-center bg-secondary/50 border-dashed" style={{ position: 'relative', bottom: '7px' }}>
            <p className="text-muted-foreground">Advertisement</p>
        </Card>
        <div className="max-w-md mx-auto h-[5px] bg-secondary/50 mt-1 rounded-md"></div>
      </footer>
    </div>
  );
}
