"use client";

import { useEffect, useState, useMemo } from 'react';

const ConfettiPiece = ({ style }: { style: React.CSSProperties }) => (
    <div className="confetti" style={style} />
);

const Confetti = ({ count = 100 }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pieces = useMemo(() => {
    if (!isClient) return [];
    
    const colors = ["#2962FF", "#FFDA63", "#FF6B6B", "#4ECDC4", "#ffffff"];

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 3}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      },
    }));
  }, [count, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(piece => (
        <ConfettiPiece key={piece.id} style={piece.style} />
      ))}
    </div>
  );
};

export default Confetti;
