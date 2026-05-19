// Widmark formula-based BAC estimation. Educational only.

export type Gender = "male" | "female" | "other";

export interface DrinkEntry {
  id: string;
  name: string;
  // Standard drinks (1 = ~14g pure alcohol)
  standardDrinks: number;
  // ISO timestamp
  time: string;
  dayKey: string; // YYYY-MM-DD local
}

export interface Profile {
  heightCm: number;
  weightKg: number;
  gender: Gender;
}

// Widmark r factor
function widmarkR(gender: Gender): number {
  if (gender === "male") return 0.68;
  if (gender === "female") return 0.55;
  return 0.615;
}

// Alcohol metabolized per hour (BAC %)
const METABOLISM_RATE = 0.015;

/**
 * Estimate current BAC (%) given drinks and profile.
 */
export function estimateBAC(drinks: DrinkEntry[], profile: Profile, now: Date = new Date()): number {
  if (!profile.weightKg || drinks.length === 0) return 0;
  const r = widmarkR(profile.gender);
  const weightGrams = profile.weightKg * 1000;

  let totalBAC = 0;
  for (const d of drinks) {
    const grams = d.standardDrinks * 14;
    const hours = Math.max(0, (now.getTime() - new Date(d.time).getTime()) / 3_600_000);
    const peak = (grams / (weightGrams * r)) * 100;
    const remaining = Math.max(0, peak - METABOLISM_RATE * hours);
    totalBAC += remaining;
  }
  return Math.max(0, totalBAC);
}

/**
 * Recommended minutes until next safe drink.
 * Strategy: keep BAC under 0.055 (well below 0.08 legal limit; "moderate" zone).
 * If currently safe, suggest a minimum pacing gap of 60 minutes from last drink.
 */
export function minutesUntilNextDrink(
  drinks: DrinkEntry[],
  profile: Profile,
  now: Date = new Date(),
): { minutes: number; reason: "metabolize" | "pace" | "ready"; currentBAC: number } {
  const bac = estimateBAC(drinks, profile, now);
  const target = 0.04;

  if (drinks.length === 0) {
    return { minutes: 0, reason: "ready", currentBAC: bac };
  }

  // Estimate the peak BAC contribution of the next drink, based on the most
  // recent drink the user logged (best signal for what they're currently drinking).
  const r = widmarkR(profile.gender);
  const weightGrams = profile.weightKg * 1000;
  const last = drinks.reduce((a, b) => (new Date(a.time) > new Date(b.time) ? a : b));
  const nextDrinkPeak = (last.standardDrinks * 14) / (weightGrams * r) * 100;

  // We want: bac (after waiting) + nextDrinkPeak <= target
  const allowedNow = target - nextDrinkPeak;
  if (bac <= allowedNow) {
    return { minutes: 0, reason: "ready", currentBAC: bac };
  }
  const hoursToWait = (bac - allowedNow) / METABOLISM_RATE;
  const reason: "metabolize" | "pace" = bac > target ? "metabolize" : "pace";
  return { minutes: Math.ceil(hoursToWait * 60), reason, currentBAC: bac };
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const DRINK_PRESETS = [
  { name: "Beer (12oz, 5%)", standardDrinks: 1 },
  { name: "Light beer (12oz, 4.2%)", standardDrinks: 0.85 },
  { name: "Craft/IPA (12oz, 7%)", standardDrinks: 1.4 },
  { name: "Wine (5oz, 12%)", standardDrinks: 1 },
  { name: "Shot (1.5oz, 40%)", standardDrinks: 1 },
  { name: "Cocktail (mixed)", standardDrinks: 1.5 },
  { name: "Hard seltzer (12oz, 5%)", standardDrinks: 1 },
] as const;
