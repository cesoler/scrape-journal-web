/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "false" desliga o mock e chama o back real. Padrão: mock ligado. */
  readonly VITE_USE_MOCK?: string
  /** URL base do back. Vazio = mesma origem (proxy do Vite em dev). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
