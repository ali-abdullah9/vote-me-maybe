/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAQItem } from "@/components/help/faq-item";
import { Search, MessageSquare, Github, Mail } from "lucide-react";

interface FAQTabProps {
  itemVariants: any;
  searchQuery: string;
  filteredFaqItems: any[];
}

export const FAQTab = ({ itemVariants, searchQuery, filteredFaqItems }: FAQTabProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          <CardDescription>
            Common questions about using VoteMeMaybe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchQuery && filteredFaqItems.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground">
                No FAQ items match "{searchQuery}". Try a different search term.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqItems.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  icon={item.icon}
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 p-4 bg-card/40 backdrop-blur-sm rounded-lg border border-border">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Still have questions?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              If you couldn't find the answer to your question, feel free to reach out to our community or support team.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="text-xs border-primary/20 hover:bg-primary/5">
                <Github className="mr-2 h-4 w-4" />
                GitHub Discussions
              </Button>
              <Button variant="outline" className="text-xs border-primary/20 hover:bg-primary/5">
                <MessageSquare className="mr-2 h-4 w-4" />
                Discord Community
              </Button>
              <Button variant="outline" className="text-xs border-primary/20 hover:bg-primary/5">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};