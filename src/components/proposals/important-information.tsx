/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ImportantInformationProps {
  itemVariants: any;
}

export const ImportantInformation = ({ itemVariants }: ImportantInformationProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-amber-500/10 border border-amber-600/20 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <div>
                <h4 className="font-medium text-amber-500 text-sm">Please Note</h4>
                <ul className="mt-2 space-y-2 text-muted-foreground text-xs">
                  <li className="flex items-baseline">
                    <span className="mr-2 text-xs">•</span>
                    <span>Your proposal will be stored on the blockchain and cannot be modified after submission</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="mr-2 text-xs">•</span>
                    <span>There is a small gas fee for creating proposals</span>
                  </li>
                  <li className="flex items-baseline">
                    <span className="mr-2 text-xs">•</span>
                    <span>As the creator, you will be able to end the voting and determine the final status</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};