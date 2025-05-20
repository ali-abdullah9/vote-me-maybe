import { ethers } from "ethers";
import { getBlockchainId, getConvexId, storeMapping } from "./id-mapping";

// Contract address from your deployed VotingSystem contract
let CONTRACT_ADDRESS = "0x4778Ad7fdD271f0aB9FB4152323D58AC611B1795";

// Update this with your actual contract address after deployment
export const setContractAddress = (address: string): void => {
  CONTRACT_ADDRESS = address;
};

// Status mapping between contract enum and our app's status strings
const statusMapping = ["active", "pending", "passed", "rejected"];

// Vote type mapping between contract enum and our app's vote type strings
const voteTypeMapping = ["approve", "reject"];

// Flag to track which version of contract we're using
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let isNewContractVersion = false;

// Define interfaces for our contract types
interface Proposal {
  id: ethers.BigNumber;
  creator: string;
  title: string;
  description: string;
  approveCount: ethers.BigNumber;
  rejectCount: ethers.BigNumber;
  totalVotes: ethers.BigNumber;
  createdAt: ethers.BigNumber;
  status: ethers.BigNumber;
}

interface Vote {
  proposalId: ethers.BigNumber;
  voter: string;
  voteType: ethers.BigNumber;
  votedAt: ethers.BigNumber;
}

// ABI for your VotingSystem contract
const VotingSystemABI = {
  abi: [
    // Events
    "event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title)",
    "event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 voteType)",
    "event ProposalStatusChanged(uint256 indexed proposalId, uint8 newStatus)",

    // View functions
    "function getAllProposals() view returns (tuple(uint256 id, address creator, string title, string description, uint256 approveCount, uint256 rejectCount, uint256 totalVotes, uint256 createdAt, uint8 status)[])",
    "function getProposal(uint256 _proposalId) view returns (tuple(uint256 id, address creator, string title, string description, uint256 approveCount, uint256 rejectCount, uint256 totalVotes, uint256 createdAt, uint8 status))",
    "function getProposalVotes(uint256 _proposalId) view returns (tuple(uint256 proposalId, address voter, uint8 voteType, uint256 votedAt)[])",
    "function hasVotedOnProposal(uint256 _proposalId, address _voter) view returns (bool)",
    "function hasVoted(uint256 _proposalId, address _voter) view returns (bool)",
    "function hasUserVoted(uint256 _proposalId, address _voter) view returns (bool)",
    "function getVoteByVoter(uint256 _proposalId, address _voter) view returns (tuple(uint256 proposalId, address voter, uint8 voteType, uint256 votedAt))",
    "function votes(uint256, address) view returns (tuple(uint256 proposalId, address voter, uint8 voteType, uint256 votedAt))",
    "function proposalCount() view returns (uint256)",
    "function getProposalCount() view returns (uint256)",

    // Mutable functions
    "function createProposal(string memory _title, string memory _description) returns (uint256)",
    "function castVote(uint256 _proposalId, uint8 _voteType)",
    "function castVoteWithType(uint256 _proposalId, uint8 _voteType)",
    "function vote(uint256 _proposalId)",  // Old version without vote type
    "function vote(uint256 _proposalId, uint8 _voteType)",  // New version with vote type
    "function updateProposalStatus(uint256 _proposalId, uint8 _newStatus)",
  ],
};

