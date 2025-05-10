/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/page.tsx (updated)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThreeBackground } from "@/components/ui/3d-background";
import { EnhancedFeaturesSection } from '@/components/home/enhanced-features-section';
import { motion } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* 3D Background */}
      <ThreeBackground />
      
      <div className="container mx-auto px-4 pb-16">
        {/* Hero section */}
        <section className="py-20 text-center relative z-10">
          <div className="mx-auto max-w-3xl">
            <motion.h1 
              className="mb-6 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent md:text-6xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              VoteMeMaybe
            </motion.h1>
            
            <motion.p
              className="mb-10 text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              A secure blockchain-based voting platform for transparent and tamper-proof decision making.
            </motion.p>
            
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Link href="/proposals">
                <Button 
                  size="lg" 
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-lg flex items-center"
                >
                  View Proposals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/create">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 px-8 border-purple-500/30 hover:bg-purple-500/10 text-white"
                >
                  Create Proposal
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features section */}
        <EnhancedFeaturesSection />

        {/* How it works section (optional) */}
        <section className="py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="mb-4 text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.h2>
            <motion.p 
              className="text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our blockchain-based voting system is simple to use yet powerful and secure.
            </motion.p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                description: "Securely connect your blockchain wallet to verify your identity."
              },
              {
                step: "02",
                title: "Browse Proposals",
                description: "View active proposals or create your own for the community."
              },
              {
                step: "03",
                title: "Cast Your Vote",
                description: "Vote securely and transparently on the blockchain."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}