import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { noticeVariants } from './variants'

type Props = HTMLAttributes<HTMLDivElement> & VariantProps<typeof noticeVariants>

export function Notice({ className, tone, ...props }: Props) {
  return <div className={cn(noticeVariants({ tone }), className)} {...props} />
}

export function Spinner() {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent"
    />
  )
}
