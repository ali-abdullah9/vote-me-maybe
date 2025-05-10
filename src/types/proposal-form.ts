export interface PreviewProposal {
    title: string;
    description: string;
    category: string;
    author: string;
    date: string;
  }
  
  export type ProposalCategory = 'general' | 'governance' | 'technical' | 'financial' | 'community';