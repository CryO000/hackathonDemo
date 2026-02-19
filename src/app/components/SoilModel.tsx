import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const SoilBlock = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Create a layered look for soil
  return (
    <group>
      {/* Top Grass Layer */}
      <mesh position={[0, 1.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>
      
      {/* Main Soil Layer */}
      <mesh ref={meshRef} position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>

      {/* Deep Soil / Rock Layer */}
      <mesh position={[0, -1.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.4, 3]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>

       {/* Particles/Details (simulated rocks/nutrients) */}
       {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.random() * 2 - 1, Math.random() - 0.5, Math.random() * 2 - 1]}>
           <sphereGeometry args={[0.1, 8, 8]} />
           <meshStandardMaterial color="#a1887f" />
        </mesh>
      ))}

    </group>
  );
};

export const SoilModel = () => {
  return (
    <div className="h-[300px] w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <SoilBlock />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
