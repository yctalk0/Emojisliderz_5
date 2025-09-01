
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
  const PADDING = 4; // padding around the board in px

  // The total size available for tiles is the board size minus padding on both sides
  const contentSize = boardSize - PADDING * 2;
  // Tile size is the content size minus the gaps, divided by the number of tiles
  const tileSize = (contentSize - (gridSize - 1) * TILE_GAP) / gridSize;

  return (
    <div
      className="relative rounded-lg shadow-lg bg-secondary"
      style={{
        width: boardSize,
        height: boardSize,
        padding: `${PADDING}px`,
      }}
    >
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: `${TILE_GAP}px`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => (
          <div key={index} className="flex items-center justify-center bg-background/20 rounded-md">
             <span className="text-5xl font-bold text-muted-foreground/20">{index + 1}</span>
          </div>
        ))}
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full" style={{ padding: `${PADDING}px` }}>
        <div className="relative w-full h-full">
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
                showHint={hint?.tileValue === tile.value ? hint.direction : null}
            />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
