
'use client';
import type { TileType, Hint } from '@/hooks/use-game-logic';
import Tile from './tile';

interface GameBoardProps {
  tiles: TileType[];
  gridSize: number;
  onTileClick: (tileValue: number) => void;
  imageSrc: string;
  hint: Hint | null;
  difficulty: 'Easy' | 'Hard';
}

const GameBoard = ({ tiles, gridSize, onTileClick, imageSrc, hint, difficulty }: GameBoardProps) => {
  const boardSize = 400; // a fixed size for the board in px
  const TILE_GAP = 4; // gap between tiles in px

  const tileSize = (boardSize - (gridSize - 1) * TILE_GAP) / gridSize;

  const emptyIndex = tiles.findIndex(t => t.value === 0);

  const getMoveDirection = (tileIndex: number): 'up' | 'down' | 'left' | 'right' | null => {
    if (difficulty !== 'Hard') return null;

    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
    const tileRow = Math.floor(tileIndex / gridSize);
    const tileCol = tileIndex % gridSize;

    if (tileRow === emptyRow) {
      if (tileCol + 1 === emptyCol) return 'right';
      if (tileCol - 1 === emptyCol) return 'left';
    }
    if (tileCol === emptyCol) {
      if (tileRow + 1 === emptyRow) return 'down';
      if (tileRow - 1 === emptyRow) return 'up';
    }

    return null;
  };

  return (
    <div
      className="relative rounded-lg shadow-lg bg-secondary p-1"
      style={{
        width: boardSize,
        height: boardSize,
      }}
    >
       <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: `${TILE_GAP}px`,
          padding: `${TILE_GAP}px`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => (
          <div key={index} className="flex items-center justify-center bg-background/20 rounded-md">
             <span className="text-5xl font-bold text-muted-foreground/20">{index + 1}</span>
          </div>
        ))}
      </div>
      <div
        className="relative w-full h-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: `${TILE_GAP}px`,
        }}
      >
        {tiles.map((tile, index) => (
          <Tile
            key={tile.value > 0 ? tile.value : `empty-${index}`}
            value={tile.value}
            gridSize={gridSize}
            imageSrc={imageSrc}
            onClick={onTileClick}
            tileSize={tileSize}
            correctPosition={tile.value - 1}
            currentPosition={index}
            gap={TILE_GAP}
            showHint={hint?.tileValue === tile.value ? hint.direction : getMoveDirection(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
