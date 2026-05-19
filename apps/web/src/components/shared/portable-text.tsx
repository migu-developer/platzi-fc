import { PortableText as PortableTextReact, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-(family-name:--font-heading) mt-8 mb-4 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-(family-name:--font-heading) mt-8 mb-3 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-(family-name:--font-heading) mt-6 mb-2 text-xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-(family-name:--font-heading) mt-4 mb-2 text-lg font-semibold">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-club-secondary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-club-primary underline underline-offset-2 hover:text-club-primary-light"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="rounded-card"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export type PortableTextValue = Parameters<typeof PortableTextReact>[0]['value']

type PortableTextProps = {
  // Accept unknown[] from Sanity fetch results and cast internally
  value: PortableTextValue | unknown[] | null
  className?: string
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null
  return (
    <div className={className}>
      <PortableTextReact value={value as PortableTextValue} components={components} />
    </div>
  )
}
