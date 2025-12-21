
'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useAdMob from '@/hooks/use-admob';
import useSound from '@/hooks/use-sound';
import type { TileType } from '@/workers/solver.worker';

export type { TileType };

export type Hint = {
  tileValue: number;
  direction: 'up' | 'down' | 'left' | 'right';
};

const useGameLogic = (gridSize: number, onWin: (moves: number, time: number) => void, isMuted: boolean, pauseBgMusic: () => void, resumeBgMusic: () => void, difficulty?: 'Easy' | 'Hard') => {
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
  const [isCalculatingSolution, setIsCalculatingSolution] = useState(false);
  const [history, setHistory] = useState<TileType[][]>([]);
  const [hint, setHint] = useState<Hint | null>(null);
  const [hasShownRewardedAdForCurrentLevel, setHasShownRewardedAdForCurrentLevel] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const { showRewarded, prepareRewarded } = useAdMob();
  const { play: playSlideSound } = useSound('/assets/music/slide_1.mp3', 0.5, 'effect', isMuted);

  const shuffleTiles = useCallback(() => {
    setIsSolving(false);
    
    let shuffledTiles = createSolvedTiles();
    let emptyIndex = shuffledTiles.findIndex(t => t.value === emptyTileValue);
    
    const shuffleIterations = gridSize * gridSize * 50; // Increased iterations for better shuffling
    let prevEmptyIndex = -1;

    for (let i = 0; i < shuffleIterations; i++) {
      const emptyRow = Math.floor(emptyIndex / gridSize);
      const emptyCol = emptyIndex % gridSize;

      const possibleMoves = [];
      if (emptyRow > 0) possibleMoves.push(emptyIndex - gridSize); // Up
      if (emptyRow < gridSize - 1) possibleMoves.push(emptyIndex + gridSize); // Down
      if (emptyCol > 0) possibleMoves.push(emptyIndex - 1); // Left
      if (emptyCol < gridSize - 1) possibleMoves.push(emptyIndex + 1); // Right

      // Filter out the move that would undo the previous move
      const validMoves = possibleMoves.filter(move => move !== prevEmptyIndex);
      
      const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      prevEmptyIndex = emptyIndex;
      [shuffledTiles[emptyIndex], shuffledTiles[moveIndex]] = [shuffledTiles[moveIndex], shuffledTiles[emptyIndex]];
      emptyIndex = moveIndex;
    }

    const solvedState = createSolvedTiles();
    const isAlreadySolved = JSON.stringify(shuffledTiles.map(t => t.value)) === JSON.stringify(solvedState.map(t => t.value));

    if (isAlreadySolved) {
      if (shuffledTiles.length > 2) {
        [shuffledTiles[0], shuffledTiles[1]] = [shuffledTiles[1], shuffledTiles[0]];
      }
    }

    setTiles(shuffledTiles);
    setMoves(0);
    setTime(0);
    setIsSolved(false);
    setIsStarted(false);
    setHistory([]);
    setHint(null);
    setHasShownRewardedAdForCurrentLevel(false);
    prepareRewarded();
  }, [gridSize, createSolvedTiles, prepareRewarded]);


  useEffect(() => {
    shuffleTiles();
  }, [shuffleTiles, gridSize]);

  useEffect(() => {
    // Initialize the worker
    workerRef.current = new Worker(new URL('../workers/solver.worker.ts', import.meta.url));
    return () => {
      // Terminate the worker on cleanup
      workerRef.current?.terminate();
    };
  }, []);

  const checkWin = useCallback(() => {
    if (isSolved) return;
    const solved = tiles.every((tile, index) => {
      return tile.value === (index + 1) % totalTiles;
    });
    if (solved && isStarted) {
      setIsSolved(true);
      setIsStarted(false);
      setIsSolving(false);
      onWin(moves, time);
    }
  }, [tiles, totalTiles, isStarted, onWin, isSolved, moves, time]);

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
    if (!isStarted) startGame();
  
    const tileIndex = tiles.findIndex(t => t.value === tileValue);
    const emptyIndex = tiles.findIndex(t => t.value === emptyTileValue);
  
    const tileRow = Math.floor(tileIndex / gridSize);
    const tileCol = tileIndex % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
  
    const isAdjacent = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;
  
    if (isAdjacent) {
      setHint(null);
      const newTiles = [...tiles];
      setHistory(prev => [...prev, tiles]);
      [newTiles[tileIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[tileIndex]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);
      playSlideSound();
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

    if (gridSize > 3) {
      alert("Auto-solve is only available for 2x2 and 3x3 puzzles for now!");
      return;
    }

    setIsCalculatingSolution(true);
    workerRef.current?.postMessage({ tiles, gridSize });

    workerRef.current!.onmessage = (e: MessageEvent<TileType[][] | null>) => {
      const solutionPath = e.data;
      setIsCalculatingSolution(false);
      if (solutionPath) {
        setIsSolving(true);
        if (!isStarted) startGame();
        pauseBgMusic();

        solutionPath.forEach((state, index) => {
          setTimeout(() => {
            setHistory(prev => [...prev, tiles]);
            setTiles(state);
            setMoves(prev => prev + 1);
            playSlideSound();
            if (index === solutionPath.length - 1) {
              resumeBgMusic();
            }
          }, index * 300);
        });
      } else {
        console.error("No solution found!");
      }
    };
  };

  const getNextMoveHint = useCallback(async (opts?: { skipRewarded?: boolean }) => {
    if (isSolved || isSolving || isCalculatingSolution) return;

    if (!hasShownRewardedAdForCurrentLevel && !opts?.skipRewarded) {
      const adResult = await showRewarded();
      if (adResult && adResult.rewarded) {
        setHasShownRewardedAdForCurrentLevel(true);
      } else {
        return; // Don't proceed to show hint if ad wasn't watched
      }
    }

    setIsCalculatingSolution(true);
    workerRef.current?.postMessage({ tiles, gridSize });

    workerRef.current!.onmessage = (e: MessageEvent<TileType[][] | null>) => {
      const solutionPath = e.data;
      setIsCalculatingSolution(false);
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
  }, [tiles, gridSize, isSolved, isSolving, hasShownRewardedAdForCurrentLevel, showRewarded]);

  const canUndo = useMemo(() => history.length > 0 && !isSolving, [history, isSolving]);
  const canSolve = useMemo(() => !isSolved && !isSolving && !isCalculatingSolution, [isSolved, isSolving, isCalculatingSolution]);
  const emptyTileIndex = useMemo(() => tiles.findIndex(t => t.value === emptyTileValue), [tiles]);

  return { tiles, moves, time, isSolved, isStarted, isSolving, canUndo, canSolve, hint, emptyTileIndex, startGame, handleTileClick, undoMove, resetGame, autoSolve, getNextMoveHint, hasShownRewardedAdForCurrentLevel, isCalculatingSolution };
};

export default useGameLogic;
