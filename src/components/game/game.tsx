
'use client';
import { useState, useEffect, RefObject } from 'react';
import type { Level } from '@/lib/game-data';
import useGameLogic from '@/hooks/use-game-logic';
import GameBoard from './game-board';
import GameControls from './game-controls';
import WinModal from './win-modal';
import HintModal from './hint-modal';
import { useToast } from '@/hooks/use-toast';
import AdBanner from './ad-banner';

interface GameProps {
  level: Level;
  onWin: () => void; // This is now only for parent (GamePage) to update progress
  onExit: () => void;
  onNextLevel: () => void;
  onPreviousLevel: () => void;
  isNextLevelAvailable: boolean;
  isPreviousLevelAvailable: boolean;
  isLastLevelOfDifficulty: boolean;
  levelCompleteAudioRef: RefObject<HTMLAudioElement>; // Added prop
  isMuted: boolean; // Added prop
  easyLevelsCompleted: number; // New prop
  showRewarded: () => Promise<{ rewarded: boolean }>; // New prop, updated return type
}

const Game = ({
  level,
  onWin,
  onExit,
  onNextLevel,
  onPreviousLevel,
  isNextLevelAvailable,
  isPreviousLevelAvailable,
  isLastLevelOfDifficulty,
  levelCompleteAudioRef,
  isMuted,
  easyLevelsCompleted, // Destructure new prop
  showRewarded, // Destructure new prop
}: GameProps) => {
  const { toast } = useToast();
  const [showWinModal, setShowWinModal] = useState(false);
  const [showPersistentRippleHint, setShowPersistentRippleHint] = useState(false);

  // This function is called by the game logic when the puzzle is solved
  const handleGameWinLogic = () => {
    onWin(); // Notify parent (GamePage) to update progress
    setShowPersistentRippleHint(false); // Hide persistent hint on win
    // We wait a shorter moment for the last tile animation to finish, then show the modal
    setTimeout(() => {
      setShowWinModal(true);
    }, 200); // Reduced delay to 200ms
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
  } = useGameLogic(level.gridSize, handleGameWinLogic);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  
  useEffect(() => {
    // For the first level, always get the next hint if not solved and game is not started
    if (level.levelNumber === 1 && !isSolved && !isStarted) {
      getNextMoveHint();
    }
  }, [level.levelNumber, isSolved, isStarted, getNextMoveHint]);
  
  useEffect(() => {
    setShowWinModal(false);
    // Reset persistent hint state when level changes
    if (level.levelNumber === 1) {
      setShowPersistentRippleHint(true);
    } else {
      setShowPersistentRippleHint(false);
    }
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
    getNextMoveHint();
  }

  const handleSolveRequest = async () => {
    if (level.difficulty === 'Hard' && level.gridSize === 3) {
      // Show rewarded ad
      const adResult = await showRewarded(); // Assuming showRewarded returns a promise that resolves on ad completion
      if (adResult && adResult.rewarded) { // Assuming adResult has a 'rewarded' property indicating success
        autoSolve();
      } else {
        toast({ title: "Ad not completed", description: "You need to watch the ad to solve the level.", variant: "destructive" });
      }
    } else {
      autoSolve();
    }
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
        easyLevelsCompleted={easyLevelsCompleted}
        showRewarded={showRewarded}
      />
      <AdBanner position="bottom" visible={!isSolved} />
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
          showPersistentRippleHint={showPersistentRippleHint}
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
        isLastLevelOfDifficulty={isLastLevelOfDifficulty}
        difficulty={level.difficulty}
        levelCompleteAudioRef={levelCompleteAudioRef} // Pass ref to WinModal
        isMuted={isMuted} // Pass mute state to WinModal
      />
      <HintModal 
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        imageSrc={level.imageSrc}
        emoji={level.emoji}
        tiles={tiles}
        gridSize={level.gridSize}
      />
    </div>
  );
};

export default Game;
