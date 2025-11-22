import React, { useRef, useState, useMemo, useEffect } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
import { TextShader } from '../shaders/TextShader.js';

extend({ TextGeometry });

function Text({ onClick }) {
  const meshRef = useRef();
  const [font, setFont] = useState(null);
  const animationState = useRef({ isAnimating: false, progress: 0, isReversing: false });
  const initialScale = useRef(new THREE.Vector3(1, 1, 1));

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: TextShader.vertexShader,
      fragmentShader: TextShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(TextShader.uniforms),
    });
  }, []);

  useEffect(() => {
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !animationState.current.isAnimating) return;

    const speed = 3; // Animation speed
    const state_ = animationState.current;

    if (!state_.isReversing) {
      // Scale up phase
      state_.progress += delta * speed;
      if (state_.progress >= 1) {
        state_.progress = 1;
        state_.isReversing = true;
      }
    } else {
      // Scale down phase
      state_.progress -= delta * speed;
      if (state_.progress <= 0) {
        state_.progress = 0;
        state_.isAnimating = false;
        state_.isReversing = false;
      }
    }

    // Apply scale with easing
    const easedProgress = Math.sin((state_.progress * Math.PI) / 2);
    const scale = 1 + easedProgress * 0.5; // Scale from 1 to 1.5
    meshRef.current.scale.copy(initialScale.current).multiplyScalar(scale);
  });

  const handleClick = (event) => {
    event.stopPropagation();

    if (!meshRef.current || animationState.current.isAnimating) return;

    animationState.current.isAnimating = true;
    animationState.current.progress = 0;
    animationState.current.isReversing = false;

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
            bevelSegments: 5,
          },
        ]}
        center
      />
    </mesh>
  );
}

export default Text;
