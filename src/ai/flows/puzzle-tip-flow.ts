
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
    tip: z.string().describe('A helpful, short, and encouraging tip for solving the sliding puzzle. The tip should be creative and related to the emoji, or provide the next best move. For example, for a "rocket" emoji, a tip could be "Think like a rocket launch sequence! Get the top row in order first, then blast off from there!". For a specific move, it could be "Try moving tile 4 down.". Keep it under 20 words.'),
});
export type PuzzleTipOutput = z.infer<typeof PuzzleTipOutputSchema>;


export async function getPuzzleTip(input: PuzzleTipInput): Promise<PuzzleTipOutput> {
    return puzzleTipFlow(input);
}


const prompt = ai.definePrompt({
    name: 'puzzleTipPrompt',
    input: {schema: PuzzleTipInputSchema},
    output: {schema: PuzzleTipOutputSchema},
    prompt: `You are a fun and encouraging game assistant for a sliding puzzle game called EmojiSliderz. Your goal is to provide a helpful, short, and creative tip to the player based on the puzzle's emoji and current state.

The user is playing a puzzle with the following emoji: {{{emoji}}}
The grid size is: {{{gridSize}}}x{{{gridSize}}}
The current tile layout is: {{{tiles}}} (0 represents the empty space)

First, determine the next best move to help solve the puzzle. The solved state for a 3x3 grid would be "[1,2,3,4,5,6,7,8,0]". 
Based on the next move, generate a creative, encouraging, and short (under 20 words) tip related to the emoji that will help them solve the puzzle. You can either give a general strategy tip or a specific move tip.

Examples:
- For a "rocket" emoji: "Think like a rocket launch sequence! Get the top row in order first, then blast off from there!".
- For a "pizza" emoji: "Solve it slice by slice! Focus on completing one row or column at a time."
- For a "cat" emoji: "Be as methodical as a cat stalking its prey. Plan your moves ahead!"
- For a specific move: "Looks like tile 8 wants to slide down into the empty spot!"
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
