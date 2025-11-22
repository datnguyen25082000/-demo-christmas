import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Santa({ onClick, onShowLoveText }) {
  const groupRef = useRef();
  const lightRef = useRef();
  const root2Ref = useRef();
  const root2OriginalPos = useRef(null);
  const root2TargetDirection = useRef(new THREE.Vector3());
  const gltf = useGLTF('/models/dudu/base.glb');
  const { actions, mixer } = useAnimations(gltf.animations, groupRef);

  const [isLit, setIsLit] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [root2AnimProgress, setRoot2AnimProgress] = useState(0);
  const [root2IsAnimating, setRoot2IsAnimating] = useState(false);

  // Apply colors to Santa model
  React.useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Ensure material exists and clone it
          if (!child.material) {
            child.material = new THREE.MeshStandardMaterial();
          } else if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => mat.clone());
          } else {
            child.material = child.material.clone();
          }

          const meshName = child.name.toLowerCase();
          const applyColor = (color) => {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.color = new THREE.Color(color);
                if (!mat.emissive) mat.emissive = new THREE.Color(0x000000);
              });
            } else {
              child.material.color = new THREE.Color(color);
              if (!child.material.emissive) {
                child.material.emissive = new THREE.Color(0x000000);
              }
            }
          };

          // Apply colors based on mesh names
          if (meshName === 'root000') {
            applyColor(0xfffafa); //
          } else if (meshName === 'root001') {
            applyColor(0x000000); // chân
          } else if (meshName === 'root01') {
            applyColor(0x000000); // mặt
          } else if (meshName === 'root02') {
            applyColor(0x000000); // mặt
          } else if (meshName === 'root2') {
            applyColor(0xf542a4); // dép
            // Store root2 reference and original position
            root2Ref.current = child;
            if (!root2OriginalPos.current) {
              root2OriginalPos.current = child.position.clone();
            }
          } else if (meshName === 'root03') {
            applyColor(0x000000); // mặt
          } else if (meshName === 'root3') {
            applyColor(0x000000); // tai
          } else if (meshName === 'root4') {
            applyColor(0x000000); // tai
          } else if (meshName === 'root5') {
            applyColor(0x000000); //
          } else if (meshName === 'root6') {
            applyColor(0x000000); //
          } else if (meshName === 'root10') {
            applyColor(0xfffafa); // thân
          } else if (meshName === 'root11') {
            applyColor(0x000000); //
          } else if (meshName === 'root12') {
            applyColor(0x000000); // nơ
          } else if (meshName === 'root13') {
            applyColor(0x000000); // nơ
          } else {
            // Default color - apply red for Santa
            applyColor(0xfffafa);
          }
        }
      });
    }
  }, [gltf]);

  React.useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const action = Object.values(actions)[0];
      if (action) {
        action.paused = true;
        action.loop = THREE.LoopOnce;
        action.clampWhenFinished = true;
      }
    }
  }, [actions]);

  const playAnimation = useCallback(() => {
    if (actions && Object.keys(actions).length > 0 && !isAnimating) {
      const action = Object.values(actions)[0];
      if (action && !action.isRunning()) {
        setIsAnimating(true);
        action.reset();
        action.paused = false;
        action.play();

        const onFinished = () => {
          action.paused = true;
          setIsAnimating(false);
          mixer.removeEventListener('finished', onFinished);
        };
        mixer.addEventListener('finished', onFinished);
      }
    }
  }, [actions, isAnimating, mixer]);

  // Auto-trigger animation at intervals
  React.useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    let intervalId;

    // Initial delay before starting the interval
    const initialTimer = setTimeout(() => {
      playAnimation();

      // Set up interval to repeat
      intervalId = setInterval(() => {
        playAnimation();
      }, 8000); // Trigger every 8 seconds
    }, 5000); // Start after 5 seconds

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [actions, playAnimation]);

  const lightUp = () => {
    setIsLit(true);

    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!child.material.emissive) {
            child.material.emissive = new THREE.Color(0x000000);
          }
          child.material.emissive.setHex(0x0000ff);
          child.material.emissiveIntensity = 2;
        }
      });
    }

    setTimeout(() => {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          if (child.isMesh && child.material && child.material.emissive) {
            child.material.emissive.setHex(0x000000);
            child.material.emissiveIntensity = 0;
          }
        });
      }
      setIsLit(false);
    }, 1000);
  };

  const triggerRoot2Animation = (camera) => {
    if (!root2IsAnimating && root2Ref.current) {
      // Calculate direction from root2 to camera (center of view)
      const root2WorldPos = new THREE.Vector3();
      root2Ref.current.getWorldPosition(root2WorldPos);

      const cameraPos = camera.position.clone();
      const direction = new THREE.Vector3().subVectors(cameraPos, root2WorldPos).normalize();

      root2TargetDirection.current = direction;
      setRoot2IsAnimating(true);
      setRoot2AnimProgress(0);
    }
  };

  const cameraRef = useRef(null);

  const handleClick = (event) => {
    event.stopPropagation();
    playAnimation();
    lightUp();
    if (cameraRef.current) {
      triggerRoot2Animation(cameraRef.current);
    }
    if (onClick) onClick(event);
  };

  useFrame((state, delta) => {
    // Store camera reference for click handler
    cameraRef.current = state.camera;

    if (mixer) mixer.update(delta);

    // Animate root2 mesh - move towards camera center (only when triggered)
    if (root2IsAnimating && root2Ref.current && root2OriginalPos.current) {
      const speed = 3; // Animation speed
      const maxDistance = 0.8; // Maximum distance to move towards camera

      // Update progress (0 to 2: 0-1 towards camera, 1-2 back to origin)
      const newProgress = root2AnimProgress + delta * speed;

      if (newProgress >= 2) {
        // Animation complete - reset to origin
        setRoot2AnimProgress(0);
        setRoot2IsAnimating(false);
        root2Ref.current.position.copy(root2OriginalPos.current);

        // Show "Merry Xmas" text via callback
        if (onShowLoveText) {
          onShowLoveText();
        }
      } else {
        setRoot2AnimProgress(newProgress);

        // Calculate position based on progress
        let easedProgress;
        if (newProgress <= 1) {
          // Towards camera phase (0 to 1)
          easedProgress = Math.sin((newProgress / 2) * Math.PI);
        }

        // Move in the direction towards camera
        const direction = root2TargetDirection.current;
        root2Ref.current.position.x =
          root2OriginalPos.current.x + direction.x * easedProgress * maxDistance;
        root2Ref.current.position.y =
          root2OriginalPos.current.y + direction.y * easedProgress * maxDistance;
        root2Ref.current.position.z =
          root2OriginalPos.current.z + direction.z * easedProgress * maxDistance;
      }
    }
  });

  return (
    <group ref={groupRef} position={[2, 0.1, 1.2]} scale={[12, 12, 12]}>
      <primitive object={gltf.scene} onClick={handleClick} />
      {isLit && (
        <pointLight
          ref={lightRef}
          color={0x0000ff}
          intensity={2}
          distance={50}
          position={[0, 5, 0]}
        />
      )}
    </group>
  );
}

export default Santa;

useGLTF.preload('/models/dudu/base.glb');
