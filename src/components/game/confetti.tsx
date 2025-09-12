
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
    return {
      x: random(0, containerWidth), // Start anywhere along the width
      y: -20, // Start just above the viewport
      endX: random(-50, 50), // Reduced Horizontal drift
      endY: window.innerHeight + 50, // Fall past the bottom of the screen
      color: `hsl(${random(0, 360)}, 100%, 70%)`,
      rotation: random(0, 720),
      scale: random(0.5, 1.2),
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      mass: random(2, 5), // Heavier pieces
      friction: random(30, 60), // More friction for a steadier fall
      delay: random(0, 2000), // Stagger the fall over 2 seconds
    };
  };

  useEffect(() => {
    if (isOpen) {
      const newConfettiPieces = Array.from({ length: 300 }).map(generateConfettiPiece);
      setConfettiPieces(newConfettiPieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, 5000); // Let them fall for a few seconds

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
        transform: `translate3d(${p.x}px, ${p.y}px, 0px) rotate(0deg) scale(${p.scale})`,
      },
      to: {
        opacity: 0,
        transform: `translate3d(${p.x + p.endX}px, ${p.endY}px, 0px) rotate(${p.rotation}deg) scale(${p.scale})`,
      },
      config: {
        mass: p.mass,
        friction: p.friction,
        tension: 100, // Lower tension for a slower, more graceful fall
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
