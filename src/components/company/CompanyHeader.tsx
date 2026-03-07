import Badge from "@/components/ui/Badge";
import { formatCurrency, parseJsonArray } from "@/lib/utils";

interface CompanyHeaderProps {
  company: {
    name: string;
    ticker?: string | null;
    description?: string | null;
    scientificFocus?: string | null;
    therapeuticAreas?: string | null;
    headquarters?: string | null;
    founded?: string | null;
    website?: string | null;
    marketCap?: number | null;
    stockPrice?: number | null;
    employees?: number | null;
    ceo?: string | null;
  };
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  const areas = parseJsonArray(company.therapeuticAreas);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            {company.ticker && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-mono font-medium text-gray-600">
                {company.ticker}
              </span>
            )}
          </div>
          {company.scientificFocus && (
            <p className="mt-1 text-sm text-gray-500">{company.scientificFocus}</p>
          )}
        </div>
        {company.stockPrice && (
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-900">
              ${company.stockPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              MCap: {formatCurrency(company.marketCap)}
            </div>
          </div>
        )}
      </div>

      {company.description && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          {company.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {areas.map((area) => (
          <Badge key={area} className="bg-blue-50 text-blue-700">
            {area}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {company.headquarters && (
          <div>
            <dt className="text-xs text-gray-500">Headquarters</dt>
            <dd className="text-sm font-medium text-gray-900">{company.headquarters}</dd>
          </div>
        )}
        {company.founded && (
          <div>
            <dt className="text-xs text-gray-500">Founded</dt>
            <dd className="text-sm font-medium text-gray-900">{company.founded}</dd>
          </div>
        )}
        {company.employees && (
          <div>
            <dt className="text-xs text-gray-500">Employees</dt>
            <dd className="text-sm font-medium text-gray-900">
              {company.employees.toLocaleString()}
            </dd>
          </div>
        )}
        {company.ceo && (
          <div>
            <dt className="text-xs text-gray-500">CEO</dt>
            <dd className="text-sm font-medium text-gray-900">{company.ceo}</dd>
          </div>
        )}
      </div>

      {company.website && (
        <div className="mt-3">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {company.website}
          </a>
        </div>
      )}
    </div>
  );
}
