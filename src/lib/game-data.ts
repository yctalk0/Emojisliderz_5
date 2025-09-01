
export type Level = {
  id: string;
  difficulty: 'Easy' | 'Hard';
  gridSize: 2 | 3;
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
  'Easy': { gridSize: 2, count: 315 },
  'Hard': { gridSize: 3, count: 315 },
} as const;

export const levels: Level[] = [];

let imageCounter = 1;
Object.entries(difficulties).forEach(([difficulty, config]) => {
  let emojiIndex = 0;
  for (let i = 1; i <= config.count; i++) {
    const emoji = emojiList[emojiIndex % emojiList.length];
    const difficultyTyped = difficulty as 'Easy' | 'Hard';
    const id = `${difficultyTyped.toLowerCase().replace(' ', '-')}-${i}`;
    
    // We'll loop the images if we run out of unique ones.
    const imageNumber = ((imageCounter - 1) % 315) + 1;
    
    levels.push({
      id: id,
      difficulty: difficultyTyped,
      gridSize: config.gridSize,
      levelNumber: i,
      emoji: emoji,
      imageSrc: `/assets/emoji/${imageNumber}.png`,
      imageHint: 'emoji puzzle', // Generic hint for now
    });
    
    emojiIndex++;
    imageCounter++;
  }
});
