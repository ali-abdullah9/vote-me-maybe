// src/components/ui/particles-confetti.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

// Confetti component for celebrations
export function ConfettiEffect({ 
  active = false,
  duration = 3000,
  colors = ['#8884d8', '#4F46E5', '#10b981', '#3b82f6', '#ef4444']
}) {
  const [isActive, setIsActive] = useState(active);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    setIsActive(active);
    
    if (active) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.1}
        colors={colors}
        tweenDuration={duration}
      />
    </div>
  );
}

// TsParticles Background
export function ParticlesBackground({
  id = "tsparticles",
  color = "#8884d8",
  backgroundColor = "transparent",
  density = 80,
  speed = 1,
  linkOpacity = 0.5
}) {
  const [initialized, setInitialized] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    // Initialize the tsParticles instance
    await loadFull(engine);
    setInitialized(true);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Optional: Do something when the particles container is loaded
    console.log("Particles container loaded");
  }, []);

  // Adjust particle count for mobile devices
  const isMobile = typeof window !== 'undefined' 
    ? window.innerWidth < 768 
    : false;
  
  const particleCount = isMobile ? Math.floor(density / 2) : density;

  // Check if the user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Adjust settings for reduced motion preference
  const particleSpeed = prefersReducedMotion ? speed * 0.5 : speed;
  const particleOpacity = prefersReducedMotion ? 0.3 : 0.5;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" id={id}>
      <Particles
        id={id}
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: false,
          background: {
            color: {
              value: backgroundColor,
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: color,
            },
            links: {
              color: color,
              distance: 150,
              enable: true,
              opacity: linkOpacity,
              width: 1,
            },
            collisions: {
              enable: false,
            },
            move: {
              enable: true,
              random: false,
              speed: particleSpeed,
              direction: "none",
              outModes: {
                default: "out",
              },
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: particleCount,
            },
            opacity: {
              value: particleOpacity,
              random: true,
              anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.1,
                sync: false
              }
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
              random: true,
            },
          },
          detectRetina: true,
          responsive: [
            {
              maxWidth: 768,
              options: {
                particles: {
                  number: {
                    value: Math.floor(particleCount / 2),
                  },
                },
              },
            },
          ],
          interactivity: {
            events: {
              onHover: {
                enable: !prefersReducedMotion,
                mode: "grab",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
        }}
        className="w-full h-full"
      />
    </div>
  );
}

// Subtle network background with thin connecting lines
export function NetworkBackground({
  id = "network-particles",
  color = "#8884d8",
  backgroundColor = "transparent"
}) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-30" id={id}>
      <Particles
        id={id}
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            color: {
              value: backgroundColor,
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: color,
            },
            links: {
              color: color,
              distance: 200,
              enable: true,
              opacity: 0.3,
              width: 0.5,
            },
            move: {
              enable: true,
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1200,
              },
              value: 50,
            },
            opacity: {
              value: 0.4,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full"
      />
    </div>
  );
}

// Floating particles background (no connecting lines)
export function FloatingParticles({
  id = "floating-particles",
  color = "#8884d8",
  backgroundColor = "transparent",
  density = 40
}) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // Adjust settings based on device capability
  const isMobile = typeof window !== 'undefined' 
    ? window.innerWidth < 768 
    : false;
  
  const particleCount = isMobile ? Math.floor(density / 2) : density;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" id={id}>
      <Particles
        id={id}
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            color: {
              value: backgroundColor,
            },
          },
          fpsLimit: 30,
          particles: {
            color: {
              value: color,
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              random: true,
              speed: 0.8,
              direction: "none",
              outModes: {
                default: "bounce",
              },
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1000,
              },
              value: particleCount,
            },
            opacity: {
              value: 0.6,
              random: true,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 4 },
              random: true,
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full"
      />
    </div>
  );
}

// Custom voting confetti animation
export function VoteConfetti({ 
  active = false, 
  type = "approve" 
}) {
  const colors = type === "approve" 
    ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] // Green theme
    : ['#ef4444', '#f87171', '#fca5a5', '#fecaca']; // Red theme

  return <ConfettiEffect active={active} colors={colors} />;
}

// Special confetti for proposal completion
export function ProposalCompletedConfetti({
  active = false,
  status = "passed"
}) {
  const colors = status === "passed"
    ? ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'] // Blue theme
    : status === "rejected"
    ? ['#ef4444', '#f87171', '#fca5a5', '#fecaca'] // Red theme
    : ['#8884d8', '#4F46E5', '#10b981', '#3b82f6']; // Default theme

  return (
    <ConfettiEffect 
      active={active} 
      colors={colors} 
      duration={4000} 
    />
  );
}