import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

const buttonClassName =
  "inline-flex cursor-pointer appearance-none items-center justify-center rounded-[24px] border-0 bg-[var(--color-primary-container)] px-5 py-3 text-base leading-none font-medium no-underline shadow-[var(--shadow-ambient)] transition-colors hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-2 focus:ring-[rgba(62,98,103,0.25)] disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  className,
  href,
  type = "button",
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(buttonClassName, className)}
        style={{
          color: "var(--color-surface)",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: 500,
        }}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cn(buttonClassName, className)}
      style={{ color: "var(--color-surface)", fontSize: "16px", fontWeight: 500 }}
      {...props}
    />
  );
}
