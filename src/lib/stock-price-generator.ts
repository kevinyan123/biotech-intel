// Seeded stock price generator for simulated daily price history

export interface StockDataPoint {
  date: string;   // YYYY-MM-DD
  price: number;
  volume: number;
}

function S(s: number) {
  let x = s;
  return () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; };
}

/** Classify catalyst type for price impact magnitude */
function catalystImpact(type: string): { mag: number; biasUp: number } {
  if (/PDUFA|NDA|EMA|AdCom|BTD|Fast|Orphan/.test(type))
    return { mag: 0.08 + Math.random() * 0.07, biasUp: 0.6 };
  if (/Ph3|Phase 3|Ph2|Phase 2|Interim/.test(type))
    return { mag: 0.04 + Math.random() * 0.06, biasUp: 0.6 };
  if (/Enrollment|Recruiting/.test(type))
    return { mag: 0.015 + Math.random() * 0.025, biasUp: 0.65 };
  return { mag: 0.01 + Math.random() * 0.02, biasUp: 0.55 };
}

/** Check if a date string is a weekday */
function isWeekday(y: number, m: number, d: number): boolean {
  const dow = new Date(y, m - 1, d).getDay();
  return dow !== 0 && dow !== 6;
}

/** Generate trading days between two date strings */
function tradingDays(start: string, end: string): string[] {
  const days: string[] = [];
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const s = new Date(sy, sm - 1, sd);
  const e = new Date(ey, em - 1, ed);
  const cur = new Date(s);
  while (cur <= e) {
    const y = cur.getFullYear(), m = cur.getMonth() + 1, d = cur.getDate();
    if (isWeekday(y, m, d)) {
      days.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export function generateStockData(
  companyId: string,
  marketCap: number,
  catalysts: { date: string; type: string }[],
): StockDataPoint[] {
  const seed = parseInt(companyId.replace(/\D/g, "")) + 7000;
  const R = S(seed);

  // Base price from market cap (billions)
  const basePrice = Math.max(0.5, Math.min(500, marketCap * 0.5 + R() * 20));
  const dailyVol = 0.015 + R() * 0.015;

  // Date range: 18 months ago → 9 months into future
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 18);
  const end = new Date(now);
  end.setMonth(end.getMonth() + 9);

  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const days = tradingDays(fmt(start), fmt(end));

  // Pre-compute catalyst impact windows: map date → impact multiplier
  const catImpacts: Record<string, number> = {};
  catalysts.forEach((c) => {
    const impact = catalystImpact(c.type);
    const dir = R() < impact.biasUp ? 1 : -1;
    // Apply impact over a 5-day window centered on event
    const cd = new Date(c.date);
    for (let offset = -2; offset <= 3; offset++) {
      const d = new Date(cd);
      d.setDate(d.getDate() + offset);
      const key = fmt(d);
      const weight = offset === 0 ? 0.4 : offset === 1 ? 0.25 : offset === -1 ? 0.15 : 0.1;
      catImpacts[key] = (catImpacts[key] || 0) + dir * impact.mag * weight;
    }
  });

  // Generate prices with random walk
  let price = basePrice;
  const baseVol = Math.max(50000, marketCap * 500000 + R() * 1000000);
  const result: StockDataPoint[] = [];

  for (const day of days) {
    // Brownian motion with mean reversion
    const shock = (R() - 0.5) * 2 * dailyVol;
    const reversion = (basePrice - price) / basePrice * 0.003;
    const drift = 0.00005;
    let catEffect = catImpacts[day] || 0;

    price *= (1 + drift + shock + reversion + catEffect);
    price = Math.max(0.1, price);

    // Volume with spikes near catalysts
    const volMult = catEffect !== 0 ? 2 + R() * 3 : 0.7 + R() * 0.6;
    const volume = Math.round(baseVol * volMult);

    result.push({ date: day, price: Math.round(price * 100) / 100, volume });
  }

  return result;
}
