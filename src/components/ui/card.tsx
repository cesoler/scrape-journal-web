import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { cardVariants } from './variants'

type Props = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & { as?: 'div' | 'article' | 'section' | 'li' }

export function Card({ as: Tag = 'div', className, highlight, padding, ...props }: Props) {
  return <Tag className={cn(cardVariants({ highlight, padding }), className)} {...props} />
}
