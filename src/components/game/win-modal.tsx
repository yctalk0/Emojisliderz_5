'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Confetti from './confetti';
import { Award, Clock, Move, Play, SkipForward } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  time: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onExit: () => void;
  hasNextLevel: boolean;
  isNextLevelUnlocked: boolean;
}

const WinModal = ({
  isOpen,
  moves,
  time,
  onPlayAgain,
  onNextLevel,
  onExit,
  hasNextLevel,
  isNextLevelUnlocked,
}: WinModalProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="text-center">
        <Confetti />
        <AlertDialogHeader>
          <div className="mx-auto bg-accent rounded-full p-4 w-fit -mt-16 border-4 border-background">
            <Award className="w-12 h-12 text-accent-foreground" />
          </div>
          <AlertDialogTitle className="text-3xl font-bold mt-4">You Win!</AlertDialogTitle>
          <AlertDialogDescription className="text-lg">Congratulations, you solved the puzzle!</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center gap-8 my-4">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-muted-foreground" />
            <span className="font-bold">{moves}</span> Moves
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="font-bold">{formatTime(time)}</span>
          </div>
        </div>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={onNextLevel} className="w-full h-12">
              <SkipForward className="mr-2 h-5 w-5" />
              Next Level
          </Button>
          <Button onClick={onPlayAgain} variant="secondary" className="w-full h-12">
            <Play className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <Button onClick={onExit} variant="link">
            Back to Levels
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WinModal;
