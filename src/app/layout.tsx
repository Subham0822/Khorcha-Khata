import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";

const brSonoma = localFont({
  src: [
    {
      path: "../../font/br-sonoma/BRSonoma-Regular-BF654c45266c042.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../font/br-sonoma/BRSonoma-SemiBold-BF654c45268c340.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-br-sonoma",
});

export const metadata: Metadata = {
  title: "Khorcha Khata",
  description: "A simple, attractive expense tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${brSonoma.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="pointer-events-none fixed inset-0 z-0 opacity-60 mix-blend-soft-light">
                <div className="absolute -left-40 top-[-10rem] h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
                <div className="absolute -right-32 bottom-[-6rem] h-72 w-72 rounded-full bg-sky-400/40 blur-3xl" />
              </div>
              <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(0_0%_100%_/_0.04)_1px,_transparent_0)] bg-[length:22px_22px]" />
              <div className="relative z-10 flex min-h-screen flex-col">
                {children}
                <Toaster />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
