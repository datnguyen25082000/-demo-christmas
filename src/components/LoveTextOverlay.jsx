import React from 'react';

function LoveTextOverlay({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '60px',
        fontWeight: 'bold',
        color: '#ff1493',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 20, 147, 0.6)',
        zIndex: 1000,
        pointerEvents: 'none',
        animation: 'fadeInOut 3s ease-in-out',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}
    >
      ❤️ Merry Xmas ❤️
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </div>
  );
}

export default LoveTextOverlay;
