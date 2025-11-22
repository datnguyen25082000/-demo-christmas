import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const AUTO_START_DELAY = 2000;
const ROTATION_SPEED = 0.7;
const CIRCULAR_RADIUS = 4.4;
const TRAIN_SCALE = 0.42;
const INITIAL_ROTATION = -Math.PI / 2;

const FireShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      float intensity = pow(1.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 10.0);
      vec3 fireColor = vec3(1.0, 0.5, 0.0);
      vec3 glow = fireColor * intensity;
      vec3 reflection = vec3(1.0) * pow(max(dot(reflect(normalize(vPosition), vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 5.0);
      gl_FragColor = vec4(glow + reflection, 1.0);
    }
  `,
};

function Train({ onClick }) {
  const groupRef = useRef();
  const elapsedTimeRef = useRef(0);
  const originalMaterialsRef = useRef([]);

  const gltf = useGLTF('/models/train/back_to_the_future_train_-_steam_locomotive.glb', '/draco/');
  const { actions } = useAnimations(gltf.animations, groupRef);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isLit, setIsLit] = useState(false);

  const fireMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: FireShader.vertexShader,
      fragmentShader: FireShader.fragmentShader,
    });
  }, []);

  useEffect(() => {
    // Store original materials
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        originalMaterialsRef.current.push(child.material);
        child.name = `train-${child.name}`;
      }
    });

    // Auto-start after delay
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setIsLit(true);
    }, AUTO_START_DELAY);

    return () => clearTimeout(timer);
  }, [gltf.scene]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const action = Object.values(actions)[0];
      if (action) {
        action.play();
        action.paused = !isAnimating;
      }
    }
  }, [actions, isAnimating]);

  useEffect(() => {
    let materialIndex = 0;
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        if (isLit) {
          child.material = fireMaterial;
        } else {
          if (originalMaterialsRef.current[materialIndex]) {
            child.material = originalMaterialsRef.current[materialIndex];
          }
          materialIndex++;
        }
      }
    });
  }, [isLit, gltf.scene, fireMaterial]);

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      setIsAnimating((prev) => !prev);
      setIsLit((prev) => !prev);
      if (onClick) onClick(event);
    },
    [onClick]
  );

  useFrame((state, delta) => {
    if (!groupRef.current || !isAnimating) return;

    elapsedTimeRef.current += delta;
    const angle = elapsedTimeRef.current * ROTATION_SPEED;
    groupRef.current.position.x = CIRCULAR_RADIUS * Math.cos(angle);
    groupRef.current.position.z = CIRCULAR_RADIUS * Math.sin(angle);
    groupRef.current.rotation.y = -angle + INITIAL_ROTATION;
  });

  return (
    <group ref={groupRef} position={[CIRCULAR_RADIUS, 0.01, 0]} rotation-y={INITIAL_ROTATION}>
      <primitive object={gltf.scene} scale={TRAIN_SCALE} onClick={handleClick} />
    </group>
  );
}

export default Train;

useGLTF.preload('/models/train/back_to_the_future_train_-_steam_locomotive.glb');
