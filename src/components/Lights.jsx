import React from 'react';
import * as THREE from 'three';

function Lights() {
  return (
    <>
      {/* Soft white ambient light */}
      <ambientLight intensity={5} color={0x404040} />

      {/* Bright ambient light in the center */}
      <ambientLight intensity={3} color={0xffffff} />

      {/* Four directional lights positioned around the scene */}
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1.3}
        castShadow
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <directionalLight
        position={[-5, 10, 7.5]}
        intensity={1.3}
        castShadow
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <directionalLight
        position={[5, 10, -7.5]}
        intensity={1.3}
        castShadow
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <directionalLight
        position={[-5, 10, -7.5]}
        intensity={1.3}
        castShadow
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}

export default Lights;
