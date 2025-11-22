import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
import { TextShader } from '../shaders/TextShader.js';

extend({ TextGeometry });

const TEXT_CONTENT = 'Merry Christmas';
const TEXT_SIZE = 0.3;
const TEXT_DEPTH = 0.2;
const CURVE_SEGMENTS = 12;
const BEVEL_THICKNESS = 0.03;
const BEVEL_SIZE = 0.02;
const BEVEL_OFFSET = 0;
const BEVEL_SEGMENTS = 5;
const ANIMATION_SPEED = 3;
const SCALE_MULTIPLIER = 0.5;
const TEXT_POSITION_Y = 0.3;
const TEXT_ROTATION_Y = Math.PI * 0.5;
const TEXT_POSITION_X = 1;

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

    const state_ = animationState.current;

    if (!state_.isReversing) {
      // Scale up phase
      state_.progress += delta * ANIMATION_SPEED;
      if (state_.progress >= 1) {
        state_.progress = 1;
        state_.isReversing = true;
      }
    } else {
      // Scale down phase
      state_.progress -= delta * ANIMATION_SPEED;
      if (state_.progress <= 0) {
        state_.progress = 0;
        state_.isAnimating = false;
        state_.isReversing = false;
      }
    }

    // Apply scale with easing
    const easedProgress = Math.sin((state_.progress * Math.PI) / 2);
    const scale = 1 + easedProgress * SCALE_MULTIPLIER;
    meshRef.current.scale.copy(initialScale.current).multiplyScalar(scale);
  });

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();

      if (!meshRef.current || animationState.current.isAnimating) return;

      animationState.current.isAnimating = true;
      animationState.current.progress = 0;
      animationState.current.isReversing = false;

      if (onClick) onClick(event);
    },
    [onClick]
  );

  if (!font) return null;

  return (
    <mesh
      ref={meshRef}
      position={[TEXT_POSITION_X, TEXT_POSITION_Y, 0]}
      rotation-y={TEXT_ROTATION_Y}
      material={material}
      onClick={handleClick}
    >
      <textGeometry
        args={[
          TEXT_CONTENT,
          {
            font: font,
            size: TEXT_SIZE,
            depth: TEXT_DEPTH,
            curveSegments: CURVE_SEGMENTS,
            bevelEnabled: true,
            bevelThickness: BEVEL_THICKNESS,
            bevelSize: BEVEL_SIZE,
            bevelOffset: BEVEL_OFFSET,
            bevelSegments: BEVEL_SEGMENTS,
          },
        ]}
        center
      />
    </mesh>
  );
}

export default Text;
