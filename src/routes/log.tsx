import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import {
  DRINK_PRESETS,
  estimateBAC,
  minutesUntilNextDrink,
  todayKey,
  type DrinkEntry,
  type Gender,
  type Profile,
} from "@/lib/bac";

export const Route = createFileRoute("/log")({
  component: LogPage,
  head: () => ({
    meta: [
      { title: "Drink Log — Pace yourself | Smarter Sipping" },
      { name: "description", content: "Log drinks, get personalized pacing timers, and track your BAC throughout the night." },
    ],
  }),
});

const PROFILE_KEY = "smart sipping:profile";
const LOG_KEY = "smart sipping:log";

function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

function loadDrinks(): DrinkEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DrinkEntry[];
    const today = todayKey();
    return parsed.filter((d) => d.dayKey === today);
  } catch {
    return [];
  }
}

function LogPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [now, setNow] = useState(new Date());
  const [showSetup, setShowSetup] = useState(false);

  // form state for new drink
  const [presetIdx, setPresetIdx] = useState(0);
  const [customName, setCustomName] = useState("");
  const [customStandard, setCustomStandard] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setShowSetup(!p);
    setDrinks(loadDrinks());
  }, []);

  // Ticking clock + daily reset check
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setDrinks((prev) => {
        const today = todayKey();
        const filtered = prev.filter((d) => d.dayKey === today);
        if (filtered.length !== prev.length) {
          localStorage.setItem(LOG_KEY, JSON.stringify(filtered));
        }
        return filtered;
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const bac = useMemo(() => (profile ? estimateBAC(drinks, profile, now) : 0), [drinks, profile, now]);
  const next = useMemo(
    () => (profile ? minutesUntilNextDrink(drinks, profile, now) : null),
    [drinks, profile, now],
  );

  function saveProfile(p: Profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
    setShowSetup(false);
  }

  function addDrink() {
    const entry: DrinkEntry = useCustom
      ? {
          id: crypto.randomUUID(),
          name: customName.trim() || "Custom drink",
          standardDrinks: Math.max(0.1, Number(customStandard) || 1),
          time: new Date().toISOString(),
          dayKey: todayKey(),
        }
      : {
          id: crypto.randomUUID(),
          name: DRINK_PRESETS[presetIdx].name,
          standardDrinks: DRINK_PRESETS[presetIdx].standardDrinks,
          time: new Date().toISOString(),
          dayKey: todayKey(),
        };
    const updated = [...drinks, entry];
    setDrinks(updated);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
    setCustomName("");
    setCustomStandard("");
  }

  function removeDrink(id: string) {
    const updated = drinks.filter((d) => d.id !== id);
    setDrinks(updated);
    localStorage.setItem(LOG_KEY, JSON.stringify(updated));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <header className="mb-12 flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Tonight</p>
            <h1 className="font-display text-5xl md:text-6xl mt-2">Drink log</h1>
            <p className="text-muted-foreground mt-3 max-w-lg">Resets at midnight. Stored only on this device.</p>
          </div>
          {profile && (
            <button onClick={() => setShowSetup(true)} className="text-sm px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary transition">
              Edit profile
            </button>
          )}
        </header>

        {showSetup || !profile ? (
          <ProfileForm initial={profile} onSave={saveProfile} onCancel={profile ? () => setShowSetup(false) : undefined} />
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Timer card */}
            <section className="lg:col-span-7 rounded-3xl bg-card border border-border p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Next safe drink in</p>
              <TimerDisplay next={next} />
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Stat label="Estimated BAC" value={`${bac.toFixed(3)}%`} tone={bac > 0.08 ? "danger" : bac > 0.05 ? "warn" : "ok"} />
                <Stat label="Drinks tonight" value={String(drinks.length)} tone={drinks.length >= 4 ? "warn" : "ok"} />
              </div>
              {bac > 0.08 && (
                <p className="mt-6 text-sm p-4 rounded-2xl bg-destructive/10 text-destructive border border-destructive/30">
                  You're estimated above 0.08% BAC. Stop drinking, hydrate, and do not drive. If anyone is confused, vomiting unconscious, or breathing slowly — call 911.
                </p>
              )}
            </section>

            {/* Add drink */}
            <section className="lg:col-span-5 rounded-3xl bg-foreground text-background p-8 md:p-10">
              <h2 className="font-display text-2xl">Log a drink</h2>
              <div className="mt-6 space-y-4">
                {!useCustom ? (
                  <select
                    value={presetIdx}
                    onChange={(e) => setPresetIdx(Number(e.target.value))}
                    className="w-full bg-background/10 border border-background/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {DRINK_PRESETS.map((p, i) => (
                      <option key={p.name} value={i} className="text-foreground">
                        {p.name} — {p.standardDrinks} std
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-3">
                    <input
                      placeholder="Drink name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-background/10 border border-background/20 rounded-xl px-4 py-3 text-sm placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Standard drinks (e.g. 1.5)"
                      value={customStandard}
                      onChange={(e) => setCustomStandard(e.target.value)}
                      className="w-full bg-background/10 border border-background/20 rounded-xl px-4 py-3 text-sm placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}
                <button onClick={() => setUseCustom((v) => !v)} className="text-xs underline opacity-70 hover:opacity-100">
                  {useCustom ? "Use a preset" : "Add a custom drink"}
                </button>
                <button
                  onClick={addDrink}
                  className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-medium hover:scale-[1.01] transition"
                >
                  Add to log →
                </button>
                <p className="text-xs opacity-60">Logged at the current time, {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.</p>
              </div>
            </section>

            {/* Log list */}
            <section className="lg:col-span-12 rounded-3xl bg-card border border-border p-8">
              <h2 className="font-display text-2xl mb-6">Tonight's log</h2>
              {drinks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No drinks yet. Log one to start your pacing timer.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {[...drinks]
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .map((d) => (
                      <li key={d.id} className="py-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(d.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {d.standardDrinks} standard
                          </p>
                        </div>
                        <button onClick={() => removeDrink(d.id)} className="text-xs text-muted-foreground hover:text-destructive transition">
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>
        )}

        <p className="mt-12 text-xs text-muted-foreground max-w-2xl">
          BAC estimates use the Widmark formula and are approximations only. Many factors — food, hydration, medication, sleep, individual metabolism — affect real BAC. Never use this app to decide whether to drive.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function TimerDisplay({ next }: { next: ReturnType<typeof minutesUntilNextDrink> | null }) {
  if (!next) return null;
  if (next.minutes === 0) {
    return (
      <div className="mt-4">
        <p className="font-display text-7xl md:text-8xl text-success">Now</p>
        <p className="text-muted-foreground mt-3">{next.reason === "ready" && next.currentBAC === 0 ? "Have a great night. Pace yourself." : "One more is okay — slowly."}</p>
      </div>
    );
  }
  const h = Math.floor(next.minutes / 60);
  const m = next.minutes % 60;
  return (
    <div className="mt-4">
      <p className="font-display text-7xl md:text-8xl text-primary tabular-nums">
        {h > 0 ? `${h}h ` : ""}{m}m
      </p>
      <p className="text-muted-foreground mt-3">
        {next.reason === "metabolize"
          ? "Your body is processing alcohol — give it time before the next one."
          : "Pacing rule of thumb: about one drink per hour."}
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "danger" }) {
  const color = tone === "danger" ? "text-destructive" : tone === "warn" ? "text-accent" : "text-foreground";
  return (
    <div className="p-5 rounded-2xl bg-secondary">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`font-display text-3xl mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function ProfileForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Profile | null;
  onSave: (p: Profile) => void;
  onCancel?: () => void;
}) {
  const [heightCm, setHeightCm] = useState(initial?.heightCm?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(initial?.weightKg?.toString() ?? "");
  const [age, setAge] = useState(initial?.age?.toString() ?? "");
  const [gender, setGender] = useState<Gender>(initial?.gender ?? "other");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const h = Number(heightCm);
    const w = Number(weightKg);
    const a = Number(age);
    if (!h || h < 100 || h > 250) return setError("Enter a realistic height in cm (100–250).");
    if (!w || w < 30 || w > 250) return setError("Enter a realistic weight in kg (30–250).");
    if (!a || a < 18 || a > 120) return setError("Enter a realistic age (18–120). You must be of legal drinking age.");
    onSave({ heightCm: h, weightKg: w, gender, age: a });
  }

  return (
    <form onSubmit={submit} className="max-w-xl rounded-3xl bg-card border border-border p-8 md:p-10">
      <h2 className="font-display text-3xl">A bit about you</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        We use this to estimate how your body processes alcohol. Nothing leaves your device.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Field label="Height (cm)">
          <input
            type="number"
            min="100"
            max="250"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </Field>
        <Field label="Weight (kg)">
          <input
            type="number"
            min="30"
            max="250"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </Field>
      </div>
      <Field label="Gender" className="mt-4">
        <div className="grid grid-cols-3 gap-2">
          {(["male", "female", "other"] as Gender[]).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGender(g)}
              className={`py-3 rounded-xl text-sm capitalize border transition ${
                gender === g
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-input hover:bg-secondary"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-8 flex gap-3">
        <button type="submit" className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition">
          Save & continue
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-full border border-border hover:bg-secondary transition">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
