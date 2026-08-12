import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
}

const buttonClassName =
  'inline-flex cursor-pointer appearance-none items-center justify-center rounded-[1.5rem] border-0 bg-primary px-5 py-3 text-base leading-none font-medium no-underline shadow-ambient transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-[rgba(62,98,103,0.25)] disabled:cursor-not-allowed disabled:opacity-60'

export function Button({ className, href, type = 'button', ...props }: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(buttonClassName, className)}
        style={{
          color: 'var(--color-foreground-inverse)',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        {props.children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={cn(buttonClassName, className)}
      style={{ color: 'var(--color-foreground-inverse)', fontSize: '16px', fontWeight: 500 }}
      {...props}
    />
  )
}
