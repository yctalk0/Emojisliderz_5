'use client';

import type { Level } from '@/lib/game-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevels: string[];
  onLevelSelect: (level: Level) => void;
}

const difficultyConfig = {
  Easy: {
    cardClass: "bg-[#E9F9EE] border-[#A7E6BB]",
    titleClass: "text-[#1E462E]",
    gridClass: "3x3 Grid",
    numberClass: "bg-[#4CAF50] text-white",
    levelButtonClass: "bg-green-400 hover:bg-green-500 text-green-900",
  },
  Medium: {
    cardClass: "bg-[#FFF4E0] border-[#FFD5A1]",
    titleClass: "text-[#66461D]",
    gridClass: "4x4 Grid",
    numberClass: "bg-[#FF9800] text-white",
    levelButtonClass: "bg-orange-400 hover:bg-orange-500 text-orange-900",
  },
  Hard: {
    cardClass: "bg-[#FDEDED] border-[#F8BABA]",
    titleClass: "text-[#5C2121]",
    gridClass: "5x5 Grid",
    numberClass: "bg-[#F44336] text-white",
    levelButtonClass: "bg-red-400 hover:bg-red-500 text-red-900",
  },
} as const;


const LevelSelect = ({ levels, unlockedLevels, onLevelSelect }: LevelSelectProps) => {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
  
  const levelsByDifficulty = difficulties.map(difficulty => ({
    difficulty,
    levels: levels.filter(level => level.difficulty === difficulty),
  }));

  return (
    <div className="space-y-6">
      {levelsByDifficulty.map(({ difficulty, levels }) => {
        const config = difficultyConfig[difficulty];
        return (
          <Card key={difficulty} className={cn("overflow-hidden border-2 shadow-lg rounded-2xl", config.cardClass)}>
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
            <CardContent className="p-4 grid grid-cols-5 gap-3">
              {levels.map(level => {
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
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
};

export default LevelSelect;
