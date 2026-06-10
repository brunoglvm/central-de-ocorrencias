"use client";

import { Draggable } from "@hello-pangea/dnd";
import { IconClock, IconMapPin } from "@tabler/icons-react";
import type { Incident } from "@/types/incident";

type IncidentCardProps = {
  incident: Incident;
  index: number;
  onSelect: (incidentId: string) => void;
};

export function IncidentCard({ incident, index, onSelect }: IncidentCardProps) {
  return (
    <Draggable draggableId={incident.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={
            snapshot.isDragging
              ? "rounded-[16px] bg-[#f8f9f9] p-4 ring-1 ring-[rgba(25,28,28,0.05)]"
              : "rounded-[16px] bg-[#f8f9f9] p-4"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <button
                type="button"
                className="line-clamp-2 cursor-pointer text-left text-sm font-medium leading-5 text-[var(--color-on-surface)] decoration-[var(--color-primary-strong)] underline-offset-4 transition-colors hover:text-[var(--color-primary-strong)] hover:underline"
                onClick={() => onSelect(incident.id)}
              >
                {incident.title}
              </button>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--color-on-surface-variant)]">
            {incident.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
            <span className="inline-flex items-center gap-1">
              <IconMapPin className="h-4 w-4" stroke={1.8} />
              {incident.location}
            </span>
            <span className="inline-flex items-center gap-1 border-l border-[rgba(25,28,28,0.12)] pl-3">
              <IconClock className="h-4 w-4" stroke={1.8} />
              {incident.createdAt}
            </span>
          </div>
        </article>
      )}
    </Draggable>
  );
}
