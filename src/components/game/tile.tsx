
'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';
import type { Hint } from '@/hooks/use-game-logic';
import type { Level } from '@/lib/game-data';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ArrowHintProps {
  direction: Hint['direction'];
  size: number;
  level: Level; // Add level prop
}

const ArrowHint = ({ direction, size, level }: ArrowHintProps) => {
  const moveDistance = 10;
  
  // Determine if the smooth animation should be applied
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
    config: isSmoothAnimation ? { tension: 200, friction: 10 } : { duration: 500 }, // Conditional config
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
  onTileSlide: (tileValue: number) => void;
  tileSize: number;
  correctPosition: number;
  currentPosition: number;
  isCorrectPosition: boolean;
  gap: number;
  hint: Hint | null;
  isSolving: boolean;
  showPersistentRippleHint: boolean;
  emptyIndex: number;
}


const Tile = ({ 
  level,
  value, 
  gridSize, 
  imageSrc, 
  onTileSlide,
  tileSize, 
  correctPosition, 
  currentPosition, 
  isCorrectPosition,
  gap,
  hint,
  isSolving,
  showPersistentRippleHint,
  emptyIndex,
}: TileProps) => {
  const row = Math.floor(currentPosition / gridSize);
  const col = currentPosition % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  const canMove = useMemo(() => {
    if (isSolving || value === 0) return null;
    if (row === emptyRow && Math.abs(col - emptyCol) === 1) return 'horizontal';
    if (col === emptyCol && Math.abs(row - emptyRow) === 1) return 'vertical';
    return null;
  }, [row, col, emptyRow, emptyCol, isSolving, value]);

  const [{ x, y }, api] = useSpring(() => ({
    x: col * (tileSize + gap),
    y: row * (tileSize + gap),
    config: { tension: 300, friction: 30 },
  }));

  useEffect(() => {
    if (!isSolving) {
      api.start({
        x: col * (tileSize + gap),
        y: row * (tileSize + gap),
        immediate: false,
      });
    }
  }, [row, col, tileSize, gap, api, isSolving]);


  const bind = useDrag(
    ({ down, movement: [mx, my], distance, direction: [dx], event }) => {
      event.preventDefault();
      if (!canMove || isSolving) return;

      const originalX = col * (tileSize + gap);
      const originalY = row * (tileSize + gap);
      
      let newX = originalX;
      let newY = originalY;

      if (down) {
        if (canMove === 'horizontal') {
          newX += mx;
        } else if (canMove === 'vertical') {
          newY += my;
        }
      } else { // on release
        const moveThreshold = tileSize / 2;
        let shouldMove = false;

        if (canMove === 'horizontal' && Math.abs(mx) > moveThreshold) {
          // Check if moving towards the empty space
          if ((mx > 0 && col < emptyCol) || (mx < 0 && col > emptyCol)) {
            shouldMove = true;
          }
        } else if (canMove === 'vertical' && Math.abs(my) > moveThreshold) {
           // Check if moving towards the empty space
          if ((my > 0 && row < emptyRow) || (my < 0 && row > emptyRow)) {
            shouldMove = true;
          }
        }
        
        if (shouldMove) {
          // Snap to empty spot - the logic will handle the swap
          onTileSlide(value);
        } else {
          // Return to original spot
          newX = originalX;
          newY = originalY;
        }
      }

      api.start({
        x: newX,
        y: newY,
        immediate: down, // Be snappy on drag, animate on release
      });
    },
    {
      filterTaps: true,
      enabled: !isSolving && !!canMove,
      axis: canMove === 'horizontal' ? 'x' : canMove === 'vertical' ? 'y' : undefined,
      bounds: {
        left: canMove === 'horizontal' && col > emptyCol ? emptyCol * (tileSize + gap) : col * (tileSize + gap),
        right: canMove === 'horizontal' && col < emptyCol ? emptyCol * (tileSize + gap) : col * (tileSize + gap),
        top: canMove === 'vertical' && row > emptyRow ? emptyRow * (tileSize + gap) : row * (tileSize + gap),
        bottom: canMove === 'vertical' && row < emptyRow ? emptyRow * (tileSize + gap) : row * (tileSize + gap),
      },
      rubberband: true,
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
      {...bind()}
      style={{
        position: 'absolute',
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${gridSize * 100}% auto`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        backgroundColor: 'white',
        touchAction: 'none',
        left: 0,
        top: 0,
        transform: x.to((xVal) => y.to((yVal) => `translate3d(${xVal}px, ${yVal}px, 0)`)),
        zIndex: canMove ? 10 : 1, // Bring draggable tile to front
      }}
      className={cn(
        'rounded-md select-none',
        canMove ? 'cursor-grab' : 'cursor-default',
        'shadow-lg',
        'overflow-hidden',
        'flex items-center justify-center',
        isCorrectPosition && 'shadow-green-500/50 shadow-[0_0_15px_5px_rgba(74,222,128,0.5)]'
      )}
    >
      {shouldShowPersistentRipple && (
        <div className="ripple-container" style={{ width: tileSize, height: tileSize }}>
          <div className="ripple" />
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
