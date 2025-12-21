
'use client';

import * as React from 'react';
import type { Level } from '@/lib/game-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import AdBanner from './ad-banner';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevels: string[];
  onLevelSelect: (level: Level) => void;
  // Optional reward hint info
  easyHintsForLevel?: string | null;
  easyHintsAvailable?: boolean;
}

const difficultyConfig = {
  Easy: {
    cardClass: "border-blue-700",
    titleClass: "text-blue-400",
    gridClass: "2x2 Grid",
    levelButtonClass: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200",
  },
  Hard: {
    cardClass: "border-purple-700",
    titleClass: "text-purple-400",
    gridClass: "3x3 Grid",
    levelButtonClass: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-200",
  },
} as const;

const DifficultyCard = ({ difficulty, levels, unlockedLevels, onLevelSelect, easyHintsForLevel, easyHintsAvailable }: { difficulty: 'Easy' | 'Hard', levels: Level[], unlockedLevels: string[], onLevelSelect: (level: Level) => void, easyHintsForLevel?: string | null, easyHintsAvailable?: boolean }) => {
  const config = difficultyConfig[difficulty];
  const [currentPage, setCurrentPage] = React.useState(0);
  const [userViewingPrev, setUserViewingPrev] = React.useState(false); // prevent immediate auto-advance when user manually views previous pages
  const levelsPerPage = 9;
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  const paginatedLevels = levels.slice(currentPage * levelsPerPage, (currentPage + 1) * levelsPerPage);

  const goToNextPage = () => {
    // When user explicitly goes forward, clear the manual-view guard so auto-advance may happen again
    setUserViewingPrev(false);
    setCurrentPage(current => Math.min(current + 1, totalPages - 1));
  }

  const goToPrevPage = () => {
    // When user manually views previous pages, set a temporary guard so we don't immediately auto-advance back.
    setUserViewingPrev(true);
    setCurrentPage(current => Math.max(current - 1, 0));
    // Clear the manual view flag after a short period (5s) so auto-advance can resume.
    window.setTimeout(() => setUserViewingPrev(false), 5000);
  }

  // Auto-advance: if every level on the current page is unlocked/completed, and there's a next page,
  // automatically move to the next page. Respect the manual-view guard so a user can inspect previous pages.
  React.useEffect(() => {
    if (totalPages <= 1) return;

    // If user explicitly navigated to view previous pages, do not auto-advance immediately.
    if (userViewingPrev) return;

    const allCompletedOnPage = paginatedLevels.length > 0 && paginatedLevels.every(l => unlockedLevels.includes(l.id));
    if (allCompletedOnPage && currentPage < totalPages - 1) {
      // small delay so the UI feels natural when auto-scrolling
      const t = window.setTimeout(() => {
        setCurrentPage(current => Math.min(current + 1, totalPages - 1));
      }, 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedLevels, currentPage, totalPages, paginatedLevels, userViewingPrev]);

  // A special check for hard mode: don't render it at all if the first hard level isn't unlocked.
  if (difficulty === 'Hard' && !unlockedLevels.includes('hard-1')) return null;
  
  const lastUnlockedLevelInDifficulty = levels
    .filter(l => unlockedLevels.includes(l.id))
    .sort((a, b) => b.levelNumber - a.levelNumber)[0];

  return (
    <Card className={cn("overflow-hidden border-2 shadow-lg rounded-2xl z-10", config.cardClass)}>
      <div className="p-3 relative">
        <div className="flex justify-center items-center">
          <h2 className={cn("text-2xl font-bold", config.titleClass)}>{`${difficulty} - ${config.gridClass}`}</h2>
        </div>
      </div>
      <CardContent className="p-3 flex items-center justify-center gap-2">
        {totalPages > 1 && (
          <Button onClick={goToPrevPage} disabled={currentPage === 0} aria-label="Previous levels" className="h-10 w-10 hover:bg-accent hover:text-accent-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 flex-grow">
          {paginatedLevels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isNextToPlay = lastUnlockedLevelInDifficulty && lastUnlockedLevelInDifficulty.levelNumber + 1 === level.levelNumber;
            const isBlinking = isUnlocked && !levels.some(l => l.levelNumber === level.levelNumber + 1 && unlockedLevels.includes(l.id));


            return (
              <Button
                key={level.id}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onLevelSelect(level)}
                className={cn(
                  "h-16 w-full text-4xl font-bold flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 p-0 relative overflow-hidden",
                  isUnlocked ? config.levelButtonClass : "bg-slate-700/50",
                  isBlinking && "animate-pulse shadow-lg shadow-yellow-400/50"
                )}
                aria-label={`Level ${level.levelNumber}`}
              >
                <Image
                  src={level.imageSrc}
                  alt={`Level ${level.levelNumber}`}
                  width={64}
                  height={64}
                  priority={level.levelNumber === 1}
                  className={cn(
                    "w-full h-full object-contain p-1",
                    !isUnlocked && "opacity-60"
                  )}
                />
                
                {/* Indicator for an assigned free Easy hint for this level */}
                {easyHintsForLevel === level.id && (
                  <div className="absolute top-1 right-1 text-yellow-300 text-sm font-bold">💡</div>
                )}

                {isBlinking && (
                  <div className="absolute bottom-1 right-1">
                    <Unlock className="w-5 h-5 text-white" />
                  </div>
                )}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                    <Lock className="w-8 h-8 text-slate-200" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>
        {totalPages > 1 && (
          <Button onClick={goToNextPage} disabled={currentPage === totalPages - 1} aria-label="Next levels" className="h-10 w-10 hover:bg-accent hover:text-accent-foreground">
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const LevelSelect = ({ levels, unlockedLevels, onLevelSelect, easyHintsForLevel, easyHintsAvailable }: LevelSelectProps) => {
  const difficulties: ('Easy' | 'Hard')[] = ['Easy', 'Hard'];
  
  // Sort levels by levelNumber within each difficulty group
  const levelsByDifficulty = difficulties.map(difficulty => ({
    difficulty,
    levels: levels.filter(level => level.difficulty === difficulty).sort((a,b) => a.levelNumber - b.levelNumber),
  }));

  return (
    <div className="space-y-4">
      <AdBanner position="top" visible={true} /> {/* Ad banner above Easy - 2x2 Grid */}
      {levelsByDifficulty.map(({ difficulty, levels }) => {
        if (levels.length === 0) return null;
        
        return (
          <React.Fragment key={difficulty}>
            <DifficultyCard 
              difficulty={difficulty}
              levels={levels}
              unlockedLevels={unlockedLevels}
              onLevelSelect={onLevelSelect}
              easyHintsForLevel={easyHintsForLevel}
              easyHintsAvailable={easyHintsAvailable}
            />
            {difficulty === 'Easy' && <AdBanner position="bottom" visible={true} />} {/* Ad banner between Easy and Hard card */}
          </React.Fragment>
        )
      })}
    </div>
  );
};

export default LevelSelect;
