export interface TileType {
  value: number;
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

self.onmessage = (e: MessageEvent<{ tiles: TileType[], gridSize: number }>) => {
  const { tiles, gridSize } = e.data;
  const solution = solvePuzzle(tiles, gridSize);
  self.postMessage(solution);
};
