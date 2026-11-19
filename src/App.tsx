import { isMockMode } from './api/client'
import { AboutSections } from './components/AboutSections'
import { AskForm } from './components/AskForm'
import { ResultPanel } from './components/ResultPanel'
import { project } from './config/project'
import { useAsk } from './hooks/useAsk'

const container = 'mx-auto max-w-3xl px-4'

export default function App() {
  const { state, submit } = useAsk()

  return (
    <>
      {isMockMode && (
        <div className="bg-warn-soft px-4 py-1.5 text-center text-sm text-warn">
          Modo demonstração: respostas simuladas com dados fictícios.
        </div>
      )}

      <header className={`${container} pt-8 pb-2`}>
        <h1 className="text-3xl font-bold max-sm:text-2xl">{project.name}</h1>
        <p className="mt-1 text-muted">{project.tagline}</p>
      </header>

      <main className={`${container} pb-12`}>
        <p className="my-4 text-muted">
          Faça uma pergunta sobre as notícias do acervo. A resposta indica quais notícias sustentam
          cada informação.
        </p>
        <AskForm
          loading={state.phase === 'loading'}
          examples={project.exampleQuestions}
          onSubmit={submit}
        />

        <ResultPanel state={state} />

        <AboutSections />
      </main>

      <footer className="border-t border-line py-5 text-sm text-muted">
        <div className={container}>
          {project.name} · Unidade 4 ·{' '}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Repositório
          </a>
        </div>
      </footer>
    </>
  )
}
