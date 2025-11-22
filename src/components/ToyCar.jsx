import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Clone } from '@react-three/drei';
import * as THREE from 'three';

function SingleCar({ position, rotation, autoTriggerDelay = 0 }) {
  const groupRef = useRef();
  const gltf = useGLTF('/models/car/low_poly_car_classic_coupe.glb');
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  const [isAnimating, setIsAnimating] = useState(false);

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
    if (actions && Object.keys(actions).length > 0 && !isAnimating) {
      const action = Object.values(actions)[0];
      if (action && !action.isRunning()) {
        setIsAnimating(true);
        action.reset();
        action.paused = false;
        action.play();

        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }
    }
  }, [actions, isAnimating]);

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
      }, 5000); // Trigger every 5 seconds
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
      <Clone object={gltf.scene} scale={0.36} onClick={handleClick} />
    </group>
  );
}

function ToyCars() {
  const positions = [
    { x: 0, z: 1.9 },
    { x: 0, z: -1.9 },
    { x: 1.9, z: 0 },
  ];

  return (
    <>
      {positions.map((pos, index) => (
        <SingleCar
          key={index}
          position={[pos.x, 0, pos.z]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          autoTriggerDelay={2000 + index * 1000} // Stagger each car by 1 second
        />
      ))}
    </>
  );
}

export default ToyCars;

useGLTF.preload('/models/car/low_poly_car_classic_coupe.glb');
