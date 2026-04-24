"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";

// Build PM logo geometry from SVG shapes (viewBox 0 0 66 44, centered at origin)
// Transform: three.x = svg.x - 33,  three.y = 22 - svg.y
function buildPMGeometry(): THREE.BufferGeometry[] {
  const extrudeOpts: THREE.ExtrudeGeometryOptions = { depth: 6, bevelEnabled: false };

  const rect = (sx: number, sy: number, sw: number, sh: number) => {
    const s = new THREE.Shape();
    const x0 = sx - 33, x1 = sx + sw - 33;
    const y0 = 22 - sy, y1 = 22 - (sy + sh);
    s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0, y1);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, extrudeOpts);
  };

  const poly = (pts: [number, number][]) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0] - 33, 22 - pts[0][1]);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0] - 33, 22 - pts[i][1]);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, extrudeOpts);
  };

  return [
    rect(0, 0, 66, 5),        // top rail
    rect(0, 0, 5, 44),        // P left stem
    rect(0, 19, 26, 5),       // P bowl
    rect(21, 0, 5, 44),       // shared P-right / M-left stem
    rect(61, 0, 5, 44),       // M right stem
    poly([[26, 5], [31, 5], [46, 44], [41, 44]]),  // M left diagonal
    poly([[61, 5], [56, 5], [41, 44], [46, 44]]),  // M right diagonal
  ];
}

function CameraOrbit() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.y * 0.25 - target.current.x) * 0.04;
    target.current.y += (mouse.current.x * 0.25 - target.current.y) * 0.04;
    camera.position.y += (target.current.x * 8 - camera.position.y) * 0.05;
    camera.position.x += (target.current.y * -8 - camera.position.x) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function PMLogo() {
  const groupRef = useRef<THREE.Group>(null);
  const geometries = useMemo(() => buildPMGeometry(), []);

  useEffect(() => {
    if (!groupRef.current) return;
    const el = document.getElementById("logo3d-section");
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        if (groupRef.current) {
          groupRef.current.rotation.y = self.progress * Math.PI * 1.5;
          groupRef.current.rotation.x = Math.sin(self.progress * Math.PI) * 0.18;
        }
      },
    });

    return () => st.kill();
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y += (Math.sin(Date.now() * 0.0008) * 0.4 - groupRef.current.position.y) * 0.03;
    }
  });

  const mat = <meshStandardMaterial color="#f5f5f3" roughness={0.15} metalness={0.05} />;

  return (
    <group ref={groupRef} scale={[0.13, 0.13, 0.13]}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          {mat}
        </mesh>
      ))}
    </group>
  );
}

export default function Logo3D() {
  return (
    <section
      id="logo3d-section"
      className="relative"
      style={{ backgroundColor: "var(--dark)", height: "100vh" }}
      data-theme="dark"
    >
      <Canvas
        camera={{ position: [0, 0, 55], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-10, -5, -10]} intensity={0.3} />
        <PMLogo />
        <CameraOrbit />
      </Canvas>

      <div
        className="absolute bottom-16 left-0 right-0 flex justify-center"
        style={{ pointerEvents: "none" }}
      >
        <p
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--muted-on-dark)" }}
        >
          Pol Marsol Torras
        </p>
      </div>
    </section>
  );
}
