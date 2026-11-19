/**
 * Contrato entre o front e o back (Pessoa 1 + Pessoa 2).
 * Proposta inicial — ajustar quando o formato for combinado com o time.
 *
 * POST /api/ask
 *   body:     AskRequest
 *   200:      AskResponse
 *   4xx/5xx:  ApiErrorBody
 */

export type Category = 'esportes' | 'entretenimento' | 'jornalismo'

export interface AskRequest {
  question: string
  /** Quantidade de notícias a recuperar (padrão no back: 5). */
  top_k?: number
}

/** Notícia recuperada pela busca e enviada ao LLM como contexto. */
export interface Source {
  /** Identificador usado no prompt e citado na resposta, ex.: "N1". */
  ref: string
  /** Identificador da notícia na base. */
  news_id: string
  title: string
  subtitle?: string | null
  /** Trecho do texto original exibido ao usuário. */
  excerpt: string
  category: Category | string
  url?: string | null
  /** Data de publicação (ISO 8601), quando existir. */
  published_at?: string | null
  /** Pontuação de similaridade da busca. */
  score: number
  /** true se o LLM citou esta notícia na resposta. */
  cited: boolean
}

/**
 * - answered:      o modelo respondeu com base nas notícias.
 * - insufficient:  notícias encontradas, mas não sustentam uma resposta.
 * - no_results:    a busca não encontrou notícias relacionadas.
 */
export type AnswerStatus = 'answered' | 'insufficient' | 'no_results'

export interface AskResponse {
  status: AnswerStatus
  /** Texto da resposta, com citações no formato [N1][N2]. */
  answer: string
  sources: Source[]
  meta?: {
    model?: string
    retrieval_method?: string
    elapsed_ms?: number
  }
}

export interface ApiErrorBody {
  error: {
    code: 'LLM_UNAVAILABLE' | 'SEARCH_FAILED' | 'INVALID_QUESTION' | 'INTERNAL'
    message: string
  }
}
