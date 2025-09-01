
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface TileType {
  value: number;
}

export type Hint = {
  tileValue: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

// A* search algorithm to find the solution path
const solvePuzzle = (startTiles: TileType[], gridSize: number): TileType[][] | null => {
  const totalTiles = gridSize * gridSize;
  const emptyTileValue = 0;
  const solvedState = Array.from({ length: totalTiles }, (_, i) => ({ value: (i + 1) % totalTiles }));
  const solvedStateStr = JSON.stringify(solvedState.map(t => t.value));

  const manhattanDistance = (tiles: TileType[]) => {
    let distance = 0;
    for (let i = 0; i < tiles.length; i++) {
      const tileValue = tiles[i].value;
      if (tileValue !== emptyTileValue) {
        const correctIndex = tileValue - 1;
        const currentRow = Math.floor(i / gridSize);
        const currentCol = i % gridSize;
        const correctRow = Math.floor(correctIndex / gridSize);
        const correctCol = correctIndex % gridSize;
        distance += Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
      }
    }
    return distance;
  };

  const openSet = new Map<string, { path: TileType[][], g: number, h: number, f: number }>();
  const startStateStr = JSON.stringify(startTiles.map(t => t.value));
  const startHeuristic = manhattanDistance(startTiles);
  openSet.set(startStateStr, { path: [startTiles], g: 0, h: startHeuristic, f: startHeuristic });
  
  const closedSet = new Set<string>();

  while (openSet.size > 0) {
    let bestNodeKey = '';
    let minF = Infinity;

    for (const [key, node] of openSet.entries()) {
      if (node.f < minF) {
        minF = node.f;
        bestNodeKey = key;
      }
    }

    const { path, g } = openSet.get(bestNodeKey)!;
    const currentTiles = path[path.length - 1];
    const currentStateStr = JSON.stringify(currentTiles.map(t => t.value));
    
    if (currentStateStr === solvedStateStr) {
      return path;
    }
    
    openSet.delete(bestNodeKey);
    closedSet.add(currentStateStr);
    
    const emptyIndex = currentTiles.findIndex(t => t.value === emptyTileValue);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const neighbors = [];
    if (emptyRow > 0) neighbors.push(emptyIndex - gridSize);
    if (emptyRow < gridSize - 1) neighbors.push(emptyIndex + gridSize);
    if (emptyCol > 0) neighbors.push(emptyIndex - 1);
    if (emptyCol < gridSize - 1) neighbors.push(emptyIndex + 1);

    for (const moveIndex of neighbors) {
      const newTiles = [...currentTiles];
      [newTiles[emptyIndex], newTiles[moveIndex]] = [newTiles[moveIndex], newTiles[emptyIndex]];
      const newStateStr = JSON.stringify(newTiles.map(t => t.value));

      if (closedSet.has(newStateStr)) continue;

      const newG = g + 1;
      const existingNode = openSet.get(newStateStr);

      if (!existingNode || newG < existingNode.g) {
        const h = manhattanDistance(newTiles);
        const f = newG + h;
        openSet.set(newStateStr, { path: [...path, newTiles], g: newG, h, f });
      }
    }
  }

  return null; // No solution found
};


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
  const [isSolving, setIsSolving] = useState(false);
  const [history, setHistory] = useState<TileType[][]>([]);
  const [hint, setHint] = useState<Hint | null>(null);

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
    setIsSolving(false);
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
      } while (!isSolvable(shuffledTiles) || JSON.stringify(shuffledTiles) === JSON.stringify(createSolvedTiles()));
    }

    setTiles(shuffledTiles);
    setMoves(0);
    setTime(0);
    setIsSolved(false);
    setIsStarted(false);
    setHistory([]);
    setHint(null);
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
      setIsSolving(false);
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
    if (!isStarted && !isSolving) {
      setIsStarted(true);
    }
  };

  const handleTileClick = (tileValue: number) => {
    if (isSolved || isSolving) return;
    setHint(null);

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
    if (history.length > 0 && !isSolving) {
      setHint(null);
      const lastState = history[history.length - 1];
      setTiles(lastState);
      setHistory(prev => prev.slice(0, -1));
      setMoves(prev => prev - 1);
    }
  };

  const resetGame = useCallback(() => {
    shuffleTiles();
  }, [shuffleTiles]);
  
  const autoSolve = () => {
    if (isSolved || isSolving) return;
    setHint(null);
    
    if(gridSize > 3) {
      alert("Auto-solve is only available for 2x2 and 3x3 puzzles for now!");
      return;
    }

    const solutionPath = solvePuzzle(tiles, gridSize);
    if (solutionPath) {
      setIsSolving(true);
      if(!isStarted) startGame();

      solutionPath.forEach((state, index) => {
        setTimeout(() => {
          setHistory(prev => [...prev, tiles]);
          setTiles(state);
          setMoves(moves + index);
        }, index * 300);
      });
    } else {
      console.error("No solution found!");
    }
  };

  const getNextMoveHint = () => {
    if (isSolved || isSolving) return;

    const solutionPath = solvePuzzle(tiles, gridSize);
    if (solutionPath && solutionPath.length > 1) {
      const currentTiles = solutionPath[0];
      const nextTiles = solutionPath[1];

      const currentEmptyIndex = currentTiles.findIndex(t => t.value === emptyTileValue);
      const nextEmptyIndex = nextTiles.findIndex(t => t.value === emptyTileValue);

      const tileToMoveValue = nextTiles[currentEmptyIndex].value;
      
      const diff = nextEmptyIndex - currentEmptyIndex;
      let direction: Hint['direction'] = 'right';
      if (diff === 1) direction = 'left';
      else if (diff === -1) direction = 'right';
      else if (diff === gridSize) direction = 'up';
      else if (diff === -gridSize) direction = 'down';

      setHint({
        tileValue: tileToMoveValue,
        direction: direction,
      });
    }
  };

  const canUndo = useMemo(() => history.length > 0 && !isSolving, [history, isSolving]);
  const canSolve = useMemo(() => !isSolved && !isSolving, [isSolved, isSolving]);

  return { tiles, moves, time, isSolved, isStarted, canUndo, canSolve, hint, startGame, handleTileClick, undoMove, resetGame, autoSolve, getNextMoveHint };
};

export default useGameLogic;
