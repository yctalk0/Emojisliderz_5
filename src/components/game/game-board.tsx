
'use client';
import type { TileType, Hint } from '@/hooks/use-game-logic';
import type { Level } from '@/lib/game-data';
import Tile from './tile';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface GameBoardProps {
  level: Level;
  tiles: TileType[];
  gridSize: number;
  onTileClick: (tileValue: number) => void;
  imageSrc: string;
  hint: Hint | null;
  difficulty: 'Easy' | 'Hard';
  isSolving: boolean;
  isGameWon: boolean;
  showPersistentRippleHint: boolean;
  onTileSlide: (tileValue: number) => void;
  emptyTileIndex: number;
  isCalculatingSolution: boolean;
}

const GameBoard = ({ level, tiles, gridSize, onTileClick, imageSrc, hint, difficulty, isSolving, isGameWon, showPersistentRippleHint, onTileSlide, emptyTileIndex, isCalculatingSolution }: GameBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(300);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setBoardSize(width);
      }
    });

    if (boardRef.current) {
      observer.observe(boardRef.current);
    }

    return () => {
      if (boardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(boardRef.current);
      }
    };
  }, []);

  const TILE_GAP = 4;
  const PADDING = 4;

  const contentSize = boardSize - PADDING * 2;
  const tileSize = (contentSize - (gridSize - 1) * TILE_GAP) / gridSize;

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        ref={boardRef}
        className="relative w-full aspect-square rounded-lg shadow-lg bg-secondary"
        style={{ padding: `${PADDING}px` }}
      >
        {isCalculatingSolution && (
          // This div prevents user interaction while the solution is being calculated.
          <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10 rounded-lg">
          </div>
        )}
        {isGameWon ? (
          <Image
            src={imageSrc}
            alt="Completed Puzzle"
            fill
            className="rounded-lg"
          />
        ) : (
          <>
            <div
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                gap: `${TILE_GAP}px`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center rounded-md",
                    index === emptyTileIndex ? "bg-transparent" : "bg-background/20"
                  )}
                >
                  <span className="text-5xl font-bold text-muted-foreground/20">{index + 1}</span>
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full" style={{ padding: `${PADDING}px` }}>
              <div className="relative w-full h-full">
                {tiles.map((tile, index) => (
                  <Tile
                    key={tile.value > 0 ? tile.value : `empty-${index}`}
                    level={level}
                    value={tile.value}
                    gridSize={gridSize}
                    imageSrc={imageSrc}
                    onClick={onTileClick}
                    onSlide={onTileSlide}
                    tileSize={tileSize}
                    correctPosition={tile.value - 1}
                    currentPosition={index}
                    isCorrectPosition={tile.value - 1 === index}
                    gap={TILE_GAP}
                    hint={hint}
                    isSolving={isSolving}
                    showPersistentRippleHint={showPersistentRippleHint}
                    emptyTileIndex={emptyTileIndex}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