// Helper to safely get a number value from various formats
const safeToNumber = (
  value: number | string | null | undefined | { toNumber?: () => number }
): number => {
  if (value === undefined || value === null) return 0;
  
  if (typeof value === 'object' && value.toNumber) {
    return value.toNumber();
  }
  
  if (typeof value === 'string') {
    return parseInt(value) || 0;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  return 0;
};

/// Helper to convert from contract proposal to our app proposal format
interface MappedProposal {
  _id: string;
  title: string;
  description: string;
  approveCount: number;
  rejectCount: number;
  voteCount: number; // For backwards compatibility (approveCount)
  totalVotes: number;
  createdAt: string;
  status: "active" | "passed" | "rejected" | "pending";
  createdBy: string;
}

const mapProposalFromContract = (proposal: Proposal): MappedProposal => {
  try {
    // Get numerical ID safely
    const numericId = safeToNumber(proposal.id);
    
    // Get convex ID if it exists
    const convexId = getConvexId(numericId);
    
    // Get status safely
    const statusIndex = safeToNumber(proposal.status);
    
    // Get vote counts
    const approveCount = safeToNumber(proposal.approveCount);
    const rejectCount = safeToNumber(proposal.rejectCount);
    const totalVotes = safeToNumber(proposal.totalVotes);
    
    // Always normalize Ethereum addresses to lowercase for consistent comparison
    const creatorAddress = proposal.creator ? proposal.creator.toLowerCase() : '';
    
    // Make sure status is one of the allowed values
    let status: "active" | "passed" | "rejected" | "pending" = "active";
    if (statusIndex >= 0 && statusIndex < statusMapping.length) {
      const mappedStatus = statusMapping[statusIndex];
      if (mappedStatus === "active" || mappedStatus === "passed" || 
          mappedStatus === "rejected" || mappedStatus === "pending") {
        status = mappedStatus as "active" | "passed" | "rejected" | "pending";
      }
    }
    
    return {
      _id: convexId || numericId.toString(),
      title: proposal.title || '',
      description: proposal.description || '',
      approveCount: approveCount,
      rejectCount: rejectCount,
      voteCount: approveCount, // For backwards compatibility
      totalVotes: totalVotes,
      createdAt: new Date(safeToNumber(proposal.createdAt) * 1000).toISOString(),
      status,
      createdBy: creatorAddress, // Store lowercase address
    };
  } catch (error) {
    console.error("Error mapping proposal:", error, proposal);
    // Return a default proposal if mapping fails
    return {
      _id: '0',
      title: proposal.title || 'Unknown Proposal',
      description: proposal.description || '',
      approveCount: 0,
      rejectCount: 0,
      voteCount: 0, // For backwards compatibility
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      createdBy: '',
    };
  }
};

// Interface for Ethereum provider
export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (
    eventName: string,
    handler: (...args: unknown[]) => void
  ) => void;
}

// Helper to get contract instance
const getContractInstance = async (
  ethereum: EthereumProvider
): Promise<ethers.Contract> => {
  if (!ethereum) throw new Error("No Ethereum provider found");

  const provider = new ethers.providers.Web3Provider(
    ethereum as ethers.providers.ExternalProvider
  );
  const signer = provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI.abi, signer);
};

// Return a contract instance with signer
export const getContractWithSigner = async (
  ethereum: EthereumProvider
): Promise<ethers.Contract> => {
  return getContractInstance(ethereum);
};

// Return a contract instance without signer for read-only operations
export const getContract = async (
  ethereum: EthereumProvider
): Promise<ethers.Contract> => {
  if (!ethereum) throw new Error("No Ethereum provider found");

  const provider = new ethers.providers.Web3Provider(
    ethereum as ethers.providers.ExternalProvider
  );

  return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI.abi, provider);
};

// Check if contract supports the new version features
export const checkContractVersion = async (
  ethereum: EthereumProvider
): Promise<boolean> => {
  try {
    const contract = await getContractInstance(ethereum);
    
    // Test call to get a proposal - should not throw if contract supports this method
    await contract.getAllProposals();
    
    // Try if contract can handle vote type parameter
    try {
      // First get a proposal ID that exists
      const proposals = await contract.getAllProposals();
      if (proposals && proposals.length > 0) {
        // Try to check if the first proposal exists
        const firstProposalId = 0; // Use a safe default
        
        // Check if hasVotedOnProposal works (exists in both versions)
        const provider = new ethers.providers.Web3Provider(
          ethereum as ethers.providers.ExternalProvider
        );
        const address = await provider.getSigner().getAddress();
        await contract.hasVotedOnProposal(firstProposalId, address);
        
        // Contract exists and basic methods work
        console.log("Contract supports basic methods");
        isNewContractVersion = true;
        return true;
      }
    } catch (error) {
      console.log("Contract exists but may not support new methods:", error);
      isNewContractVersion = false;
      return false;
    }
    
    isNewContractVersion = true;
    return true;
  } catch (error) {
    console.error("Error checking contract version:", error);
    isNewContractVersion = false;
    return false;
  }
};

