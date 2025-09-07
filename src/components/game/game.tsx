
'use client';
import { useState, useEffect } from 'react';
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
}

const Game = ({ 
  level, 
  onWin, 
  onExit, 
  onNextLevel, 
  onPreviousLevel, 
  isNextLevelAvailable,
  isPreviousLevelAvailable,
  isLastLevelOfDifficulty
}: GameProps) => {
  const { toast } = useToast();
  const [showWinModal, setShowWinModal] = useState(false);

  const handleWin = () => {
    onWin();
    setTimeout(() => {
      setShowWinModal(true);
    }, 700);
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
    if (level.levelNumber === 1 && moves < 3 && !isSolved) {
      getNextMoveHint();
    }
  }, [moves, level.levelNumber, isSolved, getNextMoveHint]);
  
  useEffect(() => {
    setShowWinModal(false);
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

  const handleSolveRequest = () => {
    autoSolve();
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
        isLastLevelOfDifficulty={isLastLevelOfDifficulty}
        difficulty={level.difficulty}
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
