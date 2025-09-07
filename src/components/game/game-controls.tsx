
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, HelpCircle, Move, RotateCw, WandSparkles, Undo2 } from 'lucide-react';
import type { Level } from '@/lib/game-data';

interface GameControlsProps {
  level: Level;
  moves: number;
  time: number;
  onHint: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onSolve: () => void;
  canUndo: boolean;
  canSolve: boolean;
}

const GameControls = ({ level, moves, time, onHint, onUndo, onRestart, onSolve, canUndo, canSolve }: GameControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <CardContent className="flex justify-around items-center p-3">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Move className="w-6 h-6 text-primary" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-300">Moves</span>
              <span className="text-white">{moves}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-sm text-gray-300">Level</span>
            <span className="text-lg font-bold">{level.levelNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <Clock className="w-6 h-6 text-primary" />
             <div className="flex flex-col items-center">
               <span className="text-sm text-gray-300">Time</span>
              <span className="text-white">{formatTime(time)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button variant="secondary" onClick={onHint} className="h-12 text-base font-bold">
          <HelpCircle className="w-5 h-5 mr-2" /> Hint
        </Button>
        <Button variant="secondary" onClick={onUndo} disabled={!canUndo} className="h-12 text-base font-bold">
          <Undo2 className="w-5 h-5 mr-2" /> Undo
        </Button>
        <Button variant="secondary" onClick={onRestart} className="h-12 text-base font-bold">
          <RotateCw className="w-5 h-5 mr-2" /> Restart
        </Button>
         <Button variant="secondary" onClick={onSolve} disabled={!canSolve} className="h-12 text-base font-bold">
          <WandSparkles className="w-5 h-5 mr-2" /> Solve
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
