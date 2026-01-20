"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./icons";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b-[3px] border-[color:rgb(15_23_42)] bg-secondary px-4 sm:px-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 rounded-md border-[2px] border-[color:rgb(15_23_42)] bg-card px-3 py-1.5 text-sm font-semibold shadow-[3px_3px_0_0_rgb(15_23_42)] transition-transform hover:-translate-y-0.5"
      >
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm bg-primary text-primary-foreground">
          <div className="relative h-5 w-5 scale-95">
            <Logo />
          </div>
        </div>
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-foreground">
          Khorcha Khata
        </span>
      </Link>

      <div className="relative ml-auto flex-1 md:grow-0" />

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative overflow-hidden rounded-md border-[2px] border-[color:rgb(15_23_42)] bg-card p-[2px] shadow-[3px_3px_0_0_rgb(15_23_42)] transition-transform hover:-translate-y-0.5"
            >
              <Avatar className="relative h-9 w-9 border border-background/60 rounded-sm">
                <AvatarImage
                  src={user.photoURL || "https://picsum.photos/40/40"}
                  alt={user.displayName || "User avatar"}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/90 via-violet-500 to-sky-400 text-xs font-bold text-background">
                  {user.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs">
              <span className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Signed in as
              </span>
              <span className="line-clamp-1 text-sm font-semibold">
                {user.displayName || "My Account"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
