import { Github, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-6 border-t border-border/60 bg-background/70 text-center text-xs text-muted-foreground backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em]">
            <Sparkles className="h-3 w-3 text-primary" />
            Made with care
          </span>
          <p className="hidden text-[11px] text-muted-foreground/90 sm:inline">
            Handcrafted by <span className="font-semibold text-foreground">Subham Rakshit</span>
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="https://github.com/Subham0822/Khorcha-Khata"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="mailto:rwik0822@gmail.com"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
