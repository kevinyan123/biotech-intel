import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";

interface DrugSummaryProps {
  drug: {
    name: string;
    genericName?: string | null;
    drugClass?: string | null;
    mechanismOfAction?: string | null;
    therapeuticArea?: string | null;
    developmentStage?: string | null;
    regulatoryStatus?: string | null;
    approvalDate?: string | null;
    description?: string | null;
    company: { id: number; name: string };
  };
}

export default function DrugSummary({ drug }: DrugSummaryProps) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{drug.name}</h1>
          {drug.genericName && (
            <p className="mt-0.5 text-sm text-gray-500">{drug.genericName}</p>
          )}
        </div>
        <Badge className={getStatusColor(drug.developmentStage)}>
          {drug.developmentStage || "Unknown"}
        </Badge>
      </div>

      {drug.description && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          {drug.description}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-gray-500">Developer</dt>
          <dd className="text-sm font-medium">
            <Link href={`/companies/${drug.company.id}`} className="text-blue-600 hover:underline">
              {drug.company.name}
            </Link>
          </dd>
        </div>
        {drug.drugClass && (
          <div>
            <dt className="text-xs text-gray-500">Drug Class</dt>
            <dd className="text-sm font-medium text-gray-900">{drug.drugClass}</dd>
          </div>
        )}
        {drug.therapeuticArea && (
          <div>
            <dt className="text-xs text-gray-500">Therapeutic Area</dt>
            <dd className="text-sm font-medium text-gray-900">{drug.therapeuticArea}</dd>
          </div>
        )}
        {drug.regulatoryStatus && (
          <div>
            <dt className="text-xs text-gray-500">Regulatory Status</dt>
            <dd className="text-sm font-medium text-gray-900">{drug.regulatoryStatus}</dd>
          </div>
        )}
        {drug.approvalDate && (
          <div>
            <dt className="text-xs text-gray-500">Approval Date</dt>
            <dd className="text-sm font-medium text-gray-900">{drug.approvalDate}</dd>
          </div>
        )}
      </div>
    </div>
  );
}
