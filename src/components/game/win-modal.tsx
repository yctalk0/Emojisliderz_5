
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
import { useEffect, RefObject } from 'react';

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
  levelCompleteAudioRef: RefObject<HTMLAudioElement>;
  isMuted: boolean;
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
  levelCompleteAudioRef,
  isMuted,
}: WinModalProps) => {

  useEffect(() => {
    if (isOpen && !isMuted) {
      levelCompleteAudioRef.current?.play().catch(e => console.error("Could not play win sound", e));
    } else if (!isOpen) {
      if (levelCompleteAudioRef.current) {
        levelCompleteAudioRef.current.pause();
        levelCompleteAudioRef.current.currentTime = 0;
      }
    }
  }, [isOpen, isMuted, levelCompleteAudioRef]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onExit}>
      <AlertDialogContent className="text-center p-4">
        <Confetti isOpen={isOpen} />
         <Button
            size="icon"
            onClick={onExit}
            className="absolute top-2 right-2 bg-cyan-500 text-black hover:bg-cyan-600 rounded-full"
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
            <Move className="w-4 h-4 text-white" />
            <div><span className="font-bold text-white blinking-value">{moves}</span> <span className="text-white">Moves</span></div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <div><span className="font-bold text-white blinking-value">{formatTime(time)}</span></div>
          </div>
        </div>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0 p-0">
          <Button onClick={onNextLevel} disabled={!hasNextLevel} className="w-full h-11">
              <SkipForward className="mr-2 h-5 w-5" />
              Next Level
          </Button>
          <AdBanner position="bottom" visible={true} /> {/* Ad banner under Next Level button */}
          <Button onClick={onPlayAgain} variant="secondary" className="w-full h-11">
            <Play className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <Button onClick={onExit} variant="secondary" className="w-full h-11">
            Back to Levels
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WinModal;
