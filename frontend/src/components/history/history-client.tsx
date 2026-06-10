"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HistoryList } from "@/components/history/history-list";
import { historyPageSize } from "@/constants/incidents";
import { readStoredIncidents, writeStoredIncidents } from "@/lib/incident-storage";
import type { Incident } from "@/types/incident";

type HistoryClientProps = {
  initialIncidents: Incident[];
};

export function HistoryClient({ initialIncidents }: HistoryClientProps) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPage = Number(searchParams.get("page") ?? "1");

  useEffect(() => {
    setIncidents(readStoredIncidents(initialIncidents));
  }, [initialIncidents]);

  const archivedIncidents = useMemo(
    () => incidents.filter((incident) => Boolean(incident.archivedAt)),
    [incidents],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(archivedIncidents.length / historyPageSize),
  );
  const currentPage =
    Number.isFinite(rawPage) && rawPage > 0
      ? Math.min(rawPage, totalPages)
      : 1;
  const startIndex = (currentPage - 1) * historyPageSize;
  const paginatedIncidents = archivedIncidents.slice(
    startIndex,
    startIndex + historyPageSize,
  );

  useEffect(() => {
    if (rawPage === currentPage) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());

    if (currentPage <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(currentPage));
    }

    router.replace(
      nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname,
    );
  }, [currentPage, pathname, rawPage, router, searchParams]);

  function handleRestoreIncident(incidentId: string) {
    const nextIncidents = incidents.map((incident) =>
      incident.id === incidentId ? { ...incident, archivedAt: null } : incident,
    );

    setIncidents(nextIncidents);
    writeStoredIncidents(nextIncidents);
  }

  return (
    <HistoryList
      currentPage={currentPage}
      incidents={paginatedIncidents}
      onRestoreIncident={handleRestoreIncident}
      totalItems={archivedIncidents.length}
      totalPages={totalPages}
    />
  );
}
