'use client';
import type { TileType } from '@/hooks/use-game-logic';
import Tile from './tile';

interface GameBoardProps {
  tiles: TileType[];
  gridSize: number;
  onTileClick: (tileValue: number) => void;
  imageSrc: string;
  isHintActive: boolean;
}

const GameBoard = ({ tiles, gridSize, onTileClick, imageSrc, isHintActive }: GameBoardProps) => {
  const boardSize = 400; // a fixed size for the board in px
  const TILE_GAP = 4; // gap between tiles in px

  const tileSize = (boardSize - (gridSize - 1) * TILE_GAP) / gridSize;

  return (
    <div
      className="relative rounded-lg shadow-lg bg-secondary p-1"
      style={{
        width: boardSize,
        height: boardSize,
      }}
    >
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
          />
        ))}
      </div>
      {isHintActive && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg overflow-hidden">
          <img src={imageSrc} alt="Hint" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
