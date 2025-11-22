import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SnowParticleShader } from '../shaders/SnowParticleShader.js';

function Particles() {
  const pointsRef = useRef();
  const particleCount = 7000;

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SnowParticleShader.vertexShader,
      fragmentShader: SnowParticleShader.fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        size: { value: 0.04 * window.devicePixelRatio },
        scale: { value: window.innerHeight / 2 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < positions.length / 3; i++) {
      // Snow falls continuously
      positions[i * 3 + 1] -= delta * 0.5;

      // Reset to top when it reaches the bottom for infinite snow effect
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 20;
        // Randomize x and z positions slightly for more natural effect
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
}

export default Particles;
