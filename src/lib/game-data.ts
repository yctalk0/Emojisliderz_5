
export type Level = {
  id: string;
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard';
  gridSize: 2 | 3 | 4 | 5;
  emoji: string;
  imageSrc: string;
  imageHint: string;
  levelNumber: number;
};

export const emojiList = [
  '😀', '😂', '😍', '😎', '🤓', '🤠', '😡', '🤩', '😢', '😇', '🥳', '🤯',
  '🤔', '😴', '😭', '😱', '😈', '👻', '👽', '🤖', '👾', '🎃', '😺', '🐶',
  '🦊', '🐼', '🦄', '🦁', '🐸', '🐙', '🐵', '🚀', '🔥', '💯', '👍', '👎',
  '😊', '❤️', '⭐', '💡', '☀️', '🎉'
];

const difficulties = {
  'Very Easy': { gridSize: 2, count: 35 },
  'Easy': { gridSize: 3, count: 40 },
  'Medium': { gridSize: 4, count: 40 },
  'Hard': { gridSize: 5, count: 30 }
} as const;

export const levels: Level[] = [];

let emojiIndex = 0;
let imageCounter = 1;

Object.entries(difficulties).forEach(([difficulty, config]) => {
  for (let i = 1; i <= config.count; i++) {
    const emoji = emojiList[emojiIndex % emojiList.length];
    const difficultyTyped = difficulty as 'Very Easy' | 'Easy' | 'Medium' | 'Hard';
    const id = `${difficultyTyped.toLowerCase().replace(' ', '-')}-${i}`;
    
    levels.push({
      id: id,
      difficulty: difficultyTyped,
      gridSize: config.gridSize,
      levelNumber: i,
      emoji: emoji,
      imageSrc: `/assets/emoji/${imageCounter}.png`,
      imageHint: 'emoji puzzle', // Generic hint for now
    });
    
    emojiIndex++;
    imageCounter++;
  }
});
