import React, { useRef, useState, useMemo, useEffect } from 'react';
import { extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
import { TextShader } from '../TextShader.js';

extend({ TextGeometry });

function Text({ onClick }) {
  const meshRef = useRef();
  const [font, setFont] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: TextShader.vertexShader,
      fragmentShader: TextShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(TextShader.uniforms)
    });
  }, []);

  useEffect(() => {
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  const handleClick = (event) => {
    event.stopPropagation();

    if (!meshRef.current || isAnimating) return;

    setIsAnimating(true);

    const initialScale = meshRef.current.scale.clone();
    const targetScale = initialScale.clone().multiplyScalar(1.5);
    const duration = 500; // Duration in milliseconds
    const startTime = performance.now();

    const animateScale = (time) => {
      const elapsedTime = time - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Interpolate scale
      meshRef.current.scale.lerpVectors(initialScale, targetScale, progress);

      if (progress < 1) {
        requestAnimationFrame(animateScale);
      } else {
        // Reverse animation
        const reverseStartTime = performance.now();
        const reverseAnimate = (reverseTime) => {
          const reverseElapsedTime = reverseTime - reverseStartTime;
          const reverseProgress = Math.min(reverseElapsedTime / duration, 1);

          meshRef.current.scale.lerpVectors(targetScale, initialScale, reverseProgress);

          if (reverseProgress < 1) {
            requestAnimationFrame(reverseAnimate);
          } else {
            setIsAnimating(false);
          }
        };
        requestAnimationFrame(reverseAnimate);
      }
    };

    requestAnimationFrame(animateScale);

    if (onClick) onClick(event);
  };

  if (!font) return null;

  return (
    <mesh
      ref={meshRef}
      position={[1, 0.3, 0]}
      rotation-y={Math.PI * 0.5}
      material={material}
      onClick={handleClick}
    >
      <textGeometry
        args={[
          'Merry Christmas',
          {
            font: font,
            size: 0.3,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
          }
        ]}
        center
      />
    </mesh>
  );
}

export default Text;
