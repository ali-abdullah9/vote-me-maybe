/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/app-context';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Share2,
  Download,
  RefreshCw,
  Calendar,
  Activity,
  Users,
  TrendingUp
} from 'lucide-react';

export default function EnhancedAnalyticsDashboard() {
  const { state } = useAppContext();
  const { proposals, votes } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('distribution');
  const [timeRange, setTimeRange] = useState('all');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    setIsClient(true);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  // Process data for charts
  const prepareVoteDistributionData = () => {
    return proposals.map(p => ({
      id: p._id.toString().substring(0, 6),
      name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
      approves: p.approveCount,
      rejects: p.rejectCount,
      totalVotes: p.totalVotes,
      approvalRate: p.totalVotes > 0 ? Math.round((p.approveCount / p.totalVotes) * 100) : 0,
    }));
  };
  
  const prepareStatusDistributionData = () => {
    const counts = {
      active: 0,
      passed: 0,
      rejected: 0,
      pending: 0,
    };
    
    for (const proposal of proposals) {
      counts[proposal.status] = (counts[proposal.status] || 0) + 1;
    }
    
    return Object.entries(counts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  };
  
  const prepareVoteActivityData = () => {
    // Group votes by day and count, separating approve/reject
    const votesPerDay: Record<string, { date: string, approves: number, rejects: number, total: number }> = {};
    
    for (const vote of votes) {
      const day = new Date(vote.votedAt).toISOString().split('T')[0];
      
      if (!votesPerDay[day]) {
        votesPerDay[day] = { 
          date: day, 
          approves: 0, 
          rejects: 0, 
          total: 0 
        };
      }
      
      votesPerDay[day].total += 1;
      
      if (vote.voteType === 'approve') {
        votesPerDay[day].approves += 1;
      } else if (vote.voteType === 'reject') {
        votesPerDay[day].rejects += 1;
      }
    }
    
    // Convert to array and sort by date
    return Object.values(votesPerDay).sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const prepareApprovalDistributionData = () => {
    // Define ranges for approval percentages
    const ranges = [
      { name: '0-20%', count: 0 },
      { name: '21-40%', count: 0 },
      { name: '41-60%', count: 0 },
      { name: '61-80%', count: 0 },
      { name: '81-100%', count: 0 },
    ];
    
    // Count proposals in each range
    for (const proposal of proposals) {
      if (proposal.totalVotes === 0) continue; // Skip proposals with no votes
      
      const approvalRate = Math.round((proposal.approveCount / proposal.totalVotes) * 100);
      
      if (approvalRate <= 20) ranges[0].count++;
      else if (approvalRate <= 40) ranges[1].count++;
      else if (approvalRate <= 60) ranges[2].count++;
      else if (approvalRate <= 80) ranges[3].count++;
      else ranges[4].count++;
    }
    
    return ranges;
  };
  
  // Prepare user engagement data
  const prepareUserEngagementData = () => {
    // Create a map of user addresses to their activity count
    const userActivity = new Map();
    
    // Count votes per user
    for (const vote of votes) {
      if (!vote.voterAddress) continue;
      
      const address = vote.voterAddress;
      if (!userActivity.has(address)) {
        userActivity.set(address, { votes: 0, proposals: 0 });
      }
      
      const userData = userActivity.get(address);
      userData.votes += 1;
      userActivity.set(address, userData);
    }
    
    // Count proposals per user
    for (const proposal of proposals) {
      if (!proposal.createdBy) continue;
      
      const address = proposal.createdBy;
      if (!userActivity.has(address)) {
        userActivity.set(address, { votes: 0, proposals: 0 });
      }
      
      const userData = userActivity.get(address);
      userData.proposals += 1;
      userActivity.set(address, userData);
    }
    
    // Convert to array of users with their activity levels
    const userEngagement = Array.from(userActivity.entries()).map(([address, data]) => ({
      address: `${address.slice(0, 6)}...${address.slice(-4)}`,
      votes: data.votes,
      proposals: data.proposals,
      total: data.votes + data.proposals
    }));
    
    // Sort by total activity (votes + proposals)
    return userEngagement.sort((a, b) => b.total - a.total).slice(0, 10);
  };
  
  const voteDistributionData = prepareVoteDistributionData();
  const statusDistributionData = prepareStatusDistributionData();
  const voteActivityData = prepareVoteActivityData();
  const approvalDistributionData = prepareApprovalDistributionData();
  const userEngagementData = prepareUserEngagementData();
  
  // Calculate totals for cards
  const totalApproveVotes = proposals.reduce((sum, p) => sum + p.approveCount, 0);
  const totalRejectVotes = proposals.reduce((sum, p) => sum + p.rejectCount, 0);
  const totalVotes = totalApproveVotes + totalRejectVotes;
  const overallApprovalRate = totalVotes > 0 
    ? Math.round((totalApproveVotes / totalVotes) * 100) 
    : 0;
  
  // Count unique participants
  const uniqueVoters = new Set(votes.map(vote => vote.voterAddress)).size;
  
  // Colors for charts
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  const STATUS_COLORS = {
    Active: '#10b981',   // Green
    Passed: '#3b82f6',   // Blue
    Rejected: '#ef4444', // Red
    Pending: '#f59e0b',  // Amber
  };

  // Format handler for dates in charts
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  // Handle time range change
  interface VoteActivityData {
    date: string;
    approves: number;
    rejects: number;
    total: number;
  }

  const filterDataByTimeRange = (data: VoteActivityData[]): VoteActivityData[] => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  // Apply time range filter to activity data
  const filteredActivityData = filterDataByTimeRange(voteActivityData);
  
  if (!isClient) {
    return <div className="container mx-auto p-6">Loading analytics...</div>;
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <motion.h1 
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analytics
        </motion.h1>
        <div className="flex items-center justify-center h-64">
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
            <p className="text-gray-400">Loading analytics...</p>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analytics Dashboard
        </motion.h1>
        
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-card/60 backdrop-blur-sm border-primary/10">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </motion.div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-purple-500/10">
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{proposals.length}</div>
              <div className="flex items-center mt-2 space-x-2 text-xs">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                  {proposals.filter(p => p.status === "passed").length} passed
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                  {proposals.filter(p => p.status === "rejected").length} rejected
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-blue-500/10">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVotes}</div>
              <div className="flex items-center mt-2 space-x-2 text-xs">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  {totalApproveVotes} approve
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                  {totalRejectVotes} reject
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2 p-2 rounded-full bg-green-500/10">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-400">
                Approval Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallApprovalRate}%</div>
              <div className="w-full h-2 mt-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${overallApprovalRate}%` }}
                ></div>
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
                Active Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{uniqueVoters}</div>
              <div className="mt-2 text-xs text-gray-400">
                <span>
                  {votes.length > 0 ? (totalVotes / uniqueVoters).toFixed(1) : "0"} votes per user
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-card/60 backdrop-blur-sm p-1 border border-primary/10">
            <TabsTrigger value="distribution" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vote Distribution
            </TabsTrigger>
            <TabsTrigger value="approval" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Approval Rates
            </TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Proposal Status
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Vote Activity
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Engagement
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Vote Distribution by Proposal</CardTitle>
                <CardDescription>Breakdown of approve and reject votes for each proposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={voteDistributionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        tick={{ fill: '#999' }}
                      />
                      <YAxis tick={{ fill: '#999' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        formatter={(value, name) => {
                          if (name === 'approvalRate') return [`${value}%`, 'Approval Rate'];
                          return [value, name.toString().charAt(0).toUpperCase() + name.toString().slice(1)];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="approves" name="Approve Votes" fill="#4ade80" />
                      <Bar dataKey="rejects" name="Reject Votes" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approval">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Approval Rate Distribution</CardTitle>
                <CardDescription>Number of proposals by approval percentage ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={approvalDistributionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" tick={{ fill: '#999' }} />
                      <YAxis tick={{ fill: '#999' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Number of Proposals" 
                        fill="#8884d8" 
                        label={{ position: 'top', fill: '#999' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="status">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Proposal Status Distribution</CardTitle>
                <CardDescription>Breakdown of proposals by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#666' }}
                      >
                        {statusDistributionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        formatter={(value) => [`${value} proposals`, 'Count']} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Vote Activity Over Time</CardTitle>
                <CardDescription>Tracking of voting patterns across time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fill: '#999' }}
                      />
                      <YAxis tick={{ fill: '#999' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        labelFormatter={(date) => {
                          return new Date(date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          });
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="approves"
                        name="Approve Votes"
                        stroke="#4ade80"
                        fill="#4ade80"
                        fillOpacity={0.3}
                        stackId="1"
                      />
                      <Area
                        type="monotone"
                        dataKey="rejects"
                        name="Reject Votes"
                        stroke="#f87171"
                        fill="#f87171"
                        fillOpacity={0.3}
                        stackId="1"
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Total Votes"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">Top User Engagement</CardTitle>
                <CardDescription>Most active participants by votes and proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userEngagementData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis type="number" tick={{ fill: '#999' }} />
                      <YAxis 
                        dataKey="address" 
                        type="category" 
                        tick={{ fill: '#999' }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="votes" 
                        name="Votes Cast" 
                        stackId="a" 
                        fill="#4ade80" 
                      />
                      <Bar 
                        dataKey="proposals" 
                        name="Proposals Created" 
                        stackId="a" 
                        fill="#8884d8" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}