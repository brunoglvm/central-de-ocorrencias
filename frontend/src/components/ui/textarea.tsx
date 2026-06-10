import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, error, id, label, ...props }, ref) {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="block space-y-2" htmlFor={textareaId}>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          {label}
        </span>
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "min-h-40 w-full resize-none rounded-[16px] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm leading-7 text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-on-surface-variant)] focus:ring-2 focus:ring-[rgba(62,98,103,0.2)]",
            error && "ring-2 ring-[rgba(185,28,28,0.18)]",
            className,
          )}
          {...props}
        />

        {error ? (
          <p className="text-sm text-[var(--color-danger-strong)]">{error}</p>
        ) : null}
      </label>
    );
  },
);
