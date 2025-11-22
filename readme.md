# Festive Three.js Scene

## Description
This project creates a festive scene using Three.js. The scene includes a train, a floor platform, various lights, snow particles, a Christmas tree with interactive elements, festive text, and a skybox. The skybox is created using shaders to simulate a gradient sky effect. The scene is designed to be interactive, with animations and audio that enhance the festive atmosphere.

### Features
- **Train**: A model of the "Back to the Future" steam locomotive that can be animated to move around the scene.
- **Floor**: A platform with a snow shader applied to it, creating a snowy ground effect.
- **Lights**: Various lights, including ambient and directional lights, to illuminate the scene.
- **Particles**: Snow particles falling in the scene to simulate a snowy environment.
- **Christmas Tree**: An interactive Christmas tree with lights and a star on top. Clicking the tree toggles animations and plays festive music.
- **Text**: Festive text displayed in the scene using a custom shader.
- **Skybox**: A gradient skybox created using shaders to simulate a clear, winter sky.

### Shaders
- **Snow Shader**: Applied to the floor to create a snow effect.
- **Skybox Shader**: Creates a gradient sky effect.
- **Tree Shader**: Used for the Christmas tree to enhance its appearance.
- **Snow Particle Shader**: Used for the snow particles to simulate falling snow.
- **Ghibli Shader**: Used for Ghibli-style effects.
- **Toon Shader**: Used for cartoon-like effects.
- **Text Shader**: Used for the festive text.

### Particles
- **Snow Particles**: Simulate falling snow in the scene.

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run the following commands:

1. Install dependencies (only the first time):
   - `npm install`

2. Run the local server at `localhost:5173`:
   - `npm run dev`

3. Build for production in the `dist/` directory:
   - `npm run build`

## Usage
- **Interactive Controls**: Use the mouse to orbit around the scene.
- **Toggle Animation**: Click on an asset to reveal an animation.
- **Audio**: The scene includes background music that plays when the tree is clicked.

## Using `script.js` Without a Loading Screen
If you want to use the spaghetti code in `script.js` without a loading screen, follow these steps:

1. Comment out the loading screen HTML in `index.html`.
2. Replace `main.js` with `script.js` in `index.html`.

## File Structure

```
christmas-scene/
├── src/
│   ├── components/          # React Three Fiber components
│   │   ├── BackgroundMusic.jsx    # Audio player with user interaction
│   │   ├── CameraAnimation.jsx    # Camera movement animations
│   │   ├── ChristmasTree.jsx      # Animated Christmas tree
│   │   ├── Floor.jsx              # Ground plane with snow shader
│   │   ├── Gift.jsx               # Interactive gift boxes
│   │   ├── Lights.jsx             # Scene lighting configuration
│   │   ├── LoveTextOverlay.jsx    # Overlay text component
│   │   ├── Particles.jsx          # Snow particle system
│   │   ├── Santa.jsx              # Animated Santa character
│   │   ├── Skybox.jsx             # Environment skybox
│   │   ├── Snowman.jsx            # Animated snowman
│   │   ├── Text.jsx               # 3D festive text
│   │   ├── ToyCar.jsx             # Animated toy cars
│   │   └── Train.jsx              # Moving train model
│   │
│   ├── shaders/             # Custom WebGL shaders
│   │   ├── GhibliShader.js        # Ghibli-style rendering
│   │   ├── SnowParticleShader.js  # Particle effects
│   │   ├── SnowShader.js          # Snow ground effect
│   │   ├── SkyboxShader.js        # Sky gradient
│   │   ├── StarShader.js          # Star glow effect
│   │   ├── TextShader.js          # 3D text material
│   │   └── ToonShader.js          # Toon/cel shading
│   │
│   ├── styles/              # CSS stylesheets
│   │   └── style.css              # Global styles
│   │
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.html           # HTML template
│
├── static/                  # Static assets
│   ├── models/              # 3D models (.glb format)
│   │   ├── car/
│   │   ├── christmas-tree/
│   │   ├── dudu/
│   │   ├── gifts/
│   │   ├── snowman/
│   │   └── train/
│   ├── audio/               # Background music
│   │   └── audio.mp3
│   ├── fonts/               # 3D text fonts (JSON format)
│   │   └── helvetiker_regular.typeface.json
│   ├── sprites/             # Textures and sprites
│   │   └── snowflake.png
│   └── draco/               # DRACO mesh compression
│       └── ...
│
├── package.json             # Project dependencies
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

---

## Folder Organization

This project follows a modular folder structure for better organization and maintainability:

### `/src/components/`
Contains all React Three Fiber components. Each component should:
- Be in its own file
- Have a descriptive name (PascalCase)
- Export as default
- Handle a single responsibility

**Examples:**
- `ChristmasTree.jsx` - Handles Christmas tree model and animations
- `Lights.jsx` - Manages scene lighting configuration
- `Particles.jsx` - Snow particle system

### `/src/shaders/`
Contains all custom WebGL shaders. Each shader should:
- Be in its own file ending with `Shader.js`
- Export a shader object with `uniforms`, `vertexShader`, and `fragmentShader`
- Have descriptive names indicating their purpose

**Examples:**
- `GhibliShader.js` - Ghibli-style cel shading
- `SnowShader.js` - Snow ground material
- `ToonShader.js` - Cartoon-style rendering

### `/src/styles/`
Contains CSS stylesheets:
- `style.css` - Global styles and loading screen animations

### Root `/src/` files
- `App.jsx` - Main application component with Canvas setup
- `main.jsx` - Application entry point
- `index.html` - HTML template with loading screen

### `/static/`
Static assets that don't need processing:
- `/models/` - 3D models organized by category
- `/audio/` - Sound files
- `/fonts/` - 3D text fonts
- `/sprites/` - Textures and images
- `/draco/` - DRACO mesh compression library

---

## React Three Fiber Coding Standards

This project is built with **React Three Fiber (R3F)**, a React renderer for Three.js. Follow these coding standards and patterns for consistency and maintainability.

### Component Structure Pattern

Every R3F component should follow this standard structure:

```javascript
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { MyShader } from '../shaders/MyShader.js';

