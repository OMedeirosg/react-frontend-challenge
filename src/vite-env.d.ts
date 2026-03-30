/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base da API REST v3 (default no código: https://api.themoviedb.org/3) */
  readonly VITE_TMDB_BASE_URL?: string
  /** JWT “API Read Access Token” da TMDB (sem prefixo Bearer) */
  readonly VITE_TMDB_READ_ACCESS_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
