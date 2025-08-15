'use client';

interface TileProps {
  value: number;
  gridSize: number;
  imageSrc: string;
  onClick: (value: number) => void;
  tileSize: number;
  correctPosition: number;
  currentPosition: number;
  gap: number;
}

const Tile = ({ value, gridSize, imageSrc, onClick, tileSize, correctPosition, currentPosition, gap }: TileProps) => {
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
    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
    transition: 'transform 0.2s ease-in-out',
  };

  return (
    <button
      onClick={() => onClick(value)}
      className="absolute rounded-md shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:z-10"
      style={tileStyle}
      aria-label={`Tile ${value}`}
    >
      <div className="absolute top-1 left-1 bg-black/50 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {value}
      </div>
    </button>
  );
};

export default Tile;
