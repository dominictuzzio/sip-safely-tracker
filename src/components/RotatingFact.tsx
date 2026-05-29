import { useEffect, useState } from "react";

const FACTS: { header: React.ReactNode; subtext?: string }[] = [
  {
    header: (
      <>
        The liver clears about <span className="text-primary">one standard drink</span> per hour.
      </>
    ),
    subtext:
      "Drinking faster than that means alcohol builds up in your blood — that's how a fun night turns risky.",
  },
  {
    header: (
      <>
        Over the 10 years from 2015–2024, more than <span className="text-primary">11,500 people</span> died every year in drunk-driving crashes.
      </>
    ),
    subtext:
      "In every state, it's illegal to drive drunk, yet one person was killed in a drunk-driving crash every 44 minutes in the United States in 2024.",
  },
  {
    header: (
      <>
        <span className="text-primary">804,926 Americans</span> were arrested for suspected DUI in 2024 — about 11% of all arrests nationwide.
      </>
    ),
  },
  {
    header: (
      <>
        Drunk driving crashes drain <span className="text-primary">$58 billion</span> from the U.S. economy annually.
      </>
    ),
    subtext: "One DUI can cost a single offender as much as $30,000 in legal fees and penalties.",
  },
];

export function RotatingFact() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % FACTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const f = FACTS[i];
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-sm min-h-[220px] flex flex-col">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Quick fact</p>
      <p key={`h-${i}`} className="font-display text-3xl mt-3 leading-tight animate-in fade-in duration-700">
        {f.header}
      </p>
      {f.subtext && (
        <p key={`s-${i}`} className="text-sm text-muted-foreground mt-4 animate-in fade-in duration-700">
          {f.subtext}
        </p>
      )}
      <div className="mt-auto pt-4 flex gap-1.5">
        {FACTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Show fact ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
