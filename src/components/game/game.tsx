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
  onWin: () => void;
  onExit: () => void;
  onNextLevel: () => void;
  onPreviousLevel: () => void;
  isNextLevelAvailable: boolean;
  isPreviousLevelAvailable: boolean;
  isLastLevelOfDifficulty: boolean;
  onTileSlide: () => void;
  isMuted: boolean;
  easyLevelsCompleted: number;
  showRewarded: () => Promise<{ rewarded: boolean }>;
  unlockedLevels: string[];
  pauseBgMusic: () => void;
  resumeBgMusic: () => void;
  onHintUsedInLevel: (levelId: string) => void;
  hintsUsedCount: number;
  onPlayAgain: () => void;
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
  onTileSlide,
  isMuted,
  easyLevelsCompleted,
  showRewarded,
  unlockedLevels,
  pauseBgMusic,
  resumeBgMusic,
  onHintUsedInLevel,
  onPlayAgain
}: GameProps) => {
  const [hintUsedInCurrentLevel, setHintUsedInCurrentLevel] = useState(false);
  const { toast } = useToast();
  const [showWinModal, setShowWinModal] = useState(false);
  const [showPersistentRippleHint, setShowPersistentRippleHint] = useState(false);

  const handleGameWinLogic = () => {
    if (hintUsedInCurrentLevel) {
      onHintUsedInLevel(level.id);
    }
    onWin();
    setShowPersistentRippleHint(false);
    setTimeout(() => {
      setShowWinModal(true);
    }, 200);
  };
  
  const {
    tiles,
    moves,
    time,
    isSolved,
    isStarted,
    isSolving,
    isCalculatingHint,
    isInitialHint,
    canUndo,
    canSolve,
    hint,
    emptyTileIndex,
    startGame,
    handleTileClick,
    undoMove,
    resetGame,
    autoSolve,
    getNextMoveHint,
    setIsCalculatingHint,
    clearHint,
    reEvaluateHint,
  } = useGameLogic(level.gridSize, level.levelNumber, handleGameWinLogic, isMuted, pauseBgMusic, resumeBgMusic);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  useEffect(() => {
    setShowWinModal(false);
    setHintUsedInCurrentLevel(false);
    // Show persistent ripple hint for the first level by default
    if (level.levelNumber === 1) {
      setShowPersistentRippleHint(true);
      // Only fetch hint if not already calculating and no hint exists
      if (!isCalculatingHint && !hint) {
        getNextMoveHint();
      }
    } else {
      setShowPersistentRippleHint(false);
      clearHint(); // Clear hint if not on the first level
    }
  }, [level, isSolved, isCalculatingHint, hint, getNextMoveHint, clearHint]);

  const handleRestart = () => {
    onPlayAgain();
    resetGame();
    setShowWinModal(false);
    setHintUsedInCurrentLevel(false);
    clearHint();
    if (level.levelNumber === 1) {
      setShowPersistentRippleHint(true);
      // Re-fetch hint for the first level on restart
      getNextMoveHint();
    }
    toast({ title: "Game Restarted", description: "The puzzle has been shuffled." });
  }

  const handleHintRequest = async () => {
    if (level.gridSize > 3) {
      alert("Hints are only available for 2x2 and 3x3 puzzles for now!");
      return;
    }

    try {
      const adResult = await showRewarded();
      if (adResult && adResult.rewarded) {
        getNextMoveHint();
      } else {
        toast({ title: "Ad not completed", description: "You need to watch the ad to get a hint.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error showing rewarded ad:", error);
      toast({ title: "Error", description: "Failed to show ad. Please try again.", variant: "destructive" });
    }
  }

  const handleSolveRequest = async () => {
    if (level.difficulty === 'Hard' && level.gridSize === 3) {
      const adResult = await showRewarded();
      if (adResult && adResult.rewarded) {
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
    onTileSlide();

    // After a tile slide, re-evaluate the hint for the first level
    if (level.levelNumber === 1 && !isSolved) {
      reEvaluateHint();
    }
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
        isCalculatingSolution={(isCalculatingHint && !isInitialHint) || isSolving}
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
          onTileSlide={onTileSlide}
          emptyTileIndex={emptyTileIndex}
          isCalculatingSolution={(isCalculatingHint && !isInitialHint) || isSolving}
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
        isMuted={isMuted}
        pauseBgMusic={pauseBgMusic}
        resumeBgMusic={resumeBgMusic}
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
