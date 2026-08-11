import { CalendarDays } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Event } from "@/types";

/**
 * Event artwork that gracefully falls back to a branded gradient placeholder
 * when the backend hasn't provided an image URL (imageUrl is null).
 */
export function EventImage({
  event,
  sizes,
  priority,
  className,
}: {
  event: Pick<Event, "title" | "imageUrl">;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (event.imageUrl) {
    return (
      <Image
        src={event.imageUrl}
        alt={event.title}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <div
      aria-label={`${event.title} artwork placeholder`}
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 via-primary/10 to-transparent",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <CalendarDays className="size-10 text-primary/70" />
        <span className="line-clamp-2 font-display text-sm text-primary/80">{event.title}</span>
      </div>
    </div>
  );
}
