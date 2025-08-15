'use client';
import { useState } from 'react';
import type { Level } from '@/lib/game-data';
import useGameLogic from '@/hooks/use-game-logic';
import GameBoard from './game-board';
import GameControls from './game-controls';
import WinModal from './win-modal';
import HintModal from './hint-modal';
import { useToast } from '@/hooks/use-toast';

interface GameProps {
  level: Level;
  onWin: () => void;
  onExit: () => void;
  onNextLevel: () => void;
  nextLevelId: string | undefined;
  isNextLevelUnlocked: boolean;
}

const Game = ({ level, onWin, onExit, onNextLevel, nextLevelId, isNextLevelUnlocked }: GameProps) => {
  const { toast } = useToast();
  const {
    tiles,
    moves,
    time,
    isSolved,
    isStarted,
    canUndo,
    startGame,
    handleTileClick,
    undoMove,
    resetGame,
  } = useGameLogic(level.gridSize, onWin);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  const handleRestart = () => {
    resetGame();
    toast({ title: "Game Restarted", description: "The puzzle has been shuffled." });
  }

  const handleHint = () => {
    setIsHintModalOpen(true);
  }
  
  const handleTileInteraction = (tileValue: number) => {
    if (!isStarted) {
        startGame();
    }
    handleTileClick(tileValue);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <GameControls
        moves={moves}
        time={time}
        onHint={handleHint}
        onUndo={undoMove}
        onRestart={handleRestart}
        canUndo={canUndo}
      />
      <GameBoard
        tiles={tiles}
        gridSize={level.gridSize}
        onTileClick={handleTileInteraction}
        imageSrc={level.imageSrc}
      />
      <WinModal
        isOpen={isSolved}
        moves={moves}
        time={time}
        onPlayAgain={handleRestart}
        onNextLevel={onNextLevel}
        onExit={onExit}
        hasNextLevel={!!nextLevelId}
        isNextLevelUnlocked={isNextLevelUnlocked}
      />
      <HintModal 
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        imageSrc={level.imageSrc}
      />
    </div>
  );
};

export default Game;
