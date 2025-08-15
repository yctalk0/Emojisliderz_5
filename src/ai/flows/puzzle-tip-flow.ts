
'use server';
/**
 * @fileOverview A flow for generating puzzle-solving tips.
 *
 * - getPuzzleTip - A function that generates a helpful tip for solving the puzzle.
 * - PuzzleTipInput - The input type for the getPuzzleTip function.
 * - PuzzleTipOutput - The return type for the getPuzzleTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PuzzleTipInputSchema = z.object({
  emoji: z.string().describe('The emoji for which to generate a puzzle tip.'),
  tiles: z.string().describe('A string representation of the current tile layout, e.g., "[1,2,3,0,5,6,7,4,8]".'),
  gridSize: z.number().describe('The size of the puzzle grid (e.g., 3 for a 3x3 grid).'),
});
export type PuzzleTipInput = z.infer<typeof PuzzleTipInputSchema>;

const PuzzleTipOutputSchema = z.object({
    tip: z.string().describe('A helpful, short, and encouraging tip for solving the sliding puzzle. The tip should either provide the next best move or a general strategy. For example, for a specific move, it could be "Try moving tile 4 down.". For a strategy, for a "rocket" emoji, a tip could be "Think like a rocket launch sequence! Get the top row in order first, then blast off from there!". Keep it under 20 words.'),
});
export type PuzzleTipOutput = z.infer<typeof PuzzleTipOutputSchema>;


export async function getPuzzleTip(input: PuzzleTipInput): Promise<PuzzleTipOutput> {
    return puzzleTipFlow(input);
}


const prompt = ai.definePrompt({
    name: 'puzzleTipPrompt',
    input: {schema: PuzzleTipInputSchema},
    output: {schema: PuzzleTipOutputSchema},
    prompt: `You are a fun and encouraging game assistant for a sliding puzzle game called EmojiSliderz. Your goal is to provide the player with the single best next move to solve the puzzle.

The user is playing a puzzle with the following emoji: {{{emoji}}}
The grid size is: {{{gridSize}}}x{{{gridSize}}}
The current tile layout is: {{{tiles}}} (0 represents the empty space)

Analyze the current tile layout and determine the single best move to get closer to the solved state. The solved state for a 3x3 grid is "[1,2,3,4,5,6,7,8,0]". The solved state for a 2x2 grid is "[1,2,3,0]".

Based on the next best move, generate a short, clear, and direct instruction for the player.

Examples of good tips:
- "Try sliding tile 5 to the right."
- "Move tile 2 down into the empty space."
- "The next logical step is to move tile 8 up."

If the puzzle is very close to being solved, you can provide a more encouraging strategic tip. For example: "You're so close! Just a few more moves to solve the corners."
`,
});

const puzzleTipFlow = ai.defineFlow(
    {
        name: 'puzzleTipFlow',
        inputSchema: PuzzleTipInputSchema,
        outputSchema: PuzzleTipOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
