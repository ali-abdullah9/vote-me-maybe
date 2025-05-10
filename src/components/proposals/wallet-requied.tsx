"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const WalletRequired = () => {
  const router = useRouter();
  
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg bg-card/60 backdrop-blur-sm border-primary/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Connect Wallet Required
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-8">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-6 text-center">
              You need to connect your wallet to create a proposal.
            </p>
            <Button 
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};