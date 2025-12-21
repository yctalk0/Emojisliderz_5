
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
const unsupportedRef = useRef<boolean>(false);

  // Effect to initialize and configure the audio element once.
  useEffect(() => {
    // Create the audio element only if it doesn't exist.
    if (!audioRef.current) {
      console.log('Attempting to load audio from:', src); // Log the source

      // Create audio element and try to determine if the browser can play the common audio types.
      const audio = new Audio(src);

      const canPlayMpeg = audio.canPlayType && audio.canPlayType('audio/mpeg');
      const canPlayMp4 = audio.canPlayType && audio.canPlayType('audio/mp4');
      const canPlayOgg = audio.canPlayType && audio.canPlayType('audio/ogg');
      const canPlayWav = audio.canPlayType && audio.canPlayType('audio/wav');

      if (!canPlayMpeg && !canPlayMp4 && !canPlayOgg && !canPlayWav) {
        console.error(
          'Audio format not supported by this browser. canPlayType results:',
          {
            'audio/mpeg': canPlayMpeg,
            'audio/mp4': canPlayMp4,
            'audio/ogg': canPlayOgg,
            'audio/wav': canPlayWav
          },
          'for src:',
          src
        );
        // Mark as unsupported so we don't repeatedly attempt to play it.
        unsupportedRef.current = true;
      }

      audio.loop = loop;
      audioRef.current = audio;
      // Attempt to load, but play() will still be guarded if unsupportedRef is true.
      try {
        audio.load(); // Explicitly call load()
      } catch (err) {
        // Some environments may throw when calling load — log for debugging.
        // eslint-disable-next-line no-console
        console.warn('audio.load() threw:', err);
      }
    }

    // Cleanup function to pause and nullify the audio element on component unmount.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // Setting to null is important for cleanup.
        // The audio element will be re-created if the component mounts again.
        audioRef.current = null;
      }
      unsupportedRef.current = false;
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
    if (audioRef.current && !(soundType === 'music' && isMuted) && !unsupportedRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Autoplay prevented. User interaction required.');
        } else if (error.name === 'NotSupportedError') {
          // The browser refused because it can't play this source.
          unsupportedRef.current = true;
          console.error(
            'NotSupportedError playing sound. The browser cannot play this media format.',
            'for src:',
            src,
            'canPlayType(audio/mpeg):',
            audioRef.current?.canPlayType?.('audio/mpeg')
          );
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
    } else if (unsupportedRef.current) {
      // Avoid noisy repeated attempts when format is unsupported.
      console.warn('Skipping play() because audio format is marked as unsupported for src:', src);
    }
  }, [isMuted, soundType, src]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused && !(soundType === 'music' && isMuted) && !unsupportedRef.current) {
      audioRef.current.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Autoplay prevented. User interaction required.');
        } else if (error.name === 'NotSupportedError') {
          unsupportedRef.current = true;
          console.error(
            'NotSupportedError resuming sound. The browser cannot play this media format.',
            'for src:',
            src,
            'canPlayType(audio/mpeg):',
            audioRef.current?.canPlayType?.('audio/mpeg')
          );
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
    } else if (unsupportedRef.current) {
      console.warn('Skipping resume() because audio format is marked as unsupported for src:', src);
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
