// src/app/proposals/[id]/page.tsx (fixed)
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  ThumbsUp,
  ThumbsDown,
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowLeft,
  Share2,
  Flag,
  BarChart
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatedContainer, AnimatedText, AnimatedButton, AnimatedCard } from "@/components/ui/animated-components";
import { RadialVoteVisualization, EnhancedVoteVisualization } from "@/components/proposals/enhanced-vote-visualization";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { NetworkBackground, VoteConfetti } from "@/components/ui/particles-confetti";

// Add explicit import for React.JSX
import type { ReactNode } from "react";

export default function EnhancedProposalDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  console.log("Proposal ID from URL:", id);
  const { proposals, votes, voteOnProposal, currentUser, endProposal } = useAppContext();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [voteType, setVoteType] = useState<"approve" | "reject" | null>(null);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Find the proposal
  const proposal = proposals.find(p => {
    // Try different ways to compare IDs
    if (!p._id || !id) return false;
    
    // Direct comparison
    if (p._id === id) return true;
    
    // String comparison
    if (p._id.toString() === id.toString()) return true;
    
    // If id is in a different format (e.g., has a j prefix)
    if (typeof id === 'string' && id.includes(p._id.toString())) return true;
    
    // Compare only the numeric part if it exists
    if (typeof p._id === 'object' && 'id' in p._id && p._id! === id) return true;
    
    // No match
    return false;
  });
  
  // And add logging to help debug
  console.log("Looking for proposal with ID:", id);
  console.log("Available proposal IDs:", proposals.map(p => ({ id: p._id, title: p.title })));
  console.log("Found proposal:", proposal);
  
  // Check if user has already voted
  const userVoted = currentUser.address ? 
    votes.some(v => v.proposalId?.toString() === id && v.voterAddress === currentUser.address) : 
    false;
  
  // If user has voted, get their vote type
  const userVoteType = userVoted && currentUser.address ? 
    votes.find(v => v.proposalId?.toString() === id && v.voterAddress === currentUser.address)?.voteType : 
    undefined;
  
  // Check if user is the creator
  const isCreator = proposal?.createdBy === currentUser.address;
  
  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center p-8 min-h-[70vh]">
        <NetworkBackground color="#8884d8" />
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
          <p className="text-muted-foreground">Loading proposal...</p>
        </motion.div>
      </div>
    );
  }
  
  if (!proposal) {
    return (
      <div className="container mx-auto p-8">
        <AnimatedButton 
          onClick={() => router.push('/proposals')}
          className="mb-8 border-primary/20 hover:bg-primary/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Proposals
        </AnimatedButton>
        
        <AnimatedCard className="rounded-lg border bg-card p-8 text-center">
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
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          </motion.div>
          <AnimatedText text="Proposal Not Found" className="mb-2 text-2xl font-bold" />
          <AnimatedContainer delay={0.2} className="mb-6">
            <p className="text-muted-foreground">
              The proposal you are looking for does not exist or has been removed.
            </p>
          </AnimatedContainer>
          <AnimatedButton 
            onClick={() => router.push('/proposals')}
            className="bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90"
          >
            View All Proposals
          </AnimatedButton>
        </AnimatedCard>
      </div>
    );
  }
  
  interface FormatDateParams {
    dateString: string;
  }

  const formatDate = (dateString: FormatDateParams["dateString"]): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  interface StatusIconProps {
    status: "active" | "passed" | "rejected" | "pending";
  }

  const getStatusIcon = (status: StatusIconProps["status"]): ReactNode => {
    switch (status) {
      case "active":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  const statusColors = {
    active: "bg-green-700 text-green-100 dark:bg-green-700 dark:text-green-100",
    passed: "bg-blue-700 text-blue-100 dark:bg-blue-700 dark:text-blue-100",
    rejected: "bg-red-700 text-red-100 dark:bg-red-700 dark:text-red-100",
    pending: "bg-yellow-700 text-yellow-100 dark:bg-yellow-700 dark:text-yellow-100",
  };
  
  interface HandleVoteParams {
    voteType: "approve" | "reject";
  }

  const handleVote = async (voteType: HandleVoteParams["voteType"]): Promise<void> => {
    try {
      if (!currentUser.isConnected) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your wallet to vote on proposals.",
          variant: "destructive",
        });
        return;
      }
      
      setIsVoting(true);
      setVoteType(voteType);
      
      await voteOnProposal(proposal._id as string, voteType);
      
      toast({
        title: `Vote ${voteType === "approve" ? "approving" : "rejecting"} submitted`,
        description: "Your vote has been recorded successfully.",
      });
      
      // Show confetti effect
      setShowConfetti(true);
      
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
  
  interface HandleEndProposalParams {
    status: "passed" | "rejected";
  }

  const handleEndProposal = async ({ status }: HandleEndProposalParams): Promise<void> => {
    try {
      if (!currentUser.isConnected) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your wallet to end this proposal.",
          variant: "destructive",
        });
        return;
      }
      
      if (!isCreator) {
        toast({
          title: "Not authorized",
          description: "Only the creator can end this proposal.",
          variant: "destructive",
        });
        return;
      }
      
      setIsEnding(true);
      await endProposal(proposal._id as string, status);
      
      toast({
        title: `Proposal ${status}`,
        description: `The proposal has been marked as ${status}.`,
      });
      
      setEndDialogOpen(false);
      
      // Show confetti for passed proposals
      if (status === "passed") {
        setVoteType("approve");
        setShowConfetti(true);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error ending proposal",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEnding(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Vote on: ${proposal.title}`,
        text: `Check out this proposal: ${proposal.title}`,
        url: window.location.href,
      }).catch(() => {
        toast({
          title: "Error sharing",
          description: "Unable to share this proposal.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Proposal link copied to clipboard.",
      });
    }
  };
  
  // Calculate percentages
  const approvalPercentage = proposal.totalVotes > 0 
    ? Math.round((proposal.approveCount / proposal.totalVotes) * 100) 
    : 0;
  
  const rejectionPercentage = proposal.totalVotes > 0 
    ? Math.round((proposal.rejectCount / proposal.totalVotes) * 100) 
    : 0;
  
  return (
    <>
      {/* Confetti effect */}
      <VoteConfetti active={showConfetti} type={voteType || "approve"} />
    
      <div className="container mx-auto p-6">
        <AnimatedButton
          onClick={() => router.push('/proposals')}
          className="mb-8 border-primary/20 hover:bg-primary/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Proposals
        </AnimatedButton>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatedContainer className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <AnimatedText 
                    text={proposal.title} 
                    className="text-3xl font-bold"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3
                    }}
                  >
                    <Badge className={statusColors[proposal.status]}>
                      {proposal.status}
                    </Badge>
                  </motion.div>
                </div>
                <AnimatedContainer delay={0.2} className="mt-2 flex items-center gap-2 text-muted-foreground">
                  {getStatusIcon(proposal.status)}
                  <span className="text-sm">
                    {proposal.status === "active" ? "Voting in progress" : 
                      proposal.status === "passed" ? "Proposal passed" : 
                      proposal.status === "rejected" ? "Proposal rejected" : 
                      "Voting pending"}
                  </span>
                </AnimatedContainer>
              </div>
              <AnimatedButton 
                className="mt-4 sm:mt-0 border-primary/20 hover:bg-primary/5"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </AnimatedButton>
            </AnimatedContainer>
            
            <AnimatedCard className="mb-8">
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <motion.p 
                    className="whitespace-pre-line text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {proposal.description}
                  </motion.p>
                </div>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedContainer delay={0.5} className="mb-8">
              <h2 className="mb-4 text-xl font-bold">Voting Results</h2>
              <AnimatedCard>
                <CardContent className="p-6">
                  <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <motion.div 
                      className="rounded-lg bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 p-4 text-center shadow-sm"
                      whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-lg font-medium text-green-800 dark:text-green-300">
                        {proposal.approveCount} Approve
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {approvalPercentage}% of votes
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="rounded-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/10 p-4 text-center shadow-sm"
                      whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-lg font-medium text-red-800 dark:text-red-300">
                        {proposal.rejectCount} Reject
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {rejectionPercentage}% of votes
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 p-4 text-center shadow-sm"
                      whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-lg font-medium text-blue-800 dark:text-blue-300">
                        {proposal.totalVotes} Total
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        voter participation
                      </p>
                    </motion.div>
                  </div>
                  
                  <div className="mb-6">
                    <EnhancedVoteVisualization
                      approveCount={proposal.approveCount}
                      rejectCount={proposal.rejectCount}
                      totalVotes={proposal.totalVotes}
                      size="lg"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                    <BarChart className="h-4 w-4" />
                    <span>Voting statistics updated in real-time</span>
                  </div>
                </CardContent>
              </AnimatedCard>
            </AnimatedContainer>
          </div>
          
          <div>
            {/* Vote Card */}
            <AnimatedCard className="mb-6" >
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Vote on This Proposal</h2>
                
                {userVoted ? (
                  <motion.div 
                    className="rounded-lg bg-primary/10 p-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="font-medium">You have voted to {userVoteType === "approve" ? "approve" : "reject"} this proposal</p>
                  </motion.div>
                ) : proposal.status !== "active" ? (
                  <motion.div 
                    className="rounded-lg bg-muted p-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Voting is no longer available for this proposal</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.p 
                      className="mb-4 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      Cast your vote to support or reject this proposal. Each wallet address can vote once.
                    </motion.p>
                    <motion.div 
                      className="flex gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.div 
                        className="w-1/2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleVote("approve")}
                          disabled={isVoting || !currentUser.isConnected}
                        >
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          {isVoting ? "Voting..." : "Approve"}
                        </Button>
                      </motion.div>
                      <motion.div 
                        className="w-1/2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={() => handleVote("reject")}
                          disabled={isVoting || !currentUser.isConnected}
                        >
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          {isVoting ? "Voting..." : "Reject"}
                        </Button>
                      </motion.div>
                    </motion.div>
                    
                    {!currentUser.isConnected && (
                      <motion.p 
                        className="mt-2 text-center text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        Connect your wallet to vote
                      </motion.p>
                    )}
                  </>
                )}
              </CardContent>
            </AnimatedCard>
            
            {/* Creator Actions */}
            {isCreator && proposal.status === "active" && (
              <AnimatedCard className="mb-6">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Creator Actions</h2>
                  <motion.p 
                    className="mb-4 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    As the creator of this proposal, you can end the voting process and determine the outcome.
                  </motion.p>
                  
                  <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 mb-3 border-primary/20 hover:bg-primary/5"
                        >
                          <Flag className="h-4 w-4" />
                          End Proposal
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-primary/20">
                      <DialogHeader>
                        <DialogTitle>End Proposal</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to end this proposal? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          Current results: {proposal.approveCount} approve ({approvalPercentage}%) / {proposal.rejectCount} reject ({rejectionPercentage}%)
                        </p>
                        <p className="text-sm">
                          Choose the final status for this proposal:
                        </p>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEndDialogOpen(false)}
                          disabled={isEnding}
                          className="border-primary/20"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleEndProposal({ status: "rejected" })}
                          disabled={isEnding}
                        >
                          {isEnding ? "Processing..." : "Mark as Rejected"}
                        </Button>
                        <Button
                          onClick={() => handleEndProposal({ status: "passed" })}
                          disabled={isEnding}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:opacity-90"
                        >
                          {isEnding ? "Processing..." : "Mark as Passed"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </AnimatedCard>
            )}
            
            {/* Proposal Information */}
            <AnimatedCard>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Proposal Information</h2>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Created on</p>
                      <p className="text-muted-foreground">{formatDate(proposal.createdAt)}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Created by</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {proposal.createdBy.slice(2, 4)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground break-all">
                          {proposal.createdBy}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Voting threshold</p>
                      <p className="text-muted-foreground">
                        Determined by proposal creator (typically majority)
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </AnimatedCard>
            
            {/* Vote visualization */}
            <AnimatedCard className="mt-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Vote Distribution</h2>
                <div className="flex justify-center">
                  <RadialVoteVisualization
                    approveCount={proposal.approveCount}
                    rejectCount={proposal.rejectCount}
                    totalVotes={proposal.totalVotes}
                  />
                </div>
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </>
  );
}