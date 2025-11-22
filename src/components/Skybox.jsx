import { useMemo } from 'react';
import * as THREE from 'three';
import { SkyboxShader } from '../shaders/SkyboxShader.js';

const SKYBOX_SIZE = 20;

function Skybox() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SkyboxShader.vertexShader,
      fragmentShader: SkyboxShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(SkyboxShader.uniforms),
      side: THREE.BackSide,
    });
  }, []);

  return (
    <mesh material={material}>
      <boxGeometry args={[SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE]} />
    </mesh>
  );
}

export default Skybox;
