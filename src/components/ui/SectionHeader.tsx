export default function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5 mt-4">
      <span className="text-xs font-bold tracking-tight" style={{ color: "var(--color-t0)" }}>
        {children}
      </span>
    </div>
  );
}
