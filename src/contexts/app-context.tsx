// src/contexts/app-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import * as ContractService from "@/lib/contract";

// Add this to global.d.ts file or directly here
declare global {
  interface Window {
    ethereum?: ContractService.EthereumProvider;
  }
}

// Vote type definition
export type VoteType = "approve" | "reject";

// Define types
export type Proposal = {
  _id: Id<"proposals"> | string;
  id?: number; // For backward compatibility
  title: string;
  description: string;
  approveCount: number;
  rejectCount: number;
  voteCount: number; // For backward compatibility (same as approveCount)
  totalVotes: number;
  createdAt: string;
  status: "active" | "passed" | "rejected" | "pending";
  createdBy: string;
};

export type Vote = {
  _id?: Id<"votes"> | string;
  proposalId: Id<"proposals"> | string;
  voterAddress: string;
  voteType: VoteType;
  votedAt: string;
};

export interface User {
  address: string | null;
  isConnected: boolean;
}

export interface AppState {
  proposals: Proposal[];
  votes: Vote[];
  currentUser: User;
}

export interface AppContextType {
  proposals: Proposal[];
  votes: Vote[];
  userVotes: Vote[];
  currentUser: User;
  state: AppState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createProposal: (title: string, description: string) => Promise<string | Id<"proposals">>;
  voteOnProposal: (proposalId: string | Id<"proposals">, voteType: VoteType) => Promise<boolean | Id<"votes">>;
  endProposal: (proposalId: string | Id<"proposals">, status: "passed" | "rejected") => Promise<boolean>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

// Create context with a default value matching the interface
const AppContext = createContext<AppContextType>({
  proposals: [],
  votes: [],
  userVotes: [],
  currentUser: {
    address: null,
    isConnected: false,
  },
  state: {
    proposals: [],
    votes: [],
    currentUser: {
      address: null,
      isConnected: false,
    },
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  createProposal: async () => "",
  voteOnProposal: async () => false,
  endProposal: async () => false,
  isLoading: true,
  refreshData: async () => {},
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // State for wallet connection and loading
  const [currentUser, setCurrentUser] = useState<User>({
    address: null,
    isConnected: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  
  // Track if the initial data has been loaded
  const [dataInitialized, setDataInitialized] = useState(false);
  
  // This is used to force refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fetch proposals and votes from Convex
  // Added refetchInterval to ensure data stays fresh
  const convexProposals = useQuery(api.proposals.getAll);
  const convexVotes = useQuery(api.votes.getAll);
  const updateStatusMutation = useMutation(api.proposals.updateStatus); // Add this line
  
  // Debug logging to track data flow
  useEffect(() => {
    console.log("Raw Convex proposals data:", convexProposals);
    console.log("Current proposals state:", proposals);
  }, [convexProposals, proposals]);
  
  // Check for wallet connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          }) as string[];
          
          if (accounts.length > 0) {
            setCurrentUser({
              address: accounts[0],
              isConnected: true,
            });
          }
          
          // Listen for account changes
          const handleAccountsChanged = (accounts: unknown) => {
            const accountsArray = accounts as string[];
            if (accountsArray && accountsArray.length > 0) {
              setCurrentUser({
                address: accountsArray[0],
                isConnected: true,
              });
            } else {
              setCurrentUser({
                address: null,
                isConnected: false,
              });
            }
          };
          
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          
          return () => {
            if (window.ethereum) {
              window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
          };
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);
  
  // Process Convex proposals - this is the key function that was likely failing
  const processConvexData = useCallback(() => {
    // Only process if we have data
    if (!Array.isArray(convexProposals) || !Array.isArray(convexVotes)) {
      console.log("Skipping processing - Convex data not ready:", 
                 { proposals: convexProposals, votes: convexVotes });
      return;
    }
    
    console.log("Processing Convex data:", 
               { proposals: convexProposals, votes: convexVotes });
    
    try {
      // Process proposals - make sure we have an array to map
      const processedProposals = Array.isArray(convexProposals) ? convexProposals.map(p => {
        if (!p) return null; // Skip null/undefined items
        
        // Use safe null-coalescing for all properties
        const approveCount = p.approveCount !== undefined ? p.approveCount : 
                            (p.voteCount !== undefined ? p.voteCount : 0);
        
        const rejectCount = p.rejectCount !== undefined ? p.rejectCount : 0;
        
        const voteCount = p.voteCount !== undefined ? p.voteCount : 
                         (approveCount !== undefined ? approveCount : 0);
        
        // Ensure totalVotes is valid, avoiding division by zero
        const totalVotes = p.totalVotes !== undefined ? p.totalVotes : 
                          ((approveCount + rejectCount) > 0 ? (approveCount + rejectCount) : 1);
        
        // Ensure status is valid
        let status: "active" | "passed" | "rejected" | "pending" = "active";
        if (p.status && ["active", "passed", "rejected", "pending"].includes(p.status)) {
          status = p.status as "active" | "passed" | "rejected" | "pending";
        }
        
        return {
          _id: p._id,
          title: p.title || "",
          description: p.description || "",
          approveCount,
          rejectCount,
          voteCount,
          totalVotes,
          createdAt: p.createdAt || new Date().toISOString(),
          status,
          createdBy: p.createdBy || "",
        };
      }).filter(Boolean) as Proposal[] : []; // Filter out any null values from map
      
      // Process votes - make sure we have an array to map
      const processedVotes = Array.isArray(convexVotes) ? convexVotes.map(v => {
        if (!v) return null; // Skip null/undefined items
        
        // Ensure vote type is valid
        const voteType: VoteType = v.voteType === "reject" ? "reject" : "approve";
        
        return {
          ...v,
          voteType
        };
      }).filter(Boolean) as Vote[] : []; // Filter out any null values from map
      
      console.log("Processed proposals:", processedProposals);
      console.log("Setting state with processed data");
      
      // Update state with processed data - using functional updates to ensure we're not using stale state
      setProposals(current => {
        // Only update if we have new data and it's different
        if (processedProposals.length === 0 && current.length === 0) {
          return current; // No change needed
        }
        return processedProposals;
      });
      
      setVotes(current => {
        // Only update if we have new data and it's different
        if (processedVotes.length === 0 && current.length === 0) {
          return current; // No change needed
        }
        return processedVotes;
      });
      
      // Set loading to false since we have data
      setIsLoading(false);
      
      return { processedProposals, processedVotes };
    } catch (error) {
      console.error("Error processing Convex data:", error);
      // Don't set loading to false here - we'll retry on next data change
    }
  }, [convexProposals, convexVotes]);
  
  // Fetch data from blockchain
  const fetchBlockchainData = useCallback(async () => {
    if (!window.ethereum || !currentUser.isConnected) {
      console.log("Skipping blockchain fetch - no ethereum or not connected");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Fetching data from blockchain...");
      
      // First try to get proposals from blockchain
      const blockchainProposals = await ContractService.getAllProposals(window.ethereum);
      console.log("Blockchain proposals:", blockchainProposals);
      
      if (blockchainProposals && blockchainProposals.length > 0) {
        // Ensure the status field is properly typed
        const typedProposals: Proposal[] = blockchainProposals.map(proposal => {
          // Ensure status is one of the allowed values
          let status: "active" | "passed" | "rejected" | "pending" = "active";
          
          if (proposal.status === "active" || 
              proposal.status === "passed" || 
              proposal.status === "rejected" || 
              proposal.status === "pending") {
            status = proposal.status;
          }
          
          return {
            ...proposal,
            status
          };
        });
        
        setProposals(typedProposals);
        
        // Try to get votes for each proposal
        try {
          const allVotes: Vote[] = [];
          
          // Only process the first few proposals to avoid excessive requests
          const proposalsToProcess = typedProposals.slice(0, 5);
          
          for (const proposal of proposalsToProcess) {
            try {
              if (proposal._id) {
                const proposalVotes = await ContractService.getProposalVotes(
                  window.ethereum,
                  proposal._id.toString()
                );
                
                if (proposalVotes && proposalVotes.length > 0) {
                  allVotes.push(...proposalVotes);
                }
              }
            } catch (error) {
              console.error(`Error fetching votes for proposal ${proposal._id}:`, error);
            }
          }
          
          if (allVotes.length > 0) {
            setVotes(allVotes);
          }
        } catch (error) {
          console.error("Error fetching votes:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
      // If blockchain fetch fails, fall back to Convex data
      processConvexData();
    } finally {
      setIsLoading(false);
      setDataInitialized(true);
    }
  }, [currentUser.isConnected, processConvexData]);
  
  // Effect to process Convex data when it's available
  useEffect(() => {
    console.log("Checking for Convex data to process...");
    
    // Process any time we have new data or the refresh trigger changes
    processConvexData();
    
    // If we haven't initialized and we're connected, fetch blockchain data
    if (!dataInitialized && currentUser.isConnected) {
      fetchBlockchainData();
    } else if (!dataInitialized) {
      // If not connected but we have Convex data, we're done initializing
      setDataInitialized(true);
      setIsLoading(false);
    }
  }, [convexProposals, convexVotes, processConvexData, fetchBlockchainData, 
      currentUser.isConnected, dataInitialized, refreshTrigger]);
  
  // Effect to fetch blockchain data when wallet connects
  useEffect(() => {
    if (currentUser.isConnected && !dataInitialized) {
      fetchBlockchainData();
    }
  }, [currentUser.isConnected, fetchBlockchainData, dataInitialized]);
  
  // Function to refresh data
  const refreshData = useCallback(async () => {
    console.log("Manual data refresh requested");
    setIsLoading(true);
    
    // Increment the refresh trigger to force a data refresh
    setRefreshTrigger(prev => prev + 1);
    
    if (currentUser.isConnected && window.ethereum) {
      await fetchBlockchainData();
    } else {
      processConvexData();
    }
    
    setIsLoading(false);
  }, [currentUser.isConnected, fetchBlockchainData, processConvexData]);
  
  // Filter votes for current user
  const userVotes = votes.filter(vote => 
    vote.voterAddress === currentUser.address
  );
  
  // Mutations for creating proposals and voting
  const createProposalMutation = useMutation(api.proposals.create);
  const castVoteMutation = useMutation(api.votes.castVote);
  
  // Helper functions
  const connectWallet = async (): Promise<void> => {
    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        }) as string[];
        
        if (accounts.length > 0) {
          setCurrentUser({
            address: accounts[0],
            isConnected: true,
          });
        }
      } else {
        throw new Error("No Ethereum wallet detected");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };
  
  const disconnectWallet = (): void => {
    setCurrentUser({
      address: null,
      isConnected: false,
    });
  };
  const isSameId = (id1: any, id2: any): boolean => {
    if (!id1 || !id2) return false;
    
    // Direct comparison
    if (id1 === id2) return true;
    
    // String comparison
    if (id1.toString() === id2.toString()) return true;
    
    // If id is in a different format (e.g., has a j prefix)
    if (typeof id1 === 'string' && typeof id2 === 'string') {
      const normalized1 = id1.toString().replace(/^j/, '');
      const normalized2 = id2.toString().replace(/^j/, '');
      if (normalized1 === normalized2) return true;
    }
    
    return false;
  };

  const createProposal = async (title: string, description: string): Promise<string | Id<"proposals">> => {
    if (!currentUser.address) throw new Error("Wallet not connected");
    
    try {
      let proposalId: string | Id<"proposals"> = "";
      
      // Try to create on blockchain first if connected
      if (window.ethereum && currentUser.isConnected) {
        try {
          console.log("Creating proposal on blockchain...");
          proposalId = await ContractService.createProposal(
            window.ethereum,
            title,
            description
          );
          console.log("Created proposal on blockchain with ID:", proposalId);
        } catch (error) {
          console.error("Error creating proposal on blockchain:", error);
        }
      }
      
      // Always create in Convex as backup (with simpler properties to match schema)
      try {
        const convexId = await createProposalMutation({
          title,
          description,
          createdBy: currentUser.address,
        });
        
        // If blockchain creation failed, use Convex ID
        if (!proposalId) {
          proposalId = convexId;
        }
      } catch (error) {
        console.error("Error creating proposal in Convex:", error);
        
        // If Convex also failed but we have a blockchain ID, keep using that
        if (!proposalId) {
          throw error; // Re-throw if we have no ID at all
        }
      }
      
      // Refresh data after creating proposal
      setTimeout(() => refreshData(), 1000);
      
      return proposalId;
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    }
  };
  
  // Replace the voteOnProposal function in your app-context.tsx with this version:

const voteOnProposal = async (
  proposalId: string | Id<"proposals">,
  voteType: VoteType = "approve"
): Promise<boolean | Id<"votes">> => {
  
  if (!currentUser.address) throw new Error("Wallet not connected");
  
  console.log(`Attempting to vote on proposal ID: ${proposalId}, vote type: ${voteType}`);
  
  try {
    // First, check if the user has already voted on this proposal
    const existingVote = votes.find(v => 
      (isSameId(v.proposalId, proposalId) && 
       v.voterAddress.toLowerCase() === currentUser.address?.toLowerCase())
    );
    
    if (existingVote) {
      console.log("User already voted:", existingVote);
      throw new Error("You have already voted on this proposal");
    }
    
    // Find the specific proposal in our list - this ensures we have the correct format of ID
    const proposal = proposals.find(p => isSameId(p._id, proposalId));
    
    if (!proposal) {
      console.error(`Proposal with ID ${proposalId} not found`);
      throw new Error("Proposal not found");
    }
    
    console.log("Found proposal for voting:", proposal);
    
    let result: boolean | Id<"votes"> = false;
    let convexVoteId: Id<"votes"> | null = null;
    
    // Try blockchain voting if connected
    if (window.ethereum && currentUser.isConnected) {
      try {
        console.log("Voting on blockchain...");
        
        // Double check if user has already voted on the blockchain
        const hasVoted = await ContractService.hasVotedOnProposal(
          window.ethereum,
          proposal._id.toString(),
          currentUser.address
        );
        
        if (hasVoted) {
          console.log("Blockchain shows user already voted");
          throw new Error("You have already voted on this proposal");
        }
        
        // Cast the vote on blockchain
        await ContractService.castVote(window.ethereum, proposal._id.toString(), voteType);
        result = true;
        console.log("Vote cast on blockchain successfully");
      } catch (error) {
        console.error("Error voting on blockchain:", error);
        
        // If it's "already voted" error, let it bubble up
        if (error instanceof Error && 
           (error.message.includes("already voted") || error.message.includes("Already voted"))) {
          throw error;
        }
        // Continue to try Convex even if blockchain fails, unless it was an "already voted" error
      }
    }
    
    // Try Convex voting REGARDLESS of blockchain result
    // This ensures we have vote data in our Convex database
    try {
      console.log("Attempting to vote in Convex...");
      
      // Determine the correct Convex ID to use
      let convexId: Id<"proposals"> | null = null;
      
      // If the proposal._id is already a Convex ID (not a string), use it directly
      if (typeof proposal._id !== 'string') {
        console.log("Using direct Convex ID for voting:", proposal._id);
        convexId = proposal._id as Id<"proposals">;
      } else {
        // If it's a string, try to find a matching proposal with a Convex ID
        const convexProposal = proposals.find(p => 
          typeof p._id !== 'string' && 
          (p.title === proposal.title || 
           (typeof p._id === 'object' && p._id.toString().includes(proposal._id.toString())))
        );
        
        if (convexProposal && typeof convexProposal._id !== 'string') {
          console.log("Found matching Convex proposal:", convexProposal._id);
          convexId = convexProposal._id as Id<"proposals">;
        } else {
          // If we can't find a matching Convex proposal with the right type of ID
          console.log("No matching Convex ID found, casting string to Convex ID type");
          // This is a fallback that might not work, but we'll try
          convexId = proposal._id as unknown as Id<"proposals">;
        }
      }
      
      if (!convexId) {
        throw new Error("Could not determine a valid Convex ID for voting");
      }
      
      console.log("Final Convex ID for voting:", convexId);
      
      // Cast the vote in Convex
      convexVoteId = await castVoteMutation({
        proposalId: convexId,
        voterAddress: currentUser.address,
        voteType
      });
      
      console.log("Vote cast in Convex successfully with ID:", convexVoteId);
      
      // Update local state immediately for a responsive UI
      if (convexVoteId) {
        // Add the new vote to local state
        setVotes(prevVotes => [
          ...prevVotes,
          {
            _id: convexVoteId,
            proposalId: proposal._id,
            voterAddress: currentUser.address || "",
            voteType,
            votedAt: new Date().toISOString()
          }
        ]);
        
        // Update the proposal's vote count
        setProposals(prevProposals => 
          prevProposals.map(p => {
            if (isSameId(p._id, proposal._id)) {
              const newApproveCount = voteType === "approve" 
                ? p.approveCount + 1 
                : p.approveCount;
                
              const newRejectCount = voteType === "reject" 
                ? p.rejectCount + 1 
                : p.rejectCount;
                
              return {
                ...p,
                approveCount: newApproveCount,
                rejectCount: newRejectCount,
                voteCount: voteType === "approve" ? p.voteCount + 1 : p.voteCount, // For backward compatibility
                totalVotes: p.totalVotes + 1
              };
            }
            return p;
          })
        );
        
        result = result || convexVoteId;
      }
    } catch (error) {
      console.error("Error voting in Convex:", error);
      
      // If blockchain voting also failed, let the error bubble up
      if (!result) {
        throw error;
      }
    }
    
    // No matter what happens, refresh data to ensure consistency
    try {
      await refreshData();
    } catch (refreshError) {
      console.error("Error refreshing data after vote:", refreshError);
      // Don't throw here, the vote might have succeeded
    }
    
    return result || (convexVoteId as Id<"votes">);
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
};
  
  
  // Function to end a proposal
  const endProposal = async (
    proposalId: string | Id<"proposals">, 
    status: "passed" | "rejected"
  ): Promise<boolean> => {
    if (!currentUser.address) throw new Error("Wallet not connected");
    
    console.log(`Attempting to end proposal ID: ${proposalId} with status: ${status}`);
    
    try {
      // Find the proposal using our isSameId helper
      const proposal = proposals.find(p => isSameId(p._id, proposalId));
      
      if (!proposal) {
        console.error(`Proposal with ID ${proposalId} not found`);
        throw new Error("Proposal not found");
      }
      
      console.log("Found proposal for ending:", proposal);
      
      // Check if user is the creator
      if (proposal.createdBy.toLowerCase() !== currentUser.address.toLowerCase()) {
        console.error("User is not the creator of this proposal");
        throw new Error("Only the creator can end this proposal");
      }
      
      if (proposal.status !== "active") {
        console.error("Proposal is not active");
        throw new Error("Only active proposals can be ended");
      }
      
      let blockchainUpdated = false;
      let convexUpdated = false;
      
      // Update status on blockchain
      if (window.ethereum && currentUser.isConnected) {
        try {
          console.log(`Updating proposal status on blockchain to ${status}`);
          await ContractService.updateProposalStatus(
            window.ethereum,
            proposal._id.toString(),
            status
          );
          
          console.log("Blockchain status update successful");
          blockchainUpdated = true;
          
          // Update in local state immediately for responsive UI
          setProposals(prev => 
            prev.map(p => isSameId(p._id, proposalId) ? { ...p, status } : p)
          );
        } catch (error) {
          console.error("Error ending proposal on blockchain:", error);
          // Continue to try Convex update even if blockchain update fails
        }
      }
      
      // Try to update in Convex regardless of blockchain result
      try {
        console.log(`Updating proposal status in Convex to ${status}`);
        
        // Determine the correct Convex ID to use
        let convexId: Id<"proposals"> | null = null;
        
        // If the proposal._id is already a Convex ID (not a string), use it directly
        if (typeof proposal._id !== 'string') {
          console.log("Using direct Convex ID for status update:", proposal._id);
          convexId = proposal._id as Id<"proposals">;
        } else {
          // If it's a string, try to find a matching proposal with a Convex ID
          const convexProposal = proposals.find(p => 
            typeof p._id !== 'string' && 
            (p.title === proposal.title || 
             (typeof p._id === 'object' && p._id.toString().includes(proposal._id.toString())))
          );
          
          if (convexProposal && typeof convexProposal._id !== 'string') {
            console.log("Found matching Convex proposal:", convexProposal._id);
            convexId = convexProposal._id as Id<"proposals">;
          } else {
            // If we can't find a matching Convex proposal with the right type of ID
            console.log("No matching Convex ID found, casting string to Convex ID type");
            // This is a fallback that might not work, but we'll try
            convexId = proposal._id as unknown as Id<"proposals">;
          }
        }
        
        if (!convexId) {
          console.error("Could not determine a valid Convex ID for status update");
          throw new Error("Could not determine a valid Convex ID for status update");
        }
        
        console.log("Final Convex ID for status update:", convexId);
        
        // Update status in Convex
        await updateStatusMutation({
          id: convexId,
          status
        });
        
        console.log("Convex status update successful");
        convexUpdated = true;
        
        // Update in local state immediately
        setProposals(prev => 
          prev.map(p => isSameId(p._id, proposalId) ? { ...p, status } : p)
        );
      } catch (convexError) {
        console.error("Error updating status in Convex:", convexError);
        // If blockchain update also failed, bubble up the error
        if (!blockchainUpdated) {
          throw convexError;
        }
      }
      
      // Force a refresh to ensure data is up to date
      try {
        setTimeout(() => refreshData(), 1000);
      } catch (refreshError) {
        console.error("Error refreshing data after status update:", refreshError);
        // Don't throw here as the operation might have succeeded
      }
      
      // Return success if either blockchain or Convex update worked
      return blockchainUpdated || convexUpdated;
    } catch (error) {
      console.error("Error ending proposal:", error);
      throw error;
    }
  };
  
  // Create a state object for component consumption
  const state: AppState = {
    proposals,
    votes,
    currentUser
  };

  return (
    <AppContext.Provider
      value={{
        proposals,
        votes,
        userVotes,
        currentUser,
        state,
        connectWallet,
        disconnectWallet,
        createProposal,
        voteOnProposal,
        endProposal,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};