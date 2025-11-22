const DIRECTIONAL_LIGHT_POSITIONS = [
  [5, 10, 7.5],
  [-5, 10, 7.5],
  [5, 10, -7.5],
  [-5, 10, -7.5],
];

const SHADOW_CONFIG = {
  near: 0.1,
  far: 25,
  left: -10,
  right: 10,
  top: 10,
  bottom: -10,
  mapSize: 1024,
};

function Lights() {
  return (
    <>
      {/* Soft white ambient light */}
      <ambientLight intensity={5} color={0x404040} />

      {/* Bright ambient light in the center */}
      <ambientLight intensity={3} color={0xffffff} />

      {/* Four directional lights positioned around the scene */}
      {DIRECTIONAL_LIGHT_POSITIONS.map((position, index) => (
        <directionalLight
          key={index}
          position={position}
          intensity={1.3}
          castShadow
          shadow-camera-near={SHADOW_CONFIG.near}
          shadow-camera-far={SHADOW_CONFIG.far}
          shadow-camera-left={SHADOW_CONFIG.left}
          shadow-camera-right={SHADOW_CONFIG.right}
          shadow-camera-top={SHADOW_CONFIG.top}
          shadow-camera-bottom={SHADOW_CONFIG.bottom}
          shadow-mapSize-width={SHADOW_CONFIG.mapSize}
          shadow-mapSize-height={SHADOW_CONFIG.mapSize}
        />
      ))}
    </>
  );
}

export default Lights;
