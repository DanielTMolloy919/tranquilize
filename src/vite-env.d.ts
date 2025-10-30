/// <reference types="vite/client" />
declare const APP_VERSION: string;

interface ImportMetaEnv {
  readonly VITE_USE_DEV_CONFIG?: string;
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
