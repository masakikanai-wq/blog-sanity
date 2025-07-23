import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanity } from '../../sanity';
import { PortableText } from '@portabletext/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanity);

function urlFor(source: any) {
  return builder.image(source);
}

interface Post {
  _id: string;
  title: string;
  publishedAt: string;
  _updatedAt: string;
  body: any[];
  viewCount?: number;
  mainImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [localViewCount, setLocalViewCount] = useState<number>(0);

  useEffect(() => {
    if (id) {
      sanity
        .fetch<Post>(
          `*[_type == "post" && slug.current == $slug][0]{
            _id, title, publishedAt, _updatedAt, viewCount,
            body[]{
              ...,
              _type == "image" => {
                ...,
                asset->{
                  url
                }
              }
            },
            mainImage{
              asset->{
                url
              },
              alt
            }
          }`,
          { slug: id }
        )
        .then((fetchedPost) => {
          if (fetchedPost) {
            console.log('Fetched post data:', JSON.stringify(fetchedPost, null, 2));
            setPost(fetchedPost);
            
            // ローカルストレージからビューカウントを取得
            const viewKey = `post_views_${fetchedPost._id}`;
            const storedViews = parseInt(localStorage.getItem(viewKey) || '0');
            
            // 初回訪問の場合のみカウントを増やす
            const sessionKey = `post_visited_${fetchedPost._id}`;
            if (!sessionStorage.getItem(sessionKey)) {
              const newViewCount = storedViews + 1;
              localStorage.setItem(viewKey, newViewCount.toString());
              sessionStorage.setItem(sessionKey, 'true');
              setLocalViewCount(newViewCount);
              
              // Sanityへの更新も試行（トークンがあれば成功）
              incrementViewCount(fetchedPost._id);
            } else {
              setLocalViewCount(storedViews);
            }
          }
        })
        .catch(console.error);
    }
  }, [id]);

  const incrementViewCount = async (postId: string) => {
    try {
      console.log('Attempting to increment view count for post:', postId);
      const result = await sanity
        .patch(postId)
        .inc({ viewCount: 1 })
        .commit();
      console.log('View count increment result:', result);
    } catch (error: any) {
      console.error('Failed to increment view count:', error);
      console.error('Error details:', {
        message: error?.message,
        statusCode: error?.statusCode,
        details: error?.details
      });
    }
  };

  if (!post) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
          
          {/* Date info */}
          <div className="text-gray-500 text-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <div>
                <span className="font-medium">公開日：</span>
                <time>
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              {post._updatedAt !== post.publishedAt && (
                <div>
                  <span className="font-medium">更新日：</span>
                  <time>
                    {new Date(post._updatedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>{Math.max(post.viewCount || 0, localViewCount)} view{(Math.max(post.viewCount || 0, localViewCount)) !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          {post.mainImage?.asset && (
            <div className="mb-8">
              <img 
                src={urlFor(post.mainImage).width(800).url()}
                alt={post.mainImage.alt || post.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-gray max-w-none">
          <div className="text-gray-800 leading-8 space-y-6 text-justify">
            <PortableText 
              value={post.body}
              components={{
                block: {
                  normal: ({children}) => <p className="mb-6 leading-8 text-justify">{children}</p>,
                  h1: ({children}) => <h1 className="text-3xl font-bold mb-6 mt-12 leading-tight text-left">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 mt-10 leading-tight text-left">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-semibold mb-4 mt-8 leading-tight text-left">{children}</h3>,
                  blockquote: ({children}) => (
                    <blockquote className="bg-gray-50 border-l-4 border-gray-300 pl-6 pr-4 py-4 my-8 italic text-gray-700 leading-relaxed text-justify">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({children}) => <ul className="mb-6 pl-6 space-y-2 list-disc">{children}</ul>,
                },
                listItem: {
                  bullet: ({children}) => <li className="leading-8 text-justify">{children}</li>,
                },
                types: {
                  code: ({value}) => (
                    <div className="my-8">
                      <SyntaxHighlighter
                        language={value.language || 'text'}
                        style={vscDarkPlus}
                        customStyle={{
                          borderRadius: '8px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                        }}
                        showLineNumbers={true}
                        wrapLongLines={true}
                      >
                        {value.code}
                      </SyntaxHighlighter>
                    </div>
                  ),
                  image: ({value}) => {
                    console.log('Image value:', JSON.stringify(value, null, 2));
                    const imageUrl = urlFor(value).width(800).url();
                    console.log('Generated image URL:', imageUrl);
                    return (
                      <div className="my-8">
                        <img
                          src={imageUrl}
                          alt={value.alt || ''}
                          className="w-full rounded-lg shadow-sm"
                          onError={(e) => console.error('Image load error:', (e.target as HTMLImageElement).src)}
                        />
                        {value.alt && (
                          <p className="text-center text-sm text-gray-500 mt-2 italic">
                            {value.alt}
                          </p>
                        )}
                      </div>
                    );
                  },
                },
                marks: {
                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                  link: ({children, value}) => (
                    <a 
                      href={value.href} 
                      className="text-blue-600 hover:text-blue-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            ← 記事一覧に戻る
          </Link>
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
