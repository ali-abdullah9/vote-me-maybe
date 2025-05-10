/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCard } from "@/components/help/article-card";
import { BookOpen, FileText, Code, Users, Shield, BarChart2, Github, ExternalLink } from "lucide-react";

interface ResourcesTabProps {
  itemVariants: any;
}

export const ResourcesTab = ({ itemVariants }: ResourcesTabProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Resources & Documentation</CardTitle>
          <CardDescription>
            Explore guides, tutorials, and developer resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ArticleCard
              title="Blockchain Basics"
              description="Learn the fundamentals of blockchain technology and how it enables secure voting."
              href="#"
              icon={<BookOpen className="h-5 w-5 text-primary" />}
            />
            
            <ArticleCard
              title="Smart Contract Documentation"
              description="Technical details about the voting smart contracts powering VoteMeMaybe."
              href="#"
              icon={<FileText className="h-5 w-5 text-primary" />}
              isNew={true}
            />
            
            <ArticleCard
              title="API Reference"
              description="Documentation for developers who want to integrate with our platform."
              href="#"
              icon={<Code className="h-5 w-5 text-primary" />}
            />
            
            <ArticleCard
              title="Community Guidelines"
              description="Best practices for creating and participating in the VoteMeMaybe community."
              href="#"
              icon={<Users className="h-5 w-5 text-primary" />}
            />
            
            <ArticleCard
              title="Security Audits"
              description="Independent security audits of our smart contracts and platform."
              href="#"
              icon={<Shield className="h-5 w-5 text-primary" />}
            />
            
            <ArticleCard
              title="Governance Framework"
              description="Learn about the governance model that powers VoteMeMaybe."
              href="#"
              icon={<BarChart2 className="h-5 w-5 text-primary" />}
              isNew={true}
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">External Resources</h3>
            <div className="space-y-3">
              <a 
                href="https://ethereum.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40 transition-colors hover:bg-card/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                      <path fill="currentColor" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                      <path fill="currentColor" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                      <path fill="currentColor" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
                      <path fill="currentColor" d="M127.962 416.905v-104.72L0 236.585z"/>
                      <path fill="currentColor" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
                      <path fill="currentColor" d="M0 212.32l127.96 75.638v-133.8z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Ethereum.org</h4>
                    <p className="text-sm text-muted-foreground">Official resource for the Ethereum blockchain</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              
              <a 
                href="https://docs.soliditylang.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40 transition-colors hover:bg-card/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
                    <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 523 814" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M391.93 0L261.28 232.33H130.64L261.28 0H391.93Z"/>
                      <path fill="currentColor" d="M261.28 232.33H130.64L261.28 464.65L391.93 232.33H261.28Z"/>
                      <path fill="currentColor" d="M261.28 464.65L130.64 232.33H0L130.64 464.65L0 696.98H130.64L261.28 464.65Z"/>
                      <path fill="currentColor" d="M391.93 696.98H261.28L130.64 696.98H0L130.64 813.47H391.93L523 696.98L391.93 464.65L261.28 696.98H391.93Z"/>
                      <path fill="currentColor" d="M391.93 464.65L523 464.65V232.33L391.93 464.65Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Solidity Documentation</h4>
                    <p className="text-sm text-muted-foreground">Language used to write smart contracts</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              
              <a 
                href="https://github.com/yourusername/votememaybe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40 transition-colors hover:bg-card/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub Repository</h4>
                    <p className="text-sm text-muted-foreground">View source code and contribute to the project</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};