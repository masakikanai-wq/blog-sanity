import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanity } from '../../sanity';
import { PortableText } from '@portabletext/react';

interface Post {
  _id: string;
  title: string;
  publishedAt: string;
  body: any[];
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      sanity
        .fetch<Post>(
          `*[_type == "post" && slug.current == $slug][0]{
            _id, title, publishedAt, body
          }`,
          { slug: id }
        )
        .then(setPost)
        .catch(console.error);
    }
  }, [id]);

  if (!post) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
          <time className="text-gray-500 text-sm">
            {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </time>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-gray max-w-none">
          <div className="text-gray-800 leading-8 space-y-6">
            <PortableText 
              value={post.body}
              components={{
                block: {
                  normal: ({children}) => <p className="mb-6 leading-8">{children}</p>,
                  h1: ({children}) => <h1 className="text-3xl font-bold mb-6 mt-12 leading-tight">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 mt-10 leading-tight">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-semibold mb-4 mt-8 leading-tight">{children}</h3>,
                }
              }}
            />
          </div>
        </article>

        {/* Author Info */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://avatars.githubusercontent.com/u/58135006?v=4" 
                alt="金井 雅紀のプロフィール画像"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">金井 雅紀 (Masaki Kanai)</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Web開発者・エンジニア。PHP、Laravel、HTML/CSSなどのWeb技術を扱っています。GitHub Arctic Code Vault Contributorとして、オープンソースプロジェクトにも貢献しています。
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://x.com/kanai_biz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
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
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
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

        {/* Navigation */}
        <footer className="mt-8 pt-8 border-t border-gray-100">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            ← 記事一覧に戻る
          </Link>
        </footer>
      </div>
    </div>
  );
}
