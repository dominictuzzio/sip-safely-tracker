import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About SS— Meet the team | Smarter Sipping" },
      { name: "description", content: "Meet the co-founders behind Smarter Sipping: Dominic Tuzzio and David Ellman." },
      { property: "og:title", content: "About — Meet the team | Smarter Sipping" },
      { property: "og:description", content: "Meet the co-founders behind Smarter Sipping." },
    ],
  }),
});

const TEAM = [
  {
    name: "Dominic Tuzzio",
    role: "Co-Founder & Head of Web Development",
    initials: "DT",
    bio: "Hello, my name is Dominc Tuzzio and I’m a freshman at Redwood High School. I enjoy playing soccer, being with friends, and riding bikes. Helping reduce alcohol harm interested me because of multiple reasons. One reason is because I notice that alcohol intake usually results in an unhealthy/harmful night so I wanted to provide a tool to help people drink safely. Also I notice that the main  so-called “solution” of giving a lecture about why alcohol is bad for you doesn't seem to be effective. Actually psychologists found that when the brain is being lectured, it partially turns off and blocks the lecture out. I decided to start helping instead of lecturing people, but by providing a website and information about how to intake alcohol safely.",
    focus: ["Product engineering", "BAC modeling", "Design systems"],
  },
  {
    name: "David Ellman",
    role: "Co-Founder & Media Orgnizer",
    initials: "DE",
    bio: "Hi, I’m David Ellman, a freshman at Redwood High School. Outside of class, you can usually find me playing sports, exploring the outdoors around Marin, and hanging out with my friends. I chose this as my project topic because I have noticed the unhealthy coping mechanisms like binge drinking have been normalized in the community surrounding me. By building this interactive and educational website and social media page with Dominic, our goal is to provide information, tools, and awareness to reduce binge drinking and increase overall alcohol safety. We will work step by step no matter how long it takes to see improvement, but I have a genuine desire to make our community a safer and healthier place for everyone.",
    focus: ["Brand & messaging", "Partnerships", "Storytelling"],
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <header className="mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">About</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
            The people behind <em className="text-primary not-italic">Smarter Sipping</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Smarter Sipping started with a simple idea: people deserve clear, judgment-free information about what alcohol actually does to them — and tools to act on it.
          </p>
        </header>

        <div className="space-y-10">
          {TEAM.map((m) => (
            <article key={m.name} className="rounded-3xl border border-border bg-card p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl font-semibold">
                  {m.initials}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-3xl md:text-4xl leading-tight">{m.name}</h2>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-accent font-medium">{m.role}</p>
                  <p className="mt-5 text-muted-foreground leading-relaxed">{m.bio}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {m.focus.map((f) => (
                      <li key={f} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
