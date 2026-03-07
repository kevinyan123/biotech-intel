interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function Card({ children, className = "", title, subtitle }: CardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-5 py-3">
          {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
