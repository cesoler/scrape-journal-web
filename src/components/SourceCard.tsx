import type { Source } from '../api/types'
import { Badge } from './ui/badge'
import { Card } from './ui/card'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'UTC' })

function formatDate(iso?: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : dateFormatter.format(d)
}

export function SourceCard({ source }: { source: Source }) {
  const date = formatDate(source.published_at)

  return (
    <Card
      as="article"
      id={`fonte-${source.ref}`}
      highlight={source.cited}
      className="scroll-mt-4 target:ring-4 target:ring-accent-soft"
    >
      <header className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="font-bold text-accent">{source.ref}</span>
        <Badge>{source.category}</Badge>
        {date && <time dateTime={source.published_at ?? undefined}>{date}</time>}
        <span className="ml-auto" title="Similaridade com a pergunta">
          {(source.score * 100).toFixed(0)}%
        </span>
      </header>
      <h3 className="mt-2 font-semibold leading-snug">{source.title}</h3>
      {source.subtitle && <p className="text-sm text-muted">{source.subtitle}</p>}
      <p className="my-2 text-sm">{source.excerpt}</p>
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:underline"
        >
          Abrir notícia ↗
        </a>
      ) : (
        <span className="text-sm text-muted">Link indisponível</span>
      )}
    </Card>
  )
}
