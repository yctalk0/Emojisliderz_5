
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

  const blastSprings = useSprings(
    blastPieces.length,
    blastPieces.map(p => ({
      from: { x: p.startX, y: p.startY, opacity: 1, transform: `rotate(${p.rotation}deg) scale(1)` },
      to: { x: p.endX, y: p.endY, opacity: 0, transform: `rotate(${p.rotation + 180}deg) scale(${p.scale})` },
      config: { mass: 1, tension: 280, friction: 90 },
      delay: Math.random() * 200,
    }))
  );
  
  const rainSprings = useSprings(
    rainPieces.length,
    rainPieces.map(p => ({
      from: { y: p.y, x: p.x, opacity: 1, transform: `rotate(${p.rotation}deg) scale(${p.scale})` },
      to: { y: window.innerHeight + 100, x: p.x + p.sway * 200, opacity: 0, transform: `rotate(${p.rotation + 180}deg) scale(${p.scale})` },
      config: { duration: random(4000, 7000) },
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
