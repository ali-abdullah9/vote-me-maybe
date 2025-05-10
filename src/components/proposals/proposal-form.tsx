/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, CheckCircle, HelpCircle } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCategory, PreviewProposal } from "@/types/proposal-form";

interface ProposalFormProps {
  itemVariants: any;
}

export const ProposalForm = ({ itemVariants }: ProposalFormProps) => {
  const router = useRouter();
  const { state, createProposal } = useAppContext();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProposalCategory>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  
  // Character count for description
  const characterCount = description.length;
  const maxCharacters = 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.currentUser.isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a proposal.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your proposal.",
        variant: "destructive",
      });
      return;
    }
    
    if (description.length > maxCharacters) {
      toast({
        title: "Description too long",
        description: `Your description exceeds the maximum of ${maxCharacters} characters.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // The category is appended to the title internally to keep contract simple
      // Format: [Category] Title
      const formattedTitle = category !== "general" 
        ? `[${category.charAt(0).toUpperCase() + category.slice(1)}] ${title}` 
        : title;
      
      await createProposal(formattedTitle, description);
      
      toast({
        title: "Proposal created",
        description: "Your proposal has been created successfully.",
      });
      
      router.push("/proposals");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error creating proposal",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sample proposal for the preview mode
  const previewProposal: PreviewProposal = {
    title: title || "Your Proposal Title",
    description: description || "Your proposal description will appear here. Make sure to provide detailed information about what you're proposing, why it matters, and how it should be implemented.",
    category: category,
    author: state.currentUser.address?.slice(0, 6) + "..." + state.currentUser.address?.slice(-4) || "0x1234...5678",
    date: new Date().toLocaleDateString(),
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-muted/50 border-b border-border rounded-t-lg rounded-b-none">
              <TabsTrigger value="write" className="data-[state=active]:bg-background/50">
                <FileText className="h-4 w-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-background/50">
                <CheckCircle className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="write" className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor="category" 
                      className="text-sm font-medium flex items-center"
                    >
                      Proposal Category
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover border-border">
                            <p className="max-w-xs">
                              Categorizing your proposal helps others find it more easily.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    {/* Category completion indicator */}
                    <span className={`text-xs ${category ? "text-green-500" : "text-muted-foreground"}`}>
                      {category ? "✓ Selected" : "Required"}
                    </span>
                  </div>
                  
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as ProposalCategory)}
                  >
                    <SelectTrigger className="bg-background/50 border-input focus:ring-primary/40">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor="title" 
                      className="text-sm font-medium flex items-center"
                    >
                      Proposal Title
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover border-border">
                            <p className="max-w-xs">
                              A good title is brief but descriptive (max 100 characters).
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    {/* Title completion indicator */}
                    <span className={`text-xs ${title.trim().length > 0 ? "text-green-500" : "text-muted-foreground"}`}>
                      {title.trim().length > 0 ? "✓ Added" : "Required"}
                    </span>
                  </div>
                  
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a clear, concise title"
                    className="bg-background/50 border-input focus:ring-primary/40"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor="description" 
                      className="text-sm font-medium flex items-center"
                    >
                      Proposal Description
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover border-border">
                            <p className="max-w-xs">
                              Include all relevant details to help voters make an informed decision.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    {/* Description length indicator */}
                    <span className={`text-xs ${
                      characterCount > maxCharacters 
                        ? "text-red-500" 
                        : characterCount > 0 
                          ? "text-green-500" 
                          : "text-muted-foreground"
                    }`}>
                      {characterCount}/{maxCharacters}
                    </span>
                  </div>
                  
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of your proposal..."
                    className="min-h-[200px] bg-background/50 border-input focus:ring-primary/40"
                  />
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="preview" className="p-6 border-t border-border">
              <div className="bg-background/30 rounded-lg p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {previewProposal.category.charAt(0).toUpperCase() + previewProposal.category.slice(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      By {previewProposal.author}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {previewProposal.date}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{previewProposal.title}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">
                    {previewProposal.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-6">
                <Button 
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={() => setActiveTab("write")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Editing
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        {activeTab === "write" && (
          <CardFooter className="flex justify-between border-t border-border p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/proposals")}
              disabled={isSubmitting}
              className="border-primary/20 hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim() || description.length > maxCharacters}
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 px-8"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Creating...
                </>
              ) : "Create Proposal"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};