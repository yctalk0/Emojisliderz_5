
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

  const generateConfettiPiece = (index: number) => {
    const angle = random(0, 2 * Math.PI); // Full circle
    const distance = random(50, 200); // How far it spreads from the center

    // Start near the center of the container (0,0 relative to the positioned parent)
    const startX = 0;
    const startY = 0;

    // End positions for spreading out
    const endX = startX + distance * Math.cos(angle);
    const endY = startY + distance * Math.sin(angle);

    return {
      x: startX,
      y: startY,
      endX: endX,
      endY: endY,
      color: `hsl(${random(0, 360)}, 100%, 70%)`,
      rotation: random(0, 720), // Rotate more for a dynamic look
      scale: random(0.5, 1.5),
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      mass: random(1, 5), // For spring physics
      friction: random(20, 40), // For spring physics
      delay: random(0, 300), // Stagger the start slightly
    };
  };

  useEffect(() => {
    if (isOpen) {
      const newConfettiPieces = Array.from({ length: 100 }).map(generateConfettiPiece);
      setConfettiPieces(newConfettiPieces);

      // Clear confetti after animation, if desired for a single burst effect
      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, 2000); // Adjust time as needed for the burst duration

      return () => clearTimeout(timer);

    } else {
      setConfettiPieces([]);
    }
  }, [isOpen]);

  const springs = useSprings(
    confettiPieces.length,
    confettiPieces.map(p => ({
      from: {
        opacity: 1,
        transform: `translate3d(0px, 0px, 0px) rotate(0deg) scale(${p.scale})`,
      },
      to: {
        opacity: 0,
        transform: `translate3d(${p.endX}px, ${p.endY}px, 0px) rotate(${p.rotation}deg) scale(${p.scale})`,
      },
      config: {
        mass: p.mass,
        friction: p.friction,
        tension: 200, // Make it a bit snappier
      },
      delay: p.delay,
      immediate: !isOpen, // Immediately go to 'from' state if not open
    }))
  );

  if (!isOpen && confettiPieces.length === 0) return null; // Only render if open or still animating

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-50">
      {springs.map((props, i) => (
        <animated.div
          key={`confetti-${i}`}
          style={{
            ...props,
            position: 'absolute',
            // Center the confetti pieces initially relative to the container
            left: '50%',
            top: '50%',
            marginLeft: '-5px', // Half of width to truly center
            marginTop: '-5px', // Half of height to truly center
            width: '10px',
            height: '10px',
            backgroundColor: confettiPieces[i].color,
            borderRadius: confettiPieces[i].shape === 'circle' ? '50%' : '0',
            // Ensure transform is applied correctly
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
