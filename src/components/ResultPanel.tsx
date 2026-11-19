import type { AskState } from '../hooks/useAsk'
import { AnswerText } from './AnswerText'
import { SourceCard } from './SourceCard'
import { Card } from './ui/card'
import { Notice, Spinner } from './ui/notice'

const STATUS_NOTICE = {
  insufficient: 'As notícias encontradas não são suficientes para responder com segurança.',
  no_results: 'Nenhuma notícia relacionada foi encontrada no acervo.',
} as const

export function ResultPanel({ state }: { state: AskState }) {
  if (state.phase === 'idle') return null

  return (
    <section className="mt-6" aria-live="polite" aria-busy={state.phase === 'loading'}>
      <p className="mb-3 text-muted">
        <span className="font-semibold">Pergunta:</span> {state.question}
      </p>

      {state.phase === 'loading' && (
        <Notice tone="info" role="status">
          <Spinner />
          Buscando notícias no acervo e gerando a resposta…
        </Notice>
      )}

      {state.phase === 'error' && (
        <Notice tone="danger" role="alert">
          <strong>Não foi possível responder.</strong> {state.message}
        </Notice>
      )}

      {state.phase === 'success' && (
        <>
          {state.data.status !== 'answered' && (
            <Notice tone="warn">{STATUS_NOTICE[state.data.status]}</Notice>
          )}

          <Card padding="lg">
            <h2 className="mb-2 text-lg font-semibold">Resposta</h2>
            <AnswerText
              text={state.data.answer}
              validRefs={new Set(state.data.sources.map((s) => s.ref))}
            />
            <p className="mt-3 text-xs text-muted">
              Resposta gerada a partir do acervo do projeto, que pode conter notícias antigas. Confira
              as fontes abaixo.
            </p>
          </Card>

          {state.data.sources.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold">
                Notícias utilizadas ({state.data.sources.length})
              </h2>
              <div className="grid gap-3">
                {state.data.sources.map((s) => (
                  <SourceCard key={s.ref} source={s} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
