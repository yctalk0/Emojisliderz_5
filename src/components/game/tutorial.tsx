
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import type { TileType } from '@/hooks/use-game-logic';

interface TutorialProps {
  gridSize: number;
  tileSize: number;
  gap: number;
  moves: Array<{ tileValue: number; direction: 'up' | 'down' | 'left' | 'right' }>;
  tiles: TileType[];
  onComplete: () => void;
  onMove: (tileValue: number) => void;
}

const Tutorial = ({ gridSize, tileSize, gap, moves, tiles, onComplete, onMove }: TutorialProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < moves.length) {
      const timer = setTimeout(() => {
        onMove(moves[step].tileValue);
        setStep(step + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, moves, onMove, onComplete]);

  if (step >= moves.length) return null;

  const currentMove = moves[step];
  const tileIndex = tiles.findIndex(t => t.value === currentMove.tileValue);
  if (tileIndex === -1) return null;

  const fromRow = Math.floor(tileIndex / gridSize);
  const fromCol = tileIndex % gridSize;

  const fromX = fromCol * (tileSize + gap) + tileSize / 2;
  const fromY = fromRow * (tileSize + gap) + tileSize / 2;

  const Arrow = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
  }[currentMove.direction];

  return (
    <AnimatePresence>
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="absolute z-30 pointer-events-none"
        style={{
          left: fromX,
          top: fromY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Arrow className="w-16 h-16 text-white" style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.7))' }} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial;