function MyComponent({ position = [0, 0, 0], scale = 1, onClick }) {
  // 1. Refs - for accessing Three.js objects
  const meshRef = useRef();
  const groupRef = useRef();

  // 2. State - component state management
  const [isActive, setIsActive] = useState(false);

  // 3. Memoized values - expensive calculations
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: MyShader.vertexShader,
      fragmentShader: MyShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(MyShader.uniforms)
    });
  }, []);

  // 4. Effects - setup and cleanup
  useEffect(() => {
    // Setup code
    return () => {
      // Cleanup code (dispose geometries/materials)
    };
  }, []);

  // 5. Animation loop - runs every frame
  useFrame((state, delta) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y += delta;
    }
  });

  // 6. Event handlers
  const handleClick = (event) => {
    event.stopPropagation();
    setIsActive(!isActive);
    if (onClick) onClick(event);
  };

  // 7. Render JSX
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh ref={meshRef} onClick={handleClick}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

export default MyComponent;
```

### Coding Rules

#### 1. **No Console Logs**
- Remove all `console.log()` statements before committing
- Use them only for temporary debugging

#### 2. **Import Order**
Always follow this order:
```javascript
// 1. React imports
import React, { useRef, useState } from 'react';

// 2. R3F imports
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// 3. Three.js imports
import * as THREE from 'three';

// 4. Local imports (shaders from shaders/ folder)
import { MyShader } from '../shaders/MyShader.js';
```

#### 3. **Constants**
- Define constants at the top in UPPER_SNAKE_CASE
- Extract magic numbers

```javascript
const ANIMATION_SPEED = 0.5;
const SHADOW_CONFIG = {
  near: 0.1,
  far: 25,
  mapSize: 1024
};
```

#### 4. **Remove Unused Imports**
Always clean up unused imports before committing.

### Essential R3F Hooks

#### `useRef` - Accessing Three.js Objects
```javascript
const meshRef = useRef();

// Access in useFrame or effects
useFrame(() => {
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.01;
  }
});
```

#### `useFrame` - Animation Loop
Runs every frame (60 FPS ideally):
```javascript
useFrame((state, delta) => {
  // state: { clock, camera, scene, gl, ... }
  // delta: time since last frame in seconds

  if (!isAnimating) return; // Early return for optimization

  meshRef.current.rotation.y += delta * speed;
});
```

#### `useMemo` - Memoization
For expensive operations (materials, geometries):
```javascript
const material = useMemo(() => {
  return new THREE.ShaderMaterial({
    vertexShader: MyShader.vertexShader,
    fragmentShader: MyShader.fragmentShader,
    uniforms: THREE.UniformsUtils.clone(MyShader.uniforms)
  });
}, []); // Empty deps = create once
```

#### `useGLTF` - Loading 3D Models
```javascript
const gltf = useGLTF('/models/mymodel.glb');

