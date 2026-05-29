import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import learnGlass from "@/assets/learn-glass.jpg";


export const Route = createFileRoute("/learn")({
  component: LearnPage,
  head: () => ({
    meta: [
      { title: "Learn — Binge drinking & alcohol abuse | Smarter Sipping" },
      { name: "description", content: "Understand binge drinking, alcohol abuse, BAC, and how to stay safer when you drink." },
    ],
  }),
});

const SECTIONS = [
  {
    id: "binge",
    eyebrow: "Section 01",
    title: "What counts as binge drinking?",
    body: "The NIAAA defines binge drinking as a pattern that brings BAC to 0.08% or higher — typically 5+ drinks for men or 4+ for women within about 2 hours. It's the most common pattern of excessive drinking in the U.S., and most people who binge drink are not alcohol dependent.",
    points: [
      "1 in 6 U.S. adults binge drinks, about 4 times a month on average.",
      "Binge drinking is linked to injuries, alcohol poisoning, violence, and unintended pregnancies.",
      "Repeated binges damage the heart, liver, brain, and immune system over time.",
    ],
  },
  {
    id: "abuse",
    eyebrow: "Section 02",
    title: "When drinking becomes alcohol use disorder",
    body: "Alcohol Use Disorder (AUD) is a medical condition — not a moral failing — defined by the inability to stop or control drinking despite harm. It exists on a spectrum from mild to severe.",
    points: [
      "Drinking more, or longer, than intended.",
      "Strong cravings or urges to drink.",
      "Continuing to drink even when it causes relationship, work, or health problems.",
      "Needing more alcohol to feel the same effect (tolerance).",
      "Withdrawal symptoms — shakiness, sweating, anxiety — when not drinking.",
    ],
  },
  {
    id: "bac",
    eyebrow: "Section 03",
    title: "How your body processes alcohol",
    body: "Alcohol enters your bloodstream within minutes. Your liver metabolizes roughly one standard drink per hour — and there's no shortcut. Coffee, cold showers, and food after the fact don't speed it up.",
    points: [
      "0.02% — Light relaxation, slight warmth.",
      "0.05% — Reduced coordination, lowered alertness.",
      "0.08% — Legally impaired in most U.S. states. Reaction time clearly slowed.",
      "0.15% — Major loss of balance, vomiting likely.",
      "0.30%+ — Risk of unconsciousness, alcohol poisoning, and even <strong>death</strong>.",
    ],
  },
  {
    id: "safer",
    eyebrow: "Section 04",
    title: "Drinking more safely",
    body: "If you choose to drink, these habits dramatically lower your risk of harm tonight — and long-term.",
    points: [
      "Eat before and while you drink. Food slows absorption.",
      "Alternate every alcoholic drink with a full glass of water.",
      "Set a number before you start. Stop there.",
      "Never mix alcohol with opioids, benzodiazepines, or stimulants.",
      "Don't drive. Plan your ride home before the first drink.",
      "Stay with people you trust. Look out for each other.",
    ],
  },
  {
    id: "help",
    eyebrow: "Section 05",
    title: "When to ask for help",
    body: "If drinking is starting to feel like something you can't control, you're not alone — and reaching out is the strongest move you can make.",
    points: [
      "SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7).",
      "988 Suicide & Crisis Lifeline — call or text 988.",
      "Talk to a primary care doctor — AUD is treatable.",
      "Mutual support: AA, SMART Recovery, LifeRing.",
    ],
  },
];

function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <header className="mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Learn</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
            The honest stuff about <em className="text-primary not-italic">alcohol</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            No lectures, no shame. Just what's actually happening in your body and what the data says about staying safe.
          </p>
        </header>

        <nav className="mb-16 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background transition">
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-24">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">{s.eyebrow}</p>
              <h2 className="font-display text-3xl md:text-4xl mt-3 leading-tight">{s.title}</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">{s.body}</p>
              <ul className="mt-6 space-y-3">
                {s.points.map((p, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border">
                    <span className="font-display text-primary text-lg mt-[-2px]">·</span>
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
