import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getStatusColor, getPhaseColor } from "@/lib/utils";

interface TrialHeaderProps {
  trial: {
    nctId: string;
    title: string;
    phase?: string | null;
    status?: string | null;
    sponsors?: string | null;
    startDate?: string | null;
    completionDate?: string | null;
    enrollment?: number | null;
    studyType?: string | null;
    companyId?: number | null;
    company?: { id: number; name: string } | null;
  };
}

export default function TrialHeader({ trial }: TrialHeaderProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={`https://clinicaltrials.gov/study/${trial.nctId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              {trial.nctId}
            </a>
            {trial.phase && (
              <Badge className={getPhaseColor(trial.phase)}>{trial.phase}</Badge>
            )}
            <Badge className={getStatusColor(trial.status)}>
              {trial.status || "Unknown"}
            </Badge>
          </div>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{trial.title}</h1>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {trial.sponsors && (
          <div>
            <dt className="text-xs text-gray-500">Sponsor</dt>
            <dd className="text-sm font-medium text-gray-900">{trial.sponsors}</dd>
          </div>
        )}
        {trial.company && (
          <div>
            <dt className="text-xs text-gray-500">Company</dt>
            <dd className="text-sm font-medium">
              <Link href={`/companies/${trial.company.id}`} className="text-blue-600 hover:underline">
                {trial.company.name}
              </Link>
            </dd>
          </div>
        )}
        {trial.startDate && (
          <div>
            <dt className="text-xs text-gray-500">Start Date</dt>
            <dd className="text-sm font-medium text-gray-900">{trial.startDate}</dd>
          </div>
        )}
        {trial.completionDate && (
          <div>
            <dt className="text-xs text-gray-500">Completion Date</dt>
            <dd className="text-sm font-medium text-gray-900">{trial.completionDate}</dd>
          </div>
        )}
        {trial.enrollment && (
          <div>
            <dt className="text-xs text-gray-500">Enrollment</dt>
            <dd className="text-sm font-medium text-gray-900">
              {trial.enrollment.toLocaleString()} participants
            </dd>
          </div>
        )}
        {trial.studyType && (
          <div>
            <dt className="text-xs text-gray-500">Study Type</dt>
            <dd className="text-sm font-medium text-gray-900">{trial.studyType}</dd>
          </div>
        )}
      </div>
    </div>
  );
}
