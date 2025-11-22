import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

const ANIMATION_INTERVAL = 5000;
const BASE_AUTO_TRIGGER_DELAY = 4000;
const STAGGER_DELAY = 1200;
const SNOWMAN_SCALE = 0.15;

function SingleSnowman({ position, rotation, autoTriggerDelay = 0 }) {
  const groupRef = useRef();
  const mixerRef = useRef();
  const actionRef = useRef();
  const gltf = useGLTF('/models/snowman/snow_man.glb');

  const [isAnimating, setIsAnimating] = useState(false);

  // Clone the scene with animations using SkeletonUtils
  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(gltf.scene);
  }, [gltf.scene]);

  // Initialize mixer and action
  useEffect(() => {
    if (clonedScene && gltf.animations && gltf.animations.length > 0) {
      // Create a new mixer for the cloned scene
      mixerRef.current = new THREE.AnimationMixer(clonedScene);

      // Create action from the animation clip
      const animationClip = gltf.animations[0];
      actionRef.current = mixerRef.current.clipAction(animationClip);

      if (actionRef.current) {
        actionRef.current.paused = true;
        actionRef.current.loop = THREE.LoopOnce;
        actionRef.current.clampWhenFinished = true;
      }
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [clonedScene, gltf.animations]);

  const playAnimation = () => {
    if (actionRef.current && mixerRef.current && !isAnimating) {
      setIsAnimating(true);
      actionRef.current.reset();
      actionRef.current.paused = false;
      actionRef.current.play();

      const onFinished = () => {
        actionRef.current.paused = true;
        setIsAnimating(false);
        mixerRef.current.removeEventListener('finished', onFinished);
      };
      mixerRef.current.addEventListener('finished', onFinished);
    }
  };

  // Auto-trigger animation at intervals
  useEffect(() => {
    if (!actionRef.current) return;

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
  }, [autoTriggerDelay]);

  const handleClick = (event) => {
    event.stopPropagation();
    playAnimation();
  };

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[SNOWMAN_SCALE, SNOWMAN_SCALE, SNOWMAN_SCALE]}
    >
      <primitive object={clonedScene} onClick={handleClick} />
    </group>
  );
}

const SNOWMAN_POSITIONS = [
  { x: -1.5, z: 1.5 },
  { x: 1.5, z: -1.5 },
  { x: -1.5, z: -1.5 },
];

function Snowmen() {
  return (
    <>
      {SNOWMAN_POSITIONS.map((pos, index) => (
        <SingleSnowman
          key={index}
          position={[pos.x, 0.1, pos.z]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          autoTriggerDelay={BASE_AUTO_TRIGGER_DELAY + index * STAGGER_DELAY}
        />
      ))}
    </>
  );
}

export default Snowmen;

useGLTF.preload('/models/snowman/snow_man.glb');
