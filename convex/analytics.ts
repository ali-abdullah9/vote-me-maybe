// convex/analytics.ts
import { query } from "./_generated/server";

// Get overall voting statistics
export const getStats = query({
  handler: async (ctx) => {
    const proposals = await ctx.db.query("proposals").collect();
    const votes = await ctx.db.query("votes").collect();
    
    const totalProposals = proposals.length;
    const totalVotes = votes.length;
    
    // Count proposals by status
    const statusCounts = {
      active: 0,
      pending: 0,
      passed: 0,
      rejected: 0,
    };
    
    for (const proposal of proposals) {
      statusCounts[proposal.status as keyof typeof statusCounts]++;
    }
    
    return {
      totalProposals,
      totalVotes,
      statusCounts,
    };
  },
});

// Get vote distribution by proposal
export const getVoteDistribution = query({
  handler: async (ctx) => {
    const proposals = await ctx.db.query("proposals").collect();
    
    return proposals.map(proposal => ({
      id: proposal._id,
      name: proposal.title,
      votes: proposal.voteCount,
      totalParticipants: proposal.totalVotes,
    }));
  },
});

// Get vote activity over time
export const getVoteActivity = query({
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();
    
    // Group votes by day
    const votesPerDay: Record<string, number> = {};
    
    for (const vote of votes) {
      const day = new Date(vote.votedAt).toISOString().split('T')[0];
      votesPerDay[day] = (votesPerDay[day] || 0) + 1;
    }
    
    // Convert to array and sort by date
    return Object.entries(votesPerDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});