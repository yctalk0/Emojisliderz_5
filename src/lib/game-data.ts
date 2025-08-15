export type Level = {
  id: string;
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard';
  gridSize: 2 | 3 | 4 | 5;
  emoji: string;
  imageSrc: string;
  imageHint: string;
  levelNumber: number;
};

export const levels: Level[] = [
  // Very Easy - 2x2
  { id: 'very-easy-1', difficulty: 'Very Easy', gridSize: 2, levelNumber: 1, emoji: '😊', imageSrc: 'https://placehold.co/400x400.png?text=😊', imageHint: 'smiling face' },
  { id: 'very-easy-2', difficulty: 'Very Easy', gridSize: 2, levelNumber: 2, emoji: '👍', imageSrc: 'https://placehold.co/400x400.png?text=👍', imageHint: 'thumbs up' },
  { id: 'very-easy-3', difficulty: 'Very Easy', gridSize: 2, levelNumber: 3, emoji: '❤️', imageSrc: 'https://placehold.co/400x400.png?text=❤️', imageHint: 'red heart' },
  { id: 'very-easy-4', difficulty: 'Very Easy', gridSize: 2, levelNumber: 4, emoji: '⭐', imageSrc: 'https://placehold.co/400x400.png?text=⭐', imageHint: 'star' },
  { id: 'very-easy-5', difficulty: 'Very Easy', gridSize: 2, levelNumber: 5, emoji: '🚀', imageSrc: 'https://placehold.co/400x400.png?text=🚀', imageHint: 'rocket' },

  // Easy - 3x3
  { id: 'easy-1', difficulty: 'Easy', gridSize: 3, levelNumber: 1, emoji: '😀', imageSrc: 'https://placehold.co/400x400.png?text=😀', imageHint: 'grinning face' },
  { id: 'easy-2', difficulty: 'Easy', gridSize: 3, levelNumber: 2, emoji: '😂', imageSrc: 'https://placehold.co/400x400.png?text=😂', imageHint: 'laughing crying' },
  { id: 'easy-3', difficulty: 'Easy', gridSize: 3, levelNumber: 3, emoji: '😍', imageSrc: 'https://placehold.co/400x400.png?text=😍', imageHint: 'heart eyes' },
  { id: 'easy-4', difficulty: 'Easy', gridSize: 3, levelNumber: 4, emoji: '😇', imageSrc: 'https://placehold.co/400x400.png?text=😇', imageHint: 'smiling face halo' },
  { id: 'easy-5', difficulty: 'Easy', gridSize: 3, levelNumber: 5, emoji: '🥳', imageSrc: 'https://placehold.co/400x400.png?text=🥳', imageHint: 'partying face' },
  { id: 'easy-6', difficulty: 'Easy', gridSize: 3, levelNumber: 6, emoji: '🤔', imageSrc: 'https://placehold.co/400x400.png?text=🤔', imageHint: 'thinking face' },
  { id: 'easy-7', difficulty: 'Easy', gridSize: 3, levelNumber: 7, emoji: '😴', imageSrc: 'https://placehold.co/400x400.png?text=😴', imageHint: 'sleeping face' },
  { id: 'easy-8', difficulty: 'Easy', gridSize: 3, levelNumber: 8, emoji: '😈', imageSrc: 'https://placehold.co/400x400.png?text=😈', imageHint: 'smiling face horns' },
  { id: 'easy-9', difficulty: 'Easy', gridSize: 3, levelNumber: 9, emoji: '👻', imageSrc: 'https://placehold.co/400x400.png?text=👻', imageHint: 'ghost' },
  { id: 'easy-10', difficulty: 'Easy', gridSize: 3, levelNumber: 10, emoji: '👽', imageSrc: 'https://placehold.co/400x400.png?text=👽', imageHint: 'alien' },

  // Medium - 4x4
  { id: 'medium-1', difficulty: 'Medium', gridSize: 4, levelNumber: 1, emoji: '😎', imageSrc: 'https://placehold.co/400x400.png?text=😎', imageHint: 'sunglasses face' },
  { id: 'medium-2', difficulty: 'Medium', gridSize: 4, levelNumber: 2, emoji: '🤓', imageSrc: 'https://placehold.co/400x400.png?text=🤓', imageHint: 'nerd face' },
  { id: 'medium-3', difficulty: 'Medium', gridSize: 4, levelNumber: 3, emoji: '🤠', imageSrc: 'https://placehold.co/400x400.png?text=🤠', imageHint: 'cowboy face' },
  { id: 'medium-4', difficulty: 'Medium', gridSize: 4, levelNumber: 4, emoji: '🤯', imageSrc: 'https://placehold.co/400x400.png?text=🤯', imageHint: 'exploding head' },
  { id: 'medium-5', difficulty: 'Medium', gridSize: 4, levelNumber: 5, emoji: '😱', imageSrc: 'https://placehold.co/400x400.png?text=😱', imageHint: 'face screaming' },
  { id: 'medium-6', difficulty: 'Medium', gridSize: 4, levelNumber: 6, emoji: '🤖', imageSrc: 'https://placehold.co/400x400.png?text=🤖', imageHint: 'robot' },
  { id: 'medium-7', difficulty: 'Medium', gridSize: 4, levelNumber: 7, emoji: '👾', imageSrc: 'https://placehold.co/400x400.png?text=👾', imageHint: 'space invader' },
  { id: 'medium-8', difficulty: 'Medium', gridSize: 4, levelNumber: 8, emoji: '🎃', imageSrc: 'https://placehold.co/400x400.png?text=🎃', imageHint: 'jack-o-lantern' },
  { id: 'medium-9', difficulty: 'Medium', gridSize: 4, levelNumber: 9, emoji: '😺', imageSrc: 'https://placehold.co/400x400.png?text=😺', imageHint: 'grinning cat' },
  { id: 'medium-10', difficulty: 'Medium', gridSize: 4, levelNumber: 10, emoji: '🐶', imageSrc: 'https://placehold.co/400x400.png?text=🐶', imageHint: 'dog face' },
  
  // Hard - 5x5
  { id: 'hard-1', difficulty: 'Hard', gridSize: 5, levelNumber: 1, emoji: '😡', imageSrc: 'https://placehold.co/400x400.png?text=😡', imageHint: 'angry face' },
  { id: 'hard-2', difficulty: 'Hard', gridSize: 5, levelNumber: 2, emoji: '🤩', imageSrc: 'https://placehold.co/400x400.png?text=🤩', imageHint: 'star struck' },
  { id: 'hard-3', difficulty: 'Hard', gridSize: 5, levelNumber: 3, emoji: '😢', imageSrc: 'https://placehold.co/400x400.png?text=😢', imageHint: 'crying face' },
  { id: 'hard-4', difficulty: 'Hard', gridSize: 5, levelNumber: 4, emoji: '😭', imageSrc: 'https://placehold.co/400x400.png?text=😭', imageHint: 'loudly crying' },
  { id: 'hard-5', difficulty: 'Hard', gridSize: 5, levelNumber: 5, emoji: '🦊', imageSrc: 'https://placehold.co/400x400.png?text=🦊', imageHint: 'fox face' },
  { id: 'hard-6', difficulty: 'Hard', gridSize: 5, levelNumber: 6, emoji: '🐼', imageSrc: 'https://placehold.co/400x400.png?text=🐼', imageHint: 'panda face' },
  { id: 'hard-7', difficulty: 'Hard', gridSize: 5, levelNumber: 7, emoji: '🦄', imageSrc: 'https://placehold.co/400x400.png?text=🦄', imageHint: 'unicorn face' },
  { id: 'hard-8', difficulty: 'Hard', gridSize: 5, levelNumber: 8, emoji: '🦁', imageSrc: 'https://placehold.co/400x400.png?text=🦁', imageHint: 'lion face' },
  { id: 'hard-9', difficulty: 'Hard', gridSize: 5, levelNumber: 9, emoji: '🐸', imageSrc: 'https://placehold.co/400x400.png?text=🐸', imageHint: 'frog face' },
  { id: 'hard-10', difficulty: 'Hard', gridSize: 5, levelNumber: 10, emoji: '🐙', imageSrc: 'https://placehold.co/400x400.png?text=🐙', imageHint: 'octopus' },
];

export const emojiList = [
  '😀', '😂', '😍', '😎', '🤓', '🤠', '😡', '🤩', '😢', '😇', '🥳', '🤯',
  '🤔', '😴', '😭', '😱', '😈', '👻', '👽', '🤖', '👾', '🎃', '😺', '🐶',
  '🦊', '🐼', '🦄', '🦁', '🐸', '🐙', '🐵', '🚀', '🔥', '💯', '👍', '👎',
  '😊', '❤️', '⭐'
];
