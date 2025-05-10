// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Proposals table to store proposal data
  proposals: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(), // "active", "pending", "passed", "rejected"
    approveCount: v.number(), // Votes approving the proposal
    rejectCount: v.number(),  // Votes rejecting the proposal
    voteCount: v.number(),    // For backward compatibility (same as approveCount)
    totalVotes: v.number(),   // Total votes (approve + reject)
    createdAt: v.string(),
    createdBy: v.string(), // Wallet address of creator
  }).index("by_status", ["status"]),

  // Votes table to track user votes
  votes: defineTable({
    proposalId: v.id("proposals"),
    voterAddress: v.string(),
    voteType: v.string(), // "approve" or "reject"
    votedAt: v.string(),
  }).index("by_voter", ["voterAddress"])
    .index("by_proposal_and_voter", ["proposalId", "voterAddress"]),
});