/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle } from "lucide-react";

interface ProposalsTabProps {
  itemVariants: any;
}

export const ProposalsTab = ({ itemVariants }: ProposalsTabProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Creating Proposals</CardTitle>
          <CardDescription>
            How to create effective proposals that get approved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Proposal Creation Guide
            </h3>
            <p className="text-muted-foreground mb-6">
              Creating a well-structured proposal is key to getting community support. 
              Follow these guidelines to craft effective proposals.
            </p>
            
            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-6 border border-border mb-6">
              <h4 className="text-lg font-medium mb-4">Before You Start</h4>
              <p className="text-muted-foreground mb-3">
                Before creating a proposal, make sure you:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Have a clear objective you want to achieve</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Understand the impact your proposal will have on the community</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Have researched similar proposals to avoid duplication</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Have connected your wallet and have enough funds for gas fees</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Creating an Effective Proposal</h4>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">1</span>
                    <span className="text-muted-foreground">Click "Create Proposal" on the Proposals page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">2</span>
                    <span className="text-muted-foreground">Choose a clear, concise title that summarizes your proposal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">3</span>
                    <div className="text-muted-foreground">
                      Write a detailed description that includes:
                      <ul className="ml-6 mt-2 space-y-1 list-disc">
                        <li>The problem you're trying to solve</li>
                        <li>Your proposed solution</li>
                        <li>Expected benefits and potential challenges</li>
                        <li>Implementation details, if relevant</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">4</span>
                    <span className="text-muted-foreground">Review your proposal for clarity and completeness</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">5</span>
                    <span className="text-muted-foreground">Submit your proposal to the blockchain</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Tips for Success</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-primary mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Keep your title under 10 words for better readability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-primary mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Use bullet points and clear paragraphs in your description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-primary mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Consider discussing your proposal idea in the community before formal submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-primary mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Be specific about what you're proposing, avoid vague language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-primary mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-muted-foreground">Address potential concerns proactively in your proposal</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-4">After Submission</h4>
              <div className="p-4 bg-card/40 backdrop-blur-sm rounded-lg border border-border">
                <p className="text-muted-foreground">
                  Once your proposal is submitted, it cannot be modified. The proposal will initially be in "Pending" status, and will move to "Active" once voting begins. You can track the progress of your proposal on your Dashboard and share it with others to gather support.
                </p>
                
                <div className="mt-4">
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" asChild>
                    <Link href="/create">Create a Proposal</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};