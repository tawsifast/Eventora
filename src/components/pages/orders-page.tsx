"use client";

import { Receipt, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/section-heading";
import { EmptyState } from "@/components/states";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/types";
import Link from "next/link";

export function OrdersPage() {
  const { user } = useAuth();
  const [all, setAll] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    if (!user) return;
    getMyOrders()
      .then(setAll)
      .catch((error) => toast.error(error.message ?? "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = useMemo(
    () =>
      all.filter((o) => {
        const matchesQuery =
          !query ||
          (o.event?.title ?? "Event").toLowerCase().includes(query.toLowerCase()) ||
          o.id.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || String(o.status).toLowerCase() === status;
        return matchesQuery && matchesStatus;
      }),
    [all, query, status],
  );

  const totalSpent = all.reduce((sum, o) => (String(o.paymentStatus).toLowerCase() === "paid" ? sum + o.amount : sum), 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-14 lg:px-8 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Purchase history"
          title="Your Orders"
          subtitle={`${loading ? "…" : all.length} orders · ${loading ? "…" : formatCurrency(totalSpent)} spent on Eventora`}
        />
        <Button asChild variant="outline" className="w-full sm:w-auto shrink-0">
          <Link href="/tickets">Open ticket wallet</Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by event or order ID"
                className="pl-9 w-full"
                aria-label="Search orders"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
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
            <>
              {/* Mobile Card Layout (No horizontal scrolling) */}
              <div className="space-y-4 md:hidden">
                {filtered.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Order #{o.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                      </div>
                      <span className="font-semibold text-primary">{formatCurrency(o.amount)}</span>
                    </div>

                    <div>
                      <h4 className="font-medium text-base truncate">{o.event?.title ?? "Event"}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Quantity: {o.quantity}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex gap-2">
                        <OrderStatusBadge status={o.status} />
                        <PaymentStatusBadge status={o.paymentStatus} />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => toast.success(`Receipt for ${o.id} downloaded`)}
                      >
                        <Receipt className="size-3.5" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card">
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
                        <TableCell className="max-w-[220px] truncate font-medium">{o.event?.title ?? "Event"}</TableCell>
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
            </>
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
        </>
      )}
    </div>
  );
}