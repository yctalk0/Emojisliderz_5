
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
import { Info, Move, HelpCircle, WandSparkles, RotateCw, Undo2 } from 'lucide-react';

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoDialog = ({ isOpen, onClose }: InfoDialogProps) => {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto bg-accent rounded-full p-4 w-fit -mt-16 border-4 border-background">
            <Info className="w-12 h-12 text-accent-foreground" />
          </div>
          <AlertDialogTitle className="text-center text-3xl font-bold mt-4">How to Play</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">Your goal is to solve the emoji puzzle!</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Move className="w-5 h-5 mt-1 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Objective</h4>
              <p>Slide the tiles to arrange them in the correct order and reveal the complete emoji image.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-1 text-primary shrink-0 font-bold text-lg flex items-center justify-center">1.</div>
            <div>
              <h4 className="font-bold text-foreground">Controls</h4>
              <p>Tap or drag a tile adjacent to the empty space to move it.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 mt-1 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Hint</h4>
              <p>Stuck? Use the hint button to see the next correct move. Requires watching an ad.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <WandSparkles className="w-5 h-5 mt-1 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Solve</h4>
              <p>Let the AI solve the puzzle for you! This also requires watching an ad for harder levels.</p>
            </div>
          </div>
           <div className="flex items-start gap-3">
            <Undo2 className="w-5 h-5 mt-1 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Undo</h4>
              <p>Made a mistake? You can undo your last move.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCw className="w-5 h-5 mt-1 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Restart</h4>
              <p>Want a fresh start? Restart the level at any time.</p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="sm:justify-center mt-4">
          <AlertDialogAction onClick={onClose} className="w-full sm:w-auto">Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InfoDialog;
