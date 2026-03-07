export default function Tag({ children, color = "var(--color-ac)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-block rounded text-[9px] font-medium whitespace-nowrap mr-0.5 mb-0.5"
      style={{
        padding: "1px 5px",
        background: `${color}10`,
        color: color,
        border: `1px solid ${color}20`,
      }}
    >
      {children}
    </span>
  );
}
