import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'rounded-lg bg-accent text-accent-fg hover:opacity-90',
        chip: 'rounded-full border border-line bg-bg text-left text-fg hover:border-accent',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-5 py-2.5 text-base font-semibold',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export const noticeVariants = cva('mb-4 rounded-xl px-4 py-3', {
  variants: {
    tone: {
      info: 'flex items-center gap-3 border border-line bg-surface text-muted',
      warn: 'bg-warn-soft text-warn',
      danger: 'bg-danger-soft text-danger',
    },
  },
  defaultVariants: { tone: 'info' },
})

export const badgeVariants = cva('inline-block rounded px-1.5 text-xs', {
  variants: {
    variant: {
      tag: 'border border-line bg-bg capitalize text-muted',
      citation: 'mx-0.5 align-[1px] font-semibold no-underline bg-accent-soft text-accent',
      invalid: 'mx-0.5 align-[1px] font-semibold bg-danger-soft text-danger',
    },
  },
  defaultVariants: { variant: 'tag' },
})

export const cardVariants = cva('rounded-xl border bg-surface', {
  variants: {
    highlight: {
      true: 'border-accent',
      false: 'border-line',
    },
    padding: {
      sm: 'px-3 py-2.5',
      md: 'px-4 py-3.5',
      lg: 'px-5 py-4',
    },
  },
  defaultVariants: { highlight: false, padding: 'md' },
})
