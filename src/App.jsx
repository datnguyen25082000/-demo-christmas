import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Configure DRACO loader globally
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

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

// Component to add AudioListener to camera for PositionalAudio
function AudioListenerComponent() {
  const { camera } = useThree();

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    return () => {
      camera.remove(listener);
    };
  }, [camera]);

  return null;
}

function Scene() {
  useEffect(() => {
    // Hide loading screen when all components are loaded
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      const timer = setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Add AudioListener to camera and auto-play background music */}
      <AudioListenerComponent />

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
        <Santa />
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
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [1, 0.5, 7], fov: 90, near: 1, far: 80 }}
        gl={{
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap
          }
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
        <OrbitControls
          target={[1, 2, 1]}
          enableDamping
          dampingFactor={0.1}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}

export default App;
