// src/components/game/rewarded-ad-dialog.tsx
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

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
          <AlertDialogTitle>Unlock this feature?</AlertDialogTitle>
          <AlertDialogDescription>Watch a rewarded ad to unlock this feature.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Watch Ad</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default RewardedAdDialog;
