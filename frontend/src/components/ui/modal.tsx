"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ModalProps = {
  confirmLabel?: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

export function Modal({
  confirmLabel = "Confirmar",
  description,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-[rgba(25,28,28,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="relative z-10 w-full max-w-md rounded-[32px] p-6 sm:p-7">
        <div className="space-y-3">
          <h2 className="font-display text-3xl tracking-[-0.03em] text-[var(--color-on-surface)]">
            {title}
          </h2>
          <p className="text-sm leading-7 text-[var(--color-on-surface-variant)]">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-[24px] border border-[rgba(25,28,28,0.12)] bg-transparent px-5 py-3 text-base font-medium text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container-highest)] hover:text-[var(--color-on-surface)]"
            style={{ fontSize: "16px", fontWeight: 500 }}
            onClick={onClose}
          >
            Cancelar
          </button>

          <Button type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
