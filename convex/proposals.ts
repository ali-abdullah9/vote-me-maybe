// convex/proposals.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all proposals with default values for missing fields
export const getAll = query({
  handler: async (ctx) => {
    const proposals = await ctx.db.query("proposals").collect();
    
    // Fill in potentially missing fields with defaults
    return proposals.map(proposal => {
      // Handle approveCount and voteCount (backward compatibility)
      const approveCount = proposal.approveCount !== undefined 
        ? proposal.approveCount 
        : (proposal.voteCount !== undefined ? proposal.voteCount : 0);
      
      // Handle rejectCount
      const rejectCount = proposal.rejectCount !== undefined ? proposal.rejectCount : 0;
      
      // Handle voteCount (for backward compatibility)
      const voteCount = proposal.voteCount !== undefined 
        ? proposal.voteCount 
        : (approveCount !== undefined ? approveCount : 0);
      
      // Calculate totalVotes
      const calculatedTotal = approveCount + rejectCount;
      const totalVotes = proposal.totalVotes !== undefined 
        ? proposal.totalVotes 
        : (calculatedTotal > 0 ? calculatedTotal : 0);
      
      // Handle status
      const status = (proposal.status && 
        ["active", "passed", "rejected", "pending"].includes(proposal.status)) 
        ? proposal.status 
        : "active";
      
      return {
        ...proposal,
        approveCount,
        rejectCount,
        voteCount,
        totalVotes,
        status
      };
    });
  },
});

// Get proposals by status
export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
    
    // Fill in potentially missing fields with defaults
    return proposals.map(proposal => {
      // Handle approveCount and voteCount (backward compatibility)
      const approveCount = proposal.approveCount !== undefined 
        ? proposal.approveCount 
        : (proposal.voteCount !== undefined ? proposal.voteCount : 0);
      
      // Handle rejectCount
      const rejectCount = proposal.rejectCount !== undefined ? proposal.rejectCount : 0;
      
      // Handle voteCount (for backward compatibility)
      const voteCount = proposal.voteCount !== undefined 
        ? proposal.voteCount 
        : (approveCount !== undefined ? approveCount : 0);
      
      // Calculate totalVotes
      const calculatedTotal = approveCount + rejectCount;
      const totalVotes = proposal.totalVotes !== undefined 
        ? proposal.totalVotes 
        : (calculatedTotal > 0 ? calculatedTotal : 0);
      
      return {
        ...proposal,
        approveCount,
        rejectCount,
        voteCount,
        totalVotes
      };
    });
  },
});

// Get a single proposal by ID
export const getById = query({
  args: { id: v.id("proposals") },
  handler: async (ctx, args) => {
    const proposal = await ctx.db.get(args.id);
    if (!proposal) return null;
    
    // Handle approveCount and voteCount (backward compatibility)
    const approveCount = proposal.approveCount !== undefined 
      ? proposal.approveCount 
      : (proposal.voteCount !== undefined ? proposal.voteCount : 0);
    
    // Handle rejectCount
    const rejectCount = proposal.rejectCount !== undefined ? proposal.rejectCount : 0;
    
    // Handle voteCount (for backward compatibility)
    const voteCount = proposal.voteCount !== undefined 
      ? proposal.voteCount 
      : (approveCount !== undefined ? approveCount : 0);
    
    // Calculate totalVotes
    const calculatedTotal = approveCount + rejectCount;
    const totalVotes = proposal.totalVotes !== undefined 
      ? proposal.totalVotes 
      : (calculatedTotal > 0 ? calculatedTotal : 0);
    
    // Handle status
    const status = (proposal.status && 
      ["active", "passed", "rejected", "pending"].includes(proposal.status)) 
      ? proposal.status 
      : "active";
    
    return {
      ...proposal,
      approveCount,
      rejectCount,
      voteCount,
      totalVotes,
      status
    };
  },
});

// Create a new proposal
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const proposalId = await ctx.db.insert("proposals", {
      title: args.title,
      description: args.description,
      status: "active", // New proposals start as active
      approveCount: 0,
      rejectCount: 0,
      voteCount: 0,
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      createdBy: args.createdBy,
    });
    
    return proposalId;
  },
});

// Update a proposal's status
export const updateStatus = mutation({
  args: {
    id: v.id("proposals"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const proposal = await ctx.db.get(args.id);
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    
    return args.id;
  },
});