// src/components/wallet/connect-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Wallet } from "lucide-react";
import Link from "next/link";

export function ConnectWalletButton() {
  const { toast } = useToast();
  const context = useAppContext();
  
  // Check if context exists before destructuring
  if (!context) {
    return <Button>Connect Wallet</Button>;
  }
  
  const { currentUser, connectWallet, disconnectWallet } = context;
  
  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    connectWallet();
    toast({
      title: "Wallet connected",
      description: "Your wallet has been connected successfully.",
    });
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  if (currentUser.isConnected && currentUser.address) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {formatAddress(currentUser.address)}
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDisconnect}
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Disconnect wallet</span>
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}