'use client';
import { useState, useEffect, useRef, RefObject } from 'react';
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
  playLevelCompleteSound: () => void; // New prop
  onTileSlide: () => void; // New prop
  isMuted: boolean; // Added prop
  easyLevelsCompleted: number; // New prop
  showRewarded: () => Promise<{ rewarded: boolean }>; // New prop, updated return type
  unlockedLevels: string[]; // New prop
  pauseBgMusic: () => void; // New prop
  resumeBgMusic: () => void; // New prop
  onHintUsedInLevel: (levelId: string) => void; // New prop to notify parent about hint usage
  hintsUsedCount: number; // New prop to track hints used
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
  playLevelCompleteSound, // Destructure new prop
  onTileSlide, // Destructure new prop
  isMuted,
  easyLevelsCompleted, // Destructure new prop
  showRewarded, // Destructure new prop
  unlockedLevels, // Destructure new prop
  pauseBgMusic, // Destructure new prop
  resumeBgMusic, // Destructure new prop
  onHintUsedInLevel, // Destructure new prop
}: GameProps) => {
  const [hintUsedInCurrentLevel, setHintUsedInCurrentLevel] = useState(false); // New state to track hint usage per level
  // Use a ref to track if auto-solve is active
  const isAutoSolvingRef = useRef(false);
  const { toast } = useToast();
  const [showWinModal, setShowWinModal] = useState(false);
  const [showPersistentRippleHint, setShowPersistentRippleHint] = useState(false);

  // This function is called by the game logic when the puzzle is solved
  const handleGameWinLogic = () => {
    if (hintUsedInCurrentLevel) {
      onHintUsedInLevel(level.id); // Notify parent that a hint was used in this level
    }
    onWin(); // Notify parent (GamePage) to update progress
    playLevelCompleteSound(); // Play level complete sound
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
  } = useGameLogic(level.gridSize, handleGameWinLogic, isMuted, pauseBgMusic, resumeBgMusic);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  
  // For the first level of any difficulty, provide a hint by default when the level starts if not solved.
  useEffect(() => {
    if (level.levelNumber === 1 && !isSolved) {
      getNextMoveHint();
    }
  }, [level.levelNumber, isSolved, getNextMoveHint, level.id]);
  
  useEffect(() => {
    setShowWinModal(false);
    setHintUsedInCurrentLevel(false); // Reset hint usage for the new level
    // Reset persistent hint state when level changes
    // Only show persistent ripple hint for the first level of any difficulty
    if (level.levelNumber === 1) {
      setShowPersistentRippleHint(true);
    } else {
      setShowPersistentRippleHint(false);
    }
  }, [level]);

  const handleRestart = () => {
    resetGame();
    setShowWinModal(false);
    setHintUsedInCurrentLevel(false); // Reset hint usage on restart
    toast({ title: "Game Restarted", description: "The puzzle has been shuffled." });
  }

  const handleHintRequest = () => {
    if (level.gridSize > 3) {
      alert("Hints are only available for 2x2 and 3x3 puzzles for now!");
      return;
    }
    setHintUsedInCurrentLevel(true); // Mark that a hint was used in this level
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
    onTileSlide(); // Play tile slide sound on each tile interaction
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
        isMuted={isMuted} // Pass mute state to WinModal
        pauseBgMusic={pauseBgMusic} // Pass pause function
        resumeBgMusic={resumeBgMusic} // Pass resume function
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
