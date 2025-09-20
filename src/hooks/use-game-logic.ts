
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


const useGameLogic = (gridSize: number, levelNumber: number, onWin: (moves: number, time: number) => void, isMuted: boolean, pauseBgMusic: () => void, resumeBgMusic: () => void) => {
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
  const [isCalculatingHint, setIsCalculatingHint] = useState(false);
  const [isInitialHint, setIsInitialHint] = useState(true);
  const [history, setHistory] = useState<TileType[][]>([]);
  const [hint, setHint] = useState<Hint | null>(null);
  const [hasShownRewardedAdForCurrentLevel, setHasShownRewardedAdForCurrentLevel] = useState(false);
  const initialHintTriggered = useRef(false);
  const workerRef = useRef<Worker | null>(null);
  const clearHint = () => setHint(null);
  const processingWorkerMessage = useRef<'hint' | 'solve' | null>(null); // To track what the worker is currently doing

  const tilesRef = useRef(tiles);
  useEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);

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

  const getNextMoveHint = useCallback((isInitial = false) => {
    if (isSolved || isSolving || processingWorkerMessage.current) return;

    if (!isInitial) {
      setIsCalculatingHint(true);
    }
    processingWorkerMessage.current = 'hint';

    workerRef.current?.postMessage({ tiles: tilesRef.current, gridSize });

    workerRef.current!.onmessage = (e: MessageEvent<TileType[][] | null>) => {
      const solutionPath = e.data;
      processingWorkerMessage.current = null;
      if (!isInitialHint) {
        setIsCalculatingHint(false);
      } else {
        setIsInitialHint(false);
      }

      if (solutionPath && solutionPath.length > 1) {
        const currentTiles = solutionPath[0];
        const nextTiles = solutionPath[1];

        const currentEmptyIndex = currentTiles.findIndex(t => t.value === emptyTileValue);
        const nextEmptyIndex = nextTiles.findIndex(t => t.value === emptyTileValue);

        const tileToMoveValue = nextTiles[currentEmptyIndex].value;

        const diff = nextEmptyIndex - currentEmptyIndex;
        let direction: Hint['direction'] = 'right'; // Default, will be overwritten
        if (diff === 1) direction = 'left'; // Empty moved right, so tile moved left
        else if (diff === -1) direction = 'right'; // Empty moved left, so tile moved right
        else if (diff === gridSize) direction = 'up'; // Empty moved down, so tile moved up
        else if (diff === -gridSize) direction = 'down'; // Empty moved up, so tile moved down

        setHint({
          tileValue: tileToMoveValue,
          direction: direction,
        });
      } else {
        console.error("No solution found for hint!");
        setHint(null); // Clear hint if no solution
      }
    };
  }, [gridSize, isSolved, isSolving, setIsCalculatingHint]);

  const handleTileClick = (tileValue: number) => {
    if (isSolved || isSolving || isCalculatingHint) return;
    if (!isStarted) startGame();

    setTiles(currentTiles => {
      const tileIndex = currentTiles.findIndex(t => t.value === tileValue);
      const emptyIndex = currentTiles.findIndex(t => t.value === emptyTileValue);

      if (tileIndex === -1 || emptyIndex === -1) {
        return currentTiles;
      }

      const tileRow = Math.floor(tileIndex / gridSize);
      const tileCol = tileIndex % gridSize;
      const emptyRow = Math.floor(emptyIndex / gridSize);
      const emptyCol = emptyIndex % gridSize;

      const isAdjacent = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;

      if (isAdjacent) {
        setHint(null);
        const newTiles = [...currentTiles];
        setHistory(prev => [...prev, currentTiles]);
        [newTiles[tileIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[tileIndex]];
        
        setMoves(prev => prev + 1);
        playSlideSound();

        if (levelNumber === 1 && !isSolved) {
          // Re-evaluate hint after a move on level 1
        }
        
        return newTiles;
      }

      return currentTiles;
    });
  };

  const undoMove = () => {
    if (history.length > 0 && !isSolving && !isCalculatingHint) {
      setHint(null); // Clear hint on undo
      const lastState = history[history.length - 1];
      setTiles(lastState);
      setHistory(prev => prev.slice(0, -1));
      setMoves(prev => prev - 1);
    }
  };

  const resetGame = useCallback(() => {
    initialHintTriggered.current = false;
    shuffleTiles();
  }, [shuffleTiles]);
  
  const autoSolve = () => {
    if (isSolved || isSolving || isCalculatingHint || processingWorkerMessage.current) return; // Prevent multiple worker calls
    setHint(null); // Clear hint on solve
    
    if (gridSize > 3) {
      alert("Auto-solve is only available for 2x2 and 3x3 puzzles for now!");
      return;
    }

    processingWorkerMessage.current = 'solve'; // Mark worker as busy for solving
    setIsSolving(true); // Indicate that auto-solve is in progress
    workerRef.current?.postMessage({ tiles: tilesRef.current, gridSize });

    workerRef.current!.onmessage = (e: MessageEvent<TileType[][] | null>) => {
      const solutionPath = e.data;
      processingWorkerMessage.current = null; // Worker is free
      if (solutionPath) {
        if (!isStarted) startGame();
        pauseBgMusic();

        let currentMoveIndex = 0;
        const executeMove = () => {
          if (currentMoveIndex < solutionPath.length) {
            setHistory(prev => [...prev, tilesRef.current]); // Use ref for latest tiles
            setTiles(solutionPath[currentMoveIndex]);
            setMoves(prevMoves => prevMoves + 1);
            playSlideSound();
            currentMoveIndex++;
            setTimeout(executeMove, 300);
          } else {
            resumeBgMusic();
            setIsSolving(false); // Solution complete, not solving anymore
          }
        };
        executeMove();
      } else {
        console.error("No solution found!");
        setIsSolving(false); // Reset solving state on no solution
      }
    };
  };

  // This effect is for triggering the initial hint on level 1, and also for re-evaluating hints on subsequent moves.
  // The logic for re-evaluating hints on moves will be handled by `game.tsx` calling `reEvaluateHint` via `onTileSlide`.
  useEffect(() => {
    if (levelNumber === 1 && !initialHintTriggered.current && !isSolved) {
      const isSolvedState = tiles.every((t, i) => t.value === (i + 1) % (gridSize * gridSize));
      if (!isSolvedState) {
        const timer = setTimeout(() => {
          getNextMoveHint(true);
          initialHintTriggered.current = true;
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    if (levelNumber !== 1 || isSolved) {
      initialHintTriggered.current = false;
      setHint(null);
    }
  }, [levelNumber, tiles, getNextMoveHint, gridSize, isSolved]);

  const reEvaluateHint = useCallback(() => {
    if (levelNumber === 1 && !isSolved) {
      if (!isCalculatingHint && !processingWorkerMessage.current) {
        setHint(null);
        getNextMoveHint(true);
      }
    }
  }, [levelNumber, isSolved, isCalculatingHint, getNextMoveHint, processingWorkerMessage, setIsCalculatingHint, setHint]);

  const canUndo = useMemo(() => history.length > 0 && !isSolving && !isCalculatingHint, [history, isSolving, isCalculatingHint]);
  const canSolve = useMemo(() => !isSolved && !isSolving && !isCalculatingHint, [isSolved, isSolving, isCalculatingHint]);
  const emptyTileIndex = useMemo(() => tiles.findIndex(t => t.value === emptyTileValue), [tiles]);

  return { tiles, moves, time, isSolved, isStarted, isSolving, isCalculatingHint, canUndo, canSolve, hint, emptyTileIndex, startGame, handleTileClick, undoMove, resetGame, autoSolve, getNextMoveHint, hasShownRewardedAdForCurrentLevel, setHasShownRewardedAdForCurrentLevel, setIsCalculatingHint, clearHint, reEvaluateHint, isInitialHint };
};

export default useGameLogic;
