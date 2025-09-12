
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSprings, animated } from '@react-spring/web';

interface ConfettiProps {
  isOpen: boolean;
}

const Confetti = ({ isOpen }: ConfettiProps) => {
  const [confettiPieces, setConfettiPieces] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  const generateConfettiPiece = () => {
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
    
    return {
      startX: random(0, containerWidth),
      startY: -20,
      endX: random(0, containerWidth),
      endY: containerHeight + 20,
      color: `hsl(${random(0, 360)}, 100%, 70%)`,
      rotation: random(0, 720),
      scale: random(0.5, 1.2),
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      delay: random(0, 4000), // Stagger the start of the fall
    };
  };

  useEffect(() => {
    if (isOpen) {
      const newConfettiPieces = Array.from({ length: 300 }).map(generateConfettiPiece);
      setConfettiPieces(newConfettiPieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, 8000); // Allow more time for slow confetti to fall

      return () => clearTimeout(timer);
    } else {
      setConfettiPieces([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const springs = useSprings(
    confettiPieces.length,
    confettiPieces.map(p => ({
      from: {
        opacity: 1,
        transform: `translate3d(${p.startX}px, ${p.startY}px, 0px) rotate(0deg) scale(1)`,
      },
      to: {
        opacity: 0,
        transform: `translate3d(${p.endX}px, ${p.endY}px, 0px) rotate(${p.rotation}deg) scale(${p.scale})`,
      },
      config: {
        tension: 30, // Lower tension for slower movement
        friction: 50, // Higher friction to slow it down
      },
      delay: p.delay,
    }))
  );

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[100]">
      {springs.map((props, i) => (
        <animated.div
          key={`confetti-${i}`}
          style={{
            ...props,
            position: 'absolute',
            left: 0,
            top: 0,
            width: '10px',
            height: '10px',
            backgroundColor: confettiPieces[i].color,
            borderRadius: confettiPieces[i].shape === 'circle' ? '50%' : '0',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
