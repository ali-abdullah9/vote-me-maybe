/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";

// Import components
import { FormCompletion } from "@/components/proposals/form-completion";
import { ProposalForm } from "@/components/proposals/proposal-form";
import { ProposalGuidelines } from "@/components/proposals/proposal-guidelines";
import { ImportantInformation } from "@/components/proposals/important-information";
import { WalletRequired } from "@/components/proposals/wallet-requied";

export default function EnhancedCreateProposalPage() {
  const router = useRouter();
  const { state } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isClient, setIsClient] = useState(false);
  
  // Form completion percentage
  const titleCompletion = title.trim().length > 0 ? 33.3 : 0;
  const descriptionCompletion = description.trim().length > 0 ? (
    description.trim().length < 50 ? 16.65 : 33.3
  ) : 0;
  const categoryCompletion = category !== "" ? 33.3 : 0;
  const totalCompletion = titleCompletion + descriptionCompletion + categoryCompletion;
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  // Check if wallet is connected
  if (isClient && !state.currentUser.isConnected) {
    return <WalletRequired />;
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <motion.div 
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/proposals")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Button>
      </motion.div>
      
      <motion.h1 
        className="mb-6 text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Create a New Proposal
      </motion.h1>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-2">
          <FormCompletion 
            titleCompletion={titleCompletion}
            descriptionCompletion={descriptionCompletion}
            categoryCompletion={categoryCompletion}
            totalCompletion={totalCompletion}
            itemVariants={itemVariants}
          />
          
          <ProposalForm itemVariants={itemVariants} />
        </div>
        
        {/* Right sidebar */}
        <div>
          <ProposalGuidelines itemVariants={itemVariants} />
          <ImportantInformation itemVariants={itemVariants} />
        </div>
      </motion.div>
    </div>
  );
}