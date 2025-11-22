import { useMemo } from 'react';
import * as THREE from 'three';
import { SnowShader } from '../shaders/SnowShader.js';

const FLOOR_SIZE = 20;
const FLOOR_HEIGHT = 0.2;
const FLOOR_Y_POSITION = -0.1;

function Floor() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SnowShader.vertexShader,
      fragmentShader: SnowShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(SnowShader.uniforms),
    });
  }, []);

  return (
    <mesh position={[0, FLOOR_Y_POSITION, 0]} receiveShadow material={material}>
      <boxGeometry args={[FLOOR_SIZE, FLOOR_HEIGHT, FLOOR_SIZE]} />
    </mesh>
  );
}

export default Floor;
