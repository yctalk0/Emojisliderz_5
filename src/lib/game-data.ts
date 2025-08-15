export type Level = {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  gridSize: 2 | 3 | 4 | 5;
  emoji: string;
  imageSrc: string;
  imageHint: string;
};

export const levels: Level[] = [
  // Easy
  { id: 'easy-1', difficulty: 'Easy', gridSize: 2, emoji: '😀', imageSrc: 'https://placehold.co/400x400.png?text=😀', imageHint: 'grinning face' },
  { id: 'easy-2', difficulty: 'Easy', gridSize: 3, emoji: '😂', imageSrc: 'https://placehold.co/400x400.png?text=😂', imageHint: 'laughing crying' },
  { id: 'easy-3', difficulty: 'Easy', gridSize: 3, emoji: '😍', imageSrc: 'https://placehold.co/400x400.png?text=😍', imageHint: 'heart eyes' },

  // Medium
  { id: 'medium-1', difficulty: 'Medium', gridSize: 3, emoji: '😎', imageSrc: 'https://placehold.co/400x400.png?text=😎', imageHint: 'sunglasses face' },
  { id: 'medium-2', difficulty: 'Medium', gridSize: 4, emoji: '🤓', imageSrc: 'https://placehold.co/400x400.png?text=🤓', imageHint: 'nerd face' },
  { id: 'medium-3', difficulty: 'Medium', gridSize: 4, emoji: '🤠', imageSrc: 'https://placehold.co/400x400.png?text=🤠', imageHint: 'cowboy face' },

  // Hard
  { id: 'hard-1', difficulty: 'Hard', gridSize: 4, emoji: '😡', imageSrc: 'https://placehold.co/400x400.png?text=😡', imageHint: 'angry face' },
  { id: 'hard-2', difficulty: 'Hard', gridSize: 5, emoji: '🤩', imageSrc: 'https://placehold.co/400x400.png?text=🤩', imageHint: 'star struck' },
  { id: 'hard-3', difficulty: 'Hard', gridSize: 5, emoji: '😢', imageSrc: 'https://placehold.co/400x400.png?text=😢', imageHint: 'crying face' },
];

export const emojiList = [
  '😀', '😂', '😍', '😎', '🤓', '🤠', '😡', '🤩', '😢', '😇', '🥳', '🤯',
  '🤔', '😴', '😭', '😱', '😈', '👻', '👽', '🤖', '👾', '🎃', '😺', '🐶',
  '🦊', '🐼', '🦄', '🦁', '🐸', '🐙', '🐵', '🚀', '🔥', '💯', '👍', '👎'
];
