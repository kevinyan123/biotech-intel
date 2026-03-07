export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "N/A";
  if (Math.abs(value) >= 1e9)
    return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6)
    return `$${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3)
    return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return value.toLocaleString();
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function getStatusColor(status: string | null | undefined): string {
  if (!status) return "bg-gray-100 text-gray-700";
  const s = status.toLowerCase();
  if (s.includes("approved")) return "bg-green-100 text-green-800";
  if (s.includes("recruiting")) return "bg-blue-100 text-blue-800";
  if (s.includes("completed")) return "bg-purple-100 text-purple-800";
  if (s.includes("active")) return "bg-cyan-100 text-cyan-800";
  if (s.includes("phase 3")) return "bg-orange-100 text-orange-800";
  if (s.includes("phase 2")) return "bg-yellow-100 text-yellow-800";
  if (s.includes("phase 1")) return "bg-amber-100 text-amber-800";
  if (s.includes("preclinical")) return "bg-gray-100 text-gray-700";
  if (s.includes("investigational")) return "bg-indigo-100 text-indigo-800";
  if (s.includes("terminated") || s.includes("withdrawn"))
    return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-700";
}

export function getPhaseColor(phase: string | null | undefined): string {
  if (!phase) return "bg-gray-100 text-gray-700";
  if (phase.includes("3")) return "bg-orange-100 text-orange-800";
  if (phase.includes("2")) return "bg-yellow-100 text-yellow-800";
  if (phase.includes("1")) return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-700";
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + "...";
}
