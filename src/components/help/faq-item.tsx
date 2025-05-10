"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export const FAQItem = ({ question, answer, icon }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-4">
      <motion.button
        className={cn(
          "w-full flex items-start gap-3 p-4 text-left rounded-lg transition-colors",
          isOpen ? "bg-primary/10 border-primary/20" : "bg-card/60 hover:bg-card/80",
          "border border-border"
        )}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mt-1 rounded-full bg-primary/10 p-2 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-base">{question}</h3>
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: isOpen ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{answer}</p>
          </motion.div>
        </div>
        <div className="text-muted-foreground ml-2 flex-shrink-0">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
};