// src/components/proposals/new-proposal-form.tsx
'use client';

import { useState } from 'react';

interface NewProposalFormProps {
  onSubmit: (description: string) => Promise<void>;
  isLoading: boolean;
}

export function NewProposalForm({ onSubmit, isLoading }: NewProposalFormProps) {
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    try {
      await onSubmit(description);
      setDescription('');
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Create New Proposal
      </h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="description"
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
        >
          Proposal Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your proposal..."
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.375rem",
            border: "1px solid #D1D5DB",
            minHeight: "100px",
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !description.trim()}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: isLoading ? "#818CF8" : "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          fontWeight: "500",
          cursor: isLoading ? "default" : "pointer",
        }}
      >
        {isLoading ? "Creating..." : "Create Proposal"}
      </button>
    </form>
  );
}