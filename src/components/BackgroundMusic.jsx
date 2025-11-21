import React, { useEffect, useRef, useState } from 'react';

function BackgroundMusic() {
  const audioRef = useRef(null);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/audio/audio.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Try to autoplay after a short delay
    const timer = setTimeout(async () => {
      try {
        console.log('Starting background music...');
        await audio.play();
        console.log('Background music started successfully');
      } catch (error) {
        console.warn('Autoplay blocked. Showing play button:', error);
        // Show play button if autoplay is blocked
        setShowPlayButton(true);
      }
    }, 1000);

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
        console.log('Background music started after user interaction');
        setShowPlayButton(false);
      } catch (e) {
        console.error('Failed to start audio:', e);
      }
    }
  };

  if (!showPlayButton) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        cursor: 'pointer'
      }}
      onClick={handlePlayClick}
    >
      <div
        style={{
          backgroundColor: '#cc0000',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '10px',
          fontSize: '20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        🎵 Tap to Play Music 🎄
      </div>
    </div>
  );
}

export default BackgroundMusic;
