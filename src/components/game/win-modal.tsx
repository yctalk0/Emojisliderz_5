
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
import { Award, Clock, Move, Play, SkipForward, X } from 'lucide-react';
import Image from 'next/image';
import AdBanner from './ad-banner';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  time: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onExit: () => void;
  hasNextLevel: boolean;
  imageSrc: string;
  isLastLevelOfDifficulty: boolean;
  difficulty: 'Easy' | 'Hard';
}

const WinModal = ({
  isOpen,
  moves,
  time,
  onPlayAgain,
  onNextLevel,
  onExit,
  hasNextLevel,
  imageSrc,
  isLastLevelOfDifficulty,
  difficulty,
}: WinModalProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onExit}>
      <AlertDialogContent className="text-center p-4">
        <Confetti />
         <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="absolute top-2 right-2"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        <AlertDialogHeader className="p-0">
          <div className="mx-auto bg-accent rounded-full p-3 w-fit -mt-12 border-4 border-background blinking-badge">
            <Award className="w-10 h-10 text-accent-foreground" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold mt-2 blinking-text">
            {isLastLevelOfDifficulty ? 'Congratulations!' : 'You Win!'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {isLastLevelOfDifficulty
              ? `You've finished all the ${difficulty} levels!`
              : 'Congratulations, you solved the puzzle!'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center my-2 p-2 rounded-lg overflow-hidden border-2 border-primary/50 shadow-lg">
            <Image src={imageSrc} alt="Solved puzzle" width={128} height={128} className="w-32 h-32 object-contain" />
        </div>

        <div className="flex justify-center gap-8 my-2 text-sm">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <div><span className="font-bold">{moves}</span> Moves</div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div><span className="font-bold">{formatTime(time)}</span></div>
          </div>
        </div>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0 p-0">
          <Button onClick={onNextLevel} disabled={!hasNextLevel} className="w-full h-11">
              <SkipForward className="mr-2 h-5 w-5" />
              Next Level
          </Button>
          <Button onClick={onPlayAgain} variant="secondary" className="w-full h-11">
            <Play className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <Button onClick={onExit} variant="secondary" className="w-full h-11">
            Back to Levels
          </Button>
          <div className="my-1">
            <AdBanner position="bottom" />
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WinModal;
