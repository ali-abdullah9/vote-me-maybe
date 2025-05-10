// src/components/ui/subtle-background.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

export function SubtleBackground({
  id = "subtle-particles",
  primaryColor = "#8854d0", // Purple matching your theme
  secondaryColor = "#3b82f6", // Subtle blue accent
  backgroundColor = "transparent",
  opacity = 0.2 // Very low opacity to be subtle
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Check if the device is low-powered or mobile
  const [isLowPower, setIsLowPower] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Simple detection for mobile or low-power devices
    const isLowPowerDevice = 
      typeof window !== 'undefined' && 
      (window.innerWidth < 768 || // Mobile
       window.navigator.hardwareConcurrency <= 4); // Low CPU cores
       
    setIsLowPower(isLowPowerDevice);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // Don't render on server
  if (!isMounted) return null;
  
  // Configuration optimized for dark theme UI
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
          fpsLimit: isLowPower ? 30 : 60,
          particles: {
            color: {
              value: [primaryColor, secondaryColor],
            },
            links: {
              color: primaryColor,
              distance: 150,
              enable: true,
              opacity: opacity,
              width: 0.5,
            },
            move: {
              enable: true,
              random: false,
              speed: isLowPower ? 0.3 : 0.5,
              direction: "none",
              outModes: {
                default: "out",
              },
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1200,
              },
              value: isLowPower ? 20 : 40, // Fewer particles for mobile
            },
            opacity: {
              value: opacity, // Very subtle
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 2 },
              random: true,
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.05,
                opacity: 0.5
              }
            }
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: !isLowPower, // Disable on mobile/low-power
                mode: "grab",
              },
              onClick: {
                enable: !isLowPower,
                mode: "push",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.3,
                },
              },
              push: {
                quantity: 4,
              },
            },
          },
        }}
        className="w-full h-full"
      />
    </div>
  );
}

// This version has a gradient background with particles
export function GradientBackground({
  id = "gradient-bg",
  primaryColor = "#8854d0", // Purple matching your theme
  secondaryColor = "#3b82f6", // Blue accent
  particleColor = "#ffffff", // White particles
  opacity = 0.15 // Very low opacity
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // Don't render on server
  if (!isMounted) return null;
  
  return (
    <>
      {/* Gradient background */}
      <div 
        className="fixed inset-0 -z-20 pointer-events-none opacity-40" 
        style={{
          background: `radial-gradient(circle at top right, ${primaryColor}10, transparent 70%), 
                      radial-gradient(circle at bottom left, ${secondaryColor}10, transparent 70%)`
        }}
      />
      
      {/* Particles overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none" id={id}>
        <Particles
          id={id}
          init={particlesInit}
          options={{
            fullScreen: false,
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 30,
            particles: {
              color: {
                value: particleColor,
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                random: true,
                speed: 0.3,
                direction: "none",
                outModes: {
                  default: "out",
                },
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 1500,
                },
                value: 30,
              },
              opacity: {
                value: opacity,
                random: true,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 0.5, max: 2 },
                random: true,
              },
              twinkle: {
                particles: {
                  enable: true,
                  frequency: 0.02,
                  opacity: 0.3
                }
              }
            },
            detectRetina: true,
          }}
          className="w-full h-full"
        />
      </div>
    </>
  );
}

// Extremely subtle dot pattern background
export function DotPatternBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none opacity-[0.05]" 
      style={{
        backgroundImage: `radial-gradient(#8854d0 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }}
    />
  );
}

// Subtle glow effect for the header/important sections
export function SubtleGlow({
  position = "top",
  color = "#8854d0", // Purple matching your theme
  size = "md", // "sm" | "md" | "lg"
  opacity = 0.15
}) {
  const sizeMap = {
    sm: "20vh",
    md: "30vh",
    lg: "40vh"
  };
  
  const heightValue = sizeMap[size as keyof typeof sizeMap] || "30vh";
  
  const positionStyles = {
    top: {
      top: 0,
      left: 0,
      right: 0,
      height: heightValue
    },
    bottom: {
      bottom: 0,
      left: 0,
      right: 0,
      height: heightValue
    },
    left: {
      top: 0,
      bottom: 0,
      left: 0,
      width: heightValue
    },
    right: {
      top: 0,
      bottom: 0,
      right: 0,
      width: heightValue
    }
  };
  
  const style = positionStyles[position as keyof typeof positionStyles] || positionStyles.top;
  
  return (
    <div 
      className="fixed -z-10 pointer-events-none"
      style={{
        ...style,
        background: position === "top" || position === "bottom"
          ? `radial-gradient(ellipse at ${position} center, ${color}, transparent)`
          : `radial-gradient(ellipse at center ${position}, ${color}, transparent)`,
        opacity
      }}
    />
  );
}