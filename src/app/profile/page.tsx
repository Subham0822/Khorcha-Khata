"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="rounded-full border border-border/70 bg-muted/60 px-4 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          Loading your profile…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 animate-in fade-in-50">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
            <p className="text-xs text-muted-foreground">
              This is your little corner in Khorcha Khata. Make it feel like you.
            </p>
          </div>
          <span className="hidden rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
            Signed in with{" "}
            <span className="ml-1 font-semibold text-foreground">
              {user.email?.split("@")[1] || "Firebase"}
            </span>
          </span>
        </div>
        <Card className="mx-auto w-full max-w-2xl border border-border/70 bg-background/80 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              View and manage your account details. More customization coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border border-border/80">
                  <AvatarImage
                    src={user.photoURL || ""}
                    alt={user.displayName || "User Avatar"}
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/90 via-violet-500 to-sky-400 text-xl font-bold text-background">
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">
                    {user.displayName || "Your cool alias"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined the{" "}
                    <span className="font-semibold text-foreground">
                      Khorcha gang
                    </span>{" "}
                    to keep spends in check.
                  </p>
                </div>
              </Avatar>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              <span>
                Tip: Soon you’ll be able to add custom avatars and nicknames.
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="px-3 text-xs"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
