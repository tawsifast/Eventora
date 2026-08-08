import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 14,
  showValue = false,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`${rating} out of 5 stars`}>
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i <= Math.round(rating) ? "fill-warning text-warning" : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      {showValue && <span className="text-sm font-medium">{rating.toFixed(1)}</span>}
    </span>
  );
}