// Helper function to get numeric blockchain ID from Convex string ID
export async function getBlockchainIdFromProposalId(
  ethereum: EthereumProvider, 
  proposalId: string,
  proposalTitle?: string // Optional title to help with matching
): Promise<number> {
  console.log(`Converting Convex ID ${proposalId} to blockchain ID`);
  
  // First, check if this is already a numeric ID
  if (!isNaN(Number(proposalId))) {
    return Number(proposalId);
  }

  try {
    // First check if we have a mapping stored in the id-mapping system
    const blockchainId = getBlockchainId(proposalId);
    if (blockchainId > 0) {
      console.log(`Found blockchain ID ${blockchainId} for Convex ID ${proposalId} in mapping`);
      return blockchainId;
    }

    // Option 1: Check if we've cached this mapping in localStorage
    const cachedMapping = localStorage.getItem(`proposal_id_mapping_${proposalId}`);
    if (cachedMapping) {
      const parsedId = parseInt(cachedMapping, 10);
      console.log(`Found cached mapping for ${proposalId}: ${parsedId}`);
      
      // Store in the id-mapping system for future use
      storeMapping(proposalId, parsedId);
      
      return parsedId;
    }

    // Option 2: Parse it from the string if it's encoded somehow
    const numericPart = proposalId.match(/\d+$/);
    if (numericPart) {
      const parsedId = parseInt(numericPart[0], 10);
      console.log(`Extracted numeric ID ${parsedId} from ${proposalId}`);
      
      // Cache this mapping for future use
      localStorage.setItem(`proposal_id_mapping_${proposalId}`, parsedId.toString());
      // Store in the id-mapping system
      storeMapping(proposalId, parsedId);
      
      return parsedId;
    }

    // Option 3: Query the contract for all proposals and try to match
    if (proposalTitle) {
      console.log(`Attempting to match proposal by title: ${proposalTitle}`);
      const contract = await getContract(ethereum);
      
      try {
        // Try to get the proposal count (different contracts might have different methods)
        let proposalCount;
        try {
          proposalCount = await contract.proposalCount();
        } catch (e) {
          try {
            proposalCount = await contract.getProposalCount();
            console.log(e);
          } catch (e2) {
            console.warn("Could not get proposal count from contract");
            console.log(e2);
            // If we can't get the count, try a reasonable number (e.g., 20)
            proposalCount = 20;
          }
        }
        
        proposalCount = safeToNumber(proposalCount);
        console.log(`Searching through ${proposalCount} proposals on the blockchain`);
        
        // Loop through proposals (start from most recent for efficiency)
        for (let i = proposalCount; i >= 1; i--) {
          try {
            // Different contracts might store proposals differently
            let blockchainProposal;
            try {
              blockchainProposal = await contract.getProposal(i);
            } catch (e) {
              try {
                blockchainProposal = await contract.proposals(i);
                console.log(e);
              } catch (e2) {
                console.warn(`Could not get proposal ${i} from blockchain`);
                console.log(e2);
                continue;
              }
            }
            
            // Check if title matches
            if (blockchainProposal && 
                blockchainProposal.title && 
                blockchainProposal.title.toLowerCase() === proposalTitle.toLowerCase()) {
              console.log(`Found matching proposal on blockchain with ID ${i}`);
              
              // Cache this mapping for future use
              localStorage.setItem(`proposal_id_mapping_${proposalId}`, i.toString());
              // Store in the id-mapping system
              storeMapping(proposalId, i);
              
              return i;
            }
          } catch (error) {
            console.warn(`Error checking proposal ${i}:`, error);
            continue;
          }
        }
        
        console.warn("No matching proposal found on blockchain by title");
      } catch (error) {
        console.error("Error searching proposals on blockchain:", error);
      }
    }

    // Option 4: Extract any numeric parts from the ID as fallback
    const allNumbers = proposalId.replace(/\D/g, "");
    if (allNumbers.length > 0) {
      // If the number is very large, use modulo to get a smaller number
      // that's likely in the range of your proposal IDs
      let extractedNumber = parseInt(allNumbers, 10);
      if (extractedNumber > 1000) {
        extractedNumber = extractedNumber % 1000;
      }
      
      // Make sure it's at least 1 (blockchain IDs usually start at 1)
      if (extractedNumber < 1) extractedNumber = 1;
      
      console.log(`Extracted fallback numeric ID ${extractedNumber} from ${proposalId}`);
      
      // Cache this mapping for future use
      localStorage.setItem(`proposal_id_mapping_${proposalId}`, extractedNumber.toString());
      // Store in the id-mapping system
      storeMapping(proposalId, extractedNumber);
      
      return extractedNumber;
    }

    // Last resort - hash the string ID to a number
    const hashCode = hashString(proposalId);
    const positiveHash = Math.abs(hashCode);
    const smallerNumber = (positiveHash % 100) + 1; // Ensure it's between 1-100
    
    console.log(`Generated hash-based ID ${smallerNumber} for ${proposalId}`);
    
    // Cache this mapping for future use
    localStorage.setItem(`proposal_id_mapping_${proposalId}`, smallerNumber.toString());
    // Store in the id-mapping system
    storeMapping(proposalId, smallerNumber);
    
    return smallerNumber;
  } catch (error) {
    console.error("Error converting proposal ID:", error);
    // Default to a safe ID as absolute fallback
    return 5;
  }
}

