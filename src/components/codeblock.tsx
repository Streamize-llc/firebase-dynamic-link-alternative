import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 다크 테마 사용

export default function CodeBlock({ children, language, filename }: { children: string, language: string, filename: string }) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const code = typeof children === 'string' 
    ? children.trim() 
    : children;

  return (
    <div className="code-block-container">
      {filename && (
        <div className="code-filename">
          <span>{filename}</span>
        </div>
      )}
      <pre>
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
      <style jsx>{`
        .code-block-container {
          margin: 1.5rem 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .code-filename {
          background-color: #343a40;
          padding: 0.5rem 1rem;
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          font-size: 0.85rem;
          color: #e9ecef;
          border-bottom: 1px solid #495057;
        }
        
        pre {
          margin: 0;
          padding: 1rem;
          background-color: #282c34;
        }
        
        code {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}