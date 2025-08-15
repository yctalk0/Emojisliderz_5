
'use client';

import * as React from 'react';
import type { Level } from '@/lib/game-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevels: string[];
  onLevelSelect: (level: Level) => void;
}

const difficultyConfig = {
  Easy: {
    cardClass: "bg-teal-900/50 border-teal-700",
    titleClass: "text-teal-400",
    gridClass: "2x2 Grid",
    numberClass: "bg-teal-500 text-teal-950",
    levelButtonClass: "bg-teal-500/20 hover:bg-teal-500/30 text-teal-200",
  },
  Hard: {
    cardClass: "bg-amber-900/50 border-amber-700",
    titleClass: "text-amber-400",
    gridClass: "3x3 Grid",
    numberClass: "bg-amber-500 text-amber-950",
    levelButtonClass: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200",
  },
} as const;

const DifficultyCard = ({ difficulty, levels, unlockedLevels, onLevelSelect }: { difficulty: 'Easy' | 'Hard', levels: Level[], unlockedLevels: string[], onLevelSelect: (level: Level) => void }) => {
  const config = difficultyConfig[difficulty];
  const [currentPage, setCurrentPage] = React.useState(0);
  const levelsPerPage = 10; // Show 10 levels (2 rows of 5)
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  const paginatedLevels = levels.slice(currentPage * levelsPerPage, (currentPage + 1) * levelsPerPage);

  const goToNextPage = () => {
    setCurrentPage(current => (current + 1) % totalPages);
  }

  const goToPrevPage = () => {
    setCurrentPage(current => (current - 1 + totalPages) % totalPages);
  }

  return (
    <Card className={cn("overflow-hidden border-2 shadow-lg rounded-2xl", config.cardClass)}>
      <div className="p-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className={cn("text-3xl font-bold", config.titleClass)}>{difficulty}</h2>
            <p className="text-md text-slate-400">{config.gridClass}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex items-center justify-center gap-2">
        {totalPages > 1 && (
          <Button size="icon" variant="ghost" onClick={goToPrevPage} aria-label="Previous levels" className="h-12 w-12">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <div className="grid grid-cols-5 gap-3 flex-grow">
          {paginatedLevels.map(level => {
            const isUnlocked = unlockedLevels.includes(level.id);
            return (
              <Button
                key={level.id}
                variant={"secondary"}
                disabled={!isUnlocked}
                onClick={() => onLevelSelect(level)}
                className={cn(
                  "h-20 w-full text-5xl font-bold flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 p-2",
                  isUnlocked ? config.levelButtonClass : "bg-slate-700/50 cursor-not-allowed",
                  !isUnlocked && "opacity-50"
                )}
                aria-label={`Level ${level.levelNumber}`}
              >
                {isUnlocked ? (
                  <Image
                    src={level.imageSrc}
                    alt={`Level ${level.levelNumber}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Lock className="w-8 h-8 text-slate-400" />
                )}
              </Button>
            );
          })}
        </div>
        {totalPages > 1 && (
          <Button size="icon" variant="ghost" onClick={goToNextPage} aria-label="Next levels" className="h-12 w-12">
            <ArrowRight className="w-6 h-6" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const LevelSelect = ({ levels, unlockedLevels, onLevelSelect }: LevelSelectProps) => {
  const difficulties: ('Easy' | 'Hard')[] = ['Easy', 'Hard'];
  
  const levelsByDifficulty = difficulties.map(difficulty => ({
    difficulty,
    levels: levels.filter(level => level.difficulty === difficulty),
  }));

  return (
    <div className="space-y-6">
      {levelsByDifficulty.map(({ difficulty, levels }) => {
        if (levels.length === 0) return null;
        return (
          <DifficultyCard 
            key={difficulty}
            difficulty={difficulty}
            levels={levels}
            unlockedLevels={unlockedLevels}
            onLevelSelect={onLevelSelect}
          />
        )
      })}
    </div>
  );
};

export default LevelSelect;
