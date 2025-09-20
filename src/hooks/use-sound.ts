
import { useEffect, useRef, useCallback } from 'react';

const useSound = (
  src: string,
  volume: number = 1,
  soundType: 'music' | 'effect' = 'effect',
  isMuted: boolean = false,
  loop: boolean = false
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      console.log('Attempting to load audio from:', src);
      const audio = new Audio();
      const source = document.createElement('source');
      source.src = src;
      if (src.endsWith('.mp3')) {
        source.type = 'audio/mpeg';
      }
      // Add more types here if needed, e.g., '.ogg', '.wav'
      audio.appendChild(source);
      
      audio.loop = loop;
      audio.volume = volume;
      audio.muted = isMuted;
      audioRef.current = audio;

      audio.onerror = (e) => {
        console.error('Error loading audio:', e);
        if (audio.error) {
          switch (audio.error.code) {
            case audio.error.MEDIA_ERR_ABORTED:
              console.error('You aborted the audio playback.');
              break;
            case audio.error.MEDIA_ERR_NETWORK:
              console.error('A network error caused the audio download to fail.');
              break;
            case audio.error.MEDIA_ERR_DECODE:
              console.error('The audio playback was aborted due to a corruption problem or because the media used features your browser does not support.');
              break;
            case audio.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              console.error('The audio source is not supported by your browser.');
              break;
            default:
              console.error('An unknown audio error occurred.');
              break;
          }
        }
      };
      audio.load();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
    };
  }, [src, loop, volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.paused && !(soundType === 'music' && isMuted)) {
      audioRef.current.currentTime = 0;
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
          );
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
          );
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
