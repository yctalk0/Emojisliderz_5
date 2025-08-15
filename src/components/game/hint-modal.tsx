
'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import type { TileType } from '@/hooks/use-game-logic';
import Image from 'next/image';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  emoji: string;
  tiles: TileType[];
  gridSize: number;
}

const HintModal = ({ isOpen, onClose, imageSrc, emoji, tiles, gridSize }: HintModalProps) => {
  const [tip] = useState("Try solving the first row, then the second, and so on!");
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
            <div className="mx-auto bg-accent rounded-full p-4 w-fit -mt-16 border-4 border-background">
                <Lightbulb className="w-12 h-12 text-accent-foreground" />
            </div>
          <AlertDialogTitle className="text-center text-3xl font-bold mt-4">Hint</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">Here's what the solved puzzle looks like.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center my-4 p-2 rounded-lg overflow-hidden border">
            <Image src={imageSrc} alt="Hint" width={256} height={256} className="w-full h-auto object-contain" />
        </div>
        <div className="my-2 p-3 bg-secondary/50 rounded-lg">
            <h4 className="font-bold text-center mb-2">💡 Pro Tip</h4>
            <div className="text-center text-muted-foreground italic">
                "{tip}"
            </div>
        </div>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={onClose} className="w-full sm:w-auto">Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HintModal;
