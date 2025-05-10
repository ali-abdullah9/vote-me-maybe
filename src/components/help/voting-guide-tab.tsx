/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote, CheckCircle, AlertTriangle } from "lucide-react";

interface VotingGuideTabProps {
  itemVariants: any;
}

export const VotingGuideTab = ({ itemVariants }: VotingGuideTabProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Voting Guide</CardTitle>
          <CardDescription>
            Understanding the voting process on VoteMeMaybe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              How Voting Works
            </h3>
            <p className="text-muted-foreground mb-6">
              Voting on VoteMeMaybe is designed to be simple, transparent, and secure. 
              Each proposal goes through several stages before a final decision is reached.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card/40 backdrop-blur-sm rounded-lg p-6 border border-border">
                <h4 className="text-lg font-medium mb-4">Proposal Statuses</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span>
                    <div>
                      <strong>Pending:</strong>
                      <p className="text-sm text-muted-foreground">
                        The proposal has been created but voting has not yet started.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                    <div>
                      <strong>Active:</strong>
                      <p className="text-sm text-muted-foreground">
                        Voting is currently open for this proposal.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
                    <div>
                      <strong>Passed:</strong>
                      <p className="text-sm text-muted-foreground">
                        The proposal has received enough votes to pass.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
                    <div>
                      <strong>Rejected:</strong>
                      <p className="text-sm text-muted-foreground">
                        The proposal did not receive enough votes to pass.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/40 backdrop-blur-sm rounded-lg p-6 border border-border">
                <h4 className="text-lg font-medium mb-4">Voting Rules</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Each wallet address can vote only once per proposal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Votes cannot be changed once cast.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Voting power is equal for all participants (one wallet, one vote).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Proposals typically pass with a simple majority (over 50% approval).</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">How to Vote</h4>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">1</span>
                    <span className="text-muted-foreground">Connect your wallet by clicking "Connect Wallet" in the header.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">2</span>
                    <span className="text-muted-foreground">Navigate to the <Link href="/proposals" className="text-primary hover:underline">Proposals</Link> page.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">3</span>
                    <span className="text-muted-foreground">Click on an active proposal to view its details.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">4</span>
                    <span className="text-muted-foreground">Click the "Vote" button and select "Approve" or "Reject".</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">5</span>
                    <span className="text-muted-foreground">Confirm the transaction in your wallet.</span>
                  </li>
                </ol>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-600/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-500">Important Note</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Once your vote is recorded on the blockchain, it cannot be changed. 
                      Make sure to review the proposal thoroughly before voting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};