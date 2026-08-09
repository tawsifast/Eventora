import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
        {subtitle ? <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="eyebrow">{eyebrow ?? "EventHub"}</p>
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
          {subtitle ? <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="rule-gold" />
    </div>
  );
}
