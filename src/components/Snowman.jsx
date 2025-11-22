import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Clone } from '@react-three/drei';
import * as THREE from 'three';

function SingleSnowman({ position, rotation, autoTriggerDelay = 0 }) {
  const groupRef = useRef();
  const gltf = useGLTF('/models/snowman/snow_man.glb');
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  const [isPlaying, setIsPlaying] = useState(false);

  React.useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const action = Object.values(actions)[0];
      if (action) {
        action.paused = true;
        action.loop = THREE.LoopOnce;
        action.clampWhenFinished = true;
      }
    }
  }, [actions]);

  const playAnimation = useCallback(() => {
    if (actions && Object.keys(actions).length > 0 && !isPlaying) {
      const action = Object.values(actions)[0];
      if (action) {
        setIsPlaying(true);
        action.reset();
        action.paused = false;
        action.play();

        const onFinished = () => {
          action.paused = true;
          setIsPlaying(false);
          mixer.removeEventListener('finished', onFinished);
        };
        mixer.addEventListener('finished', onFinished);
      }
    }
  }, [actions, isPlaying, mixer]);

  // Auto-trigger animation at intervals
  React.useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    let intervalId;

    // Initial delay before starting the interval
    const initialTimer = setTimeout(() => {
      playAnimation();

      // Set up interval to repeat
      intervalId = setInterval(() => {
        playAnimation();
      }, 7000); // Trigger every 7 seconds
    }, autoTriggerDelay);

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [actions, autoTriggerDelay, playAnimation]);

  const handleClick = (event) => {
    event.stopPropagation();
    playAnimation();
  };

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Clone object={gltf.scene} scale={0.15} onClick={handleClick} />
    </group>
  );
}

function Snowmen() {
  const positions = [
    { x: -1.5, z: 1.5 },
    { x: 1.5, z: -1.5 },
    { x: -1.5, z: -1.5 },
  ];

  return (
    <>
      {positions.map((pos, index) => (
        <SingleSnowman
          key={index}
          position={[pos.x, 0.1, pos.z]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          autoTriggerDelay={4000 + index * 1200} // Stagger each snowman by 1.2 seconds
        />
      ))}
    </>
  );
}

export default Snowmen;

useGLTF.preload('/models/snowman/snow_man.glb');
