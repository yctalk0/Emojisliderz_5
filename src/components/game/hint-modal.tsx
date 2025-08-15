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

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const HintModal = ({ isOpen, onClose, imageSrc }: HintModalProps) => {
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
        <div className="flex justify-center my-4 rounded-lg overflow-hidden">
            <img src={imageSrc} alt="Hint" className="w-full max-w-xs h-auto object-cover" />
        </div>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={onClose} className="w-full sm:w-auto">Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HintModal;