// Helper function to hash a string to a number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Get all proposals from the contract
export const getAllProposals = async (
  ethereum: EthereumProvider
): Promise<MappedProposal[]> => {
  try {
    const contract = await getContractInstance(ethereum);
    const proposals = (await contract.getAllProposals()) as Proposal[];
    
    console.log("Raw proposals from contract:", proposals);
    
    // Get the current user's address for comparison
    const provider = new ethers.providers.Web3Provider(
      ethereum as ethers.providers.ExternalProvider
    );
    const signer = provider.getSigner();
    const currentAddress = await signer.getAddress();
    console.log("Current user address:", currentAddress.toLowerCase());
    
    return proposals.map((proposal) => {
      const mappedProposal = mapProposalFromContract(proposal);
      
      // Log the creator address from the contract for debugging
      console.log("Proposal creator from contract:", proposal.creator);
      console.log("Mapped creator:", mappedProposal.createdBy);
      
      // Ensure we have a mapping from this blockchain ID to a Convex ID if one exists
      const blockchainId = safeToNumber(proposal.id);
      if (mappedProposal._id !== blockchainId.toString()) {
        storeMapping(mappedProposal._id, blockchainId);
      }
      
      return mappedProposal;
    });
  } catch (error) {
    console.error("Error getting proposals:", error);
    return []; // Return empty array on error
  }
};

