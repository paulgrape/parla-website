import {cn} from '@/lib/utils'
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

export function Markdown({children, className}: MarkdownProps) {
  return (
    <div className={cn('prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({children: c}) => <h2 className='text-foreground mt-6 mb-2 text-lg font-black first:mt-0'>{c}</h2>,
          h3: ({children: c}) => <h3 className='text-foreground mt-4 mb-2 text-base font-bold'>{c}</h3>,
          p: ({children: c}) => <p className='text-muted-foreground mb-3 text-sm leading-relaxed last:mb-0'>{c}</p>,
          ul: ({children: c}) => <ul className='text-muted-foreground mb-3 list-disc space-y-1 pl-5 text-sm'>{c}</ul>,
          ol: ({children: c}) => (
            <ol className='text-muted-foreground mb-3 list-decimal space-y-1 pl-5 text-sm'>{c}</ol>
          ),
          li: ({children: c}) => <li className='leading-relaxed'>{c}</li>,
          strong: ({children: c}) => <strong className='text-foreground font-bold'>{c}</strong>,
          em: ({children: c}) => <em className='text-foreground italic'>{c}</em>,
          code: ({children: c}) => (
            <code className='bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm'>{c}</code>
          ),
          a: ({href, children: c}) => {
            const safe = safeHref(href)
            if (!safe) return <>{c}</>
            const external = /^https?:/i.test(safe)
            return (
              <a
                href={safe}
                className='text-primary font-medium underline underline-offset-2'
                {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
              >
                {c}
              </a>
            )
          }
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
