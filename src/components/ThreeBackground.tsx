import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, MeshDistortMaterial, Sparkles, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function CytoplasmicStreaming({ isLight }: { isLight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000; // Reduced from 2000
  
  const [positions, step] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const stp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      stp[i] = Math.random();
    }
    return [pos, stp];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Only rotate for movement, avoid heavy per-point CPU updates
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.z = time * 0.02;
    pointsRef.current.position.y = Math.sin(time * 0.1) * 0.5;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={isLight ? "#10b981" : "#00ffcc"}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isLight ? 0.1 : 0.3}
      />
    </Points>
  );
}

function Organelles({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const items = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 12; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 10 - 5
        ),
        scale: Math.random() * 1.2 + 0.4,
        speed: Math.random() * 0.15 + 0.05,
        offset: Math.random() * 100,
        distort: Math.random() * 0.3 + 0.1,
        color: i % 2 === 0 ? (isLight ? "#10b981" : "#00ffcc") : (isLight ? "#6366f1" : "#3b82f6")
      });
    }
    return temp;
  }, [isLight]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    
    // Smooth scroll position
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollY * 0.001, 0.05);
    
    // Manual float animation for children
    groupRef.current.children.forEach((child, i) => {
      const item = items[i];
      if (item) {
        child.position.y = item.position.y + Math.sin(time * item.speed + item.offset) * 0.5;
        child.rotation.x = time * item.speed * 0.2;
        child.rotation.y = time * item.speed * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh key={i} position={item.position} scale={item.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <MeshDistortMaterial 
            color={item.color} 
            distort={item.distort} 
            speed={1} 
            roughness={0.4}
            metalness={0.2}
            transparent 
            opacity={isLight ? 0.03 : 0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  
  useFrame(() => {
    const scrollY = window.scrollY;
    camera.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.5, 20 - scrollY * 0.0001), 0.05);
    camera.lookAt(0, -scrollY * 0.0005, 0);
  });
  return null;
}

export default function ThreeBackground({ theme, paused }: { theme: 'dark' | 'light', paused?: boolean }) {
  const isLight = theme === 'light';
  
  if (paused) return null;

  return (
    <div className="fixed inset-0 -z-10 transition-colors duration-1000 pointer-events-none">
      {/* Enhanced Background Gradient Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none ${
        isLight 
          ? 'bg-gradient-to-b from-bg/60 via-bg/20 to-bg/60' 
          : 'bg-gradient-to-b from-bg/80 via-bg/40 to-bg/80'
      }`} />
      
      <Canvas 
        dpr={1} 
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: true
        }}
        camera={{ fov: 45 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <Rig />
        
        <ambientLight intensity={isLight ? 1.5 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={isLight ? 1 : 2} color={isLight ? "#10b981" : "#00ffcc"} />
        
        <CytoplasmicStreaming isLight={isLight} />
        <Organelles isLight={isLight} />
        
        <Sparkles 
          count={isLight ? 20 : 40} 
          scale={35} 
          size={1.2} 
          speed={0.1} 
          opacity={isLight ? 0.05 : 0.2} 
          color={isLight ? "#10b981" : "#ffffff"} 
        />
        
        <Environment preset={isLight ? "warehouse" : "night"} />

        <EffectComposer multisampling={0}>
          <Bloom 
            luminanceThreshold={isLight ? 0.98 : 0.6} 
            mipmapBlur 
            intensity={isLight ? 0.05 : 0.4} 
            radius={0.4} 
          />
          <Vignette eskil={false} offset={0.2} darkness={isLight ? 0.4 : 0.8} />
          <Noise opacity={isLight ? 0.01 : 0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}


