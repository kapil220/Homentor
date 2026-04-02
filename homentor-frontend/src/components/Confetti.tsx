import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  sway: number;
  swaySpeed: number;
}

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const colors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  useEffect(() => {
    // Generate confetti pieces
    const confettiPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      confettiPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        fallSpeed: Math.random() * 3 + 2,
        sway: Math.random() * 2 - 1,
        swaySpeed: Math.random() * 0.02 + 0.01,
      });
    }
    setPieces(confettiPieces);

    // Animate confetti
    const animateConfetti = () => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          y: piece.y + piece.fallSpeed,
          x: piece.x + Math.sin(piece.y * piece.swaySpeed) * piece.sway,
          rotation: piece.rotation + piece.rotationSpeed,
        })).filter(piece => piece.y < window.innerHeight + 20)
      );
    };

    const interval = setInterval(animateConfetti, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            transition: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
