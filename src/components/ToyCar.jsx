import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Clone } from '@react-three/drei';
import * as THREE from 'three';

const ANIMATION_INTERVAL = 5000;
const ANIMATION_DURATION = 1000;
const BASE_AUTO_TRIGGER_DELAY = 2000;
const STAGGER_DELAY = 1000;
const CAR_SCALE = 0.36;

function SingleCar({ position, rotation, autoTriggerDelay = 0 }) {
  const groupRef = useRef();
  const gltf = useGLTF('/models/car/low_poly_car_classic_coupe.glb');
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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
        }, ANIMATION_DURATION);
      }
    }
  }, [actions, isAnimating]);

  // Auto-trigger animation at intervals
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    let intervalId;

    // Initial delay before starting the interval
    const initialTimer = setTimeout(() => {
      playAnimation();

      // Set up interval to repeat
      intervalId = setInterval(() => {
        playAnimation();
      }, ANIMATION_INTERVAL);
    }, autoTriggerDelay);

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [actions, autoTriggerDelay, playAnimation]);

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      playAnimation();
    },
    [playAnimation]
  );

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Clone object={gltf.scene} scale={CAR_SCALE} onClick={handleClick} />
    </group>
  );
}

const CAR_POSITIONS = [
  { x: 0, z: 1.9 },
  { x: 0, z: -1.9 },
  { x: 1.9, z: 0 },
];

function ToyCars() {
  return (
    <>
      {CAR_POSITIONS.map((pos, index) => (
        <SingleCar
          key={index}
          position={[pos.x, 0, pos.z]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          autoTriggerDelay={BASE_AUTO_TRIGGER_DELAY + index * STAGGER_DELAY}
        />
      ))}
    </>
  );
}

export default ToyCars;

useGLTF.preload('/models/car/low_poly_car_classic_coupe.glb');