// At bottom of file for preloading:
useGLTF.preload('/models/mymodel.glb');
```

#### `useAnimations` - Model Animations
```javascript
const { actions, mixer } = useAnimations(gltf.animations, groupRef);

useEffect(() => {
  if (actions && Object.keys(actions).length > 0) {
    const action = Object.values(actions)[0];
    action.play();
  }
}, [actions]);

useFrame((state, delta) => {
  if (mixer) mixer.update(delta);
});
```

### Loading & Rendering 3D Models

```javascript
function MyModel() {
  const groupRef = useRef();
  const gltf = useGLTF('/models/mymodel.glb');
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    // Configure model after loading
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Clone materials to avoid shared state
        if (Array.isArray(child.material)) {
          child.material = child.material.map(mat => mat.clone());
        } else {
          child.material = child.material.clone();
        }
      }
    });
  }, [gltf.scene]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={gltf.scene} scale={1} />
    </group>
  );
}

// Always preload models
useGLTF.preload('/models/mymodel.glb');

export default MyModel;
```

### Multiple Instances Pattern

When rendering multiple copies of the same model:

```javascript
import { Clone } from '@react-three/drei';

function SingleInstance({ position, rotation, autoTriggerDelay }) {
  const groupRef = useRef();
  const gltf = useGLTF('/models/mymodel.glb');

  // Instance-specific logic

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Clone object={gltf.scene} />
    </group>
  );
}

function MultipleInstances() {
  const positions = [
    { x: 0, z: 1.9 },
    { x: 0, z: -1.9 },
    { x: 1.9, z: 0 }
  ];

  return (
    <>
      {positions.map((pos, index) => (
        <SingleInstance
          key={index}
          position={[pos.x, 0, pos.z]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          autoTriggerDelay={2000 + index * 1000}
        />
      ))}
    </>
  );
}
```

### Animation Patterns

#### 1. Continuous Animation (useFrame)
```javascript
useFrame((state, delta) => {
  if (meshRef.current) {
    meshRef.current.rotation.y += delta * speed;
  }
});
```

#### 2. Triggered Animation Pattern
```javascript
const animationState = useRef({ isAnimating: false, progress: 0 });

useFrame((state, delta) => {
  if (!animationState.current.isAnimating) return;

  const speed = 2;
  animationState.current.progress += delta * speed;

  if (animationState.current.progress >= 1) {
    animationState.current.progress = 1;
    animationState.current.isAnimating = false;
  }

  // Apply animation
  const t = animationState.current.progress;
  meshRef.current.scale.setScalar(1 + t * 0.5);
});

const handleClick = () => {
  animationState.current.isAnimating = true;
  animationState.current.progress = 0;
};
```

#### 3. Auto-Trigger Animation
```javascript
useEffect(() => {
  if (!actions || Object.keys(actions).length === 0) return;

  let intervalId;

  const initialTimer = setTimeout(() => {
    playAnimation();

    intervalId = setInterval(() => {
      playAnimation();
    }, 5000); // Repeat every 5 seconds
  }, 2000); // Start after 2 seconds

  return () => {
    clearTimeout(initialTimer);
    if (intervalId) clearInterval(intervalId);
  };
}, [actions, playAnimation]);
```

### Shader Implementation

#### Shader File Structure
Create shader files in `src/`:

```javascript
// MyShader.js
export const MyShader = {
  uniforms: {
    color: { value: new THREE.Color(0xffffff) },
    time: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vec3 finalColor = color * (0.5 + 0.5 * vNormal.y);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
```

#### Using Shaders
```javascript
import { MyShader } from '../shaders/MyShader.js';

const material = useMemo(() => {
  return new THREE.ShaderMaterial({
    vertexShader: MyShader.vertexShader,
    fragmentShader: MyShader.fragmentShader,
    uniforms: THREE.UniformsUtils.clone(MyShader.uniforms)
  });
}, []);

// Update uniforms in useFrame
useFrame((state) => {
  if (material.uniforms.time) {
    material.uniforms.time.value = state.clock.elapsedTime;
  }
});
```

### Event Handling

Always use `event.stopPropagation()` to prevent event bubbling:

```javascript
const handleClick = (event) => {
  event.stopPropagation();
  // Your logic
};

return (
  <mesh onClick={handleClick}>
    {/* ... */}
  </mesh>
);
```

### Performance Best Practices

#### 1. Memoization
```javascript
// ✅ Good
const positions = useMemo(() => createPositions(), []);

// ❌ Avoid
const positions = createPositions(); // Recreated every render
```

#### 2. Early Returns in useFrame
```javascript
// ✅ Good
useFrame((state, delta) => {
  if (!isAnimating || !meshRef.current) return;
  // animation code
});

// ❌ Avoid
useFrame((state, delta) => {
  // Always runs
});
```

#### 3. Cleanup Resources
```javascript
// ✅ Good
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  return () => geometry.dispose();
}, []);

// ❌ Avoid - Memory leak!
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
}, []);
```

#### 4. Light Optimization
```javascript
// Use constants for repeated light configs
const DIRECTIONAL_LIGHT_POSITIONS = [
  [5, 10, 7.5],
  [-5, 10, 7.5],
  [5, 10, -7.5],
  [-5, 10, -7.5]
];

