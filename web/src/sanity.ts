import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId:   import.meta.env.VITE_SANITY_PROJECT_ID || 'w6flkkdn',
  dataset:     import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion:  import.meta.env.VITE_SANITY_API_VERSION || '2023-05-03',
  useCdn:      false, // 一時的にCDNを無効化
  token:       import.meta.env.VITE_SANITY_TOKEN,
  perspective: 'published',
  ignoreBrowserTokenWarning: true, // ブラウザでのトークン使用警告を無効化
});
