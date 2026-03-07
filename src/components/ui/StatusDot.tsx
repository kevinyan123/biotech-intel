const statusColors: Record<string, string> = {
  Recruiting: "#00e676",
  Active: "#4fc3f7",
  Completed: "#b0bec5",
  Terminated: "#ef5350",
  "Not yet recruiting": "#90a4ae",
};

export default function StatusDot({ status }: { status: string }) {
  const color = statusColors[status] || "#666";
  return (
    <span className="inline-flex items-center gap-1 text-[10px]">
      <span
        className="w-[5px] h-[5px] rounded-full inline-block shrink-0"
        style={{ background: color }}
      />
      {status.length > 14 ? status.slice(0, 12) + "..." : status}
    </span>
  );
}
