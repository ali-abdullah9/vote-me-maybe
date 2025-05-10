"use client";

import { 
  Info, 
  Wallet, 
  Lock, 
  BarChart2, 
  Shield, 
  Link as LinkIcon, 
  FileText, 
  Clock 
} from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export const faqItems: FAQItem[] = [
  {
    question: "What is VoteMeMaybe?",
    answer: "VoteMeMaybe is a decentralized voting platform that enables secure, transparent decision-making using blockchain technology. It allows communities to create and vote on proposals without needing to trust a central authority.",
    icon: <Info className="h-4 w-4 text-primary" />
  },
  {
    question: "Do I need cryptocurrency to vote?",
    answer: "You need a small amount of cryptocurrency to cover gas fees when voting or creating proposals. The exact amount will depend on network conditions at the time of your transaction.",
    icon: <Wallet className="h-4 w-4 text-primary" />
  },
  {
    question: "Can I change my vote?",
    answer: "No, once a vote is cast and confirmed on the blockchain, it cannot be changed or removed. This ensures the integrity of the voting process.",
    icon: <Lock className="h-4 w-4 text-primary" />
  },
  {
    question: "How are proposal results determined?",
    answer: "Proposals typically require a simple majority (more than 50% of votes) to pass. Once voting ends, the final status is determined based on these criteria and recorded on the blockchain.",
    icon: <BarChart2 className="h-4 w-4 text-primary" />
  },
  {
    question: "Is my voting history public?",
    answer: "Yes, all votes are recorded on the blockchain and are publicly visible. Your wallet address will be associated with your votes, but not your personal identity (unless you've publicly linked your wallet address to your identity elsewhere).",
    icon: <Shield className="h-4 w-4 text-primary" />
  },
  {
    question: "What if I disconnect my wallet?",
    answer: "If you disconnect your wallet, you won't be able to vote or create proposals until you reconnect. However, any votes you've already cast remain recorded on the blockchain.",
    icon: <LinkIcon className="h-4 w-4 text-primary" />
  },
  {
    question: "Can I delete a proposal I created?",
    answer: "No, once a proposal is submitted to the blockchain, it cannot be modified or deleted. This ensures transparency and prevents manipulation of the voting process.",
    icon: <FileText className="h-4 w-4 text-primary" />
  },
  {
    question: "How do I track my voting activity?",
    answer: "You can view your voting activity on your Dashboard or Profile page. This shows all proposals you've voted on and created.",
    icon: <Clock className="h-4 w-4 text-primary" />
  }
];