
'use client'
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import type { Hint } from '@/hooks/use-game-logic';
import type { Level } from '@/lib/game-data';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDrag } from '@use-gesture/react';

interface ArrowHintProps {
  direction: Hint['direction'];
  size: number;
  level: Level;
}

const ArrowHint = ({ direction, size, level }: ArrowHintProps) => {
  const moveDistance = 10;
  
  const isSmoothAnimation = level.difficulty === 'Hard' && level.gridSize === 3 && level.levelNumber >= 2;

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
    config: isSmoothAnimation ? { tension: 200, friction: 10 } : { duration: 500 },
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

interface TileProps {
  level: Level;
  value: number;
  gridSize: number;
  imageSrc: string;
  onClick: (tileValue: number) => void;
  onSlide: (tileValue: number) => void;
  tileSize: number;
  correctPosition: number;
  currentPosition: number;
  isCorrectPosition: boolean;
  gap: number;
  hint: Hint | null;
  isSolving: boolean;
  showPersistentRippleHint: boolean;
  emptyTileIndex: number;
}


const Tile = ({ 
  level,
  value, 
  gridSize, 
  imageSrc, 
  onClick,
  onSlide,
  tileSize, 
  correctPosition, 
  currentPosition, 
  isCorrectPosition,
  gap,
  hint,
  isSolving,
  showPersistentRippleHint,
  emptyTileIndex
}: TileProps) => {
  const row = Math.floor(currentPosition / gridSize);
  const col = currentPosition % gridSize;
  const emptyRow = Math.floor(emptyTileIndex / gridSize);
  const emptyCol = emptyTileIndex % gridSize;

  const canMoveHorizontal = row === emptyRow;
  const canMoveVertical = col === emptyCol;

  const [{ x, y }, api] = useSpring(() => ({
    x: col * (tileSize + gap),
    y: row * (tileSize + gap),
    config: { tension: 300, friction: 30 },
  }));

  useEffect(() => {
    api.start({
      x: col * (tileSize + gap),
      y: row * (tileSize + gap),
      immediate: false // Always animate
    });
  }, [currentPosition, tileSize, gap, api, col, row]);


  const bind = useDrag(
    ({ down, movement: [mx, my], tap, args }) => {
      const [tileValue] = args;
      if (tap) {
        onClick(tileValue);
        onSlide(tileValue);
        return;
      }
      
      const targetX = col * (tileSize + gap);
      const targetY = row * (tileSize + gap);

      let newX = targetX;
      let newY = targetY;

      if (down) {
        if (canMoveHorizontal) {
          const maxMove = emptyCol > col ? tileSize + gap : -tileSize - gap;
          const clampedMx = emptyCol > col ? Math.max(0, Math.min(mx, maxMove)) : Math.min(0, Math.max(mx, maxMove));
          newX += clampedMx;
        }
        if (canMoveVertical) {
          const maxMove = emptyRow > row ? tileSize + gap : -tileSize - gap;
          const clampedMy = emptyRow > row ? Math.max(0, Math.min(my, maxMove)) : Math.min(0, Math.max(my, maxMove));
          newY += clampedMy;
        }
      } else {
        const threshold = tileSize / 2;
        if (canMoveHorizontal && Math.abs(mx) > threshold) {
          if ((mx > 0 && emptyCol > col) || (mx < 0 && emptyCol < col)) {
            onClick(value);
            onSlide(value);
            return;
          }
        }
        if (canMoveVertical && Math.abs(my) > threshold) {
          if ((my > 0 && emptyRow > row) || (my < 0 && emptyRow < row)) {
            onClick(value);
            onSlide(value);
            return;
          }
        }
      }
      
      api.start({ x: newX, y: newY, immediate: down });
    }, {
      from: () => [x.get(), y.get()],
      bounds: () => {
        const bounds = {
          left: -Infinity,
          right: Infinity,
          top: -Infinity,
          bottom: Infinity,
        };

        if (canMoveHorizontal) {
          if (emptyCol > col) {
            bounds.left = col * (tileSize + gap);
            bounds.right = emptyCol * (tileSize + gap);
          } else {
            bounds.left = emptyCol * (tileSize + gap);
            bounds.right = col * (tileSize + gap);
          }
        }
        if (canMoveVertical) {
          if (emptyRow > row) {
            bounds.top = row * (tileSize + gap);
            bounds.bottom = emptyRow * (tileSize + gap);
          } else {
            bounds.top = emptyRow * (tileSize + gap);
            bounds.bottom = row * (tileSize + gap);
          }
        }
        return bounds;
      },
      rubberband: true,
      filterTaps: true,
      axis: (canMoveHorizontal && canMoveVertical) ? undefined : canMoveHorizontal ? 'x' : 'y'
    }
  );

  const bgPosX = (correctPosition % gridSize) * (100 / (gridSize - 1));
  const bgPosY = Math.floor(correctPosition / gridSize) * (100 / (gridSize - 1));

  if (value === 0) {
    return null;
  }
  
  const shouldShowPersistentRipple = showPersistentRippleHint && hint?.tileValue === value && !isSolving;
  const shouldShowArrowHint = hint?.direction && hint?.tileValue === value && !shouldShowPersistentRipple;

  return (
    <animated.div
      {...bind(value)}
      style={{
        position: 'absolute',
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${gridSize * 100}% auto`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        backgroundColor: 'white',
        touchAction: 'none',
        x,
        y,
      }}
      className={cn(
        'rounded-md cursor-pointer select-none',
        'shadow-lg hover:shadow-xl',
        'overflow-hidden',
        'flex items-center justify-center',
        isCorrectPosition 
          ? 'shadow-green-500/90 shadow-[0_0_12px_4px_rgba(74,222,128,0.9)]' 
          : 'shadow-red-500/90 shadow-[0_0_12px_4px_rgba(239,68,68,0.9)]'
      )}
    >
      {shouldShowPersistentRipple && (
        <div className="ripple-container" style={{ width: tileSize, height: tileSize }}>
          <div className="ripple" />
          <span className="font-bold text-lg">Tap here</span>
        </div>
      )}
      {shouldShowArrowHint && <ArrowHint direction={hint!.direction} size={tileSize} level={level} />}
      <span className="absolute bottom-1 right-2 text-2xl font-bold text-black" style={{ textShadow: '1px 1px 2px white' }}>
          {value}
      </span>
    </animated.div>
  );
};

export default Tile;
