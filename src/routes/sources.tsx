import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";

export const Route = createFileRoute("/sources")({
  component: SourcesPage,
  head: () => ({
    meta: [
      { title: "Sources & Citations — Smarter Sipping" },
      { name: "description", content: "Research, data, and references cited throughout Smarter Sipping." },
    ],
  }),
});

const CITATIONS: { text: string; url?: string }[] = [
  {
    text:
      'Michel, Noa. "Behind the High Health Rankings: Why Teen Substance Abuse Thrives in Marin County." The Pitch, 2026. Accessed 20 May 2026.',
    url: "https://awhspitch.com/14648/in-depth/substanceabuse/",
  },
  {
    text: '"Marin Ranked Healthiest County in State." Marin County, 30 Aug. 2024. Accessed 20 May 2026.',
    url: "https://www.marincounty.gov/news-releases/marin-ranked-healthiest-county-state-0",
  },
  {
    text:
      '"Marin Voice: Riotous Teen Behavior a Reminder of Communication Tools Parents Need." Marin Prevention Network, 18 Nov. 2022.',
    url: "https://marinprevention.org/marin-voice-riotous-teen-behavior-a-reminder-of-communication-tools-parents-need/",
  },
  {
    text: 'Healthy Marin. "Marin Healthy Youth Partnerships." Marin Healthy Youth Partnerships, 2019. Accessed 20 May 2026.',
    url: "https://www.mhyp.org/data-research",
  },
  {
    text: '"Marin 2nd Healthiest County in California." Marin Health and Human Services, 2016. Accessed 20 May 2026.',
    url: "https://www.marinhhs.org/blog/marin-2nd-healthiest-county-california",
  },
  {
    text:
      '"Understanding Binge Drinking." National Institute on Alcohol Abuse and Alcoholism, U.S. Department of Health and Human Services. Accessed 28 May 2026.',
    url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/binge-drinking",
  },
  {
    text:
      '"Understanding Alcohol Use Disorder." National Institute on Alcohol Abuse and Alcoholism, U.S. Department of Health and Human Services.',
    url: "https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-alcohol-use-disorder",
  },
  {
    text: '"Drunk Driving." NHTSA.',
    url: "https://www.nhtsa.gov/risky-driving/drunk-driving",
  },
  {
    text: '"Drunk Driving Statistics 2026." SafeHome.org, 19 Sept. 2025.',
    url: "https://www.safehome.org/resources/dui-statistics/",
  },
];

function SourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">References</p>
        <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[0.95]">Sources & citations.</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Every statistic, definition, and recommendation on Smarter Sipping is drawn from the sources below.
        </p>

        <ol className="mt-12 space-y-6">
          {CITATIONS.map((c, i) => (
            <li key={i} className="rounded-2xl border border-border bg-card p-6 flex gap-4">
              <span className="font-display text-2xl text-primary shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div className="text-sm leading-relaxed">
                <p className="text-foreground">{c.text}</p>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-muted-foreground underline hover:text-foreground break-all"
                  >
                    {c.url}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </div>
  );
}
