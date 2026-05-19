'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'
import { Button } from '@/components/ui/button'

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Button variant="ghost" size="icon" render={<Link href="/carrito" aria-label="Carrito" />}>
      <div className="relative">
        <ShoppingCart className="h-4 w-4" />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-club-secondary text-[10px] font-bold text-club-dark">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </div>
    </Button>
  )
}