return (
  <>
    <ambientLight intensity={3} />
    {DIRECTIONAL_LIGHT_POSITIONS.map((pos, i) => (
      <directionalLight key={i} position={pos} intensity={1.3} castShadow />
    ))}
  </>
);
```

### Code Quality Checklist

Before committing:
- [ ] No `console.log()` statements
- [ ] Unused imports removed
- [ ] Components follow standard structure
- [ ] Memoization used appropriately
- [ ] Event handlers use `event.stopPropagation()`
- [ ] Models preloaded with `useGLTF.preload()`
- [ ] Cleanup in useEffect
- [ ] Constants extracted
- [ ] Build succeeds (`npm run build`)

---

## Entry Point
The entry point of the application is `main.jsx`. It renders the main `App` component which sets up the Canvas, scene, camera, and controls.

## Classes and Shaders
- **App.js**: Initializes the scene, camera, renderer, and controls. It also manages the animation loop and event listeners.
- **Train.js**: Loads and animates the train model.
- **Floor.js**: Creates the floor platform with a snow shader.
- **Lights.js**: Adds various lights to the scene.
- **Particles.js**: Creates snow particles using the `SnowParticleShader`.
- **ChristmasTree.js**: Creates an interactive Christmas tree with lights.
- **Text.js**: Displays festive text using the `TextShader`.
- **Skybox.js**: Creates a skybox with a gradient shader using the `SkyboxShader`.
- **SkyboxShader.js**: Defines the shader for the skybox gradient effect.
- **SnowShader.js**: Defines the shader for the snow effect on the floor.
- **SnowParticleShader.js**: Defines the shader for the snow particles.
- **GhibliShader.js**: Defines the shader for Ghibli-style effects.
- **ToonShader.js**: Defines the shader for cartoon-like effects.
- **TextShader.js**: Defines the shader for the festive text.

## Acknowledgments

### Snowflake Icon
- **Source**: [Osckar on Pixabay](https://creazilla.com/)
- **Published by**: Creazilla
- **License**: Public Domain (CC0). Free for editorial, educational, commercial, and/or personal projects. No attribution required. More info.

### Model Attributions
- **Train Model**: [Jotrain on Sketchfab](https://sketchfab.com/Jotrain) - Licensed under [Free Standard License](https://sketchfab.com/licenses/free)
- **Christmas Tree Model**: [Vicente Betoret Ferrero on Sketchfab](https://sketchfab.com/deathcow) - Licensed under [CC Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- **Low Poly Car Model**: [Arturs Vitas on Sketchfab](https://sketchfab.com/arturs.vitas) - Licensed under [CC Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- **Gift Model**: [KDSDevelopment on Sketchfab](https://sketchfab.com/KDSDevelopment) - Licensed under [CC Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- **Santa Model**: [Tomato Owl on Sketchfab](https://sketchfab.com/tomato_owl) - Licensed under [CC Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- **Snowman Model**: [Eric H on Sketchfab](https://sketchfab.com/244539) - Licensed under [CC Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)

### Music
- **"Happy Little Elves"** by Audionautix - Licensed under [CC Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) - [Artist Website](http://audionautix.com/)

### Shader Inspirations
- **Ghibli-Style Shader**: Inspired by [Takuya Matsuyama](https://github.com/craftzdog) - [GitHub Repository](https://github.com/craftzdog/ghibli-style-shader) - [YouTube Channel](https://www.youtube.com/@devaslife)
- **The Book of Shaders**: By Patricio Gonzalez Vivo and Jen Lowe - [The Book of Shaders](https://thebookofshaders.com/) - Copyright (c) Patricio Gonzalez Vivo, 2015 - [Patricio Gonzalez Vivo's Website](http://patriciogonzalezvivo.com/)
- **Three.js Journey Shader Lessons**: By Bruno Simon - [Three.js Journey](https://threejs-journey.com/)