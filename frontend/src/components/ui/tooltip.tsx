"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  children: ReactElement;
  content: string;
  offset?: number;
};

type TooltipPosition = {
  left: number;
  top: number;
  translateY: string;
};

export function Tooltip({
  children,
  content,
  offset = 8,
}: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const canPortal = typeof document !== "undefined";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updatePosition() {
      if (!triggerRef.current || !tooltipRef.current) {
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const shouldPlaceAbove =
        triggerRect.bottom + offset + tooltipRect.height > window.innerHeight;

      setPosition({
        left: triggerRect.left + triggerRect.width / 2,
        top: shouldPlaceAbove
          ? triggerRect.top - offset
          : triggerRect.bottom + offset,
        translateY: shouldPlaceAbove ? "-100%" : "0%",
      });
    }

    const frameId = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, offset]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex shrink-0 align-middle leading-none"
        onBlur={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {cloneElement(children, {
          "aria-describedby": isOpen ? tooltipId : undefined,
        })}
      </span>

      {canPortal && isOpen
        ? createPortal(
            <span
              id={tooltipId}
              ref={tooltipRef}
              role="tooltip"
              className="pointer-events-none fixed z-[200] rounded-full bg-[rgba(25,28,28,0.72)] px-3 py-1 text-xs whitespace-nowrap text-[var(--color-surface)] shadow-[var(--shadow-ambient)]"
              style={{
                left: position?.left ?? -9999,
                opacity: position ? 1 : 0,
                top: position?.top ?? -9999,
                transform: `translate(-50%, ${position?.translateY ?? "0%"})`,
              }}
            >
              {content}
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
