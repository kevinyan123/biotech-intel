// Shared utilities for catalyst dates, relative time, and milestone colors

/** Returns relative time string like "in 3mo", "45d away", "today", "2mo ago" */
export function relativeTime(dateStr: string): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (86400000));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";

  const abs = Math.abs(diffDays);
  const dir = diffDays > 0 ? "away" : "ago";

  if (abs < 7) return `${abs}d ${dir}`;
  if (abs < 30) return `${Math.round(abs / 7)}w ${dir}`;
  if (abs < 365) return `${Math.round(abs / 30.44)}mo ${dir}`;
  return `${(abs / 365.25).toFixed(1)}y ${dir}`;
}

/** Returns raw day difference (positive = future, negative = past) */
export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

/**
 * 4-category milestone color system:
 *   Green  #00e676 — Enrollment/recruiting events
 *   Blue   #4fc3f7 — Trial start, early phase, conference
 *   Amber  #ffb74d — Data readouts (Ph2, Ph3, interim)
 *   Pink   #f48fb1 — FDA/regulatory (PDUFA, NDA, EMA, BTD, etc.)
 */
export function milestoneColor(type: string): string {
  // Green: enrollment / recruiting
  if (type.includes("Enrollment") || type.includes("Recruiting"))
    return "#00e676";
  // Blue: trial start, early phase, conference
  if (type.includes("Ph1") || type.includes("Phase 1") || type.includes("Conference") || type.includes("Dose"))
    return "#4fc3f7";
  // Amber: data readouts
  if (type.includes("Ph2") || type.includes("Phase 2") || type.includes("Ph3") || type.includes("Phase 3") || type.includes("Interim"))
    return "#ffb74d";
  // Pink: FDA / regulatory
  if (type.includes("PDUFA") || type.includes("NDA") || type.includes("EMA") || type.includes("BTD") || type.includes("Fast") || type.includes("Orphan") || type.includes("AdCom"))
    return "#f48fb1";
  return "#7e92a6"; // fallback gray
}

/** Legend items for the 4-category system */
export const MILESTONE_LEGEND = [
  { label: "Enrollment", color: "#00e676" },
  { label: "Trial Start / Conference", color: "#4fc3f7" },
  { label: "Data Readout", color: "#ffb74d" },
  { label: "FDA / Regulatory", color: "#f48fb1" },
] as const;
