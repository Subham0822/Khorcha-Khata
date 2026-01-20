"use client";

import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background/90">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 animate-in fade-in-50">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            <p className="text-xs text-muted-foreground">
              Tiny tweaks, big vibes. Tune Khorcha Khata to match your mood.
            </p>
          </div>
          <span className="hidden rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
            Current theme:{" "}
            <span className="ml-1 capitalize text-foreground">
              {theme === "system" ? "System" : theme || "Light"}
            </span>
          </span>
        </div>
        <Card className="mx-auto w-full max-w-2xl border border-border/70 bg-background/80 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your application. More controls
              coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border border-dashed border-primary/25 bg-primary/5 px-3 py-2">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle between light and dark themes instantly.
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
