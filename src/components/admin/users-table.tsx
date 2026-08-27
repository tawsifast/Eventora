"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { RoleBadge, UserStatusBadge } from "@/components/status-badges";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateUserRole } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { User, UserRole } from "@/types";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "organizer", label: "Organizer" },
  { value: "admin", label: "Admin" },
];

export function AdminUsersTable({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleRoleChange(userId: string, role: UserRole) {
    if (savingId) return;
    setSavingId(userId);
    try {
      await updateUserRole(userId, role);
      toast.success(`Role changed to ${role}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change role");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  {u.id === currentUserId ? (
                    <span className="flex items-center gap-2">
                      <RoleBadge role={u.role} />
                      <span className="text-xs text-muted-foreground">(you)</span>
                    </span>
                  ) : (
                    <Select
                      value={u.role}
                      disabled={savingId !== null}
                      onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                    >
                      <SelectTrigger className="w-full max-w-[130px]" aria-label={`Role for ${u.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={u.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                  {formatDate(u.createdAt ?? u.joinedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}