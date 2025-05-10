// src/components/ui/3d-background.tsx
'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  color?: string;
  particleColor?: string;
  particleCount?: number;
}

export function ThreeBackground({ 
  color = '#4F46E5', 
  particleColor = '#8884d8',
  particleCount = 300 
}: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: new THREE.Color(particleColor),
      transparent: true,
      opacity: 0.8,
    });
    
    const particlesPositions = new Float32Array(particleCount * 3);
    const particlesSpeeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlesPositions[i3] = (Math.random() - 0.5) * 50;
      particlesPositions[i3 + 1] = (Math.random() - 0.5) * 50;
      particlesPositions[i3 + 2] = (Math.random() - 0.5) * 50;
      
      particlesSpeeds[i] = Math.random() * 0.01;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the particles
      particles.rotation.x += 0.0003;
      particles.rotation.y += 0.0005;
      
      // Update particle positions
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= particlesSpeeds[i];
        
        // Reset particle position when it goes out of bounds
        if (positions[i3 + 1] < -25) {
          positions[i3 + 1] = 25;
        }
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      particles.geometry.dispose();
      (particles.material as THREE.PointsMaterial).dispose();
      renderer.dispose();
    };
  }, [color, particleColor, particleCount]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}