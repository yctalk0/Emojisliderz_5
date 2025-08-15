'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface TileType {
  value: number;
}

const useGameLogic = (gridSize: number, onWin: () => void) => {
  const totalTiles = gridSize * gridSize;
  const emptyTileValue = 0;

  const createSolvedTiles = useCallback(() => {
    const newTiles = Array.from({ length: totalTiles - 1 }, (_, i) => ({ value: i + 1 }));
    newTiles.push({ value: emptyTileValue });
    return newTiles;
  }, [totalTiles]);

  const [tiles, setTiles] = useState<TileType[]>(createSolvedTiles);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [history, setHistory] = useState<TileType[][]>([]);

  const isSolvable = (arr: TileType[]): boolean => {
    if (gridSize % 2 === 1) { // Odd grid
      let inversions = 0;
      for (let i = 0; i < totalTiles; i++) {
        for (let j = i + 1; j < totalTiles; j++) {
          if (arr[i].value !== emptyTileValue && arr[j].value !== emptyTileValue && arr[i].value > arr[j].value) {
            inversions++;
          }
        }
      }
      return inversions % 2 === 0;
    } else { // Even grid, more complex rule, so we shuffle by moves instead
      return true; 
    }
  };

  const shuffleTiles = useCallback(() => {
    let shuffledTiles: TileType[];
    // For even grids, ensure solvability by making random moves
    if (gridSize % 2 === 0) {
      let tempTiles = createSolvedTiles();
      let emptyIndex = tempTiles.findIndex(t => t.value === emptyTileValue);
      // Increased shuffles for more randomness
      for (let i = 0; i < gridSize * gridSize * 10; i++) {
        const emptyRow = Math.floor(emptyIndex / gridSize);
        const emptyCol = emptyIndex % gridSize;

        const possibleMoves = [];
        if (emptyRow > 0) possibleMoves.push(emptyIndex - gridSize);
        if (emptyRow < gridSize - 1) possibleMoves.push(emptyIndex + gridSize);
        if (emptyCol > 0) possibleMoves.push(emptyIndex - 1);
        if (emptyCol < gridSize - 1) possibleMoves.push(emptyIndex + 1);

        const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [tempTiles[emptyIndex], tempTiles[moveIndex]] = [tempTiles[moveIndex], tempTiles[emptyIndex]];
        emptyIndex = moveIndex;
      }
      shuffledTiles = tempTiles;
    } else {
       do {
        shuffledTiles = [...createSolvedTiles()].sort(() => Math.random() - 0.5);
      } while (!isSolvable(shuffledTiles));
    }

    setTiles(shuffledTiles);
    setMoves(0);
    setTime(0);
    setIsSolved(false);
    setIsStarted(false);
    setHistory([]);
  }, [gridSize, createSolvedTiles]);

  useEffect(() => {
    shuffleTiles();
  }, [shuffleTiles, gridSize]);

  const checkWin = useCallback(() => {
    const solved = tiles.every((tile, index) => {
      return tile.value === (index + 1) % totalTiles;
    });
    if (solved && isStarted) {
      setIsSolved(true);
      setIsStarted(false);
      onWin();
    }
  }, [tiles, totalTiles, isStarted, onWin]);

  useEffect(() => {
    checkWin();
  }, [tiles, checkWin]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isSolved) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isSolved]);

  const startGame = () => {
    if (!isStarted) {
      setIsStarted(true);
    }
  };

  const handleTileClick = (tileValue: number) => {
    if (isSolved) return;

    const tileIndex = tiles.findIndex(t => t.value === tileValue);
    const emptyIndex = tiles.findIndex(t => t.value === emptyTileValue);

    const tileRow = Math.floor(tileIndex / gridSize);
    const tileCol = tileIndex % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      setHistory(prev => [...prev, tiles]);
      [newTiles[tileIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[tileIndex]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);
    }
  };
  
  const undoMove = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setTiles(lastState);
      setHistory(prev => prev.slice(0, -1));
      setMoves(prev => prev - 1);
    }
  };

  const resetGame = useCallback(() => {
    shuffleTiles();
  }, [shuffleTiles]);
  
  const canUndo = useMemo(() => history.length > 0, [history]);

  return { tiles, moves, time, isSolved, isStarted, canUndo, startGame, handleTileClick, undoMove, resetGame, setTiles };
};

export default useGameLogic;
