import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraAnimation({ shouldStart, onComplete }) {
  const { camera } = useThree();
  const animationProgress = useRef(0);
  const isAnimating = useRef(false); // Don't start automatically
  const hasStarted = useRef(false);
  const hasCompleted = useRef(false);

  // Starting position (far away and high up)
  const startPosition = new THREE.Vector3(5, 10, 20);

  // Target position (higher than original to avoid going beyond)
  const targetPosition = new THREE.Vector3(1.5, 2, 7);

  useEffect(() => {
    // Set initial camera position
    camera.position.copy(startPosition);
  }, [camera]);

  useEffect(() => {
    // Start animation when shouldStart becomes true
    if (shouldStart && !hasStarted.current) {
      isAnimating.current = true;
      hasStarted.current = true;
      console.log('Camera animation started');
    }
  }, [shouldStart]);

  useFrame((state, delta) => {
    if (!isAnimating.current) return;

    // Animation duration: 3 seconds
    const animationDuration = 3;
    animationProgress.current += delta / animationDuration;

    if (animationProgress.current >= 1) {
      // Animation complete
      animationProgress.current = 1;
      isAnimating.current = false;
      camera.position.copy(targetPosition);

      // Call onComplete callback once
      if (!hasCompleted.current && onComplete) {
        hasCompleted.current = true;
        onComplete();
      }
    } else {
      // Smooth easing function (ease-in-out)
      const t = animationProgress.current;
      const easedProgress = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Interpolate position
      camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
    }
  });

  return null;
}

export default CameraAnimation;
