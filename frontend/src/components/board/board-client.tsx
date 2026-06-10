"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import Image from "next/image";
import {
  IconClock,
  IconHistory,
  IconMapPin,
  IconPhoto,
  IconTrash,
  IconUser,
  IconUserCog,
  IconX,
} from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardColumn } from "@/components/board/board-column";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { incidentColumns, statusMeta } from "@/constants/incidents";
import { groupIncidentsByStatus } from "@/lib/incidents";
import { readStoredIncidents, writeStoredIncidents } from "@/lib/incident-storage";
import type { Incident, IncidentStatus } from "@/types/incident";

type BoardClientProps = {
  initialIncidents: Incident[];
};

const statusIndicatorVariants: Record<IncidentStatus, string> = {
  open: "text-[var(--badge-open-text)]",
  in_progress: "text-[var(--badge-progress-text)]",
  resolved: "text-[var(--badge-resolved-text)]",
};

const statusBadgeVariants: Record<IncidentStatus, string> = {
  open: "bg-[var(--badge-open-text)] text-[var(--color-surface)]",
  in_progress: "bg-[var(--badge-progress-text)] text-[var(--color-surface)]",
  resolved: "bg-[var(--badge-resolved-text)] text-[var(--color-surface)]",
};

const statusLabels: Record<IncidentStatus, string> = {
  open: "Abertas",
  in_progress: "Em andamento",
  resolved: "Resolvidas",
};

