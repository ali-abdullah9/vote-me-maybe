/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
// src/app/dashboard/page.tsx (enhanced)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/app-context";
import Link from "next/link";
import { 
  BarChart3, 
  Vote, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  Activity, 
  Users,
  ChevronRight,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function EnhancedDashboardPage() {
  const router = useRouter();
  const { state } = useAppContext();
  const { currentUser, proposals, votes } = state;
  const [activeTab, setActiveTab] = useState("activity");
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // User stats
  const userStats = {
    totalVotes: votes.filter((vote) => vote.voterAddress === currentUser.address).length,
    proposalsCreated: proposals.filter((p) => p.createdBy === currentUser.address).length,
    activeProposals: proposals.filter(
      (p) => p.createdBy === currentUser.address && p.status === "active"
    ).length,
    votingPower: 1000, // Mock value
  };
  
  // User voting activity
  const userVotingActivity = votes
    .filter((vote) => vote.voterAddress === currentUser.address)
    .map((vote) => {
      const proposal = proposals.find((p) => String(p.id) === String(vote.proposalId));
      return {
        id: vote.proposalId,
        proposal: proposal?.title || `Proposal #${vote.proposalId}`,
        votedAt: vote.votedAt,
        status: proposal?.status || "active",
        voteType: vote.voteType
      };
    });
  
  // User proposals
  const userProposals = proposals.filter(
    (proposal) => proposal.createdBy === currentUser.address
  );
  
  // Get the most active proposals
  const activeProposals = [...proposals]
    .filter(p => p.status === "active")
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 3);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  const statusColors = {
    active: "bg-green-700 text-green-100 dark:bg-green-700 dark:text-green-100",
    passed: "bg-blue-700 text-blue-100 dark:bg-blue-700 dark:text-blue-100",
    rejected: "bg-red-700 text-red-100 dark:bg-red-700 dark:text-red-100",
    pending: "bg-yellow-700 text-yellow-100 dark:bg-yellow-700 dark:text-yellow-100",
  };
  
  if (!isClient) {
    return <div className="container mx-auto p-8">Loading dashboard...</div>;
  }
  
  if (!currentUser.isConnected) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-lg bg-card/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Connect Wallet to View Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pb-8">
              <p className="text-gray-400 mb-6 text-center">
                Connect your wallet to access your personalized dashboard and view your voting activity.
              </p>
              <Button 
                size="lg" 
                className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your voting activity and proposals at a glance</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button 
            variant="outline" 
            className="border-primary/20 hover:bg-primary/5"
            onClick={() => router.push("/proposals")}
          >
            View Proposals
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
            onClick={() => router.push("/create")}
          >
            Create Proposal
          </Button>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-purple-500/10">
                <Vote className="h-4 w-4 text-purple-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Votes Cast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.totalVotes}</div>
              <div className="mt-2 text-xs text-gray-400">
                <span className={userStats.totalVotes > 0 ? "text-green-500" : "text-yellow-500"}>
                  {userStats.totalVotes > 0 ? "Active voter" : "No votes yet"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-blue-500/10">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Proposals Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.proposalsCreated}</div>
              <div className="mt-2 text-xs text-gray-400">
                <span className={userStats.proposalsCreated > 0 ? "text-green-500" : "text-yellow-500"}>
                  {userStats.proposalsCreated > 0 ? `${userStats.activeProposals} active now` : "Create your first proposal"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-green-500/10">
                <Activity className="h-4 w-4 text-green-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Active Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{proposals.filter(p => p.status === "active").length}</div>
              <div className="mt-2 text-xs text-gray-400">
                <span className="text-blue-500">
                  {proposals.filter(p => p.status === "pending").length} pending
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-purple-500/10">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Voting Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.votingPower}</div>
              <div className="mt-2 text-xs text-gray-400">
                <span className="text-green-500">
                  Full voting rights
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-card/60 backdrop-blur-sm p-1 border border-primary/10">
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Voting Activity
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              My Proposals
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Trending
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Recent Voting Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {userVotingActivity.length === 0 ? (
                  <div className="text-center py-12 max-w-md mx-auto">
                    <div className="p-4 rounded-full bg-primary/10 inline-flex mb-4">
                      <Vote className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mb-4 text-gray-400">You have not voted on any proposals yet.</p>
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/5" asChild>
                      <Link href="/proposals">Browse Proposals</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userVotingActivity.map((activity) => (
                      <div 
                        key={activity.id}
                        className="relative flex items-center gap-4 rounded-md border border-gray-800 bg-card/60 p-4 backdrop-blur-sm transition-all hover:bg-card/80"
                      >
                        <div className={`h-10 w-10 flex items-center justify-center rounded-full ${
                          activity.voteType === "approve" ? "bg-green-500/10" : "bg-red-500/10"
                        }`}>
                          {activity.voteType === "approve" ? 
                            <ThumbsUp className="h-5 w-5 text-green-500" /> : 
                            <ThumbsDown className="h-5 w-5 text-red-500" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.proposal}</div>
                          <div className="mt-1 text-sm text-gray-400">
                            Voted <span className={activity.voteType === "approve" ? "text-green-500" : "text-red-500"}>
                              {activity.voteType}
                            </span> on {formatDate(activity.votedAt)}
                          </div>
                        </div>
                        <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                          {activity.status}
                        </Badge>
                        <Link href={`/proposals/${activity.id}`}>
                          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="proposals">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">My Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                {userProposals.length === 0 ? (
                  <div className="text-center py-12 max-w-md mx-auto">
                    <div className="p-4 rounded-full bg-primary/10 inline-flex mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mb-4 text-gray-400">You have not created any proposals yet.</p>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90" asChild>
                      <a href="/create">Create Proposal</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userProposals.map((proposal) => (
                      <div 
                        key={proposal.id}
                        className="rounded-md border border-gray-800 bg-card/60 overflow-hidden"
                      >
                        <div className="flex items-center justify-between border-b border-gray-800 p-4">
                          <div>
                            <div className="font-medium">{proposal.title}</div>
                            <div className="mt-1 text-sm text-gray-400">
                              Created on {formatDate(proposal.createdAt)}
                            </div>
                          </div>
                          <Badge className={statusColors[proposal.status as keyof typeof statusColors]}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 flex justify-between text-sm">
                            <span>Votes: {proposal.voteCount}</span>
                            <span>
                              {(proposal.voteCount * 100 / (proposal.totalVotes || 1)).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={(proposal.voteCount * 100 / (proposal.totalVotes || 1))}
                            className="h-2 bg-gray-800"
                          />
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5" asChild>
                              <Link href={`/proposals/${proposal.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trending">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Trending Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                {activeProposals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No active proposals at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeProposals.map((proposal) => (
                      <Link href={`/proposals/${proposal.id}`} key={proposal.id}>
                        <div className="group rounded-md border border-gray-800 bg-card/60 p-4 transition-all hover:bg-card/80 hover:border-primary/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium group-hover:text-primary transition-colors">{proposal.title}</div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusColors.active}>
                                Active
                              </Badge>
                              <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="mb-3 text-sm text-gray-400 line-clamp-2">
                            {proposal.description}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">Ends in 3 days</span>
                            </div>
                            <div className="text-gray-400">
                              {proposal.totalVotes} votes
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    <div className="text-center mt-4">
                      <Button variant="outline" className="border-primary/20 hover:bg-primary/5" asChild>
                        <Link href="/proposals">
                          View All Proposals
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}