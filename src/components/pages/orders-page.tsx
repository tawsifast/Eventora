"use client";

import { Receipt, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/section-heading";
import { EmptyState } from "@/components/states";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrdersByCustomer } from "@/data/orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export function OrdersPage() {
  const { user } = useAuth();
  const all = getOrdersByCustomer(user?.id ?? "");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      all.filter((o) => {
        const matchesQuery =
          !query ||
          o.eventTitle.toLowerCase().includes(query.toLowerCase()) ||
          o.id.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || o.status === status;
        return matchesQuery && matchesStatus;
      }),
    [all, query, status],
  );

  const totalSpent = all.reduce((sum, o) => (o.paymentStatus === "paid" ? sum + o.amount : sum), 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Purchase history"
        title="Your Orders"
        subtitle={`${all.length} orders · ${formatCurrency(totalSpent)} spent on EventHub`}
        action={
          <Button asChild variant="outline">
            <Link href="/tickets">Open ticket wallet</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by event or order ID"
            className="pl-9 sm:w-80"
            aria-label="Search orders"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="max-w-[220px] truncate font-medium">{o.eventTitle}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">{o.quantity}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-primary">
                      {formatCurrency(o.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success(`Receipt for ${o.id} downloaded`)}
                      >
                        <Receipt className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No orders found"
          description="Try a different search or clear your filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStatus("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}