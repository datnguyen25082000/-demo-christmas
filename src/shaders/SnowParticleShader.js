import { Color } from 'three';

export const SnowParticleShader = {
  uniforms: {
    color: { value: new Color('#FFFFFF') }, // Snow color
    size: { value: 1.0 },
    scale: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform float size;
    uniform float scale;

    varying vec3 vColor;

    void main() {
      vColor = vec3(1.0); // White color

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (scale / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform vec3 color;

    varying vec3 vColor;

    void main() {
      float alpha = 1.0;
      float dist = length(gl_PointCoord - vec2(0.5, 0.5));
      if (dist > 0.5) {
        discard;
      }
      gl_FragColor = vec4(color * vColor, alpha);
    }`,
};
