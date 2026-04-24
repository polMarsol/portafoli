"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "@/lib/gsap";

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
    target.current.x += (mouse.current.y * 0.5 - target.current.x) * 0.05;
    target.current.y += (mouse.current.x * 0.5 - target.current.y) * 0.05;
    const r = 6;
    const phi = Math.PI / 2 - target.current.x;
    const theta = target.current.y + Math.PI;
    camera.position.x = r * Math.sin(phi) * Math.cos(theta);
    camera.position.y = r * Math.cos(phi);
    camera.position.z = r * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface SpheresProps {
  onComplete: () => void;
}

function Spheres({ onComplete }: SpheresProps) {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!mesh1.current || !mesh2.current) return;

    const tl = gsap.timeline();

    // Entry: spheres rise from below
    tl.to(mesh1.current.position, { y: 0.22, duration: 2.2, ease: "power4.out" }, 0.4);
    tl.to(mesh2.current.position, { y: -0.22, duration: 2.2, ease: "power4.out" }, 0.4);

    // Hold, then exit
    tl.to(mesh1.current.position, { y: -10, duration: 1.1, ease: "power4.in" }, "+=1.2");
    tl.to(mesh2.current.position, { y: -10, duration: 1.1, ease: "power4.in" }, "<+=0.07");

    // Trigger hero text animation as spheres start leaving
    tl.add(() => {
      gsap.to(".split-char", {
        y: "0%",
        duration: 1.7,
        ease: "power4.inOut",
        stagger: { each: 0.025, from: "center" },
      });
      gsap.to(".hero-fade", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.6,
      });
    }, "-=0.9");

    tl.add(() => {
      if (!done.current) {
        done.current = true;
        onComplete();
      }
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <>
      <mesh ref={mesh1} position={[0, -8, 0]}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshStandardMaterial color="#0c0c0b" transparent opacity={0.88} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh ref={mesh2} position={[0, -8, 0]}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshStandardMaterial color="#0c0c0b" transparent opacity={0.88} roughness={0.3} metalness={0.1} />
      </mesh>
    </>
  );
}

interface Loader3DProps {
  onComplete: () => void;
}

export default function Loader3D({ onComplete }: Loader3DProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    // Fade out loader backdrop, then unmount
    gsap.to(wrapperRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete,
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-50"
      style={{ backgroundColor: "var(--light)" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        <Spheres onComplete={handleComplete} />
        <CameraOrbit />
      </Canvas>
    </div>
  );
}
