
export interface Level {
  id: string;
  difficulty: 'Easy' | 'Hard';
  levelNumber: number;
  gridSize: number;
  imageSrc: string;
  emoji: string;
}

const levelsPerDifficulty = 405;

const generateLevels = (difficulty: 'Easy' | 'Hard', count: number, gridSize: number, startIndex: number): Level[] => {
  const levels: Level[] = [];
  for (let i = 1; i <= count; i++) {
    const levelNumber = i;
    const imageIndex = startIndex + i;
    levels.push({
      id: `${difficulty.toLowerCase()}-${levelNumber}`,
      difficulty,
      levelNumber,
      gridSize,
      imageSrc: `/assets/emoji/${imageIndex}.png`,
      emoji: `Emoji ${imageIndex}`,
    });
  }
  return levels;
};

export const levels: Level[] = [
  ...generateLevels('Easy', levelsPerDifficulty, 2, 0),
  ...generateLevels('Hard', levelsPerDifficulty, 3, 0), // Corrected startIndex to 0
];
