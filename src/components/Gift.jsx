import { useRef, useState, useEffect, useCallback } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';

const COLOR_TOGGLE_INTERVAL = 6000;
const GIFT_SCALE = 0.7;
const BASE_AUTO_TRIGGER_DELAY = 3000;
const STAGGER_DELAY = 1500;

function SingleGift({ position, autoTriggerDelay = 0 }) {
  const groupRef = useRef();
  const gltf = useGLTF('/models/gifts/simple_presents.glb');

  const originalColorsRef = useRef(new Map());
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    // Store original colors
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
          originalColorsRef.current.set(child.uuid, child.material.color.clone());
        }
      });
    }
  }, []);

  const toggleColor = useCallback(() => {
    setIsToggled((prev) => !prev);

    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
          const originalColor = originalColorsRef.current.get(child.uuid);
          if (originalColor) {
            if (child.material.color.equals(originalColor)) {
              // Apply random color multiplied by the inverse of the original color
              const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
              child.material.color.setRGB(
                (1 - originalColor.r) * randomColor.r,
                (1 - originalColor.g) * randomColor.g,
                (1 - originalColor.b) * randomColor.b
              );
            } else {
              // Restore the original color
              child.material.color.copy(originalColor);
            }
          }
        }
      });
    }
  }, []);

  // Auto-trigger color change at intervals
  useEffect(() => {
    if (originalColorsRef.current.size === 0) return;

    let intervalId;

    // Initial delay before starting the interval
    const initialTimer = setTimeout(() => {
      toggleColor();

      // Set up interval to repeat
      intervalId = setInterval(() => {
        toggleColor();
      }, COLOR_TOGGLE_INTERVAL);
    }, autoTriggerDelay);

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoTriggerDelay, toggleColor]);

  const handleClick = (event) => {
    event.stopPropagation();
    toggleColor();
  };

  return (
    <group ref={groupRef} position={position}>
      <Clone object={gltf.scene} scale={GIFT_SCALE} onClick={handleClick} />
    </group>
  );
}

const GIFT_POSITIONS = [
  { x: -2, z: 2 },
  { x: -2, z: -2 },
  { x: 2, z: 2.2 },
];

function Gifts() {
  return (
    <>
      {GIFT_POSITIONS.map((pos, index) => (
        <SingleGift
          key={index}
          position={[pos.x, 0, pos.z]}
          autoTriggerDelay={BASE_AUTO_TRIGGER_DELAY + index * STAGGER_DELAY}
        />
      ))}
    </>
  );
}

export default Gifts;

useGLTF.preload('/models/gifts/simple_presents.glb');
