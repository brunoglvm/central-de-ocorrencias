import { incidentColumns } from "@/constants/incidents";
import type { Incident, IncidentStatus } from "@/types/incident";

export function groupIncidentsByStatus(incidents: Incident[]) {
  return incidentColumns.reduce(
    (groups, status) => {
      groups[status] = incidents.filter((incident) => incident.status === status);
      return groups;
    },
    {} as Record<IncidentStatus, Incident[]>,
  );
}
