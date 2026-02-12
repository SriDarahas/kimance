"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

// City coordinates
const CITIES = {
  NewYork: { lat: 40.7128, lon: -74.0060, name: "New York" },
  London: { lat: 51.5074, lon: -0.1278, name: "London" },
  Lagos: { lat: 6.5244, lon: 3.3792, name: "Lagos" },
  Dubai: { lat: 25.2048, lon: 55.2708, name: "Dubai" },
  Mumbai: { lat: 19.0760, lon: 72.8777, name: "Mumbai" },
  Sydney: { lat: -33.8688, lon: 151.2093, name: "Sydney" },
  Singapore: { lat: 1.3521, lon: 103.8198, name: "Singapore" },
  Toronto: { lat: 43.6532, lon: -79.3832, name: "Toronto" },
  Kinshasa: { lat: -4.4419, lon: 15.2663, name: "Kinshasa" },
  SanFrancisco: { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
};

type CityType = typeof CITIES.NewYork;

// Connections representing money flow
const CONNECTIONS = [
  { from: CITIES.NewYork, to: CITIES.London },
  { from: CITIES.London, to: CITIES.Lagos },
  { from: CITIES.Dubai, to: CITIES.Mumbai },
  { from: CITIES.Sydney, to: CITIES.Singapore },
  { from: CITIES.Toronto, to: CITIES.Kinshasa },
  { from: CITIES.SanFrancisco, to: CITIES.Toronto },
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function ConnectionArc({ from, to }: { from: CityType; to: CityType }) {
  const startVec = latLonToVector3(from.lat, from.lon, 1.01);
  const endVec = latLonToVector3(to.lat, to.lon, 1.01);
  
  // Calculate arc height based on distance
  const distance = startVec.distanceTo(endVec);
  const arcHeight = 1 + distance * 0.3;
  
  // Control point for the arc
  const mid = startVec.clone().add(endVec).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
  
  const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
  const points = curve.getPoints(64);
  
  return (
    <Line
      points={points}
      color="#10b981"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

function CityMarker({ city }: { city: CityType }) {
  const pos = latLonToVector3(city.lat, city.lon, 1.02);
  
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Earth() {
  const earthTexture = useLoader(
    THREE.TextureLoader,
    "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg"
  );
  
  return (
    <Sphere args={[1, 64, 64]}>
      <meshStandardMaterial
        map={earthTexture}
        roughness={1}
        metalness={0}
      />
    </Sphere>
  );
}

function EarthFallback() {
  return (
    <Sphere args={[1, 32, 32]}>
      <meshBasicMaterial
        color="#1e3a5f"
        wireframe
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
}

function GlobeContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={<EarthFallback />}>
        <Earth />
      </Suspense>
      
      <mesh scale={[1.015, 1.015, 1.015]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {CONNECTIONS.map((conn, i) => (
        <ConnectionArc key={i} from={conn.from} to={conn.to} />
      ))}
      
      {Object.values(CITIES).map((city, i) => (
        <CityMarker key={i} city={city} />
      ))}
    </group>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas 
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <GlobeContent />
      </Canvas>
    </div>
  );
}
