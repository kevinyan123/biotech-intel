import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getStatusColor } from "@/lib/utils";

interface PipelineDrug {
  id: number;
  name: string;
  drugClass?: string | null;
  therapeuticArea?: string | null;
  developmentStage?: string | null;
}

interface PipelineTableProps {
  drugs: PipelineDrug[];
}

export default function PipelineTable({ drugs }: PipelineTableProps) {
  if (drugs.length === 0) {
    return <p className="py-4 text-sm text-gray-500">No pipeline data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Drug</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Class</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Therapeutic Area</th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {drugs.map((drug) => (
            <tr key={drug.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link href={`/drugs/${drug.id}`} className="font-medium text-blue-600 hover:underline">
                  {drug.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{drug.drugClass || "N/A"}</td>
              <td className="px-4 py-3 text-gray-600">{drug.therapeuticArea || "N/A"}</td>
              <td className="px-4 py-3">
                <Badge className={getStatusColor(drug.developmentStage)}>
                  {drug.developmentStage || "Unknown"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
