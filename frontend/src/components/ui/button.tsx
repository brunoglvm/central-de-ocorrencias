import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: ButtonVariant
}

const baseClassName =
  'inline-flex cursor-pointer appearance-none items-center justify-center no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary-hover/25 disabled:cursor-not-allowed disabled:opacity-60'

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    'rounded-[1.5rem] border-0 bg-primary px-5 py-3 text-base leading-none font-medium text-foreground-inverse shadow-ambient hover:bg-primary-hover',
  outline:
    'gap-1.5 self-start rounded-3xl border border-primary/20 bg-transparent px-3 py-1.5 text-xs font-medium text-primary-hover hover:bg-surface-container-highest',
}

export function Button({ className, href, type = 'button', variant = 'primary', ...props }: ButtonProps) {
  const classNameValue = cn(baseClassName, variantClassName[variant], className)
  const style = variant === 'primary' ? { color: 'var(--color-foreground-inverse)', fontSize: '16px', fontWeight: 500 } : undefined

  if (href) {
    return (
      <Link href={href} className={classNameValue} style={style}>
        {props.children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classNameValue}
      style={style}
      {...props}
    />
  )
}