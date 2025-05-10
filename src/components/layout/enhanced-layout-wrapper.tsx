// src/components/layout/enhanced-layout-wrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SubtleBackground, GradientBackground, DotPatternBackground, SubtleGlow } from '@/components/ui/subtle-background';

export function EnhancedLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state to true when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render backgrounds on server to avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }
  
  // Determine which background to use based on route
  let Background = null;
  let additionalEffect = null;
  
  switch (pathname) {
    case '/':
      // Home page with gradient & glow
      Background = <GradientBackground 
                    primaryColor="#8854d0" 
                    secondaryColor="#3b82f6"
                    opacity={0.1} 
                   />;
      additionalEffect = <SubtleGlow position="top" color="#8854d0" size="lg" opacity={0.1} />;
      break;
      
    case '/proposals':
      // Proposals page with dot pattern & subtle glows
      Background = <DotPatternBackground />;
      additionalEffect = (
        <>
          <SubtleGlow position="top" color="#8854d0" size="sm" opacity={0.1} />
          <SubtleGlow position="bottom" color="#3b82f6" size="sm" opacity={0.05} />
        </>
      );
      break;
      
    case '/analytics':
      // Analytics page with very subtle particles
      Background = <SubtleBackground 
                     primaryColor="#8854d0" 
                     secondaryColor="#3b82f6" 
                     opacity={0.07}
                   />;
      break;
      
    case '/dashboard':
      // Dashboard with minimal particles
      Background = <SubtleBackground 
                     primaryColor="#8854d0" 
                     secondaryColor="#3b82f6" 
                     opacity={0.05}
                   />;
      break;
      
    case '/help':
      // Help page with clear background & top glow
      Background = <DotPatternBackground />;
      additionalEffect = <SubtleGlow position="top" color="#8854d0" size="md" opacity={0.1} />;
      break;
      
    default:
      // Default for all other routes - subtle particle connections
      if (pathname.startsWith('/proposals/')) {
        // For proposal details pages
        Background = <SubtleBackground
                       primaryColor="#8854d0" 
                       secondaryColor="#3b82f6" 
                       opacity={0.05}
                     />;
        additionalEffect = <SubtleGlow position="top" color="#8854d0" size="sm" opacity={0.08} />;
      } else {
        // For any other pages
        Background = <DotPatternBackground />;
      }
      break;
  }
  
  return (
    <>
      {Background}
      {additionalEffect}
      {children}
    </>
  );
}