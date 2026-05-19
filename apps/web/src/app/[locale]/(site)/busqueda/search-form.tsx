'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

type SearchFormProps = {
  initialQuery: string
}

export function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length >= 2) {
      router.push(`/busqueda?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar noticias, jugadores, partidos..."
          className="pl-9"
          aria-label="Buscar en el sitio"
        />
      </div>
      <Button type="submit" className="bg-club-primary text-white hover:bg-club-primary-light">
        Buscar
      </Button>
    </form>
  )
}
