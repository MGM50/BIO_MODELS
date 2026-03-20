import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial, Sparkles, Points, PointMaterial, Float as FloatDrei } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function CytoplasmicStreaming({ isLight }: { isLight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;
  
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
    const scrollY = window.scrollY;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const s = step[i];
      // Fluid motion
      positions[i3] += Math.sin(time * 0.2 + s * 10) * 0.01;
      positions[i3 + 1] += Math.cos(time * 0.3 + s * 10) * 0.01;
      
      // Scroll reaction
      positions[i3 + 1] -= scrollY * 0.00001;
      
      // Reset if out of bounds
      if (positions[i3 + 1] < -20) positions[i3 + 1] = 20;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
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
        position: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 10 - 5
        ],
        scale: Math.random() * 1.2 + 0.4,
        speed: Math.random() * 0.15 + 0.05,
        distort: Math.random() * 0.3 + 0.1,
        color: i % 2 === 0 ? (isLight ? "#10b981" : "#00ffcc") : (isLight ? "#6366f1" : "#3b82f6")
      });
    }
    return temp;
  }, [isLight]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const scrollY = window.scrollY;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollY * 0.001, 0.05);
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <FloatDrei key={i} speed={item.speed} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh position={item.position as any} scale={item.scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial 
              color={item.color} 
              distort={item.distort} 
              speed={1} 
              roughness={0.2}
              metalness={0.8}
              transparent 
              opacity={isLight ? 0.03 : 0.08}
              emissive={item.color}
              emissiveIntensity={isLight ? 0.05 : 0.2}
            />
          </mesh>
        </FloatDrei>
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

export default function ThreeBackground({ theme }: { theme: 'dark' | 'light' }) {
  const isLight = theme === 'light';
  
  return (
    <div className="fixed inset-0 -z-10 transition-colors duration-1000 pointer-events-none">
      {/* Enhanced Background Gradient Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none ${
        isLight 
          ? 'bg-gradient-to-b from-bg/60 via-bg/20 to-bg/60' 
          : 'bg-gradient-to-b from-bg/80 via-bg/40 to-bg/80'
      }`} />
      
      <Canvas 
        dpr={[1, 1.5]} 
        gl={{ 
          antialias: true, 
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
          count={isLight ? 30 : 80} 
          scale={35} 
          size={1.2} 
          speed={0.1} 
          opacity={isLight ? 0.05 : 0.2} 
          color={isLight ? "#10b981" : "#ffffff"} 
        />
        
        <Environment preset={isLight ? "warehouse" : "night"} />

        <EffectComposer multisampling={4}>
          <Bloom 
            luminanceThreshold={isLight ? 0.98 : 0.4} 
            mipmapBlur 
            intensity={isLight ? 0.05 : 0.5} 
            radius={0.4} 
          />
          <DepthOfField 
            focusDistance={0} 
            focalLength={0.02} 
            bokehScale={isLight ? 1 : 3} 
            height={480} 
          />
          <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
          <Vignette eskil={false} offset={0.2} darkness={isLight ? 0.4 : 0.8} />
          <Noise opacity={isLight ? 0.01 : 0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}


