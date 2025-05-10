// convex/votes.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all votes (without filtering by proposal)
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("votes").collect();
  },
});

// Get votes by a user
export const getByVoter = query({
  args: { voterAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_voter", (q) => q.eq("voterAddress", args.voterAddress))
      .collect();
  },
});

// Get votes by proposal
export const getByProposal = query({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_proposal_and_voter", (q) => q.eq("proposalId", args.proposalId))
      .collect();
  },
});

// Cast a vote
export const castVote = mutation({
  args: {
    proposalId: v.id("proposals"),
    voterAddress: v.string(),
    voteType: v.string(), // "approve" or "reject"
  },
  handler: async (ctx, args) => {
    console.log("Convex castVote called with:", args);
    
    // Normalize the voter address to lowercase for consistent comparison
    const normalizedVoterAddress = args.voterAddress.toLowerCase();
    
    // Check if user has already voted on this proposal
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_proposal_and_voter", (q) => 
        q.eq("proposalId", args.proposalId)
         .eq("voterAddress", normalizedVoterAddress)
      )
      .first();
    
    if (existingVote) {
      console.log("User has already voted on this proposal in Convex:", existingVote);
      throw new Error("User has already voted on this proposal");
    }
    
    // Validate vote type
    if (args.voteType !== "approve" && args.voteType !== "reject") {
      throw new Error("Invalid vote type");
    }
    
    // Get the proposal
    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) {
      console.log("Proposal not found in Convex:", args.proposalId);
      throw new Error("Proposal not found");
    }
    
    console.log("Found proposal in Convex:", proposal);
    
    // Check if proposal is active
    if (proposal.status !== "active") {
      console.log("Cannot vote on inactive proposal:", proposal.status);
      throw new Error("Cannot vote on inactive proposal");
    }
    
    try {
      // Create the vote with normalized address
      const voteId = await ctx.db.insert("votes", {
        proposalId: args.proposalId,
        voterAddress: normalizedVoterAddress,
        voteType: args.voteType,
        votedAt: new Date().toISOString(),
      });
      
      console.log("Vote inserted in Convex with ID:", voteId);
      
      // Prepare the update for the proposal based on vote type
      const updateFields: {
        approveCount?: number,
        rejectCount?: number,
        voteCount?: number, // For backward compatibility
        totalVotes: number
      } = {
        totalVotes: (proposal.totalVotes || 0) + 1,
      };
      
      if (args.voteType === "approve") {
        updateFields.approveCount = (proposal.approveCount || 0) + 1;
        updateFields.voteCount = (proposal.voteCount || 0) + 1; // For backward compatibility
      } else {
        updateFields.rejectCount = (proposal.rejectCount || 0) + 1;
      }
      
      console.log("Updating proposal with fields:", updateFields);
      
      // Update the proposal vote count based on vote type
      await ctx.db.patch(args.proposalId, updateFields);
      
      return voteId;
    } catch (error) {
      console.error("Error in Convex castVote:", error);
      throw error;
    }
  },
});