
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSprings, animated } from '@react-spring/web';

interface ConfettiProps {
  isOpen: boolean;
}

const Confetti = ({ isOpen }: ConfettiProps) => {
  const [rainPieces, setRainPieces] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  // --- Rain ---
  const generateRainPiece = () => ({
    x: random(0, window.innerWidth),
    y: random(-200, -20),
    color: `hsl(${random(0, 360)}, 100%, 50%)`,
    rotation: random(0, 360),
    sway: random(-1, 1),
    scale: random(0.5, 1.2),
    shape: Math.random() > 0.5 ? 'square' : 'circle', // Add random shape
  });

  useEffect(() => {
    if (isOpen) {
      const newRainPieces = Array.from({ length: 200 }).map(generateRainPiece);
      setRainPieces(newRainPieces);
    } else {
      setRainPieces([]);
    }
  }, [isOpen]);

  // --- Rain Animation ---
  const rainSprings = useSprings(
    rainPieces.length,
    rainPieces.map(p => ({
      from: {
        transform: `translate(${p.x}px, ${p.y}px) rotate(0deg) scale(${p.scale})`,
      },
      to: async (next: any) => {
        while (true) {
          await next({
            transform: `translate(${p.x + p.sway * 50}px, ${window.innerHeight + 50}px) rotate(${p.rotation}deg) scale(${p.scale})`,
          });
          await next({
            transform: `translate(${p.x}px, -50px) rotate(0deg) scale(${p.scale})`,
            immediate: true,
          });
        }
      },
      config: { duration: random(3000, 6000) }, // Increased speed by reducing duration
    }))
  );

  return (
      <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-50">
        {rainSprings.map((props, i) => (
          <animated.div
            key={`rain-${i}`}
            style={{
              ...props,
              position: 'absolute',
              width: '10px',
              height: '10px',
              backgroundColor: rainPieces[i].color,
              willChange: 'transform, opacity',
              borderRadius: rainPieces[i].shape === 'circle' ? '50%' : '0', // Apply border-radius for circle shape
            }}
          />
        ))}
      </div>
    );
 };
 
 export default Confetti;
