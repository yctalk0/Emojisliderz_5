
'use client';

import { cn } from '@/lib/utils';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TileProps {
  value: number;
  gridSize: number;
  imageSrc: string;
  onClick: (value: number) => void;
  tileSize: number;
  correctPosition: number;
  currentPosition: number;
  gap: number;
  showHint: 'up' | 'down' | 'left' | 'right' | null;
}

const ArrowIcon = ({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) => {
  const iconProps = {
    className: "w-1/2 h-1/2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
    strokeWidth: 1.5,
  };
  switch (direction) {
    case 'up': return <ArrowBigUp {...iconProps} />;
    case 'down': return <ArrowBigDown {...iconProps} />;
    case 'left': return <ArrowBigLeft {...iconProps} />;
    case 'right': return <ArrowBigRight {...iconProps} />;
  }
};

const Tile = ({ value, gridSize, imageSrc, onClick, tileSize, correctPosition, currentPosition, gap, showHint }: TileProps) => {
  if (value === 0) {
    return <div className="bg-transparent rounded-md" />;
  }

  const row = Math.floor(currentPosition / gridSize);
  const col = currentPosition % gridSize;

  const bgPosX = (correctPosition % gridSize) * (100 / (gridSize - 1));
  const bgPosY = Math.floor(correctPosition / gridSize) * (100 / (gridSize - 1));

  const tileStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    transform: `translate(${col * (tileSize + gap)}px, ${row * (tileSize + gap)}px)`,
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: `auto ${gridSize * 100}%`,
    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
    transition: 'transform 0.2s ease-in-out',
  };

  const isCorrect = correctPosition === currentPosition;

  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "absolute rounded-md shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:z-10",
         isCorrect && "border-2 border-green-500/80 shadow-green-500/50 shadow-lg"
      )}
      style={tileStyle}
      aria-label={`Tile ${value}`}
    >
       {showHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <ArrowIcon direction={showHint} />
          </div>
        )}
      <div className={cn("absolute top-1 left-1 bg-black/50 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10 transition-all duration-300", isCorrect && "bg-green-500/80")}>
        {value}
      </div>
    </button>
  );
};

export default Tile;
