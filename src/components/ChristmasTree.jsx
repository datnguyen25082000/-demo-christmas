import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GhibliShader } from "../GhibliShader.js";
import { createToonShader } from "../ToonShader.js";
import { StarShader } from "../StarShader.js";

function ChristmasTree({ onClick }) {
  const groupRef = useRef();
  const gltf = useGLTF("/models/christmas-tree/christmas_tree_2.glb");
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  const [isAnimating, setIsAnimating] = useState(false);
  const [treeHeight, setTreeHeight] = useState(0);

  const treeShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: GhibliShader.vertexShader,
      fragmentShader: GhibliShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(GhibliShader.uniforms),
    });
  }, []);

  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: StarShader.vertexShader,
      fragmentShader: StarShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(StarShader.uniforms),
    });
  }, []);

  useEffect(() => {
    // Apply shaders to tree
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === "model_default_0") {
          child.material = treeShaderMaterial;
        } else if (child.name.startsWith("Sphere")) {
          const toonShader = createToonShader();
          const decorationShaderMaterial = new THREE.ShaderMaterial({
            vertexShader: toonShader.vertexShader,
            fragmentShader: toonShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone(toonShader.uniforms),
          });
          child.material = decorationShaderMaterial;
        }
      }
    });

    // Calculate tree height
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const height = box.max.y - box.min.y;
    setTreeHeight(height);
  }, [gltf.scene, treeShaderMaterial]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const action = Object.values(actions)[0];
      if (action) {
        action.paused = true;
      }
    }
  }, [actions]);

  const toggleAnimation = () => {
    setIsAnimating((prev) => {
      const newState = !prev;

      if (actions && Object.keys(actions).length > 0) {
        const action = Object.values(actions)[0];
        if (action) {
          action.paused = !newState;
          if (newState) {
            action.play();
          }
        }
      }

      return newState;
    });
  };

  // Auto-trigger animation on start - auto click after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auto-starting animation after 2 seconds...");

      // Start animation
      setIsAnimating(true);
      const action = Object.values(actions)[0];
      if (action) {
        action.paused = false;
        action.play();
        console.log("Animation started automatically");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [actions]);

  const handleClick = (event) => {
    event.stopPropagation();
    toggleAnimation();
    if (onClick) onClick(event);
  };

  useFrame((state, delta) => {
    if (mixer && isAnimating) mixer.update(delta);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={gltf.scene} scale={1} onClick={handleClick} />

      {/* Star on top of the tree */}
      <mesh material={starMaterial} position={[0, treeHeight + 0.1, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
      </mesh>
    </group>
  );
}

export default ChristmasTree;

useGLTF.preload("/models/christmas-tree/christmas_tree_2.glb");
