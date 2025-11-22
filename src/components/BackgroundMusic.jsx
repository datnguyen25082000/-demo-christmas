import React, { useEffect, useRef, useState } from 'react';

function BackgroundMusic({ onStart }) {
  const audioRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/audio/audio.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Show button after 2000ms
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayClick = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsHidden(true);

        // Trigger camera animation and other start events
        if (onStart) {
          onStart();
        }
      } catch (e) {
        console.error('Failed to start audio:', e);
      }
    }
  };

  if (isHidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: showButton ? 'rgba(0, 0, 0, 0.7)' : '#6e3826',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        pointerEvents: showButton ? 'none' : 'auto',
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Loading animation container - hidden when button appears */}
      {!showButton && (
        <div className="scene">
          <div className="word">
            {['M', 'E', 'R', 'R', 'Y', 'X', 'M', 'A', 'S'].map((letter, index) => (
              <div key={index} className="letter__wrap" style={{ '--index': index }}>
                <div className="letter">
                  <div className="letter__panel">{letter}</div>
                  <div className="letter__panel">{letter}</div>
                  <div className="letter__panel">{letter}</div>
                  <div className="letter__panel">{letter}</div>
                  <div className="letter__panel">{letter}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Play button - appears after 2000ms */}
      {showButton && (
        <div
          onClick={handlePlayClick}
          style={{
            backgroundColor: '#cc0000',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            userSelect: 'none',
            cursor: 'pointer',
            animation: 'fadeIn 0.5s ease-in',
            transition: 'transform 0.2s ease',
            pointerEvents: 'auto',
            zIndex: 10001,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🎵 Tap to Play Music 🎄
        </div>
      )}
    </div>
  );
}

export default BackgroundMusic;
