import React, { useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';

// Import all React components
import Lights from './components/Lights.jsx';
import Floor from './components/Floor.jsx';
import Skybox from './components/Skybox.jsx';
import Particles from './components/Particles.jsx';
import Train from './components/Train.jsx';
import Santa from './components/Santa.jsx';
import Snowmen from './components/Snowman.jsx';
import ToyCars from './components/ToyCar.jsx';
import Gifts from './components/Gift.jsx';
import ChristmasTree from './components/ChristmasTree.jsx';
import Text from './components/Text.jsx';
import BackgroundMusic from './components/BackgroundMusic.jsx';
import CameraAnimation from './components/CameraAnimation.jsx';
import LoveTextOverlay from './components/LoveTextOverlay.jsx';

function Scene({ cameraAnimationStart, onCameraAnimationComplete, onShowLoveText }) {
  return (
    <>
      {/* Debug Stats */}
      <Stats />

      {/* Camera Animation */}
      <CameraAnimation shouldStart={cameraAnimationStart} onComplete={onCameraAnimationComplete} />

      {/* Lighting */}
      <Lights />

      {/* Environment */}
      <Skybox />
      <Floor />

      {/* Particles (Snow) */}
      <Particles />

      {/* Interactive Objects wrapped in Suspense for loading */}
      <Suspense fallback={null}>
        <Train />
        <Santa onShowLoveText={onShowLoveText} />
        <Snowmen />
        <ToyCars />
        <Gifts />
        <ChristmasTree />
        <Text />
      </Suspense>
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);
  const [showLoveText, setShowLoveText] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleCameraAnimationComplete = () => {
    setCameraAnimationComplete(true);
  };

  const handleShowLoveText = () => {
    setShowLoveText(true);
    // Hide after 3 seconds
    setTimeout(() => {
      setShowLoveText(false);
    }, 3000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Canvas - always rendered for preview */}
      <Canvas
        shadows
        camera={{ position: [1, 0.5, 7], fov: 90, near: 1, far: 80 }}
        gl={{
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            cameraAnimationStart={hasStarted}
            onCameraAnimationComplete={handleCameraAnimationComplete}
            onShowLoveText={handleShowLoveText}
          />
        </Suspense>
        <OrbitControls
          target={[1, 1.5, 1]}
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          enablePan={true}
          panSpeed={0.5}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          enabled={cameraAnimationComplete}
        />
      </Canvas>

      {/* Background music with loading screen - overlays the canvas */}
      <BackgroundMusic onStart={handleStart} />

      {/* Love text overlay */}
      <LoveTextOverlay show={showLoveText} />
    </div>
  );
}

export default App;
