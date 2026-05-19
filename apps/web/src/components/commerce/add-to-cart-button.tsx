'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import type { CartItem } from '@/lib/cart/types'

type AddToCartButtonProps = {
  item: Omit<CartItem, 'quantity'>
  className?: string
}

export function AddToCartButton({ item, className }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={added}
      className={className || 'w-full bg-club-primary text-white hover:bg-club-primary-light'}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Anadido
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Anadir al carrito
        </>
      )}
    </Button>
  )
}
