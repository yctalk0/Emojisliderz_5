
'use client';

import * as React from 'react';
import type { Level } from '@/lib/game-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, ArrowRight, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';


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
  const levelsPerPage = 10;
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  const paginatedLevels = levels.slice(currentPage * levelsPerPage, (currentPage + 1) * levelsPerPage);

  const goToNextPage = () => {
    setCurrentPage(current => Math.min(current + 1, totalPages - 1));
  }

  const goToPrevPage = () => {
    setCurrentPage(current => Math.max(current - 1, 0));
  }

  return (
    <Card className={cn("overflow-hidden border-2 shadow-lg rounded-2xl", config.cardClass)}>
      <div className="p-3 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className={cn("text-2xl font-bold", config.titleClass)}>{difficulty}</h2>
            <p className="text-sm text-slate-400">{config.gridClass}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-3 flex items-center justify-center gap-2">
        {totalPages > 1 && (
          <Button size="icon" variant="ghost" onClick={goToPrevPage} disabled={currentPage === 0} aria-label="Previous levels" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="grid grid-cols-5 gap-2 flex-grow">
          {paginatedLevels.map(level => {
            const isUnlocked = unlockedLevels.includes(level.id);
            return (
              <Button
                key={level.id}
                variant={"secondary"}
                disabled={!isUnlocked}
                onClick={() => onLevelSelect(level)}
                className={cn(
                  "h-16 w-full text-4xl font-bold flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 p-0 relative overflow-hidden",
                  isUnlocked ? config.levelButtonClass : "bg-slate-700/50 cursor-not-allowed"
                )}
                aria-label={`Level ${level.levelNumber}`}
              >
                <Image
                  src={level.imageSrc}
                  alt={`Level ${level.levelNumber}`}
                  width={64}
                  height={64}
                  className={cn(
                    "w-full h-full object-contain p-1",
                    !isUnlocked && "opacity-50"
                  )}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
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
  
  const levelsByDifficulty = difficulties.map(difficulty => ({
    difficulty,
    levels: levels.filter(level => level.difficulty === difficulty),
  }));

  return (
    <div className="space-y-4">
      {levelsByDifficulty.map(({ difficulty, levels }, index) => {
        if (levels.length === 0) return null;
        return (
          <React.Fragment key={difficulty}>
            {difficulty === 'Easy' && (
              <Card className="w-full h-24 flex items-center justify-center bg-secondary/50 border-dashed mb-4">
                <p className="text-muted-foreground">Advertisement</p>
              </Card>
            )}
            <DifficultyCard 
              difficulty={difficulty}
              levels={levels}
              unlockedLevels={unlockedLevels}
              onLevelSelect={onLevelSelect}
            />
          </React.Fragment>
        )
      })}
    </div>
  );
};

export default LevelSelect;

    