import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventStatus, OrderStatus, PaymentStatus, TicketStatus, UserRole, UserStatus } from "@/types";

const base = "border font-medium capitalize";

const eventStyles: Record<EventStatus, string> = {
  upcoming: "border-info/30 bg-info/10 text-info",
  ongoing: "border-success/30 bg-success/10 text-success",
  completed: "border-border bg-muted text-muted-foreground",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function EventStatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(base, eventStyles[status], className)}>
      {status}
    </Badge>
  );
}

const orderStyles: Record<OrderStatus, string> = {
  pending: "border-warning/40 bg-warning/10 text-warning-foreground",
  confirmed: "border-success/30 bg-success/10 text-success",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn(base, orderStyles[status])}>
      {status}
    </Badge>
  );
}

const paymentStyles: Record<PaymentStatus, string> = {
  paid: "border-success/30 bg-success/10 text-success",
  unpaid: "border-warning/40 bg-warning/10 text-warning-foreground",
  refunded: "border-border bg-muted text-muted-foreground",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={cn(base, paymentStyles[status])}>
      {status}
    </Badge>
  );
}

const ticketStyles: Record<TicketStatus, string> = {
  valid: "border-success/30 bg-success/10 text-success",
  used: "border-border bg-muted text-muted-foreground",
  refunded: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant="outline" className={cn(base, ticketStyles[status])}>
      {status}
    </Badge>
  );
}

const roleStyles: Record<UserRole, string> = {
  user: "border-border bg-muted text-muted-foreground",
  organizer: "border-primary/30 bg-primary/10 text-primary",
  admin: "border-info/30 bg-info/10 text-info",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant="outline" className={cn(base, roleStyles[role])}>
      {role}
    </Badge>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        base,
        status === "active"
          ? "border-success/30 bg-success/10 text-success"
          : "border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      {status}
    </Badge>
  );
}

export function CategoryBadge({ name, className }: { name: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent bg-background/90 font-medium text-foreground backdrop-blur", className)}
    >
      {name}
    </Badge>
  );
}
