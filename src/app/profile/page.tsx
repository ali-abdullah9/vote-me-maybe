// src/app/profile/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { state, disconnectWallet } = useAppContext();
  const { currentUser, proposals, votes } = state;
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const handleDisconnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      disconnectWallet();
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected successfully.",
      });
      setIsLoading(false);
      router.push("/");
    }, 1000);
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
      };
    });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  if (!currentUser.isConnected) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Wallet to View Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Button 
              size="lg" 
              className="mt-2"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const statusColors = {
    active: "bg-green-700 text-green-100 dark:bg-green-700 dark:text-green-100",
    passed: "bg-blue-700 text-blue-100 dark:bg-blue-700 dark:text-blue-100",
    rejected: "bg-red-700 text-red-100 dark:bg-red-700 dark:text-red-100",
    pending: "bg-yellow-700 text-yellow-100 dark:bg-yellow-700 dark:text-yellow-100",
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="text-xl">
                  {currentUser.address?.slice(2, 4)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">Account</h1>
                  <Badge 
                    variant="outline" 
                    className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-xs"
                  >
                    Connected
                  </Badge>
                </div>
                
                <div className="mb-4 text-muted-foreground break-all">
                  {currentUser.address}
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/proposals")}>
                    Proposals
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDisconnect} 
                    disabled={isLoading}
                  >
                    {isLoading ? "Disconnecting..." : "Disconnect Wallet"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList className="mb-6">
          <TabsTrigger value="activity">Voting Activity</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Voting Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userVotingActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You have not voted on any proposals yet.</p>
                  <Button className="mt-4" variant="outline" asChild>
                    <a href="/proposals">Browse Proposals</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userVotingActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between rounded-md border p-4"
                    >
                      <div>
                        <div className="font-medium">{activity.proposal}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Voted on {formatDate(activity.votedAt)}
                        </div>
                      </div>
                      <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage how you receive notifications and updates about proposals and votes.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Email notifications for new proposals</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Vote confirmation notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span>Proposal status updates</span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" size="sm" className="mr-2">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}