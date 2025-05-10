// src/components/proposals/proposal-card.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Calendar, Users, BarChart, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';

interface ProposalCardProps {
  id: string | number; 
  title: string;
  description: string;
  approveCount: number;
  rejectCount: number;
  totalVotes: number;
  createdAt?: string;
  status?: 'active' | 'passed' | 'rejected' | 'pending';
  createdBy?: string;
  onVote?: (id: string | number, voteType: "approve" | "reject") => Promise<void>;
  isVoting?: boolean;
}

export function ProposalCard({
  id,
  title,
  description,
  approveCount,
  rejectCount,
  totalVotes,
  createdAt = new Date().toISOString(),
  status = 'active',
  createdBy = '',
  onVote,
  isVoting: externalIsVoting = false,
}: ProposalCardProps) {
  const { voteOnProposal, currentUser, votes, refreshData } = useAppContext();
  const { toast } = useToast();
  const [internalIsVoting, setInternalIsVoting] = useState(false);
  
  // Use either the external isVoting state or our internal one
  const isVoting = externalIsVoting || internalIsVoting;
  
  // Calculate approval percentage
  const approvalPercentage = totalVotes > 0 
    ? Math.round((approveCount / totalVotes) * 100) 
    : 0;
  
  // Calculate rejection percentage
  const rejectionPercentage = totalVotes > 0 
    ? Math.round((rejectCount / totalVotes) * 100) 
    : 0;
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error("Invalid date:", dateString, error);
      return "Invalid date";
    }
  };
  
  const statusColors = {
    active: "bg-green-700 text-green-100 dark:bg-green-700 dark:text-green-100",
    passed: "bg-blue-700 text-blue-100 dark:bg-blue-700 dark:text-blue-100",
    rejected: "bg-red-700 text-red-100 dark:bg-red-700 dark:text-red-100",
    pending: "bg-yellow-700 text-yellow-100 dark:bg-yellow-700 dark:text-yellow-100",
  };

  // Format display ID
  const displayId = typeof id === 'string' 
    ? id.substring(0, 6) 
    : id.toString().substring(0, 6);
  
  // Helper to check if IDs are the same
  const isSameId = (id1: any, id2: any): boolean => {
    if (!id1 || !id2) return false;
    
    // Direct comparison
    if (id1 === id2) return true;
    
    // String comparison
    if (id1.toString() === id2.toString()) return true;
    
    // If id is in a different format (e.g., has a j prefix)
    if (typeof id1 === 'string' && typeof id2 === 'string') {
      if (id1.includes(id2) || id2.includes(id1)) return true;
    }
    
    return false;
  };
  
  // Check if user has already voted on this proposal
  const userHasVoted = currentUser.address ? 
    votes.some(vote => 
      isSameId(vote.proposalId, id) && 
      vote.voterAddress.toLowerCase() === currentUser.address?.toLowerCase()
    ) : 
    false;
  
  // Handle vote
  const handleVote = async (voteType: "approve" | "reject") => {
    if (!currentUser.isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote on proposals.",
        variant: "destructive",
      });
      return;
    }
    
    if (userHasVoted) {
      toast({
        title: "Already voted",
        description: "You have already voted on this proposal.",
        variant: "destructive",
      });
      return;
    }
    
    if (status !== 'active') {
      toast({
        title: "Voting closed",
        description: "This proposal is no longer accepting votes.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use either the provided onVote function or our internal voteOnProposal
      if (onVote) {
        // Use the parent component's vote handler
        await onVote(id, voteType);
      } else {
        // Use our internal vote handler
        setInternalIsVoting(true);
        console.log(`Voting on proposal ${id} with vote type ${voteType}`);
        
        // Call the voteOnProposal function from context
        await voteOnProposal(id.toString(), voteType);
        
        toast({
          title: "Vote submitted",
          description: `Your vote to ${voteType} has been recorded.`,
        });
        
        // Refresh data after voting
        await refreshData();
      }
    } catch (error) {
      console.error("Error voting:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error voting",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Only reset our internal state if we're managing it
      if (!onVote) {
        setInternalIsVoting(false);
      }
    }
  };
  
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-card border border-border h-full">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link href={`/proposals/${id}`}>
              <h3 className="text-xl font-bold text-card-foreground hover:text-primary">
                {title || "Untitled Proposal"}
              </h3>
            </Link>
            <p className="text-muted-foreground">Proposal #{displayId}</p>
          </div>
          <Badge className={statusColors[status]}>
            {status}
          </Badge>
        </div>
        
        <p className="mt-4 mb-6 text-muted-foreground line-clamp-3">
          {description || "No description provided"}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-card-foreground">
              <span className="text-green-600 dark:text-green-400 ">{approveCount} approve</span> / 
              <span className="text-red-600 dark:text-red-400"> {rejectCount} reject</span>
            </span>
            <span className="text-card-foreground">{approvalPercentage}% approval</span>
          </div>
          
          {/* Approval progress bar */}
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${approvalPercentage}%` }}
            />
          </div>
          
          {/* Rejection progress bar */}
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full" 
              style={{ width: `${rejectionPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{totalVotes} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-3 w-3" />
            <span>{approvalPercentage}% approval rate</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-border bg-muted/50 p-4">
        {status === 'active' ? (
          // Check if user has voted
          userHasVoted ? (
            <div className="text-center py-2 text-sm text-muted-foreground bg-primary/10 rounded-md">
              You have already voted on this proposal
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                className={cn("w-1/2", isVoting ? "bg-green-400" : "bg-green-600 hover:bg-green-700")}
                onClick={() => handleVote("approve")}
                disabled={isVoting || !currentUser.isConnected}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {isVoting ? "Voting..." : "Approve"}
              </Button>
              <Button 
                className={cn("w-1/2", isVoting ? "bg-red-400" : "bg-red-600 hover:bg-red-700")}
                onClick={() => handleVote("reject")}
                disabled={isVoting || !currentUser.isConnected}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                {isVoting ? "Voting..." : "Reject"}
              </Button>
            </div>
          )
        ) : (
          <Link href={`/proposals/${id}`} className="w-full">
            <Button className="w-full">
              View Details
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}