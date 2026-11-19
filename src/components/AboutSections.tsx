import type { ReactNode } from 'react'
import { project } from '../config/project'
import { Card } from './ui/card'

const FLOW = ['Pergunta', 'Busca', 'Notícias', 'LLM', 'Resposta']

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-line pt-4">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
}

export function AboutSections() {
  return (
    <div className="mt-12 grid gap-8">
      <Section id="problema" title="Problema">
        <p>
          Encontrar informações num acervo grande de notícias exige ler muitos textos. O assistente
          recebe uma pergunta em linguagem natural, recupera as notícias mais relacionadas e usa um
          modelo de linguagem para resumir o que elas dizem, indicando as fontes de cada afirmação.
        </p>
      </Section>

      <Section id="como-funciona" title="Como funciona">
        <ol className="flex flex-wrap items-center gap-1.5">
          {FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <Card as="div" padding="sm" className="py-1 text-sm font-semibold">
                {step}
              </Card>
              {i < FLOW.length - 1 && <span className="text-muted">→</span>}
            </li>
          ))}
        </ol>
        <p>
          A pergunta é usada para buscar notícias na base. As mais relacionadas são enviadas ao LLM
          com identificadores ([N1], [N2]…), e o modelo responde usando somente esses textos.
        </p>
      </Section>

      <Section id="base" title="Base e técnicas">
        {/* TODO: preencher com dados reais (Pessoas 1 e 2) */}
        <List
          items={[
            'Notícias coletadas do globo.com: esportes, entretenimento e jornalismo.',
            'Recuperação: a definir (busca da Unidade 3).',
            'Geração: a definir (modelo e provedor).',
          ]}
        />
      </Section>

      <Section id="limitacoes" title="Limitações e uso">
        <List
          items={[
            'O assistente consulta apenas o acervo do projeto, que pode conter notícias antigas.',
            'Acontecimentos posteriores à coleta não estão na base.',
            'Se as notícias não forem suficientes, o assistente informa isso em vez de responder.',
            'Respostas geradas podem conter erros: confira sempre as fontes citadas.',
          ]}
        />
      </Section>

      <Section id="equipe" title="Equipe">
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
          {project.members.map((m) => (
            <Card as="li" key={m.name} padding="sm" className="flex flex-col">
              <strong>{m.name}</strong>
              <span className="text-sm text-muted">{m.role}</span>
            </Card>
          ))}
        </ul>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-accent hover:underline"
        >
          Repositório do projeto ↗
        </a>
      </Section>
    </div>
  )
}
