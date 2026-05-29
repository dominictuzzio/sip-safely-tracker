import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { RotatingFact } from "@/components/RotatingFact";
import heroStillLife from "@/assets/hero-still-life.jpg";
import indexFriends from "@/assets/index-friends.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Smarter Sipping — Drink smart, stay safe" },
      { name: "description", content: "Sip safely. Learn how alcohol affects your body, recognize binge drinking, and track drinks safely." },
    ],
  }),
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">A gentle guide to drinking</p>
              <h1 className="font-display text-6xl md:text-8xl leading-[0.95] font-semibold">
                Know how to <em className="text-primary not-italic">sip smarter</em>.<br />
                Enjoy the night.
              </h1>
              <p className="mt-8 text-lg text-muted-foreground max-w-xl">
                Smart Sipping helps you understand what alcohol does to your body — and quietly times your next drink so you stay in the safe zone.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/log" className="inline-flex items-center px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition">
                  Start a drink log →
                </Link>
                <Link to="/learn" className="inline-flex items-center px-6 py-3 rounded-full border border-border bg-card hover:bg-secondary transition">
                  Learn the basics
                </Link>
              </div>
            </div>
            <div className="md:col-span-4">
              <RotatingFact />
            </div>
          </div>
        </section>


        {/* Editorial image band */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <figure className="rounded-[2rem] overflow-hidden border border-border">
            <img
              src={heroStillLife}
              alt="A tall glass of water beside an empty wine glass on warm linen, soft morning light"
              width={1920}
              height={1080}
              className="w-full h-[42vh] md:h-[56vh] object-cover"
            />
          </figure>
          <figcaption className="mt-4 text-sm text-muted-foreground max-w-xl">
            One for the body, one for the night. Alternating water with alcohol is the single easiest habit that keeps you in the safe zone.
          </figcaption>
        </section>


        {/* Three pillars */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
          <h2 className="font-display text-4xl md:text-5xl mb-12 max-w-2xl">Three things worth knowing before you pour another.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                k: "01",
                title: "A standard drink isn't what you think",
                body: "12oz beer, 5oz wine, and a 1.5oz shot all contain about 14g of pure alcohol. A craft IPA or a mixed cocktail often counts as more.",
              },
              {
                k: "02",
                title: "Binge drinking has a definition",
                body: "4+ drinks for women or 5+ for men within ~2 hours pushes most people over 0.08% BAC. That's the legal limit for driving — and well into impairment.",
              },
              {
                k: "03",
                title: "Pacing changes everything",
                body: "Water between drinks, food in your stomach, and a one-drink-per-hour rhythm let your body keep up.",
              },
            ].map((c) => (
              <div key={c.k} className="rounded-3xl bg-card border border-border p-8 hover:shadow-md transition-shadow">
                <p className="text-sm text-accent font-medium">{c.k}</p>
                <h3 className="font-display text-2xl mt-4 leading-snug">{c.title}</h3>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lifestyle band */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <figure className="md:col-span-3 rounded-[2rem] overflow-hidden border border-border">
              <img
                src={indexFriends}
                alt="Overhead view of friends clinking sparkling-water glasses over a shared dinner in warm evening light"
                width={1536}
                height={1024}
                loading="lazy"
                className="w-full h-[36vh] md:h-[48vh] object-cover"
              />
            </figure>
            <div className="md:col-span-2">
              <h3 className="font-display text-3xl md:text-4xl leading-tight">The night doesn't have to revolve around alcohol.</h3>
              <p className="mt-4 text-muted-foreground">A glass of soda water with lime looks the same as a cocktail — and your friends almost never notice. Pace yourself, and the evening lasts longer.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-[2rem] bg-primary text-primary-foreground p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl max-w-xl leading-tight">Ready to sip smarter?</h2>
              <p className="opacity-80 mt-4 max-w-md">Log a drink, get a personalized timer for the next one. Resets every morning.</p>
            </div>
            <Link to="/log" className="inline-flex shrink-0 items-center px-7 py-4 rounded-full bg-background text-foreground font-medium hover:scale-[1.02] transition">
              Open the log →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
