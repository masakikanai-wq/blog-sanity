import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId:   import.meta.env.VITE_SANITY_PROJECT_ID || 'w6flkkdn',
  dataset:     import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion:  import.meta.env.VITE_SANITY_API_VERSION || '2023-05-03',
  useCdn:      true, // CDNを再度有効にしてパフォーマンス向上
  token:       import.meta.env.VITE_SANITY_TOKEN,
  perspective: 'published', // 公開済みコンテンツのみ
});
