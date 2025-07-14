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
  mainImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
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
          body[0..100],  // 抜粋
          mainImage{
            asset->{
              url
            },
            alt
          }
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Kanai Blog</h1>
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
                    <div className="flex gap-4 items-start">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-28 h-16 md:w-36 md:h-20 bg-gray-200 rounded-lg overflow-hidden">
                        {post.mainImage?.asset?.url ? (
                          <img 
                            src={post.mainImage.asset.url}
                            alt={post.mainImage.alt || post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 leading-tight">
                          {post.title}
                        </h2>
                        
                        <div className="text-sm text-gray-500">
                          <time>
                            {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                      </div>
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
          <div className="bg-gray-50 rounded-lg p-6 md:p-8">
            {/* Desktop layout: side by side */}
            <div className="hidden md:flex items-start gap-6">
              <img 
                src="https://avatars.githubusercontent.com/u/58135006?v=4" 
                alt="かないまさきのプロフィール画像"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">かないまさき</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  クリエイティブディレクター｜ウェブ制作やコンセプト提案が得意｜バイブコーディングにドハマリ中｜30代2児の父｜日本と海外の多拠点生活するのが夢
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
                </div>
              </div>
            </div>

            {/* Mobile layout: centered image, content below */}
            <div className="md:hidden">
              <div className="text-center">
                <img 
                  src="https://avatars.githubusercontent.com/u/58135006?v=4" 
                  alt="かないまさきのプロフィール画像"
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">かないまさき</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                クリエイティブディレクター｜ウェブ制作やコンセプト提案が得意｜バイブコーディングにドハマリ中｜30代2児の父｜日本と海外の多拠点生活するのが夢
              </p>
              <div className="flex justify-center">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © Masaki KANAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;