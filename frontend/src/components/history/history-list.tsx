"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconArrowUpLeft,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconMapPin,
  IconPhoto,
  IconUser,
  IconUserCog,
} from "@tabler/icons-react";
import { ImagePreviewModal } from "@/components/ui/image-preview-modal";
import type { Incident } from "@/types/incident";

type HistoryListProps = {
  currentPage: number;
  incidents: Incident[];
  onRestoreIncident: (incidentId: string) => void;
  totalItems: number;
  totalPages: number;
};

export function HistoryList({
  currentPage,
  incidents,
  onRestoreIncident,
  totalItems,
  totalPages,
}: HistoryListProps) {
  const [previewIncident, setPreviewIncident] = useState<Incident | null>(null);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <section className="rounded-[36px] bg-[var(--color-surface-container-low)] p-5 sm:p-6">
      {incidents.length ? (
        <div className="space-y-6">
          {incidents.map((incident, index) => (
            <article
              key={incident.id}
              className="grid gap-4 rounded-[28px] bg-[var(--color-surface-container-lowest)] p-5 lg:grid-cols-[auto_1fr]"
            >
              <div className="flex items-start gap-4 lg:flex-col lg:items-center">
                <div className="flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full bg-[var(--color-surface-container-highest)]" />
                  {index < incidents.length - 1 ? (
                    <span className="mt-2 h-20 w-px bg-[linear-gradient(to_bottom,rgba(225,227,226,1),rgba(225,227,226,0))]" />
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0 space-y-4">
                    <h2 className="font-display text-3xl tracking-[-0.03em] text-[var(--color-on-surface)]">
                      {incident.title}
                    </h2>

                    <p className="text-sm leading-7 text-[var(--color-on-surface-variant)]">
                      {incident.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 self-start rounded-[24px] border border-[rgba(62,98,103,0.22)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--color-primary-strong)] transition-colors hover:bg-[rgba(62,98,103,0.08)]"
                    style={{ fontSize: "12px" }}
                    onClick={() => onRestoreIncident(incident.id)}
                  >
                    <IconArrowUpLeft className="h-3.5 w-3.5" stroke={1.8} />
                    Retornar
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
                  <span className="inline-flex items-center gap-1">
                    <IconMapPin className="h-4 w-4" stroke={1.8} />
                    {incident.location}
                  </span>
                  <span className="inline-flex items-center gap-1 border-l border-[rgba(25,28,28,0.12)] pl-3">
                    <IconClock className="h-4 w-4" stroke={1.8} />
                    {incident.createdAt}
                  </span>
                  <span className="inline-flex items-center gap-1 border-l border-[rgba(25,28,28,0.12)] pl-3">
                    {incident.userType === "staff" ? (
                      <IconUserCog className="h-4 w-4" stroke={1.8} />
                    ) : (
                      <IconUser className="h-4 w-4" stroke={1.8} />
                    )}
                    <span>
                      {incident.userType === "staff" ? "Funcionário" : "Morador"}
                    </span>
                  </span>
                  {incident.hasAttachment && incident.attachmentUrl ? (
                    <button
                      type="button"
                      aria-label="Visualizar imagem anexada"
                      className="inline-flex cursor-pointer items-center gap-1 border-l border-[rgba(25,28,28,0.12)] pl-3 transition-colors hover:text-[var(--color-on-surface)]"
                      onClick={() => setPreviewIncident(incident)}
                    >
                      <IconPhoto className="h-4 w-4" stroke={1.8} />
                      <span>Imagem anexada</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] bg-[var(--color-surface-container-lowest)] px-5 py-12 text-center text-sm text-[var(--color-on-surface-variant)]">
          Nenhuma ocorrência foi enviada para o histórico ainda.
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-on-surface)]">
              Página {currentPage} de {totalPages}
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {totalItems} ocorrências no histórico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentPage > 1 ? (
              <Link
                href={`/admin/historico?page=${currentPage - 1}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border border-[rgba(25,28,28,0.08)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-highest)]"
              >
                <IconChevronLeft className="h-5 w-5" stroke={1.8} />
                Anterior
              </Link>
            ) : (
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border border-[rgba(25,28,28,0.08)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-on-surface-variant)] opacity-60">
                <IconChevronLeft className="h-5 w-5" stroke={1.8} />
                Anterior
              </span>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {visiblePages.map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`${page}-${index}`}
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-[16px] border border-[rgba(25,28,28,0.08)] bg-[var(--color-surface)] px-3 text-sm font-medium text-[var(--color-on-surface-variant)]"
                  >
                    ...
                  </span>
                ) : page === currentPage ? (
                  <span
                    key={page}
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-[16px] bg-[var(--color-primary-strong)] px-3 text-sm font-medium text-[var(--color-surface)]"
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={`/admin/historico?page=${page}`}
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-[16px] border border-[rgba(25,28,28,0.08)] bg-[var(--color-surface)] px-3 text-sm font-medium text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-highest)]"
                  >
                    {page}
                  </Link>
                ),
              )}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={`/admin/historico?page=${currentPage + 1}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border border-[rgba(25,28,28,0.08)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-highest)]"
              >
                Próxima
                <IconChevronRight className="h-5 w-5" stroke={1.8} />
              </Link>
            ) : (
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border border-[rgba(25,28,28,0.08)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-on-surface-variant)] opacity-60">
                Próxima
                <IconChevronRight className="h-5 w-5" stroke={1.8} />
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-on-surface)]">
              Página {currentPage} de {totalPages}
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {totalItems} ocorrências no histórico.
            </p>
          </div>
        </div>
      )}

      <ImagePreviewModal
        fileName={previewIncident?.attachmentName ?? "Imagem anexada"}
        imageUrl={previewIncident?.attachmentUrl ?? ""}
        isOpen={Boolean(previewIncident?.attachmentUrl)}
        onClose={() => setPreviewIncident(null)}
      />
    </section>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}