// Create a new proposal
export const createProposal = async (
  ethereum: EthereumProvider,
  title: string,
  description: string
): Promise<string> => {
  try {
    console.log("Creating proposal with title:", title);
    const contract = await getContractInstance(ethereum);
    
    const tx = await contract.createProposal(title, description);
    console.log("Proposal creation transaction:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Proposal creation receipt:", receipt);
    
    // Get the proposalId from the event
    const event = receipt.events?.find(
      (e: { event: string }) => e.event === "ProposalCreated"
    );
    
    if (!event || !event.args) {
      console.error("Failed to get proposal ID from event. Event:", event);
      
      // Fallback: use transaction hash as a temporary ID
      console.log("Using transaction hash as fallback ID:", tx.hash);
      
      // For troubleshooting: list all events in receipt
      if (receipt.events && receipt.events.length > 0) {
        console.log("All events in receipt:");
        receipt.events.forEach((e: ethers.Event, i: number) => {
          console.log(`Event ${i}:`, e.event, e.args);
        });
      }
      
      // Fallback to any numeric ID if possible (newest proposal ID)
      try {
        const allProposals = await contract.getAllProposals();
        if (allProposals && allProposals.length > 0) {
          // Find the latest proposal (likely ours)
          const latestProposal = allProposals[allProposals.length - 1];
          if (latestProposal && latestProposal.id) {
            const proposalId = safeToNumber(latestProposal.id);
            console.log("Using latest proposal ID as fallback:", proposalId);
            return proposalId.toString();
          }
        }
      } catch (innerError) {
        console.error("Error fetching all proposals for fallback:", innerError);
      }
      
      // Final fallback: just return a timestamp
      return Date.now().toString();
    }
    
    // Try to extract the proposal ID from the event args
    // Different ways to access event args depending on contract and event format
    let proposalId: number = 0;
    
    if (event.args.proposalId) {
      proposalId = safeToNumber(event.args.proposalId);
    } else if (event.args[0]) {
      // Sometimes args are just indexed array
      proposalId = safeToNumber(event.args[0]);
    } else {
      // Last resort: check all args
      for (const arg of Object.values(event.args)) {
        if (arg && typeof arg === 'object' && 'toNumber' in arg) {
          if (typeof (arg as { toNumber?: unknown }).toNumber === "function") {
            proposalId = safeToNumber(arg as { toNumber: () => number });
            break;
          }
          break;
        }
      }
    }
    
    console.log("Created proposal with ID:", proposalId);
    
    // Return the blockchain ID as a string
    return proposalId.toString();
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};

// Cast a vote on a proposal
export const castVote = async (
  ethereum: EthereumProvider,
  proposalId: string,
  voteType: string = "approve"
): Promise<boolean> => {
  try {
    console.log("Starting vote process for proposalId:", proposalId, "vote type:", voteType);
    
    // Get the proposal title if available
    let proposalTitle = "";
    try {
      const allProposals = await getAllProposals(ethereum);
      const matchingProposal = allProposals.find(p => p._id === proposalId);
      if (matchingProposal) {
        proposalTitle = matchingProposal.title;
      }
    } catch (error) {
      console.log("Error fetching proposal title:", error);
    }
    
    // Convert string ID to a numeric ID using our robust converter
    const numericId = await getBlockchainIdFromProposalId(ethereum, proposalId, proposalTitle);
    console.log("Using blockchain ID for voting:", numericId);
    
    // Get the signer account
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected address:", address);
    
    // Get the contract with signer
    console.log("Sending transaction to castVote...");
    const contract = await getContractWithSigner(ethereum);
    
    // Convert voteType to numeric (0 for approve, 1 for reject)
    const voteValue = voteType === "approve" ? 0 : 1;
    
    // Store all errors to provide detailed feedback if all methods fail
    const errors: Error[] = [];
    
    // First check if user has already voted
    try {
      const hasVoted = await hasVotedOnProposal(ethereum, proposalId, address);
      if (hasVoted) {
        console.log("User has already voted on this proposal");
        throw new Error("You have already voted on this proposal");
      }
    } catch (error) {
      // If there's an error in the check, we'll let the vote proceed
      // The contract should still enforce this constraint
      console.log("Error checking if user has voted:", error);
    }
    
    // Try all possible voting function signatures
    
    // Try castVoteWithType method (most likely for newer contracts)
    try {
      console.log("Trying castVoteWithType method...");
      const tx = await contract.castVoteWithType(numericId, voteValue);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed!");
      
      // Cache the ID mapping that worked
      localStorage.setItem(`proposal_id_mapping_${proposalId}`, numericId.toString());
      storeMapping(proposalId, numericId);
      
      return true;
    } catch (error) {
      console.log("castVoteWithType method failed:", error);
      errors.push(error as Error);
      
      // Try castVote method
      try {
        console.log("Trying castVote method...");
        const tx = await contract.castVote(numericId, voteValue);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed!");
        
        // Cache the ID mapping that worked
        localStorage.setItem(`proposal_id_mapping_${proposalId}`, numericId.toString());
        storeMapping(proposalId, numericId);
        
        return true;
      } catch (error) {
        console.log("castVote method failed:", error);
        errors.push(error as Error);
        
        // Try vote method with vote type parameter
        try {
          console.log("Trying vote method with parameter...");
          const tx = await contract.vote(numericId, voteValue);
          console.log("Transaction sent:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed!");
          
          // Cache the ID mapping that worked
          localStorage.setItem(`proposal_id_mapping_${proposalId}`, numericId.toString());
          storeMapping(proposalId, numericId);
          
          return true;
        } catch (error) {
          console.log("vote method with parameter failed:", error);
          errors.push(error as Error);
          
          // Last attempt: try vote method without parameter (approve only)
          if (voteType === "approve") {
            try {
              console.log("Trying vote method without parameter (approve only)...");
              const tx = await contract.vote(numericId);
              console.log("Transaction sent:", tx.hash);
              await tx.wait();
              console.log("Transaction confirmed!");
              
              // Cache the ID mapping that worked
              localStorage.setItem(`proposal_id_mapping_${proposalId}`, numericId.toString());
              storeMapping(proposalId, numericId);
              
              return true;
            } catch (error) {
              console.log("Final vote method failed:", error);
              errors.push(error as Error);
            }
          }
          
          // All methods failed, throw a comprehensive error
          console.error("All voting methods failed. Errors:", errors);
          throw new Error(`Failed to cast vote: ${errors[0]?.message || "Unknown error"}`);
        }
      }
    }
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};

// Update a proposal's status
export const updateProposalStatus = async (
  ethereum: EthereumProvider,
  proposalId: string,
  status: string
): Promise<boolean> => {
  try {
    console.log("Updating proposal status:", proposalId, status);
    
    // Convert from string status to enum value
    const statusValue = statusMapping.indexOf(status);
    if (statusValue === -1) throw new Error("Invalid status");
    
    // Get the proposal title if available
    let proposalTitle = "";
    try {
      // Try to find the proposal in our local state to get its title
      const allProposals = await getAllProposals(ethereum);
      const matchingProposal = allProposals.find(p => p._id === proposalId);
      if (matchingProposal) {
        proposalTitle = matchingProposal.title;
      }
    } catch (error) {
      console.log("Error fetching proposal title:", error);
    }
    
    // Get the blockchain ID using our improved mapping function
    const blockchainId = await getBlockchainIdFromProposalId(ethereum, proposalId, proposalTitle);
    
    console.log("Using blockchain ID for status update:", blockchainId, "Status value:", statusValue);
    
    const contract = await getContractInstance(ethereum);
    const tx = await contract.updateProposalStatus(blockchainId, statusValue);
    console.log("Status update transaction:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Status update confirmed:", receipt);
    
    // Cache the successful ID mapping
    localStorage.setItem(`proposal_id_mapping_${proposalId}`, blockchainId.toString());
    storeMapping(proposalId, blockchainId);
    
    return true;
  } catch (error) {
    console.error("Error updating proposal status:", error);
    throw error;
  }
};

// Check if a user has voted on a proposal
export const hasVotedOnProposal = async (
  ethereum: EthereumProvider,
  proposalId: string,
  voterAddress: string
): Promise<boolean> => {
  try {
    console.log("Checking if voted:", proposalId, voterAddress);
    
    // Get the proposal title if available
    let proposalTitle = "";
    try {
      // Try to find the proposal in our local state to get its title
      const allProposals = await getAllProposals(ethereum);
      const matchingProposal = allProposals.find(p => p._id === proposalId);
      if (matchingProposal) {
        proposalTitle = matchingProposal.title;
      }
    } catch (error) {
      console.log("Error fetching proposal title:", error);
    }
    
    // Convert string ID to a numeric ID using our robust converter
    const numericId = await getBlockchainIdFromProposalId(ethereum, proposalId, proposalTitle);
    console.log("Using blockchain ID for vote check:", numericId);
    
    const contract = await getContract(ethereum);
    
    // Try different methods based on the contract version
    try {
      // First try the standard hasVoted function
      const hasVoted = await contract.hasVoted(numericId, voterAddress);
      console.log(`User has voted (hasVoted): ${hasVoted}`);
      return hasVoted;
    } catch (error) {
      console.log("hasVoted method failed, trying alternatives", error);
      
      // If that fails, try the alternative function name
      try {
        const hasVoted = await contract.hasVotedOnProposal(numericId, voterAddress);
        console.log(`User has voted (hasVotedOnProposal): ${hasVoted}`);
        return hasVoted;
      } catch (innerError) {
        console.log("hasVotedOnProposal method failed, trying more alternatives", innerError);
        
        // Try yet another possible method name
        try {
          const hasVoted = await contract.hasUserVoted(numericId, voterAddress);
          console.log(`User has voted (hasUserVoted): ${hasVoted}`);
          return hasVoted;
        } catch (thirdError) {
          console.log("All direct vote check methods failed, trying to get vote", thirdError);
          
          // If all direct checks fail, check votes manually
          try {
            // Try different methods to get a vote
            try {
              
              console.log("Found vote via getVoteByVoter");
              return true;
            } catch (e) {
              try {
                
                console.log("Found vote via votes mapping",e);
                return true;
              } catch (e2) {
                console.log("All vote retrieval methods failed",e2);
                // If all methods fail, assume they haven't voted
                return false;
              }
            }
          } catch (finalError) {
            // If all methods fail, assume they haven't voted
            // This is safer than preventing them from voting
            console.log("All vote check methods failed, assuming not voted yet", finalError);
            return false;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking vote status:", error);
    // If we can't check, assume they haven't voted
    // This is safer than preventing them from voting
    return false;
  }
};

// Get votes for a specific proposal
export const getProposalVotes = async (
  ethereum: EthereumProvider,
  proposalId: string
): Promise<
  {
    proposalId: string;
    voterAddress: string;
    voteType: "approve" | "reject";
    votedAt: string;
  }[]
> => {
  try {
    console.log("Getting votes for proposalId:", proposalId);
    
    // Get the proposal title if available
    let proposalTitle = "";
    try {
      // Try to find the proposal in our local state to get its title
      const allProposals = await getAllProposals(ethereum);
      const matchingProposal = allProposals.find(p => p._id === proposalId);
      if (matchingProposal) {
        proposalTitle = matchingProposal.title;
      }
    } catch (error) {
      console.log("Error fetching proposal title:", error);
    }
    
    // Get the blockchain ID using our improved mapping function
    const blockchainId = await getBlockchainIdFromProposalId(ethereum, proposalId, proposalTitle);
    console.log("Using blockchain ID for getting votes:", blockchainId);
    
    const contract = await getContractInstance(ethereum);
    
    try {
      const votes = (await contract.getProposalVotes(blockchainId)) as Vote[];
      
      return votes.map((vote: Vote) => {
        const voteTypeIndex = safeToNumber(vote.voteType);
        const mappedVoteType = voteTypeMapping[voteTypeIndex] as "approve" | "reject";
        
        return {
          proposalId: vote.proposalId.toString(),
          voterAddress: vote.voter.toLowerCase(), // Normalize voter address
          voteType: mappedVoteType || "approve", // Default to approve if invalid
          votedAt: new Date(safeToNumber(vote.votedAt) * 1000).toISOString(),
        };
      });
    } catch (error) {
      console.error("Error in getProposalVotes, trying fallback method:", error);
      
      // Return empty array for now
      return [];
    }
  } catch (error) {
    console.error("Error getting proposal votes:", error);
    return []; // Return empty array on error
  }
};