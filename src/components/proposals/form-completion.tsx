/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormCompletionProps {
  titleCompletion: number;
  descriptionCompletion: number;
  categoryCompletion: number;
  totalCompletion: number;
  itemVariants: any;
}

export const FormCompletion = ({ 
  titleCompletion, 
  descriptionCompletion, 
  categoryCompletion, 
  totalCompletion,
  itemVariants 
}: FormCompletionProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-8 bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Form Completion</CardTitle>
          <CardDescription>
            Fill out the form below to create your proposal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-2 w-full rounded-full bg-muted mb-4">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-purple-600"
              initial={{ width: "0%" }}
              animate={{ width: `${totalCompletion}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>0%</div>
            <div>50%</div>
            <div>100%</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};