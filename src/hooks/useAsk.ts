import { useCallback, useRef, useState } from 'react'
import { ApiError, ask } from '../api/client'
import type { AskResponse } from '../api/types'

export type AskState =
  | { phase: 'idle' }
  | { phase: 'loading'; question: string }
  | { phase: 'success'; question: string; data: AskResponse }
  | { phase: 'error'; question: string; message: string }

export function useAsk() {
  const [state, setState] = useState<AskState>({ phase: 'idle' })
  const controllerRef = useRef<AbortController | null>(null)

  const submit = useCallback(async (question: string) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setState({ phase: 'loading', question })
    try {
      const data = await ask({ question, top_k: 5 }, controller.signal)
      setState({ phase: 'success', question, data })
    } catch (err) {
      if (controller.signal.aborted) return
      const message =
        err instanceof ApiError
          ? err.message
          : 'Algo deu errado ao consultar o acervo. Tente novamente em instantes.'
      setState({ phase: 'error', question, message })
    }
  }, [])

  return { state, submit }
}
