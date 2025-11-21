import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SnowShader } from '../SnowShader.js';

function Floor() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SnowShader.vertexShader,
      fragmentShader: SnowShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(SnowShader.uniforms)
    });
  }, []);

  return (
    <mesh
      position={[0, -0.1, 0]}
      receiveShadow
      material={material}
    >
      <boxGeometry args={[20, 0.2, 20]} />
    </mesh>
  );
}

export default Floor;