export function BoardClient({ initialIncidents }: BoardClientProps) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [isReady, setIsReady] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIncidentId = searchParams.get("incident");
  const activeIncidents = useMemo(
    () => incidents.filter((incident) => !incident.archivedAt),
    [incidents],
  );

  const incidentsByStatus = useMemo(
    () => groupIncidentsByStatus(activeIncidents),
    [activeIncidents],
  );
  const selectedIncident = useMemo(
    () =>
      selectedIncidentId
        ? activeIncidents.find((incident) => incident.id === selectedIncidentId) ??
          null
        : null,
    [activeIncidents, selectedIncidentId],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIncidents(readStoredIncidents(initialIncidents));
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialIncidents]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    writeStoredIncidents(incidents);
  }, [incidents, isReady]);

  function handleSelectIncident(incidentId: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("incident", incidentId);
    router.push(`${pathname}?${nextParams.toString()}`);
  }

  function handleCloseDetails() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("incident");
    router.push(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname);
  }

  useEffect(() => {
    if (!selectedIncidentId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("incident");
        router.push(
          nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIncidentId, pathname, router, searchParams]);

  useEffect(() => {
    if (!selectedIncidentId || selectedIncident) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("incident");
    router.replace(
      nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname,
    );
  }, [pathname, router, searchParams, selectedIncident, selectedIncidentId]);

  function handleDragEnd(result: DropResult) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setIncidents((currentIncidents) => {
      const archivedIncidents = currentIncidents.filter(
        (incident) => incident.archivedAt,
      );
      const activeCurrentIncidents = currentIncidents.filter(
        (incident) => !incident.archivedAt,
      );
      const grouped = groupIncidentsByStatus(activeCurrentIncidents);
      const sourceStatus = source.droppableId as IncidentStatus;
      const destinationStatus = destination.droppableId as IncidentStatus;
      const sourceItems = [...grouped[sourceStatus]];
      const destinationItems =
        sourceStatus === destinationStatus
          ? sourceItems
          : [...grouped[destinationStatus]];

      const [movedIncident] = sourceItems.splice(source.index, 1);

      if (!movedIncident) {
        return currentIncidents;
      }

      destinationItems.splice(destination.index, 0, {
        ...movedIncident,
        status: destinationStatus,
      });

      const nextGroups = {
        ...grouped,
        [sourceStatus]: sourceItems,
        [destinationStatus]: destinationItems,
      };

      return [
        ...incidentColumns.flatMap((status) => nextGroups[status]),
        ...archivedIncidents,
      ];
    });
  }

  function handleArchiveIncident() {
    if (!selectedIncident) {
      return;
    }

    setIncidents((currentIncidents) =>
      currentIncidents.map((incident) =>
        incident.id === selectedIncident.id
          ? { ...incident, archivedAt: new Date().toISOString() }
          : incident,
      ),
    );
    handleCloseDetails();
    router.push("/admin/historico");
  }

  function handleRequestRemoveIncident() {
    setIsRemoveModalOpen(true);
  }

  function handleRemoveIncident() {
    if (!selectedIncident) {
      return;
    }

    setIncidents((currentIncidents) =>
      currentIncidents.filter((incident) => incident.id !== selectedIncident.id),
    );
    setIsRemoveModalOpen(false);
    handleCloseDetails();
  }

  return (
    <section className="w-full">
      {isMounted ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto pb-6">
            <div className="mx-auto flex min-h-[calc(100vh-10rem)] min-w-full justify-center gap-5">
              {incidentColumns.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  title={statusMeta[status].label}
                  incidents={incidentsByStatus[status]}
                  onSelectIncident={handleSelectIncident}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      ) : (
        <div className="overflow-x-auto pb-6">
          <div className="mx-auto flex min-h-[calc(100vh-10rem)] min-w-full justify-center gap-5">
            {incidentColumns.map((status) => (
              <section
                key={status}
                className="flex h-[calc(100vh-10rem)] w-[24rem] shrink-0 flex-col rounded-[20px] bg-[var(--color-surface-container-low)] p-3 shadow-[var(--shadow-ambient)]"
              >
                <div className="flex items-center justify-between px-2 pb-3 pt-1">
                  <div
                    className={`inline-flex items-center gap-2 text-base font-semibold ${statusIndicatorVariants[status]}`}
                  >
                    <span className="h-4 w-4 rounded-full border-2 border-current bg-current/15" />
                    <p>{statusMeta[status].label}</p>
                  </div>
                  <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-container-highest)] px-1.5 text-xs text-[var(--color-on-surface-variant)]">
                    {incidentsByStatus[status].length}
                  </span>
                </div>

                <div className="min-h-24 flex-1 space-y-3 overflow-y-auto rounded-[16px] p-1 pr-2">
                  {incidentsByStatus[status].map((incident) => (
                    <div
                      key={incident.id}
                      className="rounded-[16px] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_1px_0_rgba(25,28,28,0.03)]"
                    >
                      <button
                        type="button"
                        className="line-clamp-2 cursor-pointer text-left text-sm font-medium leading-5 text-[var(--color-on-surface)] decoration-[var(--color-primary-strong)] underline-offset-4 transition-colors hover:text-[var(--color-primary-strong)] hover:underline"
                        onClick={() => handleSelectIncident(incident.id)}
                      >
                        {incident.title}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {selectedIncident ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 top-[61px] z-[80] hidden lg:block">
          <button
            type="button"
            aria-label="Fechar detalhes da ocorrência"
            className="pointer-events-auto absolute inset-0"
            onClick={handleCloseDetails}
          />

          <aside
            className="sheet-enter pointer-events-auto absolute bottom-0 right-0 top-0 flex w-full max-w-[40rem] flex-col rounded-bl-[20px] rounded-tl-[20px] border border-r-0 border-[rgba(25,28,28,0.08)] bg-[#f8f9f9]"
          >
            <div className="mb-[-0.75rem] flex items-center justify-end rounded-tl-[20px] px-5 pt-3 sm:px-6 sm:pt-4">
              <button
                type="button"
                aria-label="Fechar painel lateral"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)]"
                onClick={handleCloseDetails}
              >
                <IconX className="h-5 w-5" stroke={1.8} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5 pt-0 sm:px-6 sm:pb-6 sm:pt-0">
              <div className="space-y-4">
                <h2 className="pr-8 font-display text-4xl tracking-[-0.04em] text-[var(--color-on-surface)] sm:pr-10">
                  {selectedIncident.title}
                </h2>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${statusBadgeVariants[selectedIncident.status]}`}
                >
                  <span
                    className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)] bg-[rgba(249,249,248,0.22)]"
                  />
                  <span>{statusLabels[selectedIncident.status]}</span>
                </div>

                <div className="border-t border-[rgba(25,28,28,0.08)] pt-5">
                  <div className="rounded-[20px] border border-[rgba(25,28,28,0.08)] px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
                      {selectedIncident.userType === "staff" ? (
                        <IconUserCog className="h-4 w-4" stroke={1.8} />
                      ) : (
                        <IconUser className="h-4 w-4" stroke={1.8} />
                      )}
                      <p>
                        <span>Registrado por: </span>
                        <span className="font-medium text-[var(--color-primary-strong)]">
                          {selectedIncident.userType === "resident"
                            ? "Morador"
                            : "Funcionário"}
                        </span>
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                      {selectedIncident.description}
                    </p>

                    {selectedIncident.hasAttachment &&
                    selectedIncident.attachmentUrl ? (
                      <div className="mt-4 overflow-hidden rounded-[18px] border border-[rgba(25,28,28,0.08)]">
                        <Image
                          src={selectedIncident.attachmentUrl}
                          alt={selectedIncident.attachmentName ?? "Imagem anexada"}
                          width={1200}
                          height={800}
                          className="h-auto w-full object-contain"
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(25,28,28,0.08)] px-3 py-1.5 text-xs text-[var(--color-on-surface-variant)]">
                        <IconMapPin className="h-4 w-4" stroke={1.8} />
                        <span>Localização: {selectedIncident.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(25,28,28,0.08)] px-3 py-1.5 text-xs text-[var(--color-on-surface-variant)]">
                        <IconClock className="h-4 w-4" stroke={1.8} />
                        <span>Data: {selectedIncident.createdAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[24px] border border-[var(--color-danger-strong)] bg-transparent px-5 py-3 text-base font-medium text-[var(--color-danger-strong)] transition-colors hover:bg-[rgba(185,28,28,0.08)]"
                  onClick={handleRequestRemoveIncident}
                >
                  <IconTrash className="h-4.5 w-4.5" stroke={1.8} />
                  Remover ocorrência
                </button>

                {selectedIncident.status === "resolved" ? (
                  <Button type="button" onClick={handleArchiveIncident}>
                    <span className="inline-flex items-center gap-2">
                      <IconHistory className="h-4.5 w-4.5" stroke={1.8} />
                      Mover para histórico
                    </span>
                  </Button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-[rgba(81,119,127,0.12)] px-5 py-3 text-base font-medium text-[rgba(81,119,127,0.48)]"
                  >
                    <IconHistory className="h-4.5 w-4.5" stroke={1.8} />
                    Mover para histórico
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {selectedIncident ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Fechar detalhes da ocorrencia"
            className="absolute inset-0 bg-[rgba(25,28,28,0.28)] backdrop-blur-[2px]"
            onClick={handleCloseDetails}
          />

          <aside className="sheet-enter absolute inset-y-0 right-0 flex w-full max-w-[40rem] flex-col border-l border-[rgba(25,28,28,0.08)] bg-[#f8f9f9] sm:w-[40rem]">
            <div className="mb-[-0.75rem] flex items-center justify-end px-5 pt-3 sm:px-6 sm:pt-4">
              <button
                type="button"
                aria-label="Fechar painel lateral"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)]"
                onClick={handleCloseDetails}
              >
                <IconX className="h-5 w-5" stroke={1.8} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5 pt-0 sm:px-6 sm:pb-6 sm:pt-0">
              <div className="space-y-4">
                <h2 className="pr-8 font-display text-4xl tracking-[-0.04em] text-[var(--color-on-surface)] sm:pr-10">
                  {selectedIncident.title}
                </h2>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${statusBadgeVariants[selectedIncident.status]}`}
                >
                  <span
                    className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)] bg-[rgba(249,249,248,0.22)]"
                  />
                  <span>{statusLabels[selectedIncident.status]}</span>
                </div>

                <div className="border-t border-[rgba(25,28,28,0.08)] pt-5">
                  <div className="rounded-[20px] border border-[rgba(25,28,28,0.08)] px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
                      {selectedIncident.userType === "staff" ? (
                        <IconUserCog className="h-4 w-4" stroke={1.8} />
                      ) : (
                        <IconUser className="h-4 w-4" stroke={1.8} />
                      )}
                      <p>
                        <span>Registrado por: </span>
                        <span className="font-medium text-[var(--color-primary-strong)]">
                          {selectedIncident.userType === "resident"
                            ? "Morador"
                            : "Funcionário"}
                        </span>
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                      {selectedIncident.description}
                    </p>

                    {selectedIncident.hasAttachment &&
                    selectedIncident.attachmentUrl ? (
                      <div className="mt-4 overflow-hidden rounded-[18px] border border-[rgba(25,28,28,0.08)]">
                        <Image
                          src={selectedIncident.attachmentUrl}
                          alt={selectedIncident.attachmentName ?? "Imagem anexada"}
                          width={1200}
                          height={800}
                          className="h-auto w-full object-contain"
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(25,28,28,0.08)] px-3 py-1.5 text-xs text-[var(--color-on-surface-variant)]">
                        <IconMapPin className="h-4 w-4" stroke={1.8} />
                        <span>Localização: {selectedIncident.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(25,28,28,0.08)] px-3 py-1.5 text-xs text-[var(--color-on-surface-variant)]">
                        <IconClock className="h-4 w-4" stroke={1.8} />
                        <span>Data: {selectedIncident.createdAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[24px] bg-[var(--color-danger-soft)] px-5 py-3 text-base font-medium text-[var(--color-danger-strong)] transition-colors hover:bg-[rgba(185,28,28,0.18)]"
                  onClick={handleRequestRemoveIncident}
                >
                  <IconTrash className="h-4.5 w-4.5" stroke={1.8} />
                  Remover ocorrência
                </button>

                {selectedIncident.status === "resolved" ? (
                  <Button type="button" onClick={handleArchiveIncident}>
                    <span className="inline-flex items-center gap-2">
                      <IconHistory className="h-4.5 w-4.5" stroke={1.8} />
                      Mover para histórico
                    </span>
                  </Button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-[rgba(81,119,127,0.12)] px-5 py-3 text-base font-medium text-[rgba(81,119,127,0.48)]"
                  >
                    <IconHistory className="h-4.5 w-4.5" stroke={1.8} />
                    Mover para histórico
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <Modal
        isOpen={isRemoveModalOpen}
        title="Remover ocorrência?"
        description="Essa ação exclui a ocorrência do quadro e do histórico local deste navegador."
        confirmLabel="Remover"
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveIncident}
      />
    </section>
  );
}
