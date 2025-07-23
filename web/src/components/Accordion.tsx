import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import imageUrlBuilder from '@sanity/image-url';
import { sanity } from '../sanity';

const builder = imageUrlBuilder(sanity);

function urlFor(source: any) {
  return builder.image(source);
}

interface AccordionProps {
  title: string;
  content: any[];
  isOpen?: boolean;
}

export function Accordion({ title, content, isOpen = false }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={toggleAccordion}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="prose prose-sm max-w-none">
            <PortableText
              value={content}
              components={{
                block: {
                  normal: ({children}) => <p className="mb-4 leading-7 text-justify">{children}</p>,
                  h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-8 leading-tight text-left">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-semibold mb-3 mt-6 leading-tight text-left">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-semibold mb-3 mt-6 leading-tight text-left">{children}</h3>,
                  blockquote: ({children}) => (
                    <blockquote className="bg-gray-50 border-l-4 border-gray-300 pl-4 pr-3 py-3 my-6 italic text-gray-700 leading-relaxed text-justify text-sm">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({children}) => <ul className="mb-4 pl-5 space-y-1 list-disc">{children}</ul>,
                },
                listItem: {
                  bullet: ({children}) => <li className="leading-7 text-justify text-sm">{children}</li>,
                },
                types: {
                  code: ({value}) => (
                    <div className="my-6">
                      <SyntaxHighlighter
                        language={value.language || 'text'}
                        style={vscDarkPlus}
                        customStyle={{
                          borderRadius: '6px',
                          fontSize: '13px',
                          lineHeight: '1.4',
                        }}
                        showLineNumbers={true}
                        wrapLongLines={true}
                      >
                        {value.code}
                      </SyntaxHighlighter>
                    </div>
                  ),
                  image: ({value}) => {
                    const imageUrl = urlFor(value).width(600).url();
                    return (
                      <div className="my-6">
                        <img
                          src={imageUrl}
                          alt={value.alt || ''}
                          className="w-full rounded-md shadow-sm"
                        />
                        {value.alt && (
                          <p className="text-center text-xs text-gray-500 mt-2 italic">
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
        </div>
      </div>
    </div>
  );
}