import { ApiError } from './errors'
import type { AskRequest, AskResponse, Source } from './types'

/**
 * Mock do back enquanto busca (Pessoa 1) e LLM (Pessoa 2) não estão prontos.
 * Notícias FICTÍCIAS, só para desenvolver a interface.
 *
 * Cenários (pela pergunta digitada):
 *   - contém "erro"          -> falha da API (LLM indisponível)
 *   - contém "2030"          -> notícias encontradas, mas insuficientes
 *   - sem palavra conhecida  -> nenhuma notícia encontrada
 *   - caso contrário         -> resposta com fontes
 */

type MockNews = Omit<Source, 'ref' | 'score' | 'cited'> & { keywords: string[] }

const NEWS: MockNews[] = [
  {
    news_id: 'mock-001',
    title: 'Clube anuncia contratação de atacante para a próxima temporada',
    subtitle: 'Jogador assina contrato de três anos',
    excerpt:
      'O clube confirmou nesta segunda-feira a contratação do atacante, que chega após boa temporada no exterior. O contrato vai até o fim de 2028.',
    category: 'esportes',
    url: 'https://example.com/noticia/mock-001',
    published_at: '2025-10-14',
    keywords: ['futebol', 'contratação', 'contratações', 'atacante', 'clube', 'jogador'],
  },
  {
    news_id: 'mock-002',
    title: 'Volante renova contrato e fica até 2027',
    subtitle: null,
    excerpt:
      'Após semanas de negociação, o volante renovou o vínculo com o clube. A diretoria considera a permanência peça-chave para o elenco.',
    category: 'esportes',
    url: 'https://example.com/noticia/mock-002',
    published_at: '2025-10-20',
    keywords: ['futebol', 'renovação', 'contrato', 'volante', 'jogador', 'contratações'],
  },
  {
    news_id: 'mock-003',
    title: 'Seleção brasileira é convocada para as eliminatórias',
    subtitle: 'Técnico chama três estreantes',
    excerpt:
      'A lista de convocados para os próximos jogos das eliminatórias inclui três jogadores que nunca atuaram pela seleção principal.',
    category: 'esportes',
    url: 'https://example.com/noticia/mock-003',
    published_at: '2025-09-30',
    keywords: ['seleção', 'brasileira', 'convocação', 'eliminatórias', 'futebol', 'copa'],
  },
  {
    news_id: 'mock-004',
    title: 'Governo apresenta pacote de medidas econômicas',
    subtitle: 'Proposta inclui mudanças na tributação',
    excerpt:
      'O pacote anunciado pelo governo prevê ajustes na tributação e corte de gastos. As medidas ainda precisam passar pelo Congresso.',
    category: 'jornalismo',
    url: null,
    published_at: '2025-11-02',
    keywords: ['governo', 'economia', 'econômicas', 'medidas', 'tributação', 'impostos'],
  },
  {
    news_id: 'mock-005',
    title: 'Série nacional estreia com recorde de audiência',
    subtitle: null,
    excerpt:
      'O primeiro episódio da série foi o mais assistido da plataforma no ano. A segunda temporada já está confirmada.',
    category: 'entretenimento',
    url: 'https://example.com/noticia/mock-005',
    published_at: '2025-08-11',
    keywords: ['série', 'audiência', 'estreia', 'novela', 'tv', 'streaming'],
  },
]

const ANSWERS: Record<string, string> = {
  'mock-001':
    'A base registra a contratação de um atacante com contrato até 2028 [N1].',
  'mock-002': 'Também há notícia sobre a renovação de um volante até 2027 [N2].',
  'mock-003':
    'Segundo o acervo, a seleção brasileira foi convocada para as eliminatórias com três estreantes [N1].',
  'mock-004':
    'O acervo traz o anúncio de um pacote de medidas econômicas com ajustes na tributação e corte de gastos, ainda pendente de aprovação no Congresso [N1].',
  'mock-005':
    'A base informa que uma série nacional estreou com recorde de audiência e terá segunda temporada [N1].',
}

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function search(question: string, topK: number): Source[] {
  const q = normalize(question)
  return NEWS.map((n) => {
    const hits = n.keywords.filter((k) => q.includes(normalize(k))).length
    return { n, score: hits / n.keywords.length }
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ n, score }, i) => {
      const { keywords: _keywords, ...rest } = n
      return { ...rest, ref: `N${i + 1}`, score: Number(score.toFixed(3)), cited: false }
    })
}

export async function mockAsk(req: AskRequest, signal?: AbortSignal): Promise<AskResponse> {
  const started = performance.now()
  await delay(1200 + Math.random() * 1200, signal)

  const q = normalize(req.question)

  if (q.includes('erro')) {
    throw new ApiError('LLM_UNAVAILABLE', 'O modelo de linguagem está indisponível no momento.')
  }

  const sources = search(req.question, req.top_k ?? 5)
  const meta = {
    model: 'mock',
    retrieval_method: 'mock-keywords',
    elapsed_ms: Math.round(performance.now() - started),
  }

  if (sources.length === 0) {
    return {
      status: 'no_results',
      answer: 'Não encontrei notícias no acervo relacionadas a essa pergunta.',
      sources: [],
      meta,
    }
  }

  if (q.includes('2030')) {
    return {
      status: 'insufficient',
      answer:
        'As notícias recuperadas tratam do tema, mas não trazem informações sobre o período perguntado. O acervo pode não conter acontecimentos posteriores à coleta.',
      sources,
      meta,
    }
  }

  // Cita até duas fontes, renumerando a referência de cada resposta.
  const cited = sources.slice(0, 2)
  const answer = cited
    .map((s) => ANSWERS[s.news_id].replace(/\[N\d+\]/, `[${s.ref}]`))
    .join(' ')
    .concat(' Os textos recuperados não permitem afirmar desdobramentos posteriores à publicação.')

  return {
    status: 'answered',
    answer,
    sources: sources.map((s) => ({ ...s, cited: cited.includes(s) })),
    meta,
  }
}
