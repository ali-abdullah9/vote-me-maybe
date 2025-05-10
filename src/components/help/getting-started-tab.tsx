/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepItem } from "@/components/help/step-item";
import { BookOpen, Info, Wallet, Search, ThumbsUp, FileText } from "lucide-react";

interface GetStartedTabProps {
  itemVariants: any;
}

export const GettingStartedTab = ({ itemVariants }: GetStartedTabProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Getting Started with VoteMeMaybe</CardTitle>
          <CardDescription>
            Learn the basics of using our decentralized voting platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-card/40 backdrop-blur-sm rounded-lg p-6 border border-border mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Welcome to VoteMeMaybe
            </h3>
            <p className="text-muted-foreground mb-4">
              VoteMeMaybe is a decentralized voting platform that allows communities to make 
              collective decisions in a transparent and secure way. This guide will help you 
              get started with the platform.
            </p>
            
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground">New to blockchain voting?</p>
                <p className="text-sm text-muted-foreground">
                  Check out our <Link href="#" className="text-primary hover:underline">Blockchain Basics</Link> guide before continuing.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 ml-4">
            <h3 className="text-lg font-medium mb-6">Follow these steps to get started:</h3>
            <StepItem
              number="1"
              title="Connect Your Wallet"
              description="To participate in voting or create proposals, you'll need to connect a blockchain wallet. Click the 'Connect Wallet' button in the header to begin."
              icon={<Wallet className="h-4 w-4 text-primary" />}
            />
            
            <StepItem
              number="2"
              title="Browse Proposals"
              description="Head to the Proposals page to see all active and past proposals. You can filter proposals by status and search for specific topics."
              icon={<Search className="h-4 w-4 text-primary" />}
            />
            
            <StepItem
              number="3"
              title="Cast Your Vote"
              description="Click on any proposal to view its details. If the proposal is active, you can cast your vote by clicking the 'Vote for this proposal' button."
              icon={<ThumbsUp className="h-4 w-4 text-primary" />}
            />
            
            <StepItem
              number="4"
              title="Create a Proposal"
              description="Have an idea for the community? Create a new proposal by clicking 'Create Proposal' on the Proposals page."
              icon={<FileText className="h-4 w-4 text-primary" />}
            />
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-primary/20 to-purple-600/20 p-6 rounded-lg border border-primary/10">
            <h3 className="text-lg font-medium mb-4">Ready to start?</h3>
            <p className="text-muted-foreground mb-4">
              Now that you understand the basics, try connecting your wallet and exploring the platform.
            </p>
            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                Connect Wallet
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/proposals">Browse Proposals</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};