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
      </div>
    </div>
  );
}

export default App;