export default function BioCard({ children, className, onClick, style }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-3 transition-all duration-100 ${onClick ? "cursor-pointer" : ""} ${className || ""}`}
      style={{
        background: "var(--color-b1)",
        border: "1px solid var(--color-bd)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
