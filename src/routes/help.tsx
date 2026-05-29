import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteNav";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Confidential Help in Marin — Smarter Sipping" },
      {
        name: "description",
        content:
          "Confidential Marin County healthcare and support locations for alcohol-related help, including 24/7 access points.",
      },
    ],
  }),
});

const LOCATIONS = [
  {
    name: "Marin HHS Social Services Courtyard",
    address: "120 North Redwood, San Rafael",
    hours: "24 / 7 outdoor access",
  },
  {
    name: "Marin County Jail Lobby",
    address: "13 Peter Behr Drive, San Rafael",
    hours: "8:00 am – 11:00 pm",
  },
  {
    name: "Ritter Center",
    address: "16 Ritter Street, San Rafael",
    hours: "8:30 am – 4:30 pm",
  },
  {
    name: "Marin Health and Wellness Campus",
    address: "3240 Kerner Blvd, San Rafael",
    hours: "8:30 am – 5:00 pm",
  },
  {
    name: "West Marin Health and Human Services Multi-Service Center",
    address: "1 Sixth Street, Point Reyes Station",
    hours: "Monday – Friday • 9:00 am – 12:00 pm & 1:00 pm – 4:30 pm",
  },
  {
    name: "Bayside Marin",
    address: "718 4th St, San Rafael",
    hours: "24 / 7 access",
  },
  {
    name: "Honeycomb Wellness Center",
    address: "350 Bel Marin Keys Blvd f300, Novato",
    hours: "24 / 7 access",
  },
  {
    name: "Mind Therapy Clinic",
    address: "100 Tamal Plaza Suite 200, Corte Madera",
    hours: "Monday – Friday • 9:00 am – 5:00 pm",
  },
];

function HelpPage() {
  return (

    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 w-full">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Confidential support</p>
        <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[0.95] max-w-3xl">
          Marin County healthcare locations.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          These locations offer confidential help for individuals struggling with alcohol use. Walk in — no appointment required.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {LOCATIONS.map((l) => (
            <div key={l.name} className="rounded-3xl bg-card border border-border p-8 hover:shadow-md transition-shadow">
              <h2 className="font-display text-2xl leading-snug">{l.name}</h2>
              <p className="mt-3 text-muted-foreground">{l.address}</p>
              <p className="mt-2 text-sm text-accent font-medium">{l.hours}</p>
              <a
                className="mt-4 inline-flex text-sm underline hover:text-foreground text-muted-foreground"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.name + " " + l.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in maps →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-primary text-primary-foreground p-10">
          <h2 className="font-display text-3xl">In an immediate crisis?</h2>
          <p className="mt-3 opacity-90">
            Call <a className="underline" href="tel:988">988</a> for the Suicide & Crisis Lifeline, or SAMHSA's National Helpline at{" "}
            <a className="underline" href="tel:18006624357">1-800-662-4357</a> (free, confidential, 24/7).
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
