
'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

interface RewardedAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RewardedAdDialog = ({ isOpen, onClose, onConfirm }: RewardedAdDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Watch an Ad to Unlock</AlertDialogTitle>
          <AlertDialogDescription>
            Watch a short video to unlock this feature for the current level.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <Video className="mr-2 h-4 w-4" />
            Watch Ad
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RewardedAdDialog;
