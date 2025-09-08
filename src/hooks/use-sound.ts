import { useState, useEffect } from 'react';

const useSound = (src: string, volume = 1) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newAudio = new Audio(src);
    newAudio.volume = volume;
    setAudio(newAudio);

    return () => {
      newAudio.pause();
    };
  }, [src, volume]);

  const play = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const stop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return { play, stop };
};

export default useSound;
