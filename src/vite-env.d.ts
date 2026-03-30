/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base da API REST v3 (default no código: https://api.themoviedb.org/3) */
  readonly VITE_TMDB_BASE_URL?: string
  /**
   * JWT da TMDB (API Read Access Token em Settings → API), sem prefixo `Bearer `.
   * O cliente envia `Authorization: Bearer <token>`.
   */
  readonly VITE_TMDB_CREDENTIAL_HEADER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
