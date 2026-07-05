import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownProps {
  children: string
  className?: string
}

function safeHref(href: string | undefined): string | undefined {
  if (!href) return undefined
  const trimmed = href.trim()
  if (/^(https?:|mailto:|\/|#)/i.test(trimmed)) return trimmed
  return undefined
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn('prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children: c }) => (
            <h2 className='mt-6 mb-2 text-lg font-black text-foreground first:mt-0'>
              {c}
            </h2>
          ),
          h3: ({ children: c }) => (
            <h3 className='mt-4 mb-2 text-base font-bold text-foreground'>
              {c}
            </h3>
          ),
          p: ({ children: c }) => (
            <p className='mb-3 text-sm leading-relaxed text-muted-foreground last:mb-0'>
              {c}
            </p>
          ),
          ul: ({ children: c }) => (
            <ul className='mb-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
              {c}
            </ul>
          ),
          ol: ({ children: c }) => (
            <ol className='mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground'>
              {c}
            </ol>
          ),
          li: ({ children: c }) => <li className='leading-relaxed'>{c}</li>,
          strong: ({ children: c }) => (
            <strong className='font-bold text-foreground'>{c}</strong>
          ),
          em: ({ children: c }) => (
            <em className='italic text-foreground'>{c}</em>
          ),
          code: ({ children: c }) => (
            <code className='rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground'>
              {c}
            </code>
          ),
          a: ({ href, children: c }) => {
            const safe = safeHref(href)
            if (!safe) return <>{c}</>
            const external = /^https?:/i.test(safe)
            return (
              <a
                href={safe}
                className='font-medium text-primary underline underline-offset-2'
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {c}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
