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

        {/* Navigation */}
        <footer className="mt-16 pt-8 border-t border-gray-100">
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
