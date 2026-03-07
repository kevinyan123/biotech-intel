import { formatCurrency, formatNumber } from "@/lib/utils";

interface FinancialRecord {
  date: string;
  revenue?: number | null;
  netIncome?: number | null;
  marketCap?: number | null;
  stockPrice?: number | null;
  volume?: number | null;
}

interface FinancialSummaryProps {
  financials: FinancialRecord[];
}

export default function FinancialSummary({ financials }: FinancialSummaryProps) {
  if (financials.length === 0) {
    return <p className="py-4 text-sm text-gray-500">No financial data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Period</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Revenue</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Net Income</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Market Cap</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Stock Price</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {financials.map((f) => (
            <tr key={f.date} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{f.date}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(f.revenue)}</td>
              <td className={`px-4 py-3 text-right ${(f.netIncome ?? 0) < 0 ? "text-red-600" : "text-green-600"}`}>
                {formatCurrency(f.netIncome)}
              </td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(f.marketCap)}</td>
              <td className="px-4 py-3 text-right text-gray-700">
                {f.stockPrice ? `$${f.stockPrice.toFixed(2)}` : "N/A"}
              </td>
              <td className="px-4 py-3 text-right text-gray-700">{formatNumber(f.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
