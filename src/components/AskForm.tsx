import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface Props {
  loading: boolean
  examples: string[]
  onSubmit: (question: string) => void
}

const MAX_LENGTH = 500

export function AskForm({ loading, examples, onSubmit }: Props) {
  const [question, setQuestion] = useState('')
  const trimmed = question.trim()

  function send(q: string) {
    if (!q.trim() || loading) return
    onSubmit(q.trim())
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send(question)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(question)
    }
  }

  return (
    <Card padding="sm" className="focus-within:border-accent">
      <form onSubmit={handleSubmit}>
        <label htmlFor="question" className="sr-only">
          Sua pergunta
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre as notícias do acervo…"
          maxLength={MAX_LENGTH}
          rows={3}
          disabled={loading}
          className="min-h-18 w-full resize-y bg-transparent text-base outline-none placeholder:text-muted"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted">
            {question.length}/{MAX_LENGTH}
          </span>
          <Button type="submit" disabled={!trimmed || loading} className="max-sm:flex-1">
            {loading ? 'Consultando…' : 'Consultar'}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3 text-sm text-muted">
          <span>Exemplos:</span>
          {examples.map((ex) => (
            <Button
              key={ex}
              variant="chip"
              size="sm"
              disabled={loading}
              onClick={() => {
                setQuestion(ex)
                send(ex)
              }}
            >
              {ex}
            </Button>
          ))}
        </div>
      </form>
    </Card>
  )
}
