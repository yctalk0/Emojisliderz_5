
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSprings, animated } from '@react-spring/web';

const Confetti = () => {
  const [blastPieces, setBlastPieces] = useState<any[]>([]);
  const [rainPieces, setRainPieces] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  // --- Blast ---
  const generateBlastPiece = (rect: DOMRect) => {
    const angle = random(0, 360);
    const distance = random(rect.width / 4, rect.width / 2);
    const startX = rect.width / 2;
    const startY = rect.height / 2;
    return {
      startX,
      startY,
      endX: startX + Math.cos(angle) * distance,
      endY: startY + Math.sin(angle) * distance,
      color: `hsl(${random(0, 360)}, 100%, 50%)`,
      rotation: random(0, 360),
      scale: random(0.5, 1.5),
    };
  };

  // --- Rain ---
  const generateRainPiece = () => ({
    x: random(0, window.innerWidth),
    y: random(-200, -20),
    color: `hsl(${random(0, 360)}, 100%, 50%)`,
    rotation: random(0, 360),
    sway: random(-1, 1),
    scale: random(0.5, 1.2),
  });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newBlastPieces = Array.from({ length: 300 }).map(() => generateBlastPiece(rect));
      setBlastPieces(newBlastPieces);
    }
    
    const newRainPieces = Array.from({ length: 200 }).map(generateRainPiece);
    setRainPieces(newRainPieces);
  }, []);

  // --- Blast Animation ---
  const blastSprings = useSprings(
    blastPieces.length,
    blastPieces.map(p => ({
      from: {
        transform: `translate(${p.startX}px, ${p.startY}px) rotate(0deg) scale(0)`,
        opacity: 1,
      },
      to: {
        transform: `translate(${p.endX}px, ${p.endY}px) rotate(${p.rotation}deg) scale(${p.scale})`,
        opacity: 0,
      },
      config: { duration: 3000 },
    }))
  );

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
      config: { duration: random(4000, 8000) },
    }))
  );

  return (
      <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-50">
        {blastSprings.map((props, i) => (
          <animated.div
            key={`blast-${i}`}
            style={{
              ...props,
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: blastPieces[i].color,
              willChange: 'transform, opacity',
            }}
          />
        ))}
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
            }}
          />
        ))}
      </div>
    );
 };
 
 export default Confetti;
