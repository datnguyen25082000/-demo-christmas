import { Color } from 'three';

export const SnowShader = {
  uniforms: {
    color: { value: new Color("#f0f8ff") }, // Soft icy blue-white
    highlightColor: { value: new Color("#b8e6ff") }, // Light blue highlights
    shadowColor: { value: new Color("#d5e8f7") }, // Soft blue shadows
  },
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vNormal = normal;
      vPosition = position;
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform vec3 color;
    uniform vec3 highlightColor;
    uniform vec3 shadowColor;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Simple noise function for snow texture
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Calculate basic lighting
      float brightness = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));

      // Add subtle snow texture variation
      float noiseValue = noise(vPosition.xz * 5.0);
      float sparkle = noise(vPosition.xz * 50.0);

      // Mix base snow color with highlights and shadows
      vec3 baseColor = mix(shadowColor, color, noiseValue * 0.3 + 0.7);

      // Add sparkles for icy effect
      baseColor = mix(baseColor, highlightColor, sparkle * 0.2);

      // Apply lighting
      vec3 finalColor = baseColor * (0.85 + 0.15 * brightness);

      gl_FragColor = vec4(finalColor, 1.0);
    }`,
};