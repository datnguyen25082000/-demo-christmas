import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SnowParticleShader } from '../shaders/SnowParticleShader.js';

const PARTICLE_COUNT = 7000;
const PARTICLE_SIZE = 0.04;
const PARTICLE_FALL_SPEED = 0.5;
const PARTICLE_SPREAD = 20;
const PARTICLE_MIN_Y = -10;
const PARTICLE_MAX_Y = 20;

function Particles() {
  const pointsRef = useRef();

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * PARTICLE_SPREAD;
      positions[i * 3 + 1] = Math.random() * PARTICLE_SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    }
    return positions;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SnowParticleShader.vertexShader,
      fragmentShader: SnowParticleShader.fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        size: { value: PARTICLE_SIZE * window.devicePixelRatio },
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
      positions[i * 3 + 1] -= delta * PARTICLE_FALL_SPEED;

      // Reset to top when it reaches the bottom for infinite snow effect
      if (positions[i * 3 + 1] < PARTICLE_MIN_Y) {
        positions[i * 3 + 1] = PARTICLE_MAX_Y;
        // Randomize x and z positions slightly for more natural effect
        positions[i * 3] = (Math.random() - 0.5) * PARTICLE_SPREAD;
        positions[i * 3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
}

export default Particles;
