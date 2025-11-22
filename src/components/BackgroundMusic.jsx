import { useEffect, useRef, useState } from 'react';

const LOADING_DELAY = 2000;
const INITIAL_VOLUME = 0.5;

const OVERLAY_STYLE = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
  transition: 'background-color 0.5s ease',
};

const BUTTON_STYLE = {
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
};

const MERRY_XMAS_LETTERS = ['M', 'E', 'R', 'R', 'Y', 'X', 'M', 'A', 'S'];

function BackgroundMusic({ onStart }) {
  const audioRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/audio/audio.mp3');
    audio.loop = true;
    audio.volume = INITIAL_VOLUME;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Show button after delay
    const timer = setTimeout(() => {
      setShowButton(true);
    }, LOADING_DELAY);

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
      } catch (error) {
        console.error('Failed to start audio:', error);
      }
    }
  };

  if (isHidden) return null;

  const overlayStyle = {
    ...OVERLAY_STYLE,
    backgroundColor: showButton ? 'rgba(0, 0, 0, 0.7)' : '#6e3826',
    pointerEvents: showButton ? 'none' : 'auto',
  };

  const buttonStyle = {
    ...BUTTON_STYLE,
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div style={overlayStyle}>
      {/* Loading animation container - hidden when button appears */}
      {!showButton && (
        <div className="scene">
          <div className="word">
            {MERRY_XMAS_LETTERS.map((letter, index) => (
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

      {/* Play button - appears after delay */}
      {showButton && (
        <div
          onClick={handlePlayClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={buttonStyle}
        >
          🎵 Tap to Play Music 🎄
        </div>
      )}
    </div>
  );
}

export default BackgroundMusic;
