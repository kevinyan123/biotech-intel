const stages = [
  "Preclinical",
  "Phase 1",
  "Phase 1/2",
  "Phase 2",
  "Phase 2/3",
  "Phase 3",
  "Approved",
];

interface DevelopmentTimelineProps {
  currentStage: string | null | undefined;
}

export default function DevelopmentTimeline({ currentStage }: DevelopmentTimelineProps) {
  const currentIndex = stages.findIndex(
    (s) => currentStage?.toLowerCase().includes(s.toLowerCase())
  );

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-2 ring-blue-200"
                    : isCompleted
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`mt-1 text-[10px] ${
                  isCurrent ? "font-semibold text-blue-700" : "text-gray-400"
                }`}
              >
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={`mx-1 h-0.5 w-6 ${
                  isCompleted ? "bg-blue-300" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
