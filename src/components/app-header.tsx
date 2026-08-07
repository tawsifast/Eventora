import { Bell, Search } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser } from "@/lib/mock-data";
import { toast } from "sonner";

export function AppHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-6">
      <SidebarTrigger className="shrink-0" />
      <Separator orientation="vertical" className="mr-1 hidden h-5 sm:block" />
      <h1 className="min-w-0 flex-1 truncate text-base font-semibold sm:text-lg">{title}</h1>

      <div className="relative hidden w-64 md:block">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search projects and tasks"
          aria-label="Global search"
          className="h-9 pl-9"
        />
      </div>

      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
        <Search className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative"
        onClick={() => toast("3 unread notifications")}
      >
        <Bell className="size-4" />
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive"
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Account menu">
            <Avatar className="size-7">
              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {currentUser.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toast("Profile is read-only in this demo")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast("Signed out (mock)")}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
