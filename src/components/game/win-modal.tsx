
'use client';
import { Button } from '@/components/ui/button';
import { Clock, Medal, Move, Play, SkipForward, X } from 'lucide-react';
import Image from 'next/image';
import AdBanner from './ad-banner';
import { useEffect } from 'react';
import useSound from '@/hooks/use-sound';
import Confetti from './confetti';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  time: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onExit: () => void;
  hasNextLevel: boolean;
  imageSrc: string;
  isLastLevelOfDifficulty: boolean;
  difficulty: 'Easy' | 'Hard';
  isMuted: boolean;
  pauseBgMusic: () => void;
  resumeBgMusic: () => void;
}

const WinModal = ({
  isOpen,
  moves,
  time,
  onPlayAgain,
  onNextLevel,
  onExit,
  hasNextLevel,
  imageSrc,
  pauseBgMusic,
  resumeBgMusic,
}: WinModalProps) => {

  useEffect(() => {
    if (isOpen) {
      pauseBgMusic();
    } else {
      resumeBgMusic();
    }
  }, [isOpen, pauseBgMusic, resumeBgMusic]);

  if (!isOpen) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Confetti isOpen={isOpen} />
      <div className="bg-[#121d2e] text-white rounded-2xl shadow-xl w-full max-w-sm relative border-2 border-gray-700 z-[51]">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 rounded-full p-3 border-4 border-[#121d2e] blinking-badge">
          <Medal className="w-8 h-8 text-white" />
        </div>

        <button
          onClick={onExit}
          className="absolute top-3 right-3 bg-cyan-500 rounded-full p-1.5 hover:bg-cyan-600 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="pt-12 pb-6 px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-500 blinking-text">You Win!</h2>
            <p className="text-gray-400 mt-1">
              Congratulations, you solved the puzzle!
            </p>
          </div>

          <div className="my-5 border-2 border-gray-600 rounded-lg flex items-center justify-center p-4 bg-black bg-opacity-20 h-32">
            <Image
              src={imageSrc}
              alt="Winner"
              width={96}
              height={96}
              className="animate-bounce"
            />
          </div>

          <div className="flex justify-center items-center space-x-8 text-lg text-gray-300">
            <div className="flex items-center space-x-2">
              <Move className="w-6 h-6 text-red-500" />
              <span className="font-semibold">{moves} Moves</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-red-500" />
              <span className="font-semibold">{formatTime(time)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 flex flex-col">
            {hasNextLevel && (
              <Button
                onClick={onNextLevel}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg rounded-lg"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Next Level
              </Button>
            )}
            <div className="bg-gray-700 text-gray-400 text-center py-2 rounded-lg">
              Ad Banner - bottom
            </div>
            <Button
              onClick={onPlayAgain}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 text-lg rounded-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={onExit}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 text-lg rounded-lg"
            >
              Back to Levels
            </Button>
            <div className="bg-gray-700 text-gray-400 text-center py-2 rounded-lg">
              Ad Banner - bottom
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
