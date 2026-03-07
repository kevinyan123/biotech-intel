"use client";

import { ReactNode } from "react";

export interface Column<T> {
  label: string;
  key?: keyof T;
  render?: (row: T) => ReactNode;
  nowrap?: boolean;
  maxWidth?: number;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  maxHeight?: number;
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data, onRowClick, maxHeight }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight, overflowY: maxHeight ? "auto" : undefined }}>
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr style={{ background: "var(--color-b2)", position: maxHeight ? "sticky" : "static", top: 0, zIndex: 2 }}>
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className="transition-colors duration-100"
              style={{ cursor: onRowClick ? "pointer" : "default" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((col, j) => (
                <td
                  key={j}
                  style={{
                    padding: "5px 8px",
                    borderBottom: "1px solid var(--color-bd)",
                    color: "var(--color-t1)",
                    whiteSpace: col.nowrap ? "nowrap" : "normal",
                    maxWidth: col.maxWidth || "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {col.render ? col.render(row) : (row[col.key as string] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
