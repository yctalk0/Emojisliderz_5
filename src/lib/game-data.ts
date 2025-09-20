
export interface Level {
  id: string;
  difficulty: 'Easy' | 'Hard';
  levelNumber: number;
  gridSize: number;
  imageSrc: string;
  emoji: string;
}

const levelsPerDifficulty = 405;
const totalEmojiImages = 405; // Assuming you have 405 emoji images (1.png to 405.png)

const generateLevels = (difficulty: 'Easy' | 'Hard', count: number, gridSize: number): Level[] => {
  const levels: Level[] = [];
  for (let i = 1; i <= count; i++) {
    const levelNumber = i;
    // Calculate image index to cycle through available emoji images
    const imageIndex = (i - 1) % totalEmojiImages + 1;
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
  ...generateLevels('Easy', levelsPerDifficulty, 2),
  ...generateLevels('Hard', levelsPerDifficulty, 3),
];
