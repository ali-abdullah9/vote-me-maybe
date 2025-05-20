// src/components/ui/animated-components.tsx
'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

// Animated container with fade-in and slide-up effect
import type { MotionProps } from 'framer-motion';

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  ...props
}: MotionProps & { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated text with character-by-character animation
export function AnimatedText({
  text,
  className,
  ...props
}: { text: string } & React.ComponentProps<typeof motion.h2>) {
  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.h2
      className={cn("flex items-center flex-wrap", className)}
      variants={container}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

// Animated button with hover and click effects
import type { ComponentPropsWithoutRef } from 'react';

export function AnimatedButton({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Animated card with hover effects
import type { HTMLMotionProps } from 'framer-motion';

export function AnimatedCard({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
      transition={{ duration: 0.2 }}
      className={cn("rounded-lg", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated badge with bounce effect
export function AnimatedBadge({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Section divider with animated line
export function AnimatedDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex py-5 items-center", className)}>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      <motion.div 
        className="flex-grow h-0.5 bg-primary"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
    </div>
  );
}

// Confetti animation for celebrations
export function AnimatedConfetti({ 
  active,
  duration = 3000
}: { 
  active: boolean;
  duration?: number;
}) {
  const [isActive, setIsActive] = React.useState(active);
  
  React.useEffect(() => {
    setIsActive(active);
    
    if (active) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* 
        Note: This is just a placeholder for the react-confetti component.
        In a real implementation, you would import and use the react-confetti component here.
      */}
      {/* <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} /> */}
    </div>
  );
}