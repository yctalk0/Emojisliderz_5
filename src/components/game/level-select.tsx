'use client';

import type { Level } from '@/lib/game-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Star } from 'lucide-react';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevels: string[];
  onLevelSelect: (level: Level) => void;
}

const LevelSelect = ({ levels, unlockedLevels, onLevelSelect }: LevelSelectProps) => {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
  
  const levelsByDifficulty = difficulties.map(difficulty => ({
    difficulty,
    levels: levels.filter(level => level.difficulty === difficulty),
  }));

  return (
    <div className="space-y-6">
      {levelsByDifficulty.map(({ difficulty, levels }) => (
        <Card key={difficulty} className="overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                <Star className="text-accent-foreground fill-accent" />
                {difficulty}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-3 gap-3">
            {levels.map(level => {
              const isUnlocked = unlockedLevels.includes(level.id);
              return (
                <Button
                  key={level.id}
                  variant={isUnlocked ? 'secondary' : 'outline'}
                  disabled={!isUnlocked}
                  onClick={() => onLevelSelect(level)}
                  className="h-20 text-3xl font-bold flex flex-col gap-1 transition-all duration-200 ease-in-out hover:scale-105"
                  aria-label={`Level ${level.emoji}`}
                >
                  {isUnlocked ? (
                    <span className="scale-150">{level.emoji}</span>
                  ) : (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  )}
                  <span className="text-xs font-normal text-muted-foreground">{level.gridSize}x{level.gridSize}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LevelSelect;
