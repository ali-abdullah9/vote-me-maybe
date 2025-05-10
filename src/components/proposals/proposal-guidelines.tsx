/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, InfoIcon } from "lucide-react";

interface ProposalGuidelinesProps {
  itemVariants: any;
}

export const ProposalGuidelines = ({ itemVariants }: ProposalGuidelinesProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-6 bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Proposal Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Set clear expectations</p>
                <p className="text-xs text-muted-foreground">
                  Provide a descriptive title and detailed explanation of what you&apos;re proposing.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <AlertTriangle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Consider implications</p>
                <p className="text-xs text-muted-foreground">
                  Explain potential benefits and address possible concerns or objections.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <InfoIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Be specific and actionable</p>
                <p className="text-xs text-muted-foreground">
                  Provide concrete details rather than vague suggestions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};