
import { useEffect, useRef, useCallback } from 'react';

const useSound = (
  src: string,
  volume: number = 1,
  soundType: 'music' | 'effect' = 'effect',
  isMuted: boolean = false,
  loop: boolean = false
) => {
  // Use a ref to store the audio element. This will persist across re-renders.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to initialize and configure the audio element once.
  useEffect(() => {
    // Create the audio element only if it doesn't exist.
    if (!audioRef.current) {
      console.log('Attempting to load audio from:', src); // Log the source
      const audio = new Audio(src);
      audio.loop = loop;
      audioRef.current = audio;
      audio.load(); // Explicitly call load()
    }

    // Cleanup function to pause and nullify the audio element on component unmount.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // Setting to null is important for cleanup.
        // The audio element will be re-created if the component mounts again.
        audioRef.current = null;
      }
    };
  }, [src, loop]); // Dependencies ensure this runs only if src or loop changes.

  // Effect to update volume and muted state.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const play = useCallback(() => {
    if (audioRef.current && !(soundType === 'music' && isMuted)) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Autoplay prevented. User interaction required.');
        } else if (error.name !== 'AbortError') { // Don't log AbortError
          console.error(
            'Error playing sound:',
            error.name,
            error.message,
            'for src:',
            src
          ); // More comprehensive logging
        }
      });
    }
  }, [isMuted, soundType, src]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused && !(soundType === 'music' && isMuted)) {
      audioRef.current.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Autoplay prevented. User interaction required.');
        } else if (error.name !== 'AbortError') {
          console.error(
            'Error playing sound:',
            error.name,
            error.message,
            'for src:',
            src
          ); // More comprehensive logging
        }
      });
    }
  }, [isMuted, soundType, src]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, pause, resume, stop };
};

export default useSound;
