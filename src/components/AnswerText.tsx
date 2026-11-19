import type { ReactNode } from 'react'
import { Badge } from './ui/badge'
import { badgeVariants } from './ui/variants'

interface Props {
  text: string
  /** Refs existentes nas fontes (ex.: N1, N2). Citações fora dessa lista não viram link. */
  validRefs: Set<string>
}

/** Renderiza a resposta transformando [N1] em link para o card da fonte. */
export function AnswerText({ text, validRefs }: Props) {
  const parts: ReactNode[] = []
  const re = /\[(N\d+)\]/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const ref = match[1]
    parts.push(
      validRefs.has(ref) ? (
        <a key={match.index} href={`#fonte-${ref}`} className={badgeVariants({ variant: 'citation' })}>
          {ref}
        </a>
      ) : (
        <Badge key={match.index} variant="invalid" title="Fonte não encontrada">
          {ref}
        </Badge>
      ),
    )
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))

  return <p className="text-[1.05rem] leading-relaxed">{parts}</p>
}
