
'use client'
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import type { Hint } from '@/hooks/use-game-logic';
import type { Level } from '@/lib/game-data';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TileProps {
  level: Level;
  value: number;
  gridSize: number;
  imageSrc: string;
  onClick: (tileValue: number) => void;
  tileSize: number;
  correctPosition: number;
  currentPosition: number;
  isCorrectPosition: boolean;
  gap: number;
  showHint: Hint['direction'] | null;
  isSolving: boolean;
}

const ArrowHint = ({ direction, size }: { direction: Hint['direction'], size: number }) => {
  const moveDistance = 10;
  const animation = useSpring({
    loop: { reverse: true },
    from: { transform: 'translate(0px, 0px)' },
    to: {
      transform:
        direction === 'up'
          ? `translate(0px, -${moveDistance}px)`
          : direction === 'down'
          ? `translate(0px, ${moveDistance}px)`
          : direction === 'left'
          ? `translate(-${moveDistance}px, 0px)`
          : `translate(${moveDistance}px, 0px)`,
    },
    config: { duration: 500 },
  });

  const getArrow = () => {
    const props = {
      className: "text-red-500 w-full h-full",
      strokeWidth: 4,
      style: { filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.8))' }
    };
    switch (direction) {
      case 'up':
        return <ChevronUp {...props} />;
      case 'down':
        return <ChevronDown {...props} />;
      case 'left':
        return <ChevronLeft {...props} />;
      case 'right':
        return <ChevronRight {...props} />;
      default:
        return null;
    }
  };

  return (
    <animated.div
      style={animation}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div style={{ width: size * 0.5, height: size * 0.5 }}>
        {getArrow()}
      </div>
    </animated.div>
  );
};

const Tile = ({ 
  level,
  value, 
  gridSize, 
  imageSrc, 
  onClick,
  tileSize, 
  correctPosition, 
  currentPosition, 
  isCorrectPosition,
  gap,
  showHint,
  isSolving,
}: TileProps) => {
  const row = Math.floor(currentPosition / gridSize);
  const col = currentPosition % gridSize;
  
  const { top, left } = useSpring({
    to: {
      top: row * (tileSize + gap),
      left: col * (tileSize + gap),
    },
    config: { tension: 300, friction: 30 },
  });

  const bgPosX = (correctPosition % gridSize) * (100 / (gridSize - 1));
  const bgPosY = Math.floor(correctPosition / gridSize) * (100 / (gridSize - 1));

  if (value === 0) {
    return null;
  }
  
  const useRippleHint = level.levelNumber === 1 && !isSolving;

  return (
    <animated.div
      onClick={() => onClick(value)}
      style={{
        position: 'absolute',
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${gridSize * 100}% auto`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        backgroundColor: 'white',
        touchAction: 'none',
        top,
        left,
      }}
      className={cn(
        'rounded-md cursor-pointer select-none',
        'shadow-lg hover:shadow-xl',
        'overflow-hidden',
        'flex items-center justify-center',
        isCorrectPosition && 'shadow-green-500/50 shadow-[0_0_15px_5px_rgba(74,222,128,0.5)]'
      )}
    >
      {showHint && useRippleHint && (
        <div className="ripple-container" style={{ width: tileSize, height: tileSize }}>
          <div className="ripple" />
          <span className="font-bold text-lg">Tap here</span>
        </div>
      )}
      {showHint && !useRippleHint && <ArrowHint direction={showHint} size={tileSize} />}
      <span className="absolute bottom-1 right-2 text-2xl font-bold text-black" style={{ textShadow: '1px 1px 2px white' }}>
          {value}
      </span>
    </animated.div>
  );
};

export default Tile;
