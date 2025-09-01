
'use client';
import { useState, useEffect } from 'react';
import type { Level } from '@/lib/game-data';
import useGameLogic from '@/hooks/use-game-logic';
import GameBoard from './game-board';
import GameControls from './game-controls';
import WinModal from './win-modal';
import HintModal from './hint-modal';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameProps {
  level: Level;
  onWin: () => void;
  onExit: () => void;
  onNextLevel: () => void;
  onPreviousLevel: () => void;
  isNextLevelAvailable: boolean;
  isPreviousLevelAvailable: boolean;
}

const Game = ({ 
  level, 
  onWin, 
  onExit, 
  onNextLevel, 
  onPreviousLevel, 
  isNextLevelAvailable,
  isPreviousLevelAvailable,
}: GameProps) => {
  const { toast } = useToast();
  const {
    tiles,
    moves,
    time,
    isSolved,
    isStarted,
    canUndo,
    canSolve,
    startGame,
    handleTileClick,
    undoMove,
    resetGame,
    autoSolve,
  } = useGameLogic(level.gridSize, onWin);

  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  
  // This effect will re-initialize the game logic when the level (e.g. emoji) changes.
  useEffect(() => {
    resetGame();
  }, [level, resetGame]);

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
        onSolve={autoSolve}
        canUndo={canUndo}
        canSolve={canSolve}
      />
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={onPreviousLevel} disabled={!isPreviousLevelAvailable}>
            <ChevronLeft className="h-8 w-8" />
        </Button>
        <GameBoard
            tiles={tiles}
            gridSize={level.gridSize}
            onTileClick={handleTileInteraction}
            imageSrc={level.imageSrc}
        />
        <Button size="icon" variant="ghost" onClick={onNextLevel} disabled={!isNextLevelAvailable}>
            <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <WinModal
        isOpen={isSolved}
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
    </div>
  );
};

export default Game;
