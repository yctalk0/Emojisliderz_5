
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

const DifficultyCard = ({ difficulty, levels, unlockedLevels, onLevelSelect }: { difficulty: 'Easy' | 'Hard', levels: Level[], unlockedLevels: string[], onLevelSelect: (level: Level) => void }) => {
  const config = difficultyConfig[difficulty];
  const [currentPage, setCurrentPage] = React.useState(0);
  const levelsPerPage = 9;
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  const paginatedLevels = levels.slice(currentPage * levelsPerPage, (currentPage + 1) * levelsPerPage);

  const goToNextPage = () => {
    setCurrentPage(current => Math.min(current + 1, totalPages - 1));
  }

  const goToPrevPage = () => {
    setCurrentPage(current => Math.max(current - 1, 0));
  }
  
  // Find the first level in this difficulty that is NOT in unlockedLevels (i.e., not completed)
  // This will be our "next" level to play.
  const nextLevelToPlay = levels.find(level => !unlockedLevels.includes(level.id));
  
  const anyUnlockedInDifficulty = levels.some(l => unlockedLevels.includes(l.id));

  // A special check for hard mode: don't render it at all if the first hard level isn't unlocked.
  if (difficulty === 'Hard' && !unlockedLevels.includes('hard-1')) return null;

  return (
    <Card className={cn("overflow-hidden border-2 shadow-lg rounded-2xl z-10", config.cardClass)}>
      <div className="p-3 relative">
        <div className="flex justify-center items-center">
          <h2 className={cn("text-2xl font-bold", config.titleClass)}>{`${difficulty} - ${config.gridClass}`}</h2>
        </div>
      </div>
      <CardContent className="p-3 flex items-center justify-center gap-2">
        {totalPages > 1 && (
          <Button size="icon" variant="ghost" onClick={goToPrevPage} disabled={currentPage === 0} aria-label="Previous levels" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 flex-grow">
          {paginatedLevels.map((level) => {
            const isCompleted = unlockedLevels.includes(level.id);
            // The "next" level is the one we identified above. It should be blinking.
            const isNext = nextLevelToPlay?.id === level.id;
            // A level is playable if it's been completed (can be replayed) OR if it's the next one to play.
            const isUnlocked = isCompleted || isNext;

            return (
              <Button
                key={level.id}
                variant={"secondary"}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onLevelSelect(level)}
                className={cn(
                  "h-16 w-full text-4xl font-bold flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 p-0 relative overflow-hidden",
                  isUnlocked ? config.levelButtonClass : "bg-slate-700/50",
                  // Apply blinking animation only if it's the next level to play
                  isNext && "animate-pulse shadow-lg shadow-yellow-400/50"
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
                     // Adjust opacity for locked levels to make the emoji visible
                    !isUnlocked && "opacity-60"
                  )}
                />
                
                {isNext && (
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
          <Button size="icon" variant="ghost" onClick={goToNextPage} disabled={currentPage === totalPages - 1} aria-label="Next levels" className="h-10 w-10">
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const LevelSelect = ({ levels, unlockedLevels, onLevelSelect }: LevelSelectProps) => {
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
            />
            {difficulty === 'Easy' && <AdBanner position="bottom" visible={true} />} {/* Ad banner between Easy and Hard card */}
          </React.Fragment>
        )
      })}
    </div>
  );
};

export default LevelSelect;

    