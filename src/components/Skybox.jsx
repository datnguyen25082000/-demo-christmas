import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SkyboxShader } from '../SkyboxShader.js';

function Skybox() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SkyboxShader.vertexShader,
      fragmentShader: SkyboxShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(SkyboxShader.uniforms),
      side: THREE.BackSide
    });
  }, []);

  return (
    <mesh material={material}>
      <boxGeometry args={[20, 20, 20]} />
    </mesh>
  );
}

export default Skybox;
