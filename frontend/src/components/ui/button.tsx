import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'danger'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: ButtonVariant
}

const baseClassName =
  'inline-flex cursor-pointer appearance-none items-center justify-center no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    'rounded-[1.5rem] border-0 bg-primary px-5 py-3 text-base leading-none font-medium text-foreground-inverse shadow-ambient hover:bg-primary-hover',
  outline:
    'gap-1.5 self-start rounded-3xl border border-primary/20 bg-transparent px-3 py-1.5 text-xs font-medium text-primary-hover hover:bg-surface-container-highest',
  secondary:
    'rounded-3xl border border-foreground/12 bg-transparent px-5 py-3 text-base leading-none font-medium text-foreground-muted hover:bg-surface-container-highest hover:text-foreground',
  danger:
    'rounded-3xl border border-danger-strong bg-transparent px-5 py-3 text-base leading-none font-medium text-danger-strong hover:bg-danger-strong/8',
}

export function Button({ className, href, type = 'button', variant = 'primary', ...props }: ButtonProps) {
  const classNameValue = cn(baseClassName, variantClassName[variant], className)

  if (href) {
    return (
      <Link href={href} className={classNameValue}>
        {props.children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classNameValue}
      {...props}
    />
  )
}