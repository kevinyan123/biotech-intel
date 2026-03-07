import { parseJsonArray } from "@/lib/utils";

interface TrialDesignProps {
  conditions: string | null | undefined;
  interventions: string | null | undefined;
  eligibility: string | null | undefined;
  briefSummary: string | null | undefined;
}

export default function TrialDesign({
  conditions,
  interventions,
  eligibility,
  briefSummary,
}: TrialDesignProps) {
  const conditionList = parseJsonArray(conditions);
  const interventionList = parseJsonArray(interventions);

  return (
    <div className="space-y-6">
      {briefSummary && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Study Summary</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{briefSummary}</p>
        </div>
      )}

      {conditionList.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Conditions</h3>
          <ul className="mt-2 space-y-1">
            {conditionList.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {interventionList.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Interventions</h3>
          <ul className="mt-2 space-y-1">
            {interventionList.map((iv, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                {iv}
              </li>
            ))}
          </ul>
        </div>
      )}

      {eligibility && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Eligibility</h3>
          <p className="mt-2 text-sm text-gray-600">{eligibility}</p>
        </div>
      )}
    </div>
  );
}
