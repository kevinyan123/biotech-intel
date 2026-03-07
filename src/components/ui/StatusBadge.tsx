import { getStatusColor } from "@/lib/utils";
import Badge from "./Badge";

interface StatusBadgeProps {
  status: string | null | undefined;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  return <Badge className={getStatusColor(status)}>{status}</Badge>;
}
