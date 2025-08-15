'use client';

import * as React from 'react';
import type { Level } from '@/lib/game-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevels: string[];
  onLevelSelect: (level: Level) => void;
}

const difficultyConfig = {
  'Very Easy': {
    cardClass: "bg-[#E8F5E9] border-[#A5D6A7]",
    titleClass: "text-[#2E7D32]",
    gridClass: "2x2 Grid",
    numberClass: "bg-[#66BB6A] text-white",
    levelButtonClass: "bg-teal-400 hover:bg-teal-500 text-teal-900",
  },
  Easy: {
    cardClass: "bg-[#E3F2FD] border-[#90CAF9]",
    titleClass: "text-[#1565C0]",
    gridClass: "3x3 Grid",
    numberClass: "bg-[#42A5F5] text-white",
    levelButtonClass: "bg-blue-400 hover:bg-blue-500 text-blue-900",
  },
  Medium: {
    cardClass: "bg-[#FFF3E0] border-[#FFCC80]",
    titleClass: "text-[#EF6C00]",
    gridClass: "4x4 Grid",
    numberClass: "bg-[#FFA726] text-white",
    levelButtonClass: "bg-orange-400 hover:bg-orange-500 text-orange-900",
  },
  Hard: {
    cardClass: "bg-[#FFEBEE] border-[#EF9A9A]",
    titleClass: "text-[#C62828]",
    gridClass: "5x5 Grid",
    numberClass: "bg-[#EF5350] text-white",
    levelButtonClass: "bg-red-400 hover:bg-red-500 text-red-900",
  },
} as const;

const DifficultyCard = ({ difficulty, levels, unlockedLevels, onLevelSelect }: { difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard', levels: Level[], unlockedLevels: string[], onLevelSelect: (level: Level) => void }) => {
  const config = difficultyConfig[difficulty];
  const [currentPage, setCurrentPage] = React.useState(0);
  const levelsPerPage = 5;
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
            <h2 className={cn("text-2xl font-bold", config.titleClass)}>{difficulty}</h2>
            <p className="text-sm text-muted-foreground">{config.gridClass}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold", config.numberClass)}>
            {levels[0].gridSize}
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex items-center justify-center gap-2">
        {totalPages > 1 && (
          <Button size="icon" variant="ghost" onClick={goToPrevPage} aria-label="Previous levels">
            <ArrowLeft />
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
                  "h-14 text-2xl font-bold flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110",
                  isUnlocked ? config.levelButtonClass : "bg-gray-300 cursor-not-allowed",
                  !isUnlocked && "opacity-50"
                )}
                aria-label={`Level ${level.levelNumber}`}
              >
                {isUnlocked ? (
                  <span>{level.levelNumber}</span>
                ) : (
                  <Lock className="w-6 h-6 text-gray-500" />
                )}
              </Button>
            );
          })}
        </div>
        {totalPages > 1 && (
          <Button size="icon" variant="ghost" onClick={goToNextPage} aria-label="Next levels">
            <ArrowRight />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const LevelSelect = ({ levels, unlockedLevels, onLevelSelect }: LevelSelectProps) => {
  const difficulties: ('Very Easy' | 'Easy' | 'Medium' | 'Hard')[] = ['Very Easy', 'Easy', 'Medium', 'Hard'];
  
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
