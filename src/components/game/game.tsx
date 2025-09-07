
'use client';
import { useState, useEffect, useRef } from 'react';
import type { Level } from '@/lib/game-data';
import useGameLogic from '@/hooks/use-game-logic';
import GameBoard from './game-board';
import GameControls from './game-controls';
import WinModal from './win-modal';
import HintModal from './hint-modal';
import RewardedAdDialog from './rewarded-ad-dialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import AdBanner from './ad-banner';
import useAdMob from '@/hooks/use-admob';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

interface GameProps {
  level: Level;
  onWin: () => boolean;
  onExit: () => void;
  onNextLevel: () => void;
  onPreviousLevel: () => void;
  isNextLevelAvailable: boolean;
  isPreviousLevelAvailable: boolean;
  easyLevelsCompleted: number;
}

const Game = ({ 
  level, 
  onWin, 
  onExit, 
  onNextLevel, 
  onPreviousLevel, 
  isNextLevelAvailable,
  isPreviousLevelAvailable,
  easyLevelsCompleted,
}: GameProps) => {
  const { toast } = useToast();
  const { showRewarded, prepareRewarded } = useAdMob();
  const [showWinModal, setShowWinModal] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [solveAdWatched, setSolveAdWatched] = useState(false);
  const [hintUnlockedLevels, setHintUnlockedLevels] = useState<string[]>([]);
  const [adPurpose, setAdPurpose] = useState<'solve' | 'hint' | null>(null);
  
  const adPurposeRef = useRef(adPurpose);
  adPurposeRef.current = adPurpose;

  const handleWin = () => {
    const adWasShown = onWin();
    if (!adWasShown) {
      setTimeout(() => {
        setShowWinModal(true);
      }, 700);
    }
  };
  
  const {
    tiles,
    moves,
    time,
    isSolved,
    isStarted,
    isSolving,
    canUndo,
    canSolve,
    hint,
    startGame,
    handleTileClick,
    undoMove,
    resetGame,
    autoSolve,
    getNextMoveHint,
  } = useGameLogic(level.gridSize, handleWin);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  
  useEffect(() => {
    prepareRewarded();

    const rewardedListener = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
      if (adPurposeRef.current === 'solve') {
        setSolveAdWatched(true);
        autoSolve();
      } else if (adPurposeRef.current === 'hint') {
        setHintUnlockedLevels(prev => [...prev, level.id]);
        getNextMoveHint();
      }
      setAdPurpose(null);
    });
    
    return () => {
      rewardedListener.then(listener => listener.remove());
    };
  }, [level.id, autoSolve, prepareRewarded, getNextMoveHint]);

  useEffect(() => {
    if (level.levelNumber === 1 && moves < 3 && !isSolved) {
      getNextMoveHint();
    }
  }, [moves, level.levelNumber, isSolved, getNextMoveHint]);
  
  useEffect(() => {
    setShowWinModal(false);
    setSolveAdWatched(false);
  }, [level]);

  const handleRestart = () => {
    resetGame();
    setShowWinModal(false);
    toast({ title: "Game Restarted", description: "The puzzle has been shuffled." });
  }

  const handleHintRequest = () => {
    if (level.gridSize > 3) {
      alert("Hints are only available for 2x2 and 3x3 puzzles for now!");
      return;
    }

    if (level.difficulty === 'Hard' && !hintUnlockedLevels.includes(level.id)) {
      setAdPurpose('hint');
      setIsAdDialogOpen(true);
    } else {
      getNextMoveHint();
    }
  }

  const handleSolveRequest = () => {
    if (level.difficulty === 'Easy' && (easyLevelsCompleted + 1) % 3 === 0 && !solveAdWatched) {
      setAdPurpose('solve');
      setIsAdDialogOpen(true);
    } else if (level.difficulty === 'Hard' && !solveAdWatched) {
      setAdPurpose('solve');
      setIsAdDialogOpen(true);
    } else {
      autoSolve();
    }
  };

  const handleAdConfirm = () => {
    setIsAdDialogOpen(false);
    showRewarded();
  };
  
  const handleTileInteraction = (tileValue: number) => {
    if (!isStarted) {
        startGame();
    }
    handleTileClick(tileValue);
  }
  
  return (
    <div className="flex flex-col items-center gap-4">
      <GameControls
        level={level}
        moves={moves}
        time={time}
        onHint={handleHintRequest}
        onUndo={undoMove}
        onRestart={handleRestart}
        onSolve={handleSolveRequest}
        canUndo={canUndo}
        canSolve={canSolve}
      />
      <AdBanner position="middle" />
      <GameBoard
          level={level}
          tiles={tiles}
          gridSize={level.gridSize}
          onTileClick={handleTileInteraction}
          imageSrc={level.imageSrc}
          hint={hint}
          difficulty={level.difficulty}
          isSolving={isSolving}
          isGameWon={isSolved}
      />

      <WinModal
        isOpen={showWinModal}
        moves={moves}
        time={time}
        onPlayAgain={handleRestart}
        onNextLevel={onNextLevel}
        onExit={onExit}
        hasNextLevel={isNextLevelAvailable}
        imageSrc={level.imageSrc}
      />
      <HintModal 
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        imageSrc={level.imageSrc}
        emoji={level.emoji}
        tiles={tiles}
        gridSize={level.gridSize}
      />
      <RewardedAdDialog
        isOpen={isAdDialogOpen}
        onClose={() => setIsAdDialogOpen(false)}
        onConfirm={handleAdConfirm}
      />
    </div>
  );
};

export default Game;
