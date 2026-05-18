import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-semibold">S</span>
          <span className="font-display text-xl font-semibold tracking-tight">Safe Sipping</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <NavLink to="/log">Drink Log</NavLink>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      activeProps={{ className: "px-4 py-2 rounded-full bg-foreground text-background" }}
      activeOptions={{ exact: true }}
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted-foreground flex flex-wrap gap-4 justify-between">
        <p>© {new Date().getFullYear()} Pace. Educational tool — not medical advice.</p>
        <p>If you or someone you know is struggling, call <a className="underline hover:text-foreground" href="tel:988">988</a> or SAMHSA <a className="underline hover:text-foreground" href="tel:18006624357">1-800-662-4357</a>.</p>
      </div>
    </footer>
  );
}
