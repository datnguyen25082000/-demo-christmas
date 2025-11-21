import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Santa({ onClick }) {
  const groupRef = useRef();
  const lightRef = useRef();
  const gltf = useGLTF('/models/dudu/base.glb');
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  const [isLit, setIsLit] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  console.log('Santa component rendering, gltf:', gltf);

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

        const onFinished = () => {
          action.paused = true;
          setIsAnimating(false);
          mixer.removeEventListener('finished', onFinished);
        };
        mixer.addEventListener('finished', onFinished);
      }
    }
  }, [actions, isAnimating, mixer]);

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
      }, 8000); // Trigger every 8 seconds
    }, 5000); // Start after 5 seconds

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [actions, playAnimation]);

  const lightUp = () => {
    setIsLit(true);

    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!child.material.emissive) {
            child.material.emissive = new THREE.Color(0x000000);
          }
          child.material.emissive.setHex(0x0000ff);
          child.material.emissiveIntensity = 2;
        }
      });
    }

    setTimeout(() => {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          if (child.isMesh && child.material && child.material.emissive) {
            child.material.emissive.setHex(0x000000);
            child.material.emissiveIntensity = 0;
          }
        });
      }
      setIsLit(false);
    }, 1000);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    console.log('Santa clicked');
    playAnimation();
    lightUp();
    if (onClick) onClick(event);
  };

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={groupRef} position={[2.5, 0.1, 1.2]}>
      <primitive object={gltf.scene} onClick={handleClick} />
      {isLit && (
        <pointLight
          ref={lightRef}
          color={0x0000ff}
          intensity={2}
          distance={50}
          position={[0, 5, 0]}
        />
      )}
    </group>
  );
}

export default Santa;

useGLTF.preload('/models/dudu/base.glb');
