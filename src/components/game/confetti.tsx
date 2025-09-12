
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
    const angle = random(0, 360);
    const distance = random(containerWidth / 4, containerWidth / 2);
    const endX = Math.cos(angle * (Math.PI / 180)) * distance;
    const endY = Math.sin(angle * (Math.PI / 180)) * distance;
    
    return {
      startX: containerWidth / 2,
      startY: containerHeight / 2,
      endX: containerWidth / 2 + endX,
      endY: containerHeight / 2 + endY,
      color: `hsl(${random(0, 360)}, 100%, 70%)`,
      rotation: random(0, 720),
      scale: random(0.5, 1.2),
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      delay: random(0, 200),
    };
  };

  useEffect(() => {
    if (isOpen) {
      const newConfettiPieces = Array.from({ length: 300 }).map(generateConfettiPiece);
      setConfettiPieces(newConfettiPieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, 5000); // Let them exist for a few seconds

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
        tension: 120, 
        friction: 20, 
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
