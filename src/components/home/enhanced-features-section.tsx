/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/home/enhanced-features-section.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Lock, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EnhancedFeaturesSection() {
  // For section animation when it comes into view
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  // Feature cards data
  const features = [
    {
      icon: <Lock className="h-8 w-8 text-purple-500" />,
      title: "Secure",
      description: "Votes are cryptographically secured on the blockchain, preventing tampering and fraud.",
      gradient: "from-purple-500/20 to-purple-700/5"
    },
    {
      icon: <Layers className="h-8 w-8 text-blue-500" />,
      title: "Transparent",
      description: "All votes are publicly verifiable while maintaining voter privacy through advanced cryptography.",
      gradient: "from-blue-500/20 to-blue-700/5"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Decentralized",
      description: "No central authority controls the voting process, ensuring true democratic outcomes.",
      gradient: "from-green-500/20 to-green-700/5"
    }
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated dots */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#8854d0 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Gradient glow */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
          >
            Why use VoteMeMaybe?
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-3xl mx-auto text-lg text-gray-300/80"
          >
            Our platform leverages blockchain technology to ensure voting is secure, transparent, and immutable.
          </motion.p>
        </motion.div>

        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="relative"
            >
              <div className="relative group">
                {/* Card with hover effects */}
                <div 
                  className="relative p-8 h-full rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-700 hover:translate-y-[-5px]"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Icon with glowing effect */}
                  <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-800/70 overflow-hidden">
                    {feature.icon}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                  
                  {/* Subtle corner dots for decoration */}
                  <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-white/10"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-white/10"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-32 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-4 sm:mx-8 md:mx-16 lg:mx-32 rounded-3xl overflow-hidden"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600">
            {/* Animated subtle pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "60px 60px"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          
          {/* Inner container with glass effect */}
          <div className="relative z-10 px-8 py-16 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white"
              >
                Ready to start voting?
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-xl text-white/90 mb-8"
              >
                Connect your wallet and join our decentralized governance platform today.
              </motion.p>
              
              {/* CTA Button with animation */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100 hover:text-purple-800 text-lg px-8 py-6 h-auto font-medium rounded-xl shadow-lg"
                >
                  Connect Wallet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="mt-8 flex justify-center space-x-8"
              >
                <div className="flex items-center text-white/70 text-sm">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Secure Connection</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>No Transaction Fees</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}