"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Vote, FileText, HelpCircle } from "lucide-react";

// Import components
import { GettingStartedTab } from "@/components/help/getting-started-tab";
import { VotingGuideTab } from "@/components/help/voting-guide-tab";
import { ProposalsTab } from "@/components/help/proposals-tab";
import { FAQTab } from "@/components/help/faq-tab";
import { ResourcesTab } from "@/components/help/resources-tab";

// Import FAQ data
import { faqItems } from "@/components/help/faq-data";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("getting-started");
  
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
  
  if (!isClient) {
    return <div className="container mx-auto p-6">Loading help center...</div>;
  }
  
  // Filter FAQ items based on search query
  const filteredFaqItems = searchQuery
    ? faqItems.filter(
        item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
  
  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
      >
        <div>
          <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Help Center</h1>
          <p className="mb-4 md:mb-0 text-muted-foreground">
            Learn how to use VoteMeMaybe voting platform effectively
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/60 backdrop-blur-sm border-primary/10"
          />
        </div>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TabsList className="mb-6 bg-card/60 backdrop-blur-sm p-1 border border-primary/10">
            <TabsTrigger value="getting-started" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="voting" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
              <Vote className="h-4 w-4" />
              Voting Guide
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Creating Proposals
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TabsContent value="getting-started">
            <GettingStartedTab itemVariants={itemVariants} />
          </TabsContent>
          
          <TabsContent value="voting">
            <VotingGuideTab itemVariants={itemVariants} />
          </TabsContent>
          
          <TabsContent value="proposals">
            <ProposalsTab itemVariants={itemVariants} />
          </TabsContent>
          
          <TabsContent value="faq">
            <FAQTab 
              itemVariants={itemVariants} 
              searchQuery={searchQuery} 
              filteredFaqItems={filteredFaqItems} 
            />
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourcesTab itemVariants={itemVariants} />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}