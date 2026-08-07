import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";

/**
 * Page shell used by every route: header + constrained content column.
 * The sidebar itself lives in the root route layout.
 */
export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full min-w-0 flex-col">
      <AppHeader title={title} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
