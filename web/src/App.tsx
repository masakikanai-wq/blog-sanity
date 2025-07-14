// src/App.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanity } from './sanity';

// (1) 型定義をここで追加
interface Post {
  _id:        string;
  title:      string;
  slug:       string;
  publishedAt:string;   // ISO 文字列
  body:       string[]; // 抜粋としてテキスト配列
}

export function App() {
  // (2) アプリ起動時のログ
  console.log('🚀 App component loaded');
  console.log('Environment check:', {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
    hasToken: !!import.meta.env.VITE_SANITY_TOKEN
  });

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // デバッグ用ログ
    console.log('Environment variables:', {
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
      dataset: import.meta.env.VITE_SANITY_DATASET,
      apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
      hasToken: !!import.meta.env.VITE_SANITY_TOKEN
    });

    sanity
      .fetch<Post[]>(`
        *[_type == "post"] | order(publishedAt desc){
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          body[0..100]  // 抜粋
        }
      `)
      .then((posts) => {
        console.log('Fetched posts:', posts);
        setPosts(posts);
      })
      .catch((error) => {
        console.error('Sanity fetch error:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Header */}
        <header className="py-12 border-b border-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Blog</h1>
            <p className="text-gray-600">Latest thoughts and stories</p>
          </div>
        </header>

        {/* Posts */}
        <div className="py-8">
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post._id} className="border-b border-gray-100 pb-8 last:border-b-0">
                  <Link 
                    to={`/post/${post.slug}`} 
                    className="group block"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 leading-tight">
                      {post.title}
                    </h2>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <time>
                        {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </time>
                      <span>•</span>
                      <span className="group-hover:text-blue-600 transition-colors duration-200">記事を読む</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">記事はまだありません</p>
            </div>
          )}
        </div>

        {/* Author Profile */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-start gap-6">
              <img 
                src="https://avatars.githubusercontent.com/u/58135006?v=4" 
                alt="金井 雅紀のプロフィール画像"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">金井 雅紀 (Masaki Kanai)</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Web開発者・エンジニア。PHP、Laravel、HTML/CSSなどのWeb技術を扱っています。GitHub Arctic Code Vault Contributorとして、オープンソースプロジェクトにも貢献しています。
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://x.com/kanai_biz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </a>
                  <a 
                    href="https://github.com/masakikanai-wq" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;