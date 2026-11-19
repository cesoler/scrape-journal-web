# scrape-journal-web

Interface web do assistente com RAG do **scrape-journal** (Unidade 4).
Pergunta → busca → notícias → LLM → resposta com fontes.

React 19 + TypeScript + Vite. Estilo com Tailwind CSS v4 + CVA (`class-variance-authority`).

## Executar

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:5173
```

Outros scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Mock x back real

Enquanto o back não existe, as respostas vêm de `src/api/mock.ts` (notícias fictícias).

| Variável | Uso |
| --- | --- |
| `VITE_USE_MOCK` | `false` chama o back real. Ausente/outro valor = mock. |
| `VITE_API_BASE_URL` | URL do back em produção. Vazio = mesma origem (`/api`). |
| `API_PROXY_TARGET` | Destino do proxy `/api` no `npm run dev` (padrão `http://localhost:3000`). |

Cenários do mock, conforme a pergunta:

- contém `erro`: falha da API (LLM indisponível);
- contém `2030`: notícias encontradas, mas insuficientes;
- nenhuma palavra conhecida (ex.: "receita de bolo"): nenhuma notícia encontrada;
- caso contrário (ex.: "contratações no futebol"): resposta com fontes.

**Chaves de API nunca ficam no front.** Toda variável `VITE_*` vai para o navegador. A chave do LLM fica só no back.

## Contrato com o back

Definido em `src/api/types.ts` (proposta, a combinar com o time).

`POST /api/ask`

```json
{ "question": "Quais notícias falam sobre contratações no futebol?", "top_k": 5 }
```

Resposta `200`:

```json
{
  "status": "answered",
  "answer": "A base registra a contratação de um atacante [N1] e a renovação de um volante [N2].",
  "sources": [
    {
      "ref": "N1",
      "news_id": "123",
      "title": "Clube anuncia contratação de atacante",
      "subtitle": "Jogador assina contrato de três anos",
      "excerpt": "O clube confirmou…",
      "category": "esportes",
      "url": "https://…",
      "published_at": "2025-10-14",
      "score": 0.82,
      "cited": true
    }
  ],
  "meta": { "model": "…", "retrieval_method": "…", "elapsed_ms": 1840 }
}
```

`status`: `answered` | `insufficient` (notícias não sustentam resposta) | `no_results` (busca vazia).

Erro (`4xx`/`5xx`):

```json
{ "error": { "code": "LLM_UNAVAILABLE", "message": "O modelo está indisponível no momento." } }
```

Códigos: `LLM_UNAVAILABLE`, `SEARCH_FAILED`, `INVALID_QUESTION`, `INTERNAL`.

## Estrutura

```
src/
  api/         contrato (types), client HTTP, mock, erros
  hooks/       useAsk: estado da consulta (idle/loading/success/error)
  components/  formulário, resposta com citações, cards de fontes, seções institucionais
    ui/        primitivos (Button, Card, Badge, Notice); variantes CVA em ui/variants.ts
  lib/cn.ts    clsx + tailwind-merge
  index.css    Tailwind + tokens de cor (@theme), com tema escuro
  config/      nome do projeto, integrantes, link do repositório, exemplos
```

Dados da equipe e link do repositório: `src/config/project.ts`.
