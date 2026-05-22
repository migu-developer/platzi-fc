import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ProductCardProps = {
  slug: string
  name: string
  category?: string
  image?: { url: string; alt: string }
  price?: string
}

export function ProductCard({ slug, name, category, image, price }: ProductCardProps) {
  return (
    <Link href={`/tienda/${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-10 w-10"
                aria-hidden="true"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          {category && (
            <Badge variant="secondary" className="mb-1.5 text-[10px]">
              {category}
            </Badge>
          )}
          <p className="text-sm font-medium leading-snug group-hover:text-club-primary">{name}</p>
          {price && (
            <p className="mt-1 font-(family-name:--font-heading) text-sm font-bold text-club-primary">
              {price}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
