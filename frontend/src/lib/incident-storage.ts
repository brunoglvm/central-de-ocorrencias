import type { Incident } from "@/types/incident";

const INCIDENTS_STORAGE_KEY = "central-ocorrencias:incidents";

function normalizeIncidents(
  incidents: Incident[],
  fallbackIncidents: Incident[] = incidents,
) {
  const fallbackById = new Map(
    fallbackIncidents.map((incident) => [incident.id, incident]),
  );

  return incidents.map((incident) => ({
    ...fallbackById.get(incident.id),
    ...incident,
    attachmentName:
      incident.attachmentName ?? fallbackById.get(incident.id)?.attachmentName ?? null,
    attachmentUrl:
      incident.attachmentUrl ?? fallbackById.get(incident.id)?.attachmentUrl ?? null,
    archivedAt: incident.archivedAt ?? null,
  }));
}

export function readStoredIncidents(fallbackIncidents: Incident[]) {
  if (typeof window === "undefined") {
    return normalizeIncidents(fallbackIncidents, fallbackIncidents);
  }

  const storedValue = window.localStorage.getItem(INCIDENTS_STORAGE_KEY);

  if (!storedValue) {
    const normalizedFallback = normalizeIncidents(
      fallbackIncidents,
      fallbackIncidents,
    );
    window.localStorage.setItem(
      INCIDENTS_STORAGE_KEY,
      JSON.stringify(normalizedFallback),
    );
    return normalizedFallback;
  }

  try {
    const parsedIncidents = JSON.parse(storedValue) as Incident[];
    return normalizeIncidents(parsedIncidents, fallbackIncidents);
  } catch {
    const normalizedFallback = normalizeIncidents(
      fallbackIncidents,
      fallbackIncidents,
    );
    window.localStorage.setItem(
      INCIDENTS_STORAGE_KEY,
      JSON.stringify(normalizedFallback),
    );
    return normalizedFallback;
  }
}

export function writeStoredIncidents(incidents: Incident[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedIncidents = normalizeIncidents(incidents, incidents);
  window.localStorage.setItem(
    INCIDENTS_STORAGE_KEY,
    JSON.stringify(normalizedIncidents),
  );
}
