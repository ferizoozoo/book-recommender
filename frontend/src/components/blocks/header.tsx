import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-serif font-bold text-foreground">
            Bookrec
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="/library/search"
            className="text-foreground hover:text-primary transition-colors"
          >
            Search
          </a>
          <a
            href="/login"
            className="text-foreground hover:text-primary transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="text-foreground hover:text-primary transition-colors"
          >
            Register
          </a>
        </nav>
      </div>
    </header>
  );
}
