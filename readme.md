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
- **src/**
  - **App.js**: Main application file that initializes the scene, camera, renderer, and controls.
  - **main.js**: Entry point of the application. It creates an instance of the `App` class.
  - **index.html**: HTML file that includes the canvas element for rendering the scene.
  - **style.css**: CSS file for styling the HTML elements.
  - **script.js**: Additional JavaScript file for any custom scripts. This is a quick stripped version of the project used for experimentation.
  - **Train.js**: Class for loading and animating the train model.
  - **Floor.js**: Class for creating the floor platform with a snow shader.
  - **Lights.js**: Class for adding lights to the scene.
  - **Particles.js**: Class for creating snow particles.
  - **ChristmasTree.js**: Class for creating the interactive Christmas tree.
  - **Text.js**: Class for displaying festive text.
  - **Skybox.js**: Class for creating the skybox with a gradient shader.
  - **SkyboxShader.js**: Shader for the skybox gradient effect.
  - **SnowShader.js**: Shader for the snow effect on the floor.
  - **SnowParticleShader.js**: Shader for the snow particles.
  - **GhibliShader.js**: Shader for Ghibli-style effects.
  - **ToonShader.js**: Shader for cartoon-like effects.
  - **TextShader.js**: Shader for the festive text.

## Entry Point
The entry point of the application is `main.js`. It creates an instance of the `App` class, which sets up the scene, camera, renderer, and controls.

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