
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ContentSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  );
};
