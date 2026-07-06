import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('sql', sql)

export default function CodeBlock({ code, language = 'python' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative rounded-lg border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center justify-between bg-[var(--color-bg-soft)] px-3 py-1.5 border-b border-[var(--color-border)]">
        <span className="text-xs font-mono text-[var(--color-text-dim)]">{language}</span>
        <button
          onClick={onCopy}
          className="text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: '1rem', fontSize: '0.83rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
