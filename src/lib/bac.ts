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
  age: number;
  // Average drinks per week — used to roughly model tolerance
  avgDrinksPerWeek: number;
}

// Widmark r factor
function widmarkR(gender: Gender): number {
  if (gender === "male") return 0.68;
  if (gender === "female") return 0.55;
  return 0.615;
}

// Per-drink BAC multiplier requested by product: estimates are dropped to
// 50% of the raw Widmark value to reflect food, hydration, and that the
// raw formula tends to over-estimate for paced social drinking.
const BAC_CALIBRATION = 0.5;

// Base alcohol metabolized per hour (BAC %)
const BASE_METABOLISM_RATE = 0.015;

/**
 * Adjust metabolism slightly for tolerance (frequent drinkers clear a bit
 * faster) and for age (older bodies clear a bit slower). Bounded so it never
 * deviates dramatically from the textbook 0.015%/hr.
 */
function metabolismRate(profile: Profile): number {
  const tolerance = Math.min(0.003, Math.max(0, (profile.avgDrinksPerWeek - 3) * 0.0002));
  const ageDrag = profile.age > 40 ? Math.min(0.003, (profile.age - 40) * 0.00008) : 0;
  return Math.max(0.01, BASE_METABOLISM_RATE + tolerance - ageDrag);
}

/**
 * Body-water adjustment. Taller/leaner bodies hold more water → lower BAC
 * per gram of alcohol. Older bodies hold slightly less water → higher BAC.
 * Returns a multiplier applied to the raw Widmark peak.
 */
function bodyCompositionFactor(profile: Profile): number {
  // Rough BMI-driven tweak: higher BMI → less body water → higher BAC.
  const heightM = profile.heightCm / 100;
  const bmi = profile.weightKg / (heightM * heightM);
  const bmiAdj = 1 + Math.max(-0.08, Math.min(0.12, (bmi - 22) * 0.01));
  const ageAdj = 1 + Math.max(0, Math.min(0.08, (profile.age - 30) * 0.002));
  return bmiAdj * ageAdj;
}

/**
 * Estimate current BAC (%) given drinks and profile.
 */
export function estimateBAC(drinks: DrinkEntry[], profile: Profile, now: Date = new Date()): number {
  if (!profile.weightKg || drinks.length === 0) return 0;
  const r = widmarkR(profile.gender);
  const weightGrams = profile.weightKg * 1000;
  const rate = metabolismRate(profile);
  const compFactor = bodyCompositionFactor(profile);

  let totalBAC = 0;
  for (const d of drinks) {
    const grams = d.standardDrinks * 14;
    const hours = Math.max(0, (now.getTime() - new Date(d.time).getTime()) / 3_600_000);
    const peak = (grams / (weightGrams * r)) * 100 * compFactor * BAC_CALIBRATION;
    const remaining = Math.max(0, peak - rate * hours);
    totalBAC += remaining;
  }
  return Math.max(0, totalBAC);
}

/**
 * Recommended minutes until next safe drink.
 * Strategy: keep BAC under 0.04 ("moderate" zone, well below 0.08 legal limit).
 * If currently safe, suggest a minimum pacing gap of 60 minutes from last drink.
 */
export function minutesUntilNextDrink(
  drinks: DrinkEntry[],
  profile: Profile,
  now: Date = new Date(),
): { minutes: number; reason: "metabolize" | "pace" | "ready"; currentBAC: number } {
  const bac = estimateBAC(drinks, profile, now);
  const target = 0.04;
  const rate = metabolismRate(profile);

  if (bac > target) {
    const hoursToTarget = (bac - target) / rate;
    return { minutes: Math.ceil(hoursToTarget * 60), reason: "metabolize", currentBAC: bac };
  }
  if (drinks.length === 0) {
    return { minutes: 0, reason: "ready", currentBAC: bac };
  }
  const last = drinks.reduce((a, b) => (new Date(a.time) > new Date(b.time) ? a : b));
  const minsSinceLast = (now.getTime() - new Date(last.time).getTime()) / 60_000;
  const paceGap = 60; // one drink per hour guideline
  const remaining = Math.max(0, paceGap - minsSinceLast);
  if (remaining <= 0) return { minutes: 0, reason: "ready", currentBAC: bac };
  return { minutes: Math.ceil(remaining), reason: "pace", currentBAC: bac };
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
