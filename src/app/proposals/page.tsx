/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/proposals/page.tsx (updated)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, AlertTriangle, Filter, RefreshCw } from "lucide-react";
import { EnhancedProposalCard } from "@/components/proposals/enhanced-proposal-card";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedContainer } from "@/components/ui/animated-components";
import { ParticlesBackground } from "@/components/ui/particles-confetti";

export default function ProposalsPage() {
  const router = useRouter();
  const { proposals, votes, voteOnProposal, refreshData, isLoading } = useAppContext();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isVoting, setIsVoting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force a refresh of data when the component mounts
  useEffect(() => {
    console.log("Proposals page mounted, refreshing data...");
    const loadData = async () => {
      try {
        await refreshData();
        console.log("Data refreshed, proposals:", proposals);
        setInitialLoaded(true);
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    };
    
    loadData();
  }, [refreshData]);
  
  useEffect(() => {
    if (initialLoaded) {
      console.log("Proposals after data loaded:", proposals);
    }
  }, [proposals, initialLoaded]);

  // Filter proposals by tab and search query
  const getFilteredProposals = () => {
    let filtered = [...proposals];
    
    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(p => p.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => p.title.toLowerCase().includes(query) || 
             p.description.toLowerCase().includes(query)
      );
    }
    
    // Sort proposals
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "mostVotes":
        filtered.sort((a, b) => b.totalVotes - a.totalVotes);
        break;
      case "highestApproval":
        filtered.sort((a, b) => {
          const aRate = a.totalVotes > 0 ? (a.approveCount / a.totalVotes) : 0;
          const bRate = b.totalVotes > 0 ? (b.approveCount / b.totalVotes) : 0;
          return bRate - aRate;
        });
        break;
    }
    
    return filtered;
  };
  
  const filteredProposals = getFilteredProposals();
  
  const handleVote = async (id: string | number, voteType: "approve" | "reject") => {
    try {
      setIsVoting(true);
      await voteOnProposal(String(id), voteType);
      toast({
        title: "Vote submitted",
        description: `Your vote to ${voteType} has been recorded.`,
      });
      // Refresh data after voting
      await refreshData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error voting",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast({
        title: "Data refreshed",
        description: "The proposals list has been updated with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <>
      {/* Subtle background animation for proposals page */}
      <ParticlesBackground color="#8884d8" />
      
      <div className="container mx-auto p-6">
        <AnimatedContainer className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <AnimatedText text="Proposals" className="text-3xl font-bold" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => router.push("/create")} 
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Proposal
            </Button>
          </motion.div>
        </AnimatedContainer>
        
        {/* Search and Filter */}
        <AnimatedContainer 
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4"
          delay={0.1}
        >
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-primary/20">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="mostVotes">Most Votes</SelectItem>
                <SelectItem value="highestApproval">Highest Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="w-full border-primary/20 hover:bg-primary/5"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </AnimatedContainer>
        
        {/* Tabs and Proposals */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <AnimatedContainer delay={0.2}>
            <TabsList className="mb-6 bg-background/50 backdrop-blur-sm border border-primary/20 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                All Proposals
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Active
              </TabsTrigger>
              <TabsTrigger value="passed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Passed
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
                Pending
              </TabsTrigger>
            </TabsList>
          </AnimatedContainer>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div 
                  className="flex flex-col items-center gap-4"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1, 0.98]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Loading proposals...</p>
                </motion.div>
              </div>
            ) : filteredProposals.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredProposals.map((proposal, index) => (
                  <EnhancedProposalCard
                    key={proposal._id}
                    id={proposal._id}
                    title={proposal.title || "Untitled Proposal"}
                    description={proposal.description || "No description provided"}
                    approveCount={proposal.approveCount || 0}
                    rejectCount={proposal.rejectCount || 0}
                    totalVotes={proposal.totalVotes || 0}
                    createdAt={proposal.createdAt}
                    status={proposal.status}
                    createdBy={proposal.createdBy}
                    onVote={handleVote}
                    isVoting={isVoting}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2
                  }}
                >
                  <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
                </motion.div>
                <h2 className="mb-2 text-xl font-bold">No proposals found</h2>
                {searchQuery ? (
                  <p className="mb-6 max-w-md text-muted-foreground">
                    No proposals match your search criteria. Try a different search term or clear your filters.
                  </p>
                ) : (
                  <p className="mb-6 max-w-md text-muted-foreground">
                    {activeTab === "all" 
                      ? "There are no proposals yet. Be the first to create one!" 
                      : `There are no ${activeTab} proposals at the moment.`}
                  </p>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => router.push("/create")}
                    className="bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90"
                  >
                    Create Proposal
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}