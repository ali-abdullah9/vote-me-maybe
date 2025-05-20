// src/components/proposals/enhanced-vote-visualization.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VoteVisualizationProps {
  approveCount: number;
  rejectCount: number;
  totalVotes: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  animated?: boolean;
}

export function EnhancedVoteVisualization({
  approveCount,
  rejectCount,
  totalVotes,
  className,
  size = 'md',
  animated = true,
}: VoteVisualizationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate percentages
  const approvalPercentage = totalVotes > 0 
    ? Math.round((approveCount / totalVotes) * 100) 
    : 0;
  
  const rejectionPercentage = totalVotes > 0 
    ? Math.round((rejectCount / totalVotes) * 100) 
    : 0;
  
  // Determine sizes based on the size prop
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];
  
  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className={cn("font-medium flex items-center", textSizeClass)}>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Approve
        </span>
        <span className={cn("font-medium", textSizeClass)}>{approvalPercentage}%</span>
      </div>
      
      <div className={cn("w-full bg-muted rounded-full overflow-hidden mb-2", heightClass)}>
        {animated ? (
          <motion.div 
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${approvalPercentage}%` : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${approvalPercentage}%` }}
          />
        )}
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <span className={cn("font-medium flex items-center", textSizeClass)}>
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Reject
        </span>
        <span className={cn("font-medium", textSizeClass)}>{rejectionPercentage}%</span>
      </div>
      
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", heightClass)}>
        {animated ? (
          <motion.div 
            className="h-full bg-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${rejectionPercentage}%` : 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          />
        ) : (
          <div 
            className="h-full bg-red-500 rounded-full" 
            style={{ width: `${rejectionPercentage}%` }}
          />
        )}
      </div>
      
      {totalVotes > 0 && (
        <div className="flex justify-center mt-2">
          <span className={cn("text-muted-foreground", textSizeClass)}>
            Total votes: {totalVotes}
          </span>
        </div>
      )}
    </div>
  );
}

// Radial vote visualization (donut chart)
export function RadialVoteVisualization({
  approveCount,
  rejectCount,
  totalVotes,
  className,
  size = 160,
  animated = true,
}: VoteVisualizationProps & { size?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate percentages
  const approvalPercentage = totalVotes > 0 
    ? (approveCount / totalVotes) * 100 
    : 0;
  
  const rejectionPercentage = totalVotes > 0 
    ? (rejectCount / totalVotes) * 100 
    : 0;
  
  // SVG parameters
  const radius = size / 2;
  const strokeWidth = size / 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate stroke dasharray for each portion
  const approveStrokeDasharray = `${(approvalPercentage / 100) * circumference} ${circumference}`;
  const rejectStrokeDasharray = `${(rejectionPercentage / 100) * circumference} ${circumference}`;
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeOpacity={0.1}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-gray-300 dark:text-gray-700"
        />
        
        {/* Reject portion */}
        {animated ? (
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={rejectStrokeDasharray}
            strokeDashoffset={isVisible ? 0 : circumference}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-red-500"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isVisible ? 0 : circumference }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          />
        ) : (
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={rejectStrokeDasharray}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-red-500"
          />
        )}
        
        {/* Approve portion */}
        {animated ? (
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={approveStrokeDasharray}
            strokeDashoffset={isVisible ? 0 : circumference}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-green-500"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isVisible ? 0 : circumference }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
        ) : (
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={approveStrokeDasharray}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-green-500"
          />
        )}
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {totalVotes > 0 ? (
          <>
            <p className="text-2xl font-bold">{Math.round(approvalPercentage)}%</p>
            <p className="text-xs text-muted-foreground">Approval Rate</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No votes yet</p>
        )}
      </div>
    </div>
  );
}