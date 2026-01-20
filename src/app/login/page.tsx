"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubIcon, GoogleIcon, Logo } from "@/components/icons";
import { signInWithGoogle, signInWithGitHub } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push('/');
      }
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/account-exists-with-different-credential') {
        toast({
          title: 'Sign-in Error',
          description: 'An account already exists with this email. Please sign in using the method you originally used.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign-in Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const user = await signInWithGitHub();
      if (user) {
        router.push('/');
      }
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/account-exists-with-different-credential') {
        toast({
          title: 'Sign-in Error',
          description: 'An account already exists with this email. Please sign in using the method you originally used.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign-in Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background/60">
        <div className="rounded-full border border-border/70 bg-muted/60 px-4 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          Getting your money story ready…
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="absolute inset-x-0 top-10 z-0 mx-auto flex max-w-xl justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Built for everyday Indian expenses
        </div>
      </div>
      <Card className="relative z-10 mx-auto flex w-full max-w-md flex-col overflow-hidden border border-border/70 bg-background/90 shadow-xl shadow-primary/10 backdrop-blur-lg animate-in fade-in-50 zoom-in-95">
        <CardHeader className="space-y-4 text-center pb-4 pt-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-violet-500 to-sky-400 shadow-lg shadow-primary/30">
            <div className="h-9 w-9 text-background">
              <Logo />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-sky-400 bg-clip-text text-transparent">
                Khorcha Khata
              </span>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              A fun, simple way to keep an eye on your everyday kharcha without
              losing your chill.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pb-6">
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-muted-foreground">
            <p className="font-medium text-xs text-primary">
              Why sign in?
            </p>
            <p>
              Your data is safely stored in your account so you can hop between
              devices and never lose track of your spendings.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 border border-border/80 bg-background/80 text-sm font-medium shadow-sm transition-all hover:-translate-y-[1px] hover:border-primary/60 hover:bg-primary/5 hover:shadow-md"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon className="mr-1 h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-2 border border-border/80 bg-background/80 text-sm font-medium shadow-sm transition-all hover:-translate-y-[1px] hover:border-primary/60 hover:bg-primary/5 hover:shadow-md"
              onClick={handleGitHubSignIn}
            >
              <GithubIcon className="mr-1 h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            By signing in, you agree to be a little more{" "}
            <span className="font-medium text-foreground">intentional</span>{" "}
            with your spending. No boring forms, just vibes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
